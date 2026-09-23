"""
GCLMS API — Quizzes Schemas
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.common.models import QuestionType, QuizStatus


class QuestionOptionCreate(BaseModel):
    option_text: str
    is_correct: bool = False
    order: int = 0


class QuestionOptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    option_text: str
    order: int
    # Note: is_correct is intentionally excluded in public response to avoid cheating leaks


class QuestionOptionTeacherResponse(QuestionOptionResponse):
    is_correct: bool


class QuestionCreate(BaseModel):
    prompt: str
    type: QuestionType = QuestionType.MULTIPLE_CHOICE
    points: int = 10
    order: int = 0
    explanation: str | None = None
    options: list[QuestionOptionCreate] = Field(default_factory=list)


class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    prompt: str
    type: QuestionType
    points: int
    order: int
    explanation: str | None = None
    options: list[QuestionOptionTeacherResponse] = Field(default_factory=list)


class QuizCreate(BaseModel):
    course_id: str
    title: str = Field(..., max_length=255)
    duration_minutes: int = 20
    pass_percentage: int = 70
    max_attempts: int = 2
    status: QuizStatus = QuizStatus.DRAFT


class QuizUpdate(BaseModel):
    title: str | None = None
    duration_minutes: int | None = None
    pass_percentage: int | None = None
    max_attempts: int | None = None
    status: QuizStatus | None = None


class QuizResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    school_id: str
    course_id: str
    course_title: str | None = None
    teacher_id: str
    title: str
    duration_minutes: int
    pass_percentage: int
    max_attempts: int
    status: QuizStatus
    created_at: datetime
    questions_count: int = 0
    attempts_count: int = 0
    average_score: float | None = None


class QuizAttemptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    quiz_id: str
    student_id: str
    student_name: str | None = None
    attempt_number: int
    score: float
    passed: bool
    started_at: datetime
    completed_at: datetime | None = None
    status: str
