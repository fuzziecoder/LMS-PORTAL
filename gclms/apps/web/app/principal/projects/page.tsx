'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Code2, Github, ExternalLink, Check, X, Eye, Filter, Sparkles } from 'lucide-react';
import { FIXTURE_PROJECTS } from '@/lib/fixtures/projects';

export default function PrincipalProjectsPage() {
  const session = {
    id: 'user-p1',
    name: 'Prof. Ananya Raman',
    email: 'principal.chennai@gclms.local',
    role: 'PRINCIPAL' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [projects, setProjects] = useState(FIXTURE_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<typeof FIXTURE_PROJECTS[0] | null>(null);

  const handleApprove = (id: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, approval_status: 'APPROVED' as const } : p)));
    if (selectedProject?.id === id) {
      setSelectedProject({ ...selectedProject, approval_status: 'APPROVED' });
    }
  };

  const handleReject = (id: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, approval_status: 'REJECTED' as const } : p)));
    if (selectedProject?.id === id) {
      setSelectedProject({ ...selectedProject, approval_status: 'REJECTED' });
    }
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground-strong">Student Innovation Project Review Queue</h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1">
            Review, evaluate, and officially endorse student engineering and coding projects for the GCLMS Global Showcase.
          </p>
        </div>

        {/* Project Cards Grid */}
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
                  Submitted by: <strong className="text-foreground-strong">{project.student_name}</strong>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1 text-xs text-primary-600 font-semibold hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Code & Demo
                  </button>

                  {project.approval_status === 'SUBMITTED' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApprove(project.id)}
                        className="p-1.5 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                        title="Approve Project"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(project.id)}
                        className="p-1.5 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
                        title="Reject Project"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Project Details Drawer */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-2xl p-6 space-y-5">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground-strong">{selectedProject.title}</h2>
                    <StatusBadge status={selectedProject.approval_status} />
                  </div>
                  <div className="text-xs text-foreground-muted mt-1">
                    By {selectedProject.student_name} • {selectedProject.school_name}
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-foreground-strong mb-1">Detailed Technical Summary</h4>
                  <p className="text-foreground-muted leading-relaxed">{selectedProject.full_description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground-strong mb-1">Architecture & Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((t) => (
                      <span key={t} className="px-2 py-1 bg-surface-subtle border border-border rounded font-mono text-[11px] text-foreground-strong font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg text-foreground-strong font-semibold hover:bg-surface-hover"
                    >
                      <Github className="w-4 h-4" /> View Git Repository
                    </a>
                  )}
                  {selectedProject.demo_url && (
                    <a
                      href={selectedProject.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
                    >
                      <ExternalLink className="w-4 h-4" /> Launch Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    handleReject(selectedProject.id);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 bg-surface-subtle text-error font-semibold rounded-lg hover:bg-error/10 text-xs"
                >
                  Reject with Feedback
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedProject.id);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 bg-success text-white font-semibold rounded-lg hover:bg-success/90 text-xs"
                >
                  Endorse & Publish to Global Showcase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
