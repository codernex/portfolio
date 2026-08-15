"use client";

import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Eye,
  Tag as TagIcon,
  Zap,
  Terminal,
  Layers,
  Cpu,
  Loader2,
} from "lucide-react";
import ContentRenderer from "@/components/ContentRender";

interface OSDetailViewProps {
  type: "project" | "blog";
  data: any;
}

export default function OSDetailView({ type, data }: OSDetailViewProps) {
  const [detailData, setDetailData] = useState<any>(data);
  const [loading, setLoading] = useState<boolean>(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.codernex.dev/api/v1";

  useEffect(() => {
    let isMounted = true;
    const fetchFullDetail = async () => {
      const slug = data?.slug || data?.id;
      if (!slug) return;

      setLoading(true);
      try {
        const endpoint =
          type === "project"
            ? `${API_BASE}/project/${slug}`
            : `${API_BASE}/blog/${slug}`;
        const res = await fetch(endpoint);
        if (res.ok) {
          const json = await res.json();
          const full = json?.data || json;
          if (isMounted && full && full.title) {
            setDetailData(full);
          }
        }
      } catch (err) {
        console.error("OS_DETAIL_FETCH_ERROR:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFullDetail();

    return () => {
      isMounted = false;
    };
  }, [data?.slug, data?.id, type, API_BASE]);

  const item = detailData || data;

  if (!item) {
    return (
      <div className="p-8 text-center font-mono text-zinc-500">
        [SYSTEM_NOTICE]: No data payload attached to this document.
      </div>
    );
  }

  if (type === "project") {
    const allImages = [
      ...(item.thumbnailUrl ? [item.thumbnailUrl] : []),
      ...(item.images ?? []),
    ];

    return (
      <div className="p-6 font-mono space-y-8 max-w-4xl mx-auto text-zinc-300 relative">
        {loading && (
          <div className="absolute top-2 right-4 flex items-center gap-1.5 text-[10px] text-emerald-400">
            <Loader2 size={12} className="animate-spin" />
            <span>Fetching full spec...</span>
          </div>
        )}

        {/* Banner / Header */}
        <div className="space-y-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <Terminal className="text-emerald-500" size={18} />
            <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-[0.3em]">
              Project_Specification_Manifest
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {item.title}
          </h1>

          {item.shortDescription && (
            <p className="text-base text-zinc-400 italic border-l-2 border-emerald-500/30 pl-4 leading-relaxed">
              {item.shortDescription}
            </p>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {item.liveUrl && item.liveUrl !== "#" && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <ExternalLink size={14} /> Launch Live App
              </a>
            )}
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs hover:bg-zinc-800 transition-all"
              >
                <Github size={14} /> Source Repository
              </a>
            )}
          </div>
        </div>

        {/* Tech Stack & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {item.technologies && item.technologies.length > 0 && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                <Layers size={12} /> Tech_Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-emerald-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                <TagIcon size={12} /> Classifications
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag: any) => (
                  <span
                    key={tag.id || tag.slug}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono"
                  >
                    #{tag.name || tag.slug}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-emerald-500" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Gallery Screenshots [{allImages.length}]
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allImages.map((img: string, idx: number) => (
                <a
                  key={idx}
                  href={img}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
                >
                  <img
                    src={img}
                    alt={`${item.title} screenshot ${idx + 1}`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Content Renderer */}
        <div className="space-y-3 pt-2">
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold border-b border-zinc-800 pb-2 block">
            System Specification & Documentation
          </span>
          {item.content || item.blocks ? (
            <ContentRenderer blocks={item.content || item.blocks} />
          ) : item.htmlContent ? (
            <ContentRenderer htmlContent={item.htmlContent} />
          ) : (
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              {item.fullDescription ||
                item.description ||
                item.shortDescription ||
                "No detailed specifications recorded."}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Blog Detail View
  return (
    <div className="p-6 font-mono space-y-8 max-w-4xl mx-auto text-zinc-300 relative">
      {loading && (
        <div className="absolute top-2 right-4 flex items-center gap-1.5 text-[10px] text-emerald-400">
          <Loader2 size={12} className="animate-spin" />
          <span>Fetching full article...</span>
        </div>
      )}

      {/* Article Header */}
      <div className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            {item.category || "Publication"}
          </span>
          <span className="text-zinc-500 flex items-center gap-1">
            <Calendar size={12} />
            {item.publishedAt || item.createdAt
              ? new Date(item.publishedAt || item.createdAt).toLocaleDateString(
                  "en-GB"
                )
              : "N/A"}
          </span>
          {item.readingTime && (
            <span className="text-zinc-500 flex items-center gap-1">
              <Clock size={12} /> {item.readingTime}m read
            </span>
          )}
          {item.views !== undefined && (
            <span className="text-zinc-500 flex items-center gap-1">
              <Eye size={12} /> {item.views} hits
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {item.title}
        </h1>
        {item.excerpt && (
          <p className="text-base text-zinc-400 italic leading-relaxed">
            {item.excerpt}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {item.tags.map((tag: any) => (
              <span
                key={tag.id || tag.slug}
                className="font-mono text-[10px] text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-widest"
              >
                [{tag.name || tag.slug}]
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured Image */}
      {item.featuredImage && (
        <div className="aspect-[21/9] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <img
            src={item.featuredImage}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Article Content Renderer */}
      <div className="space-y-4 pt-2">
        {item.content || item.blocks ? (
          <ContentRenderer blocks={item.content || item.blocks} />
        ) : item.htmlContent ? (
          <ContentRenderer htmlContent={item.htmlContent} />
        ) : (
          <div className="text-sm text-zinc-300 leading-relaxed space-y-4 font-sans">
            <p>{item.summary || item.excerpt || "Article content loading..."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
