"""
GCLMS API — Announcements Models
"""

from sqlalchemy import Boolean, Enum as SQLEnum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import AnnouncementAudience, AnnouncementStatus, SoftDeleteMixin, TimestampMixin, generate_uuid
from app.database import Base


class Announcement(Base, TimestampMixin, SoftDeleteMixin):
    """School and class circulars / broadcasts."""

    __tablename__ = "announcements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_class_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("classes.id", ondelete="SET NULL"), nullable=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    audience: Mapped[AnnouncementAudience] = mapped_column(
        SQLEnum(AnnouncementAudience),
        default=AnnouncementAudience.ALL,
        nullable=False,
    )

    status: Mapped[AnnouncementStatus] = mapped_column(
        SQLEnum(AnnouncementStatus),
        default=AnnouncementStatus.PUBLISHED,
        nullable=False,
        index=True,
    )

    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    school = relationship("School", back_populates="announcements")
    author = relationship("User", foreign_keys=[author_id])
