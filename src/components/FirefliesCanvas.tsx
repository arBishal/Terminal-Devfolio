/**
 * Ambient firefly animation rendered as a fixed full-screen canvas overlay.
 *
 * Lifecycle:
 *  - Fireflies spawn at random positions anywhere on screen, one at a time.
 *  - Each drifts in a random direction and exits permanently when off-screen.
 *  - Once all have been spawned and have exited, `onComplete` is called.
 *
 * The canvas uses `pointer-events: none` so the terminal remains fully interactive.
 */
import { useEffect, useRef, useCallback } from "react";

// ── Firefly constants ─────────────────────────────────────────────────────────
const FIREFLY_COLOR     = "#ddff11";
const SIZE_MIN          = 2;
const SIZE_MAX          = 6;
const SPEED_MIN         = 0.3;  // px/frame before multiplier
const SPEED_MAX         = 1.0;
const SPEED_MULTIPLIER  = 1.5;
const PULSE_SPEED       = 0.015;
const MIN_ALPHA         = 0.1;
const MAX_ALPHA         = 1;
const GLOW_BLUR         = 8;
const BASE_COUNT        = 80;
const SPAWN_INTERVAL    = 8;    // frames between each new firefly appearing
const FADE_IN_SPEED     = 0.06; // alpha/frame during initial fade-in (~10 frames to be visible)

// Mobile breakpoints
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
    fadingIn: boolean; // true until the initial fade-in is complete
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

/**
 * Spawn a firefly at a random position anywhere on screen,
 * drifting in a fully random direction.
 */
function createFirefly(canvasW: number, canvasH: number): Firefly {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (SPEED_MAX - SPEED_MIN) + SPEED_MIN;
    return {
        x:        Math.random() * canvasW,
        y:        Math.random() * canvasH,
        r:        Math.random() * (SIZE_MAX - SIZE_MIN) + SIZE_MIN,
        dx:       Math.cos(angle) * speed,
        dy:       Math.sin(angle) * speed,
        alpha:    0,              // start invisible — fade in naturally
        pulseDir: 1,
        fadingIn: true,
    };
}

interface FirefliesCanvasProps {
    onComplete: () => void;
}

const CANVAS_STYLE: React.CSSProperties = {
    position:      "fixed",
    inset:         0,
    zIndex:        50,
    pointerEvents: "none",
};

export function FirefliesCanvas({ onComplete }: FirefliesCanvasProps) {
    const canvasRef     = useRef<HTMLCanvasElement>(null);
    const activeRef     = useRef<Firefly[]>([]);   // currently visible flies
    const pendingRef    = useRef<Firefly[]>([]);   // pre-computed, waiting to activate
    const animFrameRef  = useRef<number>(0);
    const frameCountRef = useRef<number>(0);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w   = canvas.width;
        const h   = canvas.height;
        const rgb = hexToRgb(FIREFLY_COLOR);

        ctx.clearRect(0, 0, w, h);

        // Activate one new firefly every SPAWN_INTERVAL frames
        frameCountRef.current += 1;
        if (pendingRef.current.length > 0 && frameCountRef.current % SPAWN_INTERVAL === 0) {
            activeRef.current.push(pendingRef.current.shift()!);
        }

        const flies = activeRef.current;

        // Iterate in reverse so splice() doesn't skip elements
        for (let i = flies.length - 1; i >= 0; i--) {
            const f = flies[i];

            // ── Fade-in on spawn, then normal pulse ──
            if (f.fadingIn) {
                f.alpha += FADE_IN_SPEED;
                if (f.alpha >= MIN_ALPHA + 0.15) {
                    f.fadingIn = false; // hand off to pulse cycle
                }
            } else {
                f.alpha += f.pulseDir * PULSE_SPEED;
                if (f.alpha >= MAX_ALPHA) { f.alpha = MAX_ALPHA; f.pulseDir = -1; }
                else if (f.alpha <= MIN_ALPHA) { f.alpha = MIN_ALPHA; f.pulseDir = 1; }
            }

            // ── Move ──
            f.x += f.dx * SPEED_MULTIPLIER;
            f.y += f.dy * SPEED_MULTIPLIER;

            // ── Remove permanently if off any edge ──
            if (f.y < -f.r || f.y > h + f.r || f.x < -f.r || f.x > w + f.r) {
                flies.splice(i, 1);
                continue;
            }

            // ── Draw ──
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            const colorStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${f.alpha})`;
            ctx.fillStyle   = colorStr;
            ctx.shadowColor = colorStr;
            ctx.shadowBlur  = GLOW_BLUR;
            ctx.fill();
        }

        ctx.shadowBlur = 0;

        // Done when all flies have been spawned and all active ones have exited
        if (pendingRef.current.length === 0 && flies.length === 0) {
            onCompleteRef.current();
            return;
        }

        animFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let resizeTimer: ReturnType<typeof setTimeout>;
        const resize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                canvas.width  = window.innerWidth;
                canvas.height = window.innerHeight;
            }, 150);
        };
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener("resize", resize);

        // Pre-compute all flies — they'll be activated one by one in animate()
        const count = getScreenCount();
        const pending: Firefly[] = [];
        for (let i = 0; i < count; i++) {
            pending.push(createFirefly(canvas.width, canvas.height));
        }
        pendingRef.current  = pending;
        activeRef.current   = [];
        frameCountRef.current = 0;

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            clearTimeout(resizeTimer);
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
