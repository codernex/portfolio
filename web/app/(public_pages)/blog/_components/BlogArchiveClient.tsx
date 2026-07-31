"use client";

import { Blog, PaginationMeta } from "@/types"; // Ensure meta is imported
import {
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Terminal,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Receive meta prop from the Container
export default function BlogArchiveClient({
  initialBlogs,
  meta,
}: {
  initialBlogs: Blog[];
  meta: PaginationMeta;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Sync search with URL (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery) {
        params.set("search", searchQuery); // Changed to 'search' to match DTO
        params.set("page", "1"); // Reset to page 1 on new search
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400); // 400ms debounce to save NestJS resources

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, pathname, router, searchParams]);

  // 2. Navigation Handler
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      <section className="px-6 pb-20">
        <div className="container mx-auto max-w-6xl">
          {/* Search bar */}
          <div className="relative mb-12">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="font-mono text-emerald-500 mr-2">$</span>
              <span className="font-mono text-zinc-600 italic">
                grep_content
              </span>
            </div>
            <input
              type="text"
              placeholder="--search-payload..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg py-4 pl-40 pr-4 text-white font-mono focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* Blog List Items */}
          <div className="space-y-12">
            {initialBlogs.map((post) => (
              <article key={post.id} className="group relative">
                {/* ... (Your existing card JSX) */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Metadata Sidebar */}
                  <div className="md:w-36 shrink-0 font-mono text-[11px] text-zinc-600 space-y-2 pt-1 border-r border-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(
                        post.publishedAt || post.createdAt
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500/60">
                      <Eye className="h-3.5 w-3.5" /> {post.views} HITS
                    </div>
                  </div>

                  {/* Title and Excerpt */}
                  <div className="flex-grow space-y-3">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-zinc-500 text-sm max-w-2xl italic">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 pt-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-500"
                    >
                      EXEC_READ_ENTRY <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* SYSTEM PAGINATION FOOTER */}
          {meta.totalPages > 1 && (
            <div className="mt-20 flex items-center justify-between border-t border-zinc-900 pt-10">
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                Buffer_Index: {meta.page} / {meta.totalPages}{" "}
                {" // Total_Nodes:"}
                {meta.total}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-zinc-800 bg-zinc-900 text-emerald-500 disabled:opacity-20"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                >
                  <ChevronLeft size={20} />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-zinc-800 bg-zinc-900 text-emerald-500 disabled:opacity-20"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
