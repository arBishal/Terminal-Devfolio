import { themeNames } from "../themes/themes";
import type { ThemeName } from "../types/terminal";

export const AVAILABLE_EFFECTS = ["fireflies", "rain"];

export function renderThemeList(
    currentThemeName: ThemeName,
    executeCommand: (cmd: string) => void,
) {
    return (
        <div className="space-y-3">
            <p className="theme-warning">$ theme --list</p>
            <div className="pl-4">
                <p className="theme-muted">Available themes:</p>
                <div className="mt-2 space-y-2">
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
                <p className="theme-muted text-sm mt-4">
                    Usage: theme &lt;theme-name&gt;
                </p>
            </div>
        </div>
    );
}

export function renderFunList(
    currentEffect: string | null,
    executeCommand: (cmd: string) => void,
) {
    return (
        <div className="space-y-3">
            <p className="theme-warning">$ fun --list</p>
            <div className="pl-4">
                <p className="theme-muted">Available effects:</p>
                <div className="mt-2 space-y-2">
                    {AVAILABLE_EFFECTS.map((effectName) => (
                        <div key={effectName} className="flex items-center gap-3">
                            <button
                                onClick={() => executeCommand(`fun ${effectName}`)}
                                className="theme-accent2 hover:underline cursor-pointer transition-colors"
                            >
                                {effectName}
                            </button>
                            {currentEffect === effectName && (
                                <span className="theme-muted">(active)</span>
                            )}
                        </div>
                    ))}
                </div>
                <p className="theme-muted text-sm mt-4">
                    Usage: fun &lt;effect-name&gt;
                </p>
                <p className="theme-muted text-sm">
                    Note: Visual effects will be implemented soon!
                </p>
            </div>
        </div>
    );
}
