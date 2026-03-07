import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTerminalHistory } from '@/hooks/useTerminalHistory';

describe('useTerminalHistory', () => {
    it('initialises with empty history arrays and index -1', () => {
        const { result } = renderHook(() => useTerminalHistory());
        expect(result.current.history).toEqual([]);
        expect(result.current.commandHistory).toEqual([]);
        expect(result.current.historyIndex).toBe(-1);
    });

    it('commandHistoryRef mirrors commandHistory on mount', () => {
        const { result } = renderHook(() => useTerminalHistory());
        expect(result.current.commandHistoryRef.current).toEqual([]);
    });

    it('commandHistoryRef stays in sync after setCommandHistory', () => {
        const { result } = renderHook(() => useTerminalHistory());
        act(() => {
            result.current.setCommandHistory(['about', 'skills']);
        });
        expect(result.current.commandHistoryRef.current).toEqual(['about', 'skills']);
    });

    it('setHistory appends items', () => {
        const { result } = renderHook(() => useTerminalHistory());
        act(() => {
            result.current.setHistory([{ type: 'command', content: 'about' }]);
        });
        expect(result.current.history).toHaveLength(1);
        expect(result.current.history[0].content).toBe('about');
    });

    it('setHistoryIndex updates the index', () => {
        const { result } = renderHook(() => useTerminalHistory());
        act(() => {
            result.current.setHistoryIndex(2);
        });
        expect(result.current.historyIndex).toBe(2);
    });

    it('setCommandHistory updates commandHistory', () => {
        const { result } = renderHook(() => useTerminalHistory());
        act(() => {
            result.current.setCommandHistory(['help', 'contact']);
        });
        expect(result.current.commandHistory).toEqual(['help', 'contact']);
    });
});
