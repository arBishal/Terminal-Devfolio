# Terminal Devfolio

A fully interactive, terminal-style developer portfolio built with React, TypeScript, Vite and Tailwind CSS v4. Every section of the portfolio is accessible by typing commands — exactly like a real terminal.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## Features

- **Command-driven UI** — navigate the portfolio entirely through typed commands
- **Inline ghost-text autocomplete** — first matching suggestion appears as you type; accept it with `Tab` or double-tap
- **Command history** — navigate previous commands with `↑` / `↓`
- **Three themes** — `dark` (default), `light`, and `ubuntu` — switch live with `theme <name>`
- **Mobile-friendly** — touch-optimised keyboard UX, commands panel auto-collapses on focus
- **Responsive layout** — works from small to widescreen

---

## Commands

| Command | Description |
|---|---|
| `about` | Personal bio, location, and education |
| `skills` | Technical skills by category |
| `experience` | Work history and achievements |
| `projects` | Project showcase with tech stack and links |
| `resume` | Download resume as PDF |
| `contact` | Email, phone, GitHub, LinkedIn |
| `blog` | Links to blog platforms |
| `theme` | List available themes |
| `fun` | List available visual effects |
| `help` | Show all commands |
| `clear` | Clear terminal output |
| `history` | Show command history |

Hidden / easter-egg commands: `ls`, `pwd`, `whoami`, `date`, `sudo`, `hack`, `echo`, `cat`, `hello`, `exit`, `hide`, `show`, and more.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 + CSS custom properties |

---

## Project Structure

```
src/
├── commands/          # One file per command group
│   ├── portfolio.tsx  # about, skills, projects, experience, resume, contact, blog
│   ├── help.tsx       # help
│   ├── visuals.tsx    # theme, fun
│   └── misc.tsx       # ls, pwd, whoami, date, sudo, hack, exit, hello …
│
├── components/
│   ├── Terminal.tsx        # Root layout, theme data-attr, scroll logic
│   ├── TerminalHeader.tsx  # Title bar + close button
│   ├── TerminalOutput.tsx  # Renders command history
│   ├── WelcomeScreen.tsx   # Clickable command grid (collapsible)
│   └── CommandLine.tsx     # Input, inline ghost-text autocomplete, history nav
│
├── hooks/
│   └── useCommandExecutor.tsx  # Thin dispatcher — routes input to command renderers
│
├── data/
│   └── data.ts   # All portfolio content
│
├── themes/
│   └── themes.ts  # Theme name constants
│
├── types/
│   └── terminal.ts  # OutputLine, ThemeName
│
└── index.css   # CSS custom-property theme variables + utility classes
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
git clone https://github.com/arBishal/terminal-portfolio.git
cd terminal-portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is written to `build/`.

---

## Customisation

**All content is in one place:** [`src/data/data.ts`](src/data/data.ts)

Update the exported `portfolioData` object:

```ts
personal:    { fullName, title, bio, location, education, asciiArt }
skills:      { programming, webStack, databases, tools, practices }
projects:    [{ name, description, tech, link }]
experience:  [{ title, company, period, achievements }]
contact:     { email, links, note }
blog:        { tagline, links }
resume:      { filePath, downloadFilename }
```

Place your resume PDF in the `public/` folder and update `resume.filePath` accordingly.

### Adding a new theme

1. Add a `[data-theme="mytheme"]` block in `src/index.css` using the existing tokens (`--t-bg`, `--t-accent`, etc.)
2. Add `"mytheme"` to the `themeNames` array in `src/themes/themes.ts`

### Adding a new command

1. Create or update a renderer function in `src/commands/`
2. Add a `case` for it in the `switch` block in `src/hooks/useCommandExecutor.tsx`
3. Optionally add it to `portfolioData.commands` in `data.ts` to surface it in the help/welcome screen

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `↑` / `↓` | Navigate command history |
| `Tab` | Accept inline autocomplete suggestion |
| `Enter` | Execute command |
| Double-tap *(mobile)* | Accept inline autocomplete suggestion |

---

## License

MIT — feel free to fork and make it your own.