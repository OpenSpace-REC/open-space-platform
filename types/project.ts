export interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string;
  techStack: string[];
  imageUrl: string | null;
  users: Array<{
    user: {
      name: string;
      githubAvatarUrl: string | null;
      githubUsername: string;
    };
    role: string;
  }>;
  language: string;
  pullRequests: number;
  stars: number;
}

export interface ProjectTag {
  id: string;
  name: string;
  title: string | null;
  status: string | null;
  conference: string | null;
  date: string | null;
  competition: string | null;
  projectId: string;
  curatorId: string;
  createdAt: string;
  curator: {
    id: string;
    googleId: string;
    name: string;
    bio: string;
    email: string;
    githubUsername: string;
    githubProfileUrl: string;
    githubAvatarUrl: string;
    role: string;
    rank: number;
    joinDate: string;
  };
} 