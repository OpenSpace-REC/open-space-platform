export interface ProjectUser {
  id: string
  githubUsername: string
  role: 'OWNER' | 'CONTRIBUTOR'
}

export interface Repository {
  name: string
  full_name: string
  description: string
  html_url: string
}

export interface ProjectImage {
  url: string;
  title: string;
  description: string;
}

export interface Technology {
  value: string;
  label: string;
}

export interface ProjectResource {
  url: string;
  title: string;
  type: 'image' | 'document' | 'presentation' | 'paper' | 'other';
  description: string;
}

export interface Project {
  name: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  techStack: string;
  imageUrl: string;
  problemStatement: string;
  status: string;
  projectType: string;
  department: string;
  club: string;
  keyFeatures: string[];
  academicHighlights: { title: string; status: string; conference?: string; date?: string; competition?: string }[];
  resources: ProjectResource[];
  projectImages: ProjectImage[];
}

export const CHAR_LIMITS = {
  name: { min: 3, max: 100 },
  description: { min: 50, max: 500 },
  problemStatement: { min: 50, max: 1000 },
  featureDescription: { min: 10, max: 200 },
  resourceTitle: { min: 3, max: 100 },
  resourceDescription: { min: 0, max: 300 }
} 