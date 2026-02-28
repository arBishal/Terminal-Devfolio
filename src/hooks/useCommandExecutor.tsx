import { useState } from "react";
import type { OutputLine, ThemeName } from "../types/terminal";
import { themeNames, defaultTheme } from "../themes/themes";
import { portfolioData } from "../data/data";

// Command renderers
import {
  renderAbout, renderSkills, renderProjects, renderExperience,
  renderResume, triggerResumeDownload, renderContact, renderBlog,
} from "../commands/portfolio";
import { renderHelp } from "../commands/help";
import { renderThemeList, renderFunList } from "../commands/visuals";
import { AVAILABLE_EFFECTS } from "../data/data";
import {
  renderLs, renderPwd, renderWhoami, renderDate, renderSudo,
  renderHack, renderExit, renderHello, renderHistory, renderCat, renderEcho,
} from "../commands/misc";

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

export function useCommandExecutor({ setIsCommandsOpen }: CommandExecutorOptions): CommandExecutor {
  const [history, setHistory] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(defaultTheme);
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);

  const executeCommand = (cmd: string) => {
    function push(type: OutputLine["type"], content: OutputLine["content"]) {
      setHistory((prev) => [...prev, { type, content }]);
    }

    const trimmedCmd = cmd.trim().toLowerCase();
    if (trimmedCmd === "") return;

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

    if (trimmedCmd.startsWith("fun ")) {
      const args = trimmedCmd.slice(4).trim().split(/\s+/);
      const name = args[0];
      const subCmd = args[1];

      // fun <effect> clear
      if (subCmd === "clear") {
        if (currentEffect === name) {
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
          if (currentEffect === name) {
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
      case "help": push("result", renderHelp(portfolioData.commands)); break;
      case "about": push("result", renderAbout()); break;
      case "skills": push("result", renderSkills()); break;
      case "projects": push("result", renderProjects()); break;
      case "experience": push("result", renderExperience()); break;
      case "resume": triggerResumeDownload(); push("result", renderResume()); break;
      case "contact": push("result", renderContact()); break;
      case "blog": push("result", renderBlog()); break;
      case "theme": push("result", renderThemeList(currentThemeName, executeCommand)); break;
      case "fun": push("result", renderFunList(currentEffect, executeCommand)); break;
      case "clear": setHistory([]); return;
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
  };

  const clearEffect = () => setCurrentEffect(null);

  return { history, commandHistory, historyIndex, setHistoryIndex, currentThemeName, currentEffect, clearEffect, executeCommand };
}
