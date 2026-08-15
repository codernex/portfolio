"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Minus,
  Square,
  Copy,
  Check,
  Search,
  Grid,
  List,
  User,
  Folder,
  Briefcase,
  Cpu,
  BookOpen,
  Mail,
  Terminal,
  Settings,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useOSStore, OSWindowData } from "@/lib/os-store";
import OSFolderView from "./OSFolderView";
import OSTerminal from "./OSTerminal";
import OSSettingsView from "./OSSettingsView";
import OSDetailView from "./OSDetailView";
import AboutSection from "@/app/(public_pages)/_components/AboutSection";
import ContactSection from "@/app/(public_pages)/_components/ContactSection";

interface OSWindowProps {
  windowData: OSWindowData;
}

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

export default function OSWindow({ windowData }: OSWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPos,
    setWindowViewMode,
    setWindowSearchQuery,
    navigateWindowBack,
    navigateWindowForward,
    activeWindowId,
  } = useOSStore();

  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });

  const dragStartRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const IconComponent = ICON_MAP[windowData.iconName] || Folder;
  const isActive = activeWindowId === windowData.id;
  const canGoBack = (windowData.historyIndex ?? 0) > 0;
  const canGoForward =
    (windowData.historyIndex ?? 0) < (windowData.history?.length ?? 1) - 1;

  if (!windowData.isOpen || windowData.isMinimized) return null;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(windowData.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // macOS Native Pointer Drag Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (windowData.isMaximized) return;
    // Don't drag if clicking buttons or input elements inside title bar
    if ((e.target as HTMLElement).closest("button")) return;

    focusWindow(windowData.id);
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      winX: windowData.position.x,
      winY: windowData.position.y,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || windowData.isMaximized) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    const nextX = Math.max(0, Math.min(viewport.w - 200, dragStartRef.current.winX + dx));
    const nextY = Math.max(0, Math.min(viewport.h - 80, dragStartRef.current.winY + dy));

    updateWindowPos(windowData.id, { x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const winX = windowData.isMaximized ? 0 : windowData.position.x;
  const winY = windowData.isMaximized ? 0 : windowData.position.y;
  const winW = windowData.isMaximized ? "100%" : Math.min(windowData.size.width, viewport.w - 20);
  const winH = windowData.isMaximized ? "calc(100vh - 48px)" : Math.min(windowData.size.height, viewport.h - 70);

  return (
    <div
      onClick={() => focusWindow(windowData.id)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate3d(${winX}px, ${winY}px, 0)`,
        width: winW,
        height: winH,
        zIndex: isDragging ? 9999 : windowData.zIndex,
      }}
      className={`flex flex-col rounded-xl overflow-hidden border font-mono select-none ${
        isDragging
          ? "border-emerald-400 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.9)] opacity-95"
          : isActive
          ? "border-emerald-500/60 bg-zinc-950/95 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-md"
          : "border-zinc-800 bg-zinc-950/90 shadow-xl opacity-95 backdrop-blur-sm"
      }`}
    >
      {/* macOS Window Title Bar (Native Pointer Capture Drag Handle) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`flex items-center justify-between px-4 py-2.5 border-b touch-none cursor-grab active:cursor-grabbing ${
          isActive ? "bg-zinc-900/90 border-zinc-800" : "bg-zinc-950 border-zinc-900"
        }`}
      >
        {/* Left Window Control Buttons (macOS Traffic Light Buttons) */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(windowData.id);
            }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 hover:bg-red-600 group"
            title="Close"
          >
            <X size={8} className="opacity-0 group-hover:opacity-100 text-black font-bold" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(windowData.id);
            }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 group"
            title="Minimize"
          >
            <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black font-bold" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(windowData.id);
            }}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 group"
            title="Maximize"
          >
            <Square size={6} className="opacity-0 group-hover:opacity-100 text-black font-bold" />
          </button>
        </div>

        {/* Center Title & Icon */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 truncate px-2 pointer-events-none">
          <IconComponent size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate">{windowData.title}</span>
        </div>

        {/* Right Action Toggle */}
        <div className="flex items-center gap-1.5 text-zinc-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(windowData.id);
            }}
            className="p-1 hover:text-white rounded"
          >
            {windowData.isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* Folder Address Bar & Toolbar */}
      {windowData.id !== "terminal" && (
        <div
          className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/50 text-xs shrink-0 ${
            isDragging ? "pointer-events-none" : ""
          }`}
        >
          {/* History Navigation & Path Breadcrumbs */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="flex items-center gap-1 text-zinc-400">
              <button
                disabled={!canGoBack}
                onClick={() => navigateWindowBack(windowData.id)}
                className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                  canGoBack
                    ? "text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    : "text-zinc-600 cursor-not-allowed opacity-40"
                }`}
                title="Back"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                disabled={!canGoForward}
                onClick={() => navigateWindowForward(windowData.id)}
                className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                  canGoForward
                    ? "text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    : "text-zinc-600 cursor-not-allowed opacity-40"
                }`}
                title="Forward"
              >
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Address bar input */}
            <div className="flex items-center gap-2 flex-1 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-300 font-mono text-[11px] overflow-hidden">
              <span className="text-emerald-500">$</span>
              <span className="truncate flex-1">{windowData.path}</span>
              <button
                onClick={handleCopyPath}
                className="text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                title="Copy Path"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {/* Folder Search & View Mode Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-400 text-[11px]">
              <Search size={12} className="text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                value={windowData.searchQuery}
                onChange={(e) => setWindowSearchQuery(windowData.id, e.target.value)}
                className="bg-transparent border-none outline-none text-white w-20 sm:w-28 text-[11px]"
              />
            </div>

            <div className="flex items-center border border-zinc-800 rounded-md overflow-hidden bg-zinc-950">
              <button
                onClick={() => setWindowViewMode(windowData.id, "grid")}
                className={`p-1.5 transition-colors ${
                  windowData.viewMode === "grid" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500 hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid size={12} />
              </button>
              <button
                onClick={() => setWindowViewMode(windowData.id, "list")}
                className={`p-1.5 transition-colors ${
                  windowData.viewMode === "list" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500 hover:text-white"
                }`}
                title="List View"
              >
                <List size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Window Content Body */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950/80 ${
          isDragging ? "pointer-events-none select-none" : ""
        }`}
      >
        {windowData.id === "terminal" ? (
          <OSTerminal />
        ) : windowData.id === "settings" ? (
          <OSSettingsView />
        ) : windowData.id === "about" ? (
          <div className="p-4">
            <AboutSection />
          </div>
        ) : windowData.id === "contact" ? (
          <div className="p-4">
            <ContactSection />
          </div>
        ) : windowData.detailData ? (
          <OSDetailView
            type={windowData.id === "projects" ? "project" : "blog"}
            data={windowData.detailData}
          />
        ) : (
          <OSFolderView
            windowId={windowData.id}
            viewMode={windowData.viewMode}
            searchQuery={windowData.searchQuery}
          />
        )}
      </div>
    </div>
  );
}
