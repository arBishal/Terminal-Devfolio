import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveEffect } from '@/hooks/useActiveEffect';

describe('useActiveEffect', () => {
    it('initialises with no active effect', () => {
        const { result } = renderHook(() => useActiveEffect());
        expect(result.current.currentEffect).toBeNull();
    });

    it('currentEffectRef mirrors currentEffect on mount', () => {
        const { result } = renderHook(() => useActiveEffect());
        expect(result.current.currentEffectRef.current).toBeNull();
    });

    it('setCurrentEffect updates the active effect', () => {
        const { result } = renderHook(() => useActiveEffect());
        act(() => {
            result.current.setCurrentEffect('fireflies');
        });
        expect(result.current.currentEffect).toBe('fireflies');
    });

    it('currentEffectRef stays in sync after effect change', () => {
        const { result } = renderHook(() => useActiveEffect());
        act(() => {
            result.current.setCurrentEffect('fireflies');
        });
        expect(result.current.currentEffectRef.current).toBe('fireflies');
    });

    it('clearEffect resets the active effect to null', () => {
        const { result } = renderHook(() => useActiveEffect());
        act(() => {
            result.current.setCurrentEffect('fireflies');
        });
        act(() => {
            result.current.clearEffect();
        });
        expect(result.current.currentEffect).toBeNull();
    });

    it('clearEffect also resets the ref', () => {
        const { result } = renderHook(() => useActiveEffect());
        act(() => {
            result.current.setCurrentEffect('fireflies');
        });
        act(() => {
            result.current.clearEffect();
        });
        expect(result.current.currentEffectRef.current).toBeNull();
    });

    it('clearEffect is stable (same reference across renders)', () => {
        const { result, rerender } = renderHook(() => useActiveEffect());
        const first = result.current.clearEffect;
        rerender();
        expect(result.current.clearEffect).toBe(first);
    });
});
