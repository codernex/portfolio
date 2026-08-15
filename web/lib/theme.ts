import { OSTheme } from "./os-store";

export interface ThemeConfig {
  text: string;
  textHover: string;
  bg: string;
  bgSubtle: string;
  border: string;
  borderSubtle: string;
  glow: string;
  shadow: string;
}

export const THEME_CONFIGS: Record<OSTheme, ThemeConfig> = {
  emerald: {
    text: "text-emerald-400",
    textHover: "hover:text-emerald-300",
    bg: "bg-emerald-500",
    bgSubtle: "bg-emerald-500/10",
    border: "border-emerald-500",
    borderSubtle: "border-emerald-500/30",
    glow: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    shadow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  },
  cyan: {
    text: "text-cyan-400",
    textHover: "hover:text-cyan-300",
    bg: "bg-cyan-500",
    bgSubtle: "bg-cyan-500/10",
    border: "border-cyan-500",
    borderSubtle: "border-cyan-500/30",
    glow: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    shadow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
  amber: {
    text: "text-amber-400",
    textHover: "hover:text-amber-300",
    bg: "bg-amber-500",
    bgSubtle: "bg-amber-500/10",
    border: "border-amber-500",
    borderSubtle: "border-amber-500/30",
    glow: "from-amber-500/20 via-amber-500/5 to-transparent",
    shadow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
  },
  purple: {
    text: "text-purple-400",
    textHover: "hover:text-purple-300",
    bg: "bg-purple-500",
    bgSubtle: "bg-purple-500/10",
    border: "border-purple-500",
    borderSubtle: "border-purple-500/30",
    glow: "from-purple-500/20 via-purple-500/5 to-transparent",
    shadow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  },
  crimson: {
    text: "text-rose-400",
    textHover: "hover:text-rose-300",
    bg: "bg-rose-500",
    bgSubtle: "bg-rose-500/10",
    border: "border-rose-500",
    borderSubtle: "border-rose-500/30",
    glow: "from-rose-500/20 via-rose-500/5 to-transparent",
    shadow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]",
  },
  solar: {
    text: "text-orange-400",
    textHover: "hover:text-orange-300",
    bg: "bg-orange-500",
    bgSubtle: "bg-orange-500/10",
    border: "border-orange-500",
    borderSubtle: "border-orange-500/30",
    glow: "from-orange-500/20 via-orange-500/5 to-transparent",
    shadow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]",
  },
};

export function getThemeConfig(theme: OSTheme = "emerald"): ThemeConfig {
  return THEME_CONFIGS[theme] || THEME_CONFIGS.emerald;
}
