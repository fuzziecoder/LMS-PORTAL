"""
GCLMS API — File Storage Metadata Models
"""

from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import TimestampMixin, generate_uuid
from app.database import Base


class FileMetadata(Base, TimestampMixin):
    """Metadata record for files securely stored in MinIO/S3."""

    __tablename__ = "file_metadata"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=True, index=True)
    uploaded_by_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    bucket_name: Mapped[str] = mapped_column(String(100), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(500), unique=True, nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    uploaded_by = relationship("User", foreign_keys=[uploaded_by_id])
