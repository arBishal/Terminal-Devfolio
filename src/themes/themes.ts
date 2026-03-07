export const themeNames = ["dark", "light", "ubuntu"] as const;

export type ThemeName = typeof themeNames[number];

export const defaultTheme: ThemeName = "dark";
