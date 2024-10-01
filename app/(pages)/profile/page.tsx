'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Github, Mail, Calendar, Edit3, Code, GitPullRequest, GitMerge, Star, Activity } from "lucide-react";
import { useUser } from '@/components/user-context';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCard from '@/components/ui/project-card';

const placeholderProjects = [
  { id: 1, name: "Project Alpha", language: "JavaScript", description: "A web application for task management", pullRequests: 5, stars: 12 },
  { id: 2, name: "Data Visualizer", language: "Python", description: "Tool for creating interactive data visualizations", pullRequests: 3, stars: 8 },
  { id: 3, name: "Mobile App", language: "React Native", description: "Cross-platform mobile application", pullRequests: 7, stars: 15 },
  { id: 4, name: "API Service", language: "Node.js", description: "RESTful API for data processing", pullRequests: 2, stars: 6 },
];

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return <Skeleton className="w-full h-[600px] bg-muted" />;
  }

  return (
    <div className="container mx-auto text-foreground min-h-screen p-4 bg-background">
      <Card className="w-full max-w-4xl mx-auto bg-card text-card-foreground">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-32 h-32 sm:w-44 sm:h-44">
              <AvatarImage src={user.githubAvatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
    

            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-2xl font-bold">{user.name}</h1>

              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Rank: {user.rank}</Badge>
                <Badge variant="outline" className="border-accent text-accent-foreground">Active</Badge>
              </div>
              <p className="mt-2 text-muted-foreground">{user.bio || "No bio available"}</p>
              <Button variant="outline" size="sm" className="mt-2 text-muted-foreground border-muted hover:bg-accent hover:text-accent-foreground">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Bio
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
              <Mail className="text-muted-foreground" size={16} />
              <span>{user.email}</span>
            </Badge>
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
            <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
              <Calendar className="text-muted-foreground" size={16} />
              <span>
                Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Date not available'}
              </span>
            </Badge>
          </div>

          <Separator className="bg-border" />

          <div>
            <h2 className="text-lg font-semibold mb-2">Contribution Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Total Contributions</span>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    <Activity size={14} className="mr-1" />
                    100
                  </Badge>
                </div>
                <Progress value={1} max={1000} className="h-2 bg-secondary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center p-4">
                    <Code size={24} className="mb-2 text-muted-foreground" />
                    <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">{ 0}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">Projects Posted</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center p-4">
                    <GitPullRequest size={24} className="mb-2 text-muted-foreground" />
                    <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">{ 0}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">Projects Contributed</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="flex flex-col items-center p-4">
                    <GitMerge size={24} className="mb-2 text-muted-foreground" />
                    <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">{ 0}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">Pull Requests Merged</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          <Tabs defaultValue="posted" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="posted" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Posted Projects</TabsTrigger>
              <TabsTrigger value="contributed" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Contributed Projects</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:text-foreground">All Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="posted" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {placeholderProjects.slice(0, 2).map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="contributed" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {placeholderProjects.slice(2, 4).map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {placeholderProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}