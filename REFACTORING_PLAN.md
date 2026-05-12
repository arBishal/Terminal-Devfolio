# Codebase Refactoring Plan

Based on the codebase audit, the following improvements have been identified to enhance readability, maintainability, and adherence to standard programming practices (SOLID, DRY, KISS).

## 1. Extract Shared Canvas Logic (DRY Principle)
Currently, `StarfieldCanvas`, `FirefliesCanvas`, and `MatrixRainCanvas` duplicate the `window.addEventListener("resize", ...)` logic with debouncing and cleanup.

- [x] Create `src/hooks/useCanvasResize.ts` to encapsulate the debounce and resize logic.
- [x] Refactor `StarfieldCanvas.tsx` to use the new hook.
- [x] Refactor `FirefliesCanvas.tsx` to use the new hook.
- [x] Refactor `MatrixRainCanvas.tsx` to use the new hook.

## 2. Centralize Types
Types like `OutputLine` are currently defined inside `useCommandExecutor.tsx` but are used across multiple components (e.g., `TerminalOutput.tsx` and `useTerminalHistory.ts`), creating slightly tangled imports. 

**Extraction Plan:**
1. **Create `src/types/terminal.ts`:**
   - Extract `OutputLine` from `src/hooks/useCommandExecutor.tsx`.
   - Prepare a new `CommandContext` interface (needed for Step 4).
   - *Note: Component-specific props (like `TerminalHeaderProps`) will remain in their respective files to maintain co-location.*
2. **Create `src/types/portfolio.ts`:**
   - Extract `PortfolioData` and all related sub-interfaces from `src/data/portfolioData.ts`.
3. **Update Imports:**
   - [x] `src/hooks/useCommandExecutor.tsx`
   - [x] `src/hooks/useTerminalHistory.ts`
   - [x] `src/components/TerminalOutput.tsx`
   - [x] Associated test files in `src/__tests__/`
   - [x] `src/data/portfolioData.ts`

## 3. Simplify `CommandLine.tsx`
The input component currently handles its own autocomplete and history navigation logic, intertwining UI and business logic.

- [x] Extract autocomplete matching logic into a new hook (e.g., `src/hooks/useAutocomplete.ts`).
- [x] Extract history navigation (`ArrowUp`/`ArrowDown`) logic into a new hook (e.g., `src/hooks/useHistoryNavigation.ts`).
- [x] Update `CommandLine.tsx` to consume these clean, focused hooks.

## 4. Refactor `useCommandExecutor.tsx` (Open-Closed Principle)
This hook is currently a bottleneck. It acts as a massive router with hardcoded `if/else` statements for parameterized commands (`theme`, `fun`, `echo`, `cat`) and a large `commandMap`.

- [x] Define a `CommandContext` interface containing necessary methods (`push`, `setCurrentThemeName`, `executeCommand`, etc.).
- [x] Move the logic for parameterized commands (`theme`, `fun`, `echo`, `cat`) out of the hook and into modular handler functions within `src/commands/`.
- [x] Refactor `useCommandExecutor` to act as a simple dispatcher that looks up commands dynamically and passes the `CommandContext` to them.
