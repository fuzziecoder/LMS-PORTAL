'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, CheckCircle2, Play, Code2, BookOpen, Terminal, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentLessonViewerPage({ params }: { params: { lessonId: string } }) {
  const router = useRouter();
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <AppShell session={session}>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/student/courses/python-101')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground-strong"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Python Programming Course
        </button>

        {/* Lesson Video / Media Frame */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-elevated border border-slate-800 text-white relative aspect-video flex flex-col items-center justify-center p-8">
          <div className="h-16 w-16 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Interactive Video Lecture: Python Functions & Scope</span>
            <span>Duration: 25:00</span>
          </div>
        </div>

        {/* Lesson Content & Code Challenge */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Module 3 • Lesson 7</span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground-strong mt-1">Defining Functions & Return Values</h1>
            </div>
            <button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-card ${isCompleted ? 'bg-success-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
            >
              <CheckCircle2 className="w-4 h-4" /> {isCompleted ? 'Completed ✓' : 'Mark as Completed'}
            </button>
          </div>

          <div className="prose prose-sm text-foreground-muted text-xs leading-relaxed space-y-4">
            <p>
              In Python, a function is a block of code which only runs when it is called. You can pass data, known as parameters, into a function. A function can return data as a result using the <code className="text-primary-600 font-mono bg-surface-subtle px-1.5 py-0.5 rounded">return</code> statement.
            </p>

            <h3 className="text-sm font-bold text-foreground-strong">Example Syntax:</h3>
            <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
{`def calculate_sensor_average(readings: list[float]) -> float:
    """Calculates moving average from IoT sensor readings."""
    if not readings:
        return 0.0
    return sum(readings) / len(readings)

# Test function
sensor_data = [24.5, 25.1, 24.8, 26.0]
avg = calculate_sensor_average(sensor_data)
print(f"Average Sensor Temperature: {avg:.2f}°C")`}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
