export type ThemeColor =
  | "fire-red"
  | "fresh-green"
  | "deep-blue"
  | "hot-pink"
  | "cyan"
  | "bright-yellow"
  | "lime-green"
  | "dark-maroon"
  | "forest-green"
  | "dark-green";

export interface ThemeOption {
  id: ThemeColor;
  label: string;
  hex: string;
  /** HSL values as "H S% L%", used to set CSS variables */
  hsl: string;
  /** Lighter/muted accent variant HSL */
  accentHsl: string;
  /** Secondary gradient color HSL */
  hslStop: string;
  /** Tertiary gradient color HSL */
  hslAlt: string;
  /** Foreground colour on this colour (always white/black) */
  foreground: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "fire-red",
    label: "Fire Red",
    hex: "#F54927",
    hsl: "13 91% 55%",
    accentHsl: "13 91% 94%",
    hslStop: "13 91% 45%",
    hslAlt: "25 91% 50%",
    foreground: "0 0% 100%",
  },
  {
    id: "fresh-green",
    label: "Fresh Green",
    hex: "#27F542",
    hsl: "128 90% 56%",
    accentHsl: "128 90% 93%",
    hslStop: "128 90% 45%",
    hslAlt: "150 90% 50%",
    foreground: "0 0% 100%",
  },
  {
    id: "deep-blue",
    label: "Deep Blue",
    hex: "#0C1BED",
    hsl: "234 89% 49%",
    accentHsl: "234 89% 93%",
    hslStop: "234 89% 40%",
    hslAlt: "258 90% 66%",
    foreground: "0 0% 100%",
  },
  {
    id: "hot-pink",
    label: "Hot Pink",
    hex: "#ED0CB8",
    hsl: "313 91% 49%",
    accentHsl: "313 91% 93%",
    hslStop: "313 91% 40%",
    hslAlt: "330 91% 55%",
    foreground: "0 0% 100%",
  },
  {
    id: "cyan",
    label: "Cyan",
    hex: "#0CE9ED",
    hsl: "181 88% 49%",
    accentHsl: "181 88% 93%",
    hslStop: "181 88% 40%",
    hslAlt: "200 88% 55%",
    foreground: "0 0% 0%",
  },
  {
    id: "bright-yellow",
    label: "Bright Yellow",
    hex: "#DAED0C",
    hsl: "63 92% 49%",
    accentHsl: "63 92% 93%",
    hslStop: "63 92% 40%",
    hslAlt: "50 92% 55%",
    foreground: "0 0% 0%",
  },
  {
    id: "lime-green",
    label: "Lime Green",
    hex: "#6AED0C",
    hsl: "95 89% 49%",
    accentHsl: "95 89% 93%",
    hslStop: "95 89% 40%",
    hslAlt: "110 89% 55%",
    foreground: "0 0% 0%",
  },
  {
    id: "dark-maroon",
    label: "Dark Maroon",
    hex: "#991827",
    hsl: "353 72% 35%",
    accentHsl: "353 72% 93%",
    hslStop: "353 72% 30%",
    hslAlt: "340 72% 45%",
    foreground: "0 0% 100%",
  },
  {
    id: "forest-green",
    label: "Forest Green",
    hex: "#189956",
    hsl: "149 70% 35%",
    accentHsl: "149 70% 93%",
    hslStop: "149 70% 30%",
    hslAlt: "165 70% 45%",
    foreground: "0 0% 100%",
  },
  {
    id: "dark-green",
    label: "Dark Green",
    hex: "#0E4A29",
    hsl: "148 57% 18%",
    accentHsl: "148 57% 90%",
    hslStop: "148 57% 15%",
    hslAlt: "160 57% 25%",
    foreground: "0 0% 100%",
  },
];

export const DEFAULT_THEME_COLOR: ThemeColor = "deep-blue";

export function getThemeOption(id: ThemeColor): ThemeOption {
  return THEME_OPTIONS.find((t) => t.id === id) ?? THEME_OPTIONS[2];
}
