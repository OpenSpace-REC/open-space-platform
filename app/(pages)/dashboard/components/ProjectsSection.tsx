'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Edit2 } from "lucide-react";
import ProjectCard from '@/components/ui/project-tile';
import { type User } from '@/components/user-context';

interface ProjectsSectionProps {
  user: User;
}

export function ProjectsSection({ user }: ProjectsSectionProps) {
  if (!user) return null;

  // Transform projects data
  const ownedProjects = (user.projects || [])
    .filter(p => p.role === 'OWNER')
    .map(p => ({
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
      language: p.project.techStack[0] || 'N/A'
    }));

  const contributedProjects = (user.projects || [])
    .filter(p => p.role !== 'OWNER')
    .map(p => ({
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
      language: p.project.techStack[0] || 'N/A'
    }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold">Your Projects</h2>
          <p className="text-sm text-muted-foreground">Manage and track your project contributions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/edit-projects" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Projects
            </Button>
          </Link>
          <Link href="/upload-project" className="w-full sm:w-auto">
            <Button variant="default" className="w-full">
              <Code className="h-4 w-4 mr-2" />
              Post New Project
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className='pb-6 pl-6 pr-6'>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full h-full flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="all" className="flex-1">All Projects</TabsTrigger>
            <TabsTrigger value="posted" className="flex-1">Posted Projects</TabsTrigger>
            <TabsTrigger value="contributed" className="flex-1">Contributed Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 sm:mt-6">
            {ownedProjects.length === 0 && contributedProjects.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <p>No projects found. Start by creating or contributing to a project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[...ownedProjects, ...contributedProjects].map((project) => (
                  <div key={project.id} className="w-full">
                    <ProjectCard
                      project={project}
                      onClick={() => {
                        window.location.href = `/project/${project.id}`;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="posted" className="mt-4 sm:mt-6">
            {ownedProjects.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <p>No projects found. Start by creating a new project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {ownedProjects.map((project) => (
                  <div key={project.id} className="w-full">
                    <ProjectCard
                      project={project}
                      onClick={() => {
                        window.location.href = `/project/${project.id}`;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="contributed" className="mt-4 sm:mt-6">
            {contributedProjects.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <p>No projects found. Start by contributing to a project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {contributedProjects.map((project) => (
                  <div key={project.id} className="w-full">
                    <ProjectCard
                      project={project}
                      onClick={() => {
                        window.location.href = `/project/${project.id}`;
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
  );
} 