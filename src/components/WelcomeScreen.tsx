import { portfolioData } from "../data/data";

// Sorted once at module scope — portfolioData is a constant, no need to re-sort on each render
const SORTED_COMMANDS = [...portfolioData.commands].sort((a, b) =>
  a.name.localeCompare(b.name),
);

interface WelcomeScreenProps {
  onCommandClick: (command: string) => void;
  isCommandsOpen: boolean;
  onToggleCommands: () => void;
  onTogglePointerDown: () => void;
}

export function WelcomeScreen({
  onCommandClick,
  isCommandsOpen,
  onToggleCommands,
  onTogglePointerDown,
}: WelcomeScreenProps) {
  return (
    <div className="border-b theme-bg theme-border">
      <div className="p-4 space-y-2">
        <pre className="theme-accent text-sm">
          {portfolioData.personal.asciiArt.trim()}
        </pre>
        <p className="theme-header-text">
          Welcome to my terminal portfolio{" "}
          {portfolioData.personal.portfolioVersion}
        </p>

        <div className="mt-4">
          {/* "Available commands" row with inline chevron toggle */}
          <div className="flex items-center gap-2">
            <p className="theme-warning">Available commands:</p>
            <button
              onClick={onToggleCommands}
              onPointerDown={onTogglePointerDown}
              className="theme-muted hover:opacity-80 transition-opacity text-xs leading-none"
              aria-label={isCommandsOpen ? "Collapse commands" : "Expand commands"}
              title={isCommandsOpen ? "Collapse commands" : "Expand commands"}
            >
              {isCommandsOpen ? "▲" : "▼"}
            </button>
          </div>

          {/*
            Commands grid — collapses when isCommandsOpen=false.
            Mobile focus collapse is handled in Terminal via state.
          */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isCommandsOpen ? "max-h-[500px]" : "max-h-0"}
            `}
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              {SORTED_COMMANDS.map((cmd) => (
                <div key={cmd.name}>
                  <button
                    onClick={() => onCommandClick(cmd.name)}
                    className="theme-accent hover:opacity-80 hover:underline cursor-pointer transition-colors"
                  >
                    {cmd.name}
                  </button>
                  <span className="theme-header-text hidden sm:inline">
                    {" "}- {cmd.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
