'use client';

import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { ProjectsLoading } from '@/components/projects/projects-loading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTechnologies } from '@/hooks/useTechnologies';
import { 
  ArrowRight, 
  Search, 
  Filter,
  Star,
  GitPullRequest,
  Code,
  RefreshCw
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { debounce } from 'lodash';

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
  department: string;
  club: string;
}

interface FilterOptions {
  language: string;
  minStars: number;
  searchQuery: string;
  department: string;
  club: string;
}

let cachedProjects: Project[] = [];
let isDataFetched = false;

const MemoizedProjectsGrid = memo(ProjectsGrid);

const RecentProjectsSection = memo(({ projects, onProjectClick }: { projects: Project[], onProjectClick: (id: string) => void }) => {
  const router = useRouter();
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <GitPullRequest className="mr-2" /> Recent Activity
        </h2>
        <Button variant="ghost" onClick={() => router.push('/projects/activity')}>
          View All <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
      <MemoizedProjectsGrid
        projects={projects}
        onProjectClick={onProjectClick}
      />
    </section>
  );
});
RecentProjectsSection.displayName = 'RecentProjectsSection';

const AllProjectsSection = memo(({ projects, onProjectClick }: { projects: Project[], onProjectClick: (id: string) => void }) => {
  const router = useRouter();
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <Code className="mr-2" /> All Projects
        </h2>
        <Button variant="ghost" onClick={() => router.push('/explore-projects/all')}>
          View All <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
      <MemoizedProjectsGrid
        projects={projects}
        onProjectClick={onProjectClick}
      />
    </section>
  );
});
AllProjectsSection.displayName = 'AllProjectsSection';

const StatsSection = memo(({ projects }: { projects: Project[] }) => (
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
));
StatsSection.displayName = 'StatsSection';

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(cachedProjects);
  const [initialLoading, setInitialLoading] = useState(!isDataFetched);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    language: 'all',
    minStars: 0,
    searchQuery: '',
    department: 'all',
    club: 'all',
  });
  const router = useRouter();
  const { technologies, loading: techLoading } = useTechnologies();

  const fetchProjects = useCallback(async (searchQuery?: string, isInitialFetch: boolean = false) => {
    try {
      if (isInitialFetch && isDataFetched) {
        return;
      }

      if (isInitialFetch) {
        setInitialLoading(true);
      } else if (!isRefreshing) {
        setSearchLoading(true);
      }

      const queryParams = new URLSearchParams();
      if (searchQuery?.trim()) queryParams.append('search', searchQuery.trim());
      if (filters.language !== 'all') queryParams.append('language', filters.language);
      if (filters.minStars > 0) queryParams.append('minStars', filters.minStars.toString());
      if (filters.department !== 'all') queryParams.append('department', filters.department);
      if (filters.club !== 'all') queryParams.append('club', filters.club);

      const response = await fetch(`/api/projects?${queryParams.toString()}`, {
        cache: isRefreshing ? 'no-store' : 'default',
        headers: isRefreshing ? {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        } : {}
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      cachedProjects = data;
      isDataFetched = true;
    } catch (err) {
      setError('An error occurred while fetching projects');
      console.error(err);
    } finally {
      setInitialLoading(false);
      setSearchLoading(false);
      setIsRefreshing(false);
    }
  }, [filters, isRefreshing]);

  const debouncedFetch = useMemo(
    () => debounce((searchQuery: string) => {
      fetchProjects(searchQuery, false);
    }, 300),
    [fetchProjects]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProjects(filters.searchQuery, false);
  }, [fetchProjects, filters.searchQuery]);

  useEffect(() => {
    fetchProjects(undefined, true);
    return () => {
      debouncedFetch.cancel();
    };
  }, [fetchProjects, debouncedFetch]);

  const uniqueLanguages = useMemo(() => {
    const languages = new Set(projects.map(project => project.language));
    return Array.from(languages);
  }, [projects]);

  const predefinedDepartments = useMemo(() => [
    'Computer Science',
    'Electronics and Communication',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology',
    'Other'
  ], []);

  const predefinedClubs = useMemo(() => [
    'Coding Club',
    'Robotics Club',
    'IEEE Student Branch',
    'Innovation Club',
    'Research Club',
    'Design Club',
    'Other'
  ], []);

  const uniqueDepartments = useMemo(() => {
    const departments = new Set([
      ...predefinedDepartments,
      ...projects.map(project => project.department).filter(Boolean)
    ]);
    return Array.from(departments);
  }, [projects, predefinedDepartments]);

  const uniqueClubs = useMemo(() => {
    const clubs = new Set([
      ...predefinedClubs,
      ...projects.map(project => project.club).filter(Boolean)
    ]);
    return Array.from(clubs);
  }, [projects, predefinedClubs]);

  const handleProjectClick = useCallback((projectId: string) => {
    router.push(`/project/${projectId}`);
  }, [router]);

  const featuredProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 3);
  }, [projects]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => b.pullRequests - a.pullRequests)
      .slice(0, 3);
  }, [projects]);

  useEffect(() => {
    if (!initialLoading && !isRefreshing) {
      if (filters.searchQuery) {
        debouncedFetch(filters.searchQuery);
      } else {
        fetchProjects(undefined, false);
      }
    }
  }, [
    filters.searchQuery,
    filters.language,
    filters.minStars,
    filters.department,
    filters.club,
    debouncedFetch,
    fetchProjects,
    initialLoading,
    isRefreshing
  ]);

  if (initialLoading) {
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <SelectValue placeholder={techLoading ? "Loading languages..." : "Select Language"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {technologies.map((tech) => (
              <SelectItem key={tech.value} value={tech.value}>
                {tech.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.department}
          onValueChange={(value) => setFilters({ ...filters, department: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {uniqueDepartments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.club}
          onValueChange={(value) => setFilters({ ...filters, club: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Club" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clubs</SelectItem>
            {uniqueClubs.map((club) => (
              <SelectItem key={club} value={club}>
                {club}
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

      {!searchLoading ? (
        <>
          <RecentProjectsSection 
            projects={recentProjects}
            onProjectClick={handleProjectClick}
          />
          <AllProjectsSection 
            projects={projects.slice(0, 6)}
            onProjectClick={handleProjectClick}
          />
        </>
      ) : (
        <ProjectsLoading />
      )}

      <StatsSection projects={projects} />
    </div>
  );
}