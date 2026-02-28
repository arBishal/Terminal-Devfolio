// ============================================================
// Static Data
// ============================================================
// Contains codebase constants that rarely need changing.
// ============================================================

export interface CommandInfo {
    name: string;
    description: string;
}

// ----------------------------------------------------------
// Commands (shown in help and welcome screen)
// ----------------------------------------------------------
export const COMMANDS: CommandInfo[] = [
    { name: "about", description: "Learn about me" },
    { name: "skills", description: "View my technical skills" },
    { name: "experience", description: "View work experience" },
    { name: "projects", description: "Browse my projects" },
    { name: "resume", description: "Download my resume" },
    { name: "contact", description: "Get contact information" },
    { name: "blog", description: "Read my articles" },
    { name: "theme", description: "Change terminal theme" },
    { name: "fun", description: "Visual effects" },
    { name: "help", description: "Show this help message" },
    { name: "clear", description: "Clear terminal" },
];

// ----------------------------------------------------------
// Available Visual Effects
// ----------------------------------------------------------
export interface EffectInfo {
    name: string;
    status?: "done" | "planning";
}

export const AVAILABLE_EFFECTS: EffectInfo[] = [
    { name: "fireflies", status: "done" },
    { name: "rain", status: "planning" },
];
