"""
GCLMS API — Announcements Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.common.models import AnnouncementAudience, AnnouncementStatus


class AnnouncementCreate(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    audience: AnnouncementAudience = AnnouncementAudience.ALL
    target_class_id: str | None = None
    is_pinned: bool = False
    status: AnnouncementStatus = AnnouncementStatus.PUBLISHED


class AnnouncementUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    audience: AnnouncementAudience | None = None
    target_class_id: str | None = None
    is_pinned: bool | None = None
    status: AnnouncementStatus | None = None


class AnnouncementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    author_id: str
    author_name: str | None = None
    title: str
    content: str
    audience: AnnouncementAudience
    target_class_id: str | None = None
    is_pinned: bool
    status: AnnouncementStatus
    created_at: datetime
