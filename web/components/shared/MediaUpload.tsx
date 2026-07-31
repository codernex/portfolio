"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  FileText,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiInstance } from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Media } from "@/types";

interface MediaUploadProps {
  onUploadSuccess: (urls: string[]) => void;
  mode?: "single" | "multiple";
  defaultValue?: string | string[] | Media | Media[];
  endpoint?: string;
}

export function MediaUpload({
  onUploadSuccess,
  mode = "single",
  defaultValue = [],
}: MediaUploadProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract URLs from mixed defaultValue types (Media objects or Strings)
  const extractUrls = (val: any): string[] => {
    if (!val) return [];
    const arr = Array.isArray(val) ? val : [val];
    return arr.map((item) => (typeof item === "string" ? item : item.url));
  };

  // Sync state when defaultValue changes (crucial for Edit pages)
  useEffect(() => {
    setFiles(extractUrls(defaultValue));
  }, [defaultValue]);

  const uploadToBackend = async (selectedFiles: FileList | File[]) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setIsUploading(true);

    const activeEndpoint =
      mode === "single" ? "/media/upload" : "/media/uploads";
    const formData = new FormData();

    if (mode === "single") {
      formData.append("file", selectedFiles[0]);
    } else {
      Array.from(selectedFiles).forEach((f) => formData.append("files", f));
    }

    try {
      const res = await apiInstance.post<{ data: Media | Media[] }>(
        activeEndpoint,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const responseData = res.data.data;
      const uploadedUrls = Array.isArray(responseData)
        ? responseData.map((m) => m.url)
        : [responseData.url];

      const newFiles =
        mode === "single" ? uploadedUrls : [...files, ...uploadedUrls];

      setFiles(newFiles);
      onUploadSuccess(newFiles);
      toast.success(`FS_SYNC: ${uploadedUrls.length} assets committed to S3`);
    } catch (error) {
      console.error("UPLOAD_FAILURE:", error);
      toast.error("FS_ERR: Write operation aborted by server");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag and Drop Logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isUploading) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      uploadToBackend(droppedFiles);
    }
  };

  const removeFile = (urlToRemove: string) => {
    const updated = files.filter((url) => url !== urlToRemove);
    setFiles(updated);
    onUploadSuccess(updated);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group relative cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all duration-200",
          "bg-zinc-950/50 border-zinc-800 hover:bg-zinc-900/40 hover:border-emerald-500/50",
          isDragging &&
            "border-emerald-500 bg-emerald-500/10 scale-[1.01] ring-4 ring-emerald-500/5",
          isUploading && "pointer-events-none opacity-50 grayscale"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && uploadToBackend(e.target.files)}
          multiple={mode === "multiple"}
          className="hidden"
          accept="image/*,video/*,application/pdf"
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {isUploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          ) : (
            <div
              className={cn(
                "p-4 rounded-full bg-zinc-900 border border-zinc-800 transition-all shadow-inner",
                isDragging
                  ? "border-emerald-500 text-emerald-500 shadow-emerald-500/20"
                  : "group-hover:border-emerald-500/50 group-hover:text-emerald-500"
              )}
            >
              <Upload className="h-6 w-6" />
            </div>
          )}

          <div className="space-y-1">
            <p className="font-mono text-xs font-bold text-zinc-200 uppercase tracking-wider">
              {isUploading
                ? "Committing_Data..."
                : isDragging
                ? "Release_to_Upload"
                : "Push_to_Cloud_Storage"}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono italic">
              LIMIT: {mode.toUpperCase()} | MIME: IMG, VID, PDF
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 pt-2">
          {files.map((url, index) => {
            const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
            const isPdf = url.match(/\.pdf$/i);

            return (
              <div
                key={url + index}
                className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl"
              >
                {isVideo ? (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-emerald-500">
                    <Video size={32} />
                  </div>
                ) : isPdf ? (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-emerald-500">
                    <FileText size={32} />
                  </div>
                ) : (
                  <img
                    src={url}
                    alt="preview"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {/* Overlay with Blur */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-2xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(url);
                    }}
                  >
                    <X size={18} />
                  </Button>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-2 right-2">
                  <div className="bg-zinc-950/90 backdrop-blur-md p-1.5 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
