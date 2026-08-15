"use client";

import React from "react";
import { Terminal } from "lucide-react";

export default function SystemBootLoader() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950 font-mono text-zinc-300 select-none overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {/* Background Cyber Grid Wallpaper & Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Main Loader Core */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm px-6 text-center">
        {/* Animated Terminal Icon Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" />
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/50 bg-zinc-900 text-emerald-400"
            style={{ boxShadow: "0 0 30px rgba(16, 185, 129, 0.35)" }}
          >
            <Terminal size={28} className="animate-pulse text-emerald-400" />
          </div>
          {/* Orbit Ring */}
          <div
            className="absolute -inset-3 rounded-3xl border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
        </div>

        {/* Brand & Loading Status */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-white text-lg tracking-tight">
              Nex<span className="text-emerald-400">OS</span> System Boot
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">Initializing System Kernel & Environment...</p>
        </div>

        {/* Animated Progress Bar Line */}
        <div className="w-56 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
          <div
            className="h-full bg-emerald-500 animate-pulse w-full origin-left"
            style={{ boxShadow: "0 0 12px #10b981" }}
          />
        </div>

        {/* System Notice Status */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>[SYSTEM_READY]: Booting environment...</span>
        </div>
      </div>
    </div>
  );
}
