"""
GCLMS API — Courses & Lessons Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.common.models import CourseStatus, LessonType


class CourseCreate(BaseModel):
    code: str = Field(..., max_length=50)
    title: str = Field(..., max_length=255)
    description: str | None = None
    subject_id: str | None = None
    teacher_id: str | None = None
    thumbnail_gradient: str | None = None


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    teacher_id: str | None = None
    subject_id: str | None = None
    status: CourseStatus | None = None
    thumbnail_gradient: str | None = None


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    code: str
    title: str
    description: str | None = None
    subject_id: str | None = None
    teacher_id: str | None = None
    teacher_name: str | None = None
    status: CourseStatus
    thumbnail_gradient: str | None = None
    created_at: datetime
    modules_count: int = 0
    lessons_count: int = 0
    enrolled_students: int = 0
    completion_rate: float = 0.0


class ModuleCreate(BaseModel):
    title: str = Field(..., max_length=255)
    order: int = 0


class ModuleUpdate(BaseModel):
    title: str | None = None
    order: int | None = None


class ModuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    course_id: str
    title: str
    order: int
    created_at: datetime
    lessons: list[dict] = Field(default_factory=list)


class LessonCreate(BaseModel):
    module_id: str
    title: str = Field(..., max_length=255)
    type: LessonType = LessonType.TEXT
    content: str | None = None
    video_url: str | None = None
    duration_minutes: int = 30
    order: int = 0
    is_published: bool = False


class LessonUpdate(BaseModel):
    title: str | None = None
    type: LessonType | None = None
    content: str | None = None
    video_url: str | None = None
    duration_minutes: int | None = None
    order: int | None = None
    is_published: bool | None = None


class LessonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    course_id: str
    module_id: str
    title: str
    order: int
    type: LessonType
    content: str | None = None
    video_url: str | None = None
    duration_minutes: int
    is_published: bool
    created_at: datetime
