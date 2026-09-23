"""
GCLMS API — Student Innovation Projects Models
"""

from sqlalchemy import ARRAY, Enum as SQLEnum, ForeignKey, Index, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import ProjectApprovalStatus, ProjectStatus, SoftDeleteMixin, TimestampMixin, generate_uuid
from app.database import Base


class Project(Base, TimestampMixin, SoftDeleteMixin):
    """Student Innovation Project entity."""

    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    short_description: Mapped[str] = mapped_column(String(500), nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    technologies: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)

    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    demo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    status: Mapped[ProjectStatus] = mapped_column(
        SQLEnum(ProjectStatus),
        default=ProjectStatus.IN_PROGRESS,
        nullable=False,
    )
    approval_status: Mapped[ProjectApprovalStatus] = mapped_column(
        SQLEnum(ProjectApprovalStatus),
        default=ProjectApprovalStatus.DRAFT,
        nullable=False,
        index=True,
    )

    teacher_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index("ix_projects_school_approval", "school_id", "approval_status"),
    )

    # Relationships
    school = relationship("School", back_populates="projects")
    student = relationship("User", back_populates="created_projects", foreign_keys=[student_id])
    media = relationship("ProjectMedia", back_populates="project", cascade="all, delete-orphan")
    feedback_entries = relationship("ProjectFeedback", back_populates="project", cascade="all, delete-orphan")


class ProjectMedia(Base, TimestampMixin):
    """Media asset linked to a project."""

    __tablename__ = "project_media"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    file_id: Mapped[str] = mapped_column(String(36), nullable=False)
    file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    media_type: Mapped[str] = mapped_column(String(50), default="IMAGE", nullable=False)

    # Relationships
    project = relationship("Project", back_populates="media")


class ProjectFeedback(Base, TimestampMixin):
    """Detailed mentor/principal remarks on a project."""

    __tablename__ = "project_feedback"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    feedback_text: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="feedback_entries")
    author = relationship("User", foreign_keys=[author_id])
