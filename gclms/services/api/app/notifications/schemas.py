"""
GCLMS API — Notifications Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool
    link_url: str | None = None
    created_at: datetime
