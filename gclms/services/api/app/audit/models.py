"""
GCLMS API — Audit Log Models
"""

from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Index, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import TimestampMixin, generate_uuid, utc_now
from app.database import Base


class AuditLog(Base):
    """Immutable audit trail for all critical administrative and academic changes."""

    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("schools.id", ondelete="SET NULL"), nullable=True, index=True)
    actor_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    actor_role: Mapped[str] = mapped_column(String(50), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    resource_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
    details: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False, index=True)

    __table_args__ = (
        Index("ix_audit_logs_school_timestamp", "school_id", "timestamp"),
    )

    # Relationships
    school = relationship("School", back_populates="audit_logs")
    actor = relationship("User", foreign_keys=[actor_id])
