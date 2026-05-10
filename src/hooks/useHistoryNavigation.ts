/**
 * Encapsulates the logic for navigating terminal command history
 * using up/down arrows.
 */
export function useHistoryNavigation(
  commandHistory: string[],
  historyIndex: number,
  setHistoryIndex: (index: number) => void,
  setInput: (val: string) => void,
) {
  const navigateHistory = (direction: "up" | "down") => {
    if (direction === "up") {
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (direction === "down") {
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return { navigateHistory };
}
