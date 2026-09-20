"use client";

import React from "react";
import {
  Keyboard,
  X,
  Command,
  Layout,
  Gamepad2,
  Terminal,
  Sparkles,
  Layers,
} from "lucide-react";
import { useOSStore } from "@/lib/os-store";
import { getThemeConfig } from "@/lib/theme";
import { playUiClick } from "@/lib/audio";

interface ShortcutGroup {
  title: string;
  icon: React.ElementType;
  shortcuts: { keys: string[]; description: string }[];
}

export default function OSKeyboardShortcutsModal() {
  const { theme, isShortcutsOpen, closeShortcuts } = useOSStore();
  const themeConfig = getThemeConfig(theme);

  if (!isShortcutsOpen) return null;

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: "Global & System Navigation",
      icon: Command,
      shortcuts: [
        { keys: ["Ctrl", "K"], description: "Open Global Spotlight Search" },
        { keys: ["/"], description: "Quick Search (when not in input)" },
        { keys: ["Win", "Ctrl+Esc"], description: "Toggle NexOS Start Menu" },
        { keys: ["?"], description: "Open Keyboard Instructions Cheatsheet" },
        { keys: ["Ctrl", "B"], description: "Launch NexNet Web Browser" },
        { keys: ["Ctrl", "G"], description: "Launch CyberRunner 3D Minigame" },
        { keys: ["Ctrl", "`"], description: "Open NexOS CLI Terminal" },
        { keys: ["Ctrl", ","], description: "Open System Preferences" },
      ],
    },
    {
      title: "Window Management",
      icon: Layout,
      shortcuts: [
        { keys: ["Alt", "Tab"], description: "Cycle forward to next window" },
        { keys: ["Alt", "Shift", "Tab"], description: "Cycle backward to previous window" },
        { keys: ["Alt", "W"], description: "Close currently focused window" },
        { keys: ["Alt", "M"], description: "Minimize currently focused window" },
        { keys: ["Alt", "Enter"], description: "Toggle maximize / restore window" },
        { keys: ["Escape"], description: "Dismiss menu, modal, or close dialog" },
      ],
    },
    {
      title: "CyberRunner 3D Flight Controls",
      icon: Gamepad2,
      shortcuts: [
        { keys: ["A", "D"], description: "Steer craft Left / Right" },
        { keys: ["←", "→"], description: "Alternative Left / Right steering" },
        { keys: ["Spacebar"], description: "Activate Hyper Thruster Boost" },
        { keys: ["W", "↑"], description: "Alternative Thruster Boost" },
        { keys: ["P"], description: "Pause / Resume flight simulation" },
      ],
    },
    {
      title: "CLI Terminal Commands",
      icon: Terminal,
      shortcuts: [
        { keys: ["help"], description: "List all terminal commands" },
        { keys: ["ls"], description: "List filesystem directories & apps" },
        { keys: ["whoami"], description: "Show engineer profile & bio" },
        { keys: ["game"], description: "Launch CyberRunner 3D simulation" },
        { keys: ["cat", "resume"], description: "Open resume / document viewer" },
        { keys: ["theme", "cyan"], description: "Change theme (emerald|cyan|amber|purple)" },
        { keys: ["clear"], description: "Clear the terminal console buffer" },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md font-mono select-none animate-in fade-in duration-150"
      onClick={closeShortcuts}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${themeConfig.bgSubtle} border ${themeConfig.borderSubtle} ${themeConfig.text}`}
            >
              <Keyboard size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Keyboard Instructions &amp; Shortcuts</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${themeConfig.bgSubtle} ${themeConfig.text} font-bold`}>
                  NEXOS_HOTKEYS
                </span>
              </h2>
              <p className="text-[11px] text-zinc-500">
                Master complete keyboard-driven navigation across the workstation
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playUiClick();
              closeShortcuts();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close (ESC)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Shortcuts Groups Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          {shortcutGroups.map((group) => {
            const GroupIcon = group.icon;

            return (
              <div key={group.title} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-zinc-800/60">
                  <GroupIcon size={14} className={themeConfig.text} />
                  <span>{group.title}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.shortcuts.map((sc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-xs"
                    >
                      <span className="text-zinc-400 text-[11px]">{sc.description}</span>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {sc.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[10px] font-bold text-zinc-200 shadow-sm"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/80 bg-zinc-950 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className={themeConfig.text} />
            <span>Press <kbd className="px-1.5 py-0.2 rounded border border-zinc-700 bg-zinc-900 text-zinc-300">?</kbd> anywhere to toggle this guide</span>
          </div>

          <button
            onClick={() => {
              playUiClick();
              closeShortcuts();
            }}
            className={`px-3 py-1 rounded text-xs font-bold ${themeConfig.bg} text-black cursor-pointer hover:opacity-90`}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
