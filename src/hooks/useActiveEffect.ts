import { useState, useRef, useCallback } from "react";

export interface ActiveEffect {
  currentEffect: string | null;
  currentEffectRef: React.MutableRefObject<string | null>;
  setCurrentEffect: React.Dispatch<React.SetStateAction<string | null>>;
  clearEffect: () => void;
}

export function useActiveEffect(): ActiveEffect {
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);

  // Mirrors currentEffect so executeCommand can read latest value
  // without needing it as a useCallback dependency
  const currentEffectRef = useRef(currentEffect);
  currentEffectRef.current = currentEffect;

  const clearEffect = useCallback(() => setCurrentEffect(null), []);

  return { currentEffect, currentEffectRef, setCurrentEffect, clearEffect };
}
