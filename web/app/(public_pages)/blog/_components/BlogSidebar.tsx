// app/blog/_components/BlogSidebar.tsx
import { Cpu, Database, ShieldCheck, Terminal } from "lucide-react";

export function BlogSidebar() {
  return (
    <div className="sticky top-28 space-y-8">
      {/* 1. System Identity Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2">
          <Terminal size={12} /> System_Identity
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Borhan Uddin</p>
              <p className="text-[10px] font-mono text-zinc-500 italic">
                Full-Stack Engineer
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed italic">
            Specializing in high-performance NestJS backends and scalable
            Next.js architectures.
          </p>
        </div>
      </div>

      {/* 2. Real-time System Status (Mockup) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          Live_Telemetry
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="flex items-center gap-2 text-zinc-500">
              <Cpu size={12} /> CPU_LOAD
            </span>
            <span className="text-emerald-500">2.4%</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="flex items-center gap-2 text-zinc-500">
              <Database size={12} /> DB_SYNC
            </span>
            <span className="text-emerald-500">STABLE</span>
          </div>
        </div>
      </div>

      {/* 3. Tech Categories */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2">
          Global_Tags
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "NestJS",
            "Next.js",
            "PostgreSQL",
            "System Architecture",
            "Security",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 text-[10px] font-mono text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer transition-all"
            >
              #{tag.toLowerCase().replace(" ", "_")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
