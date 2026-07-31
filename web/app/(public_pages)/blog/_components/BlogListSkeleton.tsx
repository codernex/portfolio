export function BlogListSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col md:flex-row gap-8 opacity-40">
          <div className="md:w-32 h-4 bg-zinc-800 rounded animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
