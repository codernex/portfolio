"use client";

import {
  ArrowLeft,
  Code2,
  Github,
  Globe,
  Layout,
  Link as LinkIcon,
  Loader2,
  Save,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import BlockEditor from "@/components/editor/BlockEditor";
import { MediaUpload } from "@/components/shared/MediaUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiInstance } from "@/lib/axios";
import { ContentBlock, Project } from "@/types";

interface EditProjectProps {
  project: Project;
}

export default function EditProjectPage({ project }: EditProjectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Hydrate state with existing database records
  const [content, setContent] = useState<ContentBlock[]>(project.content || []);
  const [thumbnail, setThumbnail] = useState(project.thumbnailUrl || "");
  const [gallery, setGallery] = useState<string[]>(project.images || []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const techInput = formData.get("technologies") as string;
    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("shortDescription"),
      content: content,
      thumbnailUrl: thumbnail,
      images: gallery,
      technologies: technologies,
      liveUrl: formData.get("liveUrl"),
      githubUrl: formData.get("githubUrl"),
      featured: formData.get("featured") === "on",
      status: formData.get("status"), // Added status control
    };

    try {
      // Using PATCH for partial updates
      await apiInstance.patch(`/project/${project.id}`, payload);
      toast.success("FS_SYNC_COMPLETE: Registry record updated");
      router.push("/dashboard/projects");
      router.refresh();
    } catch (error) {
      toast.error("COMMIT_FAILED: Error during synchronization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* Header with Navigation Back */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/projects"
            className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 font-mono text-emerald-500 text-sm mb-1">
              <Terminal size={14} />
              <span>sudo nano ./projects/{project.slug}.config</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Edit Project Architecture
            </h1>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* LEFT COLUMN: Narrative Update */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Project_Title
              </label>
              <Input
                name="title"
                required
                defaultValue={project.title}
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Brief_Description
              </label>
              <Textarea
                name="shortDescription"
                required
                defaultValue={project.shortDescription}
                className="bg-zinc-950 border-zinc-800 text-zinc-300 min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1">
              Technical_Documentation (Blocks)
            </label>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
              <BlockEditor onChange={setContent} initialContent={content} />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Layout size={14} /> Project_Gallery
            </label>
            <MediaUpload
              mode="multiple"
              onUploadSuccess={setGallery}
              defaultValue={gallery}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Deployment Config */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Project Status Toggle */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <label className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
                System_Status
              </label>
              <select
                name="status"
                defaultValue={project.status}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-300 font-mono outline-none focus:border-emerald-500/50"
              >
                <option value="published">PUBLISHED</option>
                <option value="draft">DRAFT</option>
              </select>

              <div className="flex items-center gap-3 px-1 pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={project.featured}
                  className="accent-emerald-500 h-4 w-4"
                />
                <label
                  htmlFor="featured"
                  className="text-xs font-mono text-zinc-400 cursor-pointer"
                >
                  Mark as Featured_Work
                </label>
              </div>
            </div>

            {/* Primary Assets */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <label className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <Globe size={14} /> Global_Assets
              </label>
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 font-mono">
                  THUMBNAIL_IMG
                </span>
                <MediaUpload
                  mode="single"
                  onUploadSuccess={(urls) => setThumbnail(urls[0])}
                  defaultValue={thumbnail ? [thumbnail] : []}
                />
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">
                  Slug_Endpoint
                </label>
                <Input
                  name="slug"
                  defaultValue={project.slug}
                  className="bg-zinc-950 border-zinc-800 text-xs font-mono"
                />
              </div>
            </div>

            {/* Tech Stack */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <label className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <Code2 size={14} /> Stack_Architecture
              </label>
              <Input
                name="technologies"
                defaultValue={project.technologies?.join(", ")}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>

            {/* Links */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                  <LinkIcon size={12} /> Deployment_URL
                </div>
                <Input
                  name="liveUrl"
                  defaultValue={project.liveUrl}
                  className="bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                  <Github size={12} /> Repository_URL
                </div>
                <Input
                  name="githubUrl"
                  defaultValue={project.githubUrl}
                  className="bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-mono font-bold py-7 shadow-[0_0_25px_rgba(16,185,129,0.15)] group"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Save
                    className="mr-2 group-hover:scale-110 transition-transform"
                    size={18}
                  />
                )}
                {loading ? "PATCHING_RECORDS..." : "COMMIT_CHANGES"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
