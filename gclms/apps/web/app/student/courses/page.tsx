'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { BookOpen, Clock, ArrowRight, CheckCircle, PlayCircle } from 'lucide-react';
import { FIXTURE_COURSES } from '@/lib/fixtures/courses';

export default function StudentCoursesPage() {
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">My Enrolled Courses</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Access your interactive video lessons, code challenges, and learning resources.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FIXTURE_COURSES.slice(0, 3).map((course) => (
            <div key={course.id} className="bg-surface rounded-xl border border-border shadow-card overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-all">
              <div>
                <div className={`p-4 bg-gradient-to-r ${course.thumbnail_gradient || 'from-primary-600 to-primary-800'} text-white`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 text-white">
                    {course.subject}
                  </span>
                  <h3 className="font-bold text-base mt-2">{course.title}</h3>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-foreground-muted line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground-strong mb-1.5">
                      <span>Course Progress</span>
                      <span>{course.completion_rate}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full" style={{ width: `${course.completion_rate}%` }} />
                    </div>
                  </div>

                  <div className="text-[11px] text-foreground-subtle flex items-center justify-between pt-2 border-t border-border">
                    <span>Teacher: <strong>{course.teacher_name}</strong></span>
                    <span>{course.lessons_count} Lessons</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-surface-subtle">
                <a
                  href={`/student/courses/${course.id}`}
                  className="w-full py-2 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-card"
                >
                  Continue Course <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
