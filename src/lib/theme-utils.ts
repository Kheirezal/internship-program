import { ThemeColor, getThemeOption } from "./theme-config";

/**
 * Applies theme colors to the document root as CSS variables.
 * This allows for runtime theme switching without page reloads.
 */
export function applyThemeVariables(colorId: ThemeColor) {
  if (typeof document === "undefined") return;
  
  const opt = getThemeOption(colorId);
  const root = document.documentElement;
  
  const variables = {
    "--primary": opt.hsl,
    "--primary-foreground": opt.foreground,
    "--ring": opt.hsl,
    "--accent": opt.accentHsl,
    "--accent-foreground": opt.hsl,
    "--sidebar-primary": opt.hsl,
    "--sidebar-primary-foreground": opt.foreground,
    "--sidebar-accent": opt.accentHsl,
    "--sidebar-accent-foreground": opt.hsl,
    "--sidebar-ring": opt.hsl,
    "--primary-stop": opt.hslStop,
    "--primary-alt": opt.hslAlt,
  };

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  root.setAttribute("data-color-theme", colorId);
}
