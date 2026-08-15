"use client";

import React from "react";
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
} from "lucide-react";
import { useOSStore } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";

export default function OSStartMenu() {
  const { theme, openWindow, closeStartMenu, isStartMenuOpen, toggleViewMode, closeAllWindows } = useOSStore();

  const themeConfig = getThemeConfig(theme);

  if (!isStartMenuOpen) return null;

  const quickLinks = [
    { id: "about", title: "About Me", icon: User, desc: "System specs & profile" },
    { id: "projects", title: "Projects Explorer", icon: Folder, desc: "Browse software works" },
    { id: "experience", title: "Career Logs", icon: Briefcase, desc: "Work timeline" },
    { id: "skills", title: "Tech Stack", icon: Cpu, desc: "Skills & frameworks" },
    { id: "blog", title: "Publications", icon: BookOpen, desc: "Technical blogs" },
    { id: "contact", title: "Contact Mailer", icon: Mail, desc: "Send direct message" },
    { id: "terminal", title: "Interactive Shell", icon: TerminalIcon, desc: "CLI terminal interface" },
    { id: "settings", title: "Preferences", icon: Settings, desc: "Customize appearance" },
  ];

  return (
    <>
      {/* Backdrop overlay to close on outside click */}
      <div
        className="fixed inset-0 z-[49] bg-transparent"
        onClick={closeStartMenu}
      />

      <div className="fixed bottom-14 left-4 z-[50] w-80 sm:w-96 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl font-mono text-zinc-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* User Info Header */}
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${themeConfig.bgSubtle} border ${themeConfig.borderSubtle} ${themeConfig.text} font-bold text-lg ${themeConfig.shadow}`}>
            BU
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">Borhan Uddin</span>
            <span className={`text-[11px] ${themeConfig.text}`}>Software Engineer II</span>
            <span className="text-[10px] text-zinc-500">Khulna, Bangladesh</span>
          </div>
        </div>

        {/* Quick Launch Applications Grid */}
        <div className="py-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 px-1">
            System Applications
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    openWindow(item.id);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-800/80 border border-zinc-800/50 hover:border-zinc-700 transition-all text-left group cursor-pointer"
                >
                  <div className={`p-1.5 rounded bg-zinc-800/50 ${themeConfig.text} group-hover:bg-zinc-800 transition-colors`}>
                    <Icon size={16} />
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

        {/* Quick Links & External Channels */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <a
              href="/resume.pdf"
              target="_blank"
              download
              className={`flex items-center gap-2 text-zinc-400 ${themeConfig.textHover} transition-colors p-1.5 rounded hover:bg-zinc-900/60`}
            >
              <Download size={14} className={themeConfig.text} />
              <span>Download CV</span>
            </a>
            <button
              onClick={() => {
                closeAllWindows();
                closeStartMenu();
              }}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 p-1.5 rounded hover:bg-zinc-900/60 text-[11px] cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Close All</span>
            </button>
          </div>

          {/* External Social Bar */}
          <div className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60 text-xs">
            <div className="flex items-center gap-3">
              <a
                href="http://github.com/codernex"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com/codernex"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-blue-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.upwork.com/freelancers/codernex?s=1110580755107926016"
                target="_blank"
                rel="noreferrer"
                className={`text-zinc-400 ${themeConfig.textHover} transition-colors`}
                title="Upwork"
              >
                <Globe size={16} />
              </a>
            </div>

            <button
              onClick={() => {
                toggleViewMode();
                closeStartMenu();
              }}
              className={`flex items-center gap-1 text-[10px] ${themeConfig.text} ${themeConfig.bgSubtle} px-2 py-1 rounded border ${themeConfig.borderSubtle} cursor-pointer`}
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
