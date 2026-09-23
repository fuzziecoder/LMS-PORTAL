'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { FolderGit2, Search, ExternalLink, Github, Sparkles, Filter } from 'lucide-react';
import { FIXTURE_PROJECTS } from '@/lib/fixtures/projects';

export default function FounderProjectsPage() {
  const session = { id: 'founder', name: 'Dr. Vikram Sarabhai', email: 'founder@gclms.local', role: 'FOUNDER' as const };
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredProjects = FIXTURE_PROJECTS.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.student_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground-strong">Cross-School Innovation Project Gallery</h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Showcase of Artificial Intelligence, Robotics, and IoT projects created by students across all campuses.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-foreground-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects or student authors..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-xs text-foreground-strong focus:outline-none focus:border-primary-600"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            {['ALL', 'Artificial Intelligence', 'Robotics & Hardware', 'Robotics & IoT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedCategory === cat ? 'bg-primary-600 text-white shadow-card' : 'bg-surface border border-border text-foreground-muted hover:bg-surface-hover'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-surface rounded-xl border border-border shadow-card p-6 flex flex-col justify-between hover:shadow-elevated transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-100 uppercase">
                    {project.category}
                  </span>
                  <StatusBadge status={project.approval_status} />
                </div>

                <h3 className="font-bold text-base text-foreground-strong leading-tight">{project.title}</h3>
                <p className="text-xs text-foreground-muted mt-2 leading-relaxed">{project.short_description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-surface-subtle border border-border text-[10px] font-mono text-foreground-subtle">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-foreground-strong block">{project.student_name}</span>
                  <span className="text-[11px] text-foreground-subtle">{project.school_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-md bg-surface-subtle hover:bg-surface-hover text-foreground-muted">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
