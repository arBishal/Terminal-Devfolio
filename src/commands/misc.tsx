import { portfolioData } from "@/data/portfolioData";

export function renderLs() {
    const u = portfolioData.personal.username;
    return (
        <div className="pl-4 space-y-1 text-t-text text-sm font-mono">
            <p>drwxr-xr-x  5 {u} users  4096 Jan 14 2026{" "}<span className="text-t-accent">projects/</span></p>
            <p>drwxr-xr-x  2 {u} users  4096 Jan 14 2026{" "}<span className="text-t-accent">skills/</span></p>
            <p>-rw-r--r--  1 {u} users  2048 Jan 14 2026{" "}<span className="text-t-accent">about.txt</span></p>
            <p>-rw-r--r--  1 {u} users  1024 Jan 14 2026{" "}<span className="text-t-accent">contact.txt</span></p>
            <p>-rw-r--r--  1 {u} users  3072 Jan 14 2026{" "}<span className="text-t-accent">experience.log</span></p>
            <p>-rw-r--r--  1 {u} users  512  Jan 14 2026{" "}<span className="text-t-accent">resume.pdf</span></p>
        </div>
    );
}

export function renderPwd() {
    return (
        <p className="text-t-text">
            /home/{portfolioData.personal.username}/portfolio
        </p>
    );
}

export function renderWhoami() {
    return (
        <p className="text-t-text">
            {portfolioData.personal.shortName} — {portfolioData.personal.title}
        </p>
    );
}

export function renderDate() {
    return <p className="text-t-text">{new Date().toString()}</p>;
}

export function renderSudo() {
    return (
        <div className="space-y-1">
            <p className="text-t-error">Permission denied! 😱</p>
            <p className="text-t-muted">Nice try, but this portfolio is protected by plot armor.</p>
        </div>
    );
}

export function renderHack() {
    return (
        <div className="space-y-1">
            <p className="text-t-accent">Initiating hack sequence...</p>
            <p className="text-t-muted">Access Denied: Insufficient hacker skills</p>
            <p className="text-t-muted">Maybe try &apos;skills&apos; to level up first? 😉</p>
        </div>
    );
}

export function renderExit() {
    return (
        <div className="text-t-text">
            <p>Why leave so soon? 🥺</p>
            <p className="text-t-muted text-sm mt-1">
                Just type &apos;clear&apos; if you want a fresh start!
            </p>
        </div>
    );
}

export function renderHello() {
    return (
        <p className="text-t-text">Hello! 👋 Type &apos;help&apos; to see what I can do.</p>
    );
}

export function renderHistory(commandHistory: string[]) {
    return (
        <div className="space-y-1 text-t-text text-sm">
            {commandHistory.map((entry, idx) => (
                <p key={idx}>
                    <span className="text-t-muted">{idx + 1}</span>{"  "}
                    {entry}
                </p>
            ))}
        </div>
    );
}

export function renderCat(filename?: string) {
    if (!filename) {
        return "cat: missing file operand. Try 'cat about.txt' or just use the 'about' command!";
    }
    return `cat: ${filename}: No such file or directory`;
}

export function renderEcho(text?: string) {
    if (!text) {
        return <p className="text-t-text">Echo... echo... echo... 🔊</p>;
    }
    return <p className="text-t-text">{text}</p>;
}
