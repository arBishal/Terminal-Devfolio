import { themeNames } from "@/themes/themes";
import { AVAILABLE_EFFECTS } from "@/data/staticData";
import type { ThemeName } from "@/themes/themes";

/** Renders the interactive theme picker shown by the `theme` command. */
export function renderThemeList(
    currentThemeName: ThemeName,
    executeCommand: (cmd: string) => void,
) {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ theme --list</p>
            <div className="pl-4">
                <p className="text-t-muted">Available themes:</p>
                <div className="mt-2">
                    {themeNames.map((name) => (
                        <div key={name} className="flex items-center gap-3">
                            <button
                                onClick={() => executeCommand(`theme ${name}`)}
                                className="text-t-accent hover:underline cursor-pointer transition-colors"
                            >
                                {name}
                            </button>
                            {currentThemeName === name && (
                                <span className="text-t-muted">(current)</span>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-t-muted text-sm mt-2">
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
            <p className="text-t-warning">$ fun --list</p>
            <div className="pl-4">
                <p className="text-t-muted">Available effects:</p>
                <div className="mt-2">
                    {AVAILABLE_EFFECTS.map((effect) => (
                        <div key={effect.name} className="flex items-center gap-3">
                            {effect.status === "done" ? (
                                <button
                                    onClick={() => executeCommand(`fun ${effect.name}`)}
                                    className="text-t-accent2 hover:underline cursor-pointer transition-colors"
                                >
                                    {effect.name}
                                </button>
                            ) : (
                                <span className="text-t-muted">{effect.name}</span>
                            )}
                            {effect.status !== "done" && (
                                <span className="text-t-muted">(under development)</span>
                            )}
                            {currentEffect === effect.name && (
                                <span className="text-t-muted">(active)</span>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-t-muted text-sm mt-4">
                    Usage: fun &lt;effect-name&gt;
                </p>
            </div>
        </div>
    );
}
