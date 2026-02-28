// ============================================================
// Portfolio Data
// ============================================================
// Edit this file to update all portfolio content.
// No changes to component code are needed.
// ============================================================

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link: string;
}

export interface Experience {
  title: string;
  period: string;
  company: string;
  achievements: string[];
}

export interface ContactLink {
  label: string;
  url: string;
  display: string;
}

export interface BlogLink {
  label: string;
  url: string;
  display: string;
}

export interface Skills {
  programming: string[];
  webStack: string[];
  databases: string[];
  tools: string[];
  practices: string[];
}

export interface CommandInfo {
  name: string;
  description: string;
}

export interface Personal {
  fullName: string;
  shortName: string;
  title: string;
  username: string;
  location: string;
  education: string[];
  bio: string[];
  asciiArt: string;
  portfolioVersion: string;
}

export interface Resume {
  filePath: string;
  downloadFilename: string;
}

export interface Contact {
  email: string;
  links: ContactLink[];
  note: string;
}

export interface Blog {
  tagline: string;
  links: BlogLink[];
}

export interface PortfolioData {
  personal: Personal;
  resume: Resume;
  skills: Skills;
  projects: Project[];
  experience: Experience[];
  contact: Contact;
  blog: Blog;
  commands: CommandInfo[];
}

export const portfolioData: PortfolioData = {
  // ----------------------------------------------------------
  // Personal Info
  // ----------------------------------------------------------
  personal: {
    fullName: "Ashikur Rahman",
    shortName: "Bishal",
    title: "Frontend-focused Software Engineer",
    username: "arBishal",
    location: "Dhaka, Bangladesh",
    education: [
      "B.Sc in Computer Science & Engineering",
      "Shahjalal University of Science & Technology",
    ],
    bio: [
      "A frontend-leaning software engineer crafting seamless, user-first experiences—driven by detail, design, and a dash of storytelling.",
      "Currently, at Dynamic Solution Innovators Ltd., supporting the digital operations of 190+ financial institutions, including credit unions and banks, impacting over 85+ million end users.",
      "Engineering digital solutions for millions by day; chasing ideas through code, visuals, and words by night. Has a strong affinity for building fun, visually striking products that feel as good as they look. Always creating. Always telling stories.",
    ],
    asciiArt: `
 ____  _     _           _
| __ )(_)___| |__   __ _| |
|  _ \\| / __| '_ \\ / _\` | |
| |_) | \\__ \\ | | | (_| | |
|____/|_|___/_| |_|\\__,_|_|`,
    portfolioVersion: "v1.0.0",
  },

  // ----------------------------------------------------------
  // Resume
  // ----------------------------------------------------------
  resume: {
    filePath: "/Resume_of_Ashikur_Rahman_Bishal.pdf",
    downloadFilename: "Resume_of_Ashikur_Rahman_Bishal.pdf",
  },

  // ----------------------------------------------------------
  // Skills
  // ----------------------------------------------------------
  skills: {
    programming: ["JavaScript", "TypeScript", "C++"],
    webStack: ["React.js", "Next.js", "Vue.js", "HTML5", "CSS3", "TailwindCSS"],
    databases: ["Oracle", "PostgreSQL", "MongoDB"],
    tools: ["Git", "SVN", "Postman", "JIRA", "Datadog", "Claude Code", "Antigravity", "Figma"],
    practices: ["Agile (SCRUM)", "Cross-Team Collaboration"],
  },

  // ----------------------------------------------------------
  // Projects
  // ----------------------------------------------------------
  projects: [
    {
      name: "E-Statements",
      description:
        "Collaborating with a cross-border engineering team to deliver scalable solutions for a leading US-based digital banking provider. Supporting the digital operations of 190+ financial institutions, including credit unions and banks, impacting over 85+ million end users.",
      tech: ["JavaScript", "Vue.js", "Next.js", "TailwindCSS", "Java", "Oracle"],
      link: "#",
    },
  ],

  // ----------------------------------------------------------
  // Work Experience
  // ----------------------------------------------------------
  experience: [
    {
      title: "Assistant Software Engineer",
      period: "July 2024 – Present",
      company: "Dynamic Solution Innovators Ltd.",
      achievements: [
        "Designed and implemented a keep-alive mechanism that capped API traffic to ≤ 2 req/min, reducing server load while maintaining seamless session continuity.",
        "Built scalable, modular, and responsive interfaces with reusable components following best practices.",
        "Collaborated closely with backend developers and QA engineers to ensure rapid bug resolution across multiple client-facing applications.",
        "Diagnosed and fixed logic discrepancies between implementation and business requirements, optimizing application performance.",
        "Provided real-time support by swiftly identifying and resolving critical issues, maintaining system stability.",
      ],
    },
    {
      title: "Junior Software Engineer",
      period: "April 2023 – June 2024",
      company: "Dynamic Solution Innovators Ltd.",
      achievements: [
        "Processed and handled crucial bulk data for banking systems adhering to data privacy standards.",
        "Migrated client banking systems from legacy monolithic architectures to modern multi-tenant platforms, conducting in-depth analysis of existing codebases.",
        "Collaborated with UX designers to turn Figma prototypes into responsive, mobile-first interfaces with seamless cross-device experiences.",
      ],
    },
    {
      title: "Research Intern",
      period: "January 2022 – October 2022",
      company: "A Blockchain Empowered e-KYC and Reputation System (Bangladesh Govt. Project)",
      achievements: [
        "Analyzed credit scores assigned to banks to assess financial standing and risk factors.",
        "Engineered reputation score algorithms leveraging banking data.",
      ],
    },
  ],

  // ----------------------------------------------------------
  // Contact
  // ----------------------------------------------------------
  contact: {
    email: "m.arbishal@gmail.com",
    links: [
      {
        label: "Phone",
        url: "tel:+8801601610160",
        display: "+880 1601610160",
      },
      {
        label: "GitHub",
        url: "https://github.com/arBishal",
        display: "github.com/arBishal",
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/arBishal",
        display: "linkedin.com/in/arBishal",
      },
    ],
    note: "Open to new opportunities and collaborations. Feel free to reach out! 👋",
  },

  // ----------------------------------------------------------
  // Blog Links
  // ----------------------------------------------------------
  blog: {
    tagline: "📝 Writing about software development, web technologies, and engineering practices.",
    links: [
      {
        label: "Medium",
        url: "https://medium.com/@arBishal",
        display: "medium.com/@arBishal",
      },
      {
        label: "Dev.to",
        url: "https://dev.to/arBishal",
        display: "dev.to/arBishal",
      },
    ],
  },

  // ----------------------------------------------------------
  // Commands (shown in help and welcome screen)
  // ----------------------------------------------------------
  commands: [
    { name: "about", description: "Learn about me" },
    { name: "skills", description: "View my technical skills" },
    { name: "experience", description: "View work experience" },
    { name: "projects", description: "Browse my projects" },
    { name: "resume", description: "Download my resume" },
    { name: "contact", description: "Get contact information" },
    { name: "blog", description: "Read my articles" },
    { name: "theme", description: "Change terminal theme" },
    { name: "fun", description: "Visual effects" },
    { name: "help", description: "Show this help message" },
    { name: "clear", description: "Clear terminal" },
  ],
};
