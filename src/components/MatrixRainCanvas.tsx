/**
 * Matrix-style digital rain rendered as a fixed full-screen canvas overlay.
 *
 * Character set: Katakana + Bengali (Bangla) script + Bangla digits,
 * giving the rain a personal deshi twist alongside the classic Matrix aesthetic.
 *
 * Transparency approach: the canvas is cleared with clearRect every frame and
 * each character is drawn with an individual rgba alpha. This keeps the canvas
 * background fully transparent so the terminal beneath stays readable, exactly
 * like the FirefliesCanvas approach.
 *
 * Lifecycle: runs for RAIN_DURATION_MS, then calls `onComplete` so Terminal
 * can unmount this component.
 *
 * The canvas uses `pointer-events: none` so the terminal remains fully interactive.
 */
import { useEffect, useRef, useCallback } from "react";

// ── Character sets ────────────────────────────────────────────────────────────
// Katakana, Bengali consonants + vowels, and Bangla digits.
// const KATAKANA = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
const BENGALI = "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহঅআইঈউঊএঐওঔ";
const DIGITS = "০১২৩৪৫৬৭৮৯";

const CHARSET = (BENGALI + DIGITS).split("");

// ── Visual constants ──────────────────────────────────────────────────────────
const FONT_SIZE = 16;    // px — cell height
const COL_WIDTH = 20;    // px — column pitch
// Head alpha and trail decay
const HEAD_ALPHA = 1.0;   // fully opaque leading character
const ALPHA_DECAY = 0.018; // slow decay → ~40-frame trails (~12–15 cells)
const ALPHA_CUTOFF = 0.02;  // remove cells below this alpha
// How often (in frames) a cell randomly swaps its character
const SCRAMBLE_RATE = 0.06;  // probability per cell per frame

// ── Speed + timing ────────────────────────────────────────────────────────────
const SPEED_MIN = 0.30; // cells per frame
const SPEED_MAX = 0.90;
const RAIN_DURATION_MS = 9000; // total run time before onComplete

// Mobile breakpoints
const BP_SM = 640;
const BP_MD = 768;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Cell {
    char: string;
    cellY: number; // row index (integer)
    alpha: number; // 0–HEAD_ALPHA
}

interface Column {
    x: number;
    headY: number;  // current head row (fractional, advances each frame)
    speed: number;  // rows per frame
    lastRow: number;  // last integer row that got a head cell
    cells: Cell[];  // active cells in this column
    done: boolean; // no active cells remaining after stopping
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function randomChar(): string {
    return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

function getColumnCount(canvasW: number): number {
    const baseCols = Math.floor(canvasW / COL_WIDTH);
    const w = window.innerWidth;
    const mult = w < BP_SM ? 0.5 : w < BP_MD ? 0.75 : 1;
    return Math.max(1, Math.floor(baseCols * mult));
}

function createColumn(x: number, canvasH: number): Column {
    const rows = Math.ceil(canvasH / FONT_SIZE);
    return {
        x,
        headY: -(Math.random() * rows), // staggered above viewport
        speed: Math.random() * (SPEED_MAX - SPEED_MIN) + SPEED_MIN,
        lastRow: -Infinity,
        cells: [],
        done: false,
    };
}

// ── Static canvas style ───────────────────────────────────────────────────────
const CANVAS_STYLE: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    pointerEvents: "none",
    opacity: 0.45, // subtle background — raise for more presence
};

// ── Component ─────────────────────────────────────────────────────────────────
interface MatrixRainCanvasProps {
    onComplete: () => void;
}

export function MatrixRainCanvas({ onComplete }: MatrixRainCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const columnsRef = useRef<Column[]>([]);
    const animFrameRef = useRef<number>(0);
    const onCompleteRef = useRef(onComplete);
    const stoppingRef = useRef(false);
    onCompleteRef.current = onComplete;

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const rows = Math.ceil(h / FONT_SIZE);

        // Fully clear canvas each frame — keeps the background transparent
        ctx.clearRect(0, 0, w, h);

        ctx.font = `bold ${FONT_SIZE}px monospace`;
        ctx.textAlign = "center";

        const cols = columnsRef.current;

        for (const col of cols) {
            if (col.done) continue;

            // ── Advance head ──────────────────────────────────────────────────
            col.headY += col.speed;
            const currentRow = Math.floor(col.headY);

            // Spawn a new head cell for every new integer row reached
            if (!stoppingRef.current && currentRow > col.lastRow) {
                col.lastRow = currentRow;
                col.cells.push({ char: randomChar(), cellY: currentRow, alpha: HEAD_ALPHA });
            }

            // ── Update + draw cells ───────────────────────────────────────────
            for (let i = col.cells.length - 1; i >= 0; i--) {
                const cell = col.cells[i];
                const isHead = i === col.cells.length - 1 && !stoppingRef.current;

                // Decay non-head cells
                if (!isHead) cell.alpha -= ALPHA_DECAY;

                // Occasionally scramble character
                if (Math.random() < SCRAMBLE_RATE) cell.char = randomChar();

                // Remove fully faded cells
                if (cell.alpha <= ALPHA_CUTOFF) {
                    col.cells.splice(i, 1);
                    continue;
                }

                // Skip off-screen cells
                const py = cell.cellY * FONT_SIZE;
                if (py < -FONT_SIZE || py > h + FONT_SIZE) continue;

                // ── Draw ──────────────────────────────────────────────────────
                if (isHead) {
                    // Head: bright white-green glow
                    ctx.fillStyle = `rgba(220, 255, 220, ${cell.alpha})`;
                    ctx.shadowColor = "rgba(0, 255, 65, 0.9)";
                    ctx.shadowBlur = 10;
                } else {
                    // Trail: green, fading
                    ctx.fillStyle = `rgba(0, 210, 60, ${cell.alpha})`;
                    ctx.shadowColor = "rgba(0, 200, 50, 0.4)";
                    ctx.shadowBlur = cell.alpha > 0.4 ? 4 : 0;
                }

                ctx.fillText(cell.char, col.x + COL_WIDTH / 2, py + FONT_SIZE);
                ctx.shadowBlur = 0;
            }

            // ── Mark column done ──────────────────────────────────────────────
            // A column is fully drained once it has no active cells left.
            // We don't need headY > rows: a column that never entered the viewport
            // (headY still negative when stopping fired) also has no cells, and
            // waiting for it to scroll all the way off-screen would delay onComplete
            // by several seconds and block re-activation.
            if (stoppingRef.current && col.cells.length === 0) {
                col.done = true;
            }
        }

        // All columns drained — call onComplete
        if (stoppingRef.current && cols.every((c) => c.done)) {
            onCompleteRef.current();
            return;
        }

        animFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Size canvas to viewport
        let resizeTimer: ReturnType<typeof setTimeout>;
        const resize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, 150);
        };
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener("resize", resize);

        // Spawn columns
        const colCount = getColumnCount(canvas.width);
        const cols: Column[] = [];
        for (let i = 0; i < colCount; i++) {
            cols.push(createColumn(i * COL_WIDTH, canvas.height));
        }
        columnsRef.current = cols;

        // Start animation
        animFrameRef.current = requestAnimationFrame(animate);

        // After RAIN_DURATION_MS, signal columns to drain off
        const stopTimer = setTimeout(() => {
            stoppingRef.current = true;
        }, RAIN_DURATION_MS);

        return () => {
            window.removeEventListener("resize", resize);
            clearTimeout(resizeTimer);
            clearTimeout(stopTimer);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [animate]);

    return <canvas ref={canvasRef} style={CANVAS_STYLE} />;
}
