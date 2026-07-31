/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BlockType, ContentBlock } from "@/types";
import {
  CheckSquare,
  Code,
  GripVertical,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  Plus,
  Quote,
  Trash2,
  Type,
  Upload,
  Workflow,
  Table,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";
import MermaidDiagram from "@/components/shared/MermaidDiagram";
import { MarkdownTableRenderer } from "@/components/ContentRender";

interface BlockEditorProps {
  initialContent?: ContentBlock[];
  onChange?: (blocks: ContentBlock[]) => void;
  placeholder?: string;
}

/* -------------------------------- Utils -------------------------------- */

function generateId() {
  return v4();
}

function placeCaretAtEnd(el: HTMLElement) {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function placeCaretAtStart(el: HTMLElement) {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(true);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function placeCaretAtOffset(el: HTMLElement, offset: number) {
  el.focus();
  const textNode = el.firstChild;
  if (!textNode) {
    placeCaretAtEnd(el);
    return;
  }
  const range = document.createRange();
  const safeOffset = Math.min(offset, textNode.textContent?.length || 0);
  range.setStart(textNode, safeOffset);
  range.collapse(true);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

/* -------------------------- HTML/Markdown Parser ------------------------- */

function parseHtmlToBlocks(html: string): ContentBlock[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: ContentBlock[] = [];

  const traverse = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      const textContent = element.textContent?.trim() || "";

      if (!textContent && !["img", "hr", "br"].includes(tagName)) {
        Array.from(element.childNodes).forEach(traverse);
        return;
      }

      switch (tagName) {
        case "h1":
          blocks.push({
            id: generateId(),
            type: "heading1",
            content: textContent,
          });
          break;
        case "h2":
          blocks.push({
            id: generateId(),
            type: "heading2",
            content: textContent,
          });
          break;
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          blocks.push({
            id: generateId(),
            type: "heading3",
            content: textContent,
          });
          break;
        case "blockquote":
          blocks.push({
            id: generateId(),
            type: "quote",
            content: textContent,
          });
          break;
        case "pre":
        case "code":
          const codeContent =
            element.querySelector("code")?.textContent || textContent;
          blocks.push({
            id: generateId(),
            type: "code",
            content: codeContent,
            metadata: {
              language:
                element.getAttribute("class")?.replace("language-", "") ||
                "javascript",
            },
          });
          break;
        case "ul":
          element.querySelectorAll("li").forEach((li) => {
            const content = li.textContent?.trim() || "";
            if (content) {
              blocks.push({ id: generateId(), type: "bulletList", content });
            }
          });
          break;
        case "ol":
          element.querySelectorAll("li").forEach((li) => {
            const content = li.textContent?.trim() || "";
            if (content) {
              blocks.push({ id: generateId(), type: "numberedList", content });
            }
          });
          break;
        case "img":
          blocks.push({
            id: generateId(),
            type: "image",
            content: element.getAttribute("alt") || "",
            metadata: {
              url: element.getAttribute("src") || "",
              alt: element.getAttribute("alt") || "",
            },
          });
          break;
        case "table":
          const tableRows: string[] = [];
          element.querySelectorAll("tr").forEach((tr) => {
            const cells: string[] = [];
            tr.querySelectorAll("th, td").forEach((cell) => {
              cells.push(cell.textContent?.trim() || "");
            });
            if (cells.length > 0) {
              tableRows.push(`| ${cells.join(" | ")} |`);
            }
          });
          if (tableRows.length > 0) {
            if (tableRows.length > 1) {
              const colCount = Math.max(
                ...tableRows.map((r) => r.split("|").length - 2)
              );
              const sep = `| ${Array(Math.max(1, colCount)).fill("---").join(" | ")} |`;
              tableRows.splice(1, 0, sep);
            }
            blocks.push({
              id: generateId(),
              type: "table",
              content: tableRows.join("\n"),
            });
          }
          break;
        case "p":
          if (textContent) {
            blocks.push({
              id: generateId(),
              type: "paragraph",
              content: textContent,
            });
          }
          break;
        case "div":
        case "article":
        case "section":
          Array.from(element.childNodes).forEach(traverse);
          break;
        default:
          if (textContent && !element.closest("ul, ol, pre, code")) {
            blocks.push({
              id: generateId(),
              type: "paragraph",
              content: textContent,
            });
          }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({ id: generateId(), type: "paragraph", content: text });
      }
    }
  };

  Array.from(doc.body.childNodes).forEach(traverse);

  if (blocks.length === 0) {
    blocks.push({ id: generateId(), type: "paragraph", content: "" });
  }

  return blocks;
}

function parseMarkdownToBlocks(markdown: string): ContentBlock[] {
  const lines = markdown.split("\n");
  const blocks: ContentBlock[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || "javascript";
        codeContent = "";
      } else {
        const isMermaid = codeLanguage.toLowerCase() === "mermaid";
        blocks.push({
          id: generateId(),
          type: isMermaid ? "mermaid" : "code",
          content: codeContent.trim(),
          metadata: { language: codeLanguage },
        });
        inCodeBlock = false;
        codeContent = "";
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    if (!line.trim()) continue;

    if (
      line.trim().startsWith("|") ||
      (line.trim().endsWith("|") && line.includes("|"))
    ) {
      let tableContent = line;
      while (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (
          nextLine.startsWith("|") ||
          (nextLine.endsWith("|") && nextLine.includes("|"))
        ) {
          tableContent += "\n" + lines[i + 1];
          i++;
        } else {
          break;
        }
      }
      blocks.push({
        id: generateId(),
        type: "table",
        content: tableContent,
      });
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({
        id: generateId(),
        type: "heading1",
        content: line.slice(2),
      });
    } else if (line.startsWith("## ")) {
      blocks.push({
        id: generateId(),
        type: "heading2",
        content: line.slice(3),
      });
    } else if (line.startsWith("### ")) {
      blocks.push({
        id: generateId(),
        type: "heading3",
        content: line.slice(4),
      });
    } else if (line.startsWith("> ")) {
      blocks.push({ id: generateId(), type: "quote", content: line.slice(2) });
    } else if (line.match(/^[\*\-\+]\s/)) {
      blocks.push({
        id: generateId(),
        type: "bulletList",
        content: line.slice(2),
      });
    } else if (line.match(/^\d+\.\s/)) {
      blocks.push({
        id: generateId(),
        type: "numberedList",
        content: line.replace(/^\d+\.\s/, ""),
      });
    } else if (line.match(/^[\*\-]\s\[[ x]\]\s/)) {
      const checked = line.includes("[x]");
      const content = line.replace(/^[\*\-]\s\[[ x]\]\s/, "");
      blocks.push({
        id: generateId(),
        type: "checklist",
        content,
        metadata: { checked },
      });
    } else if (line.match(/!\[.*?\]\(.*?\)/)) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        blocks.push({
          id: generateId(),
          type: "image",
          content: match[1],
          metadata: { url: match[2], alt: match[1] },
        });
      }
    } else {
      blocks.push({
        id: generateId(),
        type: "paragraph",
        content: line.trim(),
      });
    }
  }

  return blocks.length > 0
    ? blocks
    : [{ id: generateId(), type: "paragraph", content: "" }];
}

/* ------------------------------ Main Editor ------------------------------ */

export default function BlockEditor({
  initialContent = [],
  onChange,
  placeholder = "Start typing or press '/' for commands...",
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (initialContent.length > 0) return initialContent;
    return [{ id: generateId(), type: "paragraph", content: "" }];
  });

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // --- Multi-select state ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const lastClickedIdRef = useRef<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Ref to always have the latest blocks in callbacks without re-creating them
  const blocksRef = useRef(blocks);
  // eslint-disable-next-line react-hooks/refs
  blocksRef.current = blocks;

  useEffect(() => {
    onChange?.(blocks);
  }, [blocks]);

  /* ----------------------------- Selection Ops ----------------------------- */

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectBlock = useCallback(
    (blockId: string, e?: React.MouseEvent) => {
      if (e?.shiftKey && lastClickedIdRef.current) {
        // Range select
        const currentBlocks = blocksRef.current;
        const startIdx = currentBlocks.findIndex(
          (b) => b.id === lastClickedIdRef.current
        );
        const endIdx = currentBlocks.findIndex((b) => b.id === blockId);
        if (startIdx !== -1 && endIdx !== -1) {
          const lo = Math.min(startIdx, endIdx);
          const hi = Math.max(startIdx, endIdx);
          const rangeIds = new Set(
            currentBlocks.slice(lo, hi + 1).map((b) => b.id)
          );
          setSelectedIds(rangeIds);
        }
      } else {
        setSelectedIds(new Set());
        lastClickedIdRef.current = blockId;
      }
    },
    []
  );

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(blocksRef.current.map((b) => b.id)));
  }, []);

  /* ------------------------------ Block Ops ------------------------------ */

  const addBlock = useCallback(
    (
      afterId: string,
      type: BlockType = "paragraph",
      content: string = ""
    ) => {
      const newBlock: ContentBlock = {
        id: generateId(),
        type,
        content,
      };

      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === afterId);
        const newBlocks = [...prev];
        newBlocks.splice(index + 1, 0, newBlock);
        return newBlocks;
      });
      setShowMenu(false);
      clearSelection();

      setTimeout(() => {
        const el = document.getElementById(`block-${newBlock.id}`);
        if (el) placeCaretAtEnd(el);
      }, 50);

      return newBlock.id;
    },
    [clearSelection]
  );

  const updateBlock = useCallback(
    (id: string, updates: Partial<ContentBlock>) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      );
    },
    []
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        if (prev.length === 1) {
          return [{ id: generateId(), type: "paragraph", content: "" }];
        }

        const index = prev.findIndex((b) => b.id === id);
        const newBlocks = prev.filter((b) => b.id !== id);

        setTimeout(() => {
          if (index > 0) {
            const prevBlock = newBlocks[index - 1];
            const el = document.getElementById(`block-${prevBlock.id}`);
            if (el) placeCaretAtEnd(el);
          } else if (newBlocks.length > 0) {
            const el = document.getElementById(`block-${newBlocks[0].id}`);
            if (el) placeCaretAtStart(el);
          }
        }, 50);

        return newBlocks;
      });
      clearSelection();
    },
    [clearSelection]
  );

  const deleteSelectedBlocks = useCallback(() => {
    if (selectedIds.size === 0) return;

    setBlocks((prev) => {
      const remaining = prev.filter((b) => !selectedIds.has(b.id));
      if (remaining.length === 0) {
        return [{ id: generateId(), type: "paragraph", content: "" }];
      }
      setTimeout(() => {
        const el = document.getElementById(`block-${remaining[0].id}`);
        if (el) placeCaretAtStart(el);
      }, 50);
      return remaining;
    });
    setSelectedIds(new Set());
  }, [selectedIds]);

  /* ---------------------------- Paste Handling ---------------------------- */

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, blockId: string) => {
      e.preventDefault();

      const html = e.clipboardData.getData("text/html");
      const text = e.clipboardData.getData("text/plain");

      if (html && html.trim()) {
        const newBlocks = parseHtmlToBlocks(html);
        setBlocks((prev) => {
          const index = prev.findIndex((b) => b.id === blockId);
          const before = prev.slice(0, index);
          const after = prev.slice(index + 1);
          return [...before, ...newBlocks, ...after];
        });

        setTimeout(() => {
          if (newBlocks.length > 0) {
            const el = document.getElementById(`block-${newBlocks[0].id}`);
            if (el) placeCaretAtEnd(el);
          }
        }, 50);
      } else if (
        text.includes("#") ||
        text.includes("```") ||
        text.includes("- ") ||
        text.includes("* ")
      ) {
        const newBlocks = parseMarkdownToBlocks(text);
        setBlocks((prev) => {
          const index = prev.findIndex((b) => b.id === blockId);
          const before = prev.slice(0, index);
          const after = prev.slice(index + 1);
          return [...before, ...newBlocks, ...after];
        });

        setTimeout(() => {
          if (newBlocks.length > 0) {
            const el = document.getElementById(`block-${newBlocks[0].id}`);
            if (el) placeCaretAtEnd(el);
          }
        }, 50);
      } else {
        // Plain text — insert at cursor using execCommand for natural cursor behavior
        document.execCommand("insertText", false, text);
      }
    },
    []
  );

  /* ---------------------------- Keyboard Logic ---------------------------- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, block: ContentBlock, index: number) => {
      // ESC — close menu & clear selection
      if (e.key === "Escape") {
        setShowMenu(false);
        clearSelection();
        return;
      }

      // Ctrl/Cmd + A — select all blocks
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        selectAll();
        return;
      }

      // Delete/Backspace with multi-selection
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        selectedIds.size > 1
      ) {
        e.preventDefault();
        deleteSelectedBlocks();
        return;
      }

      const el = document.getElementById(`block-${block.id}`);
      const currentContent = el?.textContent || "";

      // Slash command
      if (e.key === "/" && currentContent === "") {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setMenuPos({ x: rect.left, y: rect.bottom });
        setFocusedId(block.id);
        setShowMenu(true);
        return;
      }

      // Enter — create new paragraph or split
      if (e.key === "Enter" && !e.shiftKey) {
        if (block.type === "code") return;
        e.preventDefault();

        const content = el?.textContent || "";

        if (
          (block.type === "bulletList" ||
            block.type === "numberedList" ||
            block.type === "checklist") &&
          content === ""
        ) {
          updateBlock(block.id, { type: "paragraph", content: "" });
          return;
        }

        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        let beforeCursor = content;
        let afterCursor = "";

        if (range && el) {
          const preRange = document.createRange();
          preRange.selectNodeContents(el);
          preRange.setEnd(range.startContainer, range.startOffset);
          const cursorPosition = preRange.toString().length;
          beforeCursor = content.slice(0, cursorPosition);
          afterCursor = content.slice(cursorPosition);
        }

        updateBlock(block.id, { content: beforeCursor });
        if (el) el.textContent = beforeCursor;

        const newType =
          block.type === "bulletList" ||
          block.type === "numberedList" ||
          block.type === "checklist"
            ? block.type
            : "paragraph";

        addBlock(block.id, newType, afterCursor);
        return;
      }

      // Backspace at start of block
      if (e.key === "Backspace") {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range && el) {
          const preRange = document.createRange();
          preRange.selectNodeContents(el);
          preRange.setEnd(range.startContainer, range.startOffset);
          const cursorAtStart = preRange.toString().length === 0;
          const isCollapsed = range.collapsed;

          if (cursorAtStart && isCollapsed) {
            e.preventDefault();
            const content = el.textContent || "";

            if (content === "") {
              const currentBlocks = blocksRef.current;
              if (currentBlocks.length > 1) {
                deleteBlock(block.id);
              } else if (block.type !== "paragraph") {
                updateBlock(block.id, { type: "paragraph" });
              }
            } else if (index > 0) {
              const currentBlocks = blocksRef.current;
              const prevBlock = currentBlocks[index - 1];
              const prevEl = document.getElementById(
                `block-${prevBlock.id}`
              );
              const prevContent = prevEl?.textContent || prevBlock.content;
              const mergeOffset = prevContent.length;
              const newContent = prevContent + content;

              updateBlock(prevBlock.id, { content: newContent });
              setBlocks((prev) => prev.filter((b) => b.id !== block.id));

              setTimeout(() => {
                const targetEl = document.getElementById(
                  `block-${prevBlock.id}`
                );
                if (targetEl) {
                  targetEl.textContent = newContent;
                  placeCaretAtOffset(targetEl, mergeOffset);
                }
              }, 50);
            }
            return;
          }
        }
      }

      // Arrow Up
      if (e.key === "ArrowUp" && index > 0) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        if (range && el) {
          const preRange = document.createRange();
          preRange.selectNodeContents(el);
          preRange.setEnd(range.startContainer, range.startOffset);
          if (preRange.toString().length === 0) {
            e.preventDefault();
            const currentBlocks = blocksRef.current;
            const prevEl = document.getElementById(
              `block-${currentBlocks[index - 1].id}`
            );
            if (prevEl) placeCaretAtEnd(prevEl);
          }
        }
      }

      // Arrow Down
      if (e.key === "ArrowDown") {
        const currentBlocks = blocksRef.current;
        if (index < currentBlocks.length - 1) {
          const selection = window.getSelection();
          const range = selection?.getRangeAt(0);
          if (range && el) {
            const postRange = document.createRange();
            postRange.selectNodeContents(el);
            postRange.setStart(range.endContainer, range.endOffset);
            if (postRange.toString().length === 0) {
              e.preventDefault();
              const nextEl = document.getElementById(
                `block-${currentBlocks[index + 1].id}`
              );
              if (nextEl) placeCaretAtStart(nextEl);
            }
          }
        }
      }
    },
    [
      selectedIds,
      deleteSelectedBlocks,
      selectAll,
      clearSelection,
      updateBlock,
      addBlock,
      deleteBlock,
    ]
  );

  /* ------------------------------ Block Menu ------------------------------ */

  const blockTypes = [
    { type: "paragraph" as BlockType, label: "Text", icon: Type },
    { type: "heading1" as BlockType, label: "Heading 1", icon: Heading1 },
    { type: "heading2" as BlockType, label: "Heading 2", icon: Heading2 },
    { type: "heading3" as BlockType, label: "Heading 3", icon: Heading3 },
    { type: "bulletList" as BlockType, label: "Bullet List", icon: List },
    {
      type: "numberedList" as BlockType,
      label: "Numbered List",
      icon: ListOrdered,
    },
    { type: "quote" as BlockType, label: "Quote", icon: Quote },
    { type: "code" as BlockType, label: "Code", icon: Code },
    { type: "mermaid" as BlockType, label: "Mermaid Flowchart", icon: Workflow },
    { type: "table" as BlockType, label: "Table", icon: Table },
    { type: "image" as BlockType, label: "Image", icon: ImageIcon },
    { type: "checklist" as BlockType, label: "Checklist", icon: CheckSquare },
  ];

  /* ------------------------------- Drag & Drop ------------------------------ */

  const handleDragStart = (blockId: string) => {
    setDraggedId(blockId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = blocks.findIndex((b) => b.id === draggedId);
    const targetIndex = blocks.findIndex((b) => b.id === targetId);

    if (draggedIndex === targetIndex) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);
    setBlocks(newBlocks);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  /* ------------------------------- Rendering ------------------------------ */

  return (
    <div ref={editorRef} className="relative min-h-[400px] rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      {/* Editor Header */}
      <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-zinc-600">content-editor.tsx</span>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 1 && (
            <button
              onClick={deleteSelectedBlocks}
              className="flex items-center gap-1.5 rounded bg-red-500/10 px-2.5 py-1 font-mono text-xs text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
            >
              <Trash2 className="h-3 w-3" />
              Delete {selectedIds.size} blocks
            </button>
          )}
          {selectedIds.size > 1 && (
            <button
              onClick={clearSelection}
              className="rounded bg-zinc-800 px-2.5 py-1 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
            >
              Clear selection
            </button>
          )}
          <span className="font-mono text-xs text-zinc-600">
            {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
          </span>
          <span className="rounded bg-emerald-500/10 px-2 py-1 font-mono text-xs text-emerald-500">
            Paste support: HTML/MD
          </span>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-2">
        {blocks.map((block, index) => {
          let listIndex = 1;
          if (block.type === "numberedList") {
            for (let i = index - 1; i >= 0; i--) {
              if (blocks[i].type === "numberedList") {
                listIndex++;
              } else {
                break;
              }
            }
          }
          const isSelected = selectedIds.has(block.id);
          return (
            <div
              key={block.id}
              className={`group relative flex items-start gap-2 rounded-lg px-2 py-1 transition-colors ${
                draggedId === block.id ? "opacity-50" : ""
              } ${
                isSelected
                  ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "hover:bg-zinc-800/30"
              }`}
              draggable
              onDragStart={() => handleDragStart(block.id)}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDragEnd={handleDragEnd}
              onClick={(e) => {
                if (e.shiftKey) {
                  e.preventDefault();
                  selectBlock(block.id, e);
                }
              }}
            >
              {/* Left Controls — inside the layout flow */}
              <div className="flex shrink-0 items-center gap-0.5 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  className="cursor-grab rounded p-0.5 hover:bg-zinc-700 active:cursor-grabbing"
                  title="Drag to reorder"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4 text-zinc-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const el = document.getElementById(`block-${block.id}`);
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    setMenuPos({ x: rect.left, y: rect.bottom });
                    setFocusedId(block.id);
                    setShowMenu(true);
                  }}
                  className="rounded p-0.5 hover:bg-zinc-700"
                  title="Add block"
                >
                  <Plus className="h-4 w-4 text-zinc-600" />
                </button>
              </div>

              {/* Block Content */}
              <div className="min-w-0 flex-1">
                <BlockContent
                  block={block}
                  index={index}
                  listIndex={listIndex}
                  placeholder={index === 0 ? placeholder : ""}
                  onFocus={() => {
                    setFocusedId(block.id);
                    if (selectedIds.size > 0) {
                      clearSelection();
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, block, index)}
                  onPaste={(e) => handlePaste(e, block.id)}
                  onUpdate={(updates) => updateBlock(block.id, updates)}
                />
              </div>

              {/* Delete Button — inside the layout flow */}
              <div className="flex shrink-0 items-center pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="rounded p-0.5 hover:bg-zinc-700"
                  title="Delete block"
                >
                  <Trash2 className="h-4 w-4 text-zinc-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slash Menu */}
      {showMenu && focusedId && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="fixed z-50 w-64 rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl"
            style={{ left: menuPos.x, top: menuPos.y + 8 }}
          >
            <div className="p-2">
              <div className="mb-2 px-2 py-1 font-mono text-xs uppercase text-zinc-500">
                BLOCKS
              </div>
              <div className="space-y-1">
                {blockTypes.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => {
                      const currentBlock = blocks.find(
                        (b) => b.id === focusedId
                      );
                      if (currentBlock?.content === "") {
                        updateBlock(focusedId, { type: option.type });
                      } else {
                        addBlock(focusedId, option.type);
                      }
                      setShowMenu(false);
                      setTimeout(() => {
                        const el = document.getElementById(
                          `block-${focusedId}`
                        );
                        if (el) placeCaretAtEnd(el);
                      }, 50);
                    }}
                    className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                  >
                    <option.icon className="h-4 w-4 text-emerald-500" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ====================== Ref-based BlockContent Component ====================== */

/**
 * Key fix: We use a ref to manage the contentEditable text content.
 * React never re-renders the text children — the DOM handles it natively.
 * We only imperatively set textContent when the value changes *externally*
 * (e.g. from paste, type change, or merge), not during normal typing.
 */
const BlockContent = React.memo(function BlockContent({
  block,
  index,
  listIndex,
  placeholder,
  onUpdate,
  onKeyDown,
  onPaste,
  onFocus,
}: {
  block: ContentBlock;
  index: number;
  listIndex?: number;
  placeholder?: string;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onFocus: () => void;
}) {
  const elRef = useRef<HTMLElement | null>(null);
  // Track the last content we synced to the DOM so we don't fight user typing
  const lastSyncedContent = useRef<string>(block.content);

  // Sync content from React state -> DOM only when it changes externally
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    // Only update DOM if the block.content changed from outside (not from typing)
    if (block.content !== lastSyncedContent.current) {
      const isFocused = document.activeElement === el;
      el.textContent = block.content;
      lastSyncedContent.current = block.content;
      if (isFocused) {
        placeCaretAtEnd(el);
      }
    }
  }, [block.content]);

  // On mount, set initial content
  useEffect(() => {
    const el = elRef.current;
    if (el && block.content && el.textContent !== block.content) {
      el.textContent = block.content;
      lastSyncedContent.current = block.content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    const content = el.textContent || "";
    lastSyncedContent.current = content;
    onUpdate({ content });
    // No cursor restoration needed — the DOM keeps the caret naturally
  }, [onUpdate]);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      elRef.current = node;
      if (node) {
        if (block.content && node.textContent !== block.content) {
          node.textContent = block.content;
          lastSyncedContent.current = block.content;
        }
      }
    },
    // Only re-run when block.id changes (new block), not on content change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [block.id]
  );

  const commonProps = {
    id: `block-${block.id}`,
    ref: setRef as any,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onInput: handleInput,
    onKeyDown,
    onPaste,
    onFocus,
    "data-placeholder": placeholder,
  };

  const baseClass =
    "w-full outline-none bg-transparent text-zinc-300 empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-600";

  switch (block.type) {
    case "heading1":
      return (
        <h1
          {...commonProps}
          className={`${baseClass} text-4xl font-bold text-white`}
        />
      );

    case "heading2":
      return (
        <h2
          {...commonProps}
          className={`${baseClass} text-3xl font-bold text-white`}
        />
      );

    case "heading3":
      return (
        <h3
          {...commonProps}
          className={`${baseClass} text-2xl font-bold text-white`}
        />
      );

    case "quote":
      return (
        <blockquote
          {...commonProps}
          className={`${baseClass} border-l-4 border-emerald-500 pl-4 italic text-zinc-400`}
        />
      );

    case "code":
      return (
        <pre
          {...commonProps}
          className="min-h-[60px] rounded-lg bg-zinc-950 p-4 font-mono text-sm text-emerald-400 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-600 whitespace-pre-wrap"
        />
      );

    case "bulletList":
      return (
        <div className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <div
            {...commonProps}
            className={`${baseClass} min-h-[1.5rem] flex-1`}
          />
        </div>
      );

    case "numberedList":
      return (
        <div className="flex items-start gap-3">
          <span className="font-mono text-sm text-emerald-500">
            {listIndex}.
          </span>
          <div
            {...commonProps}
            className={`${baseClass} min-h-[1.5rem] flex-1`}
          />
        </div>
      );

    case "checklist":
      return (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={block.metadata?.checked || false}
            onChange={(e) =>
              onUpdate({
                metadata: { ...block.metadata, checked: e.target.checked },
              })
            }
            className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
          />
          <div
            {...commonProps}
            className={`${baseClass} min-h-[1.5rem] flex-1 ${
              block.metadata?.checked ? "line-through opacity-50" : ""
            }`}
          />
        </div>
      );

    case "image":
      return (
        <ImageBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
      );

    case "mermaid":
      return (
        <MermaidBlockComponent
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
      );

    case "table":
      return (
        <TableBlockComponent
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
      );

    default:
      return (
        <p
          {...commonProps}
          className={`${baseClass} min-h-[1.5rem]`}
        />
      );
  }
});

/* ------------------------------ Image Block ----------------------------- */

function ImageBlock({
  block,
  onUpdate,
  onFocus,
  onKeyDown,
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    onUpdate({
      metadata: { ...block.metadata, url: localUrl },
      content: file.name,
    });

    // TODO: Upload to your server/cloud storage here
    // const uploadedUrl = await uploadImage(file);
    // onUpdate({ metadata: { ...block.metadata, url: uploadedUrl } });
  };

  return (
    <div className="space-y-2" onFocus={onFocus}>
      {!block.metadata?.url ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={block.metadata?.url || ""}
            onChange={(e) =>
              onUpdate({
                metadata: { ...block.metadata, url: e.target.value },
              })
            }
            onKeyDown={onKeyDown}
            placeholder="Paste image URL or click upload..."
            className="flex-1 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="group relative">
          <img
            src={block.metadata.url}
            alt={block.content || ""}
            className="w-full rounded-lg border border-zinc-800"
          />
          <input
            type="text"
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onKeyDown={onKeyDown}
            placeholder="Add caption..."
            className="mt-2 w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={() => onUpdate({ metadata: { url: "" }, content: "" })}
            className="absolute right-2 top-2 rounded bg-zinc-900/90 p-2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Mermaid Block ----------------------------- */

function MermaidBlockComponent({
  block,
  onUpdate,
  onFocus,
  onKeyDown,
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const [showCode, setShowCode] = useState<boolean>(true);
  const defaultSyntax = `flowchart TD\n  A[Start] --> B[Process]\n  B --> C[Done]`;

  const content =
    block.content !== undefined && block.content !== ""
      ? block.content
      : defaultSyntax;

  useEffect(() => {
    if (!block.content) {
      onUpdate({ content: defaultSyntax });
    }
  }, []);

  return (
    <div
      className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
      onFocus={onFocus}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <Workflow className="h-4 w-4" />
          <span>Mermaid Flowchart Block</span>
        </div>
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="rounded bg-zinc-800 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          {showCode ? "Hide Code Editor" : "Edit Code"}
        </button>
      </div>

      {showCode && (
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onKeyDown={onKeyDown}
          placeholder="Enter Mermaid diagram code (e.g. flowchart TD...)"
          className="min-h-[120px] w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none"
        />
      )}

      <MermaidDiagram chart={content} showControls={false} />
    </div>
  );
}

/* ------------------------------ Table Block ----------------------------- */

function TableBlockComponent({
  block,
  onUpdate,
  onFocus,
  onKeyDown,
}: {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const [showCode, setShowCode] = useState<boolean>(true);
  const defaultSyntax = `| Feature | Traditional DAGs | Workflow Engine |\n| --- | --- | --- |\n| Task Definition | Verbose Python | Flowchart Nodes |\n| Execution | Monolithic Worker | Distributed Async |`;

  const content =
    block.content !== undefined && block.content !== ""
      ? block.content
      : defaultSyntax;

  useEffect(() => {
    if (!block.content) {
      onUpdate({ content: defaultSyntax });
    }
  }, []);

  return (
    <div
      className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
      onFocus={onFocus}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <Table className="h-4 w-4" />
          <span>Markdown Table Block</span>
        </div>
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="rounded bg-zinc-800 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          {showCode ? "Hide Table Text" : "Edit Table Text"}
        </button>
      </div>

      {showCode && (
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onKeyDown={onKeyDown}
          placeholder="Enter Markdown Table (e.g. | Col 1 | Col 2 |\n| --- | --- |...)"
          className="min-h-[120px] w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none"
        />
      )}

      <MarkdownTableRenderer content={content} />
    </div>
  );
}
