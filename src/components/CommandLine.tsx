import { useState, useRef, useEffect } from "react";
import { COMMANDS } from "@/data/staticData";

interface CommandLineProps {
  onExecute: (command: string) => void;
  commandHistory: string[]
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  onFocusChange: (focused: boolean) => void;
}

// All commands the executor handles — public + hidden + easter eggs.
// Used for autocomplete so every valid command is discoverable via Tab.
const AVAILABLE_COMMANDS = [
  // Public (shown in help / welcome screen)
  ...COMMANDS.map((c) => c.name),
  // Hidden
  "hide", "show",
  // Easter eggs / unix-style
  "ls", "ls -la", "ls -l", "pwd", "whoami", "date",
  "sudo", "sudo rm -rf /", "rm -rf /",
  "hack", "hack the planet",
  "exit", "quit",
  "hello", "hi",
  "history",
  "cat", "echo",
].sort();

export function CommandLine({
  onExecute,
  commandHistory,
  historyIndex,
  setHistoryIndex,
  onFocusChange,
}: CommandLineProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTapRef = useRef<number>(0);

  // On desktop (pointer: fine), keep the input always focused.
  // Re-focus immediately on blur so the cursor never stops blinking.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const input = inputRef.current;
    input?.focus();
    const refocus = () => input?.focus();
    input?.addEventListener("blur", refocus);
    return () => input?.removeEventListener("blur", refocus);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onExecute(input);
      setInput("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Navigate command history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      applyFirstSuggestion();
    }
  };

  /** Shared logic for Tab (keyboard) and double-tap (touch) autocomplete. */
  function applyFirstSuggestion() {
    if (suggestions.length > 0) {
      setInput(suggestions[0]);
      setSuggestions([]);
    }
  }

  /** Double-tap on the input triggers autocomplete on touch devices. */
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      applyFirstSuggestion();
    }
    lastTapRef.current = now;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Autocomplete suggestions
    if (value.trim()) {
      const matches = AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.startsWith(value.toLowerCase()),
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // The ghost text is the portion of the top suggestion that hasn't been typed yet.
  const ghostText =
    suggestions[0] && input ? suggestions[0].slice(input.length) : "";

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <span className="theme-accent flex-shrink-0">guest@portfolio:~$</span>
      {/* Inline input + ghost text + cursor all on one line */}
      <div className="relative flex items-center flex-1 min-w-0 pr-5">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onTouchEnd={handleTouchEnd}
          // ch unit = one character width — exact in font-mono
          style={{ width: `${Math.max(input.length, 1)}ch` }}
          className="bg-transparent border-none outline-none theme-header-text caret-current p-0 m-0 min-w-0"
          spellCheck="false"
          autoComplete="off"
        />
        {ghostText && (
          <span className="theme-muted opacity-50 pointer-events-none select-none whitespace-pre">
            {ghostText}
          </span>
        )}
        <span className="theme-accent animate-pulse absolute right-0">▊</span>
      </div>
    </form>
  );
}