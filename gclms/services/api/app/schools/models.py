"""
GCLMS API — School Models
"""

import uuid
from sqlalchemy import Enum as SQLEnum, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import SchoolStatus, SoftDeleteMixin, TimestampMixin, generate_uuid
from app.database import Base


class School(Base, TimestampMixin, SoftDeleteMixin):
    """Multi-tenant School Institution."""

    __tablename__ = "schools"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str] = mapped_column(String(100), default="India", nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    website: Mapped[str | None] = mapped_column(String(255), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    status: Mapped[SchoolStatus] = mapped_column(
        SQLEnum(SchoolStatus),
        default=SchoolStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    # Relationships
    memberships = relationship("SchoolMembership", back_populates="school", cascade="all, delete-orphan")
    academic_years = relationship("AcademicYear", back_populates="school", cascade="all, delete-orphan")
    classes = relationship("Class", back_populates="school", cascade="all, delete-orphan")
    subjects = relationship("Subject", back_populates="school", cascade="all, delete-orphan")
    courses = relationship("Course", back_populates="school", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="school", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="school", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="school")
