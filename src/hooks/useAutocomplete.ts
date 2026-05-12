import { ALL_COMMAND_NAMES } from "@/data/commandRegistry";

/**
 * A clean hook for extracting autocomplete logic.
 * Computes suggestions as derived state, avoiding unnecessary `useState` updates.
 */
export function useAutocomplete(input: string, setInput: (val: string) => void) {
  const suggestions = input.trim()
    ? ALL_COMMAND_NAMES.filter((cmd) => cmd.startsWith(input.toLowerCase()))
    : [];

  const applyFirstSuggestion = () => {
    if (suggestions.length > 0) {
      setInput(suggestions[0]);
    }
  };

  const ghostText = suggestions[0] && input ? suggestions[0].slice(input.length) : "";

  return { suggestions, applyFirstSuggestion, ghostText };
}
