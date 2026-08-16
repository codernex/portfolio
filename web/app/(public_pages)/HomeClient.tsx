"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { toast } from "sonner";
import { useOSStore } from "@/lib/os-store";
import OSDesktop from "@/components/os/OSDesktop";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "./_components/HeroSection";
import AboutSection from "./_components/AboutSection";
import SkillsSection from "./_components/SkillsSection";
import ContactSection from "./_components/ContactSection";
import { ProjectSkeleton } from "@/components/skeletons/ProjectSkeleton";
import { BlogSkeleton } from "@/components/skeletons/BlogSkeleton";
import SystemBootLoader from "@/components/shared/SystemBootLoader";

interface HomeClientProps {
  projectsSection?: React.ReactNode;
  blogSection?: React.ReactNode;
  experienceSection?: React.ReactNode;
}

export default function HomeClient({ projectsSection, blogSection, experienceSection }: HomeClientProps) {
  const { viewMode, setViewMode, toggleViewMode } = useOSStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check viewport width and restrict desktop mode on mobile (< 768px)
    const checkMobileRestriction = () => {
      if (typeof window !== "undefined" && window.innerWidth < 768 && viewMode === "os") {
        setViewMode("classic");
        toast.error("Desktop Mode Restricted on Mobile", {
          description: "NexOS Desktop environment requires a desktop screen (min-width: 768px). Switched to Classic view.",
        });
      }
    };

    checkMobileRestriction();
    window.addEventListener("resize", checkMobileRestriction);
    return () => window.removeEventListener("resize", checkMobileRestriction);
  }, [viewMode, setViewMode]);

  const handleToggleView = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && viewMode === "classic") {
      toast.error("Desktop Environment Restricted", {
        description: "NexOS Desktop requires a desktop display (min-width: 768px). Please use a larger screen to explore desktop OS mode.",
      });
      return;
    }
    toggleViewMode();
  };

  useEffect(() => {
    // Lock overflow during initial boot
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (viewMode === "classic") {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mounted, viewMode]);

  if (!mounted) {
    return <SystemBootLoader />;
  }

  if (viewMode === "os") {
    return <OSDesktop />;
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 font-mono text-zinc-400">
      {/* Classic View Navigation Bar */}
      <Navbar />

      {/* Floating View Switcher Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-[120]">
        <button
          onClick={handleToggleView}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-emerald-500/50 bg-zinc-950/90 text-emerald-400 hover:bg-zinc-900 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-xl text-xs font-mono font-bold transition-all cursor-pointer group active:scale-95"
          title="Switch to NexOS Desktop Interface"
        >
          <Terminal size={15} className="group-hover:rotate-12 transition-transform text-emerald-400" />
          <span>Switch to NexOS Desktop</span>
        </button>
      </div>

      {/* Background Grid Effect */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 pb-16 pt-16">
        <HeroSection />
        <AboutSection />
        {experienceSection && (
          <Suspense>
            {experienceSection}
          </Suspense>
        )}
        <SkillsSection />
        {projectsSection && (
          <Suspense fallback={<ProjectSkeleton />}>
            {projectsSection}
          </Suspense>
        )}
        {blogSection && (
          <Suspense fallback={<BlogSkeleton />}>
            {blogSection}
          </Suspense>
        )}
        <ContactSection />
      </main>
    </div>
  );
}
