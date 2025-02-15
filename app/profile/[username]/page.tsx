'use client';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Github, Mail, Calendar, Edit3, Code, GitPullRequest, GitMerge, Activity } from "lucide-react";
import { useUser } from '@/components/user-context';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCard from '@/components/ui/project-card';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Vote {
  id: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

interface Tag {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    githubUsername: string | null;
    githubProfileUrl: string | null;
    githubAvatarUrl: string | null;
    role: string;
    joinDate: string;
    points: number;
    projectsPosted: number;
    projectsContributed: number;
    tagsCreated: number;
    techStack: string[];
    projects: Array<{
      project: {
        id: string;
        name: string;
        description: string;
        techStack: string[];
        votes: Vote[];
        tags: Tag[];
      };
      role: string;
    }>;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const { user: sessionUser } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const username = params.username as string;
  const isOwnProfile = sessionUser?.githubUsername === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // If viewing own profile without username in URL, redirect to username-based URL
        if (!username && sessionUser?.githubUsername) {
          window.location.href = `/profile/${sessionUser.githubUsername}`;
          return;
        }

        // Fetch profile data based on username
        const response = await fetch(`/api/user/profile/${username}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username || sessionUser?.githubUsername) {
      fetchProfileData();
    }
  }, [username, sessionUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="font-bold text-3xl animate-pulse">
            Open Space
          </span>
          <span className="text-muted-foreground animate-pulse">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto text-foreground min-h-screen p-4 bg-background">
        <Card className="w-full max-w-4xl mx-auto bg-card text-card-foreground p-6">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const { user } = profileData;
  const postedProjects = user.projects.filter(p => p.role === 'OWNER');
  const contributedProjects = user.projects.filter(p => p.role !== 'OWNER');
  const contributionProgress = (user.points / 1000) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-4 flex-grow">
        <Card className="w-full max-w-4xl mx-auto bg-card text-card-foreground mb-2">
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Avatar className="w-32 h-32 sm:w-44 sm:h-44">
                <AvatarImage src={user.githubAvatarUrl || ''} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-2xl font-bold">{user.name}</h1>

                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Points: {user.points}</Badge>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Role: {user.role}</Badge>
                  <Badge variant="outline" className="border-accent text-accent-foreground">Active</Badge>
                </div>
                <p className="mt-2 text-muted-foreground">{user.bio || "No bio available"}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              {isOwnProfile && (
                <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
                  <Mail className="text-muted-foreground" size={16} />
                  <span>{user.email}</span>
                </Badge>
              )}
              {user.githubUsername && (
                <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
                  <Github className="text-muted-foreground" size={16} />
                  <a
                    href={user.githubProfileUrl || `https://github.com/${user.githubUsername}`}
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
                  Joined: {new Date(user.joinDate).toLocaleDateString()}
                </span>
              </Badge>
            </div>

            <Separator className="bg-border" />

            {user.techStack && user.techStack.length > 0 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Technologies Used</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="bg-border" />
              </>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-2">Contribution Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Total Points</span>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      <Activity size={14} className="mr-1" />
                      {user.points}
                    </Badge>
                  </div>
                  <Progress value={contributionProgress} max={100} className="h-2 bg-secondary" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center p-4">
                      <Code size={24} className="mb-2 text-muted-foreground" />
                      <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">{user.projectsPosted}</Badge>
                      <p className="text-sm text-muted-foreground mt-2">Projects Posted</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center p-4">
                      <GitPullRequest size={24} className="mb-2 text-muted-foreground" />
                      <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">{user.projectsContributed}</Badge>
                      <p className="text-sm text-muted-foreground mt-2">Projects Contributed</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center p-4">
                      <GitMerge size={24} className="mb-2 text-muted-foreground" />
                      <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">{user.tagsCreated}</Badge>
                      <p className="text-sm text-muted-foreground mt-2">Tags Created</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            <Tabs defaultValue="posted" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="posted" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Posted Projects</TabsTrigger>
                <TabsTrigger value="contributed" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Contributed Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="posted" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {postedProjects.map(({ project }) => (
                    <ProjectCard 
                      key={project.id} 
                      project={{
                        id: project.id,
                        name: project.name,
                        description: project.description || '',
                        language: project.techStack[0] || 'N/A',
                        pullRequests: project.tags.length,
                        stars: project.votes.length
                      }} 
                    />
                  ))}
                  {postedProjects.length === 0 && (
                    <p className="text-muted-foreground col-span-2 text-center py-4">No projects posted yet</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="contributed" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contributedProjects.map(({ project }) => (
                    <ProjectCard 
                      key={project.id} 
                      project={{
                        id: project.id,
                        name: project.name,
                        description: project.description || '',
                        language: project.techStack[0] || 'N/A',
                        pullRequests: project.tags.length,
                        stars: project.votes.length
                      }} 
                    />
                  ))}
                  {contributedProjects.length === 0 && (
                    <p className="text-muted-foreground col-span-2 text-center py-4">No contributions yet</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-accent transition-colors">
          Made with Open Space
        </Link>
      </footer>
    </div>
  );
} 