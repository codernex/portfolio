"use client";

import BlockEditor from "@/components/editor/BlockEditor";
import { MediaUpload } from "@/components/shared/MediaUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { apiInstance } from "@/lib/axios";
import { Blog, ContentBlock } from "@/types";
import { AxiosError } from "axios";
import {
  Globe,
  Image as ImageIcon,
  Loader2,
  Save,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function EditBlogForm({ initialData }: { initialData: Blog }) {
  console.log("TCL: EditBlogForm -> initialData", initialData);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Hydrate state from database
  const [content, setContent] = useState<ContentBlock[]>(
    initialData.content || []
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    initialData.featuredImage || ""
  );

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    const payload = {
      title,
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt"),
      featuredImage: featuredImageUrl,
      content: content,
      seoTitle: formData.get("seoTitle"),
      seoDescription: formData.get("seoDescription"),
      seoKeywords: formData.get("seoKeywords"),
      status: formData.get("status") || initialData.status,
      featured: formData.get("featured") === "on",
    };

    try {
      // Using PATCH for partial updates to the existing record
      await apiInstance.patch(`/blog/${initialData.id}`, payload);

      toast.success("FS_SYNC_SUCCESS: Journal entry updated");
      router.push("/dashboard/blogs");
      router.refresh();
    } catch (err) {
      const error = err as AxiosError;
      toast.error(
        `PATCH_ERR: ${error.response?.data || "Internal_Sync_Error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* LEFT COLUMN: Main Content Stream */}
      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2 tracking-widest">
            <Terminal size={12} /> Entry_Title
          </label>
          <Input
            name="title"
            required
            defaultValue={initialData.title}
            className="bg-zinc-900 border-zinc-800 text-white text-lg font-bold focus:border-emerald-500/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2 tracking-widest">
            <Terminal size={12} /> Excerpt_Summary
          </label>
          <Textarea
            name="excerpt"
            defaultValue={initialData.excerpt ?? ""}
            className="bg-zinc-900 border-zinc-800 text-zinc-300 min-h-[100px] leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1">
            Technical_Documentation_Nodes
          </label>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-inner">
            <BlockEditor onChange={setContent} initialContent={content} />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Deployment & SEO Metadata */}
      <div className="lg:col-span-4 space-y-6">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-6">
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-500 uppercase border-b border-zinc-800 pb-2">
              <Globe size={12} /> Deployment_Configs
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                Slug_Endpoint
              </label>
              <Input
                name="slug"
                defaultValue={initialData.slug}
                className="bg-zinc-950 border-zinc-800 text-xs font-mono text-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2">
                <ImageIcon size={12} /> Featured_Asset
              </label>
              <MediaUpload
                mode="single"
                onUploadSuccess={(urls) => setFeaturedImageUrl(urls[0])}
                defaultValue={initialData.featuredImage ?? ""}
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 px-1">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={initialData.featured}
                  className="accent-emerald-500 h-4 w-4"
                />
                <label
                  htmlFor="featured"
                  className="text-xs font-mono text-zinc-400 cursor-pointer"
                >
                  Featured_Post_Status
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">
                  System_Status
                </label>
                <select
                  name="status"
                  defaultValue={initialData.status}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-2 text-xs text-zinc-400 font-mono outline-none"
                >
                  <option value="published">PUBLISHED</option>
                  <option value="draft">DRAFT</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* SEO Specifics */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-zinc-600 uppercase italic mb-2">
                Metadata_Heads
              </div>
              <Input
                name="seoTitle"
                placeholder="SEO Title"
                defaultValue={initialData.seoTitle ?? ""}
                className="bg-zinc-950 border-zinc-800 text-[11px]"
              />
              <Input
                name="seoKeywords"
                placeholder="SEO Keywords"
                defaultValue={initialData.seoKeywords ?? ""}
                className="bg-zinc-950 border-zinc-800 text-[11px]"
              />
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-mono font-bold py-7 shadow-[0_0_25px_rgba(16,185,129,0.1)] group"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Save
                    className="mr-2 group-hover:scale-110 transition-transform"
                    size={18}
                  />
                )}
                {loading ? "SYNCING..." : "COMMIT_PATCH"}
              </Button>

              <Button
                variant="ghost"
                type="button"
                onClick={() => router.back()}
                className="w-full text-zinc-600 font-mono text-[10px] hover:text-white"
              >
                ABORT_OPERATION
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
