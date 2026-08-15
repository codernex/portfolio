"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

export type OSTheme = "emerald" | "cyan" | "amber" | "purple" | "crimson" | "solar";
export type OSWallpaper = "grid" | "matrix" | "gradient" | "minimal" | "blueprint";
export type ViewMode = "os" | "classic";

export interface HistoryEntry {
  path: string;
  title: string;
  detailData?: any;
}

export interface OSWindowData {
  id: string;
  title: string;
  iconName: string;
  path: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  viewMode: "grid" | "list";
  searchQuery: string;
  detailData?: any;
  history: HistoryEntry[];
  historyIndex: number;
}

export interface DesktopIcon {
  id: string;
  title: string;
  iconName: string;
  path: string;
  type: "folder" | "app" | "file";
  badge?: string;
}

interface OSStoreState {
  viewMode: ViewMode;
  theme: OSTheme;
  wallpaper: OSWallpaper;
  soundEnabled: boolean;
  customCursorEnabled: boolean;
  performanceMode: boolean;
  activeWindowId: string | null;
  highestZIndex: number;
  isStartMenuOpen: boolean;
  windows: Record<string, OSWindowData>;
  desktopIcons: DesktopIcon[];

  // Actions
  toggleViewMode: () => void;
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: OSTheme) => void;
  setWallpaper: (wallpaper: OSWallpaper) => void;
  toggleSound: () => void;
  toggleCustomCursor: () => void;
  togglePerformanceMode: () => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  resetDesktop: () => void;

  openWindow: (id: string, options?: Partial<OSWindowData>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPos: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number },
  ) => void;
  setWindowViewMode: (id: string, mode: "grid" | "list") => void;
  setWindowSearchQuery: (id: string, query: string) => void;
  navigateWindowPath: (
    id: string,
    path: string,
    title: string,
    detailData?: any,
  ) => void;
  navigateWindowBack: (id: string) => void;
  navigateWindowForward: (id: string) => void;
  closeAllWindows: () => void;
}

const DEFAULT_DESKTOP_ICONS: DesktopIcon[] = [
  {
    id: "about",
    title: "About.sys",
    iconName: "User",
    path: "/home/codernex/about",
    type: "folder",
    badge: "v1.0",
  },
  {
    id: "projects",
    title: "Projects/",
    iconName: "Folder",
    path: "/home/codernex/projects",
    type: "folder",
    badge: "Featured",
  },
  {
    id: "experience",
    title: "Experience.log",
    iconName: "Briefcase",
    path: "/home/codernex/experience",
    type: "file",
  },
  {
    id: "skills",
    title: "Skills.bin",
    iconName: "Cpu",
    path: "/home/codernex/skills",
    type: "file",
  },
  {
    id: "blog",
    title: "Articles/",
    iconName: "BookOpen",
    path: "/home/codernex/blog",
    type: "folder",
  },
  {
    id: "contact",
    title: "Contact.sh",
    iconName: "Mail",
    path: "/home/codernex/contact",
    type: "app",
  },
  {
    id: "terminal",
    title: "Terminal.app",
    iconName: "Terminal",
    path: "/sys/bin/terminal",
    type: "app",
  },
  {
    id: "settings",
    title: "Settings.cfg",
    iconName: "Settings",
    path: "/sys/config/settings",
    type: "app",
  },
];

const INITIAL_WINDOWS: Record<string, OSWindowData> = {
  about: {
    id: "about",
    title: "About System & Architect",
    iconName: "User",
    path: "/home/codernex/about",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 100, y: 60 },
    size: { width: 840, height: 580 },
    zIndex: 10,
    viewMode: "grid",
    searchQuery: "",
    history: [{ path: "/home/codernex/about", title: "About System & Architect" }],
    historyIndex: 0,
  },
  projects: {
    id: "projects",
    title: "Projects File Explorer",
    iconName: "Folder",
    path: "/home/codernex/projects",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 140, y: 80 },
    size: { width: 920, height: 600 },
    zIndex: 11,
    viewMode: "grid",
    searchQuery: "",
    history: [
      { path: "/home/codernex/projects", title: "Projects File Explorer" },
    ],
    historyIndex: 0,
  },
  experience: {
    id: "experience",
    title: "Career & Experience Logs",
    iconName: "Briefcase",
    path: "/home/codernex/experience",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 180, y: 100 },
    size: { width: 800, height: 550 },
    zIndex: 12,
    viewMode: "list",
    searchQuery: "",
    history: [
      { path: "/home/codernex/experience", title: "Career & Experience Logs" },
    ],
    historyIndex: 0,
  },
  skills: {
    id: "skills",
    title: "System Stack & Capabilities",
    iconName: "Cpu",
    path: "/home/codernex/skills",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 220, y: 120 },
    size: { width: 780, height: 520 },
    zIndex: 13,
    viewMode: "grid",
    searchQuery: "",
    history: [
      { path: "/home/codernex/skills", title: "System Stack & Capabilities" },
    ],
    historyIndex: 0,
  },
  blog: {
    id: "blog",
    title: "Technical Articles & Publications",
    iconName: "BookOpen",
    path: "/home/codernex/blog",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 260, y: 90 },
    size: { width: 880, height: 580 },
    zIndex: 14,
    viewMode: "grid",
    searchQuery: "",
    history: [
      {
        path: "/home/codernex/blog",
        title: "Technical Articles & Publications",
      },
    ],
    historyIndex: 0,
  },
  contact: {
    id: "contact",
    title: "Contact & Dispatch Mailer",
    iconName: "Mail",
    path: "/home/codernex/contact",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 300, y: 110 },
    size: { width: 720, height: 560 },
    zIndex: 15,
    viewMode: "grid",
    searchQuery: "",
    history: [
      { path: "/home/codernex/contact", title: "Contact & Dispatch Mailer" },
    ],
    historyIndex: 0,
  },
  terminal: {
    id: "terminal",
    title: "Interactive NexOS CLI Terminal",
    iconName: "Terminal",
    path: "/sys/bin/terminal",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 120, y: 140 },
    size: { width: 750, height: 480 },
    zIndex: 16,
    viewMode: "grid",
    searchQuery: "",
    history: [
      { path: "/sys/bin/terminal", title: "Interactive NexOS CLI Terminal" },
    ],
    historyIndex: 0,
  },
  settings: {
    id: "settings",
    title: "System Preferences & Configuration",
    iconName: "Settings",
    path: "/sys/config/settings",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 200, y: 130 },
    size: { width: 620, height: 600 },
    zIndex: 17,
    viewMode: "grid",
    searchQuery: "",
    history: [
      {
        path: "/sys/config/settings",
        title: "System Preferences & Configuration",
      },
    ],
    historyIndex: 0,
  },
};

/** High-Performance Native IndexedDB Storage Adapter for Zustand */
const DB_NAME = "NexOS_Preferences_DB";
const STORE_NAME = "os_preferences_store";

const getIDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB unavailable"));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const db = await getIDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(name);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return typeof localStorage !== "undefined" ? localStorage.getItem(name) : null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const db = await getIDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put(value, name);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      if (typeof localStorage !== "undefined") localStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const db = await getIDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.delete(name);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      if (typeof localStorage !== "undefined") localStorage.removeItem(name);
    }
  },
};

export const useOSStore = create<OSStoreState>()(
  persist(
    (set, get) => ({
      viewMode: "os",
      theme: "emerald",
      wallpaper: "grid",
      soundEnabled: true,
      customCursorEnabled: false,
      performanceMode: false,
      activeWindowId: null,
      highestZIndex: 20,
      isStartMenuOpen: false,
      windows: INITIAL_WINDOWS,
      desktopIcons: DEFAULT_DESKTOP_ICONS,

      toggleViewMode: () =>
        set((state) => ({
          viewMode: state.viewMode === "os" ? "classic" : "os",
        })),

      setViewMode: (mode) => set({ viewMode: mode }),

      setTheme: (theme) => set({ theme }),

      setWallpaper: (wallpaper) => set({ wallpaper }),

      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleCustomCursor: () =>
        set((state) => ({ customCursorEnabled: !state.customCursorEnabled })),

      togglePerformanceMode: () =>
        set((state) => ({ performanceMode: !state.performanceMode })),

      toggleStartMenu: () =>
        set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),

      closeStartMenu: () => set({ isStartMenuOpen: false }),

      resetDesktop: () =>
        set({
          windows: INITIAL_WINDOWS,
          activeWindowId: null,
          isStartMenuOpen: false,
          theme: "emerald",
          wallpaper: "grid",
        }),

      openWindow: (id, options) => {
        const { windows, highestZIndex } = get();
        const newZIndex = highestZIndex + 1;
        const existing = windows[id];

        if (!existing && !options) return;

        const baseWindow: OSWindowData = existing || {
          id,
          title: options?.title || "Application",
          iconName: options?.iconName || "Folder",
          path: options?.path || `/home/codernex/${id}`,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          position: { x: 120, y: 90 },
          size: { width: 800, height: 550 },
          zIndex: newZIndex,
          viewMode: "grid",
          searchQuery: "",
          history: [
            {
              path: options?.path || `/home/codernex/${id}`,
              title: options?.title || "Application",
            },
          ],
          historyIndex: 0,
        };

        set({
          activeWindowId: id,
          highestZIndex: newZIndex,
          isStartMenuOpen: false,
          windows: {
            ...windows,
            [id]: {
              ...baseWindow,
              ...options,
              isOpen: true,
              isMinimized: false,
              zIndex: newZIndex,
            },
          },
        });
      },

      closeWindow: (id) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              isOpen: false,
              isMinimized: false,
            },
          },
        });
      },

      minimizeWindow: (id) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              isMinimized: true,
            },
          },
        });
      },

      maximizeWindow: (id) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              isMaximized: !target.isMaximized,
            },
          },
        });
      },

      focusWindow: (id) => {
        const { windows, highestZIndex } = get();
        const target = windows[id];
        if (!target) return;

        const newZIndex = highestZIndex + 1;
        set({
          activeWindowId: id,
          highestZIndex: newZIndex,
          windows: {
            ...windows,
            [id]: {
              ...target,
              isMinimized: false,
              zIndex: newZIndex,
            },
          },
        });
      },

      updateWindowPos: (id, position) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              position,
            },
          },
        });
      },

      updateWindowSize: (id, size) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              size,
            },
          },
        });
      },

      setWindowViewMode: (id, mode) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              viewMode: mode,
            },
          },
        });
      },

      setWindowSearchQuery: (id, searchQuery) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              searchQuery,
            },
          },
        });
      },

      navigateWindowPath: (id, path, title, detailData) => {
        const { windows } = get();
        const target = windows[id];
        if (!target) return;

        const newHistory = target.history.slice(0, target.historyIndex + 1);
        newHistory.push({ path, title, detailData });
        const newIndex = newHistory.length - 1;

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              path,
              title,
              detailData,
              history: newHistory,
              historyIndex: newIndex,
            },
          },
        });
      },

      navigateWindowBack: (id) => {
        const { windows } = get();
        const target = windows[id];
        if (!target || target.historyIndex <= 0) return;

        const prevIndex = target.historyIndex - 1;
        const prevEntry = target.history[prevIndex];

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              path: prevEntry.path,
              title: prevEntry.title,
              detailData: prevEntry.detailData,
              historyIndex: prevIndex,
            },
          },
        });
      },

      navigateWindowForward: (id) => {
        const { windows } = get();
        const target = windows[id];
        if (!target || target.historyIndex >= target.history.length - 1) return;

        const nextIndex = target.historyIndex + 1;
        const nextEntry = target.history[nextIndex];

        set({
          windows: {
            ...windows,
            [id]: {
              ...target,
              path: nextEntry.path,
              title: nextEntry.title,
              detailData: nextEntry.detailData,
              historyIndex: nextIndex,
            },
          },
        });
      },

      closeAllWindows: () => {
        const { windows } = get();
        const updated = { ...windows };
        Object.keys(updated).forEach((key) => {
          updated[key] = {
            ...updated[key],
            isOpen: false,
            isMinimized: false,
          };
        });
        set({ windows: updated, activeWindowId: null });
      },
    }),
    {
      name: "nexos-preferences-v3",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as any))),
      partialize: (state) => ({
        viewMode: state.viewMode,
        theme: state.theme,
        wallpaper: state.wallpaper,
        soundEnabled: state.soundEnabled,
        customCursorEnabled: state.customCursorEnabled,
        performanceMode: state.performanceMode,
      }),
    },
  ),
);
