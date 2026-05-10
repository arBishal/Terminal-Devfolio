import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { ThemeName } from "@/themes/themes";

export interface OutputLine {
  type: "command" | "result" | "error";
  content: ReactNode;
}

export interface CommandContext {
  push: (type: OutputLine["type"], content: OutputLine["content"]) => void;
  executeCommand: (cmd: string) => void;
  setHistory: Dispatch<SetStateAction<OutputLine[]>>;
  setIsCommandsOpen: Dispatch<SetStateAction<boolean>>;
  commandHistory: string[];
  currentThemeName: ThemeName;
  setCurrentThemeName: (name: ThemeName) => void;
  currentEffect: string | null;
  setCurrentEffect: (name: string | null) => void;
}

export type CommandHandler = (args: string[], ctx: CommandContext, rawArgs: string) => void;
