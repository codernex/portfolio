"use client";

import React from "react";
import {
  Settings,
  Palette,
  Layout,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  MousePointer,
  RotateCcw,
  Image as ImageIcon,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import { useOSStore, OSTheme, OSWallpaper } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";

export default function OSSettingsView() {
  const {
    theme,
    setTheme,
    wallpaper,
    setWallpaper,
    viewMode,
    setViewMode,
    soundEnabled,
    toggleSound,
    customCursorEnabled,
    toggleCustomCursor,
    resetDesktop,
  } = useOSStore();

  const themeConfig = getThemeConfig(theme);

  const themes: { id: OSTheme; name: string; class: string; border: string }[] = [
    { id: "emerald", name: "Cyber Emerald", class: "bg-emerald-500", border: "border-emerald-500" },
    { id: "cyan", name: "Neon Cyan", class: "bg-cyan-500", border: "border-cyan-500" },
    { id: "amber", name: "Retro Amber", class: "bg-amber-500", border: "border-amber-500" },
    { id: "purple", name: "Synthwave Purple", class: "bg-purple-500", border: "border-purple-500" },
    { id: "crimson", name: "Crimson Matrix", class: "bg-rose-500", border: "border-rose-500" },
    { id: "solar", name: "Solar Flare", class: "bg-orange-500", border: "border-orange-500" },
  ];

  const wallpapers: { id: OSWallpaper; name: string; desc: string }[] = [
    { id: "grid", name: "Cyber Grid", desc: "40px Grid Lines & Ambient Glow" },
    { id: "matrix", name: "Matrix Rain", desc: "Radial Node Matrix Pattern" },
    { id: "gradient", name: "Deep Space", desc: "Nebula Ambient Glow Gradient" },
    { id: "minimal", name: "Minimal Slate", desc: "Dark Solid Slate Canvas" },
    { id: "blueprint", name: "Blueprint", desc: "Architectural Tech Blue Lines" },
  ];

  return (
    <div className="p-6 font-mono text-zinc-300 space-y-6 max-w-xl mx-auto">
      {/* Top Bar Banner */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Settings className={themeConfig.text} size={20} />
          <div>
            <h2 className="text-sm font-bold text-white">System Preferences</h2>
            <p className="text-[11px] text-zinc-500">Configure NexOS visual themes, wallpaper & cursor</p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${themeConfig.bgSubtle} border ${themeConfig.borderSubtle} text-[10px] ${themeConfig.text} font-bold`}>
          <Database size={12} />
          <span>Synced Storage</span>
        </div>
      </div>

      {/* Theme Accent Color */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Palette size={14} className={themeConfig.text} />
          <span>Accent Color Palette</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTheme(t.id);
              }}
              className={`flex items-center justify-between p-2.5 rounded-lg border bg-zinc-900/60 hover:bg-zinc-800 transition-all cursor-pointer ${
                theme === t.id ? `${t.border} ${themeConfig.shadow}` : "border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-3.5 w-3.5 rounded-full ${t.class}`} />
                <span className="text-[11px] text-white font-bold">{t.name}</span>
              </div>
              {theme === t.id && <Check size={12} className={themeConfig.text} />}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Wallpaper Engine */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <ImageIcon size={14} className={themeConfig.text} />
          <span>Desktop Wallpaper Engine</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setWallpaper(w.id);
              }}
              className={`p-3 rounded-lg border text-left bg-zinc-900/60 hover:bg-zinc-800 transition-all cursor-pointer ${
                wallpaper === w.id ? `${themeConfig.border} text-white` : "border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{w.name}</span>
                {wallpaper === w.id && <Sparkles size={12} className={themeConfig.text} />}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">{w.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Display View Mode */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Layout size={14} className={themeConfig.text} />
          <span>Default Display Mode</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof window !== "undefined" && window.innerWidth < 768) {
                toast.error("Desktop Environment Restricted", {
                  description: "NexOS Desktop environment requires a desktop screen (min-width: 768px).",
                });
                return;
              }
              setViewMode("os");
            }}
            className={`p-3 rounded-lg border text-left bg-zinc-900/60 hover:bg-zinc-800 transition-all cursor-pointer ${
              viewMode === "os" ? `${themeConfig.border} text-white` : "border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">NexOS Desktop</span>
              {viewMode === "os" && <Sparkles size={12} className={themeConfig.text} />}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Multi-window desktop interface with folders & dock.</p>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode("classic");
            }}
            className={`p-3 rounded-lg border text-left bg-zinc-900/60 hover:bg-zinc-800 transition-all cursor-pointer ${
              viewMode === "classic" ? `${themeConfig.border} text-white` : "border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Classic Scroll</span>
              {viewMode === "classic" && <Check size={12} className={themeConfig.text} />}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Traditional single-page web portfolio view.</p>
          </button>
        </div>
      </div>

      {/* Mouse Pointer Settings */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MousePointer size={16} className={themeConfig.text} />
          <div>
            <span className="text-xs font-bold text-white">Cyber Mouse Cursor</span>
            <p className="text-[10px] text-zinc-500">Hardware-accelerated custom pointer effect</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleCustomCursor();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
            customCursorEnabled
              ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
              : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
        >
          {customCursorEnabled ? "CUSTOM (0ms)" : "DEFAULT"}
        </button>
      </div>

      {/* Sound Settings */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {soundEnabled ? <Volume2 size={16} className={themeConfig.text} /> : <VolumeX size={16} className="text-zinc-500" />}
          <div>
            <span className="text-xs font-bold text-white">System Audio</span>
            <p className="text-[10px] text-zinc-500">Interactive click & window audio feedback</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
            soundEnabled
              ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
              : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
        >
          {soundEnabled ? "ENABLED" : "MUTED"}
        </button>
      </div>

      {/* Reset Workspace */}
      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white">Reset Workspace</span>
          <p className="text-[10px] text-zinc-500">Restore window positions & desktop state</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            resetDesktop();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Reset OS</span>
        </button>
      </div>
    </div>
  );
}
