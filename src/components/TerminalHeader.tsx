import { portfolioData } from "../data/data";

interface TerminalHeaderProps {
  onClose: () => void;
}

export function TerminalHeader({ onClose }: TerminalHeaderProps) {
  return (
    <div className="px-4 py-2 flex items-center justify-between border-b flex-shrink-0 theme-header-bg theme-border">
      <div className="theme-header-text text-sm">
        {portfolioData.personal.fullName}&apos;s Terminal Portfolio
      </div>
      <button
        onClick={onClose}
        className="theme-muted hover:text-red-400 transition-colors"
        aria-label="Close terminal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
