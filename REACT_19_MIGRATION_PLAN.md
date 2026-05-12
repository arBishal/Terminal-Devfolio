# React 19 & Compiler Migration Plan

This document details the process of migrating the terminal portfolio to React 19 and integrating the React Compiler. This will allow us to drastically simplify the codebase by removing manual memoization (`useCallback`) and the `useRef` mirroring pattern we used to maintain stable closures.

## Migration Checklist

- `[ ]` **Dependencies**
  - `[ ]` Upgrade `react` to `^19.0.0`
  - `[ ]` Upgrade `react-dom` to `^19.0.0`
  - `[ ]` Upgrade `@types/react` to `^19.0.0`
  - `[ ]` Upgrade `@types/react-dom` to `^19.0.0`
  - `[ ]` Uninstall `@vitejs/plugin-react-swc`
  - `[ ]` Install `@vitejs/plugin-react`
  - `[ ]` Install `babel-plugin-react-compiler`

- `[ ]` **Configuration**
  - `[ ]` Update `vite.config.ts` to use `@vitejs/plugin-react`
  - `[ ]` Inject React Compiler Babel config into `vite.config.ts`

- `[ ]` **Component Refactoring (Removing Boilerplate)**
  - `[ ]` `src/components/Terminal.tsx`
    - `[ ]` Remove `isCommandsOpenRef` mirror pattern
    - `[ ]` Remove `useCallback` from focus handlers
  - `[ ]` `src/hooks/useCommandExecutor.tsx`
    - `[ ]` Remove `useCallback` from `executeCommand`
    - `[ ]` Use direct state values instead of `.current` refs
  - `[ ]` `src/hooks/useTerminalHistory.ts`
    - `[ ]` Remove `commandHistoryRef`
  - `[ ]` `src/hooks/useTheme.ts`
    - `[ ]` Remove `currentThemeNameRef`
  - `[ ]` `src/hooks/useActiveEffect.ts`
    - `[ ]` Remove `currentEffectRef`

- `[ ]` **Verification**
  - `[ ]` Run `npm run test`
  - `[ ]` Verify UI and mobile interactions manually
