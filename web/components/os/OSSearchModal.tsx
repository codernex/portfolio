"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  ArrowRight,
  CornerDownLeft,
  Folder,
  Terminal,
  Settings,
  Gamepad2,
  FileText,
  Mail,
  User,
  Cpu,
  BookOpen,
  Briefcase,
  Sparkles,
  Volume2,
  Tv,
  Palette,
  RotateCcw,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useOSStore, OSTheme } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import { playUiClick, playWindowOpen } from "@/lib/audio";

interface SearchItem {
  id: string;
  title: string;
  category: "Applications" | "Actions & Settings" | "External Links";
  description: string;
  icon: React.ElementType;
  keywords: string[];
  action: () => void;
  badge?: string;
}

export default function OSSearchModal() {
  const {
    theme,
    isSearchOpen,
    closeSearch,
    openWindow,
    setTheme,
    toggleCrtScanlines,
    toggleSound,
    toggleViewMode,
    resetDesktop,
  } = useOSStore();

  const themeConfig = getThemeConfig(theme);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Auto-focus on open
  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Search Items Registry
  const searchItems: SearchItem[] = useMemo(
    () => [
      // Applications
      {
        id: "browser",
        title: "NexNet Web Browser",
        category: "Applications",
        description: "Browse the web, live portfolio view & personal intranet",
        icon: Globe,
        keywords: ["browser", "web", "internet", "chrome", "edge", "safari", "surf", "url", "portal", "profile"],
        badge: "WEB",
        action: () => {
          openWindow("browser");
        },
      },
      {
        id: "game",
        title: "CyberRunner 3D",
        category: "Applications",
        description: "Launch 3D WebGL flight simulation minigame",
        icon: Gamepad2,
        keywords: ["game", "runner", "3d", "flight", "threejs", "arcade", "play", "cyberrunner"],
        badge: "3D GAME",
        action: () => {
          openWindow("game");
        },
      },
      {
        id: "terminal",
        title: "NexOS CLI Terminal",
        category: "Applications",
        description: "Interactive shell for system diagnostics & commands",
        icon: Terminal,
        keywords: ["terminal", "shell", "cli", "bash", "console", "command", "prompt"],
        badge: "CLI",
        action: () => {
          openWindow("terminal");
        },
      },
      {
        id: "projects",
        title: "Projects Explorer",
        category: "Applications",
        description: "Browse engineering portfolio projects & applications",
        icon: Folder,
        keywords: ["projects", "work", "apps", "code", "portfolio", "showcase"],
        badge: "FOLDER",
        action: () => {
          openWindow("projects");
        },
      },
      {
        id: "experience",
        title: "Career & Experience Logs",
        category: "Applications",
        description: "Professional work history, roles & achievements",
        icon: Briefcase,
        keywords: ["experience", "career", "jobs", "timeline", "resume", "employment"],
        action: () => {
          openWindow("experience");
        },
      },
      {
        id: "skills",
        title: "System Stack & Skills.spec",
        category: "Applications",
        description: "Technical competencies, frameworks & tools",
        icon: Cpu,
        keywords: ["skills", "tech", "stack", "frameworks", "tools", "backend", "fullstack", "languages"],
        action: () => {
          openWindow("skills");
        },
      },
      {
        id: "about",
        title: "About System & Architect",
        category: "Applications",
        description: "Engineer biography, background & technical philosophy",
        icon: User,
        keywords: ["about", "bio", "architect", "engineer", "profile", "borhan"],
        action: () => {
          openWindow("about");
        },
      },
      {
        id: "blog",
        title: "Articles & Publications",
        category: "Applications",
        description: "Technical articles, system architecture writeups & tutorials",
        icon: BookOpen,
        keywords: ["blog", "articles", "posts", "writing", "publications", "tutorials"],
        action: () => {
          openWindow("blog");
        },
      },
      {
        id: "resume",
        title: "Resume & Curriculum Vitae",
        category: "Applications",
        description: "Interactive resume reader & PDF download",
        icon: FileText,
        keywords: ["resume", "cv", "pdf", "download", "hire", "qualifications"],
        badge: "PDF",
        action: () => {
          openWindow("resume");
        },
      },
      {
        id: "contact",
        title: "Contact & Dispatch Mailer",
        category: "Applications",
        description: "Direct messaging portal & communication links",
        icon: Mail,
        keywords: ["contact", "email", "message", "hire", "dispatch", "reach"],
        action: () => {
          openWindow("contact");
        },
      },
      {
        id: "settings",
        title: "System Preferences",
        category: "Applications",
        description: "Visual appearance, wallpapers, audio, & CRT scanlines",
        icon: Settings,
        keywords: ["settings", "preferences", "config", "appearance", "theme", "wallpaper"],
        action: () => {
          openWindow("settings");
        },
      },

      // Actions & Settings
      {
        id: "theme-emerald",
        title: "Theme: Cyber Emerald",
        category: "Actions & Settings",
        description: "Switch accent theme to Cyber Emerald",
        icon: Palette,
        keywords: ["theme", "emerald", "green", "color"],
        action: () => {
          setTheme("emerald");
        },
      },
      {
        id: "theme-cyan",
        title: "Theme: Neon Cyan",
        category: "Actions & Settings",
        description: "Switch accent theme to Neon Cyan",
        icon: Palette,
        keywords: ["theme", "cyan", "blue", "neon", "color"],
        action: () => {
          setTheme("cyan");
        },
      },
      {
        id: "theme-amber",
        title: "Theme: Retro Amber",
        category: "Actions & Settings",
        description: "Switch accent theme to Retro Amber",
        icon: Palette,
        keywords: ["theme", "amber", "orange", "gold", "color"],
        action: () => {
          setTheme("amber");
        },
      },
      {
        id: "theme-purple",
        title: "Theme: Synthwave Purple",
        category: "Actions & Settings",
        description: "Switch accent theme to Synthwave Purple",
        icon: Palette,
        keywords: ["theme", "purple", "violet", "synthwave", "color"],
        action: () => {
          setTheme("purple");
        },
      },
      {
        id: "toggle-crt",
        title: "Toggle CRT Scanlines Filter",
        category: "Actions & Settings",
        description: "Enable or disable retro phosphor scanline overlay",
        icon: Tv,
        keywords: ["crt", "scanline", "filter", "retro", "screen", "phosphor"],
        action: () => {
          toggleCrtScanlines();
        },
      },
      {
        id: "toggle-audio",
        title: "Toggle Audio Mute",
        category: "Actions & Settings",
        description: "Enable or mute all interactive sound effects",
        icon: Volume2,
        keywords: ["audio", "sound", "mute", "volume", "sfx"],
        action: () => {
          toggleSound();
        },
      },
      {
        id: "toggle-viewmode",
        title: "Toggle Classic Scroll View",
        category: "Actions & Settings",
        description: "Switch between NexOS Desktop and Classic Portfolio mode",
        icon: Sparkles,
        keywords: ["classic", "scroll", "mode", "view", "toggle"],
        action: () => {
          toggleViewMode();
        },
      },
      {
        id: "reset-os",
        title: "Reset NexOS Workspace",
        category: "Actions & Settings",
        description: "Restore window positions & desktop state to defaults",
        icon: RotateCcw,
        keywords: ["reset", "restart", "restore", "defaults", "clean"],
        action: () => {
          resetDesktop();
        },
      },

      // External Links
      {
        id: "github-portfolio",
        title: "GitHub: codernex/portfolio",
        category: "External Links",
        description: "Open the source code repository on GitHub",
        icon: Github,
        keywords: ["github", "repo", "source", "code", "repository", "git"],
        badge: "EXTERNAL",
        action: () => {
          window.open("https://github.com/codernex/portfolio", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "linkedin",
        title: "LinkedIn Profile",
        category: "External Links",
        description: "Connect with Borhan Uddin on LinkedIn",
        icon: Linkedin,
        keywords: ["linkedin", "social", "connect", "profile", "network"],
        badge: "EXTERNAL",
        action: () => {
          window.open("https://linkedin.com/codernex", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "upwork",
        title: "Upwork Freelance Profile",
        category: "External Links",
        description: "Hire Borhan Uddin for software engineering contracts",
        icon: Globe,
        keywords: ["upwork", "freelance", "hire", "contract", "client"],
        badge: "EXTERNAL",
        action: () => {
          window.open(
            "https://www.upwork.com/freelancers/codernex?s=1110580755107926016",
            "_blank",
            "noopener,noreferrer"
          );
        },
      },
    ],
    [
      openWindow,
      setTheme,
      toggleCrtScanlines,
      toggleSound,
      toggleViewMode,
      resetDesktop,
    ]
  );

  // Filtered results
  const filteredResults = useMemo(() => {
    if (!query.trim()) return searchItems.slice(0, 10);
    const q = query.toLowerCase().trim();
    return searchItems.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some((k) => k.includes(q));
      return matchTitle || matchDesc || matchCategory || matchKeywords;
    });
  }, [query, searchItems]);

  // Keyboard navigation inside search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      playUiClick();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      playUiClick();
      setSelectedIndex((prev) =>
        prev <= 0 ? filteredResults.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        playWindowOpen();
        filteredResults[selectedIndex].action();
        closeSearch();
      }
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md font-mono select-none animate-in fade-in duration-150"
      onClick={closeSearch}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60">
          <Search size={18} className={themeConfig.text} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search applications, actions, files, or commands..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-zinc-500 hover:text-white p-1 rounded transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar max-h-[420px]">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No matching applications or commands found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playWindowOpen();
                    item.action();
                    closeSearch();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? `${themeConfig.bgSubtle} border ${themeConfig.border} ${themeConfig.shadow}`
                      : "hover:bg-zinc-900/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                        isSelected
                          ? `${themeConfig.bg} text-black border-transparent`
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      } transition-colors shrink-0`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              item.badge === "3D GAME"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 truncate">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-zinc-600 uppercase hidden md:inline">
                      {item.category}
                    </span>
                    {isSelected ? (
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${themeConfig.text}`}>
                        <span>Select</span>
                        <CornerDownLeft size={12} />
                      </div>
                    ) : (
                      <ArrowRight size={14} className="text-zinc-700 opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Search Footer Hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800/80 bg-zinc-950 text-[10px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className={`${themeConfig.text} font-bold`}>Spotlight Engine v1.0</span>
        </div>
      </div>
    </div>
  );
}
