import { useState, useEffect, useRef, useCallback } from "react";
import { CommandLine } from "./CommandLine";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalHeader } from "./TerminalHeader";
import { WelcomeScreen } from "./WelcomeScreen";
import { FirefliesCanvas } from "./FirefliesCanvas";
import { useCommandExecutor } from "../hooks/useCommandExecutor";

export function Terminal() {
  const [isClosed, setIsClosed] = useState(false);
  const [isCommandsOpen, setIsCommandsOpen] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Saves the commands open-state before a touch-focus collapse so we can restore it on blur
  const prevCommandsOpenRef = useRef(true);
  // Set on pointerdown of the chevron so blur handler knows to skip the restore
  const togglePressedRef = useRef(false);
  // Ref mirror of isCommandsOpen so handleFocusChange never needs it as a dep
  const isCommandsOpenRef = useRef(isCommandsOpen);

  useEffect(() => {
    isCommandsOpenRef.current = isCommandsOpen;
  }, [isCommandsOpen]);

  const {
    history,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    currentThemeName,
    currentEffect,
    clearEffect,
    executeCommand,
  } = useCommandExecutor({ setIsCommandsOpen });

  useEffect(() => {
    const pane = terminalRef.current;
    if (!pane) return;
    // Scroll the last typed command to the top of the pane so the user
    // always reads output from its beginning, even when it overflows.
    const cmds = pane.querySelectorAll("[data-cmd]");
    if (cmds.length > 0) {
      cmds[cmds.length - 1].scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      pane.scrollTop = 0;
    }
  }, [history]);

  // On touch devices (mobile/tablet), collapse commands on input focus and restore on blur.
  const handleFocusChange = useCallback((focused: boolean) => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) return;
    if (focused) {
      prevCommandsOpenRef.current = isCommandsOpenRef.current;
      setIsCommandsOpen(false);
    } else {
      // If the chevron was pressed (pointerdown fired before blur),
      // skip the restore and let the click handler do the toggle instead.
      if (togglePressedRef.current) {
        togglePressedRef.current = false;
        return;
      }
      setIsCommandsOpen(prevCommandsOpenRef.current);
    }
  }, []); // stable — reads isCommandsOpen via ref, no closure capture

  const handleTogglePointerDown = useCallback(() => {
    togglePressedRef.current = true;
  }, []);

  if (isClosed) {
    return (
      <div
        data-theme={currentThemeName}
        className="theme-bg theme-text font-mono min-h-dvh h-dvh flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <p className="theme-text text-xl">Terminal closed</p>
          <button
            onClick={() => setIsClosed(false)}
            className="px-4 py-2 theme-accent-bg rounded hover:opacity-80 transition-colors"
          >
            Reopen Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-theme={currentThemeName} className="theme-bg theme-text font-mono min-h-dvh">
      {currentEffect === "fireflies" && <FirefliesCanvas onComplete={clearEffect} />}
      <div className="h-dvh flex flex-col">
        <TerminalHeader onClose={() => setIsClosed(true)} />
        <WelcomeScreen
          onCommandClick={executeCommand}
          isCommandsOpen={isCommandsOpen}
          onToggleCommands={() => setIsCommandsOpen((v) => !v)}
          onTogglePointerDown={handleTogglePointerDown}
        />

        {/* Scrollable terminal body */}
        <div
          ref={terminalRef}
          className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black theme-bg"
        >
          <TerminalOutput history={history} />
          <CommandLine
            onExecute={executeCommand}
            commandHistory={commandHistory}
            historyIndex={historyIndex}
            setHistoryIndex={setHistoryIndex}
            onFocusChange={handleFocusChange}
          />
        </div>

        {/* Footer */}
        <div className="py-2 text-center theme-muted text-sm theme-bg border-t theme-border flex-shrink-0">
          {/* Desktop tip */}
          <p className="hidden [@media(pointer:fine)]:block">
            Tip: ↑/↓ to navigate history • Tab for autocomplete
          </p>
          {/* Touch tip */}
          <p className="block [@media(pointer:fine)]:hidden">
            Tip: Double-tap for autocomplete
          </p>
        </div>
      </div>
    </div>
  );
}
