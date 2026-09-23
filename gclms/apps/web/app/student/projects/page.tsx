'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { PlusCircle, Code2, Github, ExternalLink, Sparkles, MessageSquare, X } from 'lucide-react';
import { FIXTURE_PROJECTS } from '@/lib/fixtures/projects';

export default function StudentProjectsPage() {
  const session = {
    id: 'user-s1',
    name: 'Tharun V.',
    email: 'student.tharun.chennai@gclms.local',
    role: 'STUDENT' as const,
    schoolName: 'Chennai Innovation Academy',
  };

  const [projects, setProjects] = useState(FIXTURE_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Computer Science',
    short_description: '',
    full_description: '',
    technologies: 'Python, FastAPI, OpenCV',
    github_url: '',
    demo_url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      id: `proj-${Date.now()}`,
      title: form.title,
      category: form.category,
      short_description: form.short_description,
      full_description: form.full_description,
      technologies: form.technologies.split(',').map((t) => t.trim()),
      student_name: session.name,
      student_id: session.id,
      school_name: session.schoolName,
      github_url: form.github_url || undefined,
      demo_url: form.demo_url || undefined,
      status: 'IN_PROGRESS' as const,
      approval_status: 'SUBMITTED' as const,
      created_at: '2026-03-23',
      updated_at: '2026-03-23',
    };
    setProjects([newProject, ...projects]);
    setShowModal(false);
    alert('Project submitted for Faculty & Principal showcase approval!');
  };

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">My Innovation Project Portfolio</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Build, document, and publish your STEM, AI, robotics, and coding projects for global showcase endorsement.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold shadow-card hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Submit Innovation Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-surface rounded-xl border border-border shadow-card p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                    {proj.category}
                  </span>
                  <StatusBadge status={proj.approval_status} />
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground-strong">{proj.title}</h3>
                  <p className="text-xs text-foreground-muted line-clamp-2 mt-1">{proj.short_description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-surface-subtle border border-border px-1.5 py-0.5 rounded text-foreground-subtle">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                {proj.teacher_feedback && (
                  <div className="p-2.5 bg-primary-50/60 border border-primary-100 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-primary-800 flex items-center gap-1 text-[11px]">
                      <MessageSquare className="w-3 h-3" /> Faculty Feedback
                    </span>
                    <p className="text-[11px] text-foreground-strong">{proj.teacher_feedback}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground-strong hover:bg-surface-subtle"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.demo_url && (
                      <a
                        href={proj.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-border text-foreground-muted hover:text-foreground-strong hover:bg-surface-subtle"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <span className="text-[11px] text-foreground-subtle font-medium">Status: {proj.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Submit Project */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl border border-border shadow-xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-base text-foreground-strong">Submit Project to Showcase</h3>
                  <div className="text-xs text-foreground-muted">Submit your engineering prototype for faculty endorsement.</div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-foreground-muted hover:text-foreground-strong">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-foreground-strong block mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Smart Plant IoT Moisture Monitor"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground-strong block mb-1">STEM Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  >
                    <option value="Computer Science">Computer Science & Algorithms</option>
                    <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
                    <option value="Robotics & IoT">Robotics & IoT</option>
                    <option value="Web Technologies">Full-Stack Web</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground-strong block mb-1">Short Elevator Pitch (1-2 sentences)</label>
                  <input
                    type="text"
                    required
                    value={form.short_description}
                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    placeholder="Brief description for project cards..."
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground-strong block mb-1">Technologies (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={form.technologies}
                    onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                    placeholder="Python, ESP32, MQTT, React"
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground-strong block mb-1">Technical Architecture Details</label>
                  <textarea
                    rows={3}
                    required
                    value={form.full_description}
                    onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                    placeholder="Describe how your hardware/software solution works, datasets used, and key findings..."
                    className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-foreground-strong block mb-1">GitHub Link (Optional)</label>
                    <input
                      type="url"
                      value={form.github_url}
                      onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground-strong block mb-1">Live Demo / Video URL (Optional)</label>
                    <input
                      type="url"
                      value={form.demo_url}
                      onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                      placeholder="https://my-demo.vercel.app"
                      className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border text-foreground-strong"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-surface-subtle border border-border text-foreground-strong rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                  >
                    Submit for Endorsement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
