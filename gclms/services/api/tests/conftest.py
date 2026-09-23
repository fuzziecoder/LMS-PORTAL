"""
GCLMS API — Integration Test Fixtures and Test Environment
Uses in-memory SQLite with async sessions to test multi-tenancy and teacher scoping.
"""

import asyncio
from collections.abc import AsyncGenerator
from datetime import date, datetime, timezone
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

import app.models  # Register all models with Base.metadata
from app.academic.models import AcademicYear, Class, Section, StudentEnrollment, Subject, TeacherAssignment
from app.auth.service import hash_password
from app.common.models import SchoolStatus, UserRole, UserStatus
from app.courses.models import Course, CourseEnrollment, CourseModule, Lesson
from app.database import Base, get_db
from app.main import app
from app.schools.models import School
from app.users.models import SchoolMembership, User

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Create a fresh in-memory database and seed foundational test entities."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        # 1. Create School 1 & School 2
        school1 = School(
            id="school-1",
            name="Chennai Innovation Academy",
            code="CIA-TN",
            city="Chennai",
            state="Tamil Nadu",
            status=SchoolStatus.ACTIVE,
        )
        school2 = School(
            id="school-2",
            name="Bengaluru STEM School",
            code="BSS-KA",
            city="Bengaluru",
            state="Karnataka",
            status=SchoolStatus.ACTIVE,
        )
        session.add_all([school1, school2])
        await session.flush()

        # 2. Create Principal 1 (School 1)
        p1 = User(
            id="user-p1",
            name="Prof. Ananya Raman",
            email="principal.chennai@gclms.local",
            password_hash=hash_password("Password123!"),
            status=UserStatus.ACTIVE,
        )
        session.add(p1)
        await session.flush()
        m1 = SchoolMembership(user_id=p1.id, school_id=school1.id, role=UserRole.PRINCIPAL, is_primary=True)
        session.add(m1)

        # 3. Create Teacher 1 (School 1)
        t1 = User(
            id="user-t1",
            name="Rajesh Kumar",
            email="teacher.python.chennai@gclms.local",
            password_hash=hash_password("Password123!"),
            status=UserStatus.ACTIVE,
        )
        session.add(t1)
        await session.flush()
        mt1 = SchoolMembership(user_id=t1.id, school_id=school1.id, role=UserRole.TEACHER, is_primary=True)
        session.add(mt1)

        # 4. Create Student 1 (School 1) & Student 2 (School 2)
        s1 = User(
            id="user-s1",
            name="Tharun V.",
            email="student.tharun.chennai@gclms.local",
            password_hash=hash_password("Password123!"),
            status=UserStatus.ACTIVE,
        )
        s2 = User(
            id="user-s2",
            name="Rohan Gupta",
            email="student.rohan.bengaluru@gclms.local",
            password_hash=hash_password("Password123!"),
            status=UserStatus.ACTIVE,
        )
        session.add_all([s1, s2])
        await session.flush()
        ms1 = SchoolMembership(user_id=s1.id, school_id=school1.id, role=UserRole.STUDENT, is_primary=True)
        ms2 = SchoolMembership(user_id=s2.id, school_id=school2.id, role=UserRole.STUDENT, is_primary=True)
        session.add_all([ms1, ms2])

        # 5. Academic Year & Classes for School 1
        ay = AcademicYear(
            id="ay-1",
            school_id=school1.id,
            name="2025-2026",
            start_date=date(2025, 6, 1),
            end_date=date(2026, 5, 31),
            is_active=True,
        )
        session.add(ay)
        await session.flush()

        cls1 = Class(
            id="class-1",
            school_id=school1.id,
            academic_year_id=ay.id,
            name="Grade 10",
            grade_level="Grade 10",
        )
        session.add(cls1)
        await session.flush()

        sec1 = Section(id="sec-1", school_id=school1.id, class_id=cls1.id, name="A")
        session.add(sec1)
        await session.flush()

        # Enroll student 1
        enroll = StudentEnrollment(
            id="enroll-1",
            school_id=school1.id,
            student_id=s1.id,
            class_id=cls1.id,
            section_id=sec1.id,
            academic_year_id=ay.id,
            roll_number="CIA-2026-101",
        )
        session.add(enroll)

        # Assign teacher 1 to class 1
        t_assign = TeacherAssignment(
            id="ta-1",
            school_id=school1.id,
            teacher_id=t1.id,
            class_id=cls1.id,
            section_id=sec1.id,
            role_type="LEAD_INSTRUCTOR",
        )
        session.add(t_assign)

        # Course for teacher 1
        course = Course(
            id="course-1",
            school_id=school1.id,
            teacher_id=t1.id,
            code="PY-101",
            title="Introduction to Python",
            status="PUBLISHED",
        )
        session.add(course)

        await session.commit()
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def async_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Provides test HTTP client with database dependency override."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
