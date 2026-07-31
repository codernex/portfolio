"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";
import { Check, Copy, Code2, Eye, AlertCircle } from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
  showControls?: boolean;
}

function autoQuoteMermaidLabels(chart: string): string {
  let processed = chart;
  // 1. Quote unquoted cylinder database shapes [(Text with & or ())] -> [("Text")]
  processed = processed.replace(
    /\[\(\s*([^"\n\(\)]*?[&()][^"\n\(\)]*?)\s*\)\]/g,
    '[("$1")]'
  );
  // 2. Quote unquoted square bracket labels [Text with & or ()] -> ["Text"]
  processed = processed.replace(
    /\[\s*([^"\n\[\]]*?[&()][^"\n\[\]]*?)\s*\]/g,
    '["$1"]'
  );
  return processed;
}

export default function MermaidDiagram({
  chart,
  className = "",
  showControls = true,
}: MermaidDiagramProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"diagram" | "code">("diagram");
  const [copied, setCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  // Sanitize ID for DOM element ID (remove colons)
  const elementId = `mermaid-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji",
      themeVariables: {
        darkMode: true,
        background: "#09090b",
        primaryColor: "#059669",
        primaryTextColor: "#ffffff",
        primaryBorderColor: "#10b981",
        lineColor: "#10b981",
        secondaryColor: "#18181b",
        tertiaryColor: "#27272a",
        nodeBorder: "#10b981",
        clusterBkg: "#18181b",
        clusterBorder: "#27272a",
        defaultLinkColor: "#10b981",
        titleColor: "#f4f4f5",
        edgeLabelBackground: "#18181b",
      },
    });

    let isMounted = true;

    async function renderDiagram() {
      const cleanChart = chart?.trim();
      if (!cleanChart) {
        setSvgContent("");
        setError(null);
        return;
      }

      try {
        let chartToRender = cleanChart;
        try {
          // Validate syntax first
          await mermaid.parse(cleanChart);
        } catch (firstErr) {
          // Attempt auto-quoting fallback for unquoted special characters (&, (), etc.)
          const autoQuoted = autoQuoteMermaidLabels(cleanChart);
          try {
            await mermaid.parse(autoQuoted);
            chartToRender = autoQuoted;
          } catch {
            throw firstErr;
          }
        }

        // Unique ID for render
        const renderId = `${elementId}-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(renderId, chartToRender);

        if (isMounted) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn("Mermaid render error:", err);
          setError(err?.str || err?.message || "Invalid Mermaid syntax");
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, elementId]);

  const handleCopy = () => {
    if (!chart) return;
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`my-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-lg ${className}`}
    >
      {/* Header bar */}
      {showControls && (
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 font-mono text-xs text-zinc-400">
              flowchart.mmd
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex rounded-md border border-zinc-800 bg-zinc-950 p-0.5 font-mono text-xs">
              <button
                onClick={() => setActiveTab("diagram")}
                className={`flex items-center gap-1.5 rounded px-2 py-1 transition-colors ${
                  activeTab === "diagram"
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Diagram</span>
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1.5 rounded px-2 py-1 transition-colors ${
                  activeTab === "code"
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Source</span>
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="rounded-md border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
              title="Copy Mermaid Code"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="p-6">
        {activeTab === "diagram" ? (
          error ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center text-xs text-red-400 font-mono">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="font-semibold">Failed to render flowchart</p>
              <pre className="max-w-full overflow-x-auto text-[11px] opacity-80 whitespace-pre-wrap">
                {error}
              </pre>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="flex justify-center overflow-x-auto py-2 [&>svg]:max-w-full [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )
        ) : (
          <pre className="overflow-x-auto rounded-lg bg-zinc-900/80 p-4 font-mono text-xs text-emerald-400 leading-relaxed whitespace-pre-wrap">
            {chart}
          </pre>
        )}
      </div>
    </div>
  );
}
