"""
GCLMS — Common Utilities

Shared helpers, response models, pagination, error handling, and enums.
"""

import uuid
from datetime import datetime, timezone

from pydantic import BaseModel, Field


class APIResponse(BaseModel):
    """Standard API success response wrapper."""
    data: dict | list | None = None
    meta: dict = Field(default_factory=lambda: {"request_id": str(uuid.uuid4())})


class PaginatedResponse(BaseModel):
    """Standard paginated API response wrapper."""
    data: list = Field(default_factory=list)
    pagination: dict = Field(default_factory=dict)
    meta: dict = Field(default_factory=lambda: {"request_id": str(uuid.uuid4())})


class APIError(BaseModel):
    """Standard API error response."""
    error: dict


class PaginationParams(BaseModel):
    """Common pagination query parameters."""
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


def utc_now() -> datetime:
    """Return the current UTC datetime (timezone-aware)."""
    return datetime.now(timezone.utc)


def generate_uuid() -> str:
    """Generate a new UUID4 string."""
    return str(uuid.uuid4())
