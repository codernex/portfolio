"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Breadcrumb Header */}
      <header className="sticky top-16 z-40 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Link href="/" className="hover:text-emerald-500 transition-colors">
              ~
            </Link>
            <span>/</span>
            <span className="text-zinc-200">about_me</span>
          </div>
        </div>
      </header>

      <section className="px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <span className="font-mono text-sm text-emerald-500">
                  $ whoami
                </span>
                <h1 className="mt-2 text-5xl font-bold text-white tracking-tight">
                  Borhan Uddin
                </h1>
                <p className="mt-4 text-xl text-emerald-500/80 font-mono">
                  Full-stack Engineer // Backend Specialist
                </p>
              </div>

              <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                <p>
                  I am a Full-stack Engineer with over 4 years of experience,
                  currently focused on architecting high-performance backend
                  systems. Based in Khulna, Bangladesh, I specialize in building
                  scalable web applications using TypeScript, Go, and Node.js.
                </p>
                <p>
                  My professional journey is defined by a passion for system
                  modernization and performance optimization. I recently
                  improved application Lighthouse scores by 140% for major
                  projects, taking them from 45 to 95+ through strategic SSR
                  implementation and caching.
                </p>
                <p>
                  Whether it&lsquo;s designing fraud-resistant payment systems
                  or automating complex data pipelines with AWS and Docker, I
                  thrive on turning intricate business requirements into clean,
                  maintainable code.
                </p>
              </div>

              {/* Education Section */}
              {/* <div className="pt-8 border-t border-zinc-900">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="text-emerald-500" />
                  <h2 className="text-2xl font-bold text-white">Education</h2>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl">
                  <h3 className="text-white font-bold">
                    B.Sc. in Computer Science & Engineering
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Northern University of Business and Technology Khulna
                  </p>
                  <p className="mt-2 font-mono text-xs text-emerald-500/70">
                    Started: February 2025
                  </p>
                </div>
              </div> */}
            </div>

            {/* Right Column: System Specs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="sticky top-32">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-2xl">
                  {/* Terminal Header */}
                  <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/50" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500">
                      system_profile.yaml
                    </span>
                  </div>

                  <div className="p-6 font-mono text-sm space-y-4">
                    <div>
                      <span className="text-emerald-500 italic">
                        # Technical Core
                      </span>
                      <div className="grid grid-cols-2 mt-2 gap-y-2">
                        <span className="text-zinc-500">OS:</span>{" "}
                        <span className="text-zinc-300">Linux / Unix </span>
                        <span className="text-zinc-500">Primary:</span>{" "}
                        <span className="text-zinc-300">TypeScript / Go</span>
                        <span className="text-zinc-500">Backend:</span>{" "}
                        <span className="text-zinc-300">Nest.js / Node.js</span>
                        <span className="text-zinc-500">Cloud:</span>{" "}
                        <span className="text-zinc-300">AWS</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/50">
                      <span className="text-emerald-500 italic">
                        # Key_Metrics
                      </span>
                      <div className="mt-2 space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-500 uppercase">
                            <span>Performance Boost</span>
                            <span>140%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-[95%] bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-zinc-500 uppercase">
                            <span>Workflow Automation</span>
                            <span>40% Efficiency </span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full w-[75%] bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/50">
                      <span className="text-emerald-500 italic">
                        # Mentorship
                      </span>
                      <p className="mt-2 text-[12px] leading-relaxed text-zinc-400">
                        Served as a mentor in Subdistrict freelancing training,
                        guiding participants in project management and
                        communication.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Soft Skills Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Problem-solving",
                    "Leadership",
                    "Adaptability",
                    "Collaboration",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-500 uppercase"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
