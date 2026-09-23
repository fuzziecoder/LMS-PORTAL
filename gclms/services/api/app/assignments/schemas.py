"""
GCLMS API — Assignments & Submissions Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.common.models import AssignmentStatus, SubmissionStatus


class AssignmentCreate(BaseModel):
    course_id: str
    target_class_id: str | None = None
    title: str = Field(..., max_length=255)
    instructions: str
    due_at: datetime
    max_marks: int = 100
    allow_late: bool = True
    status: AssignmentStatus = AssignmentStatus.DRAFT


class AssignmentUpdate(BaseModel):
    title: str | None = None
    instructions: str | None = None
    due_at: datetime | None = None
    max_marks: int | None = None
    allow_late: bool | None = None
    status: AssignmentStatus | None = None
    target_class_id: str | None = None


class AssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    course_id: str
    course_title: str | None = None
    teacher_id: str
    teacher_name: str | None = None
    target_class_id: str | None = None
    target_class_name: str | None = None
    title: str
    instructions: str
    due_at: datetime
    max_marks: int
    allow_late: bool
    status: AssignmentStatus
    created_at: datetime
    submissions_count: int = 0
    graded_count: int = 0


class SubmissionCreate(BaseModel):
    code_content: str | None = None
    file_ids: list[str] = Field(default_factory=list)


class SubmissionGradeUpdate(BaseModel):
    score: float = Field(..., ge=0)
    teacher_feedback: str | None = None


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assignment_id: str
    assignment_title: str | None = None
    student_id: str
    student_name: str | None = None
    student_email: str | None = None
    submitted_at: datetime
    code_content: str | None = None
    status: SubmissionStatus
    score: float | None = None
    teacher_feedback: str | None = None
    graded_by_id: str | None = None
    graded_at: datetime | None = None
