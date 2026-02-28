/**
 * Ambient firefly animation rendered as a fixed full-screen canvas overlay.
 * Visuals (color, size, speed, pulse) are ported from the standalone Fireflies project.
 *
 * Lifecycle: fireflies spawn at the bottom, drift upward, and leave permanently.
 * Once all have exited, `onComplete` is called so Terminal can unmount this component.
 *
 * The canvas uses `pointer-events: none` so the terminal remains fully interactive.
 */
import { useEffect, useRef, useCallback } from "react";

// ── Firefly constants (ported from Fireflies repo defaults) ──────────────
const FIREFLY_COLOR = "#ddff11";
const SIZE_MIN = 2;
const SIZE_MAX = 6;
const SPEED_MULTIPLIER = 1;
const PULSE_SPEED = 0.015;
const MIN_ALPHA = 0.1;
const MAX_ALPHA = 1;
const DRIFT_RANGE_X: [number, number] = [-0.5, 0.5];
const GLOW_BLUR = 8;
const BASE_COUNT = 80;

// Mobile breakpoints (same as Fireflies repo)
const BP_SM = 640;
const BP_MD = 768;

interface Firefly {
    x: number;
    y: number;
    r: number;
    dx: number;
    dy: number;
    alpha: number;
    pulseDir: 1 | -1;
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 255, g: 255, b: 0 };
}

function getScreenCount() {
    const w = window.innerWidth;
    const mult = w < BP_SM ? 0.5 : w < BP_MD ? 0.75 : 1;
    return Math.floor(BASE_COUNT * mult);
}

/** Spawn a single firefly at a random x along the bottom edge. */
function createFirefly(canvasW: number, canvasH: number): Firefly {
    return {
        x: Math.random() * canvasW,
        y: canvasH,
        r: Math.random() * (SIZE_MAX - SIZE_MIN) + SIZE_MIN,
        dx: Math.random() * (DRIFT_RANGE_X[1] - DRIFT_RANGE_X[0]) + DRIFT_RANGE_X[0],
        dy: -(Math.random() * 0.8 + 0.2), // always upward
        alpha: Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA,
        pulseDir: Math.random() > 0.5 ? 1 : -1,
    };
}

interface FirefliesCanvasProps {
    onComplete: () => void;
}

// Hoisted static style — avoids re-creation on every render (rendering-hoist-jsx)
const CANVAS_STYLE: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    pointerEvents: "none",
};

export function FirefliesCanvas({ onComplete }: FirefliesCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const firefliesRef = useRef<Firefly[]>([]);   // mutable array — mutated in-place during animation
    const animFrameRef = useRef<number>(0);
    const onCompleteRef = useRef(onComplete);      // ref so animate() never goes stale
    onCompleteRef.current = onComplete;

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const rgb = hexToRgb(FIREFLY_COLOR);

        ctx.clearRect(0, 0, w, h);

        const flies = firefliesRef.current;

        // Iterate in reverse so splice() doesn't skip elements
        for (let i = flies.length - 1; i >= 0; i--) {
            const f = flies[i];

            // ── Pulse ──
            f.alpha += f.pulseDir * PULSE_SPEED;
            if (f.alpha >= MAX_ALPHA) { f.alpha = MAX_ALPHA; f.pulseDir = -1; }
            else if (f.alpha <= MIN_ALPHA) { f.alpha = MIN_ALPHA; f.pulseDir = 1; }

            // ── Move ──
            f.x += f.dx * SPEED_MULTIPLIER;
            f.y += f.dy * SPEED_MULTIPLIER;

            // ── Remove if off-screen ──
            if (f.y < -f.r || f.x < -f.r || f.x > w + f.r) {
                flies.splice(i, 1);
                continue;
            }

            // ── Draw ──
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            const colorStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${f.alpha})`;
            ctx.fillStyle = colorStr;
            ctx.shadowColor = colorStr;
            ctx.shadowBlur = GLOW_BLUR;
            ctx.fill();
        }

        // Reset shadow so it doesn't bleed into clearRect next frame
        ctx.shadowBlur = 0;

        // All fireflies have left — signal Terminal to unmount this canvas
        if (flies.length === 0) {
            onCompleteRef.current();
            return;
        }

        animFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Size canvas to viewport
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Spawn fireflies
        const count = getScreenCount();
        const flies: Firefly[] = [];
        for (let i = 0; i < count; i++) {
            flies.push(createFirefly(canvas.width, canvas.height));
        }
        firefliesRef.current = flies;

        // Start animation
        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [animate]);

    return (
        <canvas
            ref={canvasRef}
            style={CANVAS_STYLE}
        />
    );
}
