export const themeNames = [
  "dark", "light", "windows", "ubuntu",
  "dracula", "sublime", "atom", "github",
] as const;

export type ThemeName = typeof themeNames[number];

export const defaultTheme: ThemeName = "dark";
