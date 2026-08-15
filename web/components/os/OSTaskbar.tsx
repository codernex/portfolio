"use client";

import React, { useState, useEffect } from "react";
import {
  Terminal,
  User,
  Folder,
  Briefcase,
  Cpu,
  BookOpen,
  Mail,
  Settings,
  Sparkles,
  Globe,
} from "lucide-react";
import { useOSStore, OSWindowData } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import OSStartMenu from "./OSStartMenu";

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

export default function OSTaskbar() {
  const {
    theme,
    windows,
    activeWindowId,
    focusWindow,
    minimizeWindow,
    toggleStartMenu,
    isStartMenuOpen,
    toggleViewMode,
  } = useOSStore();

  const themeConfig = getThemeConfig(theme);

  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindowsList = Object.values(windows).filter((w) => w.isOpen);

  return (
    <>
      <OSStartMenu />

      <footer className="fixed bottom-0 left-0 z-[100] flex h-12 w-full items-center justify-between border-t border-zinc-800/80 bg-zinc-950/90 px-3 sm:px-6 font-mono backdrop-blur-md select-none">
        {/* Left Section: Start Launcher & Quick Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleStartMenu}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
              isStartMenuOpen
                ? `${themeConfig.bg} text-black ${themeConfig.border} ${themeConfig.shadow}`
                : `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle} hover:bg-zinc-800`
            }`}
          >
            <Terminal size={14} strokeWidth={3} />
            <span className="hidden sm:inline">NexOS</span>
          </button>
        </div>

        {/* Center Dock: Open Window Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50vw] sm:max-w-[60vw] py-1 px-2 no-scrollbar">
          {openWindowsList.map((win: OSWindowData) => {
            const Icon = ICON_MAP[win.iconName] || Folder;
            const isActive = activeWindowId === win.id && !win.isMinimized;

            return (
              <button
                key={win.id}
                onClick={() => {
                  if (isActive) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? `bg-zinc-800 text-white ${themeConfig.borderSubtle} ${themeConfig.shadow}`
                    : win.isMinimized
                    ? "bg-zinc-950/60 text-zinc-500 border-zinc-900 opacity-60 hover:opacity-100"
                    : "bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                }`}
              >
                <Icon size={12} className={isActive ? themeConfig.text : "text-zinc-400"} />
                <span className="max-w-[100px] truncate hidden md:inline">{win.title}</span>
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? `${themeConfig.bg} ${themeConfig.shadow}` : "bg-zinc-600"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Section: System Tray & Clock */}
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <button
            onClick={toggleViewMode}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border ${themeConfig.borderSubtle} ${themeConfig.bgSubtle} ${themeConfig.text} hover:bg-zinc-800 text-[11px] transition-colors cursor-pointer`}
            title="Switch View Mode"
          >
            <Sparkles size={11} />
            <span className="hidden sm:inline">Classic View</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-zinc-500 border-l border-zinc-800 pl-3">
            <span className="flex items-center gap-1">
              <Cpu size={10} className={themeConfig.text} />
              <span>1.8%</span>
            </span>
            <span className="flex items-center gap-1">
              <Globe size={10} className={themeConfig.text} />
              <span>18ms</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-bold text-white text-xs border-l border-zinc-800 pl-3">
            <span className={`h-2 w-2 rounded-full ${themeConfig.bg} animate-pulse ${themeConfig.shadow}`} />
            <span>{timeStr || "16:50"}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
