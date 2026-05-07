// ============================================================
// Static Data
// ============================================================
// Contains codebase constants that rarely need changing.
// ============================================================

// ----------------------------------------------------------
// Available Visual Effects
// ----------------------------------------------------------
export interface EffectInfo {
    name: string;
    status?: "done" | "planning";
}

export const AVAILABLE_EFFECTS: EffectInfo[] = [
    { name: "fireflies", status: "done" },
    { name: "matrix-rain", status: "done" },
    { name: "starfield", status: "done" },
];
