import React, { ReactNode } from "react";
import { useColorThemeInitializer } from "@/hooks/use-color-theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize the color theme variables
  useColorThemeInitializer();
  
  return <>{children}</>;
}
