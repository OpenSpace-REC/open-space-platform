'use client';

import { useEffect, useState, useMemo, useCallback, memo, useReducer } from 'react';
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

interface Project {
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
  department: string;
  club: string;
  createdAt: string;
}

interface FilterOptions {
  language: string;
  searchQuery: string;
  department: string;
  club: string;
}

interface ProjectsState {
  projects: Project[];
  initialLoading: boolean;
  searchLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  filters: FilterOptions;
}

type ProjectsAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_INITIAL_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: Partial<FilterOptions> };

function projectsReducer(state: ProjectsState, action: ProjectsAction): ProjectsState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_INITIAL_LOADING':
      return { ...state, initialLoading: action.payload };
    case 'SET_SEARCH_LOADING':
      return { ...state, searchLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_REFRESHING':
      return { ...state, isRefreshing: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

// Memoized components
const MemoizedProjectsGrid = memo(ProjectsGrid);

const RecentProjectsSection = memo(({ projects, onProjectClick }: { projects: Project[], onProjectClick: (id: string) => void }) => {
  return (
    <section>
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          <GitPullRequest className="mr-2" /> Recent Projects
        </h2>
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
  </div>
));
StatsSection.displayName = 'StatsSection';

const initialState: ProjectsState = {
  projects: [],
  initialLoading: true,
  searchLoading: false,
  error: null,
  isRefreshing: false,
  filters: {
    language: 'all',
    searchQuery: '',
    department: 'all',
    club: 'all',
  }
};

export default function ExploreProjectsPage() {
  const [state, dispatch] = useReducer(projectsReducer, initialState);
  const router = useRouter();
  const { technologies, loading: techLoading } = useTechnologies();

  const fetchProjects = useCallback(async (searchQuery?: string, isInitialFetch: boolean = false) => {
    try {
      if (isInitialFetch && state.projects.length > 0) {
        dispatch({ type: 'SET_INITIAL_LOADING', payload: false });
        return;
      }

      if (isInitialFetch) {
        dispatch({ type: 'SET_INITIAL_LOADING', payload: true });
      } else if (!state.isRefreshing) {
        dispatch({ type: 'SET_SEARCH_LOADING', payload: true });
      }

      const queryParams = new URLSearchParams();
      if (searchQuery?.trim()) queryParams.append('search', searchQuery.trim());
      if (state.filters.language !== 'all') queryParams.append('language', state.filters.language);
      if (state.filters.department !== 'all') queryParams.append('department', state.filters.department);
      if (state.filters.club !== 'all') queryParams.append('club', state.filters.club);

      const response = await fetch(`/api/projects?${queryParams.toString()}`, {
        cache: state.isRefreshing ? 'no-store' : 'default',
        headers: state.isRefreshing ? {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        } : {}
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      dispatch({ type: 'SET_PROJECTS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'An error occurred while fetching projects' });
      console.error(err);
    } finally {
      dispatch({ type: 'SET_INITIAL_LOADING', payload: false });
      dispatch({ type: 'SET_SEARCH_LOADING', payload: false });
      dispatch({ type: 'SET_REFRESHING', payload: false });
    }
  }, [state.filters, state.isRefreshing, state.projects.length]);

  const debouncedFetch = useMemo(
    () => debounce((searchQuery: string) => {
      fetchProjects(searchQuery, false);
    }, 300),
    [fetchProjects]
  );

  const handleRefresh = useCallback(() => {
    dispatch({ type: 'SET_REFRESHING', payload: true });
    fetchProjects(state.filters.searchQuery, false);
  }, [fetchProjects, state.filters.searchQuery]);

  useEffect(() => {
    fetchProjects(undefined, true);
    return () => {
      debouncedFetch.cancel();
    };
  }, [fetchProjects, debouncedFetch]);

  const uniqueLanguages = useMemo(() => {
    const languages = new Set(state.projects.map(project => project.language));
    return Array.from(languages);
  }, [state.projects]);

  const predefinedDepartments = useMemo(() => [
    'Aeronautical Engineering',
    'Automobile Engineering',
    'Biomedical Engineering',
    'Biotechnology',
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Science & Engineering',
    'Computer Science & Engineering (Cyber Security)',
    'Computer Science & Business Systems',
    'Computer Science & Design',
    'Electrical & Electronics Engineering',
    'Electronics & Communication Engineering',
    'Food Technology',
    'Information Technology',
    'Artificial Intelligence & Machine Learning',
    'Artificial Intelligence & Data Science',
    'Mechanical Engineering',
    'Mechatronics Engineering',
    'Robotics & Automation',
    'Humanities & Sciences',
    'Management Studies',
    'Other'
  ], []);

  const predefinedClubs = useMemo(() => [
    'IEEE CIS',
    'Intellexa',
    'DevsREC',
    'ELITE',
    'GDG',
    'Cybersentinals REC',
    'Other'
  ], []);

  const uniqueDepartments = useMemo(() => {
    const departments = new Set([
      ...predefinedDepartments,
      ...state.projects.map(project => project.department).filter(Boolean)
    ]);
    return Array.from(departments);
  }, [state.projects, predefinedDepartments]);

  const uniqueClubs = useMemo(() => {
    const clubs = new Set([
      ...predefinedClubs,
      ...state.projects.map(project => project.club).filter(Boolean)
    ]);
    return Array.from(clubs);
  }, [state.projects, predefinedClubs]);

  const handleProjectClick = useCallback((projectId: string) => {
    router.push(`/project/${projectId}`);
  }, [router]);

  const featuredProjects = useMemo(() => {
    return [...state.projects]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 3);
  }, [state.projects]);

  const recentProjects = useMemo(() => {
    return [...state.projects]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [state.projects]);

  useEffect(() => {
    if (!state.initialLoading && !state.isRefreshing) {
      if (state.filters.searchQuery) {
        debouncedFetch(state.filters.searchQuery);
      } else {
        fetchProjects(undefined, false);
      }
    }
  }, [
    state.filters.searchQuery,
    state.filters.language,
    state.filters.department,
    state.filters.club,
    debouncedFetch,
    fetchProjects,
    state.initialLoading,
    state.isRefreshing
  ]);

  if (state.initialLoading) {
    return <ProjectsLoading />;
  }

  if (state.error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="text-red-700 p-4">
            Error: {state.error}
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
          disabled={state.isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${state.isRefreshing ? 'animate-spin' : ''}`} />
          {state.isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={state.filters.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { searchQuery: e.target.value } })}
          />
        </div>
        <Select
          value={state.filters.language}
          onValueChange={(value) => dispatch({ type: 'SET_FILTERS', payload: { language: value } })}
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
          value={state.filters.department}
          onValueChange={(value) => dispatch({ type: 'SET_FILTERS', payload: { department: value } })}
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
          value={state.filters.club}
          onValueChange={(value) => dispatch({ type: 'SET_FILTERS', payload: { club: value } })}
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
      </div>

      {!state.searchLoading ? (
        <>
          <RecentProjectsSection 
            projects={recentProjects}
            onProjectClick={handleProjectClick}
          />
          <AllProjectsSection 
            projects={state.projects.slice(0, 6)}
            onProjectClick={handleProjectClick}
          />
        </>
      ) : (
        <ProjectsLoading />
      )}

      <StatsSection projects={state.projects} />
    </div>
  );
}