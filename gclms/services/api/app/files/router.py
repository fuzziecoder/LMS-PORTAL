"""
GCLMS API — File Storage Router
Presigned upload and download URLs for private MinIO/S3 file management.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.service import AuthenticatedUserContext
from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user
from app.files.models import FileMetadata
from app.files.schemas import CompleteUploadRequest, FileDownloadUrlResponse, PresignUploadRequest, PresignUploadResponse

router = APIRouter()
settings = get_settings()


@router.post("/presign-upload", response_model=PresignUploadResponse)
async def presign_upload(
    payload: PresignUploadRequest,
    current_user: AuthenticatedUserContext = Depends(get_current_user),
):
    """Generate a presigned upload URL and reservation ID for private file storage."""
    file_id = str(uuid.uuid4())
    storage_key = f"{current_user.school_id or 'global'}/{payload.folder}/{file_id}_{payload.file_name}"
    upload_url = f"{settings.s3_public_endpoint}/{settings.s3_bucket}/{storage_key}"

    return {
        "upload_url": upload_url,
        "storage_key": storage_key,
        "file_id": file_id,
        "expires_in_seconds": 900,
    }


@router.post("/complete-upload")
async def complete_upload(
    payload: CompleteUploadRequest,
    current_user: AuthenticatedUserContext = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Register uploaded file metadata in the database."""
    meta = FileMetadata(
        id=payload.file_id,
        school_id=current_user.school_id,
        uploaded_by_id=current_user.id,
        bucket_name=settings.s3_bucket,
        storage_key=payload.storage_key,
        file_name=payload.file_name,
        mime_type=payload.mime_type,
        size_bytes=payload.size_bytes,
    )
    db.add(meta)
    await db.commit()
    return {"data": {"file_id": meta.id, "message": "File metadata registered successfully."}}


@router.get("/{file_id}/download-url", response_model=FileDownloadUrlResponse)
async def get_download_url(
    file_id: str,
    current_user: AuthenticatedUserContext = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate secure temporary download URL for an authorized user."""
    meta = await db.get(FileMetadata, file_id)
    if not meta:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")

    if current_user.role != "FOUNDER" and meta.school_id and meta.school_id != current_user.school_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to file outside school scope.")

    download_url = f"{settings.s3_public_endpoint}/{meta.bucket_name}/{meta.storage_key}"
    return {
        "file_id": meta.id,
        "file_name": meta.file_name,
        "download_url": download_url,
        "expires_in_seconds": 3600,
    }
