"""
GCLMS API — Progress & Attendance Calculation Formula Unit & Integration Tests
"""

import pytest
from app.progress.service import calculate_attendance_rate, calculate_course_progress, evaluate_at_risk_status


def test_course_progress_formula_50_25_25():
    """Validates:
    Course Progress = 50% lesson completion + 25% assignment completion + 25% quiz completion.
    """
    # 8 of 10 lessons completed -> 80% * 0.50 = 40.0
    # 2 of 4 assignments completed -> 50% * 0.25 = 12.5
    # 3 of 3 quizzes completed -> 100% * 0.25 = 25.0
    # Total = 40.0 + 12.5 + 25.0 = 77.5%
    breakdown = calculate_course_progress(
        completed_lessons=8,
        total_lessons=10,
        submitted_assignments=2,
        total_assignments=4,
        completed_quizzes=3,
        total_quizzes=3,
    )
    assert breakdown.lesson_completion_percent == 80.0
    assert breakdown.assignment_completion_percent == 50.0
    assert breakdown.quiz_completion_percent == 100.0
    assert breakdown.overall_course_progress == 77.5


def test_attendance_rate_weighting_formula():
    """Validates:
    Present = 1.0, Late = 0.75, Absent = 0.0, Excused = excluded from denominator.
    """
    # Present = 18, Late = 2, Absent = 1, Excused = 2
    # Weighted Present = 18 * 1.0 + 2 * 0.75 = 18 + 1.5 = 19.5
    # Denominator = 18 + 2 + 1 = 21
    # Rate = (19.5 / 21) * 100 = 92.857... -> 92.9%
    rate = calculate_attendance_rate(
        present_count=18,
        late_count=2,
        absent_count=1,
        excused_count=2,
    )
    assert rate == 92.9


def test_at_risk_evaluation_criteria():
    """Validates explicit, non-opaque at-risk triggers."""
    # Low attendance trigger
    is_at_risk, reasons = evaluate_at_risk_status(
        course_progress=80.0,
        attendance_rate=68.0,
        overdue_assignments_count=0,
    )
    assert is_at_risk is True
    assert any("Low attendance rate" in r for r in reasons)

    # Clean student
    clean_risk, clean_reasons = evaluate_at_risk_status(
        course_progress=85.0,
        attendance_rate=95.0,
        overdue_assignments_count=0,
    )
    assert clean_risk is False
    assert len(clean_reasons) == 0
