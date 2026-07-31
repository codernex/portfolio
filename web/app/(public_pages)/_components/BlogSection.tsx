import { Blog } from "@/types";
import { ChevronRight, Clock, Eye, Terminal } from "lucide-react";
import Link from "next/link";

// 1. Move fetch logic to a standard async function
async function getRecentArticles(): Promise<Blog[]> {
  try {
    // Note: Use absolute URL for Server Components
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/recent`, {
      next: { revalidate: 300 }, // ISR: re-fetch every 5 minutes
    });
    // Based on your previous API structure: { data: { data: Blog[] } }
    const result = await res.json();
    // or { data: Blog[] }. Adjust destructuring accordingly:
    return result.data || [];
  } catch (error) {
    console.error("LOG_FETCH_ERROR:", error);
    return [];
  }
}

// 2. Mark the component as async
export default async function BlogSection() {
  const articles = await getRecentArticles();

  return (
    <section className="relative border-t border-zinc-900 px-6 py-24 bg-zinc-950">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-mono text-sm text-emerald-500">
              <span className="opacity-60">$ </span>grep --recent
              /var/log/articles.log
            </span>
            <h2 className="mt-2 text-4xl font-bold text-white tracking-tighter">
              Latest Entries
            </h2>
          </div>

          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-emerald-500 transition-colors"
          >
            VIEW_ALL_LOGS <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4">
          {articles.length > 0 ? (
            articles.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 hover:bg-zinc-900/40 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors tracking-tight">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-600 uppercase">
                    <span>
                      {new Date(
                        post.publishedAt || post.createdAt
                      ).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-emerald-500/50" />{" "}
                      {post.readingTime}m_read
                    </span>
                    <span className="flex items-center gap-1 text-emerald-500/40">
                      <Eye size={12} /> {post.views.toLocaleString()} hits
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden group-hover:inline font-mono text-[10px] text-emerald-500 animate-in fade-in slide-in-from-right-2">
                    READ_ENTRY
                  </span>
                  <Terminal className="h-5 w-5 text-zinc-800 group-hover:text-emerald-500 transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center rounded-xl border border-dashed border-zinc-900">
              <p className="font-mono text-xs text-zinc-600">
                [SYSTEM_NOTICE]: No recent log entries found in database.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/blog"
            className="block text-center py-4 border border-zinc-900 rounded-lg font-mono text-xs text-zinc-500"
          >
            ACCESS_FULL_ARCHIVE
          </Link>
        </div>
      </div>
    </section>
  );
}
