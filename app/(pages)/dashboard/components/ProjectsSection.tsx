'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Edit2 } from "lucide-react";
import ProjectCard from '@/components/ui/project-tile';

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string;
  techStack: string[];
  imageUrl: string | null;
  users: {
    user: {
      name: string;
      githubAvatarUrl: string | null;
      githubUsername: string;
    };
    role: string;
  }[];
  language: string;
  pullRequests: number;
  stars: number;
}

interface ProjectsSectionProps {
  ownedProjects: Project[];
  contributedProjects: Project[];
}

export function ProjectsSection({ ownedProjects, contributedProjects }: ProjectsSectionProps) {
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
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full h-11 flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger 
              value="recent"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
            >
              Recent Projects
            </TabsTrigger>
            <TabsTrigger 
              value="contributed"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
            >
              Contributed Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4 sm:mt-6">
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
          <TabsContent value="contributed" className="mt-4 sm:mt-6">
            {contributedProjects.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <p>No projects found. Start by creating a new project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
  );
} 