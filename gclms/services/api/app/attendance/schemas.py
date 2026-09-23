"""
GCLMS API — Attendance Schemas
"""

from datetime import date as dt_date, datetime
from pydantic import BaseModel, ConfigDict, Field

from app.common.models import AttendanceSessionStatus, AttendanceStatus


class AttendanceRecordItem(BaseModel):
    student_id: str
    status: AttendanceStatus = AttendanceStatus.PRESENT
    notes: str | None = None


class AttendanceSessionCreate(BaseModel):
    class_id: str
    section_id: str
    date: dt_date
    records: list[AttendanceRecordItem] = Field(default_factory=list)


class AttendanceSessionUpdate(BaseModel):
    records: list[AttendanceRecordItem]


class AttendanceRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    student_id: str
    student_name: str | None = None
    status: AttendanceStatus
    notes: str | None = None


class AttendanceSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    class_id: str
    class_name: str | None = None
    section_id: str
    section_name: str | None = None
    teacher_id: str
    teacher_name: str | None = None
    date: dt_date
    status: AttendanceSessionStatus
    submitted_at: datetime | None = None
    records: list[AttendanceRecordResponse] = Field(default_factory=list)
    present_count: int = 0
    absent_count: int = 0
    late_count: int = 0
    excused_count: int = 0
    attendance_rate: float = 0.0


class AttendanceSummaryRow(BaseModel):
    class_id: str
    class_name: str
    section_id: str
    section_name: str
    total_enrolled: int
    present: int
    absent: int
    late: int
    excused: int
    rate_percentage: float
    marked_by: str | None = None
