"use client";

import {
  Code2,
  Github,
  Globe,
  Layout,
  Link as LinkIcon,
  Loader2,
  Save,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import BlockEditor from "@/components/editor/BlockEditor";
import { MediaUpload } from "@/components/shared/MediaUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiInstance } from "@/lib/axios";
import { ContentBlock } from "@/types";

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Process technologies string into array
    const techInput = formData.get("technologies") as string;
    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.get("title"),
      slug:
        formData.get("slug") ||
        (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-"),
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("shortDescription"), // Primary text summary
      content: content,
      thumbnailUrl: thumbnail,
      images: gallery,
      technologies: technologies,
      liveUrl: formData.get("liveUrl"),
      githubUrl: formData.get("githubUrl"),
      featured: formData.get("featured") === "on",
      seoTitle: formData.get("seoTitle"),
      seoDescription: formData.get("seoDescription"),
      status: "published",
    };

    try {
      await apiInstance.post("/project", payload);
      toast.success("PROJECT_INITIALIZED: Data committed to registry");
      router.push("/dashboard/projects");
      router.refresh();
    } catch (error) {
      toast.error("DEPLOYMENT_FAILED: Check backend logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-emerald-500 text-sm mb-1">
            <Terminal size={14} />
            <span>sudo mkdir ./projects/new_build</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            New Project Architecture
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* LEFT COLUMN: Project Narrative */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Project_Title
              </label>
              <Input
                name="title"
                required
                className="bg-zinc-950 border-zinc-800 text-white"
                placeholder="E-commerce Engine v2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Brief_Description
              </label>
              <Textarea
                name="shortDescription"
                required
                className="bg-zinc-950 border-zinc-800 text-zinc-300 min-h-[100px]"
                placeholder="Summarize the core technical challenge and solution..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1">
              Technical_Documentation (Blocks)
            </label>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
              <BlockEditor onChange={setContent} initialContent={[]} />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Layout size={14} /> Project_Gallery
            </label>
            <MediaUpload mode="multiple" onUploadSuccess={setGallery} />
          </div>
        </div>

        {/* RIGHT COLUMN: Deployment Specs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
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
                />
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">
                  Slug_Endpoint
                </label>
                <Input
                  name="slug"
                  placeholder="auto-gen-link"
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
                placeholder="NestJS, TypeORM, Next.js, Redis"
                className="bg-zinc-950 border-zinc-800"
              />
              <p className="text-[9px] text-zinc-600 font-mono italic px-1">
                Comma-separated values for database simple-array
              </p>
            </div>

            {/* Links */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                  <LinkIcon size={12} /> Deployment_URL
                </div>
                <Input
                  name="liveUrl"
                  className="bg-zinc-950 border-zinc-800 text-xs"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                  <Github size={12} /> Repository_URL
                </div>
                <Input
                  name="githubUrl"
                  className="bg-zinc-950 border-zinc-800 text-xs"
                  placeholder="https://github.com/..."
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
                {loading ? "COMMITTING_BUILD..." : "EXECUTE_DEPLOYMENT"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
