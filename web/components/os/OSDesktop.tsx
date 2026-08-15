"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Folder,
  Briefcase,
  Cpu,
  BookOpen,
  Mail,
  Terminal,
  Settings,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";
import { useOSStore, DesktopIcon, OSWindowData } from "@/lib/os-store";
import OSWindow from "./OSWindow";
import OSTaskbar from "./OSTaskbar";

const ICON_MAP: Record<string, React.ElementType> = {
  User,
  Folder,
  Briefcase,
  Cpu,
  BookOpen,
  Mail,
  Terminal,
  Settings,
};

export default function OSDesktop() {
  const { desktopIcons, openWindow, windows, toggleViewMode, theme } = useOSStore();
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    if (contextMenu) setContextMenu(null);
  };

  // Accent glow styling based on store theme
  const glowClasses: Record<string, string> = {
    emerald: "from-emerald-500/10 via-transparent to-zinc-950 border-emerald-500/20",
    cyan: "from-cyan-500/10 via-transparent to-zinc-950 border-cyan-500/20",
    amber: "from-amber-500/10 via-transparent to-zinc-950 border-amber-500/20",
    purple: "from-purple-500/10 via-transparent to-zinc-950 border-purple-500/20",
  };

  return (
    <div
      onClick={closeContextMenu}
      onContextMenu={handleContextMenu}
      className="relative h-screen w-full max-w-full overflow-hidden bg-zinc-950 font-mono select-none"
    >
      {/* Background Cyber Grid Wallpaper & Ambient Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${
          glowClasses[theme] || glowClasses.emerald
        } pointer-events-none`}
      />

      {/* Desktop Banner / Logo Overlay */}
      <div className="absolute top-20 right-8 z-0 hidden lg:flex flex-col items-end pointer-events-none opacity-20">
        <h1 className="text-6xl font-black tracking-tighter text-white">
          CODER<span className="text-emerald-500">NEX</span>
        </h1>
        <p className="text-xs text-emerald-400 font-mono mt-1">NexOS Workstation v1.0.0</p>
      </div>

      {/* Desktop Workspace Icons Grid */}
      <div className="relative z-10 p-6 sm:p-10 pt-20 sm:pt-24 grid grid-flow-col grid-rows-4 sm:grid-rows-6 gap-6 sm:gap-8 w-fit max-h-[calc(100vh-80px)]">
        {desktopIcons.map((icon: DesktopIcon) => {
          const IconComponent = ICON_MAP[icon.iconName] || Folder;
          const isSelected = selectedIconId === icon.id;

          return (
            <div
              key={icon.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIconId(icon.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                openWindow(icon.id);
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl w-24 sm:w-28 cursor-pointer transition-all group ${
                isSelected
                  ? "bg-zinc-800/80 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800"
              }`}
            >
              <div className="relative mb-2 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-105 transition-transform shadow-lg">
                <IconComponent size={28} />
                {icon.badge && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-emerald-500 text-black px-1.5 py-0.2 rounded-full border border-black">
                    {icon.badge}
                  </span>
                )}
              </div>
              <span className="text-xs text-center text-zinc-300 font-medium group-hover:text-white drop-shadow truncate w-full">
                {icon.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Windows Stack */}
      {Object.values(windows).map((winData: OSWindowData) => (
        <OSWindow key={winData.id} windowData={winData} />
      ))}

      {/* Desktop Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[999] w-48 rounded-lg border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-md text-xs font-mono text-zinc-300 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              openWindow("terminal");
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded hover:bg-zinc-900 hover:text-emerald-400 transition-colors text-left"
          >
            <Terminal size={14} className="text-emerald-500" />
            <span>Open Terminal</span>
          </button>
          <button
            onClick={() => {
              openWindow("projects");
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded hover:bg-zinc-900 hover:text-emerald-400 transition-colors text-left"
          >
            <Folder size={14} className="text-emerald-500" />
            <span>Projects Explorer</span>
          </button>
          <button
            onClick={() => {
              openWindow("settings");
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded hover:bg-zinc-900 hover:text-emerald-400 transition-colors text-left"
          >
            <Settings size={14} className="text-emerald-500" />
            <span>System Settings</span>
          </button>

          <div className="my-1 border-t border-zinc-800" />

          <button
            onClick={() => {
              toggleViewMode();
              closeContextMenu();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded hover:bg-zinc-900 hover:text-cyan-400 transition-colors text-left"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span>Toggle Classic View</span>
          </button>
        </div>
      )}

      {/* Taskbar Dock */}
      <OSTaskbar />
    </div>
  );
}
