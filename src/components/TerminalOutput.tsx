import type { OutputLine } from "@/hooks/useCommandExecutor";

interface TerminalOutputProps {
  history: OutputLine[];
}

/**
 * Renders the terminal's scrollback — each entry is a command echo,
 * result block, or error message. Command entries are marked with
 * `data-cmd` so Terminal.tsx can querySelector them for scroll targeting.
 */
export function TerminalOutput({ history }: TerminalOutputProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      {history.map((line, index) => (
        <div key={index}>
          {line.type === "command" && (
            <div data-cmd className="flex items-center gap-2">
              <span className="text-t-accent">guest@portfolio:~$</span>
              <span className="text-t-accent">{line.content}</span>
            </div>
          )}
          {line.type === "result" && (
            <div className="text-t-text pl-0">{line.content}</div>
          )}
          {line.type === "error" && (
            <div className="text-t-error pl-0">{line.content}</div>
          )}
        </div>
      ))
      }
    </div >
  );
}