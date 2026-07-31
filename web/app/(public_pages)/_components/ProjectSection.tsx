import { Project } from "@/types";
import { ChevronRight, ExternalLink, Github, Zap } from "lucide-react";
import Link from "next/link";
import Spotlight from "@/components/ui/Spotlight";

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/project/featured`,
      {
        next: {
          revalidate: 300, // ISR: re-fetch every 5 minutes
        },
      }
    );
    const result = (await res.json()) as { data: Project[] };
    return result.data || [];
  } catch (error) {
    console.error("FEATURED_PROJECTS_FETCH_ERROR:", error);
    return [];
  }
}

export default async function ProjectsSection() {
  const projects = await getFeaturedProjects();
  console.log("TCL: ProjectsSection -> projects", projects);

  return (
    <section className="relative border-t border-zinc-900 px-6 py-24 bg-zinc-950">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-mono text-sm text-emerald-500">
              <span className="opacity-60">$ </span>ls ./projects --featured
            </span>
            <h2 className="mt-2 text-4xl font-bold text-white tracking-tighter">
              Selected Works
            </h2>
          </div>

          <Link
            href="/projects"
            className="hidden md:flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-emerald-500 transition-colors"
          >
            VIEW_FULL_PORTFOLIO <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Spotlight
                key={project.id}
                className="group rounded-2xl border border-zinc-900 bg-zinc-900/10 hover:border-emerald-500/30 transition-all duration-500"
              >
                {/* Visual Preview */}
                <div className="relative h-56 w-full overflow-hidden border-b border-zinc-900">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  {project.featured && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <Zap className="h-3 w-3 fill-black" /> FEATURED_NODE
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-8">
                  <h3 className="mb-3 text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  <p className="mb-6 text-zinc-500 text-sm leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-zinc-950 border border-zinc-800 px-2 py-1 text-[10px] text-zinc-400 font-mono group-hover:border-emerald-500/20 group-hover:text-emerald-500/70 transition-colors z-10 relative"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between z-10 relative">
                    <div className="flex gap-5">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          className="text-zinc-600 hover:text-white transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          className="text-zinc-600 hover:text-white transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-mono font-bold text-emerald-500/60 hover:text-emerald-500 transition-colors"
                    >
                      DETAILS_VIEW
                    </Link>
                  </div>
                </div>
              </Spotlight>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-900 rounded-2xl">
              <p className="font-mono text-xs text-zinc-600">
                [SYSTEM_NOTICE]: No featured projects identified in current
                registry.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
