import { useState, useCallback, useRef } from "react";
import type { OutputLine, ThemeName } from "@/types/terminal";
import { themeNames, defaultTheme } from "@/themes/themes";
import { portfolioData } from "@/data/portfolioData";

// Command renderers
import {
  renderAbout, renderSkills, renderProjects, renderExperience,
  renderResume, triggerResumeDownload, renderContact, renderBlog,
} from "../commands/portfolio";
import { renderHelp } from "@/commands/help";
import { renderThemeList, renderFunList } from "@/commands/visuals";
import { AVAILABLE_EFFECTS } from "@/data/staticData";
import {
  renderLs, renderPwd, renderWhoami, renderDate, renderSudo,
  renderHack, renderExit, renderHello, renderHistory, renderCat, renderEcho,
} from "@/commands/misc";

// Hoisted regex — avoids recreation on every command execution (js-hoist-regexp)
const WHITESPACE_RE = /\s+/;

export interface CommandExecutorOptions {
  setIsCommandsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CommandExecutor {
  history: OutputLine[];
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  currentThemeName: ThemeName;
  currentEffect: string | null;
  clearEffect: () => void;
  executeCommand: (cmd: string) => void;
}

/**
 * Central command-execution hook. Owns all terminal state (history, theme,
 * effect) and exposes a stable `executeCommand` callback for the UI.
 *
 * State that the callback reads at dispatch time (currentEffect, currentThemeName)
 * is mirrored into refs so the callback never needs to be re-created.
 */
export function useCommandExecutor({ setIsCommandsOpen }: CommandExecutorOptions): CommandExecutor {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(defaultTheme);
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);

  // Refs mirror state so executeCommand can read latest values
  // without needing them as useCallback dependencies (rerender-functional-setstate)
  const currentEffectRef = useRef(currentEffect);
  currentEffectRef.current = currentEffect;
  const currentThemeNameRef = useRef(currentThemeName);
  currentThemeNameRef.current = currentThemeName;

  const executeCommand = useCallback((cmd: string) => {
    /** Append a single output line to the terminal history. */
    function push(type: OutputLine["type"], content: OutputLine["content"]) {
      setHistory((prev) => [...prev, { type, content }]);
    }

    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === "") return;

    // Record the raw command for display + ↑/↓ navigation, then reset index
    setHistory((prev) => [
      ...prev,
      { type: "command", content: cmd },
    ]);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // ── Subcommand routing (must come before switch) ──────────────────────────
    if (trimmedCmd.startsWith("theme ")) {
      const name = trimmedCmd.slice(6).trim() as ThemeName;
      if (themeNames.includes(name)) {
        setCurrentThemeName(name);
        push("result", <p className="theme-accent">✓ Theme changed to &apos;{name}&apos;</p>);
      } else {
        push("error", `Theme '${name}' not found. Available: ${themeNames.join(", ")}`);
      }
      return;
    }

    // ── fun <effect> [clear] ─────────────────────────────────────────────────
    //  Three-way dispatch:
    //    1. "fun <effect> clear"  → remove the active effect
    //    2. "fun <effect>" (done) → activate or warn if already active
    //    3. "fun <effect>" (else) → show under-development message
    if (trimmedCmd.startsWith("fun ")) {
      const args = trimmedCmd.slice(4).trim().split(WHITESPACE_RE);
      const name = args[0];
      const subCmd = args[1];

      // fun <effect> clear
      if (subCmd === "clear") {
        if (currentEffectRef.current === name) {
          setCurrentEffect(null);
          push("result", <p className="theme-accent">✓ Effect &apos;{name}&apos; cleared.</p>);
        } else {
          push("error", `Effect '${name}' is not currently active.`);
        }
        return;
      }

      const effect = AVAILABLE_EFFECTS.find(e => e.name === name);
      if (effect) {
        if (effect.status === "done") {
          if (currentEffectRef.current === name) {
            push("result", <p className="theme-muted">Effect &apos;{name}&apos; is already active. To clear it, run: <span className="theme-accent">fun {name} clear</span></p>);
          } else {
            setCurrentEffect(name);
            push("result", <p className="theme-accent">✓ Effect &apos;{name}&apos; activated!</p>);
          }
        } else {
          push("result", <p className="theme-muted">Effect &apos;{name}&apos; is under development.</p>);
        }
      } else {
        push("error", `Effect '${name}' not found. Available: ${AVAILABLE_EFFECTS.map(e => e.name).join(", ")}`);
      }
      return;
    }

    // ── Main command dispatch ─────────────────────────────────────────────────
    switch (trimmedCmd) {
      case "help": push("result", renderHelp()); break;
      case "about": push("result", renderAbout()); break;
      case "skills": push("result", renderSkills()); break;
      case "projects": push("result", renderProjects()); break;
      case "experience": push("result", renderExperience()); break;
      case "resume": triggerResumeDownload(); push("result", renderResume()); break;
      case "contact": push("result", renderContact()); break;
      case "blog": push("result", renderBlog()); break;
      case "theme": push("result", renderThemeList(currentThemeNameRef.current, executeCommand)); break;
      case "fun": push("result", renderFunList(currentEffectRef.current, executeCommand)); break;
      case "clear": setHistory([]); return; // wipe history; return skips pushing the "clear" command itself
      case "hide": setIsCommandsOpen(false); push("result", <p className="theme-muted">Commands hidden. Type <span className="theme-accent">show</span> to bring them back.</p>); break;
      case "show": setIsCommandsOpen(true); push("result", <p className="theme-muted">Commands visible.</p>); break;
      case "ls":
      case "ls -la":
      case "ls -l": push("result", renderLs()); break;
      case "pwd": push("result", renderPwd()); break;
      case "whoami": push("result", renderWhoami()); break;
      case "date": push("result", renderDate()); break;
      case "sudo":
      case "sudo rm -rf /":
      case "rm -rf /": push("error", renderSudo()); break;
      case "hack":
      case "hack the planet": push("result", renderHack()); break;
      case "exit":
      case "quit": push("result", renderExit()); break;
      case "hello":
      case "hi": push("result", renderHello()); break;
      case "history": push("result", renderHistory(commandHistory)); break;
      case "cat": push("error", renderCat()); break;
      case "echo": push("result", renderEcho()); break;
      default: push("error", `Command not found: ${cmd}. Type 'help' for available commands.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearEffect = useCallback(() => setCurrentEffect(null), []);

  return { history, commandHistory, historyIndex, setHistoryIndex, currentThemeName, currentEffect, clearEffect, executeCommand };
}
