import { portfolioData } from "../data/data";

export function renderAbout() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ whoami</p>
            <div className="pl-4 space-y-1 theme-text">
                {portfolioData.personal.bio.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
            <div className="mt-2 pl-4">
                <p className="theme-accent2">Location:</p>
                <p className="theme-text pl-4">{portfolioData.personal.location}</p>
                <p className="theme-accent2 mt-1">Education:</p>
                {portfolioData.personal.education.map((line, i) => (
                    <p key={i} className="theme-text pl-4">{line}</p>
                ))}
            </div>
        </div>
    );
}

export function renderSkills() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ cat skills.json</p>
            <div className="pl-4 font-mono text-sm">
                <p className="theme-muted">{"{"}</p>
                <div className="pl-4">
                    {(Object.entries(portfolioData.skills) as [string, string[]][]).map(
                        ([key, values], i, arr) => (
                            <p key={key}>
                                <span className="theme-accent2">&quot;{key}&quot;</span>
                                {": "}
                                <span className="theme-text">
                                    [{values.map((v) => `"${v}"`).join(", ")}]
                                </span>
                                {i < arr.length - 1 ? "," : ""}
                            </p>
                        ),
                    )}
                </div>
                <p className="theme-muted">{"}"}</p>
            </div>
        </div>
    );
}

export function renderProjects() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ ls -la ~/projects/</p>
            <div className="space-y-2 pl-4">
                {portfolioData.projects.map((project) => (
                    <div key={project.name} className="border-l-2 theme-border pl-4">
                        <p className="theme-accent2 font-semibold">{project.name}</p>
                        <p className="theme-text text-sm mt-1">{project.description}</p>
                        <p className="theme-muted text-sm mt-2">
                            Tech: {project.tech.join(" • ")}
                        </p>
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-accent2 text-sm hover:underline"
                        >
                            → View Project
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function renderExperience() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ cat experience.log</p>
            <div className="space-y-4 pl-4">
                {portfolioData.experience.map((job) => (
                    <div key={job.company} className="border-l-2 theme-border pl-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <p className="theme-accent2 font-semibold">{job.title}</p>
                            <p className="theme-muted text-sm">{job.period}</p>
                        </div>
                        <p className="theme-accent2 text-sm opacity-75">{job.company}</p>
                        <ul className="theme-text text-sm mt-2 space-y-1 list-disc list-inside">
                            {job.achievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Called as a side effect in the command executor, BEFORE renderResume() */
export function triggerResumeDownload() {
    const link = document.createElement("a");
    link.href = portfolioData.resume.filePath;
    link.download = portfolioData.resume.downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function renderResume() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ wget resume.pdf</p>
            <div className="pl-4 space-y-1">
                <p className="theme-text">Downloading resume...</p>
                <div className="flex items-center gap-2">
                    <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-full theme-accent-bg animate-pulse"></div>
                    </div>
                    <span className="theme-accent">100%</span>
                </div>
                <p className="theme-accent2 mt-1">✓ Resume download initiated successfully!</p>
                <a
                    href={portfolioData.resume.filePath}
                    download={portfolioData.resume.downloadFilename}
                    className="inline-block mt-1 px-4 py-2 theme-accent-bg rounded hover:opacity-80 transition-colors font-medium"
                >
                    Click here if download doesn&apos;t start
                </a>
            </div>
        </div>
    );
}

export function renderContact() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ cat contact.txt</p>
            <div className="pl-4">
                <div className="flex items-center gap-3">
                    <span className="theme-accent2">Email:</span>
                    <a
                        href={`mailto:${portfolioData.contact.email}`}
                        className="theme-text hover:underline"
                    >
                        {portfolioData.contact.email}
                    </a>
                </div>
                {portfolioData.contact.links.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <span className="theme-accent2">{item.label}:</span>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-text hover:underline"
                        >
                            {item.display}
                        </a>
                    </div>
                ))}
            </div>
            <p className="theme-muted mt-2 pl-4 text-sm">{portfolioData.contact.note}</p>
        </div>
    );
}

export function renderBlog() {
    return (
        <div className="space-y-2">
            <p className="theme-warning">$ cat blog-links.txt</p>
            <div className="pl-4">
                <p className="theme-text mb-2">
                    Check out my articles and technical writing:
                </p>
                {portfolioData.blog.links.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span className="theme-accent2">{item.label}:</span>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-text hover:underline"
                        >
                            {item.display}
                        </a>
                    </div>
                ))}
            </div>
            <p className="theme-muted mt-2 pl-4 text-sm">{portfolioData.blog.tagline}</p>
        </div>
    );
}
