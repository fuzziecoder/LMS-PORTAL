"""
GCLMS API — Report Exports Models
"""

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import TimestampMixin, generate_uuid
from app.database import Base


class ReportExport(Base, TimestampMixin):
    """Generated CSV/PDF report artifact tracking."""

    __tablename__ = "report_exports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    generated_by_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    report_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    format: Mapped[str] = mapped_column(String(20), default="CSV", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="COMPLETED", nullable=False)

    # Relationships
    generated_by = relationship("User", foreign_keys=[generated_by_id])
