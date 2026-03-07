import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandLine } from '@/components/CommandLine';

function setup(overrides: Partial<React.ComponentProps<typeof CommandLine>> = {}) {
    const props: React.ComponentProps<typeof CommandLine> = {
        onExecute: vi.fn(),
        commandHistory: [],
        historyIndex: -1,
        setHistoryIndex: vi.fn(),
        onFocusChange: vi.fn(),
        ...overrides,
    };
    render(<CommandLine {...props} />);
    return props;
}

// ── Rendering ─────────────────────────────────────────────────────────────────

describe('CommandLine — rendering', () => {
    it('renders the prompt', () => {
        setup();
        expect(screen.getByText(/guest@portfolio/)).toBeInTheDocument();
    });

    it('renders an input field', () => {
        setup();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('input is empty on mount', () => {
        setup();
        expect(screen.getByRole<HTMLInputElement>('textbox').value).toBe('');
    });
});

// ── Submission ────────────────────────────────────────────────────────────────

describe('CommandLine — form submission', () => {
    it('calls onExecute with the typed command on Enter', async () => {
        const user = userEvent.setup();
        const onExecute = vi.fn();
        setup({ onExecute });
        await user.type(screen.getByRole('textbox'), 'about');
        await user.keyboard('{Enter}');
        expect(onExecute).toHaveBeenCalledWith('about');
    });

    it('clears the input after submission', async () => {
        const user = userEvent.setup();
        setup();
        const input = screen.getByRole<HTMLInputElement>('textbox');
        await user.type(input, 'about');
        await user.keyboard('{Enter}');
        expect(input.value).toBe('');
    });

    it('does not call onExecute for blank input', async () => {
        const user = userEvent.setup();
        const onExecute = vi.fn();
        setup({ onExecute });
        await user.type(screen.getByRole('textbox'), '   ');
        await user.keyboard('{Enter}');
        expect(onExecute).not.toHaveBeenCalled();
    });
});

// ── Autocomplete / ghost text ─────────────────────────────────────────────────

describe('CommandLine — autocomplete', () => {
    it('shows ghost text when partial command matches a known command', async () => {
        const user = userEvent.setup();
        setup();
        // "ab" should match "about"
        await user.type(screen.getByRole('textbox'), 'ab');
        expect(screen.getByText('out')).toBeInTheDocument();
    });

    it('Tab completes to the first suggestion', async () => {
        const user = userEvent.setup();
        setup();
        const input = screen.getByRole<HTMLInputElement>('textbox');
        await user.type(input, 'ab');
        await user.keyboard('{Tab}');
        expect(input.value).toBe('about');
    });

    it('ghost text disappears after Tab completes the word', async () => {
        const user = userEvent.setup();
        setup();
        await user.type(screen.getByRole('textbox'), 'ab');
        await user.keyboard('{Tab}');
        expect(screen.queryByText('out')).not.toBeInTheDocument();
    });

    it('shows no ghost text when input does not match any command', async () => {
        const user = userEvent.setup();
        setup();
        await user.type(screen.getByRole('textbox'), 'zzz');
        // No element should contain ghost text for a non-match
        expect(screen.queryByText(/zzz/)).not.toBeInTheDocument();
    });
});

// ── History navigation ────────────────────────────────────────────────────────

describe('CommandLine — history navigation', () => {
    it('ArrowUp loads the last command', () => {
        const setHistoryIndex = vi.fn();
        setup({ commandHistory: ['about', 'skills'], historyIndex: -1, setHistoryIndex });
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowUp' });
        expect(setHistoryIndex).toHaveBeenCalledWith(1); // last index
    });

    it('ArrowDown resets index to -1 when past the end of history', () => {
        const setHistoryIndex = vi.fn();
        setup({ commandHistory: ['about'], historyIndex: 0, setHistoryIndex });
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowDown' });
        expect(setHistoryIndex).toHaveBeenCalledWith(-1);
    });

    it('ArrowUp does nothing when commandHistory is empty', () => {
        const setHistoryIndex = vi.fn();
        setup({ commandHistory: [], historyIndex: -1, setHistoryIndex });
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowUp' });
        expect(setHistoryIndex).not.toHaveBeenCalled();
    });
});

// ── Focus callbacks ───────────────────────────────────────────────────────────

describe('CommandLine — focus callbacks', () => {
    it('calls onFocusChange(true) on focus', () => {
        const onFocusChange = vi.fn();
        setup({ onFocusChange });
        fireEvent.focus(screen.getByRole('textbox'));
        expect(onFocusChange).toHaveBeenCalledWith(true);
    });

    it('calls onFocusChange(false) on blur', () => {
        const onFocusChange = vi.fn();
        setup({ onFocusChange });
        fireEvent.blur(screen.getByRole('textbox'));
        expect(onFocusChange).toHaveBeenCalledWith(false);
    });
});
