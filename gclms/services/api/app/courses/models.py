"""
GCLMS API — Courses & Lessons Models
"""

from datetime import datetime
from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import CourseStatus, LessonType, SoftDeleteMixin, TimestampMixin, generate_uuid
from app.database import Base


class Course(Base, TimestampMixin, SoftDeleteMixin):
    """Course curriculum entity."""

    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    subject_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("subjects.id", ondelete="SET NULL"), nullable=True, index=True)
    teacher_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., "PY-101"
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    thumbnail_gradient: Mapped[str | None] = mapped_column(String(100), nullable=True)

    status: Mapped[CourseStatus] = mapped_column(
        SQLEnum(CourseStatus),
        default=CourseStatus.DRAFT,
        nullable=False,
        index=True,
    )

    __table_args__ = (
        UniqueConstraint("school_id", "code", name="uq_school_course_code"),
    )

    # Relationships
    school = relationship("School", back_populates="courses")
    subject_ref = relationship("Subject", back_populates="courses")
    teacher = relationship("User", foreign_keys=[teacher_id])
    modules = relationship("CourseModule", back_populates="course", cascade="all, delete-orphan", order_by="CourseModule.order")
    enrollments = relationship("CourseEnrollment", back_populates="course", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="course", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="course", cascade="all, delete-orphan")


class CourseModule(Base, TimestampMixin):
    """Module unit within a Course."""

    __tablename__ = "course_modules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan", order_by="Lesson.order")


class Lesson(Base, TimestampMixin, SoftDeleteMixin):
    """Individual Lesson item."""

    __tablename__ = "lessons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id: Mapped[str] = mapped_column(String(36), ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    type: Mapped[LessonType] = mapped_column(
        SQLEnum(LessonType),
        default=LessonType.TEXT,
        nullable=False,
    )
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    # Relationships
    module = relationship("CourseModule", back_populates="lessons")
    resources = relationship("Resource", back_populates="lesson", cascade="all, delete-orphan")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")


class LessonProgress(Base, TimestampMixin):
    """Tracks a student's completion of a specific lesson."""

    __tablename__ = "lesson_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    lesson_id: Mapped[str] = mapped_column(String(36), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("lesson_id", "student_id", name="uq_student_lesson_progress"),
    )

    # Relationships
    lesson = relationship("Lesson", back_populates="progress_records")
    student = relationship("User", foreign_keys=[student_id])


class Resource(Base, TimestampMixin):
    """File attachment or link attached to a lesson."""

    __tablename__ = "resources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    lesson_id: Mapped[str] = mapped_column(String(36), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    resource_type: Mapped[str] = mapped_column(String(50), default="PDF", nullable=False)

    # Relationships
    lesson = relationship("Lesson", back_populates="resources")


class CourseEnrollment(Base, TimestampMixin):
    """Course student enrollment with cached progress percentage."""

    __tablename__ = "course_enrollments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    progress_percent: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE", nullable=False)

    __table_args__ = (
        UniqueConstraint("course_id", "student_id", name="uq_student_course_enrollment"),
    )

    # Relationships
    course = relationship("Course", back_populates="enrollments")
    student = relationship("User", foreign_keys=[student_id])
