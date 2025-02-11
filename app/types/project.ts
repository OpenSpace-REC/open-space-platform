export interface User {
  role: string;
  id: string;
  name: string;
  email: string;
  githubUsername: string;
  githubProfileUrl: string;
  githubAvatarUrl: string;
  bio: string | null;
}

export interface ProjectMember {
  id: string;
  role: string;
  user: User;
}

export interface PendingMember {
  id: string;
  githubUsername: string;
  role: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
}

export interface ProjectTag {
  id: string;
  name: string;
  title: string | null;
  status: string | null;
  conference: string | null;
  date: string | null;
  competition: string | null;
  curator: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status?: string;
  projectType?: string;
  demoUrl?: string;
  githubUrl?: string;
  problemStatement?: string;
  projectImages: string[];
  techStack: string[];
  users: ProjectMember[];
  pendingUsers: PendingMember[];
  tags: ProjectTag[];
  resources: Resource[];
  keyFeatures: string[];
}