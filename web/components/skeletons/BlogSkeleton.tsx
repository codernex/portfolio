export function BlogSkeleton() {
  return (
    <div className="grid gap-4 w-full container mx-auto max-w-6xl">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 animate-pulse"
        >
          <div className="space-y-3 w-full">
            {/* Title Placeholder */}
            <div className="h-6 w-3/4 bg-zinc-800 rounded-md" />

            {/* Metadata Placeholder */}
            <div className="flex items-center gap-4">
              <div className="h-3 w-20 bg-zinc-900 rounded" />
              <div className="h-3 w-16 bg-zinc-900 rounded" />
              <div className="h-3 w-12 bg-zinc-900 rounded" />
            </div>
          </div>
          {/* Icon Placeholder */}
          <div className="h-5 w-5 bg-zinc-800 rounded-sm ml-4 shrink-0" />
        </div>
      ))}
    </div>
  );
}
