"use client";

import { useState, useEffect } from "react";
import { Project, PaginationMeta } from "@/types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Github,
  ExternalLink,
  Terminal,
  Search,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ProjectsArchiveClient({
  initialData,
}: {
  initialData: { items: Project[]; meta: PaginationMeta };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [isPending, setIsPending] = useState(false);

  // Sync search to URL with Debounce
  useEffect(() => {
    setIsPending(true);
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) params.set("search", searchQuery);
      else params.delete("search");
      params.set("page", "1"); // Reset to page 1 on search

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setIsPending(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const { items, meta } = initialData;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      <PageHeader breadCrumb="~/codernex/portfolio/projects" />

      <section className="relative px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Project Archive
            </h1>
            <p className="text-zinc-500 max-w-2xl">
              Exploring technical solutions across {meta.total} documented
              projects.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-12 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              {isPending ? (
                <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
              )}
            </div>
            <input
              type="text"
              placeholder="grep 'technology' projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/30 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono placeholder:text-zinc-700"
            />
          </div>

          {/* Grid Listing */}
          <div className="grid gap-6">
            {items.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/40 hover:border-emerald-500/30 transition-all duration-300"
              >
                {/* Visual Preview */}
                <div className="w-full md:w-64 h-40 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                {/* Content logic remains same as your original snippet */}
                <div className="flex-grow flex flex-col justify-between">
                  {/* ... (Your existing card content) */}
                  <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400">
                    {project.title}
                  </h2>
                  <p className="text-zinc-400 text-sm my-3 italic">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded border border-zinc-800 bg-zinc-950 font-mono text-[10px] text-emerald-500/70 uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-auto pt-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                      <Calendar size={12} />{" "}
                      {new Date(project.createdAt).getFullYear()}
                    </div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-400 group/btn"
                    >
                      EXEC_VIEW_DETAILS{" "}
                      <ChevronRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* TERMINAL PAGINATION */}
            {meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-zinc-900 pt-8">
                <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                  Buffer_Index: {meta.page} / {meta.totalPages}
                </div>
                <div className="flex gap-4">
                  <button
                    disabled={meta.page <= 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                    className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 disabled:opacity-20 transition-all"
                  >
                    <ChevronLeft className="text-emerald-500" />
                  </button>
                  <button
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => handlePageChange(meta.page + 1)}
                    className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 disabled:opacity-20 transition-all"
                  >
                    <ChevronRight className="text-emerald-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
