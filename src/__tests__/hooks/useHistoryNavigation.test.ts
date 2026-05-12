import { renderHook, act } from "@testing-library/react";
import { useHistoryNavigation } from "@/hooks/useHistoryNavigation";
import { vi, describe, it, expect } from "vitest";

describe("useHistoryNavigation", () => {
  const history = ["ls", "about", "whoami"];
  
  it("navigates up to the most recent command", () => {
    const setHistoryIndex = vi.fn();
    const setInput = vi.fn();
    
    const { result } = renderHook(() => 
      useHistoryNavigation(history, -1, setHistoryIndex, setInput)
    );
    
    act(() => {
      result.current.navigateHistory("up");
    });
    
    expect(setHistoryIndex).toHaveBeenCalledWith(2); // index of "whoami"
    expect(setInput).toHaveBeenCalledWith("whoami");
  });

  it("navigates down back to the prompt", () => {
    const setHistoryIndex = vi.fn();
    const setInput = vi.fn();
    
    const { result } = renderHook(() => 
      useHistoryNavigation(history, 2, setHistoryIndex, setInput)
    );
    
    act(() => {
      result.current.navigateHistory("down");
    });
    
    expect(setHistoryIndex).toHaveBeenCalledWith(-1);
    expect(setInput).toHaveBeenCalledWith("");
  });
});
