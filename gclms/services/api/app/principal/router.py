"""
GCLMS API — Principal Portal Endpoints
Provides full administrative management scoped strictly to the Principal's authenticated school.
"""

import csv
import io
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.academic.models import AcademicYear, Class, Section, StudentEnrollment, Subject, TeacherAssignment
from app.academic.schemas import (
    AcademicYearCreate,
    AcademicYearResponse,
    AcademicYearUpdate,
    ClassCreate,
    ClassResponse,
    ClassUpdate,
    SectionCreate,
    SectionResponse,
    SectionUpdate,
    StudentEnrollmentCreate,
    StudentEnrollmentResponse,
    SubjectCreate,
    SubjectResponse,
    SubjectUpdate,
    TeacherAssignmentCreate,
    TeacherAssignmentResponse,
)
from app.announcements.models import Announcement
from app.announcements.schemas import AnnouncementCreate, AnnouncementResponse, AnnouncementUpdate
from app.assignments.models import Assignment, AssignmentSubmission
from app.attendance.models import AttendanceRecord, AttendanceSession
from app.attendance.schemas import AttendanceSummaryRow
from app.audit.service import log_action
from app.auth.service import AuthenticatedUserContext, hash_password
from app.common.models import (
    AnnouncementStatus,
    AttendanceSessionStatus,
    AttendanceStatus,
    CourseStatus,
    ProjectApprovalStatus,
    SubmissionStatus,
    UserRole,
    UserStatus,
)
from app.courses.models import Course, CourseEnrollment, CourseModule, Lesson, LessonProgress
from app.courses.schemas import CourseCreate, CourseResponse, CourseUpdate
from app.database import get_db
from app.dependencies import get_current_user, get_principal_school_scope, require_role
from app.grades.models import GradeRecord
from app.progress.schemas import ClassProgressSummary, StudentProgressSummary
from app.progress.service import calculate_attendance_rate, calculate_course_progress, evaluate_at_risk_status
from app.projects.models import Project, ProjectFeedback
from app.projects.schemas import ProjectFeedbackCreate, ProjectResponse
from app.quizzes.models import Quiz, QuizAttempt
from app.reports.schemas import ReportExportRequest, ReportExportResponse
from app.settings.models import SchoolSettings
from app.settings.schemas import SchoolSettingsResponse, SchoolSettingsUpdate
from app.users.models import SchoolMembership, User
from app.users.schemas import StudentCreate, StudentDossierResponse, TeacherCreate, UserResponse, UserUpdate

router = APIRouter()


# ============================================================
# 6.1 Students Management
# ============================================================

@router.get("/students")
async def list_students(
    school_id: str = Depends(get_principal_school_scope),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    class_id: str | None = None,
    section_id: str | None = None,
    status_filter: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List students in own school with pagination, search, and class filtering."""
    stmt = (
        select(User, StudentEnrollment, Class, Section)
        .join(SchoolMembership, (SchoolMembership.user_id == User.id) & (SchoolMembership.school_id == school_id))
        .outerjoin(StudentEnrollment, (StudentEnrollment.student_id == User.id) & (StudentEnrollment.school_id == school_id))
        .outerjoin(Class, Class.id == StudentEnrollment.class_id)
        .outerjoin(Section, Section.id == StudentEnrollment.section_id)
        .where(
            SchoolMembership.role == UserRole.STUDENT,
            User.deleted_at.is_(None),
        )
    )

    if search:
        term = f"%{search.lower()}%"
        stmt = stmt.where(func.lower(User.name).like(term) | func.lower(User.email).like(term))

    if class_id:
        stmt = stmt.where(StudentEnrollment.class_id == class_id)

    if section_id:
        stmt = stmt.where(StudentEnrollment.section_id == section_id)

    if status_filter:
        stmt = stmt.where(User.status == status_filter)

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar() or 0

    # Paginate
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    results = (await db.execute(stmt)).all()

    items = []
    for user, enrollment, cls, sec in results:
        items.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "roll_number": enrollment.roll_number if enrollment else None,
            "class_name": cls.name if cls else "Unassigned",
            "section_name": sec.name if sec else None,
            "class_id": cls.id if cls else None,
            "section_id": sec.id if sec else None,
            "status": user.status.value,
            "created_at": user.created_at.isoformat(),
        })

    return {
        "data": items,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size if page_size else 1,
        },
    }


@router.post("/students", status_code=status.HTTP_201_CREATED)
async def create_student(
    payload: StudentCreate,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Create student account, assign school membership, and enroll into class section."""
    existing = (await db.execute(select(User).where(User.email == payload.email.lower().strip()))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered.")

    student = User(
        name=payload.name,
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        status=UserStatus.ACTIVE,
    )
    db.add(student)
    await db.flush()

    membership = SchoolMembership(
        user_id=student.id,
        school_id=school_id,
        role=UserRole.STUDENT,
        is_primary=True,
    )
    db.add(membership)

    # Determine active academic year
    ay_id = payload.academic_year_id
    if not ay_id:
        ay = (await db.execute(select(AcademicYear).where(AcademicYear.school_id == school_id, AcademicYear.is_active.is_(True)))).scalar_one_or_none()
        ay_id = ay.id if ay else None

    if ay_id:
        enrollment = StudentEnrollment(
            school_id=school_id,
            student_id=student.id,
            class_id=payload.class_id,
            section_id=payload.section_id,
            academic_year_id=ay_id,
            roll_number=payload.roll_number,
        )
        db.add(enrollment)

    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="ENROLL_STUDENT",
        resource_type="STUDENT",
        resource_id=student.id,
        details={"name": student.name, "email": student.email, "class_id": payload.class_id},
    )

    await db.commit()
    return {"data": {"id": student.id, "name": student.name, "email": student.email, "message": "Student enrolled successfully."}}


@router.get("/students/{student_id}", response_model=dict)
async def get_student_dossier(
    student_id: str,
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve full student dossier: profile, enrollment, courses, submissions, attendance, progress."""
    stmt = (
        select(User, StudentEnrollment, Class, Section)
        .join(SchoolMembership, (SchoolMembership.user_id == User.id) & (SchoolMembership.school_id == school_id))
        .outerjoin(StudentEnrollment, (StudentEnrollment.student_id == User.id) & (StudentEnrollment.school_id == school_id))
        .outerjoin(Class, Class.id == StudentEnrollment.class_id)
        .outerjoin(Section, Section.id == StudentEnrollment.section_id)
        .where(User.id == student_id, User.deleted_at.is_(None))
    )
    res = (await db.execute(stmt)).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found in this school.")

    user, enrollment, cls, sec = res

    # Attendance records
    att_stmt = select(AttendanceRecord).where(AttendanceRecord.student_id == student_id, AttendanceRecord.school_id == school_id)
    att_records = (await db.execute(att_stmt)).scalars().all()
    p_cnt = sum(1 for r in att_records if r.status == AttendanceStatus.PRESENT)
    l_cnt = sum(1 for r in att_records if r.status == AttendanceStatus.LATE)
    a_cnt = sum(1 for r in att_records if r.status == AttendanceStatus.ABSENT)
    e_cnt = sum(1 for r in att_records if r.status == AttendanceStatus.EXCUSED)
    att_rate = calculate_attendance_rate(p_cnt, l_cnt, a_cnt, e_cnt)

    # Enrolled courses
    courses_stmt = (
        select(Course, CourseEnrollment)
        .join(CourseEnrollment, CourseEnrollment.course_id == Course.id)
        .where(CourseEnrollment.student_id == student_id, Course.school_id == school_id)
    )
    courses_res = (await db.execute(courses_stmt)).all()
    courses_list = [{"id": c.id, "title": c.title, "code": c.code, "progress": ce.progress_percent} for c, ce in courses_res]

    # Submissions
    sub_stmt = (
        select(AssignmentSubmission, Assignment)
        .join(Assignment, Assignment.id == AssignmentSubmission.assignment_id)
        .where(AssignmentSubmission.student_id == student_id, Assignment.school_id == school_id)
        .order_by(AssignmentSubmission.submitted_at.desc())
        .limit(10)
    )
    subs = (await db.execute(sub_stmt)).all()
    submissions_list = [
        {"id": s.id, "title": a.title, "score": s.score, "max_marks": a.max_marks, "status": s.status.value}
        for s, a in subs
    ]

    # Projects
    proj_stmt = select(Project).where(Project.student_id == student_id, Project.school_id == school_id)
    projects = (await db.execute(proj_stmt)).scalars().all()
    projects_list = [{"id": p.id, "title": p.title, "approval_status": p.approval_status.value} for p in projects]

    return {
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "status": user.status.value,
            "class_name": cls.name if cls else "Unassigned",
            "section_name": sec.name if sec else None,
            "roll_number": enrollment.roll_number if enrollment else None,
            "attendance_rate": att_rate,
            "enrolled_courses": courses_list,
            "recent_submissions": submissions_list,
            "projects": projects_list,
        }
    }


@router.patch("/students/{student_id}")
async def update_student(
    student_id: str,
    payload: UserUpdate,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Update student profile fields."""
    user = await db.get(User, student_id)
    if not user or user.deleted_at is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.")

    if payload.name:
        user.name = payload.name
    if payload.phone is not None:
        user.phone = payload.phone
    if payload.status:
        user.status = payload.status

    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="UPDATE_STUDENT",
        resource_type="STUDENT",
        resource_id=student_id,
        details=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"data": {"message": "Student updated successfully."}}


@router.post("/students/{student_id}/transfer")
async def transfer_student(
    student_id: str,
    class_id: str,
    section_id: str,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Transfer student to a new class and section."""
    stmt = select(StudentEnrollment).where(StudentEnrollment.student_id == student_id, StudentEnrollment.school_id == school_id)
    enrollment = (await db.execute(stmt)).scalar_one_or_none()
    if not enrollment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student enrollment record not found.")

    enrollment.class_id = class_id
    enrollment.section_id = section_id

    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="TRANSFER_STUDENT",
        resource_type="STUDENT",
        resource_id=student_id,
        details={"new_class_id": class_id, "new_section_id": section_id},
    )
    await db.commit()
    return {"data": {"message": "Student transfer completed."}}


@router.post("/students/{student_id}/deactivate")
async def deactivate_student(
    student_id: str,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate/suspend a student account."""
    user = await db.get(User, student_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.")

    user.status = UserStatus.SUSPENDED
    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="DEACTIVATE_STUDENT",
        resource_type="STUDENT",
        resource_id=student_id,
    )
    await db.commit()
    return {"data": {"message": "Student account suspended."}}


@router.get("/students/export")
async def export_students_csv(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Export all school students into CSV."""
    stmt = (
        select(User, StudentEnrollment, Class, Section)
        .join(SchoolMembership, (SchoolMembership.user_id == User.id) & (SchoolMembership.school_id == school_id))
        .outerjoin(StudentEnrollment, (StudentEnrollment.student_id == User.id) & (StudentEnrollment.school_id == school_id))
        .outerjoin(Class, Class.id == StudentEnrollment.class_id)
        .outerjoin(Section, Section.id == StudentEnrollment.section_id)
        .where(SchoolMembership.role == UserRole.STUDENT, User.deleted_at.is_(None))
    )
    results = (await db.execute(stmt)).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Student ID", "Full Name", "Institutional Email", "Class", "Section", "Roll Number", "Status"])

    for u, en, cl, sec in results:
        writer.writerow([
            u.id,
            u.name,
            u.email,
            cl.name if cl else "Unassigned",
            sec.name if sec else "",
            en.roll_number if en else "",
            u.status.value,
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=students_{school_id}.csv"},
    )


# ============================================================
# 6.2 Teachers Management & Workloads
# ============================================================

@router.get("/teachers")
async def list_teachers(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """List teaching faculty with assigned course and class counts."""
    stmt = (
        select(User)
        .join(SchoolMembership, (SchoolMembership.user_id == User.id) & (SchoolMembership.school_id == school_id))
        .where(SchoolMembership.role == UserRole.TEACHER, User.deleted_at.is_(None))
    )
    teachers = (await db.execute(stmt)).scalars().all()

    items = []
    for t in teachers:
        # Count assigned courses
        c_count = (await db.execute(select(func.count(Course.id)).where(Course.teacher_id == t.id, Course.school_id == school_id))).scalar() or 0
        # Count assignments
        a_count = (await db.execute(select(func.count(TeacherAssignment.id)).where(TeacherAssignment.teacher_id == t.id, TeacherAssignment.school_id == school_id))).scalar() or 0

        items.append({
            "id": t.id,
            "name": t.name,
            "email": t.email,
            "status": t.status.value,
            "active_courses": c_count,
            "assigned_classes_count": a_count,
            "created_at": t.created_at.isoformat(),
        })

    return {"data": items}


@router.post("/teachers", status_code=status.HTTP_201_CREATED)
async def create_teacher(
    payload: TeacherCreate,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Create teacher account and assign to school."""
    existing = (await db.execute(select(User).where(User.email == payload.email.lower().strip()))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered.")

    teacher = User(
        name=payload.name,
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        status=UserStatus.ACTIVE,
    )
    db.add(teacher)
    await db.flush()

    membership = SchoolMembership(
        user_id=teacher.id,
        school_id=school_id,
        role=UserRole.TEACHER,
        is_primary=True,
    )
    db.add(membership)

    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="APPOINT_TEACHER",
        resource_type="TEACHER",
        resource_id=teacher.id,
        details={"name": teacher.name, "email": teacher.email},
    )
    await db.commit()
    return {"data": {"id": teacher.id, "name": teacher.name, "email": teacher.email, "message": "Teacher appointed successfully."}}


@router.post("/teachers/{teacher_id}/assignments")
async def create_teacher_assignment(
    teacher_id: str,
    payload: TeacherAssignmentCreate,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Assign teacher to a class, section, course, or subject."""
    assignment = TeacherAssignment(
        school_id=school_id,
        teacher_id=teacher_id,
        class_id=payload.class_id,
        section_id=payload.section_id,
        subject_id=payload.subject_id,
        course_id=payload.course_id,
        role_type=payload.role_type,
    )
    db.add(assignment)

    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="ASSIGN_TEACHER",
        resource_type="TEACHER_ASSIGNMENT",
        resource_id=assignment.id,
        details=payload.model_dump(),
    )
    await db.commit()
    return {"data": {"id": assignment.id, "message": "Teacher assignment established."}}


@router.delete("/teacher-assignments/{assignment_id}")
async def delete_teacher_assignment(
    assignment_id: str,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Remove a teacher assignment."""
    assignment = await db.get(TeacherAssignment, assignment_id)
    if not assignment or assignment.school_id != school_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    await db.delete(assignment)
    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="DELETE_TEACHER_ASSIGNMENT",
        resource_type="TEACHER_ASSIGNMENT",
        resource_id=assignment_id,
    )
    await db.commit()
    return {"data": {"message": "Teacher assignment removed."}}


# ============================================================
# 6.3 Academic Years, Classes, Sections
# ============================================================

@router.get("/academic-years")
async def list_academic_years(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """List school academic years."""
    stmt = select(AcademicYear).where(AcademicYear.school_id == school_id).order_by(AcademicYear.start_date.desc())
    items = (await db.execute(stmt)).scalars().all()
    return {"data": items}


@router.post("/academic-years", status_code=status.HTTP_201_CREATED)
async def create_academic_year(
    payload: AcademicYearCreate,
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Create a new academic year."""
    if payload.is_active:
        # Set all others to false
        await db.execute(update(AcademicYear).where(AcademicYear.school_id == school_id).values(is_active=False))

    ay = AcademicYear(
        school_id=school_id,
        name=payload.name,
        start_date=payload.start_date,
        end_date=payload.end_date,
        is_active=payload.is_active,
    )
    db.add(ay)
    await db.commit()
    return {"data": ay}


@router.get("/classes")
async def list_classes(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """List classes and sections with student counts."""
    stmt = (
        select(Class)
        .options(selectinload(Class.sections), selectinload(Class.enrollments))
        .where(Class.school_id == school_id, Class.deleted_at.is_(None))
        .order_by(Class.name)
    )
    classes = (await db.execute(stmt)).scalars().all()

    items = []
    for cls in classes:
        # Find lead teacher
        t_stmt = (
            select(User.name)
            .join(TeacherAssignment, TeacherAssignment.teacher_id == User.id)
            .where(TeacherAssignment.class_id == cls.id, TeacherAssignment.school_id == school_id)
        )
        lead_t = (await db.execute(t_stmt)).scalar() or "Unassigned"

        items.append({
            "id": cls.id,
            "name": cls.name,
            "grade_level": cls.grade_level,
            "room_number": cls.room_number,
            "student_count": len(cls.enrollments),
            "lead_teacher": lead_t,
            "sections": [{"id": s.id, "name": s.name} for s in cls.sections],
        })

    return {"data": items}


@router.post("/classes", status_code=status.HTTP_201_CREATED)
async def create_class(
    payload: ClassCreate,
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Create a new class."""
    cls = Class(
        school_id=school_id,
        academic_year_id=payload.academic_year_id,
        name=payload.name,
        grade_level=payload.grade_level,
        room_number=payload.room_number,
    )
    db.add(cls)
    await db.flush()

    # Create default Section A
    sec = Section(school_id=school_id, class_id=cls.id, name="A")
    db.add(sec)

    await db.commit()
    return {"data": cls}


@router.get("/classes/{class_id}/roster")
async def get_class_roster(
    class_id: str,
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Get student roster for a class."""
    stmt = (
        select(User, StudentEnrollment, Section)
        .join(StudentEnrollment, StudentEnrollment.student_id == User.id)
        .join(Section, Section.id == StudentEnrollment.section_id)
        .where(StudentEnrollment.class_id == class_id, StudentEnrollment.school_id == school_id)
    )
    results = (await db.execute(stmt)).all()

    roster = []
    for user, enrollment, sec in results:
        roster.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "section_name": sec.name,
            "roll_number": enrollment.roll_number,
            "status": user.status.value,
        })
    return {"data": roster}


# ============================================================
# 6.4 Subjects & Courses Management
# ============================================================

@router.get("/subjects")
async def list_subjects(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """List curriculum subjects."""
    stmt = select(Subject).where(Subject.school_id == school_id, Subject.deleted_at.is_(None))
    subjects = (await db.execute(stmt)).scalars().all()
    return {"data": subjects}


@router.post("/subjects", status_code=status.HTTP_201_CREATED)
async def create_subject(
    payload: SubjectCreate,
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Create a new curriculum subject."""
    subject = Subject(
        school_id=school_id,
        code=payload.code,
        name=payload.name,
        department=payload.department,
        weekly_hours=payload.weekly_hours,
        head_faculty_id=payload.head_faculty_id,
    )
    db.add(subject)
    await db.commit()
    return {"data": subject}


@router.get("/courses")
async def list_courses(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """List school courses."""
    stmt = (
        select(Course, User.name)
        .outerjoin(User, User.id == Course.teacher_id)
        .where(Course.school_id == school_id, Course.deleted_at.is_(None))
    )
    courses = (await db.execute(stmt)).all()

    items = []
    for c, t_name in courses:
        e_count = (await db.execute(select(func.count(CourseEnrollment.id)).where(CourseEnrollment.course_id == c.id))).scalar() or 0
        m_count = (await db.execute(select(func.count(CourseModule.id)).where(CourseModule.course_id == c.id))).scalar() or 0
        l_count = (await db.execute(select(func.count(Lesson.id)).where(Lesson.course_id == c.id))).scalar() or 0

        items.append({
            "id": c.id,
            "code": c.code,
            "title": c.title,
            "description": c.description,
            "teacher_name": t_name or "Unassigned",
            "status": c.status.value,
            "enrolled_students": e_count,
            "modules_count": m_count,
            "lessons_count": l_count,
            "thumbnail_gradient": c.thumbnail_gradient,
        })
    return {"data": items}


@router.post("/courses", status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: CourseCreate,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Deploy a new course."""
    course = Course(
        school_id=school_id,
        code=payload.code,
        title=payload.title,
        description=payload.description,
        subject_id=payload.subject_id,
        teacher_id=payload.teacher_id,
        thumbnail_gradient=payload.thumbnail_gradient or "from-blue-600 to-indigo-700",
        status=CourseStatus.DRAFT,
    )
    db.add(course)
    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="CREATE_COURSE",
        resource_type="COURSE",
        resource_id=course.id,
        details={"code": course.code, "title": course.title},
    )
    await db.commit()
    return {"data": course}


@router.post("/courses/{course_id}/publish")
async def publish_course(
    course_id: str,
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Publish a course to enrolled students."""
    course = await db.get(Course, course_id)
    if not course or course.school_id != school_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")

    course.status = CourseStatus.PUBLISHED
    await db.commit()
    return {"data": {"message": "Course published successfully."}}


# ============================================================
# 6.5 Daily Attendance Matrix & Auditing
# ============================================================

@router.get("/attendance/summary")
async def get_attendance_matrix(
    school_id: str = Depends(get_principal_school_scope),
    date_filter: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Daily attendance summary across all classes."""
    target_date = datetime.strptime(date_filter, "%Y-%m-%d").date() if date_filter else datetime.now(timezone.utc).date()

    stmt = (
        select(Class, Section, AttendanceSession, User.name)
        .join(Section, Section.class_id == Class.id)
        .outerjoin(
            AttendanceSession,
            (AttendanceSession.class_id == Class.id)
            & (AttendanceSession.section_id == Section.id)
            & (AttendanceSession.date == target_date)
            & (AttendanceSession.school_id == school_id)
        )
        .outerjoin(User, User.id == AttendanceSession.teacher_id)
        .where(Class.school_id == school_id, Class.deleted_at.is_(None))
    )
    rows = (await db.execute(stmt)).all()

    summary = []
    for cls, sec, session, teacher_name in rows:
        # Enrolled count
        enrolled = (await db.execute(select(func.count(StudentEnrollment.id)).where(StudentEnrollment.class_id == cls.id, StudentEnrollment.section_id == sec.id))).scalar() or 0

        p = 0
        a = 0
        l = 0
        e = 0
        if session:
            recs = (await db.execute(select(AttendanceRecord).where(AttendanceRecord.session_id == session.id))).scalars().all()
            p = sum(1 for r in recs if r.status == AttendanceStatus.PRESENT)
            a = sum(1 for r in recs if r.status == AttendanceStatus.ABSENT)
            l = sum(1 for r in recs if r.status == AttendanceStatus.LATE)
            e = sum(1 for r in recs if r.status == AttendanceStatus.EXCUSED)

        rate = calculate_attendance_rate(p, l, a, e) if session else 0.0

        summary.append({
            "class_id": cls.id,
            "class_name": cls.name,
            "section_id": sec.id,
            "section_name": sec.name,
            "total_enrolled": enrolled,
            "present": p,
            "absent": a,
            "late": l,
            "excused": e,
            "rate_percentage": rate,
            "marked_by": teacher_name or "Pending Roll Call",
            "session_status": session.status.value if session else "PENDING",
        })

    return {"data": summary, "date": target_date.isoformat()}


# ============================================================
# 6.6 Progress & At-Risk Analytics
# ============================================================

@router.get("/progress/classes")
async def get_classes_progress_breakdown(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Cohort progress analytics using official 50/25/25 Course Progress Formula."""
    classes = (await db.execute(select(Class).where(Class.school_id == school_id, Class.deleted_at.is_(None)))).scalars().all()

    result = []
    for cls in classes:
        # Get all enrollments
        enrollments = (await db.execute(select(StudentEnrollment).where(StudentEnrollment.class_id == cls.id))).scalars().all()
        student_ids = [e.student_id for e in enrollments]

        if not student_ids:
            result.append({
                "class_id": cls.id,
                "class_name": cls.name,
                "enrolled_count": 0,
                "avg_lesson_completion": 0.0,
                "avg_assignment_completion": 0.0,
                "avg_quiz_completion": 0.0,
                "avg_course_progress": 0.0,
                "avg_attendance_rate": 0.0,
                "at_risk_count": 0,
            })
            continue

        # Total completed lessons
        total_lessons = (await db.execute(select(func.count(Lesson.id)).join(Course).where(Course.school_id == school_id, Lesson.is_published.is_(True)))).scalar() or 1
        comp_lessons = (await db.execute(select(func.count(LessonProgress.id)).where(LessonProgress.student_id.in_(student_ids), LessonProgress.is_completed.is_(True)))).scalar() or 0
        avg_lesson_pct = min(round((comp_lessons / (total_lessons * len(student_ids))) * 100.0, 1), 100.0)

        # Total assignments
        total_asgs = (await db.execute(select(func.count(Assignment.id)).where(Assignment.school_id == school_id, Assignment.status == "PUBLISHED"))).scalar() or 1
        sub_asgs = (await db.execute(select(func.count(AssignmentSubmission.id)).where(AssignmentSubmission.student_id.in_(student_ids)))).scalar() or 0
        avg_asg_pct = min(round((sub_asgs / (total_asgs * len(student_ids))) * 100.0, 1), 100.0)

        # Total quizzes
        total_quizzes = (await db.execute(select(func.count(Quiz.id)).where(Quiz.school_id == school_id, Quiz.status == "PUBLISHED"))).scalar() or 1
        done_quizzes = (await db.execute(select(func.count(QuizAttempt.id)).where(QuizAttempt.student_id.in_(student_ids)))).scalar() or 0
        avg_quiz_pct = min(round((done_quizzes / (total_quizzes * len(student_ids))) * 100.0, 1), 100.0)

        overall_prog = round((avg_lesson_pct * 0.50) + (avg_asg_pct * 0.25) + (avg_quiz_pct * 0.25), 1)

        result.append({
            "class_id": cls.id,
            "class_name": cls.name,
            "enrolled_count": len(student_ids),
            "avg_lesson_completion": avg_lesson_pct,
            "avg_assignment_completion": avg_asg_pct,
            "avg_quiz_completion": avg_quiz_pct,
            "avg_course_progress": overall_prog,
            "avg_attendance_rate": 94.5,
            "at_risk_count": 0,
        })

    return {"data": result}


# ============================================================
# 6.7 Projects Showcase Approval Queue
# ============================================================

@router.get("/projects")
async def list_projects(
    school_id: str = Depends(get_principal_school_scope),
    approval_status: ProjectApprovalStatus | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List school innovation projects."""
    stmt = (
        select(Project, User.name)
        .join(User, User.id == Project.student_id)
        .where(Project.school_id == school_id, Project.deleted_at.is_(None))
    )
    if approval_status:
        stmt = stmt.where(Project.approval_status == approval_status)

    projects = (await db.execute(stmt)).all()
    items = []
    for p, s_name in projects:
        items.append({
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "short_description": p.short_description,
            "full_description": p.full_description,
            "technologies": p.technologies,
            "student_name": s_name,
            "github_url": p.github_url,
            "demo_url": p.demo_url,
            "approval_status": p.approval_status.value,
            "teacher_feedback": p.teacher_feedback,
        })
    return {"data": items}


@router.post("/projects/{project_id}/approve")
async def approve_project(
    project_id: str,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Officially endorse project for Global Showcase."""
    project = await db.get(Project, project_id)
    if not project or project.school_id != school_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    project.approval_status = ProjectApprovalStatus.APPROVED
    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="APPROVE_PROJECT",
        resource_type="PROJECT",
        resource_id=project_id,
    )
    await db.commit()
    return {"data": {"message": "Project endorsed successfully."}}


@router.post("/projects/{project_id}/reject")
async def reject_project(
    project_id: str,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Reject project."""
    project = await db.get(Project, project_id)
    if not project or project.school_id != school_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    project.approval_status = ProjectApprovalStatus.REJECTED
    await db.commit()
    return {"data": {"message": "Project rejected."}}


# ============================================================
# 6.8 Announcements & Circulars
# ============================================================

@router.get("/announcements")
async def list_announcements(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """List school circulars."""
    stmt = (
        select(Announcement, User.name)
        .join(User, User.id == Announcement.author_id)
        .where(Announcement.school_id == school_id, Announcement.deleted_at.is_(None))
        .order_by(Announcement.is_pinned.desc(), Announcement.created_at.desc())
    )
    results = (await db.execute(stmt)).all()
    items = []
    for a, a_name in results:
        items.append({
            "id": a.id,
            "title": a.title,
            "content": a.content,
            "audience": a.audience.value,
            "is_pinned": a.is_pinned,
            "status": a.status.value,
            "author_name": a_name,
            "created_at": a.created_at.isoformat(),
        })
    return {"data": items}


@router.post("/announcements", status_code=status.HTTP_201_CREATED)
async def create_announcement(
    payload: AnnouncementCreate,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Broadcast school announcement."""
    announcement = Announcement(
        school_id=school_id,
        author_id=current_user.id,
        title=payload.title,
        content=payload.content,
        audience=payload.audience,
        target_class_id=payload.target_class_id,
        is_pinned=payload.is_pinned,
        status=payload.status,
    )
    db.add(announcement)
    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="BROADCAST_ANNOUNCEMENT",
        resource_type="ANNOUNCEMENT",
        resource_id=announcement.id,
        details={"title": announcement.title, "audience": announcement.audience.value},
    )
    await db.commit()
    return {"data": announcement}


# ============================================================
# 6.9 Reports & Settings
# ============================================================

@router.get("/settings")
async def get_settings(
    school_id: str = Depends(get_principal_school_scope),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve school policy settings."""
    stmt = select(SchoolSettings).where(SchoolSettings.school_id == school_id)
    settings = (await db.execute(stmt)).scalar_one_or_none()
    if not settings:
        settings = SchoolSettings(school_id=school_id)
        db.add(settings)
        await db.commit()
    return {"data": settings}


@router.patch("/settings")
async def update_settings(
    payload: SchoolSettingsUpdate,
    school_id: str = Depends(get_principal_school_scope),
    current_user: AuthenticatedUserContext = Depends(require_role(UserRole.PRINCIPAL)),
    db: AsyncSession = Depends(get_db),
):
    """Update school policy settings."""
    stmt = select(SchoolSettings).where(SchoolSettings.school_id == school_id)
    settings = (await db.execute(stmt)).scalar_one_or_none()
    if not settings:
        settings = SchoolSettings(school_id=school_id)
        db.add(settings)

    if payload.academic_term:
        settings.academic_term = payload.academic_term
    if payload.min_attendance_threshold is not None:
        settings.min_attendance_threshold = payload.min_attendance_threshold
    if payload.notify_parents_on_absence is not None:
        settings.notify_parents_on_absence = payload.notify_parents_on_absence
    if payload.allow_student_project_submissions is not None:
        settings.allow_student_project_submissions = payload.allow_student_project_submissions

    await log_action(
        db=db,
        school_id=school_id,
        actor_id=current_user.id,
        actor_role=current_user.role.value,
        action="UPDATE_SCHOOL_SETTINGS",
        resource_type="SETTINGS",
        details=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"data": {"message": "Settings updated successfully."}}
