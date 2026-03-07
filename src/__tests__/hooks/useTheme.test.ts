import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/useTheme';
import { defaultTheme, themeNames } from '@/themes/themes';

describe('useTheme', () => {
    it('initialises with the default theme', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.currentThemeName).toBe(defaultTheme);
    });

    it('currentThemeNameRef mirrors currentThemeName on mount', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.currentThemeNameRef.current).toBe(defaultTheme);
    });

    it('setCurrentThemeName updates the theme', () => {
        const { result } = renderHook(() => useTheme());
        act(() => {
            result.current.setCurrentThemeName('light');
        });
        expect(result.current.currentThemeName).toBe('light');
    });

    it('currentThemeNameRef stays in sync after theme change', () => {
        const { result } = renderHook(() => useTheme());
        act(() => {
            result.current.setCurrentThemeName('ubuntu');
        });
        expect(result.current.currentThemeNameRef.current).toBe('ubuntu');
    });

    it('accepts all valid theme names without type errors', () => {
        const { result } = renderHook(() => useTheme());
        for (const theme of themeNames) {
            act(() => {
                result.current.setCurrentThemeName(theme);
            });
            expect(result.current.currentThemeName).toBe(theme);
        }
    });
});
