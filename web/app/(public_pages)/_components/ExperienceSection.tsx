import { CheckCircle2, Terminal } from "lucide-react";
import { Experience } from "@/types";

async function getExperiences(): Promise<Experience[]> {
  try {
    // Use native fetch (not axios) so Next.js ISR caching works
    // and cookies() is never called during static generation
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`, {
      next: { revalidate: 300 }, // ISR: re-fetch every 5 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("EXPERIENCE_FETCH_ERROR:", error);
    return [];
  }
}

export default async function ExperienceSection() {
  const experiences = await getExperiences();

  if (experiences?.length === 0) {
    return null; // Don't render section if no experiences
  }

  return (
    <section className="relative border-t border-zinc-800 bg-zinc-950 px-6 py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16">
          <div className="flex items-center gap-2 font-mono text-sm text-emerald-500">
            <Terminal size={16} />
            <span className="opacity-60">system@codernex:~$</span>
            <span>ls ./experience/history</span>
          </div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Professional <span className="text-emerald-500">Journey</span>
          </h2>
        </div>

        <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-10px)] before:w-[1px] before:bg-zinc-800 sm:before:left-1/2">
          {experiences?.map((exp, index) => (
            <div key={index} className="group relative">
              {/* Timeline Dot */}
              <div className="absolute left-0 top-2 z-10 h-6 w-6 -translate-x-[1px] rounded-full border-4 border-zinc-950 bg-emerald-500 transition-transform group-hover:scale-125 sm:left-1/2 sm:-ml-3" />

              <div
                className={`relative flex flex-col ${index % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
                  } items-center`}
              >
                <div className="w-full sm:w-1/2" />

                <div className="mt-8 w-full sm:mt-0 sm:w-1/2 sm:px-8">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-zinc-900/60">
                    <div className="mb-4">
                      <span className="font-mono text-xs font-medium uppercase tracking-widest text-emerald-500">
                        {exp.period}
                      </span>
                      <h3 className="mt-1 text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-lg text-zinc-300">
                        {exp.company} <span className="text-zinc-600">|</span>{" "}
                        <span className="text-sm text-zinc-500">
                          {exp.location}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Responsibilities */}
                      <ul className="space-y-2">
                        {exp.responsibilities.map((resp, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-zinc-400"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500/50" />
                            {resp}
                          </li>
                        ))}
                      </ul>

                      {/* Achievements */}
                      <div className="rounded-lg bg-emerald-500/5 p-3">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
                          Key Achievements
                        </p>
                        <ul className="space-y-2">
                          {exp.achievements.map((ach, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-xs text-zinc-300"
                            >
                              <CheckCircle2
                                size={14}
                                className="mt-0.5 shrink-0 text-emerald-500"
                              />
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] font-medium text-zinc-500 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
