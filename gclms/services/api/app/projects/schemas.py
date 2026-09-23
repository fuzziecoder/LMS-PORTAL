"""
GCLMS API — Projects Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.common.models import ProjectApprovalStatus, ProjectStatus


class ProjectCreate(BaseModel):
    title: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    short_description: str = Field(..., max_length=500)
    full_description: str
    technologies: list[str] = Field(default_factory=list)
    github_url: str | None = None
    demo_url: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    short_description: str | None = None
    full_description: str | None = None
    technologies: list[str] | None = None
    github_url: str | None = None
    demo_url: str | None = None
    status: ProjectStatus | None = None


class ProjectFeedbackCreate(BaseModel):
    feedback_text: str = Field(..., min_length=3)


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    student_id: str
    student_name: str | None = None
    school_name: str | None = None
    title: str
    category: str
    short_description: str
    full_description: str
    technologies: list[str]
    github_url: str | None = None
    demo_url: str | None = None
    status: ProjectStatus
    approval_status: ProjectApprovalStatus
    teacher_feedback: str | None = None
    created_at: datetime
    updated_at: datetime
