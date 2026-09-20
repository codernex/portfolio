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
  Tv,
  Layers,
  Grid,
  Clock,
  Volume1,
  Gamepad2,
  Trophy,
  ExternalLink,
  Keyboard,
} from "lucide-react";
import { toast } from "sonner";
import {
  useOSStore,
  OSTheme,
  OSWallpaper,
  WindowBlurMode,
  IconGridSize,
} from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import { playUiClick, playCrystalCollect } from "@/lib/audio";

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
    audioVolume,
    setAudioVolume,
    customCursorEnabled,
    toggleCustomCursor,
    crtScanlinesEnabled,
    toggleCrtScanlines,
    windowBlur,
    setWindowBlur,
    iconSize,
    setIconSize,
    clockFormat,
    setClockFormat,
    showSeconds,
    toggleShowSeconds,
    showWatermark,
    toggleShowWatermark,
    highScore,
    resetHighScore,
    openWindow,
    openShortcuts,
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

  const blurModes: { id: WindowBlurMode; name: string; desc: string }[] = [
    { id: "frosted", name: "Frosted Glass", desc: "Translucent backdrop blur & glass specular shine" },
    { id: "solid", name: "Solid Slate", desc: "Opaque dark zinc for high contrast & speed" },
    { id: "tinted", name: "Cyber Tinted", desc: "Subtle theme accent wash on window background" },
  ];

  const iconSizes: { id: IconGridSize; label: string; desc: string }[] = [
    { id: "compact", label: "Compact", desc: "Small 76px icons" },
    { id: "comfortable", label: "Normal", desc: "Balanced 96px icons" },
    { id: "large", label: "Large", desc: "Spacious 112px icons" },
  ];

  return (
    <div className="p-6 font-mono text-zinc-300 space-y-6 max-w-xl mx-auto pb-12">
      {/* Top Bar Banner */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Settings className={themeConfig.text} size={20} />
          <div>
            <h2 className="text-sm font-bold text-white">System Preferences</h2>
            <p className="text-[11px] text-zinc-500">NexOS Workstation v1.0.0 Configuration Hub</p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${themeConfig.bgSubtle} border ${themeConfig.borderSubtle} text-[10px] ${themeConfig.text} font-bold`}
        >
          <Database size={12} />
          <span>Synced Preferences</span>
        </div>
      </div>

      {/* 1. Theme Accent Color */}
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
                playUiClick();
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

      {/* 2. Desktop Wallpaper Engine */}
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
                playUiClick();
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

      {/* 3. CRT Scanline Shader Effect */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Tv size={16} className={themeConfig.text} />
          <div>
            <span className="text-xs font-bold text-white">CRT Retro Scanline Filter</span>
            <p className="text-[10px] text-zinc-500">80s phosphor CRT scanline overlay over desktop</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playUiClick();
            toggleCrtScanlines();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
            crtScanlinesEnabled
              ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
              : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
        >
          {crtScanlinesEnabled ? "ACTIVE [CRT]" : "OFF"}
        </button>
      </div>

      {/* 4. Window Glassmorphism & Opacity */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Layers size={14} className={themeConfig.text} />
          <span>Window Glassmorphism & Backdrop Style</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {blurModes.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playUiClick();
                setWindowBlur(b.id);
              }}
              className={`p-2.5 rounded-lg border text-left bg-zinc-900/60 hover:bg-zinc-800 transition-all cursor-pointer ${
                windowBlur === b.id ? `${themeConfig.border} text-white` : "border-zinc-800 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">{b.name}</span>
                {windowBlur === b.id && <Check size={12} className={themeConfig.text} />}
              </div>
              <p className="text-[9px] text-zinc-500 mt-1">{b.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Desktop Icon Grid Size */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Grid size={14} className={themeConfig.text} />
          <span>Desktop Icon Grid Density</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {iconSizes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playUiClick();
                setIconSize(s.id);
              }}
              className={`p-2.5 rounded-lg border text-center bg-zinc-900/60 hover:bg-zinc-800 transition-all cursor-pointer ${
                iconSize === s.id ? `${themeConfig.border} text-white` : "border-zinc-800 text-zinc-400"
              }`}
            >
              <span className="text-xs font-bold block">{s.label}</span>
              <span className="text-[9px] text-zinc-500">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Taskbar Clock Options */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Clock size={14} className={themeConfig.text} />
          <span>Taskbar Clock Configuration</span>
        </div>
        <div className="flex items-center justify-between gap-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
          <div>
            <span className="text-xs font-bold text-white">Display Format</span>
            <p className="text-[10px] text-zinc-500">Choose between 24-hour military or 12-hour AM/PM</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playUiClick();
                setClockFormat("24h");
              }}
              className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer font-bold ${
                clockFormat === "24h"
                  ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}
            >
              24H
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playUiClick();
                setClockFormat("12h");
              }}
              className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer font-bold ${
                clockFormat === "12h"
                  ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}
            >
              12H
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-bold text-white">Show Seconds Counter</span>
            <p className="text-[10px] text-zinc-500">Live ticking seconds in taskbar clock</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playUiClick();
              toggleShowSeconds();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              showSeconds
                ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
                : "bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            {showSeconds ? "VISIBLE (:SS)" : "HIDDEN"}
          </button>
        </div>
      </div>

      {/* 7. Sound Settings & Volume Slider */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? <Volume2 size={16} className={themeConfig.text} /> : <VolumeX size={16} className="text-zinc-500" />}
            <div>
              <span className="text-xs font-bold text-white">System & Game Audio</span>
              <p className="text-[10px] text-zinc-500">Synthesized Web Audio API feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playCrystalCollect();
              }}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold border border-zinc-700 cursor-pointer"
            >
              Test SFX
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playUiClick();
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
        </div>

        {soundEnabled && (
          <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800 flex items-center gap-4">
            <Volume1 size={16} className="text-zinc-400 shrink-0" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-zinc-400">Master Volume</span>
                <span className="text-white">{audioVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={audioVolume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAudioVolume(val);
                }}
                className="w-full accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 8. CyberRunner 3D Minigame Section */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Gamepad2 size={16} className={themeConfig.text} />
          <span>CyberRunner 3D Minigame</span>
        </div>

        <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${themeConfig.bgSubtle} ${themeConfig.text} border ${themeConfig.borderSubtle}`}>
              <Trophy size={20} />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Personal Record</span>
              <span className="text-base font-black text-white">{highScore.toLocaleString()} PTS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playUiClick();
                openWindow("game");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${themeConfig.bg} text-black ${themeConfig.shadow}`}
            >
              <ExternalLink size={12} />
              <span>Launch</span>
            </button>
            {highScore > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playUiClick();
                  resetHighScore();
                  toast.success("High score reset to 0.");
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Reset High Score"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 9. Mouse Pointer & Watermark Toggles */}
      <div className="pt-3 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MousePointer size={16} className={themeConfig.text} />
            <div>
              <span className="text-xs font-bold text-white">Cyber Mouse Cursor</span>
              <p className="text-[10px] text-zinc-500">Hardware-accelerated custom pointer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playUiClick();
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

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white">Desktop Watermark Banner</span>
            <p className="text-[10px] text-zinc-500">CODERNEX workstation watermark in top-right</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playUiClick();
              toggleShowWatermark();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              showWatermark
                ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
                : "bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            {showWatermark ? "VISIBLE" : "HIDDEN"}
          </button>
        </div>
      </div>

      {/* 10. Keyboard Instructions & Hotkeys */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Keyboard size={14} className={themeConfig.text} />
            <span>Keyboard Instructions & Cheatsheet</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Press ? or F1</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          NexOS supports full keyboard navigation, window switching, spotlight search, and game controls.
        </p>
        <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300">Ctrl+K</kbd>
            <span className="text-zinc-500">Search</span>
            <span className="text-zinc-600">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300">Alt+Tab</kbd>
            <span className="text-zinc-500">Cycle Windows</span>
            <span className="text-zinc-600">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300">?</kbd>
            <span className="text-zinc-500">All Keys</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playUiClick();
              openShortcuts();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle} hover:opacity-90`}
          >
            <Keyboard size={13} />
            <span>View All Hotkeys</span>
          </button>
        </div>
      </div>

      {/* 11. Display View Mode */}
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
              playUiClick();
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
              playUiClick();
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

      {/* 11. Reset Workspace */}
      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white">Reset Workspace</span>
          <p className="text-[10px] text-zinc-500">Restore window positions & desktop defaults</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playUiClick();
            resetDesktop();
            toast.info("Desktop reset to factory defaults.");
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
