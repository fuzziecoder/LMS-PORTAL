'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Code2, Github, ExternalLink, MessageSquare, Check, X, Eye } from 'lucide-react';
import { FIXTURE_PROJECTS } from '@/lib/fixtures/projects';

export default function TeacherProjectsPage() {
  const session = {
    id: 'user-t1',
    name: 'Rajesh Kumar',
    email: 'teacher.python.chennai@gclms.local',
    role: 'TEACHER' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [projects, setProjects] = useState(FIXTURE_PROJECTS);
  const [feedbackProject, setFeedbackProject] = useState<typeof FIXTURE_PROJECTS[0] | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSendFeedback = () => {
    if (!feedbackProject) return;
    setProjects(
      projects.map((p) => (p.id === feedbackProject.id ? { ...p, teacher_feedback: feedbackText } : p))
    );
    alert(`Feedback sent to ${feedbackProject.student_name}!`);
    setFeedbackProject(null);
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">Student Projects & Portfolio Mentorship</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Review code repositories, provide engineering guidance, and nominate outstanding work for showcase approval.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.id} className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                    {project.category}
                  </span>
                  <StatusBadge status={project.approval_status} />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground-strong">{project.title}</h3>
                  <p className="text-xs text-foreground-muted line-clamp-2 mt-1">{project.short_description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-[10px] font-mono bg-surface-subtle border border-border px-1.5 py-0.5 rounded text-foreground-subtle">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="text-xs text-foreground-muted">
                  Student: <strong className="text-foreground-strong">{project.student_name}</strong>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground-strong hover:bg-surface-subtle"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground-strong hover:bg-surface-subtle"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setFeedbackProject(project);
                      setFeedbackText(project.teacher_feedback || '');
                    }}
                    className="inline-flex items-center gap-1 text-xs text-primary-600 font-semibold hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Mentor Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Mentor Feedback */}
        {feedbackProject && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground-strong">
                    Mentor Feedback: {feedbackProject.title}
                  </h3>
                  <div className="text-xs text-foreground-muted">Student: {feedbackProject.student_name}</div>
                </div>
                <button onClick={() => setFeedbackProject(null)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <label className="font-bold text-foreground-strong block">
                  Engineering Notes & Code Architecture Feedback
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide technical feedback, suggest improvements, or recommend algorithms..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => setFeedbackProject(null)}
                  className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendFeedback}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
