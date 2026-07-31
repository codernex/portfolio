// components/skeletons/ProjectSkeleton.tsx
export function ProjectSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 container mx-auto max-w-6xl">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-900 bg-zinc-900/10 overflow-hidden animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="h-56 w-full bg-zinc-900 border-b border-zinc-800" />

          <div className="p-8 space-y-4">
            {/* Title */}
            <div className="h-8 w-1/2 bg-zinc-800 rounded-md" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-900 rounded" />
              <div className="h-4 w-2/3 bg-zinc-900 rounded" />
            </div>

            {/* Tech Stack Tags */}
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-zinc-800 rounded" />
              <div className="h-6 w-16 bg-zinc-800 rounded" />
              <div className="h-6 w-16 bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
