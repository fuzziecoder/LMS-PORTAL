"""
GCLMS API — User & School Membership Models
"""

import uuid
from datetime import datetime
from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import SoftDeleteMixin, TimestampMixin, UserRole, UserStatus, generate_uuid
from app.database import Base


class User(Base, TimestampMixin, SoftDeleteMixin):
    """Global User Account."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[UserStatus] = mapped_column(
        SQLEnum(UserStatus),
        default=UserStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    memberships = relationship("SchoolMembership", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    created_projects = relationship("Project", back_populates="student", foreign_keys="Project.student_id")
    enrollments = relationship("StudentEnrollment", back_populates="student")
    teacher_assignments = relationship("TeacherAssignment", back_populates="teacher")


class SchoolMembership(Base, TimestampMixin):
    """Associates a User with a School under a specific Role."""

    __tablename__ = "school_memberships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    school_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=True, index=True)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), nullable=False, index=True)
    is_primary: Mapped[bool] = mapped_column(default=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "school_id", "role", name="uq_user_school_role"),
        Index("ix_school_memberships_school_role", "school_id", "role"),
    )

    # Relationships
    user = relationship("User", back_populates="memberships")
    school = relationship("School", back_populates="memberships")
