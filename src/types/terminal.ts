export interface OutputLine {
  type: "command" | "result" | "error";
  content: string | JSX.Element;
}

export type ThemeName = "dark" | "light" | "ubuntu";
