import { useEffect } from "react";

/**
 * A hook that handles full-screen canvas sizing.
 * It immediately sets the canvas dimensions to match the window,
 * and adds a debounced resize listener to keep it updated.
 */
export function useCanvasResize(canvasRef: React.RefObject<HTMLCanvasElement>) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let resizeTimer: ReturnType<typeof setTimeout>;
        
        const resize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }, 150);
        };

        // Initial sizing
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            clearTimeout(resizeTimer);
        };
    }, [canvasRef]);
}
