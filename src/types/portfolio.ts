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

export interface Personal {
  fullName: string;
  shortName: string;
  title: string;
  username: string;
  location: string;
  education: string[];
  bio: string[];
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
}
