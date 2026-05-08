import { useCallback } from "react";
import { themeNames } from "@/themes/themes";
import type { ThemeName } from "@/themes/themes";

// Command renderers
import {
  renderAbout, renderSkills, renderProjects, renderExperience,
  renderResume, renderContact, renderBlog,
} from "@/commands/portfolio";
import { downloadFile } from "@/utils/download";
import { portfolioData } from "@/data/portfolioData";
import { renderHelp } from "@/commands/help";
import { renderThemeList, renderFunList } from "@/commands/visuals";
import { AVAILABLE_EFFECTS } from "@/data/staticData";
import {
  renderLs, renderPwd, renderWhoami, renderDate, renderSudo,
  renderHack, renderExit, renderHello, renderHistory, renderCat, renderEcho,
} from "@/commands/misc";

import { useTerminalHistory } from "./useTerminalHistory";
import { useTheme } from "./useTheme";
import { useActiveEffect } from "./useActiveEffect";

export interface OutputLine {
  type: "command" | "result" | "error";
  content: React.ReactNode;
}

// Hoisted regex — avoids recreation on every command execution
const WHITESPACE_RE = /\s+/;

// Maximum number of output lines kept in memory.
// Oldest lines are trimmed when the limit is exceeded.
const MAX_HISTORY = 400;

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
 * Composes useTerminalHistory, useTheme, and useActiveEffect into a single
 * interface and wires up the command executor. Each sub-hook owns its
 * own state slice; this hook owns only the dispatch logic.
 */
export function useCommandExecutor({ setIsCommandsOpen }: CommandExecutorOptions): CommandExecutor {
  const {
    history, setHistory,
    commandHistory, commandHistoryRef, setCommandHistory,
    historyIndex, setHistoryIndex,
  } = useTerminalHistory();

  const { currentThemeName, currentThemeNameRef, setCurrentThemeName } = useTheme();
  const { currentEffect, currentEffectRef, setCurrentEffect, clearEffect } = useActiveEffect();

  const executeCommand = useCallback((cmd: string) => {
    function push(type: OutputLine["type"], content: OutputLine["content"]) {
      setHistory((prev) => {
        const next = [...prev, { type, content }];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    }

    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === "") return;

    setHistory((prev) => {
      const next = [...prev, { type: "command", content: cmd }];
      return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
    });
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // ── Prefix handlers for parameterized subcommands ─────────────────────────
    if (trimmedCmd.startsWith("theme ")) {
      const name = trimmedCmd.slice(6).trim() as ThemeName;
      if (themeNames.includes(name)) {
        setCurrentThemeName(name);
        push("result", <p className="text-t-muted">✓ Theme changed to &apos;{name}&apos;</p>);
      } else {
        push("error", `Theme '${name}' not found. Available: ${themeNames.join(", ")}`);
      }
      return;
    }

    if (trimmedCmd.startsWith("fun ")) {
      const args = trimmedCmd.slice(4).trim().split(WHITESPACE_RE);
      const name = args[0];
      const subCmd = args[1];

      if (subCmd === "clear") {
        if (currentEffectRef.current === name) {
          setCurrentEffect(null);
          push("result", <p className="text-t-muted">✓ Effect &apos;{name}&apos; cleared.</p>);
        } else {
          push("error", `Effect '${name}' is not currently active.`);
        }
        return;
      }

      const effect = AVAILABLE_EFFECTS.find(e => e.name === name);
      if (effect) {
        if (effect.status === "done") {
          if (currentEffectRef.current === name) {
            push("result",
              <p className="text-t-muted">
                Effect &apos;{name}&apos; is already active. To clear it, run:{" "}
                <button
                  className="text-t-accent hover:opacity-80 hover:underline cursor-pointer transition-colors"
                  onClick={() => executeCommand(`fun ${name} clear`)}
                >
                  fun {name} clear
                </button>
              </p>
            );
          } else {
            setCurrentEffect(name);
            push(
              "result",
              <p className="text-t-muted">
                ✓ Effect &apos;{name}&apos; activated! To clear it, run:{" "}
                <button
                  className="text-t-accent hover:opacity-80 hover:underline cursor-pointer transition-colors text-sm"
                  onClick={() => executeCommand(`fun ${name} clear`)}
                >
                  fun {name} clear
                </button>
              </p>
            );
          }
        } else {
          push("result", <p className="text-t-muted">Effect &apos;{name}&apos; is under development.</p>);
        }
      } else {
        push("error", `Effect '${name}' not found. Available: ${AVAILABLE_EFFECTS.map(e => e.name).join(", ")}`);
      }
      return;
    }

    // ── echo <text> ──────────────────────────────────────────────────────────
    if (trimmedCmd.startsWith("echo ")) {
      const text = cmd.trim().slice(5); // slice from original to preserve casing
      push("result", renderEcho(text));
      return;
    }

    // ── cat <filename> ───────────────────────────────────────────────────────
    if (trimmedCmd.startsWith("cat ")) {
      const filename = trimmedCmd.slice(4).trim();
      const fileRoutes: Record<string, () => void> = {
        "about.txt":      () => push("result", renderAbout()),
        "contact.txt":    () => push("result", renderContact()),
        "experience.log": () => push("result", renderExperience()),
        "resume.pdf":     () => { downloadFile(portfolioData.resume.filePath, portfolioData.resume.downloadFilename); push("result", renderResume()); },
      };
      const handler = fileRoutes[filename];
      if (handler) {
        handler();
      } else if (filename === "skills/" || filename === "projects/") {
        push("error", `cat: ${filename}: Is a directory`);
      } else {
        push("error", renderCat(filename));
      }
      return;
    }

    // ── Main command dispatch ─────────────────────────────────────────────────
    const commandMap: Record<string, () => void> = {
      // Portfolio
      "help":              () => push("result", renderHelp()),
      "about":             () => push("result", renderAbout()),
      "skills":            () => push("result", renderSkills()),
      "projects":          () => push("result", renderProjects()),
      "experience":        () => push("result", renderExperience()),
      "resume":            () => { downloadFile(portfolioData.resume.filePath, portfolioData.resume.downloadFilename); push("result", renderResume()); },
      "contact":           () => push("result", renderContact()),
      "blog":              () => push("result", renderBlog()),
      // Visuals
      "theme":             () => push("result", renderThemeList(currentThemeNameRef.current, executeCommand)),
      "fun":               () => push("result", renderFunList(currentEffectRef.current, executeCommand)),
      // Terminal control
      "clear":             () => setHistory([]),
      "hide":              () => { setIsCommandsOpen(false); push("result", <p className="text-t-muted">Commands hidden. Type <span className="text-t-accent">show</span> to bring them back.</p>); },
      "show":              () => { setIsCommandsOpen(true); push("result", <p className="text-t-muted">Commands visible.</p>); },
      // Unix-style / easter eggs
      "ls":                () => push("result", renderLs()),
      "ls -la":            () => push("result", renderLs()),
      "ls -l":             () => push("result", renderLs()),
      "pwd":               () => push("result", renderPwd()),
      "whoami":            () => push("result", renderWhoami()),
      "date":              () => push("result", renderDate()),
      "sudo":              () => push("error", renderSudo()),
      "sudo rm -rf /":     () => push("error", renderSudo()),
      "rm -rf /":          () => push("error", renderSudo()),
      "hack":              () => push("result", renderHack()),
      "hack the planet":   () => push("result", renderHack()),
      "exit":              () => push("result", renderExit()),
      "quit":              () => push("result", renderExit()),
      "hello":             () => push("result", renderHello()),
      "hi":                () => push("result", renderHello()),
      "history":           () => push("result", renderHistory(commandHistoryRef.current)),
      "cat":               () => push("error", renderCat()),
      "echo":              () => push("result", renderEcho()),
    };

    const handler = commandMap[trimmedCmd];
    if (handler) {
      handler();
    } else {
      push("error", `Command not found: ${cmd}. Type 'help' for available commands.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { history, commandHistory, historyIndex, setHistoryIndex, currentThemeName, currentEffect, clearEffect, executeCommand };
}
