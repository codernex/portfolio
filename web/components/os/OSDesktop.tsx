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
  ExternalLink,
  Copy,
  RotateCcw,
  Check,
  Gamepad2,
  Search,
  Keyboard,
  Globe,
} from "lucide-react";
import { useOSStore, DesktopIcon, OSWindowData } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import { playUiClick, playWindowOpen } from "@/lib/audio";
import OSWindow from "./OSWindow";
import OSTaskbar from "./OSTaskbar";
import OSSearchModal from "./OSSearchModal";
import OSKeyboardShortcutsModal from "./OSKeyboardShortcutsModal";

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
  Gamepad2,
  Globe,
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
    toggleStartMenu,
    closeStartMenu,
    isStartMenuOpen,
    crtScanlinesEnabled,
    iconSize,
    showWatermark,
    isSearchOpen,
    openSearch,
    closeSearch,
    isShortcutsOpen,
    openShortcuts,
    closeShortcuts,
    toggleShortcuts,
    focusNextWindow,
    closeActiveWindow,
    minimizeActiveWindow,
    maximizeActiveWindow,
  } = useOSStore();

  const themeConfig = getThemeConfig(theme);

  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    iconId?: string | null;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [dragSelection, setDragSelection] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Global Keyboard Shortcuts Mapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable);

      // 0. Windows / Super / Meta key standalone press & Ctrl+Escape to toggle Start Menu
      if (
        (e.key === "Meta" || e.key === "OS" || e.code === "MetaLeft" || e.code === "MetaRight") &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        toggleStartMenu();
        return;
      }
      if (e.ctrlKey && e.key === "Escape") {
        e.preventDefault();
        toggleStartMenu();
        return;
      }

      // 1. Global Search: Ctrl+K / Cmd+K or "/" (when not inside an input)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
        return;
      }
      if (!isInput && e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openSearch();
        return;
      }

      // 2. Keyboard Instructions Cheatsheet: "?" or "F1" or "Ctrl+/"
      if (!isInput && (e.key === "?" || e.key === "F1")) {
        e.preventDefault();
        toggleShortcuts();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        toggleShortcuts();
        return;
      }

      // 3. Alt+Tab Window Cycling (Alt+Tab next, Alt+Shift+Tab prev)
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        focusNextWindow(e.shiftKey);
        return;
      }

      // 4. Window Management (Alt+W / Alt+Q to close, Alt+M to minimize, Alt+Enter to maximize)
      if (e.altKey && (e.key.toLowerCase() === "w" || e.key.toLowerCase() === "q")) {
        e.preventDefault();
        closeActiveWindow();
        return;
      }
      if (e.altKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        minimizeActiveWindow();
        return;
      }
      if (e.altKey && e.key === "Enter") {
        e.preventDefault();
        maximizeActiveWindow();
        return;
      }

      // 5. Quick App Shortcuts: Ctrl+G (Game), Ctrl+, (Settings), Ctrl+` (Terminal), Ctrl+B (Browser)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        openWindow("game");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        openWindow("browser");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        openWindow("settings");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        openWindow("terminal");
        return;
      }

      // 6. Escape key hierarchy
      if (e.key === "Escape") {
        if (isSearchOpen) {
          closeSearch();
          return;
        }
        if (isShortcutsOpen) {
          closeShortcuts();
          return;
        }
        if (contextMenu) {
          setContextMenu(null);
          return;
        }
        if (isStartMenuOpen) {
          closeStartMenu();
          return;
        }
        closeActiveWindow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isSearchOpen,
    openSearch,
    closeSearch,
    isShortcutsOpen,
    closeShortcuts,
    toggleShortcuts,
    focusNextWindow,
    closeActiveWindow,
    minimizeActiveWindow,
    maximizeActiveWindow,
    openWindow,
    contextMenu,
    isStartMenuOpen,
    closeStartMenu,
    toggleStartMenu,
  ]);

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

  const openClampedContextMenu = (
    e: React.MouseEvent,
    iconId: string | null = null
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 230;
    const menuHeight = 340;
    const clampedX =
      e.clientX + menuWidth > window.innerWidth
        ? Math.max(10, e.clientX - menuWidth)
        : e.clientX;
    const clampedY =
      e.clientY + menuHeight > window.innerHeight
        ? Math.max(10, e.clientY - menuHeight)
        : e.clientY;

    setContextMenu({ x: clampedX, y: clampedY, iconId });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    openClampedContextMenu(e, null);
  };

  const closeContextMenu = () => {
    if (contextMenu) setContextMenu(null);
  };

  // Desktop Pointer Down Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(".os-context-menu")) {
      return;
    }

    closeContextMenu();
    if (e.button !== 0) return;

    if (
      target.closest(".os-desktop-icon") ||
      target.closest(".os-window") ||
      target.closest(".os-taskbar") ||
      target.closest(".os-startmenu")
    ) {
      return;
    }

    setSelectedIconId(null);
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

      {/* CRT Retro Scanline Shader Effect */}
      {crtScanlinesEnabled && (
        <div
          className="fixed inset-0 z-[35] pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05))",
            backgroundSize: "100% 3px, 6px 100%",
          }}
        />
      )}

      {/* Dynamic Theme Ambient Glow Overlay */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${themeConfig.glow} pointer-events-none`}
      />

      {/* Desktop Watermark Banner Overlay */}
      {showWatermark && (
        <div className="absolute top-20 right-8 z-0 hidden lg:flex flex-col items-end pointer-events-none opacity-25">
          <h1 className="text-6xl font-black tracking-tighter text-white">
            CODER<span className={themeConfig.text}>NEX</span>
          </h1>
          <p className={`text-xs font-mono mt-1 ${themeConfig.text}`}>
            NexOS Workstation v1.0.0 — [{theme.toUpperCase()}_THEME_ACTIVE]
          </p>
        </div>
      )}

      {/* Rubberband Selection Marquee Rectangle */}
      {dragSelection &&
        Math.hypot(
          dragSelection.currentX - dragSelection.startX,
          dragSelection.currentY - dragSelection.startY
        ) > 6 && (
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
      <div className="relative z-10 p-6 sm:p-10 pt-20 sm:pt-24 grid grid-flow-col grid-rows-4 sm:grid-rows-6 gap-5 sm:gap-7 w-fit max-h-[calc(100vh-80px)]">
        {desktopIcons.map((icon: DesktopIcon) => {
          const IconComponent = ICON_MAP[icon.iconName] || Folder;
          const isSelected = selectedIconId === icon.id;

          const sizeConfig =
            iconSize === "compact"
              ? { card: "w-20 p-1.5", box: "h-10 w-10", size: 20, text: "text-[10px]" }
              : iconSize === "large"
              ? { card: "w-28 p-2.5", box: "h-14 w-14", size: 28, text: "text-xs" }
              : { card: "w-24 p-2", box: "h-12 w-12", size: 24, text: "text-[11px]" };

          return (
            <div
              key={icon.id}
              onClick={(e) => {
                e.stopPropagation();
                playUiClick();
                setSelectedIconId(icon.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                playWindowOpen();
                openWindow(icon.id);
              }}
              onContextMenu={(e) => {
                setSelectedIconId(icon.id);
                openClampedContextMenu(e, icon.id);
              }}
              className={`os-desktop-icon group flex ${sizeConfig.card} flex-col items-center gap-1.5 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? `${themeConfig.bgSubtle} border ${themeConfig.border} ${themeConfig.shadow}`
                  : "hover:bg-zinc-900/60 hover:border hover:border-zinc-800"
              }`}
            >
              <div
                className={`relative flex ${sizeConfig.box} items-center justify-center rounded-xl bg-zinc-900/90 border border-zinc-800/80 ${themeConfig.text} group-hover:${themeConfig.border} transition-colors duration-150 shadow-md`}
              >
                <IconComponent size={sizeConfig.size} />
                {icon.badge && (
                  <span
                    className={`absolute -top-1 -right-1 font-mono text-[9px] font-bold text-black ${themeConfig.bg} px-1 rounded-full`}
                  >
                    {icon.badge}
                  </span>
                )}
              </div>

              <span className={`text-center font-mono ${sizeConfig.text} font-medium text-zinc-300 group-hover:text-white drop-shadow truncate w-full`}>
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
          className="os-context-menu fixed z-[999] w-56 rounded-xl border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-md text-xs font-mono text-zinc-300 animate-in fade-in zoom-in-95 duration-100"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.iconId ? (
            /* Icon-Specific Context Menu */
            <>
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-800/80 mb-1 flex items-center justify-between">
                <span>{desktopIcons.find((i) => i.id === contextMenu.iconId)?.title || "File Item"}</span>
                <span className="text-emerald-400">SELECTED</span>
              </div>

              <button
                onClick={() => {
                  closeContextMenu();
                  openWindow(contextMenu.iconId!);
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer font-bold text-white`}
              >
                <Folder size={14} className={themeConfig.text} />
                <span>Open {desktopIcons.find((i) => i.id === contextMenu.iconId)?.title}</span>
              </button>

              {contextMenu.iconId === "resume" && (
                <>
                  <button
                    onClick={() => {
                      closeContextMenu();
                      const link = document.createElement("a");
                      link.href =
                        "https://docs.google.com/document/d/1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U/export?format=pdf";
                      link.download = "Borhan_Uddin_Resume.pdf";
                      link.target = "_blank";
                      link.click();
                    }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
                  >
                    <FileDown size={14} className={themeConfig.text} />
                    <span>Download PDF Document</span>
                  </button>

                  <a
                    href="https://docs.google.com/document/d/1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U/edit"
                    target="_blank"
                    rel="noreferrer"
                    onClick={closeContextMenu}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
                  >
                    <ExternalLink size={14} className={themeConfig.text} />
                    <span>Open Google Docs Live</span>
                  </a>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/resume.pdf`);
                      setCopiedLink(true);
                      setTimeout(() => {
                        setCopiedLink(false);
                        closeContextMenu();
                      }, 1200);
                    }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
                  >
                    {copiedLink ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} className={themeConfig.text} />
                    )}
                    <span>{copiedLink ? "Link Copied!" : "Copy Resume Link"}</span>
                  </button>
                </>
              )}

              <div className="my-1 border-t border-zinc-800" />

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
            </>
          ) : (
            /* General Desktop Canvas Context Menu */
            <>
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
                  openWindow("resume");
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
              >
                <FileText size={14} className={themeConfig.text} />
                <span>View Resume &amp; CV Window</span>
              </button>

              <button
                onClick={() => {
                  closeContextMenu();
                  const link = document.createElement("a");
                  link.href =
                    "https://docs.google.com/document/d/1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U/export?format=pdf";
                  link.download = "Borhan_Uddin_Resume.pdf";
                  link.target = "_blank";
                  link.click();
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
              >
                <FileDown size={14} className={themeConfig.text} />
                <span>Download PDF Export</span>
              </button>

              <button
                onClick={() => {
                  closeContextMenu();
                  openWindow("game");
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
              >
                <Gamepad2 size={14} className={themeConfig.text} />
                <span>Play CyberRunner 3D</span>
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

              <button
                onClick={() => {
                  closeContextMenu();
                  openSearch();
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
              >
                <Search size={14} className={themeConfig.text} />
                <span>Spotlight Search (Ctrl+K)</span>
              </button>

              <button
                onClick={() => {
                  closeContextMenu();
                  openShortcuts();
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
              >
                <Keyboard size={14} className={themeConfig.text} />
                <span>Keyboard Shortcuts (?)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedIconId(null);
                  closeContextMenu();
                }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-zinc-900 ${themeConfig.textHover} transition-colors text-left cursor-pointer`}
              >
                <RotateCcw size={14} className={themeConfig.text} />
                <span>Refresh Desktop</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Global Spotlight Search Modal */}
      <OSSearchModal />

      {/* Keyboard Instructions Modal */}
      <OSKeyboardShortcutsModal />

      {/* Taskbar Dock */}
      <OSTaskbar />
    </div>
  );
}
