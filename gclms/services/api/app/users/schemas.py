"""
GCLMS API — User & Student Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.common.models import UserRole, UserStatus


class UserBase(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr
    phone: str | None = None
    bio: str | None = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: UserRole
    school_id: str | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    status: UserStatus | None = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    avatar_url: str | None = None
    status: UserStatus
    last_login_at: datetime | None = None
    created_at: datetime


class StudentCreate(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr
    password: str = Field("Password123!", min_length=8)
    class_id: str
    section_id: str
    academic_year_id: str | None = None
    roll_number: str | None = None


class TeacherCreate(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr
    password: str = Field("Password123!", min_length=8)
    department: str | None = None


class StudentDossierResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    status: str
    school_id: str | None = None
    school_name: str | None = None
    class_name: str | None = None
    section_name: str | None = None
    roll_number: str | None = None

    attendance_percentage: float = 0.0
    course_progress_percentage: float = 0.0
    gpa_average: float = 0.0

    enrolled_courses: list[dict] = Field(default_factory=list)
    recent_submissions: list[dict] = Field(default_factory=list)
    quiz_attempts: list[dict] = Field(default_factory=list)
    projects: list[dict] = Field(default_factory=list)
