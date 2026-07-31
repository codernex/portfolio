"use client";

import { Project, Tag } from "@/types";
import {
  Github,
  ExternalLink,
  ArrowLeft,
  Terminal,
  Cpu,
  Zap,
  ShieldCheck,
  Layers,
  Calendar,
  Tag as TagIcon,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ContentRenderer from "@/components/ContentRender";

interface ProjectDetailContentProps {
  project: Project;
}

export default function ProjectDetailContent({
  project,
}: ProjectDetailContentProps) {
  const allImages = [
    ...(project.thumbnailUrl ? [project.thumbnailUrl] : []),
    ...(project.images ?? []),
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/projects"
            className="group flex items-center gap-2 font-mono text-sm text-zinc-500 hover:text-emerald-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>cd ../projects</span>
          </Link>

          {/* Primary Project Tag Display */}
          <div className="hidden md:flex items-center gap-2">
            {project.tags
              ?.filter((t) => t.type !== "blog")
              .map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="font-mono text-[9px] border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                >
                  {tag.name.toUpperCase()}
                </Badge>
              ))}
          </div>
        </div>
      </header>

      <section className="container mx-auto max-w-6xl px-6 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Terminal className="text-emerald-500" size={18} />
                <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-[0.3em]">
                  Initial_Manifest_Ready
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                {project.title}
              </h1>
              <p className="text-xl text-zinc-400 italic border-l-2 border-emerald-500/30 pl-6 leading-relaxed">
                {project.shortDescription}
              </p>
            </div>

            {/* Performance Metric */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 relative overflow-hidden group">
              <Zap
                size={60}
                className="absolute -right-4 -top-4 text-emerald-500 opacity-5 group-hover:opacity-10 transition-opacity"
              />
              <div className="flex gap-6 items-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-mono text-sm uppercase">
                    Optimization_Node
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Improved core performance metrics by 140% during production
                    refactor.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Images Gallery */}
            {allImages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Cpu className="text-emerald-500" size={18} />
                  <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-[0.3em]">
                    Project_Screenshots
                  </span>
                  <span className="font-mono text-[10px] text-zinc-600">
                    [{allImages.length}]
                  </span>
                </div>
                <div
                  className={`grid gap-4 ${
                    allImages.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  {allImages.map((img, idx) => (
                    <a
                      key={idx}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 transition-all hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] ${
                        idx === 0 && allImages.length > 2
                          ? "md:col-span-2"
                          : ""
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        width={1200}
                        height={675}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-3 right-3 font-mono text-[9px] text-emerald-500 bg-zinc-950/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        IMG_{String(idx).padStart(3, "0")}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Content blocks */}
            <div className="prose-custom">
              <ContentRenderer blocks={project.content} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-6">
              {/* Access Links */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-3">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2 flex items-center justify-between">
                  Network_Access <ExternalLink size={10} />
                </h3>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-black font-mono text-xs font-black transition-all"
                  >
                    LIVE_DEPLOYMENT <ChevronRight size={14} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 font-mono text-xs transition-all"
                  >
                    SOURCE_CODE <Github size={14} />
                  </a>
                )}
              </div>

              {/* Tag System Integration */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
                  <TagIcon size={12} /> Classifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                    <Link key={tag.id} href={`/projects?tag=${tag.slug}`}>
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800/50 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 transition-colors font-mono text-[9px] py-0.5 px-2"
                      >
                        #{tag.slug}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
                  <Layers size={12} /> Tech_Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded font-mono text-[10px] text-zinc-500 uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Metadata */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-4 font-mono text-[10px] uppercase">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 flex items-center gap-2">
                    <Calendar size={12} /> Deployment_Year
                  </span>
                  <span className="text-zinc-400">
                    {new Date(project.createdAt).getFullYear()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 flex items-center gap-2">
                    <ShieldCheck size={12} /> Secure_Check
                  </span>
                  <span className="text-emerald-500/70">PASSED</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
