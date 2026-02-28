import { portfolioData } from "@/data/portfolioData";

export function renderLs() {
    const u = portfolioData.personal.username;
    return (
        <div className="pl-4 space-y-1 theme-text text-sm font-mono">
            <p>drwxr-xr-x  5 {u} users  4096 Jan 14 2026{" "}<span className="theme-accent">projects/</span></p>
            <p>drwxr-xr-x  2 {u} users  4096 Jan 14 2026{" "}<span className="theme-accent">skills/</span></p>
            <p>-rw-r--r--  1 {u} users  2048 Jan 14 2026{" "}<span className="theme-accent">about.txt</span></p>
            <p>-rw-r--r--  1 {u} users  1024 Jan 14 2026{" "}<span className="theme-accent">contact.txt</span></p>
            <p>-rw-r--r--  1 {u} users  3072 Jan 14 2026{" "}<span className="theme-accent">experience.log</span></p>
            <p>-rw-r--r--  1 {u} users  512  Jan 14 2026{" "}<span className="theme-accent">resume.pdf</span></p>
        </div>
    );
}

export function renderPwd() {
    return (
        <p className="theme-text">
            /home/{portfolioData.personal.username}/portfolio
        </p>
    );
}

export function renderWhoami() {
    return (
        <p className="theme-text">
            {portfolioData.personal.shortName} — {portfolioData.personal.title}
        </p>
    );
}

export function renderDate() {
    return <p className="theme-text">{new Date().toString()}</p>;
}

export function renderSudo() {
    return (
        <div className="space-y-1">
            <p className="theme-error">Permission denied! 😱</p>
            <p className="theme-muted">Nice try, but this portfolio is protected by plot armor.</p>
        </div>
    );
}

export function renderHack() {
    return (
        <div className="space-y-1">
            <p className="theme-accent">Initiating hack sequence...</p>
            <p className="theme-muted">Access Denied: Insufficient hacker skills</p>
            <p className="theme-muted">Maybe try &apos;skills&apos; to level up first? 😉</p>
        </div>
    );
}

export function renderExit() {
    return (
        <div className="theme-text">
            <p>Why leave so soon? 🥺</p>
            <p className="theme-muted text-sm mt-1">
                Just type &apos;clear&apos; if you want a fresh start!
            </p>
        </div>
    );
}

export function renderHello() {
    return (
        <p className="theme-text">Hello! 👋 Type &apos;help&apos; to see what I can do.</p>
    );
}

export function renderHistory(commandHistory: string[]) {
    return (
        <div className="space-y-1 theme-text text-sm">
            {commandHistory.map((entry, idx) => (
                <p key={idx}>
                    <span className="theme-muted">{idx + 1}</span>{"  "}
                    {entry}
                </p>
            ))}
        </div>
    );
}

export function renderCat() {
    return "cat: missing file operand. Try 'cat about.txt' or just use the 'about' command!";
}

export function renderEcho() {
    return <p className="theme-text">Echo... echo... echo... 🔊</p>;
}
