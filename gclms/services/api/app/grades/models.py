"""
GCLMS API — Official Grade Record Models
"""

from sqlalchemy import Float, ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import TimestampMixin, generate_uuid
from app.database import Base


class GradeRecord(Base, TimestampMixin):
    """Calculated cumulative course grade and manual teacher override score."""

    __tablename__ = "grade_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    academic_year_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("academic_years.id", ondelete="SET NULL"), nullable=True)

    assessment_average: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    override_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    letter_grade: Mapped[str] = mapped_column(String(5), default="N/A", nullable=False)
    gpa_points: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    __table_args__ = (
        UniqueConstraint("student_id", "course_id", name="uq_student_course_grade"),
    )

    # Relationships
    student = relationship("User", foreign_keys=[student_id])
    course = relationship("Course", foreign_keys=[course_id])
