"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiInstance } from "@/lib/axios";
import { PaginationMeta, Project } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  ExternalLink,
  MoreHorizontal,
  Star,
  Terminal,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectListTableProps {
  initialProjects: Project[];
  meta: PaginationMeta;
}

export function ProjectListTable({
  initialProjects,
  meta,
}: ProjectListTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState(initialProjects);

  const handleToggleFeatured = async (id: string, currentState: boolean) => {
    const newState = !currentState;

    // Optimistic Update: Update UI immediately
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: newState } : p))
    );

    try {
      await apiInstance.patch(`/project/${id}/featured`, {
        featured: newState,
      });
      toast.success(
        `NODE_UPDATE: Project ${
          newState ? "promoted to featured" : "removed from featured"
        }`
      );
    } catch (error) {
      // Rollback on failure
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: currentState } : p))
      );
      toast.error("EXECUTION_ERROR: Failed to sync featured status");
    }
  };
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "RM_-RF: Are you sure you want to terminate this project record?"
      )
    )
      return;

    try {
      await apiInstance.delete(`/projects/${id}`);
      toast.success("SYSTEM_CLEAN: Project purged successfully");
      router.refresh();
    } catch (error) {
      toast.error("EXECUTION_ERROR: Failed to delete project");
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-[80px] font-mono text-[10px] uppercase text-zinc-500">
              Node
            </TableHead>
            <TableHead className="w-[80px] font-mono text-[10px] uppercase text-zinc-500">
              Featured
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase text-zinc-500">
              Project_Identity
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase text-zinc-500">
              Stack
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase text-zinc-500">
              Status
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase text-zinc-500 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center font-mono text-zinc-600 italic"
              >
                NO_PROJECTS_INITIALIZED.LOG
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow
                key={project.id}
                className="border-zinc-800 hover:bg-zinc-900/40 transition-colors group"
              >
                {/* Thumbnail Preview */}
                <TableCell>
                  <div className="h-10 w-12 rounded bg-zinc-950 border border-zinc-800 overflow-hidden">
                    <img
                      src={project.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Switch
                      checked={project.featured}
                      onCheckedChange={() =>
                        handleToggleFeatured(project.id, project.featured)
                      }
                      className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-800 scale-75"
                    />
                    {project.featured && (
                      <Star
                        size={10}
                        className="fill-emerald-500 text-emerald-500 animate-pulse"
                      />
                    )}
                  </div>
                </TableCell>

                {/* Title & Slug */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      {project.title}
                      {project.featured && (
                        <Star
                          size={12}
                          className="fill-emerald-500 text-emerald-500"
                        />
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600">
                      /{project.slug}
                    </span>
                  </div>
                </TableCell>

                {/* Tech Stack (Mapped from simple-array) */}
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {project.technologies?.slice(0, 3).map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-[9px] font-mono border-zinc-800 text-zinc-400 py-0 h-4"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies?.length > 3 && (
                      <span className="text-[9px] text-zinc-600 font-mono">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <Badge
                    className={
                      project.status === "published"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-mono"
                        : "bg-zinc-800 text-zinc-500 border-zinc-700 text-[10px] font-mono"
                    }
                  >
                    {project.status.toUpperCase()}
                  </Badge>
                </TableCell>

                {/* Dropdown Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-zinc-500 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-950 border-zinc-800 text-zinc-300 font-mono text-xs"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(project.liveUrl || "#", "_blank")
                        }
                        className="gap-2 cursor-pointer hover:text-emerald-400"
                      >
                        <ExternalLink size={14} /> view_deployment
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/projects/${project.slug}/edit`
                          )
                        }
                        className="gap-2 cursor-pointer hover:text-emerald-400"
                      >
                        <Edit size={14} /> modify_config
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(project.id)}
                        className="gap-2 cursor-pointer text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} /> purge_node
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/50 border-t border-zinc-800">
        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase">
          <Terminal size={12} className="text-emerald-500" />
          Showing {projects.length} of {meta.total} records
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono text-zinc-600 uppercase">
            Page {meta.page} of {meta.totalPages}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
            >
              <ChevronLeft size={16} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 disabled:opacity-30"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
