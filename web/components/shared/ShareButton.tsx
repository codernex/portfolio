"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <button onClick={handleShare} className="group relative outline-none focus:outline-none">
      <Share2 className="h-4 w-4 cursor-pointer text-zinc-600 hover:text-emerald-500 transition-colors" />
    </button>
  );
}
