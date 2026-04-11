import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeColor } from "@/lib/theme-config";
import { DEFAULT_THEME_COLOR } from "@/lib/theme-config";
import { applyThemeVariables } from "@/lib/theme-utils";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  colorTheme: ThemeColor;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setColorTheme: (colorId: ThemeColor) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      theme:
        (typeof window !== "undefined" &&
          (localStorage.getItem("imem-theme") as "light" | "dark")) ||
        "light",
      colorTheme: DEFAULT_THEME_COLOR,
      commandPaletteOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          localStorage.setItem("imem-theme", next);
          document.documentElement.classList.toggle("dark", next === "dark");
          return { theme: next };
        }),
      setTheme: (theme) => {
        localStorage.setItem("imem-theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
        
        // Sync with authStore if user is logged in
        import("./authStore").then((mod) => {
          const { colorTheme } = get();
          mod.useAuthStore.getState().updateTheme(theme, colorTheme);
        });
      },
      setColorTheme: (colorId) => {
        applyThemeVariables(colorId);
        set({ colorTheme: colorId });

        // Sync with authStore if user is logged in
        import("./authStore").then((mod) => {
          const { theme } = get();
          mod.useAuthStore.getState().updateTheme(theme, colorId);
        });
      },
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: "imem-ui",
      partialize: (state) => ({
        theme: state.theme,
        colorTheme: state.colorTheme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
