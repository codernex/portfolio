"use client";

import React from "react";
import { Settings, Palette, Layout, Volume2, VolumeX, Sparkles, Check } from "lucide-react";
import { useOSStore, OSTheme } from "@/lib/os-store";

export default function OSSettingsView() {
  const { theme, setTheme, viewMode, setViewMode, soundEnabled, toggleSound } = useOSStore();

  const themes: { id: OSTheme; name: string; class: string; border: string }[] = [
    { id: "emerald", name: "Cyber Emerald", class: "bg-emerald-500", border: "border-emerald-500" },
    { id: "cyan", name: "Neon Cyan", class: "bg-cyan-500", border: "border-cyan-500" },
    { id: "amber", name: "Retro Amber", class: "bg-amber-500", border: "border-amber-500" },
    { id: "purple", name: "Synthwave Purple", class: "bg-purple-500", border: "border-purple-500" },
  ];

  return (
    <div className="p-6 font-mono text-zinc-300 space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
        <Settings className="text-emerald-400" size={20} />
        <div>
          <h2 className="text-sm font-bold text-white">System Preferences</h2>
          <p className="text-[11px] text-zinc-500">Customize NexOS visual appearance & audio feedback</p>
        </div>
      </div>

      {/* Theme Accent Color */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Palette size={14} className="text-emerald-400" />
          <span>Accent Palette</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center justify-between p-3 rounded-lg border bg-zinc-900/60 hover:bg-zinc-800 transition-all ${
                theme === t.id ? `${t.border} shadow-[0_0_12px_rgba(16,185,129,0.2)]` : "border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-4 w-4 rounded-full ${t.class}`} />
                <span className="text-xs text-white">{t.name}</span>
              </div>
              {theme === t.id && <Check size={14} className="text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Mode */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Layout size={14} className="text-emerald-400" />
          <span>Default Display Mode</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setViewMode("os")}
            className={`p-3 rounded-lg border text-left bg-zinc-900/60 hover:bg-zinc-800 transition-all ${
              viewMode === "os" ? "border-emerald-500 text-white" : "border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">NexOS Desktop</span>
              {viewMode === "os" && <Sparkles size={12} className="text-emerald-400" />}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Multi-window desktop interface with folders & dock.</p>
          </button>

          <button
            onClick={() => setViewMode("classic")}
            className={`p-3 rounded-lg border text-left bg-zinc-900/60 hover:bg-zinc-800 transition-all ${
              viewMode === "classic" ? "border-emerald-500 text-white" : "border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Classic Scroll</span>
              {viewMode === "classic" && <Check size={12} className="text-emerald-400" />}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Traditional single-page web portfolio view.</p>
          </button>
        </div>
      </div>

      {/* Sound Settings */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {soundEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} className="text-zinc-500" />}
          <div>
            <span className="text-xs font-bold text-white">System Audio</span>
            <p className="text-[10px] text-zinc-500">Interactive click & window sound effects</p>
          </div>
        </div>
        <button
          onClick={toggleSound}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            soundEnabled ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
        >
          {soundEnabled ? "ENABLED" : "MUTED"}
        </button>
      </div>
    </div>
  );
}
