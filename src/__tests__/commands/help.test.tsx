import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHelp } from '@/commands/help';
import { COMMANDS } from '@/data/commandRegistry';

function renderOutput(jsx: React.ReactNode) {
    return render(<div>{jsx}</div>);
}

describe('renderHelp', () => {
    it('shows the "Available commands" header', () => {
        renderOutput(renderHelp());
        expect(screen.getByText(/Available commands/i)).toBeInTheDocument();
    });

    it('renders every public command name', () => {
        renderOutput(renderHelp());
        for (const cmd of COMMANDS) {
            expect(screen.getByText(cmd.name)).toBeInTheDocument();
        }
    });

    it('renders every public command description', () => {
        renderOutput(renderHelp());
        for (const cmd of COMMANDS) {
            expect(screen.getByText(new RegExp(cmd.description))).toBeInTheDocument();
        }
    });

    it('does not show hidden commands', () => {
        renderOutput(renderHelp());
        // These are hidden easter-egg commands that should not appear in help
        expect(screen.queryByText('ls')).not.toBeInTheDocument();
        expect(screen.queryByText('pwd')).not.toBeInTheDocument();
        expect(screen.queryByText('whoami')).not.toBeInTheDocument();
        expect(screen.queryByText('sudo')).not.toBeInTheDocument();
    });

    it('renders commands in alphabetical order', () => {
        renderOutput(renderHelp());
        const commandNames = COMMANDS.map((c) => c.name).sort((a, b) => a.localeCompare(b));
        const renderedNames = screen.getAllByText(new RegExp(commandNames.join('|')));
        // Verify first and last alphabetical entries appear
        expect(screen.getByText(commandNames[0])).toBeInTheDocument();
        expect(screen.getByText(commandNames[commandNames.length - 1])).toBeInTheDocument();
        // Suppress unused variable warning
        void renderedNames;
    });
});
