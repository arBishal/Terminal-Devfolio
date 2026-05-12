import { useEffect, useRef } from "react";

const awakeCat = ` /\\_/\\ \n( o.o )\n > ^ < `;
const asleepCat = ` /\\_/\\ \n( -.- ) zZz\n > ^ < `;
const pettingCat = ` /\\_/\\ \n( ^.^ ) ♡\n > ^ < `;

let lastKnownMousePos = { x: -100, y: -100 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    lastKnownMousePos = { x: e.clientX, y: e.clientY };
  });
}

/**
 * A hidden easter egg component that spawns a small ASCII cat following the cursor.
 * 
 * Performance Note:
 * This component completely bypasses React state (`useState`) for its animation loop.
 * It uses a `requestAnimationFrame` loop with Linear Interpolation (Lerp) and directly 
 * mutates the DOM via refs (`cursorRef.current.style.transform` and `textContent`).
 * This ensures the 60fps tracking animation runs perfectly smooth without triggering 
 * any React component re-renders.
 */
export function CatCompanion() {
  const posRef = useRef({ x: lastKnownMousePos.x, y: lastKnownMousePos.y });
  const targetRef = useRef({ x: lastKnownMousePos.x, y: lastKnownMousePos.y });
  const idleTimeoutRef = useRef<number | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isIdle: false, isPetting: false });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      if (stateRef.current.isIdle) {
        stateRef.current.isIdle = false;
      }

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = window.setTimeout(() => {
        stateRef.current.isIdle = true;
      }, 2000);
    };

    const handlePointerDown = () => {
      stateRef.current.isPetting = true;
      stateRef.current.isIdle = false;
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };

    const handlePointerUp = () => {
      stateRef.current.isPetting = false;
      idleTimeoutRef.current = window.setTimeout(() => {
        stateRef.current.isIdle = true;
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    let animationFrameId: number;
    const updatePosition = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;

      // Lerp
      posRef.current.x += dx * 0.1;
      posRef.current.y += dy * 0.1;

      if (cursorRef.current) {
        // Offset slightly so it's not directly under the cursor
        cursorRef.current.style.transform = `translate(${posRef.current.x + 15}px, ${posRef.current.y + 15}px)`;

        // Determine correct visual state
        let currentCat = awakeCat;
        if (stateRef.current.isPetting) {
          currentCat = pettingCat;
        } else if (stateRef.current.isIdle) {
          currentCat = asleepCat;
        }

        // Only update DOM if the string actually changed (avoids expensive layout recalculations)
        if (cursorRef.current.textContent !== currentCat) {
          cursorRef.current.textContent = currentCat;
        }
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 text-t-accent font-mono text-xs leading-tight whitespace-pre"
    >
      {awakeCat}
    </div>
  );
}
