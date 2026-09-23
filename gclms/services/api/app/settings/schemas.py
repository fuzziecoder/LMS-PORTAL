"""
GCLMS API — School Settings Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class SchoolSettingsUpdate(BaseModel):
    academic_term: str | None = None
    min_attendance_threshold: float | None = Field(None, ge=0, le=100)
    assignment_weight_percent: float | None = Field(None, ge=0, le=100)
    quiz_weight_percent: float | None = Field(None, ge=0, le=100)
    attendance_weight_percent: float | None = Field(None, ge=0, le=100)
    notify_parents_on_absence: bool | None = None
    allow_student_project_submissions: bool | None = None


class SchoolSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    academic_term: str
    min_attendance_threshold: float
    assignment_weight_percent: float
    quiz_weight_percent: float
    attendance_weight_percent: float
    notify_parents_on_absence: bool
    allow_student_project_submissions: bool
    auto_lock_attendance_days: int
    updated_at: datetime
