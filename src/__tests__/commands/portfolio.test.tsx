import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    renderAbout,
    renderSkills,
    renderProjects,
    renderExperience,
    renderResume,
    renderContact,
    renderBlog,
} from '@/commands/portfolio';

// Wrap a renderer's JSX output in a plain div so RTL can query it
function renderOutput(jsx: React.ReactNode) {
    return render(<div>{jsx}</div>);
}

// ── renderAbout ───────────────────────────────────────────────────────────────

describe('renderAbout', () => {
    it('shows bio content', () => {
        renderOutput(renderAbout());
        // The about section renders bio paragraphs — check for partial bio text
        expect(screen.getByText(/frontend/i)).toBeInTheDocument();
    });

    it('shows location', () => {
        renderOutput(renderAbout());
        expect(screen.getByText(/Dhaka, Bangladesh/)).toBeInTheDocument();
    });

    it('shows education entries', () => {
        renderOutput(renderAbout());
        expect(screen.getByText(/Computer Science/)).toBeInTheDocument();
        expect(screen.getByText(/Shahjalal University/)).toBeInTheDocument();
    });
});

// ── renderSkills ──────────────────────────────────────────────────────────────

describe('renderSkills', () => {
    it('shows each skill category', () => {
        renderOutput(renderSkills());
        expect(screen.getByText(/programming/i)).toBeInTheDocument();
        expect(screen.getByText(/webStack/i)).toBeInTheDocument();
        expect(screen.getByText(/databases/i)).toBeInTheDocument();
        expect(screen.getByText(/tools/i)).toBeInTheDocument();
        expect(screen.getByText(/practices/i)).toBeInTheDocument();
    });

    it('shows specific skills', () => {
        renderOutput(renderSkills());
        expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
        expect(screen.getByText(/React\.js/)).toBeInTheDocument();
        expect(screen.getByText(/PostgreSQL/)).toBeInTheDocument();
    });
});

// ── renderProjects ────────────────────────────────────────────────────────────

describe('renderProjects', () => {
    it('renders a card for each project', () => {
        renderOutput(renderProjects());
        expect(screen.getByText('Terminal-Devfolio')).toBeInTheDocument();
        expect(screen.getByText('Fireflies')).toBeInTheDocument();
    });

    it('renders project links', () => {
        renderOutput(renderProjects());
        const links = screen.getAllByRole('link', { name: /View Project/i });
        expect(links).toHaveLength(2);
    });

    it('project links open in a new tab', () => {
        renderOutput(renderProjects());
        const links = screen.getAllByRole('link', { name: /View Project/i });
        links.forEach(link => {
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });
});

// ── renderExperience ──────────────────────────────────────────────────────────

describe('renderExperience', () => {
    it('renders a card for each role', () => {
        renderOutput(renderExperience());
        expect(screen.getByText('Assistant Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('Junior Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('Research Intern')).toBeInTheDocument();
    });

    it('shows company name', () => {
        renderOutput(renderExperience());
        expect(screen.getAllByText(/Dynamic Solution Innovators/)).toHaveLength(2);
    });

    it('shows period for each role', () => {
        renderOutput(renderExperience());
        expect(screen.getByText(/July 2024/)).toBeInTheDocument();
        expect(screen.getByText(/April 2023/)).toBeInTheDocument();
        expect(screen.getByText(/January 2022/)).toBeInTheDocument();
    });
});

// ── renderResume ──────────────────────────────────────────────────────────────

describe('renderResume', () => {
    it('shows download initiated message', () => {
        renderOutput(renderResume());
        expect(screen.getByText(/Resume download initiated/i)).toBeInTheDocument();
    });

    it('has a fallback download link', () => {
        renderOutput(renderResume());
        const link = screen.getByRole('link', { name: /Click here if download/i });
        expect(link).toHaveAttribute('download');
    });
});

// ── renderContact ─────────────────────────────────────────────────────────────

describe('renderContact', () => {
    it('shows email address', () => {
        renderOutput(renderContact());
        expect(screen.getByText('m.arbishal@gmail.com')).toBeInTheDocument();
    });

    it('shows all contact links', () => {
        renderOutput(renderContact());
        expect(screen.getByText(/github\.com\/arBishal/)).toBeInTheDocument();
        expect(screen.getByText(/linkedin\.com\/in\/arBishal/)).toBeInTheDocument();
    });

    it('external links open in a new tab safely', () => {
        renderOutput(renderContact());
        const githubLink = screen.getByText(/github\.com\/arBishal/).closest('a');
        expect(githubLink).toHaveAttribute('target', '_blank');
        expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
});

// ── renderBlog ────────────────────────────────────────────────────────────────

describe('renderBlog', () => {
    it('shows blog platform links', () => {
        renderOutput(renderBlog());
        // Labels render as "Medium:" — use getAllByText since the word also appears in the URL
        expect(screen.getAllByText(/Medium/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Dev\.to/i).length).toBeGreaterThan(0);
    });
});
