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
  Layout,
  Layers,
  FileText,
  FileDown,
  Download,
} from "lucide-react";
import { useOSStore, DesktopIcon, OSWindowData } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
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
  FileText,
  FileDown,
  Download,
};

export default function OSDesktop() {
  const {
    theme,
    wallpaper,
    desktopIcons,
    openWindow,
    windows,
    toggleViewMode,
    focusWindow,
    activeWindowId,
    closeStartMenu,
  } = useOSStore();

  const themeConfig = getThemeConfig(theme);

  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [dragSelection, setDragSelection] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Global Keyboard Shortcuts (Alt+Tab window cycle, Escape close menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        const openWins = Object.values(windows).filter(
          (w) => w.isOpen && !w.isMinimized
        );
        if (openWins.length > 1) {
          const currentIndex = openWins.findIndex((w) => w.id === activeWindowId);
          const nextIndex = (currentIndex + 1) % openWins.length;
          focusWindow(openWins[nextIndex].id);
        }
      }
      if (e.key === "Escape") {
        setContextMenu(null);
        closeStartMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [windows, activeWindowId, focusWindow, closeStartMenu]);

  // Global Pointer Listeners for Marquee Selection Box
  useEffect(() => {
    if (!dragSelection) return;

    const onPointerMove = (e: PointerEvent) => {
      setDragSelection((prev) =>
        prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null
      );
    };

    const onPointerUp = () => {
      setDragSelection(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragSelection]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    if (contextMenu) setContextMenu(null);
  };

  // Desktop Pointer Down Handler (No pointer capture to prevent click stealing)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest(".os-desktop-icon") ||
      target.closest(".os-window") ||
      target.closest(".os-taskbar") ||
      target.closest(".os-startmenu")
    ) {
      return;
    }

    setSelectedIconId(null);
    closeContextMenu();
    closeStartMenu();

    setDragSelection({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onContextMenu={handleContextMenu}
      className="relative h-screen w-full max-w-full overflow-hidden bg-zinc-950 font-mono select-none"
    >
      {/* Background Wallpaper Engine */}
      {wallpaper === "grid" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(128,128,128,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {wallpaper === "matrix" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(16, 185, 129, 0.4) 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      {wallpaper === "blueprint" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59, 130, 246, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.35) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      )}

      {wallpaper === "gradient" && (
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.35),rgba(0,0,0,0))]" />
      )}

      {/* Dynamic Theme Ambient Glow Overlay */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${themeConfig.glow} pointer-events-none`}
      />

      {/* Desktop Watermark Banner Overlay */}
      <div className="absolute top-20 right-8 z-0 hidden lg:flex flex-col items-end pointer-events-none opacity-25">
        <h1 className="text-6xl font-black tracking-tighter text-white">
          CODER<span className={themeConfig.text}>NEX</span>
        </h1>
        <p className={`text-xs font-mono mt-1 ${themeConfig.text}`}>
          NexOS Workstation v1.0.0 — [{theme.toUpperCase()}_THEME_ACTIVE]
        </p>
      </div>

      {/* Rubberband Selection Marquee Rectangle */}
      {dragSelection && (
        <div
          className={`fixed z-20 pointer-events-none border ${themeConfig.border} ${themeConfig.bgSubtle} rounded`}
          style={{
            left: Math.min(dragSelection.startX, dragSelection.currentX),
            top: Math.min(dragSelection.startY, dragSelection.currentY),
            width: Math.abs(dragSelection.currentX - dragSelection.startX),
            height: Math.abs(dragSelection.currentY - dragSelection.startY),
          }}
        />
      )}

      {/* Desktop Icons Grid */}
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
                if (icon.id === "resume") {
                  const link = document.createElement("a");
                  link.href = "https://docs.google.com/document/d/1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U/export?format=pdf";
                  link.download = "Borhan_Uddin_Resume.pdf";
                  link.target = "_blank";
                  link.click();
                }
                openWindow(icon.id);
              }}
              className={`os-desktop-icon group flex w-24 flex-col items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? `${themeConfig.bgSubtle} border ${themeConfig.border} ${themeConfig.shadow}`
                  : "hover:bg-zinc-900/60 hover:border hover:border-zinc-800"
              }`}
            >
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900/90 border border-zinc-800/80 ${themeConfig.text} group-hover:${themeConfig.border} transition-colors duration-150 shadow-md`}
              >
                <IconComponent size={24} />
                {icon.badge && (
                  <span
                    className={`absolute -top-1 -right-1 font-mono text-[9px] font-bold text-black ${themeConfig.bg} px-1 rounded-full`}
                  >
                    {icon.badge}
                  </span>
                )}
              </div>

              <span className="text-center font-mono text-[11px] font-medium text-zinc-300 group-hover:text-white drop-shadow truncate w-full">
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
          className="fixed z-[999] w-52 rounded-xl border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-md text-xs font-mono text-zinc-300 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              closeContextMenu();
              openWindow("terminal");
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
          >
            <Terminal size={14} className={themeConfig.text} />
            <span>Open Terminal CLI</span>
          </button>

          <button
            onClick={() => {
              closeContextMenu();
              openWindow("projects");
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
          >
            <Folder size={14} className={themeConfig.text} />
            <span>Projects Explorer</span>
          </button>

          <button
            onClick={() => {
              closeContextMenu();
              openWindow("settings");
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
          >
            <Settings size={14} className={themeConfig.text} />
            <span>System Preferences</span>
          </button>

          <button
            onClick={() => {
              closeContextMenu();
              openWindow("resume");
              const link = document.createElement("a");
              link.href = "https://docs.google.com/document/d/1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U/export?format=pdf";
              link.download = "Borhan_Uddin_Resume.pdf";
              link.target = "_blank";
              link.click();
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
          >
            <FileDown size={14} className={themeConfig.text} />
            <span>Download Resume (PDF)</span>
          </button>

          <div className="my-1 border-t border-zinc-800" />

          <button
            onClick={() => {
              closeContextMenu();
              toggleViewMode();
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
          >
            <Layout size={14} className={themeConfig.text} />
            <span>Toggle Classic Scroll</span>
          </button>
        </div>
      )}

      {/* Taskbar Dock */}
      <OSTaskbar />
    </div>
  );
}
