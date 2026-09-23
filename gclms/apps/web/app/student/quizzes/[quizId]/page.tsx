'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { ArrowLeft, Clock, CheckCircle2, Award, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuizAttemptPage({ params }: { params: { quizId: string } }) {
  const router = useRouter();
  const session = { id: 'student', name: 'Tharun V.', email: 'student.tharun.chennai@gclms.local', role: 'STUDENT' as const, schoolName: 'Chennai Innovation Academy' };
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const questions = [
    {
      id: 1,
      prompt: 'Which of the following data types in Python is immutable?',
      options: ['List', 'Dictionary', 'Tuple', 'Set'],
      answer: 'Tuple',
    },
    {
      id: 2,
      prompt: 'What is the correct syntax for a function definition in Python?',
      options: ['function my_func():', 'def my_func():', 'create my_func():', 'func my_func():'],
      answer: 'def my_func():',
    },
    {
      id: 3,
      prompt: 'True or False: In supervised machine learning, models are trained on labelled datasets.',
      options: ['True', 'False'],
      answer: 'True',
    },
  ];

  const handleSelect = (opt: string) => {
    setSelectedOptions({ ...selectedOptions, [currentQ]: opt });
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  return (
    <AppShell session={session}>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/student/quizzes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-foreground-strong"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </button>

        {isFinished ? (
          <div className="bg-surface rounded-xl border border-border shadow-card p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-foreground-strong">Quiz Attempt Submitted!</h1>
            <p className="text-xs text-foreground-muted">
              Your responses have been recorded and auto-scored by the GCLMS evaluation engine.
            </p>
            <div className="p-4 rounded-lg bg-surface-subtle border border-border max-w-xs mx-auto text-sm font-bold text-primary-600">
              Score: 100% (3/3 Correct)
            </div>
            <button
              onClick={() => router.push('/student/quizzes')}
              className="px-5 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold"
            >
              Return to Quizzes
            </button>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-border shadow-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-bold text-primary-600 uppercase">Question {currentQ + 1} of {questions.length}</span>
                <h2 className="text-base sm:text-lg font-bold text-foreground-strong mt-0.5">
                  {questions[currentQ].prompt}
                </h2>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-danger-600 bg-danger-50 px-2.5 py-1 rounded-md border border-danger-100">
                <Clock className="w-3.5 h-3.5" /> 18:45
              </div>
            </div>

            {/* Question Options */}
            <div className="space-y-3">
              {questions[currentQ].options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`p-3.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${selectedOptions[currentQ] === opt ? 'bg-primary-50 border-primary-600 text-primary-900 shadow-sm' : 'bg-surface border-border text-foreground-strong hover:bg-surface-hover'}`}
                >
                  <span>{opt}</span>
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${selectedOptions[currentQ] === opt ? 'border-primary-600 bg-primary-600' : 'border-border'}`}>
                    {selectedOptions[currentQ] === opt && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                disabled={currentQ === 0}
                onClick={() => setCurrentQ(currentQ - 1)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground-muted disabled:opacity-40"
              >
                Previous
              </button>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="px-5 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold shadow-card hover:bg-primary-700"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-5 py-2 rounded-lg bg-success-600 text-white text-xs font-semibold shadow-card hover:bg-success-700"
                >
                  Submit Quiz Attempt
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
