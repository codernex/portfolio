export default function ProjectDetailSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-24 animate-pulse">
      <div className="container mx-auto max-w-6xl space-y-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-6 bg-zinc-900 rounded" />
          <div className="h-4 w-48 bg-zinc-900 rounded" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-4">
              <div className="h-14 w-3/4 bg-zinc-900 rounded-lg" />
              <div className="h-20 w-full bg-zinc-900/50 rounded-lg border border-zinc-900" />
            </div>

            <div className="h-32 w-full bg-emerald-500/5 border border-emerald-500/10 rounded-xl" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="aspect-video bg-zinc-900 rounded-lg" />
              <div className="aspect-video bg-zinc-900 rounded-lg" />
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="h-48 w-full bg-zinc-900/30 rounded-xl border border-zinc-800" />
            <div className="h-32 w-full bg-zinc-900/30 rounded-xl border border-zinc-800" />
          </aside>
        </div>
      </div>
    </main>
  );
}
