"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Terminal,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming shadcn Textarea
import { apiInstance } from "@/lib/axios";
import { ContentBlock } from "@/types";
import BlockEditor from "@/components/editor/BlockEditor";
import { MediaUpload } from "@/components/shared/MediaUpload";

export function CreateBlog() {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Auto-generate slug if title exists, or use manual slug field
    const title = formData.get("title") as string;
    const manualSlug = formData.get("slug") as string;
    const generatedSlug =
      manualSlug ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const payload = {
      title,
      slug: generatedSlug,
      excerpt: formData.get("excerpt"),
      featuredImage: formData.get("featuredImage"),
      content: content,
      seoTitle: formData.get("seoTitle") || title,
      seoDescription: formData.get("seoDescription") || formData.get("excerpt"),
      seoKeywords: formData.get("seoKeywords"),
      status: "published",
      featured: formData.get("featured") === "on",
    };

    try {
      const res = await apiInstance.post(`/blog`, payload);

      if (res.status === 201) {
        toast.success("ENTRY_COMMITTED: System updated successfully");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "TRANSMISSION_FAILURE";
      toast.error(`ERROR: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4"
    >
      {/* LEFT COLUMN: Main Content */}
      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2">
            <Terminal size={12} /> Entry_Title
          </label>
          <Input
            name="title"
            required
            placeholder="Optimizing NestJS Microservices..."
            className="bg-zinc-900 border-zinc-800 text-white text-lg font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2">
            <Terminal size={12} /> Excerpt_Summary
          </label>
          <Textarea
            name="excerpt"
            placeholder="A brief summary for the blog archive..."
            className="bg-zinc-900 border-zinc-800 text-zinc-300 min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase">
            Body_Content_Stream
          </label>
          <div className="rounded-md border border-zinc-800 bg-zinc-950 overflow-hidden">
            <BlockEditor
              onChange={(blocks) => setContent(blocks)}
              initialContent={[]}
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Metadata & SEO */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-6">
          <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-500 uppercase border-b border-zinc-800 pb-2">
            <Globe size={12} /> SEO_Configurations
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase">
              Slug_Endpoint
            </label>
            <Input
              name="slug"
              placeholder="auto-generated-if-empty"
              className="bg-zinc-950 border-zinc-800 text-xs font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2">
              <ImageIcon size={12} /> Featured_Image_System
            </label>
            <MediaUpload
              mode="single"
              onUploadSuccess={(urls) => setFeaturedImageUrl(urls[0])}
            />
            {/* Hidden input to ensure value is captured in FormData if needed */}
            <input
              type="hidden"
              name="featuredImage"
              value={featuredImageUrl}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase">
              SEO_Title
            </label>
            <Input
              name="seoTitle"
              className="bg-zinc-950 border-zinc-800 text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase">
              SEO_Keywords
            </label>
            <Input
              name="seoKeywords"
              placeholder="nestjs, typescript, backend"
              className="bg-zinc-950 border-zinc-800 text-xs"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-mono font-bold py-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              {loading ? "COMMITTING..." : "PUBLISH_LIVE"}
            </Button>
            <p className="mt-4 text-[9px] font-mono text-zinc-600 text-center uppercase tracking-tighter">
              Status: Ready_For_Postgres_Commit
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
