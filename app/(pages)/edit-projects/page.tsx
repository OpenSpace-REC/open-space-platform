'use client';
import React from 'react';
import { useUser } from '@/components/user-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ProjectCard from '@/components/ui/project-tile';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProjectsPage() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return <Skeleton className="w-full h-[600px]" />;
  }

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
      language: p.project.techStack[0] || 'N/A',
      pullRequests: 0,
      stars: 0
    }));

  const handleProjectClick = (projectId: string) => {
    router.push(`/edit-project/${projectId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Projects</CardTitle>
          <CardDescription>Select a project to edit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => handleProjectClick(project.id)}
                isEditable={true}
              />
            ))}
          </div>
          {ownedProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No projects found to edit.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 