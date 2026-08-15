"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  FileText,
  ExternalLink,
  Code,
  Calendar,
  Clock,
  Eye,
  Server,
  Database,
  Layout,
  Layers,
  Sparkles,
  SearchX,
  Loader2,
  FileCode,
  Briefcase,
  Cpu,
} from "lucide-react";
import { useOSStore } from "@/lib/os-store";

interface OSFolderViewProps {
  windowId: string;
  viewMode: "grid" | "list";
  searchQuery: string;
}

export default function OSFolderView({ windowId, viewMode, searchQuery }: OSFolderViewProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [blogsData, setBlogsData] = useState<any[]>([]);
  const [experiencesData, setExperiencesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [projectFilter, setProjectFilter] = useState<"all" | "featured">("all");
  const [blogFilter, setBlogFilter] = useState<"all" | "recent">("all");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.codernex.dev/api/v1";

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (windowId === "projects") {
          let res = await fetch(`${API_BASE}/project?limit=100`);
          if (!res.ok) res = await fetch(`${API_BASE}/project/featured`);
          if (res.ok) {
            const result = await res.json();
            console.log("🚀 ~ fetchData ~ result:", result)
            const rawList = Array.isArray(result) ? result : Array.isArray(result.data) ? result?.data : Array.isArray(result?.data?.items) ? result.data.items : [];
            const validList = rawList.filter((item: any) => item && item.title);
            if (isMounted && validList.length) setProjectsData(validList);
          }
        } else if (windowId === "blog") {
          let res = await fetch(`${API_BASE}/blog?limit=100`);
          if (!res.ok) res = await fetch(`${API_BASE}/blog/recent`);
          if (res.ok) {
            const result = await res.json();
            const rawList = Array.isArray(result) ? result : Array.isArray(result.data) ? result?.data : Array.isArray(result?.data?.items) ? result.data.items : [];
            const validList = rawList.filter((item: any) => item && item.title);
            if (isMounted && validList.length) setBlogsData(validList);
          }
        } else if (windowId === "experience") {
          const res = await fetch(`${API_BASE}/experience`);
          if (res.ok) {
            const result = await res.json();
            if (isMounted && result?.data?.length) {
              setExperiencesData(result.data);
            }
          }
        }
      } catch (err) {
        console.error("OS_FOLDER_FETCH_ERROR:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [windowId, API_BASE]);

  const query = searchQuery.trim().toLowerCase();
  const { navigateWindowPath } = useOSStore();

  const handleOpenProject = (item: any) => {
    navigateWindowPath(
      windowId,
      `/home/codernex/projects/${item.slug || item.id}`,
      `${item.title} — Spec`,
      item
    );
  };

  const handleOpenBlog = (post: any) => {
    navigateWindowPath(
      windowId,
      `/home/codernex/blog/${post.slug || post.id}`,
      post.title,
      post
    );
  };

  // Fallback Mock Data if Backend returns empty
  const defaultProjects = [
    {
      id: "post-scheduler",
      slug: "post-scheduler",
      title: "Social Post Scheduler",
      filename: "post_scheduler.app",
      shortDescription: "Automated social media posting platform built with NestJS & Next.js.",
      description: "A full-stack social media scheduling application that handles post queueing, cron triggers, and OAuth multi-account publishing.",
      technologies: ["NestJS", "Next.js", "Redis", "PostgreSQL"],
      liveUrl: "https://post-scheduler.codernex.dev",
      featured: true,
    },
    {
      id: "ai-workflow-agents",
      slug: "ai-workflow-agents",
      title: "Agentic AI Workflow Studio",
      filename: "workflow_agents.app",
      shortDescription: "Autonomous multi-agent orchestration platform using LangChain & smolagents.",
      description: "Enterprise multi-agent framework designed for long-running workflows with memory state persistence and tool execution.",
      technologies: ["Python", "FastAPI", "LangChain", "Docker"],
      liveUrl: "https://workflow.codernex.dev",
      featured: true,
    },
    {
      id: "checkout-engine",
      slug: "checkout-engine",
      title: "High-Concurrency Checkout Engine",
      filename: "checkout_engine.service",
      shortDescription: "Idempotent Redis checkout pipeline with lock deduplication cutting pending orders by 30%.",
      description: "High availability transactional checkout system built in Go and Redis with optimistic locking mechanisms.",
      technologies: ["Go", "Redis", "PostgreSQL", "Docker"],
      liveUrl: "#",
      featured: true,
    },
  ];

  const defaultBlogs = [
    {
      id: "pg-query-optimization",
      slug: "pg-query-optimization",
      title: "Optimizing PostgreSQL Queries with EXPLAIN ANALYZE",
      filename: "post_01_explain_analyze.md",
      createdAt: "2024-11-12",
      readingTime: "6",
      views: 1420,
      category: "Database",
      excerpt: "Deep dive into query execution plans, index tuning, and latency reduction.",
    },
    {
      id: "redis-distributed-locks",
      slug: "redis-distributed-locks",
      title: "Building Idempotent APIs with Redis Distributed Locks",
      filename: "post_02_redis_locks.md",
      createdAt: "2024-10-04",
      readingTime: "8",
      views: 980,
      category: "Backend Architecture",
      excerpt: "Preventing race conditions and order duplication using Redis lock mechanisms.",
    },
    {
      id: "agentic-ai-pipelines",
      slug: "agentic-ai-pipelines",
      title: "Architecting Autonomous AI Agent Pipelines",
      filename: "post_03_agentic_ai.md",
      createdAt: "2024-09-18",
      readingTime: "10",
      views: 2100,
      category: "Artificial Intelligence",
      excerpt: "Designing deterministic multi-agent state machines with tool calling.",
    },
  ];

  const defaultExperiences = [
    {
      role: "Software Engineer II",
      company: "EWWFL",
      period: "2024 - PRESENT",
      responsibilities: [
        "Architected idempotent checkout engine using Redis locks",
        "Cut query latency from seconds to milliseconds with EXPLAIN ANALYZE",
        "Modernized CI/CD pipelines and microservices",
      ],
      technologies: ["NestJS", "Redis", "PostgreSQL", "Docker", "TypeScript"],
    },
    {
      role: "Full-Stack Engineer",
      company: "Freelance & Consulting",
      period: "2021 - 2024",
      responsibilities: [
        "Built scalable web apps, payment gateway integrations, and AI agent workflows",
        "Integrated Stripe, Snap Finance & SSLCommerz payment providers",
      ],
      technologies: ["Next.js", "Python", "FastAPI", "MongoDB", "AWS"],
    },
  ];

  const skillCategories = [
    {
      title: "Backend & Systems",
      icon: Server,
      skills: [
        { name: "TypeScript / Node.js", level: "95%" },
        { name: "Go (Golang)", level: "85%" },
        { name: "Python / FastAPI", level: "90%" },
        { name: "NestJS Framework", level: "92%" },
      ],
    },
    {
      title: "Databases & Caching",
      icon: Database,
      skills: [
        { name: "PostgreSQL / Query Tuning", level: "95%" },
        { name: "Redis / In-Memory Deduplication", level: "90%" },
        { name: "MongoDB", level: "85%" },
        { name: "Prisma & Drizzle ORM", level: "88%" },
      ],
    },
    {
      title: "Frontend & Web OS",
      icon: Layout,
      skills: [
        { name: "Next.js (App Router)", level: "92%" },
        { name: "React 19 & Tailwind CSS v4", level: "95%" },
        { name: "Zustand & Framer Motion", level: "90%" },
        { name: "TypeScript Architecture", level: "95%" },
      ],
    },
    {
      title: "DevOps & Cloud",
      icon: Layers,
      skills: [
        { name: "Docker & Containerization", level: "88%" },
        { name: "AWS Services (S3, EC2, CloudFront)", level: "85%" },
        { name: "CI/CD Pipelines (GitHub Actions)", level: "90%" },
        { name: "Nginx & Reverse Proxies", level: "88%" },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center font-mono space-y-3">
        <Loader2 className="mx-auto text-emerald-400 animate-spin" size={32} />
        <p className="text-xs text-zinc-400">Fetching live data from backend API...</p>
      </div>
    );
  }

  // Render Projects
  if (windowId === "projects") {
    const rawList = projectsData.length > 0 ? projectsData : defaultProjects;
    const list = projectFilter === "featured" ? rawList.filter((p) => p.featured) : rawList;
    const filteredProjects = list.filter(
      (p) =>
        !query ||
        p.title?.toLowerCase().includes(query) ||
        p.shortDescription?.toLowerCase().includes(query) ||
        (p.technologies && p.technologies.some((t: string) => t.toLowerCase().includes(query)))
    );

    if (filteredProjects.length === 0) {
      return (
        <div className="p-8 text-center font-mono space-y-3">
          <SearchX className="mx-auto text-zinc-600" size={36} />
          <p className="text-sm font-bold text-white">No projects found</p>
          <p className="text-xs text-zinc-500">No match for &quot;{searchQuery}&quot; in /home/codernex/projects</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-3">
            <span>Projects: {filteredProjects.length} items</span>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded text-[10px]">
              <button
                onClick={() => setProjectFilter("all")}
                className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${projectFilter === "all"
                    ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setProjectFilter("featured")}
                className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${projectFilter === "featured"
                    ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                Featured
              </button>
            </div>
          </div>

          <a
            href="/projects"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline hover:text-emerald-300 transition-colors"
          >
            <span>Open Web Archive</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProjects.map((item) => (
              <div
                key={item.id || item.slug}
                onClick={() => handleOpenProject(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-emerald-500/50 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="text-emerald-400" size={18} />
                      <span className="font-mono font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    {item.featured && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        <Sparkles size={10} /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3 line-clamp-2">
                    {item.shortDescription || item.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(item.technologies || []).map((tech: string) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <span className="text-[11px] text-emerald-400 group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                      Open Document →
                    </span>

                    {item.liveUrl && item.liveUrl !== "#" && (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 group-hover:underline"
                      >
                        <ExternalLink size={10} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-zinc-900/80 px-4 py-2.5 text-zinc-400 font-bold">
              <span className="col-span-5">Name</span>
              <span className="col-span-4">Technologies</span>
              <span className="col-span-3 text-right">Action</span>
            </div>
            {filteredProjects.map((item) => (
              <div
                key={item.id || item.slug}
                onClick={() => handleOpenProject(item)}
                className="grid grid-cols-12 px-4 py-3 items-center hover:bg-zinc-900/80 cursor-pointer transition-colors group"
              >
                <div className="col-span-5 flex items-center gap-2">
                  <FileText className="text-emerald-400" size={14} />
                  <span className="text-zinc-200 font-medium group-hover:text-emerald-400 transition-colors truncate">
                    {item.title}
                  </span>
                </div>
                <div className="col-span-4 text-zinc-400 truncate">
                  {(item.technologies || []).join(", ")}
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-emerald-400 hover:underline">
                    View Spec →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render Blogs
  if (windowId === "blog") {
    const rawList = blogsData.length > 0 ? blogsData : defaultBlogs;
    const list = blogFilter === "recent" ? rawList.slice(0, 5) : rawList;
    const filteredBlogs = list.filter(
      (b) =>
        !query ||
        b.title?.toLowerCase().includes(query) ||
        b.excerpt?.toLowerCase().includes(query) ||
        (b.category && b.category.toLowerCase().includes(query))
    );

    if (filteredBlogs.length === 0) {
      return (
        <div className="p-8 text-center font-mono space-y-3">
          <SearchX className="mx-auto text-zinc-600" size={36} />
          <p className="text-sm font-bold text-white">No articles found</p>
          <p className="text-xs text-zinc-500">No match for &quot;{searchQuery}&quot; in /home/codernex/blog</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-3">
            <span>Articles: {filteredBlogs.length} publications</span>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded text-[10px]">
              <button
                onClick={() => setBlogFilter("all")}
                className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${blogFilter === "all"
                    ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                All Articles
              </button>
              <button
                onClick={() => setBlogFilter("recent")}
                className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${blogFilter === "recent"
                    ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                Recent
              </button>
            </div>
          </div>

          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline hover:text-emerald-300 transition-colors"
          >
            <span>Open Web Journal</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBlogs.map((post) => (
              <div
                key={post.id || post.slug}
                onClick={() => handleOpenBlog(post)}
                className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-emerald-500/50 hover:bg-zinc-900 transition-all flex flex-col justify-between gap-3 group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {post.category || "Article"}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {post.publishedAt || post.createdAt
                        ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{post.excerpt || post.summary}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Clock size={12} className="text-emerald-500/60" /> {post.readingTime || 5}m read
                  </span>
                  <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors font-bold">
                    Open Article →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-zinc-900/80 px-4 py-2.5 text-zinc-400 font-bold">
              <span className="col-span-5">Title</span>
              <span className="col-span-3">Category</span>
              <span className="col-span-2">Date</span>
              <span className="col-span-2 text-right">Action</span>
            </div>
            {filteredBlogs.map((post) => (
              <div
                key={post.id || post.slug}
                onClick={() => handleOpenBlog(post)}
                className="grid grid-cols-12 px-4 py-3 items-center hover:bg-zinc-900/80 cursor-pointer transition-colors group"
              >
                <div className="col-span-5 flex items-center gap-2">
                  <FileText className="text-emerald-400 shrink-0" size={14} />
                  <span className="text-zinc-200 font-medium group-hover:text-emerald-400 transition-colors truncate">
                    {post.title}
                  </span>
                </div>
                <div className="col-span-3 text-emerald-400/80 truncate">
                  {post.category || "Article"}
                </div>
                <div className="col-span-2 text-zinc-500">
                  {post.publishedAt || post.createdAt
                    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-GB")
                    : "N/A"}
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-emerald-400 hover:underline font-bold">
                    Read →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render Experience
  if (windowId === "experience") {
    const list = experiencesData.length > 0 ? experiencesData : defaultExperiences;
    const filteredExperience = list.filter(
      (log) =>
        !query ||
        log.role?.toLowerCase().includes(query) ||
        log.company?.toLowerCase().includes(query) ||
        log.period?.toLowerCase().includes(query) ||
        (log.responsibilities && log.responsibilities.some((r: string) => r.toLowerCase().includes(query)))
    );

    if (filteredExperience.length === 0) {
      return (
        <div className="p-8 text-center font-mono space-y-3">
          <SearchX className="mx-auto text-zinc-600" size={36} />
          <p className="text-sm font-bold text-white">No career logs found</p>
          <p className="text-xs text-zinc-500">No match for &quot;{searchQuery}&quot; in experience logs</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4 font-mono">
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
          <span>Logs: {filteredExperience.length} entries [{viewMode.toUpperCase()}_VIEW]</span>
          <span className="text-emerald-400">Path: /home/codernex/experience</span>
        </div>

        {viewMode === "grid" ? (
          /* Grid / Timeline View */
          <div className="border-l-2 border-emerald-500/50 pl-4 space-y-6 my-2">
            {filteredExperience.map((log, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_#10b981]" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-white text-sm">{log.role}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {log.period}
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-400">{log.company}</p>
                {log.responsibilities && (
                  <ul className="space-y-1 pt-1 text-xs text-zinc-300">
                    {log.responsibilities.map((resp: string, rIdx: number) => (
                      <li key={rIdx} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-zinc-900/80 px-4 py-2.5 text-zinc-400 font-bold">
              <span className="col-span-4">Role</span>
              <span className="col-span-4">Company</span>
              <span className="col-span-4 text-right">Period</span>
            </div>
            {filteredExperience.map((log, idx) => (
              <div key={idx} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-zinc-900/80 transition-colors">
                <div className="col-span-4 flex items-center gap-2">
                  <Briefcase className="text-emerald-400 shrink-0" size={14} />
                  <span className="text-zinc-200 font-medium truncate">{log.role}</span>
                </div>
                <div className="col-span-4 text-zinc-400 truncate">{log.company}</div>
                <div className="col-span-4 text-right text-emerald-400 font-bold">{log.period}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render Skills
  if (windowId === "skills") {
    const filteredCategories = skillCategories
      .map((cat) => {
        const matchesCategoryTitle = cat.title.toLowerCase().includes(query);
        const matchingSkills = cat.skills.filter(
          (s) => matchesCategoryTitle || s.name.toLowerCase().includes(query)
        );
        return { ...cat, skills: matchingSkills };
      })
      .filter((cat) => cat.skills.length > 0);

    if (filteredCategories.length === 0) {
      return (
        <div className="p-8 text-center font-mono space-y-3">
          <SearchX className="mx-auto text-zinc-600" size={36} />
          <p className="text-sm font-bold text-white">No skills found</p>
          <p className="text-xs text-zinc-500">No match for &quot;{searchQuery}&quot; in skills stack</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-6 font-mono">
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
          <span>Stack: {filteredCategories.length} categories [{viewMode.toUpperCase()}_VIEW]</span>
          <span className="text-emerald-400">Path: /home/codernex/skills</span>
        </div>

        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <Icon className="text-emerald-400" size={18} />
                    <h3 className="font-bold text-white text-sm">{cat.title}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {cat.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300">{skill.name}</span>
                          <span className="text-emerald-400">{skill.level}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
                            style={{ width: skill.level }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-lg overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-zinc-900/80 px-4 py-2.5 text-zinc-400 font-bold">
              <span className="col-span-5">Technology / Skill</span>
              <span className="col-span-4">Category</span>
              <span className="col-span-3 text-right">Proficiency</span>
            </div>
            {filteredCategories.flatMap((cat) =>
              cat.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-zinc-900/80 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-2">
                    <Cpu className="text-emerald-400 shrink-0" size={14} />
                    <span className="text-zinc-200 font-medium truncate">{skill.name}</span>
                  </div>
                  <div className="col-span-4 text-zinc-400 truncate">{cat.title}</div>
                  <div className="col-span-3 text-right text-emerald-400 font-bold">{skill.level}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback for default views
  return (
    <div className="p-6 text-center font-mono text-zinc-400 space-y-2">
      <Folder className="mx-auto text-emerald-500/50" size={36} />
      <p className="text-sm font-bold text-white">Folder Content: {windowId}</p>
      <p className="text-xs text-zinc-500">Path: /home/codernex/{windowId}</p>
    </div>
  );
}
