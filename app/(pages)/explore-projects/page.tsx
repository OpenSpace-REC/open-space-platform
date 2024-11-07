'use client'
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { ProjectsLoading } from '@/components/projects/projects-loading';

interface ProjectUser {
  user: {
    name: string;
    githubAvatarUrl: string | null;
    githubUsername: string;
  };
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string;
  techStack: string[];
  imageUrl: string | null;
  users: ProjectUser[];
  language: string;
  pullRequests: number;
  stars: number;
}

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      
      // Log the data to see what we're getting from the API
      console.log('Fetched projects:', data);
      
      // Ensure the data includes user information
      const projectsWithUsers = data.map((project: Project) => ({
        ...project,
        users: project.users || []
      }));
      
      setProjects(projectsWithUsers);
    } catch (err) {
      setError('An error occurred while fetching projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  if (loading) {
    return <ProjectsLoading />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
      <ProjectsGrid 
        projects={projects} 
        onProjectClick={handleProjectClick}
      />
    </div>
  );
}