import { portfolioData } from "../data/data";

type Command = (typeof portfolioData.commands)[number];

/**
 * Renders the help listing as plain, non-interactive text.
 * Interactive command buttons live in WelcomeScreen.
 */
export function renderHelp(commands: Command[]) {
    return (
        <div className="space-y-2">
            <p className="theme-warning">Available commands:</p>
            <div className="pl-4 grid grid-cols-1 md:grid-cols-2">
                {[...commands]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((cmd) => (
                        <div key={cmd.name}>
                            <span className="theme-accent">{cmd.name}</span>
                            <span className="theme-muted"> — {cmd.description}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
}
