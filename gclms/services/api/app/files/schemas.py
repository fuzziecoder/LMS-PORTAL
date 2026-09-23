"""
GCLMS API — File Storage Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class PresignUploadRequest(BaseModel):
    file_name: str = Field(..., max_length=255)
    mime_type: str = Field(..., max_length=100)
    size_bytes: int = Field(..., gt=0, le=50 * 1024 * 1024)  # 50MB max limit
    folder: str = "general"


class PresignUploadResponse(BaseModel):
    upload_url: str
    storage_key: str
    file_id: str
    expires_in_seconds: int = 900


class CompleteUploadRequest(BaseModel):
    file_id: str
    storage_key: str
    file_name: str
    mime_type: str
    size_bytes: int


class FileDownloadUrlResponse(BaseModel):
    file_id: str
    file_name: str
    download_url: str
    expires_in_seconds: int = 3600
