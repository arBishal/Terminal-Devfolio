import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { ThemeName } from "@/themes/themes";

export interface OutputLine {
  type: "command" | "result" | "error";
  content: ReactNode;
}

/**
 * Provides a unified API for individual command handlers to interact with
 * the terminal's global state, history, themes, and effects.
 * By passing this context, handlers remain pure and decoupled from the React component tree.
 */
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
  isMeowActive: boolean;
  setIsMeowActive: Dispatch<SetStateAction<boolean>>;
}

/**
 * Standard signature for all command implementations.
 * @param args - Array of space-separated arguments (e.g. `["-la", "src/"]`).
 * @param ctx - The CommandContext allowing the handler to read/write terminal state.
 * @param rawArgs - The raw, unparsed argument string (useful for commands like `echo` that preserve whitespace).
 */
export type CommandHandler = (args: string[], ctx: CommandContext, rawArgs: string) => void;
