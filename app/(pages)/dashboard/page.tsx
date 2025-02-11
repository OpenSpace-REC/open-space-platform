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
  const { user, updateUser } = useUser();
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
    const visits = localStorage.getItem("visitCount");
    const visitNumber = visits ? parseInt(visits, 10) : 0;

    if (visitNumber < 10) {
      setVisitCount(visitNumber + 1);
      localStorage.setItem("visitCount", (visitNumber + 1).toString());
    }
  }, []);
  useEffect(() => {
    if (user) {
      setEditableData({
        name: user.name,
        bio: user.bio || ''
      });
    }
  }, [user]);

  if (!user) {
    return <Skeleton className="w-full h-[600px] bg-muted" />;
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
    <div className="container mx-auto text-foreground min-h-screen p-4 bg-background">
      {visitCount > 0 && visitCount <= 20 && (
        <Card className="w-full mb-6 bg-transparent border border-gray-700">
          <CardHeader>
            <div className="">
              <h2 className="text-2xl font-bold text-white">Welcome to Open-Space</h2>
              <p className="text-sm text-gray-300 mt-2">
                Explore the features we've introduced! Check out the feature showcase to learn more.
              </p>
              <Button
                className="mt-4 text-black bg-white"
                onClick={() => window.location.href = "/get-started"}
              >
                Go to Feature Showcase
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}
      <Card className=" w-full mb-6 bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.githubAvatarUrl || ''} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left flex-grow">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Dialog open={isEditing} onOpenChange={handleDialogClose}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-1">
                          Name
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={editableData.name}
                          onChange={(e) => {
                            setEditableData(prev => ({ ...prev, name: e.target.value }));
                            if (errors.name) {
                              setErrors(prev => ({ ...prev, name: undefined }));
                            }
                          }}
                          placeholder="Your name"
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editableData.bio || ''}
                          onChange={(e) => setEditableData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleDialogClose(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEditSubmit}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  Rank: {user.rank || 'Beginner'}
                </Badge>
                <Badge variant="outline" className="border-accent text-accent-foreground">Active</Badge>
              </div>
              <p className="mt-2 text-muted-foreground">{user.bio || "No bio available"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
              <Mail className="text-muted-foreground" size={16} />
              <span>{user.email}</span>
            </Badge>
            {user.githubUsername && (
              <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
                <Github className="text-muted-foreground" size={16} />
                <a
                  href={user.githubProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {user.githubUsername}
                </a>
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
              <Calendar className="text-muted-foreground" size={16} />
              <span>
                Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Date not available'}
              </span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {hasTaggingPermissions(user.role) && (
        <Card className='mb-6'>
          <CardHeader>
          <h2 className="text-lg font-semibold">Curator Tools</h2>
        </CardHeader>
        <CardContent className=" ">
          <Dialog open={isCreatingTag} onOpenChange={setIsCreatingTag}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Edit3 className="h-4 w-4 mr-2" />
                Create Academic Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-6">
              <DialogHeader className="mb-6">
                <DialogTitle>Create Academic Highlight Tag</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold mb-6">Required Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium mb-2 block">Tag Name *</Label>
                        <Input
                          id="name"
                          value={tagFormData.name}
                          onChange={(e) => setTagFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Best Paper Award"
                          className="w-full"
                        />
                      </div>
      
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium mb-2 block">Title *</Label>
                        <Input
                          id="title"
                          value={tagFormData.title}
                          onChange={(e) => setTagFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter highlight title"
                          className="w-full"
                        />
                      </div>
                    </div>
      
                    <div>
                      <Label htmlFor="projectId" className="text-sm font-medium mb-2 block">
                        Project ID(s) *
                      </Label>
                      <Input
                        id="projectId"
                        value={tagFormData.projectId}
                        onChange={handleProjectIdInput}
                        placeholder="Type project ID and press comma to add"
                        className="w-full"
                      />
                      {projectIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {projectIds.map((id) => (
                            <div 
                              key={id}
                              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md"
                            >
                              <span className="text-sm">{id}</span>
                              <button
                                onClick={() => removeProjectId(id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
      
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium mb-2 block">Status *</Label>
                      <Select
                        value={tagFormData.status}
                        onValueChange={(value: StatusType) => 
                          setTagFormData(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
      
                <div>
                  <h3 className="text-sm font-semibold mb-6">Additional Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="conference" className="text-sm font-medium mb-2 block">Conference</Label>
                      <Input
                        id="conference"
                        value={tagFormData.conference}
                        onChange={(e) => setTagFormData(prev => ({ ...prev, conference: e.target.value }))}
                        placeholder="e.g., ICSE 2024"
                        className="w-full"
                      />
                    </div>
      
                    <div>
                      <Label htmlFor="date" className="text-sm font-medium mb-2 block">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={tagFormData.date}
                        onChange={(e) => setTagFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full"
                      />
                    </div>
      
                    <div>
                      <Label htmlFor="competition" className="text-sm font-medium mb-2 block">Competition</Label>
                      <Input
                        id="competition"
                        value={tagFormData.competition}
                        onChange={(e) => setTagFormData(prev => ({ ...prev, competition: e.target.value }))}
                        placeholder="e.g., Student Research Competition"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
      
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingTag(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTag}
                  className="px-8"
                >
                  Create Tag
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      )}

      <Card className="w-full mb-6 bg-card">
        <CardHeader>
          <h2 className="text-lg font-semibold">Activity Overview</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-muted-foreground">Total Projects</span>
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                <Activity size={14} className="mr-1" />
                {ownedProjects.length}
              </Badge>
            </div>
            <Progress value={ownedProjects.length} max={10} className="h-2 bg-secondary" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-muted">
              <CardContent className="flex flex-col items-center p-4">
                <Code size={24} className="mb-2 text-muted-foreground" />
                <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">
                  {ownedProjects.length}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Projects Posted</p>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardContent className="flex flex-col items-center p-4">
                <GitPullRequest size={24} className="mb-2 text-muted-foreground" />
                <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">0</Badge>
                <p className="text-sm text-muted-foreground mt-2">Projects Contributed</p>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardContent className="flex flex-col items-center p-4">
                <GitMerge size={24} className="mb-2 text-muted-foreground" />
                <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">0</Badge>
                <p className="text-sm text-muted-foreground mt-2">Pull Requests Merged</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Your Projects</h2>
          <div className="flex gap-2">
            <Link href="/edit-projects">
              <Button variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Projects
              </Button>
            </Link>
            <Link href="/upload-project">
              <Button variant="default">
                <Code className="h-4 w-4 mr-2" />
                Post New Project
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="recent" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Recent Projects
              </TabsTrigger>
              <TabsTrigger value="contributed" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
                Contributed Projects
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="mt-6">
              {ownedProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects found. Start by creating a new project!
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ownedProjects.map((project) => (
                    <div key={project.id} className="w-full">
                      <ProjectCard
                        project={project}
                        onClick={() => {
                          if (project.id) {
                            window.location.href = `/project/${project.id}`;
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="contributed" className="mt-6">
              {contributedProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects found. Start by creating a new project!
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {contributedProjects.map((project) => (
                    <div key={project.id} className="w-full">
                      <ProjectCard
                        project={project}
                        onClick={() => {
                          if (project.id) {
                            window.location.href = `/project/${project.id}`;
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}