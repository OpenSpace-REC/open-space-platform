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
  Search,
  Filter,
  Star,
  Code,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    language: 'all',
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
      const matchesLanguage = filters.language === 'all' || project.language === filters.language;
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
        <h1 className="text-3xl font-bold">All Projects</h1>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          />
        </div>
        <Select
          value={filters.language}
          onValueChange={(value) => setFilters({ ...filters, language: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {uniqueLanguages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.minStars.toString()}
          onValueChange={(value) => setFilters({ ...filters, minStars: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Minimum Stars" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Stars</SelectItem>
            <SelectItem value="10">10+ Stars</SelectItem>
            <SelectItem value="50">50+ Stars</SelectItem>
            <SelectItem value="100">100+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <ProjectsGrid
        projects={filteredProjects}
        onProjectClick={handleProjectClick}
      />

      {/* Projects Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredProjects.length}</div>
            <div className="text-muted-foreground">Filtered Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredProjects.reduce((sum, project) => sum + project.stars, 0)}
            </div>
            <div className="text-muted-foreground">Total Stars</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredProjects.reduce((sum, project) => sum + project.pullRequests, 0)}
            </div>
            <div className="text-muted-foreground">Total Pull Requests</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 