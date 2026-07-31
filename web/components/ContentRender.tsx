"use client";

import { ContentBlock } from "@/types";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { v4 } from "uuid";
import MermaidDiagram from "@/components/shared/MermaidDiagram";

interface ContentRendererProps {
  blocks?: ContentBlock[];
  htmlContent?: string;
  className?: string;
}

export default function ContentRenderer({
  blocks,
  htmlContent,
  className = "",
}: ContentRendererProps) {
  // If blocks are provided, render them
  if (blocks && blocks.length > 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        {blocks.map((block, index) => {
          let listIndex = 1;
          if (block.type === 'numberedList') {
            for (let i = index - 1; i >= 0; i--) {
              if (blocks[i].type === 'numberedList') {
                listIndex++;
              } else {
                break;
              }
            }
          }
          return <BlockRenderer key={index} block={block} listIndex={listIndex} />;
        })}
      </div>
    );
  }

  // If HTML content is provided, parse and render it
  if (htmlContent) {
    return (
      <div
        className={`prose prose-invert prose-emerald max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  return null;
}

// Markdown Table Renderer Component
function parseMarkdownTable(markdown: string) {
  const lines = (markdown || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") || l.includes("|"));

  if (lines.length === 0) return { headers: [], rows: [] };

  const parsedLines: string[][] = [];

  for (const line of lines) {
    if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line)) {
      continue;
    }
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length > 0 && cells[0] === "") cells.shift();
    if (cells.length > 0 && cells[cells.length - 1] === "") cells.pop();
    if (cells.length > 0) {
      parsedLines.push(cells);
    }
  }

  if (parsedLines.length === 0) return { headers: [], rows: [] };

  const headers = parsedLines[0];
  const rows = parsedLines.slice(1);

  return { headers, rows };
}

export function MarkdownTableRenderer({ content }: { content: string }) {
  const { headers, rows } = parseMarkdownTable(content);

  if (headers.length === 0 && rows.length === 0) {
    return null;
  }

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-lg">
      <table className="w-full border-collapse text-left text-sm text-zinc-300">
        {headers.length > 0 && (
          <thead className="border-b border-zinc-800 bg-zinc-900/80 font-mono text-xs uppercase text-emerald-400">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-3.5 font-semibold tracking-wider">
                  <FormattedText text={header} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-zinc-800/60">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="transition-colors hover:bg-zinc-900/40">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-6 py-4">
                  <FormattedText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Inline Markdown Formatter Component
export function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={index} className="font-bold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
          return (
            <em key={index} className="italic text-zinc-300">
              {part.slice(1, -1)}
            </em>
          );
        }

        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={index}
              className="rounded bg-zinc-900/80 px-1.5 py-0.5 font-mono text-sm text-emerald-400"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a
              key={index}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-4 hover:text-emerald-300 transition-colors"
            >
              {linkMatch[1]}
            </a>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

// Block Renderer Component
function BlockRenderer({ block, listIndex }: { block: ContentBlock; listIndex?: number }) {
  switch (block.type) {
    case "heading1":
      return (
        <h1 className="text-4xl font-bold text-white tracking-tight">
          <FormattedText text={block.content} />
        </h1>
      );

    case "heading2":
      return (
        <h2 className="text-3xl font-bold text-white tracking-tight mt-12 mb-4 flex items-center gap-3">
          <span className="h-8 w-1 bg-emerald-500 rounded-full" />
          <FormattedText text={block.content} />
        </h2>
      );

    case "heading3":
      return (
        <h3 className="text-2xl font-bold text-white tracking-tight mt-8 mb-3">
          <FormattedText text={block.content} />
        </h3>
      );

    case "paragraph":
      return (
        <p className="text-zinc-400 leading-relaxed text-lg">
          <FormattedText text={block.content} />
        </p>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-6 italic text-zinc-400 bg-emerald-500/5 rounded-r">
          <p className="text-lg">
            <FormattedText text={block.content} />
          </p>
        </blockquote>
      );

    case "mermaid":
      return <MermaidDiagram chart={block.content} />;

    case "table":
      return <MarkdownTableRenderer content={block.content} />;

    case "code":
      if (block.metadata?.language?.toLowerCase() === "mermaid") {
        return <MermaidDiagram chart={block.content} />;
      }
      return <CodeBlockComponent block={block} />;

    case "bulletList":
      return (
        <div className="flex items-start gap-3 my-2">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <p className="flex-1 text-zinc-400 leading-relaxed">
            <FormattedText text={block.content} />
          </p>
        </div>
      );

    case "numberedList":
      return (
        <div className="flex items-start gap-3 my-2">
          <span className="mt-0.5 font-mono text-sm text-emerald-500">{listIndex}.</span>
          <p className="flex-1 text-zinc-400 leading-relaxed">
            <FormattedText text={block.content} />
          </p>
        </div>
      );

    case "checklist":
      return (
        <div className="flex items-start gap-3 my-2">
          <input
            type="checkbox"
            checked={block.metadata?.checked || false}
            disabled
            className="mt-1.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500"
          />
          <p
            className={`flex-1 text-zinc-400 leading-relaxed ${
              block.metadata?.checked ? "line-through opacity-50" : ""
            }`}
          >
            <FormattedText text={block.content} />
          </p>
        </div>
      );

    case "image":
      return (
        <figure className="my-8">
          <img
            src={block.metadata?.url || ""}
            alt={block.metadata?.alt || block.content}
            className="w-full rounded-lg border border-zinc-800"
          />
          {block.content && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500">
              <FormattedText text={block.content} />
            </figcaption>
          )}
        </figure>
      );

    default:
      return (
        <p className="text-zinc-400 leading-relaxed">
          <FormattedText text={block.content} />
        </p>
      );
  }
}

function CodeBlockComponent({ block }: { block: ContentBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg border border-zinc-800 overflow-hidden relative group">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-xs text-zinc-600 ml-2">
            {block.metadata?.language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-zinc-500 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <SyntaxHighlighter
        language={block.metadata?.language || "javascript"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          background: "#0a0a0a",
          fontSize: "0.875rem",
        }}
      >
        {block.content}
      </SyntaxHighlighter>
    </div>
  );
}

// Helper function to convert HTML to blocks (for backward compatibility)
export function htmlToBlocks(html: string): ContentBlock[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: ContentBlock[] = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      const content = element.textContent || "";

      switch (tagName) {
        case "h1":
          blocks.push({ type: "heading1", content, id: v4() });
          break;
        case "h2":
          blocks.push({ type: "heading2", content, id: v4() });
          break;
        case "h3":
          blocks.push({ type: "heading3", content, id: v4() });
          break;
        case "p":
          blocks.push({ type: "paragraph", content, id: v4() });
          break;
        case "blockquote":
          blocks.push({ type: "quote", content, id: v4() });
          break;
        case "pre":
          const code = element.querySelector("code");
          blocks.push({
            type: "code",
            content: code?.textContent || content,
            id: v4(),
          });
          break;
        case "ul":
          element.querySelectorAll("li").forEach((li) => {
            blocks.push({
              type: "bulletList",
              content: li.textContent || "",
              id: v4(),
            });
          });
          break;
        case "ol":
          element.querySelectorAll("li").forEach((li) => {
            blocks.push({
              type: "numberedList",
              content: li.textContent || "",
              id: v4(),
            });
          });
          break;
        case "img":
          blocks.push({
            type: "image",
            content: element.getAttribute("alt") || "",
            metadata: {
              url: element.getAttribute("src") || "",
              alt: element.getAttribute("alt") || "",
            },
            id: v4(),
          });
          break;
      }
    }
  });

  return blocks;
}
