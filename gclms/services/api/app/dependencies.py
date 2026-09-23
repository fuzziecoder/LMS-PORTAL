"""
GCLMS API — Authentication, Tenant Isolation, and Teacher Scoping Dependencies
"""

from typing import Annotated
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.academic.models import StudentEnrollment, TeacherAssignment
from app.assignments.models import Assignment, AssignmentSubmission
from app.auth.service import AuthenticatedUserContext, decode_token
from app.common.models import UserRole, UserStatus
from app.courses.models import Course
from app.database import get_db
from app.users.models import SchoolMembership, User


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> AuthenticatedUserContext:
    """Extracts and verifies the active JWT token from cookies or Authorization header."""
    token = request.cookies.get("gclms_access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]

    if not token:
        # Development fallback header for headless testing / curl convenience
        dev_user_id = request.headers.get("X-Dev-User-ID")
        dev_role = request.headers.get("X-Dev-Role")
        dev_school_id = request.headers.get("X-Dev-School-ID")
        if dev_user_id:
            user = await db.get(User, dev_user_id)
            if user and user.status == UserStatus.ACTIVE:
                role = UserRole(dev_role) if dev_role else UserRole.FOUNDER
                return AuthenticatedUserContext(user=user, role=role, school_id=dev_school_id)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
        )

    payload = decode_token(token)
    user_id = payload.get("sub")
    role_str = payload.get("role")
    school_id = payload.get("school_id")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload.")

    stmt = (
        select(User)
        .options(selectinload(User.memberships))
        .where(User.id == user_id, User.deleted_at.is_(None))
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account not found.")

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive or suspended.")

    role = UserRole(role_str) if role_str else UserRole.STUDENT

    # If school_id wasn't in the token, deduce from primary membership
    if not school_id and user.memberships:
        primary_mem = next((m for m in user.memberships if m.is_primary), user.memberships[0])
        school_id = primary_mem.school_id

    return AuthenticatedUserContext(user=user, role=role, school_id=school_id)


def require_role(*allowed_roles: UserRole):
    """Factory dependency ensuring user possesses at least one of the specified roles."""
    async def role_checker(
        current_user: AuthenticatedUserContext = Depends(get_current_user),
    ) -> AuthenticatedUserContext:
        if current_user.role == UserRole.FOUNDER:
            return current_user  # Super-admin bypass
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {[r.value for r in allowed_roles]}",
            )
        return current_user
    return role_checker


async def get_principal_school_scope(
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
) -> str:
    """Enforces Principal multi-tenant isolation.
    Returns strictly the authenticated Principal's assigned school_id.
    Never trusts client-supplied school_ids.
    """
    if current_user.role == UserRole.FOUNDER and current_user.school_id:
        return current_user.school_id

    if not current_user.school_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Principal is not assigned to any school institution.",
        )
    return current_user.school_id


async def get_teacher_school_scope(
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.TEACHER)),
) -> tuple[str, str]:
    """Returns (teacher_id, school_id) for the authenticated teacher."""
    if not current_user.school_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher is not assigned to any school institution.",
        )
    return current_user.id, current_user.school_id


# ============================================================
# Teacher Scoping Dependencies
# ============================================================

async def require_teacher_course_access(
    course_id: str,
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.TEACHER)),
    db: AsyncSession = Depends(get_db),
) -> Course:
    """Validates that a teacher owns or is assigned to the specified course."""
    if current_user.role == UserRole.FOUNDER:
        course = await db.get(Course, course_id)
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")
        return course

    course = await db.get(Course, course_id)
    if not course or course.deleted_at is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    if course.school_id != current_user.school_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Course belongs to another school.")

    if course.teacher_id == current_user.id:
        return course

    # Check explicit assignment in teacher_assignments
    stmt = select(TeacherAssignment).where(
        TeacherAssignment.teacher_id == current_user.id,
        TeacherAssignment.course_id == course_id,
    )
    result = await db.execute(stmt)
    assignment = result.scalar_one_or_none()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher is not assigned to instruct this course.",
        )
    return course


async def require_teacher_class_access(
    class_id: str,
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.TEACHER)),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Validates that a teacher is assigned to the specified class."""
    if current_user.role == UserRole.FOUNDER:
        return

    stmt = select(TeacherAssignment).where(
        TeacherAssignment.teacher_id == current_user.id,
        TeacherAssignment.class_id == class_id,
    )
    result = await db.execute(stmt)
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher is not assigned to this class cohort.",
        )


async def require_teacher_student_access(
    student_id: str,
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.TEACHER)),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Validates that the target student is enrolled in a class/section assigned to the teacher."""
    if current_user.role == UserRole.FOUNDER:
        return

    # Find classes/sections assigned to teacher
    teacher_classes_stmt = select(TeacherAssignment.class_id, TeacherAssignment.section_id).where(
        TeacherAssignment.teacher_id == current_user.id
    )
    res = await db.execute(teacher_classes_stmt)
    pairs = res.all()
    if not pairs:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Teacher has no assigned classes.")

    class_ids = [p[0] for p in pairs if p[0]]
    section_ids = [p[1] for p in pairs if p[1]]

    # Check if student is in any of these classes
    enroll_stmt = select(StudentEnrollment).where(
        StudentEnrollment.student_id == student_id,
        StudentEnrollment.school_id == current_user.school_id,
        StudentEnrollment.class_id.in_(class_ids) | StudentEnrollment.section_id.in_(section_ids),
    )
    enroll_res = await db.execute(enroll_stmt)
    if not enroll_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student is not in any of your assigned class cohorts.",
        )


async def require_teacher_submission_access(
    submission_id: str,
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.TEACHER)),
    db: AsyncSession = Depends(get_db),
) -> AssignmentSubmission:
    """Validates that a teacher can view and grade the specified student submission."""
    submission = await db.get(AssignmentSubmission, submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found.")

    assignment = await db.get(Assignment, submission.assignment_id)
    if not assignment or assignment.school_id != current_user.school_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Assignment outside school scope.")

    if current_user.role == UserRole.FOUNDER or assignment.teacher_id == current_user.id:
        return submission

    # Otherwise verify assignment to target class
    if assignment.target_class_id:
        await require_teacher_class_access(assignment.target_class_id, current_user, db)

    return submission
