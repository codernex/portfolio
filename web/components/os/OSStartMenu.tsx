"use client";

import React, { useState } from "react";
import {
  User,
  Folder,
  Briefcase,
  Cpu,
  BookOpen,
  Mail,
  Terminal as TerminalIcon,
  Settings,
  Download,
  Github,
  Linkedin,
  Globe,
  RotateCcw,
  Sparkles,
  FileText,
  Gamepad2,
  Search,
  Keyboard,
  ShieldCheck,
} from "lucide-react";
import { useOSStore } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import { playUiClick } from "@/lib/audio";

export default function OSStartMenu() {
  const {
    theme,
    openWindow,
    closeStartMenu,
    isStartMenuOpen,
    toggleViewMode,
    closeAllWindows,
    openSearch,
    openShortcuts,
  } = useOSStore();

  const themeConfig = getThemeConfig(theme);
  const [filterQuery, setFilterQuery] = useState("");

  if (!isStartMenuOpen) return null;

  const quickLinks = [
    { id: "browser", title: "Web Browser", icon: Globe, desc: "Portals & web explorer" },
    { id: "about", title: "About System", icon: User, desc: "Architect specifications" },
    { id: "projects", title: "Projects Explorer", icon: Folder, desc: "Browse software works" },
    { id: "experience", title: "Career Logs", icon: Briefcase, desc: "Work timeline & roles" },
    { id: "skills", title: "Tech Stack", icon: Cpu, desc: "Skills & frameworks" },
    { id: "blog", title: "Publications", icon: BookOpen, desc: "Technical articles" },
    { id: "game", title: "CyberRunner 3D", icon: Gamepad2, desc: "3D Flight simulation" },
    { id: "resume", title: "Resume & CV", icon: FileText, desc: "Curriculum Vitae reader" },
    { id: "contact", title: "Contact Mailer", icon: Mail, desc: "Send direct message" },
    { id: "terminal", title: "Interactive Shell", icon: TerminalIcon, desc: "CLI terminal interface" },
    { id: "settings", title: "Preferences", icon: Settings, desc: "Appearance & settings" },
  ];

  const filteredLinks = quickLinks.filter(
    (item) =>
      item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleLaunch = (id: string) => {
    playUiClick();
    openWindow(id);
    closeStartMenu();
  };

  return (
    <>
      {/* Backdrop overlay to close on outside click */}
      <div
        className="fixed inset-0 z-[49] bg-transparent"
        onClick={closeStartMenu}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-14 left-4 z-[50] w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl font-mono text-zinc-300 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none"
      >
        {/* User Info Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${themeConfig.bgSubtle} border ${themeConfig.borderSubtle} ${themeConfig.text} font-bold text-lg ${themeConfig.shadow}`}
            >
              BU
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm">Borhan Uddin</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className={`text-[11px] font-semibold ${themeConfig.text}`}>Software Engineer II</span>
              <span className="text-[10px] text-zinc-500">NexOS v2.4 • Khulna, BD</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                closeStartMenu();
                playUiClick();
                openSearch();
              }}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title="Spotlight Search (Ctrl+K)"
            >
              <Search size={14} />
            </button>
            <button
              onClick={() => {
                closeStartMenu();
                playUiClick();
                openShortcuts();
              }}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard size={14} />
            </button>
          </div>
        </div>

        {/* Quick Search Filter */}
        <div className="pt-3 pb-1">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 focus-within:border-zinc-700 text-xs">
            <Search size={13} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search apps or type to filter..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredLinks.length > 0) {
                  handleLaunch(filteredLinks[0].id);
                }
              }}
              className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-zinc-600 font-mono"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="text-[10px] text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Launch Applications Grid */}
        <div className="py-2.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500 mb-2 px-1">
            <span>System Applications</span>
            <span className="text-[9px] text-zinc-600 font-mono">{filteredLinks.length} AVAILABLE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-0.5">
            {filteredLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLaunch(item.id)}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-800/80 border border-zinc-800/50 hover:border-zinc-700 transition-all text-left group cursor-pointer"
                >
                  <div
                    className={`p-1.5 rounded-md bg-zinc-800/60 ${themeConfig.text} group-hover:bg-zinc-800 transition-colors shrink-0`}
                  >
                    <Icon size={15} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                      {item.title}
                    </span>
                    <span className="text-[9px] text-zinc-500 truncate">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Links & Actions */}
        <div className="pt-2.5 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <a
              href="/resume.pdf"
              target="_blank"
              download
              className={`flex items-center gap-1.5 text-zinc-400 ${themeConfig.textHover} transition-colors p-1 rounded hover:bg-zinc-900/60 text-[11px]`}
            >
              <Download size={13} className={themeConfig.text} />
              <span>Download CV</span>
            </a>
            <button
              onClick={() => {
                playUiClick();
                closeAllWindows();
                closeStartMenu();
              }}
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-900/60 text-[11px] cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Close All Windows</span>
            </button>
          </div>

          {/* External Social Bar */}
          <div className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60 text-xs">
            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com/codernex"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors p-1 rounded hover:bg-zinc-800"
                title="GitHub"
              >
                <Github size={15} />
              </a>
              <a
                href="https://linkedin.com/in/codernex"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-zinc-800"
                title="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="https://www.upwork.com/freelancers/codernex?s=1110580755107926016"
                target="_blank"
                rel="noreferrer"
                className={`text-zinc-400 ${themeConfig.textHover} transition-colors p-1 rounded hover:bg-zinc-800`}
                title="Upwork"
              >
                <Globe size={15} />
              </a>
            </div>

            <button
              onClick={() => {
                playUiClick();
                toggleViewMode();
                closeStartMenu();
              }}
              className={`flex items-center gap-1 text-[10px] ${themeConfig.text} ${themeConfig.bgSubtle} px-2.5 py-1 rounded-md border ${themeConfig.borderSubtle} cursor-pointer hover:opacity-90 transition-opacity`}
            >
              <Sparkles size={10} />
              <span>Classic View</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
