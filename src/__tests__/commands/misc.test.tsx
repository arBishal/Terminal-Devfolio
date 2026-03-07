import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    renderLs,
    renderPwd,
    renderWhoami,
    renderDate,
    renderSudo,
    renderHack,
    renderExit,
    renderHello,
    renderHistory,
    renderCat,
    renderEcho,
} from '@/commands/misc';

function renderOutput(jsx: React.ReactNode) {
    return render(<div>{jsx}</div>);
}

describe('renderLs', () => {
    it('lists expected virtual files', () => {
        renderOutput(renderLs());
        expect(screen.getByText(/about\.txt/)).toBeInTheDocument();
        expect(screen.getByText(/experience\.log/)).toBeInTheDocument();
        expect(screen.getByText(/resume\.pdf/)).toBeInTheDocument();
        expect(screen.getByText(/projects\//)).toBeInTheDocument();
        expect(screen.getByText(/skills\//)).toBeInTheDocument();
    });
});

describe('renderPwd', () => {
    it('shows a path containing portfolio', () => {
        renderOutput(renderPwd());
        expect(screen.getByText(/\/portfolio/)).toBeInTheDocument();
    });
});

describe('renderWhoami', () => {
    it('shows the short name and title', () => {
        renderOutput(renderWhoami());
        expect(screen.getByText(/Bishal/)).toBeInTheDocument();
        expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
    });
});

describe('renderDate', () => {
    it('shows a non-empty date string', () => {
        renderOutput(renderDate());
        // Exact date varies — just assert something is rendered
        const el = screen.getByText(/.+/);
        expect(el).toBeInTheDocument();
    });
});

describe('renderSudo', () => {
    it('shows permission denied message', () => {
        renderOutput(renderSudo());
        expect(screen.getByText(/Permission denied/i)).toBeInTheDocument();
    });
});

describe('renderHack', () => {
    it('shows access denied message', () => {
        renderOutput(renderHack());
        expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });
});

describe('renderExit', () => {
    it('shows a message discouraging exit', () => {
        renderOutput(renderExit());
        expect(screen.getByText(/Why leave/i)).toBeInTheDocument();
    });
});

describe('renderHello', () => {
    it('shows a greeting', () => {
        renderOutput(renderHello());
        expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    });
});

describe('renderHistory', () => {
    it('renders an empty state for empty history', () => {
        const { container } = renderOutput(renderHistory([]));
        expect(container.querySelectorAll('p')).toHaveLength(0);
    });

    it('renders each command with a number', () => {
        renderOutput(renderHistory(['about', 'skills', 'help']));
        expect(screen.getByText('about')).toBeInTheDocument();
        expect(screen.getByText('skills')).toBeInTheDocument();
        expect(screen.getByText('help')).toBeInTheDocument();
        // Index numbers
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });
});

describe('renderCat', () => {
    it('shows missing operand message when called with no argument', () => {
        const result = renderCat();
        expect(result).toMatch(/missing file operand/i);
    });

    it('shows not found message for unknown file', () => {
        const result = renderCat('unknown.txt');
        expect(result).toMatch(/No such file/i);
        expect(result).toMatch(/unknown\.txt/);
    });
});

describe('renderEcho', () => {
    it('shows joke output when called with no argument', () => {
        renderOutput(renderEcho());
        expect(screen.getByText(/Echo\.\.\. echo/i)).toBeInTheDocument();
    });

    it('echoes the provided text', () => {
        renderOutput(renderEcho('hello world'));
        expect(screen.getByText('hello world')).toBeInTheDocument();
    });

    it('preserves original casing', () => {
        renderOutput(renderEcho('Hello World'));
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
});
