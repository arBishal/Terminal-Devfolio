import { useState, useRef } from "react";
import type { OutputLine } from "./useCommandExecutor";

export interface TerminalHistory {
  history: OutputLine[];
  setHistory: React.Dispatch<React.SetStateAction<OutputLine[]>>;
  commandHistory: string[];
  commandHistoryRef: React.MutableRefObject<string[]>;
  setCommandHistory: React.Dispatch<React.SetStateAction<string[]>>;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
}

export function useTerminalHistory(): TerminalHistory {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Mirrors commandHistory so executeCommand can read latest value
  // without needing it as a useCallback dependency
  const commandHistoryRef = useRef(commandHistory);
  commandHistoryRef.current = commandHistory;

  return { history, setHistory, commandHistory, commandHistoryRef, setCommandHistory, historyIndex, setHistoryIndex };
}
