import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TerminalOutput } from '@/components/TerminalOutput';
import type { OutputLine } from '@/hooks/useCommandExecutor';

function setup(history: OutputLine[]) {
    return render(<TerminalOutput history={history} />);
}

// ── Empty state ───────────────────────────────────────────────────────────────

describe('TerminalOutput — empty state', () => {
    it('renders nothing when history is empty', () => {
        const { container } = setup([]);
        expect(container.firstChild).toBeNull();
    });
});

// ── Command entries ───────────────────────────────────────────────────────────

describe('TerminalOutput — command entries', () => {
    it('renders the prompt for command entries', () => {
        setup([{ type: 'command', content: 'about' }]);
        expect(screen.getByText(/guest@portfolio/)).toBeInTheDocument();
    });

    it('renders the command text', () => {
        setup([{ type: 'command', content: 'about' }]);
        expect(screen.getByText('about')).toBeInTheDocument();
    });

    it('command entry has data-cmd attribute', () => {
        const { container } = setup([{ type: 'command', content: 'about' }]);
        expect(container.querySelector('[data-cmd]')).not.toBeNull();
    });
});

// ── Result entries ────────────────────────────────────────────────────────────

describe('TerminalOutput — result entries', () => {
    it('renders result content', () => {
        setup([{ type: 'result', content: 'some result text' }]);
        expect(screen.getByText('some result text')).toBeInTheDocument();
    });

    it('result entry does not carry data-cmd attribute', () => {
        const { container } = setup([{ type: 'result', content: 'result' }]);
        expect(container.querySelector('[data-cmd]')).toBeNull();
    });

    it('renders JSX content inside result entries', () => {
        setup([{ type: 'result', content: <span data-testid="jsx-child">Hello</span> }]);
        expect(screen.getByTestId('jsx-child')).toBeInTheDocument();
    });
});

// ── Error entries ─────────────────────────────────────────────────────────────

describe('TerminalOutput — error entries', () => {
    it('renders error content', () => {
        setup([{ type: 'error', content: 'something went wrong' }]);
        expect(screen.getByText('something went wrong')).toBeInTheDocument();
    });

    it('error entry does not carry data-cmd attribute', () => {
        const { container } = setup([{ type: 'error', content: 'error' }]);
        expect(container.querySelector('[data-cmd]')).toBeNull();
    });
});

// ── Multiple entries ──────────────────────────────────────────────────────────

describe('TerminalOutput — multiple entries', () => {
    const history: OutputLine[] = [
        { type: 'command', content: 'about' },
        { type: 'result', content: 'result text' },
        { type: 'error', content: 'error text' },
    ];

    it('renders all entries', () => {
        setup(history);
        expect(screen.getByText('about')).toBeInTheDocument();
        expect(screen.getByText('result text')).toBeInTheDocument();
        expect(screen.getByText('error text')).toBeInTheDocument();
    });

    it('one data-cmd element per command entry', () => {
        const { container } = setup(history);
        expect(container.querySelectorAll('[data-cmd]')).toHaveLength(1);
    });

    it('preserves entry order in the DOM', () => {
        setup(history);
        const allText = document.body.textContent ?? '';
        const aboutIdx = allText.indexOf('about');
        const resultIdx = allText.indexOf('result text');
        const errorIdx = allText.indexOf('error text');
        expect(aboutIdx).toBeLessThan(resultIdx);
        expect(resultIdx).toBeLessThan(errorIdx);
    });
});
