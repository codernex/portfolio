import { ProjectListTable } from "@/components/dashboard/projects/ProjectListTable";
import { apiInstance } from "@/lib/axios";
import { Project, PaginatedResponse } from "@/types";
import { Plus, Terminal, FolderGit2, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;

  const res = await apiInstance.get<PaginatedResponse<Project>>(
    `${process.env.NEXT_PUBLIC_API_URL}/project?page=${page}&limit=${limit}`
  );

  const { items, meta } = res.data.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* SYSTEM HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-emerald-500 text-xs mb-2">
            <Terminal size={14} />
            <span>root@codernex:~# list --projects --all</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FolderGit2 className="text-zinc-500" />
            Project Registry
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage your deployed systems and software architectures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats Widget */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg mr-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-600 uppercase">
                Live_Nodes
              </span>
              <span className="text-sm font-bold text-emerald-500">
                {meta.total}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800" />
            <Activity size={16} className="text-emerald-500/50" />
          </div>

          <Link href="/dashboard/projects/create">
            <Button className="bg-emerald-600 text-white hover:bg-emerald-500 font-mono font-bold px-6 py-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Plus className="mr-2 h-4 w-4" />
              INITIALIZE_NEW_PROJECT
            </Button>
          </Link>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="rounded-xl bg-zinc-900/10 border border-zinc-800/50 p-1">
        <ProjectListTable initialProjects={items} meta={meta} />
      </div>

      <footer className="pt-4 flex justify-center">
        <div className="px-4 py-1 rounded-full border border-zinc-900 bg-zinc-950 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
          Auth_Status: Admin_Verified // System: Optimal
        </div>
      </footer>
    </div>
  );
}
