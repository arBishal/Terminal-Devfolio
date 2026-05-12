import { renderHook, act } from "@testing-library/react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { vi, describe, it, expect } from "vitest";

// Mock commandRegistry so we have predictable tests
vi.mock("@/data/commandRegistry", () => ({
  ALL_COMMAND_NAMES: ["about", "clear", "contact", "meow"]
}));

describe("useAutocomplete", () => {
  it("returns ghost text based on input", () => {
    const setInput = vi.fn();
    const { result } = renderHook(() => useAutocomplete("ab", setInput));
    expect(result.current.ghostText).toBe("out");
  });

  it("returns empty ghost text if no match", () => {
    const setInput = vi.fn();
    const { result } = renderHook(() => useAutocomplete("z", setInput));
    expect(result.current.ghostText).toBe("");
  });

  it("returns empty ghost text if input is empty", () => {
    const setInput = vi.fn();
    const { result } = renderHook(() => useAutocomplete("", setInput));
    expect(result.current.ghostText).toBe("");
  });

  it("applies the first suggestion", () => {
    const setInput = vi.fn();
    const { result } = renderHook(() => useAutocomplete("ab", setInput));
    
    act(() => {
      result.current.applyFirstSuggestion();
    });
    
    expect(setInput).toHaveBeenCalledWith("about");
  });
});
