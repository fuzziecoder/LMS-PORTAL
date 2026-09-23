"""
GCLMS API — Quizzes and Assessments Models
"""

from datetime import datetime
from sqlalchemy import Boolean, DateTime, Enum as SQLEnum, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common.models import QuestionType, QuizStatus, SoftDeleteMixin, TimestampMixin, generate_uuid
from app.database import Base


class Quiz(Base, TimestampMixin, SoftDeleteMixin):
    """Timed Quiz Assessment entity."""

    __tablename__ = "quizzes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    school_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=20, nullable=False)
    pass_percentage: Mapped[int] = mapped_column(Integer, default=70, nullable=False)
    max_attempts: Mapped[int] = mapped_column(Integer, default=2, nullable=False)

    status: Mapped[QuizStatus] = mapped_column(
        SQLEnum(QuizStatus),
        default=QuizStatus.DRAFT,
        nullable=False,
        index=True,
    )

    # Relationships
    course = relationship("Course", back_populates="quizzes")
    teacher = relationship("User", foreign_keys=[teacher_id])
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan", order_by="QuizQuestion.order")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base, TimestampMixin):
    """Question item inside a Quiz."""

    __tablename__ = "quiz_questions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    quiz_id: Mapped[str] = mapped_column(String(36), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)

    type: Mapped[QuestionType] = mapped_column(
        SQLEnum(QuestionType),
        default=QuestionType.MULTIPLE_CHOICE,
        nullable=False,
    )
    points: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.order")


class QuestionOption(Base, TimestampMixin):
    """Selectable option for multiple-choice or true/false questions."""

    __tablename__ = "question_options"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    question_id: Mapped[str] = mapped_column(String(36), ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    option_text: Mapped[str] = mapped_column(Text, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    question = relationship("QuizQuestion", back_populates="options")


class QuizAttempt(Base, TimestampMixin):
    """Student attempt at a Quiz."""

    __tablename__ = "quiz_attempts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    quiz_id: Mapped[str] = mapped_column(String(36), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    attempt_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="COMPLETED", nullable=False)

    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")
    student = relationship("User", foreign_keys=[student_id])
    answers = relationship("QuizAnswer", back_populates="attempt", cascade="all, delete-orphan")


class QuizAnswer(Base, TimestampMixin):
    """Submitted response to a specific question."""

    __tablename__ = "quiz_answers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    attempt_id: Mapped[str] = mapped_column(String(36), ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id: Mapped[str] = mapped_column(String(36), ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_option_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    short_answer_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    points_awarded: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    attempt = relationship("QuizAttempt", back_populates="answers")
