import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderThemeList, renderFunList } from '@/commands/visuals';
import { themeNames } from '@/themes/themes';
import { AVAILABLE_EFFECTS } from '@/data/staticData';

function renderOutput(jsx: React.ReactNode) {
    return render(<div>{jsx}</div>);
}

// ── renderThemeList ───────────────────────────────────────────────────────────

describe('renderThemeList', () => {
    it('renders all theme names as buttons', () => {
        renderOutput(renderThemeList('dark', vi.fn()));
        for (const name of themeNames) {
            expect(screen.getByRole('button', { name })).toBeInTheDocument();
        }
    });

    it('marks the active theme with "(current)"', () => {
        renderOutput(renderThemeList('dark', vi.fn()));
        expect(screen.getByText('(current)')).toBeInTheDocument();
    });

    it('shows "(current)" next to the correct theme', () => {
        renderOutput(renderThemeList('ubuntu', vi.fn()));
        const ubuntuButton = screen.getByRole('button', { name: 'ubuntu' });
        // The "(current)" span is a sibling of the ubuntu button
        const parent = ubuntuButton.parentElement!;
        expect(parent).toHaveTextContent('(current)');
    });

    it('does not show "(current)" for non-active themes', () => {
        renderOutput(renderThemeList('dark', vi.fn()));
        const lightButton = screen.getByRole('button', { name: 'light' });
        expect(lightButton.parentElement).not.toHaveTextContent('(current)');
    });

    it('calls executeCommand with correct arg when a theme button is clicked', () => {
        const execute = vi.fn();
        renderOutput(renderThemeList('dark', execute));
        fireEvent.click(screen.getByRole('button', { name: 'light' }));
        expect(execute).toHaveBeenCalledWith('theme light');
    });

    it('shows usage hint', () => {
        renderOutput(renderThemeList('dark', vi.fn()));
        expect(screen.getByText(/Usage: theme/i)).toBeInTheDocument();
    });
});

// ── renderFunList ─────────────────────────────────────────────────────────────

describe('renderFunList', () => {
    it('renders all effect names', () => {
        renderOutput(renderFunList(null, vi.fn()));
        for (const effect of AVAILABLE_EFFECTS) {
            expect(screen.getByText(effect.name)).toBeInTheDocument();
        }
    });

    it('renders "done" effects as clickable buttons', () => {
        renderOutput(renderFunList(null, vi.fn()));
        const doneEffects = AVAILABLE_EFFECTS.filter((e) => e.status === 'done');
        for (const effect of doneEffects) {
            expect(screen.getByRole('button', { name: effect.name })).toBeInTheDocument();
        }
    });

    it('renders "planning" effects as non-interactive text', () => {
        renderOutput(renderFunList(null, vi.fn()));
        const planningEffects = AVAILABLE_EFFECTS.filter((e) => e.status !== 'done');
        for (const effect of planningEffects) {
            expect(screen.queryByRole('button', { name: effect.name })).not.toBeInTheDocument();
            expect(screen.getByText(effect.name)).toBeInTheDocument();
        }
    });

    it('shows "(under development)" for planning effects', () => {
        renderOutput(renderFunList(null, vi.fn()));
        const planningEffects = AVAILABLE_EFFECTS.filter((e) => e.status !== 'done');
        if (planningEffects.length > 0) {
            expect(screen.getAllByText('(under development)').length).toBeGreaterThan(0);
        }
    });

    it('calls executeCommand with correct arg when an effect button is clicked', () => {
        const execute = vi.fn();
        renderOutput(renderFunList(null, execute));
        const doneEffect = AVAILABLE_EFFECTS.find((e) => e.status === 'done')!;
        fireEvent.click(screen.getByRole('button', { name: doneEffect.name }));
        expect(execute).toHaveBeenCalledWith(`fun ${doneEffect.name}`);
    });

    it('marks the active effect with "(active)"', () => {
        const doneEffect = AVAILABLE_EFFECTS.find((e) => e.status === 'done')!;
        renderOutput(renderFunList(doneEffect.name, vi.fn()));
        expect(screen.getByText('(active)')).toBeInTheDocument();
    });

    it('shows "(active)" next to the correct effect', () => {
        const doneEffect = AVAILABLE_EFFECTS.find((e) => e.status === 'done')!;
        renderOutput(renderFunList(doneEffect.name, vi.fn()));
        const button = screen.getByRole('button', { name: doneEffect.name });
        expect(button.parentElement).toHaveTextContent('(active)');
    });

    it('does not show "(active)" when no effect is active', () => {
        renderOutput(renderFunList(null, vi.fn()));
        expect(screen.queryByText('(active)')).not.toBeInTheDocument();
    });

    it('shows usage hint', () => {
        renderOutput(renderFunList(null, vi.fn()));
        expect(screen.getByText(/Usage: fun/i)).toBeInTheDocument();
    });
});
