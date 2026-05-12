import { themeNames } from "@/themes/themes";
import { AVAILABLE_EFFECTS } from "@/data/staticData";
import type { ThemeName } from "@/themes/themes";
import type { CommandHandler } from "@/types/terminal";

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

export const handleTheme: CommandHandler = (args, ctx) => {
    const name = args[0] as ThemeName;
    if (!name) {
        ctx.push("result", renderThemeList(ctx.currentThemeName, ctx.executeCommand));
        return;
    }
    if (themeNames.includes(name)) {
        ctx.setCurrentThemeName(name);
        ctx.push("result", <p className="text-t-muted">✓ Theme changed to &apos;{name}&apos;</p>);
    } else {
        ctx.push("error", `Theme '${name}' not found. Available: ${themeNames.join(", ")}`);
    }
};

export const handleFun: CommandHandler = (args, ctx) => {
    const name = args[0];
    const subCmd = args[1];

    if (!name) {
        ctx.push("result", renderFunList(ctx.currentEffect, ctx.executeCommand));
        return;
    }

    if (subCmd === "clear") {
        if (ctx.currentEffect === name) {
            ctx.setCurrentEffect(null);
            ctx.push("result", <p className="text-t-muted">✓ Effect &apos;{name}&apos; cleared.</p>);
        } else {
            ctx.push("error", `Effect '${name}' is not currently active.`);
        }
        return;
    }

    const effect = AVAILABLE_EFFECTS.find(e => e.name === name);
    if (effect) {
        if (effect.status === "done") {
            if (ctx.currentEffect === name) {
                ctx.push(
                    "result",
                    <p className="text-t-muted">
                        Effect &apos;{name}&apos; is already active. To clear it, run:{" "}
                        <button
                            className="text-t-accent hover:opacity-80 hover:underline cursor-pointer transition-colors"
                            onClick={() => ctx.executeCommand(`fun ${name} clear`)}
                        >
                            fun {name} clear
                        </button>
                    </p>
                );
            } else {
                ctx.setCurrentEffect(name);
                ctx.push(
                    "result",
                    <p className="text-t-muted">
                        ✓ Effect &apos;{name}&apos; activated! To clear it, run:{" "}
                        <button
                            className="text-t-accent hover:opacity-80 hover:underline cursor-pointer transition-colors text-sm"
                            onClick={() => ctx.executeCommand(`fun ${name} clear`)}
                        >
                            fun {name} clear
                        </button>
                    </p>
                );
            }
        } else {
            ctx.push("result", <p className="text-t-muted">Effect &apos;{name}&apos; is under development.</p>);
        }
    } else {
        ctx.push("error", `Effect '${name}' not found. Available: ${AVAILABLE_EFFECTS.map(e => e.name).join(", ")}`);
    }
};
