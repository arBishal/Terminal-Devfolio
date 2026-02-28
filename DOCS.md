# Terminal Devfolio — How It Works

A beginner-friendly walkthrough of every layer of the codebase: what each file does, how the pieces connect, and how a real terminal experience is simulated in the browser.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [Entry Points](#2-entry-points)
3. [The Theme System](#3-the-theme-system)
4. [Component Tree](#4-component-tree)
5. [Terminal.tsx — the orchestrator](#5-terminaltsx--the-orchestrator)
6. [TerminalHeader.tsx](#6-terminalheadertsx)
7. [WelcomeScreen.tsx](#7-welcomescreentsx)
8. [TerminalOutput.tsx](#8-terminaloutputtsx)
9. [CommandLine.tsx — input, autocomplete, history](#9-commandlinetsx--input-autocomplete-history)
10. [useCommandExecutor — the brain](#10-usecommandexecutor--the-brain)
11. [Command Files — the renderers](#11-command-files--the-renderers)
12. [Data Layer](#12-data-layer)
13. [Types](#13-types)
14. [How a Command Flows End-to-End](#14-how-a-command-flows-end-to-end)
15. [How Mobile UX Works](#15-how-mobile-ux-works)
16. [Visual Effects System](#16-visual-effects-system)

---

## 1. The Big Picture

The project is a **single-page React application** that looks and behaves like a terminal (command-line interface). The user types a command, presses Enter, and the output appears above the input — just like a real shell.

There is no backend. Everything runs in the browser. The "commands" are just JavaScript functions that return JSX (React UI), which is then pushed into an array and rendered on screen.

```
User types "about" → Enter
        ↓
useCommandExecutor (hook) receives the string
        ↓
Dispatches to renderAbout() in portfolio.tsx
        ↓
Returns JSX → pushed into history array
        ↓
TerminalOutput renders the history array
        ↓
User sees the output
```

---

## 2. Entry Points

### `index.html`
The HTML shell. Contains a single `<div id="root">`. Vite injects the compiled JS bundle here at build time, and React mounts the app into this div.

### `src/main.tsx`
Bootstraps React:
```tsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

### `src/App.tsx`
Minimal — just renders `<Terminal />`:
```tsx
export default function App() {
  return <Terminal />;
}
```

Everything interesting happens inside `Terminal` and its children.

---

## 3. The Theme System

Themes are implemented using **CSS custom properties** (CSS variables), not JavaScript objects. This is more efficient because changing a theme only requires flipping one HTML attribute — no React re-renders of child components.

### How it's defined — `src/index.css`

Three theme blocks, each scoped to a `data-theme` attribute:

```css
[data-theme="dark"] {
  --t-bg:      #171717;
  --t-accent:  #4ade80;   /* green */
  --t-muted:   #a3a3a3;
  /* … */
}

[data-theme="ubuntu"] {
  --t-bg:      #300A24;   /* aubergine */
  --t-accent:  #E95420;   /* Ubuntu orange */
  /* … */
}
```

### Utility classes

Instead of `style={{ color: theme.accent }}`, components use pre-defined CSS classes:

```css
.theme-accent  { color: var(--t-accent); }
.theme-bg      { background-color: var(--t-bg); }
.theme-accent2 { color: var(--t-accent2); }  /* secondary */
```

### Applying the theme

`Terminal.tsx` puts `data-theme={currentThemeName}` on the root `<div>`. All children inherit it automatically through the CSS cascade — **no prop drilling needed**.

```tsx
<div data-theme={currentThemeName} className="theme-bg theme-text ...">
  {/* every nested element picks up the right colours */}
</div>
```

---

## 4. Component Tree

```
App
└── Terminal                  ← manages layout, theme state, focus logic
    ├── TerminalHeader         ← title bar + close button
    ├── WelcomeScreen          ← clickable command grid (collapsible)
    ├── FirefliesCanvas?       ← ambient canvas animation (conditional)
    └── [scrollable pane]
        ├── TerminalOutput     ← renders command history
        └── CommandLine        ← input + ghost autocomplete + ▊ cursor
```

---

## 5. `Terminal.tsx` — the orchestrator

This is the root component. It owns all shared state and wires everything together.

### State it manages

| State | What it tracks |
|---|---|
| `isClosed` | Whether the terminal is hidden (shows a "Reopen" screen) |
| `isCommandsOpen` | Whether the WelcomeScreen command grid is expanded |

### The custom hook call

```tsx
const {
  history,           // array of past inputs + outputs
  commandHistory,    // just the commands typed (for ↑/↓ history)
  historyIndex,      // which history entry ↑/↓ is pointing at
  setHistoryIndex,
  currentThemeName,  // "dark" | "light" | "ubuntu"
  currentEffect,     // "fireflies" | null
  clearEffect,       // removes active effect
  executeCommand,    // function to call when user presses Enter
} = useCommandExecutor({ setIsCommandsOpen });
```

When `currentEffect` is non-null, `Terminal` conditionally renders the matching canvas component (e.g. `FirefliesCanvas`). The canvas uses `pointer-events: none` so the terminal stays fully interactive underneath.

`useCommandExecutor` is a **custom React hook** — think of it as a self-contained logic box that returns values and functions to the component.

### Auto-scroll

Every time `history` changes (new output), a `useEffect` scrolls the last typed command into view at the **top** of the pane, so the output reads from the beginning:

```tsx
useEffect(() => {
  const cmds = pane.querySelectorAll("[data-cmd]");
  cmds[cmds.length - 1].scrollIntoView({ block: "start", behavior: "smooth" });
}, [history]);
```

### Mobile focus handling (the ref pattern)

On touch devices, when the keyboard opens, the commands panel collapses to make room. When the keyboard closes, it restores. The tricky part: the collapse/restore logic reads `isCommandsOpen` — but if it were a normal dependency of `useCallback`, the callback function would be re-created on every toggle, causing instability.

The fix is a **ref mirror**:

```tsx
// Mirror the state into a ref so callbacks can read it without being re-created
const isCommandsOpenRef = useRef(isCommandsOpen);
useEffect(() => { isCommandsOpenRef.current = isCommandsOpen; }, [isCommandsOpen]);

const handleFocusChange = useCallback((focused: boolean) => {
  // reads isCommandsOpenRef.current — not isCommandsOpen directly
  // so useCallback dep array stays []  →  stable function identity
}, []); // empty deps = created once, never re-created
```

---

## 6. `TerminalHeader.tsx`

A simple presentational component — just the title bar. It receives a single prop:

```tsx
interface TerminalHeaderProps {
  onClose: () => void;  // called when ✕ is clicked
}
```

Clicking ✕ sets `isClosed = true` in `Terminal`, which switches to the "Terminal closed / Reopen" screen.

---

## 7. `WelcomeScreen.tsx`

Shows the ASCII art banner and a clickable grid of commands when the terminal first loads. Clicking a command name calls `onCommandClick(cmd.name)`, which is wired to `executeCommand` in `Terminal`.

### Why sorting is at module scope

```tsx
// ✅ Outside the component — runs once when the module loads
const SORTED_COMMANDS = [...portfolioData.commands].sort(...);

function WelcomeScreen() { ... }  // SORTED_COMMANDS never re-sorted
```

If sorting were inside the component, it would re-run on every render. Since `portfolioData` is a constant, the result never changes — so we sort once.

### Collapsible panel

The panel uses a CSS `max-height` transition. When `isCommandsOpen` is false, `max-h-0` collapses it; when true, `max-h-[500px]` expands it with a smooth animation:

```tsx
<div className={`overflow-hidden transition-all duration-300 ${isCommandsOpen ? "max-h-[500px]" : "max-h-0"}`}>
```

---

## 8. `TerminalOutput.tsx`

Renders the `history` array. Each entry has a `type` and `content`:

```ts
type OutputLine =
  | { type: "command"; content: string }    // the user's input — shown with prompt
  | { type: "result";  content: JSX.Element | string }  // command output
  | { type: "error";   content: string }    // error message
```

The component maps over the array and renders each type differently:

```tsx
{line.type === "command" && (
  <div data-cmd className="flex items-center gap-2">
    <span className="theme-accent">guest@portfolio:~$</span>
    <span className="theme-accent">{line.content}</span>
  </div>
)}
```

`data-cmd` is a marker attribute — `Terminal.tsx` uses `querySelectorAll("[data-cmd]")` to find command lines for scrolling.

---

## 9. `CommandLine.tsx` — input, autocomplete, history

This component handles everything about the input line.

### How it looks

```
guest@portfolio:~$ ab|out                                              ▊
                    ^^ ^^^                                             ^
                  typed  ghost text (muted)               fixed cursor
```

- The `<input>` width is set to `{input.length}ch` — `ch` is exactly one character wide in a monospace font (`font-mono`), so the input never overflows
- Ghost text is `suggestions[0].slice(input.length)` — the remaining characters of the best match
- ▊ sits `position: absolute; right: 0` — it never moves

### Autocomplete

`AVAILABLE_COMMANDS` is a sorted array of all valid commands — including hidden ones. As the user types, the array is filtered by `startsWith`:

```tsx
const matches = AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(value.toLowerCase()));
setSuggestions(matches);
```

To accept: press `Tab` (desktop) or double-tap the input (mobile). Both call `applyFirstSuggestion()`:

```tsx
function applyFirstSuggestion() {
  if (suggestions.length > 0) {
    setInput(suggestions[0]);   // fill the input
    setSuggestions([]);          // clear ghost text
  }
}
```

### Command history navigation

`commandHistory` is an array of everything the user has typed. `historyIndex` tracks which entry `↑`/`↓` is pointing at (`-1` means "not navigating history"):

```tsx
if (e.key === "ArrowUp") {
  const newIndex = historyIndex === -1
    ? commandHistory.length - 1   // jump to most recent
    : Math.max(0, historyIndex - 1);
  setHistoryIndex(newIndex);
  setInput(commandHistory[newIndex]);
}
```

Note: `commandHistory` and `historyIndex` live in `useCommandExecutor`, not here. They're passed in as props so the hook owns the source of truth.

### Desktop always-focused

On mouse devices, the input grabs focus immediately on mount and re-grabs it the moment it loses focus:

```tsx
const refocus = () => input?.focus();
input?.addEventListener("blur", refocus);
```

This mimics a real terminal where the cursor is always blinking.

---

## 10. `useCommandExecutor` — the brain

This custom hook centralises all command-execution logic. It lives in `src/hooks/useCommandExecutor.tsx`.

### What is a custom hook?

A React hook is a JavaScript function whose name starts with `use`. It can call other hooks (`useState`, `useEffect`, etc.) and return anything. Components call it to get state and functions without cluttering the component itself.

### State inside the hook

```tsx
const [history, setHistory] = useState<OutputLine[]>([]);        // rendered output
const [commandHistory, setCommandHistory] = useState<string[]>([]);  // for ↑/↓
const [historyIndex, setHistoryIndex] = useState(-1);
const [currentThemeName, setCurrentThemeName] = useState<ThemeName>("dark");
const [currentEffect, setCurrentEffect] = useState<string | null>(null);
```

### Stable callbacks via refs

`executeCommand` reads `currentEffect` and `currentThemeName` to decide what to display. Normally this would require them as `useCallback` dependencies, causing the function to be re-created on every state change. Instead, refs mirror the state:

```tsx
const currentEffectRef = useRef(currentEffect);
currentEffectRef.current = currentEffect;
const currentThemeNameRef = useRef(currentThemeName);
currentThemeNameRef.current = currentThemeName;

const executeCommand = useCallback((cmd: string) => {
  // reads currentEffectRef.current instead of currentEffect
  // → no dependency needed → stable function identity
}, []);
```

This is the [Vercel `rerender-functional-setstate` best practice](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) — stable callback references prevent unnecessary re-renders of child components.

### The `push` helper

Defined at the top of `executeCommand` so it's always available:

```tsx
function push(type: OutputLine["type"], content: OutputLine["content"]) {
  setHistory(prev => [...prev, { type, content }]);
}
```

`prev => [...prev, newItem]` is the React functional update pattern — it always works on the latest state, even in closures.

### The dispatch flow

When the user presses Enter, `executeCommand(cmd)` is called:

1. Record the command in both `history` (for display) and `commandHistory` (for ↑/↓)
2. Check for subcommands first (`theme dark`, `fun rain`) — these need the extra argument
3. Route to the matching `case` in the `switch` statement:

```tsx
switch (trimmedCmd) {
  case "about":    push("result", renderAbout()); break;
  case "skills":   push("result", renderSkills()); break;
  case "resume":   triggerResumeDownload(); push("result", renderResume()); break;
  case "clear":    setHistory([]); return;  // wipe history, skip push
  // …
  default:         push("error", `Command not found: ${cmd}`);
}
```

**Why `return` for `clear`?** Because we call `setHistory([])` to wipe everything, and we don't want to `push` the `clear` command itself into a now-empty history.

### Side effects separated from rendering

`triggerResumeDownload()` creates a hidden `<a>` tag and clicks it programmatically to trigger a file download. This is called **before** `renderResume()` because render functions should be pure (they only return JSX, no side-effects):

```tsx
// ✅ Correct — side effect first, then pure render
case "resume":
  triggerResumeDownload();        // DOM side-effect
  push("result", renderResume()); // pure JSX
  break;
```

---

## 11. Command Files — the renderers

Each command group has its own file in `src/commands/`. They export pure functions that return JSX.

| File | Commands |
|---|---|
| `portfolio.tsx` | about, skills, projects, experience, resume, contact, blog |
| `help.tsx` | help |
| `visuals.tsx` | theme, fun |
| `misc.tsx` | ls, pwd, whoami, date, sudo, hack, exit, hello, history, cat, echo |

### Why separate files?

Before the refactor, all command logic lived in `useCommandExecutor.tsx`, making it 500+ lines. Splitting by concern:
- makes each file easy to find and edit
- lets you work on `portfolio.tsx` without touching `misc.tsx`
- keeps `useCommandExecutor` as a thin dispatcher (~120 lines)

### Colour classes used in renderers

Renderers never import a theme object. They use CSS utility classes that resolve through CSS variables:

```tsx
export function renderAbout() {
  return (
    <div>
      <p className="theme-warning">$ whoami</p>       {/* amber */}
      <p className="theme-accent2">Location:</p>       {/* secondary — blue/green/dark-orange */}
      <p className="theme-text">Dhaka, Bangladesh</p>  {/* body text */}
    </div>
  );
}
```

Visual hierarchy used consistently across all sections:

| Class | Usage |
|---|---|
| `theme-warning` | The `$` command echo (top of each block) |
| `theme-accent` | Primary highlights, project/experience top-level items |
| `theme-accent2` | Sub-headings — labels, category names, titles |
| `theme-text` | Body content |
| `theme-muted` | Timestamps, tech stacks, notes |
| `theme-error` | Error messages |

---

## 12. Data Layer

`src/data/data.ts` is the **single source of truth** for all content. It exports one big `portfolioData` constant.

```ts
export const portfolioData = {
  personal: { fullName, shortName, title, username, location, education, bio, asciiArt },
  skills:   { programming, webStack, databases, tools, practices },
  projects: [{ name, description, tech, link }],
  experience: [{ title, company, period, achievements }],
  contact:  { email, links, note },
  blog:     { tagline, links },
  resume:   { filePath, downloadFilename },
  commands: [{ name, description }],   // shown in WelcomeScreen + help
};
```

Components and command renderers import `portfolioData` directly. **To update the portfolio content, you only ever edit this file.**

---

## 13. Types

`src/types/terminal.ts` contains shared TypeScript types:

```ts
export interface OutputLine {
  type: "command" | "result" | "error";
  content: string | JSX.Element;
}

export type ThemeName = "dark" | "light" | "ubuntu";
```

TypeScript uses these to catch mistakes at compile time. If you accidentally write `push("typo", ...)`, TypeScript will error before the code even runs.

---

## 14. How a Command Flows End-to-End

Let's trace exactly what happens when a user types **`skills`** and presses Enter:

```
1. CommandLine.tsx
   handleSubmit() fires
   → calls onExecute("skills")
   → clears input

2. Terminal.tsx
   onExecute = executeCommand from the hook
   → calls useCommandExecutor's executeCommand("skills")

3. useCommandExecutor.tsx
   trimmedCmd = "skills"
   → setHistory(prev => [...prev, { type: "command", content: "skills" }])
      (adds "guest@portfolio:~$ skills" to the display)
   → setCommandHistory(prev => [...prev, "skills"])
      (stores for ↑/↓ navigation)
   → switch hits case "skills":
      push("result", renderSkills())

4. portfolio.tsx
   renderSkills() runs
   → reads portfolioData.skills
   → returns JSX: a formatted JSON-like view of skills

5. useCommandExecutor.tsx
   push() calls setHistory(prev => [...prev, { type: "result", content: <JSX> }])

6. Terminal.tsx
   history array now has 2 new entries → triggers the scroll useEffect
   → scrolls the "skills" command line to the top of the pane

7. TerminalOutput.tsx
   re-renders with the new history array
   → "result" entry: renders the skill JSX inside a plain <div>
   → user sees the formatted output
```

---

## 15. How Mobile UX Works

Mobile introduces two problems:
1. The software keyboard takes up half the screen — the commands panel makes things worse
2. Touch devices have no Tab key for autocomplete

### Problem 1 — auto-collapsing the panel

`CommandLine` calls `onFocusChange(true)` when its input is focused. `Terminal` receives this via `handleFocusChange`:

```tsx
const handleFocusChange = useCallback((focused: boolean) => {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouch) return;  // desktop — do nothing

  if (focused) {
    prevCommandsOpenRef.current = isCommandsOpenRef.current; // remember state
    setIsCommandsOpen(false);  // collapse panel
  } else {
    setIsCommandsOpen(prevCommandsOpenRef.current); // restore
  }
}, []);
```

`pointer: coarse` is a CSS/JS media feature that is true on touch devices and false on mouse devices.

### Problem 2 — touch autocomplete

A `lastTapRef` tracks the timestamp of the last tap. Two taps within 300 ms trigger autocomplete:

```tsx
const handleTouchEnd = () => {
  const now = Date.now();
  if (now - lastTapRef.current < 300) {
    applyFirstSuggestion();  // same logic as Tab
  }
  lastTapRef.current = now;
};
```

### The chevron problem

Edge case: if the user taps the ▲/▼ chevron to toggle the panel, the input blurs first (which would invoke the "restore panel" logic), then the click fires. This would undo the toggle.

The fix: a `togglePressedRef` flag:

```tsx
// set on pointerdown (fires BEFORE blur)
const handleTogglePointerDown = () => { togglePressedRef.current = true; };

// blur handler checks the flag and skips restoring if set
if (togglePressedRef.current) {
  togglePressedRef.current = false;
  return;  // let the click handler do the toggle instead
}
```

`pointerdown` fires before `blur`, so by the time blur runs, the flag is already set.

---

## 16. Visual Effects System

The `fun` command lets users activate ambient visual effects that overlay the terminal.

### Architecture

```
data.ts                    ← AVAILABLE_EFFECTS: EffectInfo[] (name + status)
    ↓
useCommandExecutor         ← validates effect name & status, sets currentEffect
    ↓
Terminal.tsx               ← conditionally renders canvas component
    ↓
FirefliesCanvas.tsx        ← Canvas API animation (pointer-events: none)
```

### Effect status gating

Each effect has a `status` field (`"done"` | `"planning"`):

```ts
export const AVAILABLE_EFFECTS: EffectInfo[] = [
  { name: "fireflies", status: "done" },
  { name: "rain", status: "planning" },
];
```

- **`done`** — effect can be activated via click or command
- **`planning`** — shown in the list as "under development"; clicking or typing shows a message instead of activating

### Command flow

| Command | Behaviour |
|---|---|
| `fun` | Lists all effects with their status |
| `fun fireflies` | Activates the effect (spawns canvas overlay) |
| `fun fireflies` (already active) | Shows "already active" message with clear hint |
| `fun fireflies clear` | Immediately removes the effect |
| `fun rain` | Shows "under development" (status is `planning`) |

### FirefliesCanvas.tsx

A self-contained React component that renders fireflies using the Canvas API:

- **Spawn**: ~80 fireflies at the bottom of the screen (adjusted for mobile)
- **Movement**: drift upward with random horizontal sway
- **Visuals**: yellow-green (`#ddff11`), 2–6px, pulsing alpha, glow via `shadowBlur`
- **Lifecycle**: fireflies leave the screen permanently; once all are gone, `onComplete` is called and the canvas unmounts
- **Non-blocking**: `pointer-events: none` on the canvas ensures the terminal remains fully interactive

Constants (colour, size, speed, pulse rate) are ported directly from the [Fireflies](https://github.com/arBishal/Fireflies) project.

### Adding a new effect

1. Create a canvas component (e.g. `RainCanvas.tsx`) — call `onComplete` when the animation ends
2. Add `{ name: "rain", status: "done" }` to `AVAILABLE_EFFECTS` in `data.ts`
3. Add a conditional render in `Terminal.tsx`: `{currentEffect === "rain" && <RainCanvas onComplete={clearEffect} />}`
