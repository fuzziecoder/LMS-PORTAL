'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, UploadCloud, FileText, CheckCircle2, Award, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FIXTURE_ASSIGNMENTS } from '@/lib/fixtures/assignments';

export default function StudentAssignmentSubmitPage({ params }: { params: { assignmentId: string } }) {
  const router = useRouter();
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };
  const assignment = FIXTURE_ASSIGNMENTS.find((a) => a.id === params.assignmentId) || FIXTURE_ASSIGNMENTS[0];
  const [submissionText, setSubmissionText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AppShell session={session}>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/student/assignments')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground-strong"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </button>

        {/* Assignment Brief */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                {assignment.course_title}
              </span>
              <h1 className="text-xl font-bold text-foreground-strong mt-1">{assignment.title}</h1>
            </div>
            <span className="text-xs font-semibold text-danger-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Due: {new Date(assignment.due_at).toLocaleDateString()}
            </span>
          </div>

          <div className="text-xs text-foreground-muted leading-relaxed">
            <h3 className="font-bold text-foreground-strong mb-1">Instructions:</h3>
            <p>{assignment.instructions}</p>
          </div>

          {assignment.teacher_feedback && (
            <div className="p-4 rounded-lg bg-success-50 border border-success-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-success-800">
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Evaluated Grade: {assignment.student_score} / {assignment.max_marks}</span>
              </div>
              <p className="text-success-700 italic">"{assignment.teacher_feedback}"</p>
            </div>
          )}
        </div>

        {/* Submission Form */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-foreground-strong">Your Submission</h2>

          {submitted ? (
            <div className="p-6 rounded-lg bg-success-50 border border-success-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-success-600 mx-auto" />
              <h3 className="font-bold text-sm text-foreground-strong">Assignment Submitted Successfully</h3>
              <p className="text-xs text-foreground-muted">Your code files and solution notes have been submitted to your teacher for evaluation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground-strong uppercase tracking-wider mb-2">
                  Solution Notes & Code Explanation
                </label>
                <textarea
                  rows={5}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Paste code summary, algorithm description, or GitHub repository URL..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600 font-mono"
                />
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-border hover:border-primary-600 rounded-xl p-6 text-center cursor-pointer transition-colors bg-surface-subtle">
                <UploadCloud className="w-8 h-8 text-foreground-subtle mx-auto mb-2" />
                <span className="font-semibold text-xs text-foreground-strong block">Upload Solution Script or Zip Archive</span>
                <span className="text-[11px] text-foreground-subtle">.py, .zip, .pdf up to 25 MB</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold shadow-card hover:bg-primary-700"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}
