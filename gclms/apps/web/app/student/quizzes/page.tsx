'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { HelpCircle, Clock, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { FIXTURE_QUIZZES } from '@/lib/fixtures/assignments';

export default function StudentQuizzesPage() {
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Interactive Quizzes & Assessments</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Attempt timed module evaluations, MCQ assessments, and instant concept checks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FIXTURE_QUIZZES.map((quiz) => (
            <div key={quiz.id} className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col justify-between hover:shadow-elevated transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-100">
                    {quiz.course_title}
                  </span>
                  <span className="text-xs text-foreground-subtle flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {quiz.duration_minutes} Mins
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground-strong">{quiz.title}</h3>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border text-xs">
                  <div>
                    <span className="text-foreground-subtle block">Questions:</span>
                    <strong className="text-foreground-strong">{quiz.questions_count} Questions</strong>
                  </div>
                  <div>
                    <span className="text-foreground-subtle block">Pass Threshold:</span>
                    <strong className="text-foreground-strong">{quiz.pass_percentage}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                {quiz.my_score !== undefined ? (
                  <div className="flex items-center gap-1.5 text-xs text-success-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Past Score: {quiz.my_score}%
                  </div>
                ) : (
                  <span className="text-xs text-warning-700 font-semibold">Not Attempted</span>
                )}

                <a
                  href={`/student/quizzes/${quiz.id}`}
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-card inline-flex items-center gap-1.5"
                >
                  {quiz.my_score !== undefined ? 'Retake Quiz' : 'Start Quiz'} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
