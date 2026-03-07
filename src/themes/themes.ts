export const themeNames = [
  "dark", "light", "windows-cmd", "ubuntu-gnome",
  "sublime-monokai", "atom-one-dark", "github-dark", "dracula",
] as const;

export type ThemeName = typeof themeNames[number];

export const defaultTheme: ThemeName = "dark";
