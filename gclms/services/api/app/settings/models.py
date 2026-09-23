"""
GCLMS API — School Settings Models
"""

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import TimestampMixin, generate_uuid
from app.database import Base


class SchoolSettings(Base, TimestampMixin):
    """Institutional configuration and policy parameters."""

    __tablename__ = "school_settings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    academic_term: Mapped[str] = mapped_column(String(100), default="Term 2 (Spring 2026)", nullable=False)
    min_attendance_threshold: Mapped[float] = mapped_column(Float, default=75.0, nullable=False)
    assignment_weight_percent: Mapped[float] = mapped_column(Float, default=50.0, nullable=False)
    quiz_weight_percent: Mapped[float] = mapped_column(Float, default=25.0, nullable=False)
    attendance_weight_percent: Mapped[float] = mapped_column(Float, default=25.0, nullable=False)

    notify_parents_on_absence: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    allow_student_project_submissions: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    auto_lock_attendance_days: Mapped[int] = mapped_column(Integer, default=7, nullable=False)

    # Relationships
    school = relationship("School", foreign_keys=[school_id])
