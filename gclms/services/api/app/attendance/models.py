"""
GCLMS API — Attendance Sessions and Roll Call Records Models
"""

from datetime import date as dt_date, datetime
from sqlalchemy import Date, DateTime, Enum as SQLEnum, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import AttendanceSessionStatus, AttendanceStatus, TimestampMixin, generate_uuid
from app.database import Base


class AttendanceSession(Base, TimestampMixin):
    """Daily or period-based attendance session for a Class Section."""

    __tablename__ = "attendance_sessions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False, index=True)
    section_id: Mapped[str] = mapped_column(String(36), ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date: Mapped[dt_date] = mapped_column(Date, nullable=False, index=True)

    status: Mapped[AttendanceSessionStatus] = mapped_column(
        SQLEnum(AttendanceSessionStatus),
        default=AttendanceSessionStatus.DRAFT,
        nullable=False,
    )
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("class_id", "section_id", "date", name="uq_attendance_class_section_date"),
        Index("ix_attendance_sessions_lookup", "school_id", "date", "class_id", "section_id"),
    )

    # Relationships
    class_ref = relationship("Class", foreign_keys=[class_id])
    section_ref = relationship("Section", foreign_keys=[section_id])
    teacher = relationship("User", foreign_keys=[teacher_id])
    records = relationship("AttendanceRecord", back_populates="session", cascade="all, delete-orphan")


class AttendanceRecord(Base, TimestampMixin):
    """Individual student attendance mark within a session."""

    __tablename__ = "attendance_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    status: Mapped[AttendanceStatus] = mapped_column(
        SQLEnum(AttendanceStatus),
        default=AttendanceStatus.PRESENT,
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint("session_id", "student_id", name="uq_session_student_attendance"),
        Index("ix_attendance_records_student_status", "student_id", "status"),
    )

    # Relationships
    session = relationship("AttendanceSession", back_populates="records")
    student = relationship("User", foreign_keys=[student_id])
