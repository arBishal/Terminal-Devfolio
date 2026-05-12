import { portfolioData } from "@/data/portfolioData";

export function renderAbout() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ whoami</p>
            <div className="pl-4 space-y-1 text-t-text">
                {portfolioData.personal.bio.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
            <div className="mt-2 pl-4">
                <p className="text-t-accent2">Location:</p>
                <p className="text-t-text pl-4">{portfolioData.personal.location}</p>
                <p className="text-t-accent2 mt-1">Education:</p>
                {portfolioData.personal.education.map((line, i) => (
                    <p key={i} className="text-t-text pl-4">{line}</p>
                ))}
            </div>
        </div>
    );
}

export function renderSkills() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat skills.json</p>
            <div className="pl-4 font-mono text-sm">
                <p className="text-t-muted">{"{"}</p>
                <div className="pl-4">
                    {(Object.entries(portfolioData.skills) as [string, string[]][]).map(
                        ([key, values], i, arr) => (
                            <p key={key}>
                                <span className="text-t-accent2">&quot;{key}&quot;</span>
                                {": "}
                                <span className="text-t-text">
                                    [{values.map((v) => `"${v}"`).join(", ")}]
                                </span>
                                {i < arr.length - 1 ? "," : ""}
                            </p>
                        ),
                    )}
                </div>
                <p className="text-t-muted">{"}"}</p>
            </div>
        </div>
    );
}

export function renderProjects() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ ls -la ~/projects/</p>
            <div className="space-y-2 pl-4">
                {portfolioData.projects.map((project) => (
                    <div key={project.name} className="border-l-2 border-t-border pl-4">
                        <p className="text-t-accent font-semibold">{project.name}</p>
                        <p className="text-t-text text-sm mt-1">{project.description}</p>
                        <p className="text-t-muted text-sm mt-2">
                            Tech: {project.tech.join(" • ")}
                        </p>
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-t-accent2 text-sm hover:underline"
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
            <p className="text-t-warning">$ cat experience.log</p>
            <div className="space-y-4 pl-4">
                {portfolioData.experience.map((job, index) => (
                    <div key={`${job.company}-${index}`} className="border-l-2 border-t-border pl-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <p className="text-t-accent2 font-semibold">{job.title}</p>
                            <p className="text-t-muted text-sm">{job.period}</p>
                        </div>
                        <p className="text-t-accent2 text-sm opacity-75">{job.company}</p>
                        <ul className="text-t-text text-sm mt-2 space-y-1 list-disc list-inside">
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

export function renderResume() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ wget resume.pdf</p>
            <div className="pl-4 space-y-1">
                <p className="text-t-text">Downloading resume...</p>
                <div className="flex items-center gap-2">
                    <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-t-accent text-t-btn-text animate-pulse"></div>
                    </div>
                    <span className="text-t-accent">100%</span>
                </div>
                <p className="text-t-accent2 mt-1">✓ Resume download initiated successfully!</p>
                <a
                    href={portfolioData.resume.filePath}
                    download={portfolioData.resume.downloadFilename}
                    className="inline-block mt-1 px-4 py-2 bg-t-accent text-t-btn-text rounded hover:opacity-80 transition-colors font-medium"
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
            <p className="text-t-warning">$ cat contact.txt</p>
            <div className="pl-4">
                <div className="flex items-center gap-3">
                    <span className="text-t-accent2">Email:</span>
                    <a
                        href={`mailto:${portfolioData.contact.email}`}
                        className="text-t-text hover:underline"
                    >
                        {portfolioData.contact.email}
                    </a>
                </div>
                {portfolioData.contact.links.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                        <span className="text-t-accent2">{item.label}:</span>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-t-text hover:underline"
                        >
                            {item.display}
                        </a>
                    </div>
                ))}
            </div>
            <p className="text-t-muted mt-2 pl-4 text-sm">{portfolioData.contact.note}</p>
        </div>
    );
}

export function renderBlog() {
    return (
        <div className="space-y-2">
            <p className="text-t-warning">$ cat blog-links.txt</p>
            <div className="pl-4">
                <p className="text-t-text mb-2">
                    Check out my articles and technical writing:
                </p>
                {portfolioData.blog.links.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span className="text-t-accent2">{item.label}:</span>
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-t-text hover:underline"
                        >
                            {item.display}
                        </a>
                    </div>
                ))}
            </div>
            <p className="text-t-muted mt-2 pl-4 text-sm">{portfolioData.blog.tagline}</p>
        </div>
    );
}
