"""
GCLMS API — Academic Structure Models
"""

from datetime import date
from sqlalchemy import Boolean, Date, Enum as SQLEnum, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import SoftDeleteMixin, TimestampMixin, generate_uuid
from app.database import Base


class AcademicYear(Base, TimestampMixin):
    """Academic Year cycle for an institution."""

    __tablename__ = "academic_years"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., "2025-2026"
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("school_id", "name", name="uq_school_academic_year"),
        Index("ix_academic_years_school_active", "school_id", "is_active"),
    )

    # Relationships
    school = relationship("School", back_populates="academic_years")
    classes = relationship("Class", back_populates="academic_year", cascade="all, delete-orphan")


class Class(Base, TimestampMixin, SoftDeleteMixin):
    """Class or Grade Level (e.g. Grade 10)."""

    __tablename__ = "classes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    academic_year_id: Mapped[str] = mapped_column(String(36), ForeignKey("academic_years.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "Grade 10"
    grade_level: Mapped[str] = mapped_column(String(50), nullable=False)
    room_number: Mapped[str | None] = mapped_column(String(50), nullable=True)

    __table_args__ = (
        UniqueConstraint("school_id", "academic_year_id", "name", name="uq_class_school_year_name"),
    )

    # Relationships
    school = relationship("School", back_populates="classes")
    academic_year = relationship("AcademicYear", back_populates="classes")
    sections = relationship("Section", back_populates="class_ref", cascade="all, delete-orphan")
    enrollments = relationship("StudentEnrollment", back_populates="class_ref")
    teacher_assignments = relationship("TeacherAssignment", back_populates="class_ref")


class Section(Base, TimestampMixin, SoftDeleteMixin):
    """Section under a Class (e.g. Section A, AI Specialized)."""

    __tablename__ = "sections"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. "A", "B", "AI"

    __table_args__ = (
        UniqueConstraint("class_id", "name", name="uq_section_class_name"),
    )

    # Relationships
    class_ref = relationship("Class", back_populates="sections")
    enrollments = relationship("StudentEnrollment", back_populates="section_ref")
    teacher_assignments = relationship("TeacherAssignment", back_populates="section_ref")


class Subject(Base, TimestampMixin, SoftDeleteMixin):
    """Academic Subject or Curriculum Discipline (e.g. Computer Science)."""

    __tablename__ = "subjects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. "CS-101"
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    weekly_hours: Mapped[int] = mapped_column(Integer, default=4, nullable=False)
    head_faculty_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE", nullable=False)

    __table_args__ = (
        UniqueConstraint("school_id", "code", name="uq_subject_school_code"),
    )

    # Relationships
    school = relationship("School", back_populates="subjects")
    head_faculty = relationship("User", foreign_keys=[head_faculty_id])
    courses = relationship("Course", back_populates="subject_ref")


class StudentEnrollment(Base, TimestampMixin):
    """Enrollment of a Student into a Class & Section for an Academic Year."""

    __tablename__ = "student_enrollments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False, index=True)
    section_id: Mapped[str] = mapped_column(String(36), ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    academic_year_id: Mapped[str] = mapped_column(String(36), ForeignKey("academic_years.id", ondelete="CASCADE"), nullable=False, index=True)
    roll_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE", nullable=False)

    __table_args__ = (
        UniqueConstraint("student_id", "academic_year_id", name="uq_student_academic_year"),
        Index("ix_student_enrollments_school_class", "school_id", "class_id", "section_id"),
    )

    # Relationships
    student = relationship("User", back_populates="enrollments", foreign_keys=[student_id])
    class_ref = relationship("Class", back_populates="enrollments")
    section_ref = relationship("Section", back_populates="enrollments")


class TeacherAssignment(Base, TimestampMixin):
    """Explicit mapping of a Teacher to Class / Section / Course / Subject."""

    __tablename__ = "teacher_assignments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("classes.id", ondelete="CASCADE"), nullable=True, index=True)
    section_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("sections.id", ondelete="CASCADE"), nullable=True, index=True)
    subject_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=True)
    course_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=True)
    role_type: Mapped[str] = mapped_column(String(50), default="PRIMARY_INSTRUCTOR", nullable=False)  # LEAD, ASSISTANT, PRIMARY

    __table_args__ = (
        Index("ix_teacher_assignments_lookup", "school_id", "teacher_id", "class_id", "section_id"),
    )

    # Relationships
    teacher = relationship("User", back_populates="teacher_assignments", foreign_keys=[teacher_id])
    class_ref = relationship("Class", back_populates="teacher_assignments")
    section_ref = relationship("Section", back_populates="teacher_assignments")
