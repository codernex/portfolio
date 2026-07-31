// ISR: homepage data sections revalidate every 5 minutes
export const revalidate = 300;

import { BlogSkeleton } from "@/components/skeletons/BlogSkeleton";
import { ProjectSkeleton } from "@/components/skeletons/ProjectSkeleton";
import { Suspense } from "react";
import AboutSection from "./_components/AboutSection";
import BlogSection from "./_components/BlogSection";
import ContactSection from "./_components/ContactSection";
import ExperienceSection from "./_components/ExperienceSection";
import HeroSection from "./_components/HeroSection";
import ProjectsSection from "./_components/ProjectSection";
import SkillsSection from "./_components/SkillsSection";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 font-mono text-zinc-400">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<BlogSkeleton />}>
          <BlogSection />
        </Suspense>
        <ContactSection />
      </main>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-zinc-800 bg-zinc-950/90 px-8 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600 backdrop-blur-sm">
        <span className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          Status: Online
        </span>
        <span className="hidden sm:inline">
          Stack: Next.js + TypeScript + Tailwind
        </span>
        <span>©2024 CODERNEX</span>
      </div>
    </div>
  );
}
