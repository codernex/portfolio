"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Eye,
  List,
  Sparkles,
  FileCheck,
  Briefcase,
  Cpu,
  GraduationCap,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useOSStore } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";

interface ResumeSection {
  title: string;
  lines: string[];
}

export default function OSResumeView() {
  const { theme } = useOSStore();
  const themeConfig = getThemeConfig(theme);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"live" | "summary">("live");

  // Iframe state
  const [loadingIframe, setLoadingIframe] = useState(true);
  const [iframeKey, setIframeKey] = useState(1);

  // Dynamic Live Text state
  const [parsedSections, setParsedSections] = useState<ResumeSection[]>([]);
  const [rawHeader, setRawHeader] = useState<string[]>([]);
  const [loadingText, setLoadingText] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const GOOGLE_DOC_ID = "1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U";
  const PREVIEW_URL = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/preview`;
  const GOOGLE_DOCS_EDIT_URL = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/edit`;
  const GOOGLE_DOCS_PDF_URL = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/export?format=pdf`;
  const RESUME_LINK = "/resume.pdf";

  // Fetch live text content from Next.js API route
  const fetchLiveContent = async () => {
    setLoadingText(true);
    setTextError(null);
    try {
      const res = await fetch("/api/resume-content");
      if (!res.ok) throw new Error("Failed to fetch resume text content");
      const data = await res.json();

      if (data.success && data.content) {
        parseAndSetContent(data.content);
        setLastFetched(new Date(data.fetchedAt).toLocaleTimeString());
      } else {
        throw new Error(data.error || "No content returned");
      }
    } catch (err: any) {
      console.error("OS_RESUME_FETCH_ERROR:", err);
      setTextError(err.message || "Failed to load live Google Doc text");
    } finally {
      setLoadingText(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();
  }, []);

  const parseAndSetContent = (rawText: string) => {
    // Remove BOM character if present
    const cleanText = rawText.replace(/^\uFEFF/, "");
    const allLines = cleanText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const knownHeaders = [
      "SUMMARY",
      "TECHNICAL SKILLS",
      "PROFESSIONAL EXPERIENCE",
      "SELECTED PROJECTS",
      "EDUCATION",
      "CERTIFICATIONS",
    ];

    const headerLines: string[] = [];
    const sections: ResumeSection[] = [];
    let currentTitle = "";
    let currentLines: string[] = [];

    for (const line of allLines) {
      const upper = line.toUpperCase();
      const matchedHeader = knownHeaders.find(
        (h) => upper === h || upper.startsWith(h)
      );

      if (matchedHeader) {
        if (currentTitle) {
          sections.push({ title: currentTitle, lines: currentLines });
        } else if (currentLines.length > 0) {
          headerLines.push(...currentLines);
        }
        currentTitle = line;
        currentLines = [];
      } else {
        if (!currentTitle) {
          headerLines.push(line);
        } else {
          currentLines.push(line);
        }
      }
    }

    if (currentTitle && currentLines.length > 0) {
      sections.push({ title: currentTitle, lines: currentLines });
    }

    setRawHeader(headerLines);
    setParsedSections(sections);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = GOOGLE_DOCS_PDF_URL;
    link.download = "Borhan_Uddin_Resume.pdf";
    link.target = "_blank";
    link.click();
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}${RESUME_LINK}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshViewer = () => {
    setLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
    fetchLiveContent();
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 font-mono text-zinc-300 p-4 sm:p-5 space-y-4 select-none overflow-y-auto">
      {/* Control Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 border ${themeConfig.border} ${themeConfig.text} shadow-inner shrink-0`}
          >
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Borhan_Uddin_Resume.pdf
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE SYNC
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Synced directly with Google Docs live repository
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode("live")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === "live"
                  ? `${themeConfig.bg} text-black font-bold shadow`
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Eye size={13} />
              <span>Live Doc</span>
            </button>
            <button
              onClick={() => setViewMode("summary")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === "summary"
                  ? `${themeConfig.bg} text-black font-bold shadow`
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <List size={13} />
              <span>Parsed Summary</span>
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          {/* Action Buttons */}
          <button
            onClick={handleDownload}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${themeConfig.bg} text-black hover:brightness-110 shadow`}
          >
            <Download size={13} strokeWidth={2.5} />
            <span>Download PDF</span>
          </button>

          <a
            href={GOOGLE_DOCS_EDIT_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors"
            title="Open in Google Docs"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Google Docs</span>
          </a>

          <button
            onClick={handleRefreshViewer}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw
              size={13}
              className={loadingIframe || loadingText ? "animate-spin" : ""}
            />
          </button>

          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Copy Shareable Link"
          >
            {copied ? (
              <Check size={13} className="text-emerald-400" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>
      </div>

      {/* Main View Container */}
      {viewMode === "live" ? (
        <div className="relative flex-1 min-h-[580px] w-full rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-2xl flex flex-col">
          {/* Loading Overlay */}
          {loadingIframe && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/90 gap-3 backdrop-blur-sm">
              <Loader2 size={32} className={`animate-spin ${themeConfig.text}`} />
              <p className="text-xs text-zinc-400 font-mono">
                Fetching live document from Google Docs...
              </p>
            </div>
          )}

          {/* Embedded Google Docs Preview */}
          <iframe
            key={iframeKey}
            src={PREVIEW_URL}
            onLoad={() => setLoadingIframe(false)}
            className="w-full h-full min-h-[580px] flex-1 border-none rounded-xl"
            title="Borhan Uddin Resume - Live Google Doc"
            allow="autoplay"
          />
        </div>
      ) : (
        /* Parsed Dynamic Summary View (Fetched from Google Docs) */
        <div className="space-y-4 p-1">
          {loadingText ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
              <Loader2 size={28} className={`animate-spin ${themeConfig.text}`} />
              <p className="text-xs font-mono">
                Parsing live content from Google Docs repository...
              </p>
            </div>
          ) : textError ? (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{textError}</span>
              </div>
              <button
                onClick={fetchLiveContent}
                className="px-3 py-1 rounded bg-zinc-800 text-white hover:bg-zinc-700 font-bold"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Header Info Card */}
              {rawHeader.length > 0 && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <h3 className="font-bold text-white text-base sm:text-lg">
                      {rawHeader[0]}
                    </h3>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Live Parsed
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 space-y-1">
                    {rawHeader.slice(1).map((line, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Section Cards */}
              <div className="space-y-4">
                {parsedSections.map((sec, idx) => {
                  const upperTitle = sec.title.toUpperCase();
                  const isExp = upperTitle.includes("EXPERIENCE");
                  const isSkills = upperTitle.includes("SKILLS");
                  const isProj = upperTitle.includes("PROJECTS");

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3 shadow-md"
                    >
                      <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2 border-b border-zinc-800/80 pb-2">
                        {isExp ? (
                          <Briefcase size={14} />
                        ) : isSkills ? (
                          <Cpu size={14} />
                        ) : isProj ? (
                          <Sparkles size={14} />
                        ) : (
                          <Award size={14} />
                        )}
                        <span>{sec.title}</span>
                      </h4>

                      <div className="space-y-2 text-xs text-zinc-300 leading-relaxed font-mono">
                        {sec.lines.map((line, lIdx) => {
                          const isBullet =
                            line.startsWith("*") ||
                            line.startsWith("-") ||
                            line.startsWith("•");

                          return (
                            <p
                              key={lIdx}
                              className={`text-xs ${
                                isBullet
                                  ? "pl-4 text-zinc-300 relative before:content-['•'] before:absolute before:left-1 before:text-emerald-400"
                                  : "text-zinc-200 font-medium"
                              }`}
                            >
                              {isBullet ? line.replace(/^[*•-]\s*/, "") : line}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 shrink-0">
        <span className="flex items-center gap-1.5">
          <FileCheck size={12} className={themeConfig.text} />
          <span>
            Google Doc ID: {GOOGLE_DOC_ID.slice(0, 10)}...{" "}
            {lastFetched && `(Synced: ${lastFetched})`}
          </span>
        </span>
        <button
          onClick={handleDownload}
          className={`hover:underline flex items-center gap-1 ${themeConfig.text} font-bold cursor-pointer`}
        >
          <span>Download PDF Export</span>
          <Download size={11} />
        </button>
      </div>
    </div>
  );
}
