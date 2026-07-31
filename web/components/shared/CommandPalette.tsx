"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
    setSearch("");
  };

  const actions = [
    { name: "Home", onSelect: () => router.push("/") },
    { name: "Projects", onSelect: () => router.push("/projects") },
    { name: "Blog", onSelect: () => router.push("/blog") },
    { name: "About", onSelect: () => router.push("/about") },
    { name: "Contact", onSelect: () => router.push("/contact") },
    { name: "Copy Email", onSelect: () => navigator.clipboard.writeText("hello@example.com") }, // Customize email later if needed
  ];

  const filteredActions = actions.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-lg scale-100 transform overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl transition-all">
        <div className="flex items-center border-b border-zinc-800 px-3 pb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 text-zinc-500" />
          <input
            autoFocus
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd className="hidden rounded bg-zinc-800 px-2 py-1 font-mono text-[10px] font-medium text-zinc-400 sm:block">
            ESC
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
            <p className="p-4 text-center text-sm text-zinc-500">No results found.</p>
          ) : (
            filteredActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleAction(action.onSelect)}
                className="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-500 outline-none focus:bg-emerald-500/10 focus:text-emerald-500"
              >
                {action.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
