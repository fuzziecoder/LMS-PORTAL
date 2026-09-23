"""
GCLMS API — Academic Progress & Calculation Domain Service
Strictly implements the official GCLMS Progress Formula and Attendance Weighting.
"""

from app.progress.schemas import CourseProgressBreakdown


def calculate_course_progress(
    completed_lessons: int,
    total_lessons: int,
    submitted_assignments: int,
    total_assignments: int,
    completed_quizzes: int,
    total_quizzes: int,
) -> CourseProgressBreakdown:
    """Calculates official GCLMS Course Progress:
    - 50% lesson completion
    - 25% assignment completion
    - 25% quiz completion
    
    Course progress is independent of attendance and gradebook marks.
    """
    lesson_pct = (completed_lessons / total_lessons * 100.0) if total_lessons > 0 else 0.0
    assignment_pct = (submitted_assignments / total_assignments * 100.0) if total_assignments > 0 else 0.0
    quiz_pct = (completed_quizzes / total_quizzes * 100.0) if total_quizzes > 0 else 0.0

    # Clamp percentages between 0 and 100
    lesson_pct = min(max(lesson_pct, 0.0), 100.0)
    assignment_pct = min(max(assignment_pct, 0.0), 100.0)
    quiz_pct = min(max(quiz_pct, 0.0), 100.0)

    overall = (lesson_pct * 0.50) + (assignment_pct * 0.25) + (quiz_pct * 0.25)

    return CourseProgressBreakdown(
        lesson_completion_percent=round(lesson_pct, 1),
        assignment_completion_percent=round(assignment_pct, 1),
        quiz_completion_percent=round(quiz_pct, 1),
        overall_course_progress=round(overall, 1),
    )


def calculate_attendance_rate(
    present_count: int,
    late_count: int,
    absent_count: int,
    excused_count: int = 0,
) -> float:
    """Calculates official Attendance Percentage:
    - Present = 1.0 weight
    - Late = 0.75 weight
    - Absent = 0.0 weight
    - Excused = excluded from denominator
    """
    effective_total = present_count + late_count + absent_count
    if effective_total == 0:
        return 100.0  # Default to 100% if no unexcused sessions exist yet

    weighted_present = (present_count * 1.0) + (late_count * 0.75)
    rate = (weighted_present / effective_total) * 100.0
    return round(min(max(rate, 0.0), 100.0), 1)


def evaluate_at_risk_status(
    course_progress: float,
    attendance_rate: float,
    overdue_assignments_count: int,
    min_attendance_threshold: float = 75.0,
    min_progress_threshold: float = 50.0,
) -> tuple[bool, list[str]]:
    """Explicit algorithmic evaluation of student academic risk.
    Non-opaque, auditable, and driven by hard data metrics.
    """
    reasons = []

    if attendance_rate < min_attendance_threshold:
        reasons.append(f"Low attendance rate ({attendance_rate}% < {min_attendance_threshold}%)")

    if course_progress < min_progress_threshold:
        reasons.append(f"Lagging course progress ({course_progress}% < {min_progress_threshold}%)")

    if overdue_assignments_count >= 2:
        reasons.append(f"{overdue_assignments_count} overdue/unsubmitted practical assignments")

    is_at_risk = len(reasons) > 0
    return is_at_risk, reasons
