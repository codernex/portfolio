import { BlogListTable } from "@/components/dashboard/blogs/BlogListTable";
import { Button } from "@/components/ui/button";
import { apiInstance } from "@/lib/axios";
import { Blog, PaginatedResponse } from "@/types";
import { Terminal, Plus, FileText, Activity } from "lucide-react";
import Link from "next/link";

export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;

  // Fetching from your NestJS API with pagination
  const response = await apiInstance<PaginatedResponse<Blog>>(
    `/blog?page=${page}&limit=${limit}`
  );

  const result = response.data;
  console.log("TCL: result", result);

  // Destructuring based on your API structure: { data: { items, meta } }
  const { items: blogs, meta } = result.data;
  console.log("TCL: blogs", blogs);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* SYSTEM HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-emerald-500 text-xs mb-2">
            <Terminal size={14} />
            <span>root@codernex:~# fetch --content=blogs --status=all</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="text-zinc-500" />
            Content Management
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Create, edit, and audit your technical journal entries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats Widget */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg mr-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-600 uppercase">
                Total_Posts
              </span>
              <span className="text-sm font-bold text-emerald-500">
                {meta?.total || 0}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800" />
            <Activity size={16} className="text-emerald-500/50" />
          </div>

          <Link href="/dashboard/blogs/create">
            <Button className="bg-emerald-600 text-white hover:bg-emerald-500 font-mono font-bold px-6 py-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Plus className="mr-2 h-4 w-4" />
              CREATE_NEW_ENTRY.EXE
            </Button>
          </Link>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden">
        <BlogListTable initialData={blogs} meta={meta} />
      </div>

      <footer className="pt-4 flex justify-center">
        <div className="px-4 py-1 rounded-full border border-zinc-900 bg-zinc-950 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
          Session: Active // DB_Write_Privileges: Enabled
        </div>
      </footer>
    </div>
  );
}
