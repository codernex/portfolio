"use client";

import React from "react";
import {
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Eye,
  Tag,
  Zap,
  ArrowLeft,
  Share2,
} from "lucide-react";
import ContentRenderer from "@/components/ContentRender";

interface OSDetailViewProps {
  type: "project" | "blog";
  data: any;
}

export default function OSDetailView({ type, data }: OSDetailViewProps) {
  if (!data) {
    return (
      <div className="p-8 text-center font-mono text-zinc-500">
        [SYSTEM_NOTICE]: No data payload attached to this document.
      </div>
    );
  }

  if (type === "project") {
    return (
      <div className="p-6 font-mono space-y-6 max-w-4xl mx-auto text-zinc-300">
        {/* Banner / Thumbnail */}
        {data.thumbnailUrl && (
          <div className="relative h-64 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <img
              src={data.thumbnailUrl}
              alt={data.title}
              className="h-full w-full object-cover"
            />
            {data.featured && (
              <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Zap size={12} className="fill-black" /> FEATURED_PROJECT
              </span>
            )}
          </div>
        )}

        {/* Header */}
        <div className="space-y-3 border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">{data.title}</h1>
          <p className="text-sm text-emerald-400 font-mono">
            {data.shortDescription || data.description}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {data.liveUrl && data.liveUrl !== "#" && (
              <a
                href={data.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <ExternalLink size={14} /> Launch Live Application
              </a>
            )}
            {data.githubUrl && (
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs hover:bg-zinc-800 transition-all"
              >
                <Github size={14} /> Source Repository
              </a>
            )}
          </div>
        </div>

        {/* Technologies */}
        {data.technologies && data.technologies.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
              Tech Stack Architecture
            </span>
            <div className="flex flex-wrap gap-2">
              {data.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description / Content Renderer */}
        <div className="pt-4 space-y-4">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
            Project Overview & Specification
          </span>
          {data.blocks ? (
            <ContentRenderer blocks={data.blocks} />
          ) : data.htmlContent ? (
            <ContentRenderer htmlContent={data.htmlContent} />
          ) : (
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              {data.description || data.shortDescription || "No additional project specifications recorded."}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Blog Detail View
  return (
    <div className="p-6 font-mono space-y-6 max-w-4xl mx-auto text-zinc-300">
      <div className="space-y-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            {data.category || "Publication"}
          </span>
          <span className="text-zinc-500 flex items-center gap-1">
            <Calendar size={12} />
            {data.publishedAt || data.createdAt
              ? new Date(data.publishedAt || data.createdAt).toLocaleDateString("en-GB")
              : "N/A"}
          </span>
          {data.readingTime && (
            <span className="text-zinc-500 flex items-center gap-1">
              <Clock size={12} /> {data.readingTime}m read
            </span>
          )}
          {data.views !== undefined && (
            <span className="text-zinc-500 flex items-center gap-1">
              <Eye size={12} /> {data.views} hits
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight">{data.title}</h1>
        {data.excerpt && <p className="text-sm text-zinc-400 leading-relaxed">{data.excerpt}</p>}
      </div>

      {/* Article Content */}
      <div className="pt-2">
        {data.blocks ? (
          <ContentRenderer blocks={data.blocks} />
        ) : data.htmlContent ? (
          <ContentRenderer htmlContent={data.htmlContent} />
        ) : (
          <div className="text-sm text-zinc-300 leading-relaxed space-y-4 font-sans">
            <p>{data.summary || data.excerpt || "Article content loading..."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
