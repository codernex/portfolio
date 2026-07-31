"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  LayoutDashboard,
  FolderCode,
  FileText,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/store";

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "dash.sh",
    },
    {
      name: "Projects",
      path: "/dashboard/projects",
      icon: FolderCode,
      label: "ls_projects",
    },
    {
      name: "Blog Posts",
      path: "/dashboard/blogs",
      icon: FileText,
      label: "cat_blogs",
    },
    {
      name: "Experience",
      path: "/dashboard/experience",
      icon: Briefcase,
      label: "whoami.log",
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center border-b border-zinc-800 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-500 text-black">
            <Terminal size={18} strokeWidth={3} />
          </div>
          {!isCollapsed && (
            <span className="font-mono text-sm font-bold tracking-tighter text-white">
              CODER<span className="text-emerald-500">NEX</span>_OS
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                isActive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  isActive
                    ? "text-emerald-500"
                    : "text-zinc-500 group-hover:text-emerald-400"
                )}
              />
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-40">
                    {item.label}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status / Footer */}
      <div className="mt-auto border-t border-zinc-900 p-4">
        {!isCollapsed && (
          <div className="mb-4 space-y-3 rounded-lg bg-zinc-900/40 p-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Database size={12} /> DB: PostgreSQL
              </span>
              <span className="text-emerald-500/50 uppercase">Syncing</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Cpu size={12} /> Load: 1.2%
              </span>
              <span>v1.0.4</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 cursor-pointer",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => {
              logout();
            }}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Terminate Session</span>}
          </Button>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-emerald-500"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
