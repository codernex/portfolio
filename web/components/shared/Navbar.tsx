"use client";

import {
  ChevronDown,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  LayoutDashboard,
  Linkedin,
  Lock,
  LogOut,
  Menu,
  Receipt,
  Terminal,
  X,
  Command,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/auth/store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const session = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "unset";
  };

  const navLinks = [
    { name: "About", path: "/about", label: "whoami" },
    { name: "Projects", path: "/projects", label: "ls_projects" },
    { name: "Blog", path: "/blog", label: "cat_blog" },
    { name: "Contact", path: "/contact", label: "ssh_contact" },
  ];

  const socialLinks = [
    { name: "GitHub", url: "http://github.com/codernex", icon: Github, color: "hover:text-white" },
    { name: "LinkedIn", url: "https://linkedin.com/codernex", icon: Linkedin, color: "hover:text-blue-400" },
    { name: "Upwork", url: "https://www.upwork.com/freelancers/codernex?s=1110580755107926016", icon: Globe, color: "hover:text-emerald-400" },
  ];

  return (
    <nav
      className={`fixed top-0 z-[100] w-full transition-all duration-300 ${
        scrolled || isOpen ? "border-b border-zinc-800 bg-zinc-950" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-2">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group relative z-[110] shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded bg-emerald-500 text-black">
              <Terminal size={18} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm sm:text-base font-bold tracking-tighter text-white">
                CODER<span className="text-emerald-500">NEX</span>
              </span>
              <span className="hidden sm:block font-mono text-[10px] text-zinc-500 leading-none">
                v1.0.0-stable
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Group */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 overflow-hidden">
            
            {/* Primary Command Links */}
            <div className="flex items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative px-2 lg:px-4 py-2 font-mono text-[11px] lg:text-sm font-medium transition-colors shrink-0 ${
                      isActive ? "text-emerald-400" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="opacity-30 mr-1">$</span>{link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CMD Palette Hint - Only visible on Large Screens (XL) */}
            <div className="hidden xl:flex items-center ml-2 mr-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono text-[10px] select-none whitespace-nowrap">
              <Command size={10} className="mr-1" />
              <span>CTRL + K</span>
            </div>

            <div className="mx-1 lg:mx-2 h-4 w-[1px] bg-zinc-800 shrink-0" />
            
            {/* Invoice App Promotion - Adaptive Text */}
            <a
              href="https://post-scheduler.codernex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 px-2 lg:px-3 py-2 font-mono text-[11px] lg:text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-all shrink-0"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
              </span>
              <span className="hidden lg:inline">run_post_scheduler</span>
              <span className="lg:hidden">post_scheduler</span>
            </a>

            <a
              href="https://workflow.codernex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 px-2 lg:px-3 py-2 font-mono text-[11px] lg:text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-all shrink-0"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
              </span>
              <span className="hidden lg:inline">run_agents</span>
              <span className="lg:hidden">run_agents</span>
            </a>

            {/* Social Connect Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-2 lg:px-3 py-2 font-mono text-[11px] lg:text-sm font-medium text-zinc-400 hover:text-white outline-none cursor-pointer shrink-0 transition-colors">
                <span className="opacity-30">$</span> 
                <span className="hidden lg:inline">connect</span>
                <ChevronDown size={14} className="opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-950 border-zinc-800 text-zinc-400 font-mono text-xs w-44">
                <DropdownMenuLabel className="text-zinc-500 text-[10px]">EXTERNAL_CHANNELS</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                {socialLinks.map((social) => (
                  <DropdownMenuItem key={social.name} className={`flex items-center justify-between cursor-pointer ${social.color}`}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full">
                      <social.icon size={14} /> {social.name.toLowerCase()}
                    </a>
                    <ExternalLink size={10} className="opacity-30" />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mx-1 lg:mx-2 h-4 w-[1px] bg-zinc-800 shrink-0" />

            {/* Auth/Session Button */}
            {session.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-emerald-500/50 bg-emerald-500/10 font-mono text-xs text-emerald-400 hover:bg-emerald-500/20 transition-all outline-none cursor-pointer shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[70px] truncate">{session.user?.name || "ADMIN"}</span>
                  <ChevronDown size={12} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-950 border-zinc-800 text-zinc-400 font-mono text-xs w-48">
                  <DropdownMenuLabel className="text-zinc-500">SESSION_CONTROLS</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem className="hover:bg-zinc-900 hover:text-emerald-400 cursor-pointer">
                    <Link href="/dashboard/projects" className="flex items-center gap-2 w-full">
                      <LayoutDashboard size={14} /> ./open_dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                    onClick={() => session.logout()}
                  >
                    <LogOut size={14} /> terminate_session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 font-mono text-[10px] lg:text-xs font-bold text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all shrink-0"
              >
                sudo login
              </Link>
            )}

            {/* System Status - Only visible on Large Screens (XL) */}
            <div className="ml-2 hidden xl:flex items-center gap-4 font-mono text-[10px] text-zinc-600 border-l border-zinc-800 pl-4 shrink-0">
              <div className="flex items-center gap-1.5">
                <Cpu size={12} className="text-emerald-500/50" />
                <span>2.4%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={12} className="text-cyan-500/50" />
                <span>24ms</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden relative z-[110] text-zinc-400 hover:text-white p-2"
            onClick={toggleMenu}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-[105] w-full bg-zinc-950 transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-10 px-8">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-4 mb-6">
            Terminal_Navigation_Menu
          </div>

          {/* Mobile Search Hint */}
          <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-zinc-600 border border-zinc-900 rounded-md p-2 bg-zinc-900/30">
            <Command size={12} />
            <span>QUICK_SEARCH: <span className="text-emerald-500">CTRL+K</span></span>
          </div>

          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="group flex items-center justify-between font-mono text-xl text-zinc-100 hover:text-emerald-400 transition-colors"
              >
                <span className="flex items-center"><span className="text-emerald-500 mr-4">{">"}</span>{link.name}</span>
                <span className="text-[10px] text-zinc-600 italic">{link.label}</span>
              </Link>
            ))}

            {/* Mobile App Promotion Card */}
            <a
              href="https://workflow.codernex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-cyan-500/20 bg-cyan-500/5 p-4 rounded-lg group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <Receipt className="text-cyan-500" size={20} />
                <span className="font-mono text-cyan-400">Agentic Workflow</span>
              </div>
              <ExternalLink size={16} className="text-cyan-800" />
            </a>

            <a
              href="https://post-scheduler.codernex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-cyan-500/20 bg-cyan-500/5 p-4 rounded-lg group active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <Receipt className="text-cyan-500" size={20} />
                <span className="font-mono text-cyan-400">Post Scheduler</span>
              </div>
              <ExternalLink size={16} className="text-cyan-800" />
            </a>

            {/* Mobile Social Connections Grid */}
            <div className="grid grid-cols-3 gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/50 p-3 rounded hover:bg-zinc-800 transition-colors active:bg-zinc-800"
                >
                  <social.icon size={18} className="text-zinc-500" />
                  <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-tighter">{social.name}</span>
                </a>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-emerald-500 py-4 font-mono text-lg font-bold text-black"
              >
                <Lock size={20} /> INITIALIZE_LOGIN
              </Link>
            </div>
          </div>

          {/* Footer of Drawer */}
          <div className="mt-auto pt-8 border-t border-zinc-900 font-mono text-[10px] text-zinc-500 space-y-1">
            <p>Engineer: Borhan Uddin</p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: <span className="text-emerald-500 font-bold uppercase">Ready</span></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}