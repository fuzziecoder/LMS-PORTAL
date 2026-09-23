import React from 'react';
import AppShell from '@/components/layout/AppShell';
import MetricCard from '@/components/dashboard/MetricCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  FolderGit2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const session = getServerSession();

  if (!session) {
    redirect('/login');
  }

  const courses = [
    { id: 'python-101', title: 'Python Programming', subject: 'Coding', progress: 85, lessons: '12/14 Completed', nextLesson: 'Functions & Lambda Expressions', gradient: 'from-blue-600 to-indigo-700' },
    { id: 'ai-201', title: 'Artificial Intelligence Fundamentals', subject: 'AI & ML', progress: 60, lessons: '6/10 Completed', nextLesson: 'Introduction to Computer Vision', gradient: 'from-violet-600 to-purple-700' },
    { id: 'iot-301', title: 'Robotics & Microcontrollers', subject: 'Robotics', progress: 40, lessons: '4/10 Completed', nextLesson: 'Arduino Ultrasonic Sensors', gradient: 'from-cyan-600 to-teal-700' },
  ];

  const upcomingWork = [
    { title: 'Assignment 4: Python Dictionary & JSON Parsing', due: 'Tomorrow at 11:59 PM', course: 'Python Programming', type: 'ASSIGNMENT' },
    { title: 'Quiz 2: Neural Network Architecture', due: 'Friday, Oct 2', course: 'Artificial Intelligence', type: 'QUIZ' },
  ];

  const latestGrades = [
    { title: 'Assignment 3: Data Types & Loops', course: 'Python Programming', grade: '95 / 100', feedback: 'Excellent logic and clean code structure!', teacher: 'Rajesh Kumar' },
    { title: 'Quiz 1: Machine Learning Basics', course: 'Artificial Intelligence', grade: '18 / 20', feedback: 'Great job on supervised learning concepts.', teacher: 'Anita Desai' },
  ];

  return (
    <AppShell session={session}>
      <div className="space-y-8">
        {/* Welcome Header Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-100 text-xs font-semibold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Grade 8 — Section A
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Welcome back, {session.name.split(' ')[0]}! 👋
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-primary-100 max-w-xl leading-relaxed">
              You are on track to complete your Python Programming course. Keep up the great work!
            </p>

            <div className="mt-6 inline-flex items-center gap-3">
              <a
                href="/student/courses/python-101"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-primary-900 font-bold text-xs shadow-card hover:bg-primary-50 transition-colors"
              >
                Continue Python Course <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Student KPIs (Calm & Focused) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Enrolled Courses"
            value="3"
            subtitle="Active STEM courses"
            icon={<BookOpen className="w-5 h-5" />}
            accentColor="blue"
          />
          <MetricCard
            title="Overall Progress"
            value="68%"
            subtitle="Across all courses"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 'On track', isPositive: true }}
            accentColor="violet"
          />
          <MetricCard
            title="Attendance"
            value="96.5%"
            subtitle="Term attendance rate"
            icon={<CalendarCheck className="w-5 h-5" />}
            accentColor="green"
          />
          <MetricCard
            title="My Projects"
            value="1"
            subtitle="Approved portfolio project"
            icon={<FolderGit2 className="w-5 h-5" />}
            accentColor="cyan"
          />
        </div>

        {/* My Enrolled Courses Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground-strong">My Courses</h2>
            <a href="/student/courses" className="text-xs font-semibold text-primary-600 hover:underline">
              View All Courses
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-surface rounded-xl border border-border shadow-card overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-all">
                <div>
                  <div className={`p-4 bg-gradient-to-r ${course.gradient} text-white`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 text-white/90">
                      {course.subject}
                    </span>
                    <h3 className="font-bold text-base mt-2">{course.title}</h3>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-foreground-strong mb-1.5">
                        <span>Course Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>

                    <div className="text-xs text-foreground-muted">
                      <span className="block font-medium text-foreground-strong">Next Lesson:</span>
                      <span className="truncate block">{course.nextLesson}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-border bg-surface-subtle flex items-center justify-between text-xs">
                  <span className="text-foreground-subtle">{course.lessons}</span>
                  <a href={`/student/courses/${course.id}`} className="font-semibold text-primary-600 hover:underline flex items-center gap-1">
                    Open Course →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Split: Upcoming Work & Latest Grades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Assignments & Quizzes */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground-strong flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning-600" /> Upcoming Work & Quizzes
              </h2>
              <a href="/student/assignments" className="text-xs font-semibold text-primary-600 hover:underline">
                View Calendar
              </a>
            </div>

            <div className="space-y-3">
              {upcomingWork.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-surface-subtle border border-border flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-warning-50 text-warning-700 border border-warning-200">
                        {item.type}
                      </span>
                      <span className="text-xs text-foreground-muted">{item.course}</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-foreground-strong">{item.title}</h3>
                    <p className="text-xs text-danger-600 font-medium">Due: {item.due}</p>
                  </div>
                  <a href="/student/assignments" className="px-3 py-1.5 rounded bg-primary-600 text-white text-xs font-semibold shadow-card hover:bg-primary-700">
                    Open
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Grades & Feedback */}
          <div className="bg-surface rounded-xl border border-border shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground-strong flex items-center gap-2">
                <Award className="w-5 h-5 text-success-600" /> Latest Grades & Feedback
              </h2>
              <a href="/student/grades" className="text-xs font-semibold text-primary-600 hover:underline">
                Gradebook
              </a>
            </div>

            <div className="space-y-3">
              {latestGrades.map((g, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-surface-subtle border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-foreground-strong">{g.title}</span>
                    <span className="px-2.5 py-1 rounded bg-success-50 text-success-700 font-bold text-xs border border-success-200">
                      {g.grade}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted italic">"{g.feedback}"</p>
                  <p className="text-[11px] text-foreground-subtle">— Evaluated by {g.teacher}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
