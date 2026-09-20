"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOSStore, OSTheme } from "@/lib/os-store";

interface CommandLog {
  command?: string;
  output: React.ReactNode;
  type?: "input" | "system" | "error" | "success";
}

export default function OSTerminal() {
  const { openWindow, setTheme, theme } = useOSStore();
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      type: "system",
      output: (
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400 font-bold">
            NexOS v1.0.0 (x86_64-pc-linux-gnu) — Interactive Shell
          </p>
          <p className="text-zinc-500">
            Type <span className="text-yellow-400">help</span> to list available commands.
          </p>
        </div>
      ),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLogs: CommandLog[] = [...logs, { command: cmd, output: null, type: "input" }];
    const parts = cmd.toLowerCase().split(" ");
    const mainCmd = parts[0];
    const arg = parts[1];

    switch (mainCmd) {
      case "help":
        newLogs.push({
          type: "system",
          output: (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-1">
              <div><span className="text-emerald-400 font-bold">whoami</span> - Display engineer profile</div>
              <div><span className="text-emerald-400 font-bold">ls</span> - List files and directories</div>
              <div><span className="text-emerald-400 font-bold">cat [file]</span> - Display file contents</div>
              <div><span className="text-emerald-400 font-bold">open [window]</span> - Open folder/app window</div>
              <div><span className="text-emerald-400 font-bold">sysinfo</span> - View system specifications</div>
              <div><span className="text-emerald-400 font-bold">resume</span> - Download PDF Resume / CV</div>
              <div><span className="text-emerald-400 font-bold">theme [color]</span> - Change OS accent (emerald|cyan|amber|purple)</div>
              <div><span className="text-emerald-400 font-bold">game</span> - Launch CyberRunner 3D minigame</div>
              <div><span className="text-emerald-400 font-bold">clear</span> - Clear terminal screen</div>
              <div><span className="text-emerald-400 font-bold">contact</span> - Open contact mailer</div>
            </div>
          ),
        });
        break;

      case "whoami":
        newLogs.push({
          type: "system",
          output: (
            <div className="space-y-1 text-xs text-zinc-300 py-1 border-l-2 border-emerald-500 pl-3">
              <p className="font-bold text-white">Borhan Uddin</p>
              <p className="text-emerald-400">Backend-Focused Full-Stack Engineer // 5+ Years Exp</p>
              <p className="text-zinc-400">Location: Khulna, Bangladesh</p>
              <p className="text-zinc-400">Specialization: High-concurrency APIs, Next.js, FastAPIs, Redis, PostgreSQL, AI Agents</p>
            </div>
          ),
        });
        break;

      case "ls":
        newLogs.push({
          type: "system",
          output: (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-1">
              <div className="text-blue-400 font-bold">📁 about.sys</div>
              <div className="text-blue-400 font-bold">📁 projects/</div>
              <div className="text-blue-400 font-bold">📁 experience/</div>
              <div className="text-emerald-400 font-bold">📄 skills.spec</div>
              <div className="text-blue-400 font-bold">📁 blog_posts/</div>
              <div className="text-purple-400 font-bold">📄 resume.pdf</div>
              <div className="text-yellow-400 font-bold">⚡ contact.sh</div>
              <div className="text-pink-400 font-bold">🎮 CyberRunner.exe</div>
            </div>
          ),
        });
        break;

      case "cat":
        if (arg === "about.sys" || arg === "about") {
          openWindow("about");
          newLogs.push({
            type: "success",
            output: <span className="text-emerald-400">Opened About Me profile window.</span>,
          });
        } else if (arg === "skills.spec" || arg === "skills") {
          openWindow("skills");
          newLogs.push({
            type: "success",
            output: <span className="text-emerald-400">Opened Skills specification window.</span>,
          });
        } else if (arg === "resume.pdf" || arg === "resume") {
          openWindow("resume");
          newLogs.push({
            type: "success",
            output: <span className="text-emerald-400">Opened Resume &amp; CV viewer window.</span>,
          });
        } else {
          newLogs.push({
            type: "error",
            output: <span className="text-red-400">cat: file &apos;{arg || ""}&apos; not found. Try &apos;ls&apos;.</span>,
          });
        }
        break;

      case "open":
      case "resume":
        if (["about", "projects", "experience", "skills", "blog", "contact", "settings", "resume"].includes(arg) || mainCmd === "resume") {
          const targetWin = mainCmd === "resume" ? "resume" : arg;
          openWindow(targetWin);
          newLogs.push({
            type: "success",
            output: <span className="text-emerald-400">Launching window &apos;{targetWin}&apos;...</span>,
          });
        } else {
          newLogs.push({
            type: "error",
            output: (
              <span className="text-red-400">
                Unknown window &apos;{arg}&apos;. Available: about, projects, experience, skills, blog, resume, contact, settings
              </span>
            ),
          });
        }
        break;

      case "sysinfo":
        newLogs.push({
          type: "system",
          output: (
            <div className="font-mono text-xs space-y-1 text-zinc-300 py-1 bg-zinc-900/50 p-3 rounded border border-zinc-800">
              <p><span className="text-zinc-500">OS Kernel:</span> NexOS 1.0.0-release</p>
              <p><span className="text-zinc-500">Uptime:</span> 99.98% High Availability</p>
              <p><span className="text-zinc-500">Node Engine:</span> v20+ / Next.js 16 App Router</p>
              <p><span className="text-zinc-500">Database:</span> PostgreSQL + Redis Deduplication</p>
              <p><span className="text-zinc-500">Status:</span> <span className="text-emerald-400">ONLINE</span></p>
            </div>
          ),
        });
        break;

      case "theme":
        if (["emerald", "cyan", "amber", "purple"].includes(arg)) {
          setTheme(arg as OSTheme);
          newLogs.push({
            type: "success",
            output: <span className="text-emerald-400">Applied OS theme accent: {arg}</span>,
          });
        } else {
          newLogs.push({
            type: "error",
            output: <span className="text-red-400">Invalid theme. Choose: emerald, cyan, amber, purple</span>,
          });
        }
        break;

      case "contact":
        openWindow("contact");
        newLogs.push({
          type: "success",
          output: <span className="text-emerald-400">Opened Contact mailer form.</span>,
        });
        break;

      case "game":
      case "cyberrunner":
        openWindow("game");
        newLogs.push({
          type: "success",
          output: <span className="text-emerald-400">Booting CyberRunner 3D WebGL Flight Simulation...</span>,
        });
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      default:
        newLogs.push({
          type: "error",
          output: (
            <span className="text-red-400">
              Command not found: &apos;{cmd}&apos;. Type &apos;help&apos; for assistance.
            </span>
          ),
        });
        break;
    }

    setLogs(newLogs);
    setInput("");
  };

  return (
    <div className="h-full w-full bg-zinc-950/90 text-zinc-200 font-mono p-4 overflow-y-auto flex flex-col justify-between select-text text-sm">
      <div className="space-y-3">
        {logs.map((log, index) => (
          <div key={index} className="space-y-1">
            {log.command && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
                <span className="text-emerald-500 font-bold">codernex@nexos:~$</span>
                <span className="text-white">{log.command}</span>
              </div>
            )}
            {log.output}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-4 flex items-center gap-2 border-t border-zinc-800/80 pt-3">
        <span className="text-emerald-500 font-bold text-xs sm:text-sm">codernex@nexos:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'help' or command..."
          className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm font-mono focus:ring-0 placeholder:text-zinc-600"
          autoFocus
        />
      </form>
    </div>
  );
}
