import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCommandExecutor } from '@/hooks/useCommandExecutor';

// Stub downloadFile so tests don't create DOM <a> elements
vi.mock('@/utils/download', () => ({ downloadFile: vi.fn() }));

function setup() {
    const setIsCommandsOpen = vi.fn();
    const { result } = renderHook(() => useCommandExecutor({ setIsCommandsOpen }));
    return { result, setIsCommandsOpen };
}

// Helper: run a command and return current history
function run(result: ReturnType<typeof setup>['result'], cmd: string) {
    act(() => {
        result.current.executeCommand(cmd);
    });
    return result.current.history;
}

// ── Initial state ─────────────────────────────────────────────────────────────

describe('useCommandExecutor — initial state', () => {
    it('starts with empty history', () => {
        const { result } = setup();
        expect(result.current.history).toEqual([]);
    });

    it('starts with default theme "dark"', () => {
        const { result } = setup();
        expect(result.current.currentThemeName).toBe('dark');
    });

    it('starts with no active effect', () => {
        const { result } = setup();
        expect(result.current.currentEffect).toBeNull();
    });

    it('starts with historyIndex -1', () => {
        const { result } = setup();
        expect(result.current.historyIndex).toBe(-1);
    });
});

// ── Command recording ─────────────────────────────────────────────────────────

describe('useCommandExecutor — command recording', () => {
    it('ignores blank input', () => {
        const { result } = setup();
        run(result, '   ');
        expect(result.current.history).toHaveLength(0);
    });

    it('records each typed command in commandHistory', () => {
        const { result } = setup();
        run(result, 'about');
        run(result, 'skills');
        expect(result.current.commandHistory).toEqual(['about', 'skills']);
    });

    it('resets historyIndex to -1 after each command', () => {
        const { result } = setup();
        act(() => result.current.setHistoryIndex(2));
        run(result, 'help');
        expect(result.current.historyIndex).toBe(-1);
    });

    it('pushes a "command" entry for the raw input', () => {
        const { result } = setup();
        run(result, 'about');
        expect(result.current.history[0]).toMatchObject({ type: 'command', content: 'about' });
    });
});

// ── Known commands produce results ────────────────────────────────────────────

describe('useCommandExecutor — known commands', () => {
    const portfolioCommands = ['about', 'skills', 'projects', 'experience', 'contact', 'blog', 'help'];
    for (const cmd of portfolioCommands) {
        it(`"${cmd}" produces a result entry`, () => {
            const { result } = setup();
            const history = run(result, cmd);
            const resultEntry = history.find((l) => l.type === 'result');
            expect(resultEntry).toBeDefined();
        });
    }

    it('"clear" empties the history', () => {
        const { result } = setup();
        run(result, 'about');
        run(result, 'clear');
        expect(result.current.history).toHaveLength(0);
    });

    it('"resume" produces a result entry', () => {
        const { result } = setup();
        const history = run(result, 'resume');
        expect(history.some((l) => l.type === 'result')).toBe(true);
    });
});

// ── Unix / easter-egg commands ────────────────────────────────────────────────

describe('useCommandExecutor — unix & easter-egg commands', () => {
    const unixCommands = ['ls', 'ls -la', 'ls -l', 'pwd', 'whoami', 'date', 'hack', 'hack the planet', 'exit', 'quit', 'hello', 'hi'];
    for (const cmd of unixCommands) {
        it(`"${cmd}" does not produce an error`, () => {
            const { result } = setup();
            const history = run(result, cmd);
            expect(history.some((l) => l.type === 'error')).toBe(false);
        });
    }

    it('"sudo" produces an error entry (permission denied)', () => {
        const { result } = setup();
        const history = run(result, 'sudo');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });

    it('"cat" with no argument produces an error', () => {
        const { result } = setup();
        const history = run(result, 'cat');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });

    it('"echo" with no argument produces a result', () => {
        const { result } = setup();
        const history = run(result, 'echo');
        expect(history.some((l) => l.type === 'result')).toBe(true);
    });
});

// ── Prefix: theme ─────────────────────────────────────────────────────────────

describe('useCommandExecutor — theme prefix', () => {
    it('changes theme to "light"', () => {
        const { result } = setup();
        run(result, 'theme light');
        expect(result.current.currentThemeName).toBe('light');
    });

    it('changes theme to "ubuntu"', () => {
        const { result } = setup();
        run(result, 'theme ubuntu');
        expect(result.current.currentThemeName).toBe('ubuntu');
    });

    it('pushes a result entry on valid theme change', () => {
        const { result } = setup();
        const history = run(result, 'theme light');
        expect(history.some((l) => l.type === 'result')).toBe(true);
    });

    it('pushes an error entry for unknown theme', () => {
        const { result } = setup();
        const history = run(result, 'theme neon');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });

    it('does not change theme on invalid theme name', () => {
        const { result } = setup();
        run(result, 'theme neon');
        expect(result.current.currentThemeName).toBe('dark');
    });
});

// ── Prefix: fun ──────────────────────────────────────────────────────────────

describe('useCommandExecutor — fun prefix', () => {
    it('activates a "done" effect', () => {
        const { result } = setup();
        run(result, 'fun fireflies');
        expect(result.current.currentEffect).toBe('fireflies');
    });

    it('pushes a result entry when activating a valid effect', () => {
        const { result } = setup();
        const history = run(result, 'fun fireflies');
        expect(history.some((l) => l.type === 'result')).toBe(true);
    });

    it('clears an active effect with "fun <name> clear"', () => {
        const { result } = setup();
        run(result, 'fun fireflies');
        run(result, 'fun fireflies clear');
        expect(result.current.currentEffect).toBeNull();
    });

    it('errors when clearing an effect that is not active', () => {
        const { result } = setup();
        const history = run(result, 'fun fireflies clear');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });

    it('errors for unknown effect', () => {
        const { result } = setup();
        const history = run(result, 'fun unknownEffect');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });
});

// ── Prefix: echo ─────────────────────────────────────────────────────────────

describe('useCommandExecutor — echo prefix', () => {
    it('produces a result entry with the provided text', () => {
        const { result } = setup();
        const history = run(result, 'echo hello world');
        expect(history.some((l) => l.type === 'result')).toBe(true);
    });
});

// ── Prefix: cat ──────────────────────────────────────────────────────────────

describe('useCommandExecutor — cat prefix', () => {
    it('"cat about.txt" produces a result entry', () => {
        const { result } = setup();
        const history = run(result, 'cat about.txt');
        expect(history.some((l) => l.type === 'result')).toBe(true);
    });

    it('"cat skills/" produces an error (is a directory)', () => {
        const { result } = setup();
        const history = run(result, 'cat skills/');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });

    it('"cat unknown.txt" produces an error (no such file)', () => {
        const { result } = setup();
        const history = run(result, 'cat unknown.txt');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });
});

// ── Unknown command ───────────────────────────────────────────────────────────

describe('useCommandExecutor — unknown commands', () => {
    it('produces an error entry for an unrecognised command', () => {
        const { result } = setup();
        const history = run(result, 'foobar');
        expect(history.some((l) => l.type === 'error')).toBe(true);
    });

    it('error message mentions the unknown command', () => {
        const { result } = setup();
        run(result, 'foobar');
        const errEntry = result.current.history.find((l) => l.type === 'error');
        expect(String(errEntry?.content)).toMatch(/foobar/);
    });
});

// ── history command ───────────────────────────────────────────────────────────

describe('useCommandExecutor — history command', () => {
    it('records prior commands and returns them via history command', () => {
        const { result } = setup();
        run(result, 'about');
        run(result, 'skills');
        run(result, 'history');
        // history entry should be a result, not an error
        const lastResult = [...result.current.history].reverse().find((l) => l.type === 'result');
        expect(lastResult).toBeDefined();
    });
});

// ── hide / show ───────────────────────────────────────────────────────────────

describe('useCommandExecutor — hide / show', () => {
    it('"hide" calls setIsCommandsOpen(false)', () => {
        const { result, setIsCommandsOpen } = setup();
        run(result, 'hide');
        expect(setIsCommandsOpen).toHaveBeenCalledWith(false);
    });

    it('"show" calls setIsCommandsOpen(true)', () => {
        const { result, setIsCommandsOpen } = setup();
        run(result, 'show');
        expect(setIsCommandsOpen).toHaveBeenCalledWith(true);
    });
});
