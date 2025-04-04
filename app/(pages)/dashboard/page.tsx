'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useReducer } from 'react';
import { useUser } from '@/components/user-context';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import DashboardLoading from './loading';
import { usePlatformAccess } from '@/hooks/usePlatformAccess';
import { ProfileSection } from './components/ProfileSection';
import { CuratorTools } from './components/CuratorTools';
import { ActivityOverview } from './components/ActivityOverview';
import { ProjectsSection } from './components/ProjectsSection';

interface EditableProfileData {
  name: string;
  bio: string | null;
}

type StatusType = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';

interface ValidationErrors {
  name?: string;
  bio?: string;
}

interface TagFormData {
  name: string;
  projectId: string;
  title: string;
  status: StatusType | '';
  conference: string;
  date: string;
  competition: string;
}

interface DashboardState {
  projectIds: string[];
  profile: EditableProfileData | null;
  isEditing: boolean;
  isCreatingTag: boolean;
  tagFormData: TagFormData;
  editableData: EditableProfileData;
  errors: ValidationErrors;
}

type DashboardAction =
  | { type: 'SET_PROJECT_IDS'; payload: string[] }
  | { type: 'SET_PROFILE'; payload: EditableProfileData | null }
  | { type: 'SET_IS_EDITING'; payload: boolean }
  | { type: 'SET_IS_CREATING_TAG'; payload: boolean }
  | { type: 'SET_TAG_FORM_DATA'; payload: Partial<TagFormData> }
  | { type: 'SET_EDITABLE_DATA'; payload: Partial<EditableProfileData> }
  | { type: 'SET_ERRORS'; payload: ValidationErrors };

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_PROJECT_IDS':
      return { ...state, projectIds: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_IS_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_IS_CREATING_TAG':
      return { ...state, isCreatingTag: action.payload };
    case 'SET_TAG_FORM_DATA':
      return { ...state, tagFormData: { ...state.tagFormData, ...action.payload } };
    case 'SET_EDITABLE_DATA':
      return { ...state, editableData: { ...state.editableData, ...action.payload } };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    default:
      return state;
  }
}

interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  githubUrl?: string;
  techStack: string[];
  imageUrl: string | null;
  users: {
    user: {
      name: string;
      githubAvatarUrl?: string | null;
      githubUsername?: string;
    };
    role: 'OWNER' | 'CONTRIBUTOR';
  }[];
  language: string;
  pullRequests: number;
  stars: number;
}

export default function DashboardPage() {
  const { user, updateUser, isLoading } = useUser();
  const { hasAccess, isLoading: accessLoading } = usePlatformAccess();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/google-signin');
      return;
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const checkBanStatus = async () => {
      if (!user?.email) return;
      try {
        const response = await fetch('/api/check-ban-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });
        if (!response.ok) {
          const data = await response.json();
          if (data.error === 'User is banned') {
            await signOut();
            window.location.href = '/banned';
          }
        }
      } catch (error) {
        console.error('Error checking ban status:', error);
      } finally {
        setLoading(false);
      }
    };
    checkBanStatus();
  }, [user?.email]);

  useEffect(() => {
    if (!accessLoading && !hasAccess) {
      router.push("/restricted");
    }
  }, [hasAccess, accessLoading, router]);

  if (isLoading || accessLoading || loading) {
    return <DashboardLoading />;
  }

  if (!user || !hasAccess) {
    return null;
  }

  const ownedProjects: ProjectData[] = (user.projects || [])
    .filter((p) => p.role === 'OWNER')
    .map((p) => ({
      id: p.project.id,
      name: p.project.name,
      description: p.project.description,
      githubUrl: p.project.githubUrl,
      techStack: p.project.techStack,
      imageUrl: p.project.imageUrl,
      users: [{
        user: {
          name: user.name,
          githubAvatarUrl: user.githubAvatarUrl || null,
          githubUsername: user.githubUsername || ''
        },
        role: 'OWNER'
      }],
      language: p.project.techStack[0] || 'N/A',
      pullRequests: 0,
      stars: 0
    }));

  return (
    <div className="container mx-auto p-4 min-w-0">
      <div className="grid gap-1 min-w-0">
        <ProfileSection user={user} updateUser={updateUser} />
        {(user.role === 'CURATOR' || user.role === 'ADMIN') && <CuratorTools user={user} />}
        <ActivityOverview projects={user.projects} points={user.points || 0} />
        <ProjectsSection user={user} />
      </div>
    </div>
  );
}
