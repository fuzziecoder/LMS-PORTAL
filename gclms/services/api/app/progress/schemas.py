"""
GCLMS API — Course Progress & At-Risk Analytics Schemas
"""

from pydantic import BaseModel, Field


class CourseProgressBreakdown(BaseModel):
    """50/25/25 Course Progress Formula:
    50% lesson completion + 25% assignment completion + 25% quiz completion.
    """
    lesson_completion_percent: float = Field(..., description="Completed published lessons / total published lessons * 100")
    assignment_completion_percent: float = Field(..., description="Submitted required assignments / total required assignments * 100")
    quiz_completion_percent: float = Field(..., description="Completed required quizzes / total required quizzes * 100")
    overall_course_progress: float = Field(..., description="50% lessons + 25% assignments + 25% quizzes")


class StudentProgressSummary(BaseModel):
    student_id: str
    student_name: str
    class_name: str
    section_name: str
    course_id: str
    course_title: str
    progress: CourseProgressBreakdown
    attendance_rate: float
    is_at_risk: bool = False
    risk_reasons: list[str] = Field(default_factory=list)


class ClassProgressSummary(BaseModel):
    class_id: str
    class_name: str
    section_id: str
    section_name: str
    enrolled_count: int
    avg_lesson_completion: float
    avg_assignment_completion: float
    avg_quiz_completion: float
    avg_course_progress: float
    avg_attendance_rate: float
    at_risk_count: int = 0
