"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  ExternalLink,
  Plus,
  X,
  Copy,
  Check,
  Bookmark,
  User,
  Folder,
  BookOpen,
  FileText,
  Mail,
  Github,
  Linkedin,
  ShieldCheck,
  Search,
  Star,
  Terminal,
  Code,
  Activity,
  Layers,
  Monitor,
  Maximize2,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Info,
  CornerDownLeft,
  Trash2,
} from "lucide-react";
import { useOSStore } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import { playUiClick } from "@/lib/audio";
import { toast } from "sonner";

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  zoom: number;
}

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon?: React.ElementType;
}

interface ConsoleMessage {
  id: string;
  type: "log" | "info" | "warn" | "error" | "result";
  text: string;
  timestamp: string;
}

interface NetworkRequest {
  id: string;
  name: string;
  method: string;
  status: number;
  type: string;
  size: string;
  time: string;
}

const INITIAL_BOOKMARKS: BookmarkItem[] = [
  { id: "bm-1", title: "NexNet Start", url: "nex://home", icon: Home },
  { id: "bm-2", title: "Portfolio Live", url: "/", icon: Monitor },
  { id: "bm-3", title: "Projects Explorer", url: "/projects", icon: Folder },
  { id: "bm-4", title: "Technical Articles", url: "/blog", icon: BookOpen },
  { id: "bm-5", title: "Resume PDF", url: "/resume.pdf", icon: FileText },
  { id: "bm-6", title: "GitHub (@codernex)", url: "https://github.com/codernex", icon: Github },
  { id: "bm-7", title: "LinkedIn", url: "https://linkedin.com/in/codernex", icon: Linkedin },
  { id: "bm-8", title: "Wikipedia", url: "https://en.wikipedia.org/wiki/Main_Page", icon: Globe },
];

export default function OSBrowserView() {
  const { theme, openWindow } = useOSStore();
  const themeConfig = getThemeConfig(theme);

  // Browser Tabs State
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: "tab-1",
      title: "NexNet Start // Developer Hub",
      url: "nex://home",
      history: ["nex://home"],
      historyIndex: 0,
      isLoading: false,
      zoom: 100,
    },
    {
      id: "tab-2",
      title: "Codernex Live Portfolio",
      url: "/",
      history: ["/"],
      historyIndex: 0,
      isLoading: false,
      zoom: 100,
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>("tab-1");
  const [addressInput, setAddressInput] = useState<string>("nex://home");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);
  const [progress, setProgress] = useState<number>(0);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [showDevTools, setShowDevTools] = useState<boolean>(false);
  const [devToolsTab, setDevToolsTab] = useState<"console" | "elements" | "network">("console");
  const [consoleInput, setConsoleInput] = useState<string>("");
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([
    {
      id: "c-1",
      type: "info",
      text: "NexNet WebKit Runtime v2.4.0-turbopack initialized [sandbox=active]",
      timestamp: "12:00:01",
    },
    {
      id: "c-2",
      type: "log",
      text: "DOM content loaded successfully. Running in zero-leak virtual frame.",
      timestamp: "12:00:02",
    },
  ]);

  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([
    { id: "n-1", name: "document", method: "GET", status: 200, type: "document", size: "18.4 KB", time: "28ms" },
    { id: "n-2", name: "globals.css", method: "GET", status: 200, type: "stylesheet", size: "34.2 KB", time: "16ms" },
    { id: "n-3", name: "app-bundle.js", method: "GET", status: 200, type: "script", size: "142.6 KB", time: "52ms" },
    { id: "n-4", name: "api/resume-content", method: "GET", status: 200, type: "fetch", size: "2.1 KB", time: "44ms" },
  ]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url);

  // Sync address input when active tab changes
  useEffect(() => {
    setAddressInput(activeTab.url);
  }, [activeTabId, activeTab.url]);

  // Loading progress bar simulation
  const triggerProgress = () => {
    setProgress(20);
    const t1 = setTimeout(() => setProgress(65), 150);
    const t2 = setTimeout(() => setProgress(100), 400);
    const t3 = setTimeout(() => setProgress(0), 750);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    const target = tabs.find((t) => t.id === tabId);
    if (target) {
      setAddressInput(target.url);
    }
  };

  const handleNewTab = () => {
    playUiClick();
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: "New Tab",
      url: "nex://home",
      history: ["nex://home"],
      historyIndex: 0,
      isLoading: false,
      zoom: 100,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setAddressInput("nex://home");
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    playUiClick();
    if (tabs.length === 1) {
      setTabs([
        {
          id: `tab-${Date.now()}`,
          title: "NexNet Start // Developer Hub",
          url: "nex://home",
          history: ["nex://home"],
          historyIndex: 0,
          isLoading: false,
          zoom: 100,
        },
      ]);
      setAddressInput("nex://home");
      return;
    }

    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      const nextActive = remaining[remaining.length - 1];
      setActiveTabId(nextActive.id);
      setAddressInput(nextActive.url);
    }
  };

  const navigateTo = (rawInput: string) => {
    let target = rawInput.trim();
    if (!target) return;

    triggerProgress();

    // 1. Shorthand URL aliases
    const lower = target.toLowerCase();
    if (lower === "home" || lower === "start" || lower === "about:blank" || lower === "me") {
      target = "nex://home";
    } else if (lower === "projects" || lower === "work") {
      target = "/projects";
    } else if (lower === "blog" || lower === "articles") {
      target = "/blog";
    } else if (lower === "resume" || lower === "cv") {
      target = "/resume.pdf";
    } else if (lower === "contact") {
      target = "/contact";
    } else if (lower === "about") {
      target = "/about";
    } else if (lower === "github") {
      target = "https://github.com/codernex";
    } else if (lower === "linkedin") {
      target = "https://linkedin.com/in/codernex";
    } else if (lower === "wikipedia") {
      target = "https://en.wikipedia.org/wiki/Main_Page";
    } else if (
      !target.startsWith("nex://") &&
      !target.startsWith("http://") &&
      !target.startsWith("https://") &&
      !target.startsWith("/")
    ) {
      if (target.includes(".") && !target.includes(" ")) {
        target = `https://${target}`;
      } else {
        // Query search
        target = `nex://search?q=${encodeURIComponent(target)}`;
      }
    }

    // Title determination
    let title = "Web Page";
    if (target === "nex://home") title = "NexNet Start // Developer Hub";
    else if (target.startsWith("nex://search")) {
      const query = new URLSearchParams(target.split("?")[1] || "").get("q") || "";
      title = `${query} - NexSearch`;
    } else if (target === "/") title = "Codernex Live Portfolio";
    else if (target === "/projects") title = "Projects Explorer";
    else if (target === "/blog") title = "Technical Articles";
    else if (target === "/resume.pdf") title = "Resume & CV (PDF)";
    else if (target === "/about") title = "About the Architect";
    else if (target === "/contact") title = "Contact & Dispatch";
    else {
      try {
        const u = new URL(target, "https://codernex.dev");
        title = u.hostname || target;
      } catch {
        title = target;
      }
    }

    // Update Tab state
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTab.id) {
          const newHistory = t.history.slice(0, t.historyIndex + 1);
          newHistory.push(target);
          return {
            ...t,
            title,
            url: target,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isLoading: false,
          };
        }
        return t;
      })
    );

    setAddressInput(target);

    // Append to simulated Network log
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    setNetworkRequests((prev) => [
      {
        id: `net-${Date.now()}`,
        name: target.split("/").pop() || "index.html",
        method: "GET",
        status: 200,
        type: target.endsWith(".pdf") ? "pdf" : target.startsWith("nex://") ? "internal" : "document",
        size: `${Math.floor(Math.random() * 40 + 10)}.${Math.floor(Math.random() * 9)} KB`,
        time: `${Math.floor(Math.random() * 60 + 15)}ms`,
      },
      ...prev.slice(0, 15),
    ]);

    setConsoleMessages((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        type: "log",
        text: `Navigated to ${target}`,
        timestamp: timeStr,
      },
    ]);
  };

  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      playUiClick();
      triggerProgress();
      const newIndex = activeTab.historyIndex - 1;
      const target = activeTab.history[newIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab.id ? { ...t, url: target, historyIndex: newIndex } : t
        )
      );
      setAddressInput(target);
    }
  };

  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      playUiClick();
      triggerProgress();
      const newIndex = activeTab.historyIndex + 1;
      const target = activeTab.history[newIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab.id ? { ...t, url: target, historyIndex: newIndex } : t
        )
      );
      setAddressInput(target);
    }
  };

  const handleReload = () => {
    playUiClick();
    triggerProgress();
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
    toast.success("Page refreshed", { duration: 1500 });
  };

  const handleToggleBookmark = () => {
    playUiClick();
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.url !== activeTab.url));
      toast.info("Removed from bookmarks");
    } else {
      setBookmarks((prev) => [
        ...prev,
        {
          id: `bm-${Date.now()}`,
          title: activeTab.title.slice(0, 18),
          url: activeTab.url,
          icon: Globe,
        },
      ]);
      toast.success("Added to bookmarks");
    }
  };

  const handleZoom = (direction: "in" | "out" | "reset") => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTab.id) {
          let newZoom = t.zoom;
          if (direction === "in") newZoom = Math.min(t.zoom + 10, 150);
          else if (direction === "out") newZoom = Math.max(t.zoom - 10, 60);
          else newZoom = 100;
          return { ...t, zoom: newZoom };
        }
        return t;
      })
    );
  };

  const handleExecuteConsole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const input = consoleInput.trim();
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    let resultText = "";
    let isError = false;

    try {
      if (input === "help") {
        resultText = "Commands: document.title, location.href, clear(), help, alert('msg'), Math.random()";
      } else if (input === "clear()") {
        setConsoleMessages([]);
        setConsoleInput("");
        return;
      } else if (input === "document.title") {
        resultText = `"${activeTab.title}"`;
      } else if (input === "location.href" || input === "window.location.href") {
        resultText = `"${activeTab.url}"`;
      } else if (input === "navigator.userAgent") {
        resultText = '"Mozilla/5.0 (X11; Linux x86_64) NexNet/2.4 WebKit/537.36"';
      } else {
        // Safe evaluation of simple math / expressions
        // eslint-disable-next-line no-eval
        const evaluated = eval(input);
        resultText = typeof evaluated === "object" ? JSON.stringify(evaluated) : String(evaluated);
      }
    } catch (err: any) {
      resultText = `Uncaught ${err.name || "Error"}: ${err.message || "Invalid expression"}`;
      isError = true;
    }

    setConsoleMessages((prev) => [
      ...prev,
      { id: `c-${Date.now()}-in`, type: "log", text: `> ${input}`, timestamp: timeStr },
      { id: `c-${Date.now()}-out`, type: isError ? "error" : "result", text: resultText, timestamp: timeStr },
    ]);
    setConsoleInput("");
  };

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;
  const isInternalPortal = activeTab.url === "nex://home";
  const isSearchPage = activeTab.url.startsWith("nex://search");
  const isLocalRoute = activeTab.url.startsWith("/");
  const isExternal = activeTab.url.startsWith("http://") || activeTab.url.startsWith("https://");

  // Sites known to block embedding with X-Frame-Options: SAMEORIGIN
  const isFrameBlockedSite =
    isExternal &&
    (activeTab.url.includes("github.com") ||
      activeTab.url.includes("linkedin.com") ||
      activeTab.url.includes("google.com") ||
      activeTab.url.includes("twitter.com") ||
      activeTab.url.includes("x.com") ||
      activeTab.url.includes("upwork.com"));

  return (
    <div className="flex flex-col h-full bg-zinc-950 font-mono text-zinc-300 select-text overflow-hidden relative">
      {/* 1. Animated Top Loading Progress Bar */}
      {progress > 0 && (
        <div
          className="absolute top-0 left-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300 z-50 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* 2. Chrome Tabs Header Bar */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-zinc-950 border-b border-zinc-800/80 overflow-x-auto select-none shrink-0">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t border-x text-xs max-w-[220px] cursor-pointer transition-all ${
                  isActive
                    ? `bg-zinc-900 ${themeConfig.border} text-white font-semibold shadow-sm`
                    : "bg-zinc-950/60 border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                }`}
              >
                <Globe size={12} className={isActive ? themeConfig.text : "text-zinc-600"} />
                <span className="truncate flex-1 text-[11px]">{tab.title}</span>
                <button
                  type="button"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="p-0.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                  title="Close Tab"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleNewTab}
            className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
            title="New Tab (Ctrl+T)"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Browser Window Controls (Zoom & DevTools Toggle) */}
        <div className="flex items-center gap-1 pb-1">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md px-1.5 py-0.5 text-[10px] text-zinc-400">
            <button
              onClick={() => handleZoom("out")}
              className="hover:text-white px-1 cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
            <span
              onClick={() => handleZoom("reset")}
              className="px-1 font-mono cursor-pointer hover:text-emerald-400"
              title="Reset Zoom"
            >
              {activeTab.zoom}%
            </span>
            <button
              onClick={() => handleZoom("in")}
              className="hover:text-white px-1 cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDevTools(!showDevTools)}
            className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
              showDevTools
                ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
            title="Toggle Developer Tools"
          >
            <Code size={12} />
            <span className="hidden sm:inline text-[10px]">DevTools</span>
          </button>
        </div>
      </div>

      {/* 3. Navigation Controls & Omnibox Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 border-b border-zinc-800/90 text-xs shrink-0 select-none">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            disabled={!canGoBack}
            onClick={handleBack}
            className={`p-1.5 rounded hover:bg-zinc-800 transition-colors ${
              canGoBack ? "text-zinc-200 cursor-pointer" : "text-zinc-600 cursor-not-allowed opacity-40"
            }`}
            title="Back"
          >
            <ArrowLeft size={13} />
          </button>
          <button
            disabled={!canGoForward}
            onClick={handleForward}
            className={`p-1.5 rounded hover:bg-zinc-800 transition-colors ${
              canGoForward ? "text-zinc-200 cursor-pointer" : "text-zinc-600 cursor-not-allowed opacity-40"
            }`}
            title="Forward"
          >
            <ArrowRight size={13} />
          </button>
          <button
            onClick={handleReload}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Reload Page"
          >
            <RotateCw size={13} />
          </button>
          <button
            onClick={() => navigateTo("nex://home")}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Home"
          >
            <Home size={13} />
          </button>
        </div>

        {/* Omnibox / URL Address Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(addressInput);
          }}
          className="flex-1 flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus-within:border-zinc-600 transition-colors relative"
        >
          {/* Protocol Lock Button */}
          <button
            type="button"
            onClick={() => setShowCertModal(!showCertModal)}
            className="flex items-center gap-1 text-[10px] font-mono shrink-0 cursor-pointer hover:opacity-80"
            title="Security Status"
          >
            {activeTab.url.startsWith("nex://") ? (
              <span
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${themeConfig.bgSubtle} ${themeConfig.text} font-bold`}
              >
                <ShieldCheck size={11} />
                NEX
              </span>
            ) : (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold">
                <Lock size={10} />
                TLS
              </span>
            )}
          </button>

          {/* Certificate Info Popover */}
          {showCertModal && (
            <div className="absolute top-9 left-2 z-50 w-72 rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl backdrop-blur-xl text-[11px] space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Connection is Secure</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[10px]">
                Your information (for example, passwords or credit card numbers) is private when it is sent to this site.
              </p>
              <div className="p-2 rounded bg-zinc-900 text-[10px] space-y-1 font-mono text-zinc-400 border border-zinc-800/80">
                <div>Certificate: <span className="text-white">NexOS Root CA G2</span></div>
                <div>Algorithm: <span className="text-emerald-400">TLS 1.3 • AES_256_GCM</span></div>
                <div>Status: <span className="text-emerald-400">Valid &amp; Verified</span></div>
              </div>
            </div>
          )}

          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Search with NexSearch or enter address (/projects, /blog, github.com)..."
            className="flex-1 bg-transparent border-none outline-none text-white text-[11px] font-mono"
          />

          {/* Omnibox Actions: Bookmark Star & Copy */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`p-1 rounded transition-colors ${
                isBookmarked ? "text-amber-400" : "text-zinc-600 hover:text-zinc-300"
              }`}
              title={isBookmarked ? "Bookmarked" : "Bookmark this tab"}
            >
              <Star size={12} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(activeTab.url);
                toast.success("URL copied to clipboard");
              }}
              className="p-1 rounded text-zinc-600 hover:text-zinc-300 transition-colors"
              title="Copy URL"
            >
              <Copy size={12} />
            </button>
          </div>
        </form>

        {/* Outbound Link External Button */}
        {isExternal && (
          <a
            href={activeTab.url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Open in System Browser"
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* 4. Bookmarks Bar */}
      <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950/90 border-b border-zinc-800/60 text-[11px] overflow-x-auto shrink-0 select-none">
        <Bookmark size={11} className="text-zinc-600 shrink-0" />
        <div className="flex items-center gap-1.5 flex-nowrap">
          {bookmarks.map((bm) => {
            const Icon = bm.icon || Globe;
            const isCurrent = activeTab.url === bm.url;
            return (
              <button
                key={bm.id}
                type="button"
                onClick={() => {
                  playUiClick();
                  navigateTo(bm.url);
                }}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? `${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle}`
                    : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <Icon size={10} />
                <span>{bm.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Main Viewport (Render Layer) */}
      <div
        className="flex-1 overflow-y-auto bg-zinc-950 relative"
        style={{ zoom: `${activeTab.zoom}%` }}
      >
        {/* VIEW 1: NexNet Start / Developer Intranet Hub */}
        {isInternalPortal && (
          <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-200">
            {/* NexSearch Big Search Box */}
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                <Globe size={14} className={themeConfig.text} />
                <span className="font-bold tracking-wider text-white">NexNet Browser</span>
                <span className="text-[10px] text-zinc-500 font-mono">v2.4</span>
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Search or Enter Address
              </h1>

              <div className="max-w-xl mx-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigateTo(addressInput);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl focus-within:border-emerald-500/80 transition-all"
                >
                  <Search size={16} className="text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search projects, technical articles, bio or any web URL..."
                    value={addressInput === "nex://home" ? "" : addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder:text-zinc-600"
                  />
                  <button
                    type="submit"
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${themeConfig.bg} text-black ${themeConfig.border} cursor-pointer`}
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>

            {/* Speed Dial Shortcut Tiles */}
            <div>
              <div className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-3 px-1 flex items-center justify-between">
                <span>Speed Dial Shortcuts</span>
                <span className="text-[10px] text-zinc-600">8 DESTINATIONS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INITIAL_BOOKMARKS.map((item) => {
                  const Icon = item.icon || Globe;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.url)}
                      className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-zinc-800/60 text-zinc-300 group-hover:text-emerald-400 group-hover:bg-zinc-800 transition-colors">
                          <Icon size={16} />
                        </div>
                        <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">↗</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate font-mono mt-0.5">{item.url}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Developer Specs & Bio Intranet Banner */}
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/50 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl border ${themeConfig.bgSubtle} ${themeConfig.borderSubtle} ${themeConfig.text} shadow-xl`}
                  >
                    BU
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">Borhan Uddin</h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        AVAILABLE FOR ENGAGEMENTS
                      </span>
                    </div>
                    <p className={`text-xs ${themeConfig.text} font-semibold`}>
                      Software Engineer II • Distributed Systems & AI Agents Architect
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openWindow("projects")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${themeConfig.bgSubtle} ${themeConfig.text} ${themeConfig.borderSubtle} cursor-pointer`}
                  >
                    Open Projects Window
                  </button>
                  <button
                    onClick={() => openWindow("terminal")}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer"
                  >
                    Open CLI
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                Experienced full-stack engineer with over 4 years of production experience building high-throughput
                microservices, multi-agent AI pipelines, scalable Next.js platforms, and real-time interactive applications.
              </p>
            </div>
          </div>
        )}

        {/* VIEW 2: Simulated Search Engine Results (nex://search?q=...) */}
        {isSearchPage && (
          <div className="max-w-3xl mx-auto p-6 space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-zinc-800">
              <span className="text-xs text-zinc-500">NexSearch Results for:</span>
              <h1 className="text-xl font-bold text-white mt-1">
                {new URLSearchParams(activeTab.url.split("?")[1] || "").get("q") || ""}
              </h1>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => navigateTo("/projects")}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <div className="text-[11px] text-emerald-400 font-mono">https://codernex.dev/projects</div>
                <h3 className="text-sm font-bold text-white mt-1 hover:underline">
                  Featured Software Works & Platforms — Codernex
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Explore production software platforms including Kagoz Analytics SaaS, Codernex Platform v1, and Nexpress CLI.
                </p>
              </div>

              <div
                onClick={() => navigateTo("/blog")}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <div className="text-[11px] text-emerald-400 font-mono">https://codernex.dev/blog</div>
                <h3 className="text-sm font-bold text-white mt-1 hover:underline">
                  Technical Publications, AI Systems & Node.js Deep-Dives
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Comprehensive architectural guides covering autonomous AI agent loops, smolagents, LangGraph, and worker threads.
                </p>
              </div>

              <div
                onClick={() => navigateTo("https://github.com/codernex")}
                className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <div className="text-[11px] text-emerald-400 font-mono">https://github.com/codernex</div>
                <h3 className="text-sm font-bold text-white mt-1 hover:underline">
                  Borhan Uddin (codernex) · GitHub Repositories
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Explore open source repositories, TypeScript libraries, and machine learning experiments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Frame Protection Warning (For blocked sites like GitHub/LinkedIn) */}
        {isFrameBlockedSite && (
          <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6 animate-in fade-in duration-200">
            <div className="inline-flex p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-amber-400">
              <AlertTriangle size={48} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                ERR_BLOCKED_BY_RESPONSE
              </div>
              <h2 className="text-lg font-bold text-white">This site can&apos;t be displayed in a frame</h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
                The publisher of <span className="font-mono text-zinc-300">{activeTab.url}</span> has set{" "}
                <code className="bg-zinc-900 px-1 py-0.5 rounded text-amber-300">X-Frame-Options: SAMEORIGIN</code> to
                prevent clickjacking. Click below to view the destination directly.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <a
                href={activeTab.url}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs border ${themeConfig.bg} text-black ${themeConfig.border} ${themeConfig.shadow} hover:opacity-90 transition-opacity cursor-pointer`}
              >
                <span>Launch in System Browser</span>
                <ExternalLink size={13} />
              </a>

              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: Live IFrame Rendering (For same-origin routes & frame-friendly external sites) */}
        {!isInternalPortal && !isSearchPage && !isFrameBlockedSite && (
          <iframe
            ref={iframeRef}
            src={activeTab.url}
            title={activeTab.title}
            className="w-full h-full min-h-[550px] border-none bg-zinc-950"
          />
        )}
      </div>

      {/* 6. Built-in DevTools Drawer (Console / Elements / Network) */}
      {showDevTools && (
        <div className="h-56 bg-zinc-950 border-t border-zinc-800 flex flex-col shrink-0 select-none font-mono text-xs z-30 animate-in slide-in-from-bottom-2 duration-150">
          {/* DevTools Tab Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDevToolsTab("console")}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  devToolsTab === "console" ? `${themeConfig.bgSubtle} ${themeConfig.text}` : "text-zinc-400 hover:text-white"
                }`}
              >
                Console ({consoleMessages.length})
              </button>
              <button
                type="button"
                onClick={() => setDevToolsTab("elements")}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  devToolsTab === "elements" ? `${themeConfig.bgSubtle} ${themeConfig.text}` : "text-zinc-400 hover:text-white"
                }`}
              >
                Elements
              </button>
              <button
                type="button"
                onClick={() => setDevToolsTab("network")}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  devToolsTab === "network" ? `${themeConfig.bgSubtle} ${themeConfig.text}` : "text-zinc-400 hover:text-white"
                }`}
              >
                Network ({networkRequests.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConsoleMessages([])}
                className="text-zinc-500 hover:text-zinc-300 p-1"
                title="Clear Console"
              >
                <Trash2 size={12} />
              </button>
              <button
                type="button"
                onClick={() => setShowDevTools(false)}
                className="text-zinc-500 hover:text-white p-1"
                title="Close DevTools"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tab 1: Console */}
          {devToolsTab === "console" && (
            <div className="flex-1 flex flex-col min-h-0 bg-zinc-950 p-2 font-mono text-[11px]">
              <div className="flex-1 overflow-y-auto space-y-1 select-text">
                {consoleMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 py-0.5 px-1 rounded ${
                      msg.type === "error"
                        ? "bg-red-950/30 text-red-400"
                        : msg.type === "warn"
                        ? "bg-amber-950/30 text-amber-400"
                        : msg.type === "result"
                        ? "text-emerald-400"
                        : "text-zinc-300"
                    }`}
                  >
                    <span className="text-[9px] text-zinc-600 shrink-0">{msg.timestamp}</span>
                    <span className="break-all">{msg.text}</span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleExecuteConsole}
                className="flex items-center gap-2 pt-1 border-t border-zinc-800/80"
              >
                <span className="text-emerald-400 font-bold">&gt;</span>
                <input
                  type="text"
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  placeholder="Type JavaScript expression (e.g. document.title, location.href, 2+2)..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-[11px] font-mono"
                />
                <button type="submit" className="text-zinc-500 hover:text-white">
                  <CornerDownLeft size={12} />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Elements Inspector */}
          {devToolsTab === "elements" && (
            <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] text-zinc-400 select-text space-y-1 bg-zinc-950">
              <div className="text-zinc-600">&lt;!DOCTYPE html&gt;</div>
              <div className="text-cyan-400">&lt;html lang=&quot;en&quot; class=&quot;dark&quot;&gt;</div>
              <div className="pl-4 text-zinc-500">&lt;head&gt;</div>
              <div className="pl-8 text-zinc-400">
                &lt;title&gt;<span className="text-white">{activeTab.title}</span>&lt;/title&gt;
              </div>
              <div className="pl-8 text-zinc-400">
                &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot; /&gt;
              </div>
              <div className="pl-4 text-zinc-500">&lt;/head&gt;</div>
              <div className="pl-4 text-cyan-400">&lt;body class=&quot;bg-zinc-950 text-white font-mono&quot;&gt;</div>
              <div className="pl-8 text-zinc-400">
                &lt;div id=&quot;__next&quot;&gt;
                <span className="text-zinc-600"> ... [Active DOM Node: {activeTab.url}] ... </span>
                &lt;/div&gt;
              </div>
              <div className="pl-4 text-cyan-400">&lt;/body&gt;</div>
              <div className="text-cyan-400">&lt;/html&gt;</div>
            </div>
          )}

          {/* Tab 3: Network Monitor */}
          {devToolsTab === "network" && (
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] select-text bg-zinc-950">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-[10px] text-zinc-500">
                    <th className="pb-1">Name</th>
                    <th className="pb-1">Status</th>
                    <th className="pb-1">Type</th>
                    <th className="pb-1">Size</th>
                    <th className="pb-1">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {networkRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-zinc-900/60">
                      <td className="py-1 text-white truncate max-w-[150px]">{req.name}</td>
                      <td className="py-1 text-emerald-400 font-bold">{req.status} OK</td>
                      <td className="py-1 text-zinc-400">{req.type}</td>
                      <td className="py-1 text-zinc-400">{req.size}</td>
                      <td className="py-1 text-cyan-400">{req.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
