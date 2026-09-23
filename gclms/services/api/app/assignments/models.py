"""
GCLMS API — Assignments & Submissions Models
"""

from datetime import datetime
from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import AssignmentStatus, SoftDeleteMixin, SubmissionStatus, TimestampMixin, generate_uuid
from app.database import Base


class Assignment(Base, TimestampMixin, SoftDeleteMixin):
    """Graded coursework assignment."""

    __tablename__ = "assignments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_class_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("classes.id", ondelete="SET NULL"), nullable=True, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    instructions: Mapped[str] = mapped_column(Text, nullable=False)
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    max_marks: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    allow_late: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    status: Mapped[AssignmentStatus] = mapped_column(
        SQLEnum(AssignmentStatus),
        default=AssignmentStatus.DRAFT,
        nullable=False,
        index=True,
    )

    # Relationships
    course = relationship("Course", back_populates="assignments")
    teacher = relationship("User", foreign_keys=[teacher_id])
    target_class = relationship("Class", foreign_keys=[target_class_id])
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base, TimestampMixin):
    """Student's code or file submission for an Assignment."""

    __tablename__ = "assignment_submissions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    assignment_id: Mapped[str] = mapped_column(String(36), ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    code_content: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[SubmissionStatus] = mapped_column(
        SQLEnum(SubmissionStatus),
        default=SubmissionStatus.SUBMITTED,
        nullable=False,
        index=True,
    )

    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    teacher_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    graded_by_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    graded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("assignment_id", "student_id", name="uq_student_assignment_submission"),
    )

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", foreign_keys=[student_id])
    graded_by = relationship("User", foreign_keys=[graded_by_id])
    files = relationship("SubmissionFile", back_populates="submission", cascade="all, delete-orphan")


class SubmissionFile(Base, TimestampMixin):
    """Attached file in a student submission."""

    __tablename__ = "submission_files"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    submission_id: Mapped[str] = mapped_column(String(36), ForeignKey("assignment_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    file_id: Mapped[str] = mapped_column(String(36), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    submission = relationship("AssignmentSubmission", back_populates="files")
