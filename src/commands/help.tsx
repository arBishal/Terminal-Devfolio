import { COMMANDS } from "@/data/staticData";

// Pre-sorted at module scope — portfolioData is static, no need to re-sort per call
const SORTED_COMMANDS = [...COMMANDS].sort((a, b) =>
    a.name.localeCompare(b.name),
);

/**
 * Renders the help listing as plain, non-interactive text.
 * Interactive command buttons live in WelcomeScreen.
 */
export function renderHelp() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">Available commands:</p>
            <div className="pl-4 grid grid-cols-1 md:grid-cols-2">
                {SORTED_COMMANDS.map((cmd) => (
                    <div key={cmd.name}>
                        <span className="theme-accent">{cmd.name}</span>
                        <span className="theme-muted"> — {cmd.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
