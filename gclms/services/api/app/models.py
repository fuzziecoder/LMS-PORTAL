"""
GCLMS API — Centralized Model Registry
Imports all domain models to ensure SQLAlchemy and Alembic metadata completeness.
"""

from app.academic.models import AcademicYear, Class, Section, StudentEnrollment, Subject, TeacherAssignment
from app.announcements.models import Announcement
from app.assignments.models import Assignment, AssignmentSubmission, SubmissionFile
from app.attendance.models import AttendanceRecord, AttendanceSession
from app.audit.models import AuditLog
from app.auth.models import RefreshToken
from app.common.models import (
    AnnouncementAudience,
    AnnouncementStatus,
    AssignmentStatus,
    AttendanceSessionStatus,
    AttendanceStatus,
    CourseStatus,
    LessonType,
    ProjectApprovalStatus,
    ProjectStatus,
    QuestionType,
    QuizStatus,
    SchoolStatus,
    SubmissionStatus,
    UserRole,
    UserStatus,
)
from app.courses.models import Course, CourseEnrollment, CourseModule, Lesson, LessonProgress, Resource
from app.files.models import FileMetadata
from app.grades.models import GradeRecord
from app.notifications.models import Notification
from app.projects.models import Project, ProjectFeedback, ProjectMedia
from app.quizzes.models import QuestionOption, Quiz, QuizAnswer, QuizAttempt, QuizQuestion
from app.reports.models import ReportExport
from app.schools.models import School
from app.settings.models import SchoolSettings
from app.users.models import SchoolMembership, User

__all__ = [
    "AcademicYear",
    "Class",
    "Section",
    "Subject",
    "StudentEnrollment",
    "TeacherAssignment",
    "Announcement",
    "AnnouncementAudience",
    "AnnouncementStatus",
    "Assignment",
    "AssignmentStatus",
    "AssignmentSubmission",
    "SubmissionStatus",
    "SubmissionFile",
    "AttendanceSession",
    "AttendanceSessionStatus",
    "AttendanceRecord",
    "AttendanceStatus",
    "AuditLog",
    "RefreshToken",
    "Course",
    "CourseStatus",
    "CourseModule",
    "Lesson",
    "LessonType",
    "LessonProgress",
    "Resource",
    "CourseEnrollment",
    "FileMetadata",
    "GradeRecord",
    "Notification",
    "Project",
    "ProjectStatus",
    "ProjectApprovalStatus",
    "ProjectMedia",
    "ProjectFeedback",
    "Quiz",
    "QuizStatus",
    "QuizQuestion",
    "QuestionType",
    "QuestionOption",
    "QuizAttempt",
    "QuizAnswer",
    "ReportExport",
    "School",
    "SchoolStatus",
    "SchoolSettings",
    "User",
    "UserRole",
    "UserStatus",
    "SchoolMembership",
]
