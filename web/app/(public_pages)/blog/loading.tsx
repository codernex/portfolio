// app/blog/loading.tsx

export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300">
      <div className="container mx-auto max-w-6xl px-6 py-16">
        {/* Hero Skeleton */}
        <div className="mb-16 space-y-4">
          <div className="h-4 w-32 animate-pulse bg-zinc-900 rounded" />
          <div className="h-12 w-64 animate-pulse bg-zinc-900 rounded" />
          <div className="h-4 w-96 animate-pulse bg-zinc-900 rounded" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-14 w-full animate-pulse bg-zinc-900 rounded-lg mb-12" />

        {/* List Skeletons */}
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 opacity-50">
              <div className="md:w-36 space-y-3">
                <div className="h-3 w-20 animate-pulse bg-zinc-800 rounded" />
                <div className="h-3 w-24 animate-pulse bg-zinc-800 rounded" />
              </div>
              <div className="flex-grow space-y-4">
                <div className="h-8 w-3/4 animate-pulse bg-zinc-800 rounded" />
                <div className="h-4 w-full animate-pulse bg-zinc-800 rounded" />
                <div className="h-4 w-1/2 animate-pulse bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
