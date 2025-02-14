'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Mail, Github, Calendar, X } from "lucide-react";
import { useUser } from '@/components/user-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Code, GitPullRequest, GitMerge, Edit2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from '@/components/ui/project-tile';
import { ProfileSection } from './components/ProfileSection';
import { CuratorTools } from './components/CuratorTools';
import { ActivityOverview } from './components/ActivityOverview';
import { ProjectsSection } from './components/ProjectsSection';
import { useRouter } from 'next/navigation';
import DashboardLoading from './loading';

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

interface EditableProfileData {
  name: string;
  bio: string | null;
}

type StatusType = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';

interface ProjectWithRole {
  role: string;
  project: {
    id: string;
    name: string;
    description: string | null;
    githubUrl: string;
    techStack: string[];
    imageUrl: string | null;
  };
}

interface ValidationErrors {
  name?: string;
  bio?: string;
}

interface TagFormData {
  name: string;
  projectId: string | string[];
  title: string;
  status: StatusType | '';
  conference: string;
  date: string;
  competition: string;
}

const statusOptions = [
  'PUBLISHED',
  'IN_REVIEW',
  'DRAFT',
  'COMPLETED',
  'ONGOING'
] as const;

export default function DashboardPage() {
  const { user, updateUser, isLoading } = useUser();
  const router = useRouter();
  const statusOptions: StatusType[] = ['DRAFT', 'IN_PROGRESS', 'COMPLETED'];
  const [projectIds, setProjectIds] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [tagFormData, setTagFormData] = useState<TagFormData>({
    name: '',
    projectId: '',
    title: '',
    status: '',
    conference: '',
    date: '',
    competition: ''
  });
  const [editableData, setEditableData] = useState<EditableProfileData>({
    name: '',
    bio: null
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/google-signin');
      return;
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      const visits = localStorage.getItem("visitCount");
      const visitNumber = visits ? parseInt(visits, 10) : 0;
      
      if (visitNumber < 10) {
        setVisitCount(visitNumber + 1);
        localStorage.setItem("visitCount", (visitNumber + 1).toString());
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setEditableData({
        name: user.name,
        bio: user.bio || ''
      });
    }
  }, [user]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!user) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!editableData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editableData.name.trim(),
          bio: editableData.bio?.trim() || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditableData({
        name: user?.name || '',
        bio: user?.bio || ''
      });
      setErrors({});
    }
    setIsEditing(open);
  };

  const handleProjectIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagFormData(prev => ({ ...prev, projectId: value }));
    
    if (value.endsWith(',')) {
      const newId = value.slice(0, -1).trim();
      if (newId && !projectIds.includes(newId)) {
        setProjectIds(prev => [...prev, newId]);
        setTagFormData(prev => ({ ...prev, projectId: '' }));
      }
    }
  };

  const removeProjectId = (idToRemove: string) => {
    setProjectIds(prev => prev.filter(id => id !== idToRemove));
  };

  const handleCreateTag = async () => {
    try {
      if (tagFormData.date && !isValidDate(tagFormData.date)) {
        toast.error('Invalid date format');
        return;
      }

      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tagFormData,
          date: tagFormData.date ? new Date(tagFormData.date).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Failed to create tag');
        }
        return;
      }

      toast.success('Tag created successfully');
      setIsCreatingTag(false);
      setTagFormData({
        name: '',
        projectId: '',
        title: '',
        status: '',
        conference: '',
        date: '',
        competition: ''
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create tag');
      }
    }
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const ownedProjects: Project[] = (user.projects || [])
    .filter((p: ProjectWithRole) => p.role === 'OWNER')
    .map((p: ProjectWithRole) => ({
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

  const contributedProjects: Project[] = (user.projects || [])
    .filter((p: ProjectWithRole) => p.role === 'CONTRIBUTOR')
    .map((p: ProjectWithRole) => ({
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
        role: 'CONTRIBUTOR'
      }],
      language: p.project.techStack[0] || 'N/A',
      pullRequests: 0,
      stars: 0
    }));

  const hasTaggingPermissions = (role?: string) => {
    return role === 'CURATOR' || role === 'ADMIN';
  };

  return (
    <div className="container mx-auto py-8 space-y-8 bg-background">
      {visitCount > 0 && visitCount <= 20 && (
        <Card className="w-full bg-card border">
          <CardHeader>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Welcome to Open-Space</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Explore the features we've introduced! Check out the feature showcase to learn more.
              </p>
              <Button
                className="w-full sm:w-auto mt-2"
                onClick={() => window.location.href = "/get-started"}
              >
                Go to Feature Showcase
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}
      <div className="space-y-8">
        <ProfileSection user={user} updateUser={updateUser} />
        
        {hasTaggingPermissions(user.role) && (
          <CuratorTools hasTaggingPermissions={true} />
        )}

        <ActivityOverview 
          ownedProjects={ownedProjects}
          contributedProjects={contributedProjects}
        />

        <ProjectsSection 
          ownedProjects={ownedProjects}
          contributedProjects={contributedProjects}
        />
      </div>
    </div>
  );
}