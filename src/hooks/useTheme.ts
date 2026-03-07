import { useState, useRef } from "react";
import { defaultTheme } from "@/themes/themes";
import type { ThemeName } from "@/themes/themes";

export interface TerminalTheme {
  currentThemeName: ThemeName;
  currentThemeNameRef: React.MutableRefObject<ThemeName>;
  setCurrentThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
}

export function useTheme(): TerminalTheme {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(defaultTheme);

  // Mirrors currentThemeName so executeCommand can read latest value
  // without needing it as a useCallback dependency
  const currentThemeNameRef = useRef(currentThemeName);
  currentThemeNameRef.current = currentThemeName;

  return { currentThemeName, currentThemeNameRef, setCurrentThemeName };
}
