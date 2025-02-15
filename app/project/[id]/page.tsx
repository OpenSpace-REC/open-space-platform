import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Github, 
  Globe, 
  MessageSquare,
  Users,
  ExternalLink,
  Award,
  FileText,
  Star,
  Image as ImageIcon,
  Presentation,
  ScrollText,
  Link as LinkIcon,
  Clock,
  Building,
  Users2
} from 'lucide-react';
import Image from 'next/image'
import type { Project, Resource } from '@/app/types/project';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ProjectMember = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    githubUsername: string;
    githubProfileUrl: string;
    githubAvatarUrl: string;
    bio: string | null;
  };
};

type PendingMember = {
  id: string;
  githubUsername: string;
  role: string;
};

type ProjectTag = {
  id: string;
  name: string;
  title: string | null;
  status: string | null;
  conference: string | null;
  date: string | null;
  competition: string | null;
  curator: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
};

type ProjectData = {
  id: string;
  name: string;
  description?: string;
  problemStatement?: string;
  githubUrl?: string;
  demoUrl?: string;
  techStack: string[];
  imageUrl?: string;
  status: string;
  projectType: string;
  department?: string;
  club?: string;
  keyFeatures: string[];
  projectImages: string[];
  users: ProjectMember[];
  pendingUsers: PendingMember[];
  tags: ProjectTag[];
  resources: Resource[];
};

async function getProjectData(id: string): Promise<ProjectData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error('API base URL is not configured');

  const response = await fetch(`${baseUrl}/api/projects/${id}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(response.status === 404 ? 'Project not found' : 'Failed to load project data');
  }

  return response.json();
}

function getProjectTypeBadge(type: string): "default" | "secondary" | "outline" {
  switch (type.toUpperCase()) {
    case 'PERSONAL PROJECT':
      return 'default';
    case 'TEAM PROJECT':
      return 'secondary';
    case 'ACADEMIC PROJECT':
      return 'secondary';
    case 'OPEN SOURCE':
      return 'default';
    default:
      return 'outline';
  }
}

async function ProjectPage({ params }: { params: { id: string } }) {
  try {
    const project: ProjectData = await getProjectData(params.id);

    console.log('Project Data:', {
      users: project.users,
      pendingUsers: project.pendingUsers
    });

    const projectData = {
      ...project,
      projectImages: project.projectImages || [],
      techStack: project.techStack || [],
      users: project.users || [],
      pendingUsers: project.pendingUsers || [],
      tags: project.tags || [],
      resources: project.resources || [],
      keyFeatures: project.keyFeatures || [],
    };

    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-6">

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <CardTitle className="text-2xl sm:text-3xl font-bold">{projectData.name}</CardTitle>
                  {projectData.status && <Badge variant="secondary">{projectData.status}</Badge>}
                  {projectData.projectType && (
                    <Badge variant={getProjectTypeBadge(projectData.projectType)}>
                      {projectData.projectType}
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2 text-base sm:text-lg">
                  {projectData.description || 'No description available'}
                </CardDescription>
                <div className="flex flex-wrap gap-4 mt-3">
                  {projectData.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">{projectData.department}</span>
                    </div>
                  )}
                  {projectData.club && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users2 className="h-4 w-4" />
                      <span className="text-sm">{projectData.club}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {projectData.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {projectData.techStack.map((tech: string) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                {projectData.demoUrl && (
                  <Button variant="default" className="gap-2 w-full sm:w-auto" asChild>
                    <a href={projectData.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      View Demo
                    </a>
                  </Button>
                )}
                {projectData.githubUrl && (
                  <Button variant="outline" className="gap-2 w-full sm:w-auto" asChild>
                    <a href={projectData.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      Source Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full flex overflow-x-auto hide-scrollbar">
            <div className="flex min-w-full sm:grid sm:grid-cols-4">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="team" className="flex-1">Team</TabsTrigger>
              <TabsTrigger value="academic" className="flex-1">Academic</TabsTrigger>
              <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Problem Statement</CardTitle>
                <CardDescription>The challenge we&apos;re addressing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {projectData.problemStatement || 'No problem statement available'}
                </p>
              </CardContent>
            </Card>

            {projectData.keyFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>Main capabilities and functionalities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {projectData.keyFeatures.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Project Images</CardTitle>
                <CardDescription>Visual overview of key interfaces and features</CardDescription>
              </CardHeader>
              <CardContent>
                {projectData.resources?.filter((resource: Resource) => resource.type === 'image').length > 0 ? (
                  <div className="grid gap-6">
                    {projectData.resources
                      .filter((resource: Resource) => resource.type === 'image')
                      .map((image: {
                        id: string,
                        title: string,
                        description: string,
                        url: string,
                        type: string
                      }, index: number) => (
                        <div key={image.id} className="space-y-3">
                          <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={image.url}
                              alt={image.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{image.title}</h4>
                            <p className="text-sm text-muted-foreground">{image.description}</p>
                          </div>
                          {index < projectData.resources.filter((r: Resource) => r.type === 'image').length - 1 && <Separator />}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No images available for this project.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Meet the people behind the project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Active Members */}
                  {projectData.users.map((member: { 
                    id: string, 
                    role: string, 
                    user: { 
                      id: string, 
                      name: string, 
                      email: string, 
                      githubUsername: string, 
                      githubProfileUrl: string, 
                      githubAvatarUrl: string, 
                      bio: string | null 
                    } 
                  }) => (
                    <div key={member.user.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.user.githubAvatarUrl} alt={member.user.name} />
                        <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                        </div>
                        {member.user.bio && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {member.user.bio}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        {member.user.githubProfileUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={member.user.githubProfileUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${member.user.email}`}>
                            <MessageSquare className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Pending Members */}
                  {projectData.pendingUsers?.map((member: {
                    id: string,
                    githubUsername: string,
                    role: string
                  }) => (
                    <div key={member.id} className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {member.githubUsername[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">@{member.githubUsername}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={`https://github.com/${member.githubUsername}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}

                  {projectData.users.length === 0 && (!projectData.pendingUsers || projectData.pendingUsers.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">
                      No team members listed for this project.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Project Tags</CardTitle>
                <CardDescription>Academic achievements and recognition</CardDescription>
              </CardHeader>
              <CardContent>
                {projectData.tags && projectData.tags.length > 0 ? (
                  <div className="space-y-6">
                    {projectData.tags.map((tag: { id: string, name: string, title: string | null, status: string | null, conference: string | null, date: string | null, competition: string | null, curator: { id: string, name: string } | null, createdAt: string }) => (
                      <div key={tag.id} className="space-y-2 border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium text-lg">
                              {tag.name}
                            </h4>
                            {tag.title && (
                              <p className="text-sm text-muted-foreground">
                                {tag.title}
                              </p>
                            )}
                          </div>
                          {tag.status && (
                            <Badge variant="secondary">
                              {tag.status}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-2">
                          {tag.conference && (
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              <span>Conference: {tag.conference}</span>
                            </div>
                          )}
                          {tag.date && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Date: {new Date(tag.date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {tag.competition && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              <span>Competition: {tag.competition}</span>
                            </div>
                          )}
                          {tag.curator && (
                            <div className="flex items-center gap-2 mt-2">
                              <Users className="h-4 w-4" />
                              <span className="text-xs">Added by {tag.curator.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No academic tags available for this project.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Project Resources</CardTitle>
                <CardDescription>Access project materials and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                {projectData.resources?.filter((resource: Resource) => resource.type !== 'image').length > 0 ? (
                  <div className="grid gap-6">
                    {projectData.resources
                      .filter((resource: Resource) => resource.type !== 'image')
                      .map((resource: Resource) => (
                        <div key={resource.id} className="space-y-3">
                          <div className="relative group">
                            <div className="p-4 rounded-lg border bg-muted">
                              <div className="flex items-center space-x-2">
                                {resource.type === 'document' && <FileText className="h-4 w-4" />}
                                {resource.type === 'presentation' && <Presentation className="h-4 w-4" />}
                                {resource.type === 'paper' && <ScrollText className="h-4 w-4" />}
                                {resource.type === 'other' && <LinkIcon className="h-4 w-4" />}
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-2"
                                >
                                  {resource.title}
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                          <Separator className="my-4" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No additional resources available for this project.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center py-8">
          <span className="text-xs text-muted-foreground/50">Made with Open Space</span>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6">
              <CardTitle className="text-xl text-red-500 mb-2">Error</CardTitle>
              <CardDescription className="text-center">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Project Details - ${params.id}`,
  };
}

export default ProjectPage;
