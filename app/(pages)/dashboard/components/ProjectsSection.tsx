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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-3 sm:p-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Your Projects</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage and track your project contributions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/edit-projects" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full h-8 text-xs">
              <Edit2 className="h-3 w-3 mr-1" />
              Edit Projects
            </Button>
          </Link>
          <Link href="/upload-project" className="w-full sm:w-auto">
            <Button variant="default" size="sm" className="w-full h-8 text-xs">
              <Code className="h-3 w-3 mr-1" />
              Post New Project
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className='p-3 sm:p-4'>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex items-center justify-start rounded-lg bg-muted p-0.5 text-muted-foreground text-xs">
            <TabsTrigger value="all" className="flex-1 px-2 py-1">All Projects</TabsTrigger>
            <TabsTrigger value="posted" className="flex-1 px-2 py-1">Posted</TabsTrigger>
            <TabsTrigger value="contributed" className="flex-1 px-2 py-1">Contributed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-3 sm:mt-4">
            {ownedProjects.length === 0 && contributedProjects.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <p>No projects found. Start by creating or contributing to a project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
          <TabsContent value="posted" className="mt-3 sm:mt-4">
            {ownedProjects.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <p>No projects found. Start by creating a new project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
          <TabsContent value="contributed" className="mt-3 sm:mt-4">
            {contributedProjects.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <p>No projects found. Start by contributing to a project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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