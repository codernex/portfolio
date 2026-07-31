"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl text-center">
        {/* Terminal Header */}
        <div className="mb-8 flex items-center justify-center gap-2 text-xs">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-zinc-600">~/codernex/portfolio</span>
        </div>

        {/* Typing Effect */}
        <div className="mb-6 font-mono text-sm text-emerald-500">
          <span className="opacity-60">$ </span>
          <span className="animate-pulse">cat introduction.txt</span>
        </div>

        {/* Main Title */}
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl">
          {"Hi, I'm"}{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Borhan Uddin
          </span>
        </h1>

        <p className="mb-4 text-xl text-zinc-400 sm:text-2xl">
          Full Stack Developer & Digital Architect
        </p>

        <p className="mx-auto mb-10 max-w-2xl text-zinc-500">
          Building scalable web applications with modern technologies.
          Passionate about clean code, user experience, and turning complex
          problems into elegant solutions.
        </p>

        {/* CTA Buttons */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-emerald-500 text-black hover:bg-emerald-400"
          >
            <Link href={"/projects"}>
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </Button>

          <Button
            size="lg"
            onClick={() => {
              window.location.href =
                "https://docs.google.com/document/d/1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U/export?format=pdf";
            }}
            variant="outline"
            className="border-zinc-700 bg-transparent hover:bg-zinc-900 hover:text-white cursor-pointer"
          >
            Download CV
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/codernex"
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 transition-all hover:border-emerald-500 hover:bg-zinc-800"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/in/codernex"
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 transition-all hover:border-emerald-500 hover:bg-zinc-800"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:borhan.dev@gmail.com"
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 transition-all hover:border-emerald-500 hover:bg-zinc-800"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-emerald-500" />
      </div>
    </section>
  );
}
