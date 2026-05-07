/**
 * 3D perspective starfield — stars have (x, y, z) coordinates.
 * z decreases each frame (star flies toward viewer); screen position is
 * computed via perspective division: screenX = (x/z) * focal + cx.
 * Stars appear near the center and drift outward as they get closer.
 *
 * No hyper-jump. Just a smooth, cinematic cruise through space.
 *
 * Lifecycle: runs for STARFIELD_DURATION_MS, then `onComplete` is called.
 * Canvas uses `pointer-events: none` — terminal stays fully interactive.
 */
import { useEffect, useRef, useCallback } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const BASE_STAR_COUNT = 200;
const Z_FAR           = 1.0;   // farthest spawn depth
const Z_NEAR          = 0.005; // closest depth before respawn
const STAR_SPEED      = 0.003; // z decrease per frame — gentle cruise
const FOCAL_FACTOR    = 0.65;  // focal = canvas.width * FOCAL_FACTOR

const RADIUS_MIN  = 0.4; // px at far depth
const RADIUS_MAX  = 3.0; // px at near depth
const ALPHA_MIN   = 0.15;
const ALPHA_MAX   = 1.0;

const STARFIELD_DURATION_MS = 10_000;
const CANVAS_OPACITY        = 0.85;
const SPAWN_INTERVAL        = 1; // frames between each new star — fills in ~3s on desktop

const BP_SM = 640;
const BP_MD = 768;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Star {
    x:     number; // 3D x (constant)
    y:     number; // 3D y (constant)
    z:     number; // 3D depth (decreases each frame)
    isNew: boolean; // true after respawn — skip streak on first draw
    done:  boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStarCount(): number {
    const w = window.innerWidth;
    const mult = w < BP_SM ? 0.4 : w < BP_MD ? 0.65 : 1;
    return Math.floor(BASE_STAR_COUNT * mult);
}

function mapRange(v: number, a: number, b: number, c: number, d: number): number {
    return c + ((v - a) / (b - a)) * (d - c);
}

/**
 * Spawn a star at a random z depth with x,y chosen so the star is
 * within the visible frustum at that depth.
 */
function createStar(w: number, h: number, zOverride?: number): Star {
    const z       = zOverride ?? Math.random() * (Z_FAR - 0.05) + 0.05;
    const aspect  = h / w;
    const x       = (Math.random() * 2 - 1) * z;
    const y       = (Math.random() * 2 - 1) * z * aspect;
    return { x, y, z, isNew: true, done: false };
}

// ── Static style ──────────────────────────────────────────────────────────────
const CANVAS_STYLE: React.CSSProperties = {
    position:      "fixed",
    inset:         0,
    zIndex:        50,
    pointerEvents: "none",
    opacity:       CANVAS_OPACITY,
};

// ── Component ─────────────────────────────────────────────────────────────────
interface StarfieldCanvasProps {
    onComplete: () => void;
}

export function StarfieldCanvas({ onComplete }: StarfieldCanvasProps) {
    const canvasRef     = useRef<HTMLCanvasElement>(null);
    const starsRef      = useRef<Star[]>([]);
    const animFrameRef  = useRef<number>(0);
    const onCompleteRef = useRef(onComplete);
    const stoppingRef   = useRef(false);
    const activeCountRef = useRef(1);   // starts at 1, ramps up to full count
    const frameCountRef  = useRef(0);   // tracks frames for spawn timing
    onCompleteRef.current = onComplete;

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w     = canvas.width;
        const h     = canvas.height;
        const cx    = w / 2;
        const cy    = h / 2;
        const focal = w * FOCAL_FACTOR;

        ctx.clearRect(0, 0, w, h);

        const stars      = starsRef.current;
        const totalStars = stars.length;
        let allDone      = true;

        // Ramp up active star count one-by-one until all are live
        frameCountRef.current += 1;
        if (
            !stoppingRef.current &&
            activeCountRef.current < totalStars &&
            frameCountRef.current % SPAWN_INTERVAL === 0
        ) {
            activeCountRef.current += 1;
        }

        const activeCount = activeCountRef.current;

        for (let i = 0; i < activeCount; i++) {
            const star = stars[i];
            if (star.done) continue;
            allDone = false;

            // Screen position BEFORE advancing z (needed for streak start point)
            const prevSx = (star.x / star.z) * focal + cx;
            const prevSy = (star.y / star.z) * focal + cy;

            // Advance depth
            star.z -= STAR_SPEED;

            // Expired — respawn or mark done
            if (star.z <= Z_NEAR) {
                if (stoppingRef.current) { star.done = true; continue; }
                const s = createStar(w, h, Z_FAR);
                star.x = s.x; star.y = s.y; star.z = s.z; star.isNew = true;
                continue;
            }

            // Screen position AFTER advancing z
            const sx = (star.x / star.z) * focal + cx;
            const sy = (star.y / star.z) * focal + cy;

            // Off-screen — respawn or mark done
            if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) {
                if (stoppingRef.current) { star.done = true; continue; }
                const s = createStar(w, h, Z_FAR);
                star.x = s.x; star.y = s.y; star.z = s.z; star.isNew = true;
                continue;
            }

            // Visual properties — brighter and larger as z shrinks
            const t      = Math.max(0, Math.min(1, (Z_FAR - star.z) / (Z_FAR - Z_NEAR)));
            const alpha  = ALPHA_MIN + t * (ALPHA_MAX - ALPHA_MIN);
            const radius = RADIUS_MIN + t * (RADIUS_MAX - RADIUS_MIN);
            const color  = `rgba(210, 235, 255, ${alpha.toFixed(3)})`;

            // Streak — draw from previous to current position (skip on first frame)
            if (!star.isNew) {
                ctx.beginPath();
                ctx.moveTo(prevSx, prevSy);
                ctx.lineTo(sx, sy);
                ctx.strokeStyle = color;
                ctx.lineWidth   = radius * 0.6;
                ctx.shadowColor = "rgba(180, 220, 255, 0.5)";
                ctx.shadowBlur  = 3;
                ctx.stroke();
                ctx.shadowBlur  = 0;
            }
            star.isNew = false;

            // Dot
            ctx.beginPath();
            ctx.arc(sx, sy, radius, 0, Math.PI * 2);
            ctx.fillStyle   = color;
            ctx.shadowColor = "rgba(200, 230, 255, 0.8)";
            ctx.shadowBlur  = radius > 1.5 ? 6 : 2;
            ctx.fill();
            ctx.shadowBlur  = 0;
        }

        if (stoppingRef.current && allDone) {
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

        // Populate field with stars spread across all depths
        const count = getStarCount();
        starsRef.current = Array.from({ length: count }, () =>
            createStar(canvas.width, canvas.height)
        );

        animFrameRef.current = requestAnimationFrame(animate);

        const stopTimer = setTimeout(() => {
            stoppingRef.current = true;
        }, STARFIELD_DURATION_MS);

        return () => {
            window.removeEventListener("resize", resize);
            clearTimeout(resizeTimer);
            clearTimeout(stopTimer);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [animate]);

    return <canvas ref={canvasRef} style={CANVAS_STYLE} />;
}
