import { useState, useRef, useEffect } from "react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { useHistoryNavigation } from "@/hooks/useHistoryNavigation";

interface CommandLineProps {
  onExecute: (command: string) => void;
  commandHistory: string[]
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  onFocusChange: (focused: boolean) => void;
}


export function CommandLine({
  onExecute,
  commandHistory,
  historyIndex,
  setHistoryIndex,
  onFocusChange,
}: CommandLineProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTapRef = useRef<number>(0);

  const { applyFirstSuggestion, ghostText } = useAutocomplete(input, setInput);
  const { navigateHistory } = useHistoryNavigation(
    commandHistory,
    historyIndex,
    setHistoryIndex,
    setInput
  );

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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Navigate command history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory("down");
    } else if (e.key === "Tab") {
      e.preventDefault();
      applyFirstSuggestion();
    }
  };

  /** Double-tap on the input triggers autocomplete on touch devices. */
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      applyFirstSuggestion();
    }
    lastTapRef.current = now;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <span className="text-t-accent flex-shrink-0">guest@portfolio:~$</span>
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
          className="bg-transparent border-none outline-none text-t-header-text caret-current p-0 m-0 min-w-0"
          spellCheck="false"
          autoComplete="off"
        />
        {ghostText && (
          <span className="text-t-muted opacity-50 pointer-events-none select-none whitespace-pre">
            {ghostText}
          </span>
        )}
        <span className="text-t-accent animate-pulse absolute right-0">▊</span>
      </div>
    </form>
  );
}