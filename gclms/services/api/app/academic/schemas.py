"""
GCLMS API — Academic Schemas
"""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class AcademicYearCreate(BaseModel):
    name: str = Field(..., max_length=100)
    start_date: date
    end_date: date
    is_active: bool = True


class AcademicYearUpdate(BaseModel):
    name: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_active: bool | None = None


class AcademicYearResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    name: str
    start_date: date
    end_date: date
    is_active: bool
    created_at: datetime


class ClassCreate(BaseModel):
    academic_year_id: str
    name: str = Field(..., max_length=100)
    grade_level: str = Field(..., max_length=50)
    room_number: str | None = None


class ClassUpdate(BaseModel):
    name: str | None = None
    grade_level: str | None = None
    room_number: str | None = None


class ClassResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    academic_year_id: str
    name: str
    grade_level: str
    room_number: str | None = None
    created_at: datetime


class SectionCreate(BaseModel):
    class_id: str
    name: str = Field(..., max_length=50)


class SectionUpdate(BaseModel):
    name: str | None = None


class SectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    class_id: str
    name: str
    created_at: datetime


class SubjectCreate(BaseModel):
    code: str = Field(..., max_length=50)
    name: str = Field(..., max_length=200)
    department: str = Field(..., max_length=100)
    weekly_hours: int = 4
    head_faculty_id: str | None = None


class SubjectUpdate(BaseModel):
    name: str | None = None
    department: str | None = None
    weekly_hours: int | None = None
    head_faculty_id: str | None = None
    status: str | None = None


class SubjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    code: str
    name: str
    department: str
    weekly_hours: int
    head_faculty_id: str | None = None
    status: str
    created_at: datetime


class StudentEnrollmentCreate(BaseModel):
    student_id: str
    class_id: str
    section_id: str
    academic_year_id: str
    roll_number: str | None = None


class StudentEnrollmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    student_id: str
    class_id: str
    section_id: str
    academic_year_id: str
    roll_number: str | None = None
    status: str
    created_at: datetime


class TeacherAssignmentCreate(BaseModel):
    teacher_id: str
    class_id: str | None = None
    section_id: str | None = None
    subject_id: str | None = None
    course_id: str | None = None
    role_type: str = "PRIMARY_INSTRUCTOR"


class TeacherAssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    teacher_id: str
    class_id: str | None = None
    section_id: str | None = None
    subject_id: str | None = None
    course_id: str | None = None
    role_type: str
    created_at: datetime
