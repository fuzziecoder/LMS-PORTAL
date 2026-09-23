"""
GCLMS API — Reports Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ReportExportRequest(BaseModel):
    report_type: str  # ACADEMIC_SUMMARY, ATTENDANCE_LOG, FACULTY_WORKLOAD, PROJECTS_REGISTRY
    class_id: str | None = None
    student_id: str | None = None
    format: str = "CSV"


class ReportExportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    report_type: str
    file_id: str | None = None
    download_url: str | None = None
    format: str
    status: str
    created_at: datetime
