import { themeNames } from "../themes/themes";
import { AVAILABLE_EFFECTS } from "../data/data";
import type { ThemeName } from "../types/terminal";

/** Renders the interactive theme picker shown by the `theme` command. */
export function renderThemeList(
    currentThemeName: ThemeName,
    executeCommand: (cmd: string) => void,
) {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ theme --list</p>
            <div className="pl-4">
                <p className="theme-muted">Available themes:</p>
                <div className="mt-2">
                    {themeNames.map((name) => (
                        <div key={name} className="flex items-center gap-3">
                            <button
                                onClick={() => executeCommand(`theme ${name}`)}
                                className="theme-accent hover:underline cursor-pointer transition-colors"
                            >
                                {name}
                            </button>
                            {currentThemeName === name && (
                                <span className="theme-muted">(current)</span>
                            )}
                        </div>
                    ))}
                </div>
                <p className="theme-muted text-sm mt-2">
                    Usage: theme &lt;theme-name&gt;
                </p>
            </div>
        </div>
    );
}

/**
 * Renders the visual effects list shown by the `fun` command.
 * Effects with status "done" are clickable; others show as muted
 * with an "under development" label.
 */
export function renderFunList(
    currentEffect: string | null,
    executeCommand: (cmd: string) => void,
) {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ fun --list</p>
            <div className="pl-4">
                <p className="theme-muted">Available effects:</p>
                <div className="mt-2">
                    {AVAILABLE_EFFECTS.map((effect) => (
                        <div key={effect.name} className="flex items-center gap-3">
                            {effect.status === "done" ? (
                                <button
                                    onClick={() => executeCommand(`fun ${effect.name}`)}
                                    className="theme-accent2 hover:underline cursor-pointer transition-colors"
                                >
                                    {effect.name}
                                </button>
                            ) : (
                                <span className="theme-muted">{effect.name}</span>
                            )}
                            {effect.status !== "done" && (
                                <span className="theme-muted">(under development)</span>
                            )}
                            {currentEffect === effect.name && (
                                <span className="theme-muted">(active)</span>
                            )}
                        </div>
                    ))}
                </div>
                <p className="theme-muted text-sm mt-4">
                    Usage: fun &lt;effect-name&gt;
                </p>
            </div>
        </div>
    );
}
