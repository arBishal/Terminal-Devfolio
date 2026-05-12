// ============================================================
// Command Registry — single source of truth for all commands
// ============================================================
// Every command the executor handles is listed here.
// Derive all command lists (autocomplete, help, welcome screen)
// from this one registry instead of maintaining separate arrays.
// ============================================================

interface CommandEntry {
    name: string;
    description?: string;
    /** Hidden commands are excluded from help / welcome screen. */
    hidden: boolean;
}

const COMMAND_REGISTRY: CommandEntry[] = [
    // ── Public commands (shown in help + welcome screen) ──────────
    { name: "about",      description: "Learn about me",            hidden: false },
    { name: "skills",     description: "View my technical skills",  hidden: false },
    { name: "experience", description: "View work experience",      hidden: false },
    { name: "projects",   description: "Browse my projects",        hidden: false },
    { name: "resume",     description: "Download my resume",        hidden: false },
    { name: "contact",    description: "Get contact information",   hidden: false },
    { name: "blog",       description: "Read my articles",          hidden: false },
    { name: "theme",      description: "Change terminal theme",     hidden: false },
    { name: "fun",        description: "Visual effects",            hidden: false },
    { name: "help",       description: "Show this help message",    hidden: false },
    { name: "clear",      description: "Clear terminal",            hidden: false },

    // ── Hidden (functional but not advertised) ─────────────────────
    { name: "hide",          hidden: true },
    { name: "show",          hidden: true },
    { name: "history",       hidden: true },

    // ── Easter eggs / unix-style ───────────────────────────────────
    { name: "ls",            hidden: true },
    { name: "ls -la",        hidden: true },
    { name: "ls -l",         hidden: true },
    { name: "pwd",           hidden: true },
    { name: "whoami",        hidden: true },
    { name: "date",          hidden: true },
    { name: "sudo",          hidden: true },
    { name: "sudo rm -rf /", hidden: true },
    { name: "rm -rf /",      hidden: true },
    { name: "hack",          hidden: true },
    { name: "hack the planet", hidden: true },
    { name: "exit",          hidden: true },
    { name: "quit",          hidden: true },
    { name: "hello",         hidden: true },
    { name: "hi",            hidden: true },
    { name: "cat",           hidden: true },
    { name: "echo",          hidden: true },
    { name: "meow",          hidden: true },
];

// ── Derived exports ────────────────────────────────────────────────────────────

export interface CommandInfo {
    name: string;
    description: string;
}

/** Public commands with descriptions — used by help and welcome screen. */
export const COMMANDS: CommandInfo[] = COMMAND_REGISTRY
    .filter((c): c is CommandEntry & { description: string } => !c.hidden && !!c.description)
    .map(({ name, description }) => ({ name, description }));

/** All command names (public + hidden + easter eggs), sorted — used for autocomplete. */
export const ALL_COMMAND_NAMES: string[] = COMMAND_REGISTRY
    .map((c) => c.name)
    .sort();
