'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileCode2, Github, Loader2, Send } from 'lucide-react'
import { useUser } from '@/components/user-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BasicInfo } from './components/BasicInfo'
import { ProjectDetails } from './components/ProjectDetails'
import { KeyFeatures } from './components/KeyFeatures'
import { TeamMembers } from './components/TeamMembers'
import { ProjectResources } from './components/ProjectResources'
import { SubmitDialog } from './components/SubmitDialog'
import { Project, ProjectResource, ProjectUser, Repository } from './components/types'
import { isValidPostImageUrl, verifyGithubUsername } from './components/utils'

export default function UploadProjectsPage() {
  const { user } = useUser();
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
  })
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([])
  const [newProjectUser, setNewProjectUser] = useState({ githubUsername: '', role: 'CONTRIBUTOR' as const })
  const [errors, setErrors] = useState<Partial<typeof project & { projectUsers: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoadingRepos, setIsLoadingRepos] = useState(false)
  const [enableGithub, setEnableGithub] = useState(false)
  const [newResource, setNewResource] = useState<ProjectResource>({
    url: '',
    title: '',
    type: 'image',
    description: ''
  })
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const { toast } = useToast()

  useEffect(() => {
    if (user && user.githubUsername) {
      setProjectUsers([{ id: user.id, githubUsername: user.githubUsername, role: 'OWNER' }])
      fetchUserRepositories(user.githubUsername)
    }
  }, [user])

  const fetchUserRepositories = async (username: string) => {
    setIsLoadingRepos(true)
    try {
      const tokenResponse = await fetch('/api/github/token')
      if (!tokenResponse.ok) throw new Error('Failed to fetch GitHub token')
      const { token } = await tokenResponse.json()
      
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch repositories')
      const data = await response.json()
      setRepositories(data)
    } catch (error) {
      console.error('Error fetching repositories:', error)
    } finally {
      setIsLoadingRepos(false)
    }
  }

  const handleRepoSelect = async (repoFullName: string) => {
    const selected = repositories.find(repo => repo.full_name === repoFullName)
    if (selected) {
      setSelectedRepo(selected);
      setProject(prev => ({
        ...prev,
        githubUrl: selected.html_url,
      }))
    }
  }

  const handleProjectChange = (field: keyof Project, value: string) => {
    setProject(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleProjectUserChange = (value: string, field: 'githubUsername' | 'role') => {
    setNewProjectUser(prev => ({ ...prev, [field]: value }))
  }

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

    const loadingToast = toast({
      title: "Verifying username",
      description: "Please wait...",
    });

    const isValid = await verifyGithubUsername(newProjectUser.githubUsername);
    
    loadingToast.dismiss();

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
  }

  const removeProjectUser = (id: string) => {
    setProjectUsers(prev => prev.filter(projectUser => projectUser.id !== id))
  }

  const handleResourceChange = (field: keyof ProjectResource, value: string) => {
    setNewResource(prev => ({ ...prev, [field]: value }))
  }

  const addResource = () => {
    if (!newResource.url || !newResource.title) {
      toast({
        title: "Missing information",
        description: "Please provide a URL and title",
        variant: "destructive"
      })
      return
    }

    if (newResource.type === 'image' && !isValidPostImageUrl(newResource.url)) {
      toast({
        title: "Invalid image URL",
        description: "Please use a valid postimages.org URL (i.postimg.cc)",
        variant: "destructive"
      })
      return
    }

    try {
      new URL(newResource.url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid URL",
        variant: "destructive"
      })
      return
    }

    setProject(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }))
    setNewResource({ url: '', title: '', type: 'image', description: '' })
  }

  const removeResource = (index: number) => {
    setProject(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  const validateFormAndSetErrors = () => {
    const formErrors: Partial<Project & { projectUsers: string }> = {};

    if (!project.name.trim()) formErrors.name = 'Project name is required'
    if (!project.description.trim()) formErrors.description = 'Description is required'
    if (!project.problemStatement.trim()) formErrors.problemStatement = 'Problem statement is required'
    if (!project.projectType) formErrors.projectType = 'Project type is required'
    if (!project.status) formErrors.status = 'Project status is required'
    if (project.keyFeatures.filter(f => f.trim()).length === 0) {
      formErrors.keyFeatures = ['At least one key feature is required']
    }
    if (projectUsers.length === 0) formErrors.projectUsers = 'At least one user is required'
    
    if (project.demoUrl && !/^https?:\/\/.*/.test(project.demoUrl)) {
      formErrors.demoUrl = 'Invalid demo URL format'
    }
    if (project.imageUrl && !/^https?:\/\/.*/.test(project.imageUrl)) {
      formErrors.imageUrl = 'Invalid image URL format'
    }
    
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const isFormValid = useMemo(() => {
    if (!project.name.trim()) return false;
    if (!project.description.trim()) return false;
    if (!project.problemStatement.trim()) return false;
    if (!project.projectType) return false;
    if (!project.status) return false;
    if (project.keyFeatures.filter(f => f.trim()).length === 0) return false;
    if (projectUsers.length === 0) return false;
    if (project.demoUrl && !/^https?:\/\/.*/.test(project.demoUrl)) return false;
    if (project.imageUrl && !/^https?:\/\/.*/.test(project.imageUrl)) return false;
    return true;
  }, [project, projectUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateFormAndSetErrors() || !user) return

    if (!enableGithub && !selectedRepo) return

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/projects/post-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          techStack: project.techStack.split(',').map(tech => tech.trim()),
          users: projectUsers.map(({ githubUsername, role }) => ({ githubUsername, role })),
          ownerId: user.id,
          keyFeatures: project.keyFeatures.filter(feature => feature.trim() !== ''),
          status: project.status,
          projectType: project.projectType,
          academicHighlights: project.academicHighlights,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error === 'Project with this GitHub URL already exists') {
          setErrorMessage('A project with this GitHub URL already exists. Please check the URL or use a different one.')
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        setSubmitStatus('error')
        return
      }

      const projectData = await response.json()
      console.log('Project created:', projectData)

      if (!enableGithub && selectedRepo) {
        const webhookResponse = await fetch('/api/github/webhook/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            reponame: selectedRepo.name,
          }),
        });

        if (!webhookResponse.ok) {
          throw new Error(`Failed to set up webhook! status: ${webhookResponse.status}`);
        }

        const webhookData = await webhookResponse.json();
        console.log('Webhook setup successful:', webhookData);
      }

      setSubmitStatus('success')
    } catch (error) {
      console.error('Error creating project:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setProject({
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
    setProjectUsers(user && user.githubUsername ? [{ id: user.id, githubUsername: user.githubUsername, role: 'OWNER' }] : []);
    setNewProjectUser({ githubUsername: '', role: 'CONTRIBUTOR' });
    setErrors({});
    setSubmitStatus('idle');
  };

  const addTechStack = (tech: string) => {
    const currentTechStack = project.techStack ? project.techStack.split(',').map(t => t.trim()).filter(Boolean) : []
    if (!currentTechStack.includes(tech)) {
      const newTechStack = [...currentTechStack, tech].join(', ')
      setProject(prev => ({ ...prev, techStack: newTechStack }))
    }
  }

  const removeTech = (techToRemove: string) => {
    const currentTechStack = project.techStack ? project.techStack.split(',').map(t => t.trim()).filter(Boolean) : []
    const newTechStack = currentTechStack.filter(tech => tech !== techToRemove).join(', ')
    setProject(prev => ({ ...prev, techStack: newTechStack }))
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Card className="w-96 text-center p-6">
          <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to create and manage your projects</p>
          <Button className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Log in with GitHub
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8 bg-background">
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {enableGithub ? (
              <FileCode2 className="h-8 w-8" />
            ) : (
              <Github className="h-8 w-8" />
            )}
            <div>
              <h1 className="text-3xl font-bold">Post Your Project</h1>
              <p className="text-muted-foreground">Share your work</p>
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid || isSubmitting}
            className="w-32"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                Post
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
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
              onRepoSelect={handleRepoSelect}
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
        onClose={resetForm}
      />
    </div>
  )
}