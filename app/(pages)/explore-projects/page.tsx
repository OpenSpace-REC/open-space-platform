'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { ProjectsLoading } from '@/components/projects/projects-loading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Search, 
  Filter,
  Star,
  GitPullRequest,
  Code
} from 'lucide-react';

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

interface FilterOptions {
  language: string;
  minStars: number;
  searchQuery: string;
}

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    language: '',
    minStars: 0,
    searchQuery: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data.map((project: Project) => ({ ...project, users: project.users || [] })));
    } catch (err) {
      setError('An error occurred while fetching projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueLanguages = useMemo(() => {
    const languages = new Set(projects.map(project => project.language));
    return Array.from(languages);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesLanguage = !filters.language || project.language === filters.language;
      const matchesStars = project.stars >= filters.minStars;
      const matchesSearch = !filters.searchQuery || 
        project.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return matchesLanguage && matchesStars && matchesSearch;
    });
  }, [projects, filters]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const getFeaturedProjects = () => {
    return projects
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 3);
  };

  const getRecentProjects = () => {
    return projects
      .sort((a, b) => b.pullRequests - a.pullRequests)
      .slice(0, 3);
  };

  if (loading) {
    return <ProjectsLoading />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="text-red-700 p-4">
            Error: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
 
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Explore Projects</h1>
        
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <GitPullRequest className="mr-2" /> Recent Activity
          </h2>
          <Button variant="ghost" onClick={() => router.push('/projects/activity')}>
            View All <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>
        <ProjectsGrid
          projects={getRecentProjects()}
          onProjectClick={handleProjectClick}
        />
      </section>


      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <Code className="mr-2" /> All Projects
          </h2>
          <Button variant="ghost" onClick={() => router.push('/projects')}>
            View All <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>
        <ProjectsGrid
          projects={filteredProjects.slice(0, 6)}
          onProjectClick={handleProjectClick}
        />
      </section>

      {/* Projects Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {projects.reduce((sum, project) => sum + project.stars, 0)}
            </div>
            <div className="text-muted-foreground">Total Stars</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {projects.reduce((sum, project) => sum + project.pullRequests, 0)}
            </div>
            <div className="text-muted-foreground">Total Pull Requests</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}