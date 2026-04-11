import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";
import { applyThemeVariables } from "@/lib/theme-utils";

/**
 * Must be mounted once near the app root.
 * Re-applies the saved color theme on every fresh page load.
 */
export function useColorThemeInitializer() {
  const { colorTheme } = useUIStore();

  useEffect(() => {
    applyThemeVariables(colorTheme);
  }, [colorTheme]);
}
