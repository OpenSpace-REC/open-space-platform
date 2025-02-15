'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileCode2, Github, Loader2, Send, Trash2 } from 'lucide-react'
import { useUser } from '@/components/user-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

// Import reusable components
import { BasicInfo } from '../../upload-project/components/BasicInfo'
import { ProjectDetails } from '../../upload-project/components/ProjectDetails'
import { KeyFeatures } from '../../upload-project/components/KeyFeatures'
import { TeamMembers } from '../../upload-project/components/TeamMembers'
import { ProjectResources } from '../../upload-project/components/ProjectResources'
import { SubmitDialog } from '../../upload-project/components/SubmitDialog'
import { Project, ProjectResource, ProjectUser, Repository } from '../../upload-project/components/types'
import { isValidPostImageUrl, verifyGithubUsername } from '../../upload-project/components/utils'

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Project>({
    name: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    techStack: '',
    imageUrl: '',
    problemStatement: '',
    status: 'In Development',
    projectType: '',
    department: '',
    club: '',
    keyFeatures: [''],
    academicHighlights: [],
    resources: [],
    projectImages: [],
  });
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [newProjectUser, setNewProjectUser] = useState({ githubUsername: '', role: 'CONTRIBUTOR' as const });
  const [errors, setErrors] = useState<Partial<typeof project & { projectUsers: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [enableGithub, setEnableGithub] = useState(false);
  const [newResource, setNewResource] = useState<ProjectResource>({
    url: '',
    title: '',
    type: 'image',
    description: ''
  });
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const { toast } = useToast();
  const [projectOwner, setProjectOwner] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        
        const projectData = await response.json();
        
        setProject({
          name: projectData.name,
          description: projectData.description || '',
          githubUrl: projectData.githubUrl || '',
          demoUrl: projectData.demoUrl || '',
          techStack: Array.isArray(projectData.techStack) ? projectData.techStack.join(', ') : '',
          imageUrl: projectData.imageUrl || '',
          problemStatement: projectData.problemStatement || '',
          status: projectData.status,
          projectType: projectData.projectType,
          department: projectData.department || '',
          club: projectData.club || '',
          keyFeatures: projectData.keyFeatures || [''],
          academicHighlights: projectData.academicHighlights || [],
          resources: projectData.resources || [],
          projectImages: projectData.projectImages || [],
        });

        setProjectUsers(
          projectData.users.map((user: { user: { id: string; githubUsername: string }; role: 'OWNER' | 'CONTRIBUTOR' }) => ({
            id: user.user.id,
            githubUsername: user.user.githubUsername,
            role: user.role,
          }))
        );

        const ownerUser = projectData.users.find((user: { role: string }) => user.role === 'OWNER');
        setProjectOwner(ownerUser?.user?.githubUsername || null);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to fetch project details",
          variant: "destructive"
        });
      }
    };

    if (params.id) {
      fetchProjectData();
    }
  }, [params.id, toast]);

  const handleProjectChange = (field: keyof Project, value: string) => {
    setProject(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProjectUserChange = (value: string, field: 'githubUsername' | 'role') => {
    setNewProjectUser(prev => ({ ...prev, [field]: value }));
  };

  const addProjectUser = async () => {
    if (!newProjectUser.githubUsername) {
      toast({
        title: "Missing username",
        description: "Please enter a GitHub username",
        variant: "destructive"
      });
      return;
    }

    if (projectUsers.some(user => user.githubUsername.toLowerCase() === newProjectUser.githubUsername.toLowerCase())) {
      toast({
        title: "Duplicate user",
        description: "This user has already been added to the project",
        variant: "destructive"
      });
      return;
    }

    const isValid = await verifyGithubUsername(newProjectUser.githubUsername);
    
    if (!isValid) {
      toast({
        title: "Invalid username",
        description: "Please enter a valid GitHub username",
        variant: "destructive"
      });
      return;
    }

    setProjectUsers(prev => [...prev, { ...newProjectUser, id: Date.now().toString() }]);
    setNewProjectUser({ githubUsername: '', role: 'CONTRIBUTOR' });
    setErrors(prev => ({ ...prev, projectUsers: undefined }));

    toast({
      title: "Team member added",
      description: `@${newProjectUser.githubUsername} has been added to the project`,
    });
  };

  const removeProjectUser = (id: string) => {
    setProjectUsers(prev => prev.filter(projectUser => projectUser.id !== id));
  };

  const handleResourceChange = (field: keyof ProjectResource, value: string) => {
    setNewResource(prev => ({ ...prev, [field]: value }));
  };

  const addResource = () => {
    if (!newResource.url || !newResource.title) {
      toast({
        title: "Missing information",
        description: "Please provide a URL and title",
        variant: "destructive"
      });
      return;
    }

    if (newResource.type === 'image' && !isValidPostImageUrl(newResource.url)) {
      toast({
        title: "Invalid image URL",
        description: "Please use a valid postimages.org URL (i.postimg.cc)",
        variant: "destructive"
      });
      return;
    }

    setProject(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));
    setNewResource({ url: '', title: '', type: 'image', description: '' });
  };

  const removeResource = (index: number) => {
    setProject(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const addTechStack = (tech: string) => {
    const currentTechStack = project.techStack ? project.techStack.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (!currentTechStack.includes(tech)) {
      const newTechStack = [...currentTechStack, tech].join(', ');
      setProject(prev => ({ ...prev, techStack: newTechStack }));
    }
  };

  const removeTech = (techToRemove: string) => {
    const currentTechStack = project.techStack ? project.techStack.split(',').map(t => t.trim()).filter(Boolean) : [];
    const newTechStack = currentTechStack.filter(tech => tech !== techToRemove).join(', ');
    setProject(prev => ({ ...prev, techStack: newTechStack }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          techStack: project.techStack.split(',').map(tech => tech.trim()).filter(Boolean),
          users: projectUsers.map(({ githubUsername, role }) => ({ githubUsername, role })),
        }),
      });

      if (!response.ok) throw new Error('Failed to update project');

      setSubmitStatus('success');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating project:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = Boolean(user?.githubUsername && projectUsers.some(projectUser => 
    projectUser.githubUsername === user.githubUsername && projectUser.role === 'OWNER'
  ));

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Card className="w-96 text-center p-6">
          <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to edit projects</p>
          <Button className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Log in with GitHub
          </Button>
        </Card>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Card className="w-96 text-center p-6">
          <h2 className="text-2xl font-semibold mb-2">Permission Denied</h2>
          <p className="text-muted-foreground mb-4">You do not have permission to edit this project.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileCode2 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Edit Project</h1>
              <p className="text-muted-foreground">Update your project details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </>
              )}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save Changes
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="space-x-2">
            <FileCode2 className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="space-x-2">
            <FileCode2 className="h-4 w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="space-x-2">
            <FileCode2 className="h-4 w-4" />
            <span>Features</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="space-x-2">
            <FileCode2 className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="space-x-2">
            <FileCode2 className="h-4 w-4" />
            <span>Resources</span>
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="basic">
            <BasicInfo
              project={project}
              enableGithub={enableGithub}
              repositories={repositories}
              isLoadingRepos={isLoadingRepos}
              errors={errors}
              onProjectChange={handleProjectChange}
              onEnableGithubChange={setEnableGithub}
              onRepoSelect={(repoFullName) => {
                const selected = repositories.find(repo => repo.full_name === repoFullName);
                if (selected) {
                  setSelectedRepo(selected);
                  setProject(prev => ({
                    ...prev,
                    githubUrl: selected.html_url,
                  }));
                }
              }}
            />
          </TabsContent>

          <TabsContent value="details">
            <ProjectDetails
              project={project}
              errors={errors}
              onProjectChange={handleProjectChange}
              addTechStack={addTechStack}
              removeTech={removeTech}
            />
          </TabsContent>

          <TabsContent value="features">
            <KeyFeatures
              project={project}
              onKeyFeaturesChange={(features) => setProject(prev => ({ ...prev, keyFeatures: features }))}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembers
              projectUsers={projectUsers}
              newProjectUser={newProjectUser}
              errors={errors}
              onProjectUserChange={handleProjectUserChange}
              onAddProjectUser={addProjectUser}
              onRemoveProjectUser={removeProjectUser}
            />
          </TabsContent>

          <TabsContent value="resources">
            <ProjectResources
              project={project}
              newResource={newResource}
              onResourceChange={handleResourceChange}
              onAddResource={addResource}
              onRemoveResource={removeResource}
              isValidPostImageUrl={isValidPostImageUrl}
            />
          </TabsContent>
        </form>
      </Tabs>

      <SubmitDialog
        submitStatus={submitStatus}
        errorMessage={errorMessage}
        onClose={() => {
          setSubmitStatus('idle');
          setErrorMessage('');
        }}
      />
    </div>
  );
}