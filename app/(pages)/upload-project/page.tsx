'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Loader2, X, Plus, Github, FileCode, FileCode2, Users, Rocket, LibraryBig, ImagePlus, Trash2, Upload, Send, FileText, Presentation, ScrollText, Link, Lock } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useUser } from '@/components/user-context'
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from 'next/image'

interface ProjectUser {
  id: string
  githubUsername: string
  role: 'OWNER' | 'CONTRIBUTOR'
}

interface Repository {
  name: string
  full_name: string
  description: string
  html_url: string
}

interface ProjectImage {
  url: string;
  title: string;
  description: string;
}

interface Technology {
  value: string;
  label: string;
}

interface ProjectResource {
  url: string;
  title: string;
  type: 'image' | 'document' | 'presentation' | 'paper' | 'other';
  description: string;
}

const COMMON_TECHNOLOGIES: Technology[] = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "nodejs", label: "Node.js" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "prisma", label: "Prisma" },

]

const CHAR_LIMITS = {
  name: { min: 3, max: 100 },
  description: { min: 50, max: 500 },
  problemStatement: { min: 50, max: 1000 },
  featureDescription: { min: 10, max: 200 },
  resourceTitle: { min: 3, max: 100 },
  resourceDescription: { min: 0, max: 300 }
}

const isValidPostImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'i.postimg.cc' && /\.(jpg|jpeg|png|gif)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

const verifyGithubUsername = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    return response.status === 200;
  } catch {
    return false;
  }
};

export default function UploadProjectsPage() {
  const { user } = useUser();
  const [project, setProject] = useState({
    name: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    techStack: '',
    imageUrl: '',
    problemStatement: '',
    status: 'In Development',
    projectType: '',
    keyFeatures: [''],
    academicHighlights: [] as { title: string; status: string; conference?: string; date?: string; competition?: string }[],
    resources: [] as ProjectResource[],
    projectImages: [] as ProjectImage[],
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
  const [newImage, setNewImage] = useState<ProjectImage>({
    url: '',
    title: '',
    description: ''
  });
  const { toast } = useToast()

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

  useEffect(() => {
    if (user && user.githubUsername) {
      setProjectUsers([{ id: user.id, githubUsername: user.githubUsername, role: 'OWNER' }])
      fetchUserRepositories(user.githubUsername)
    }
  }, [user])

  const fetchUserRepositories = async (username: string) => {
    setIsLoadingRepos(true)
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`)
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
      setProject(prev => ({
        ...prev,
        githubUrl: selected.html_url,
      }))
    }
  }

  const validateForm = () => {
    const formErrors: Partial<{
      name: string;
      description: string;
      demoUrl: string;
      techStack: string;
      imageUrl: string;
      problemStatement: string;
      status: string;
      projectType: string;
      keyFeatures: string[];
      academicHighlights: {
        title: string;
        status: string;
        conference?: string;
        date?: string;
        competition?: string;
      }[];
      projectUsers: string;
    }> = {};

    if (!project.name.trim()) {
      formErrors.name = 'Project name is required'
    } else if (project.name.length < CHAR_LIMITS.name.min || project.name.length > CHAR_LIMITS.name.max) {
      formErrors.name = `Project name must be between ${CHAR_LIMITS.name.min} and ${CHAR_LIMITS.name.max} characters`
    }

    if (!project.description.trim()) {
      formErrors.description = 'Description is required'
    } else if (project.description.length < CHAR_LIMITS.description.min || project.description.length > CHAR_LIMITS.description.max) {
      formErrors.description = `Description must be between ${CHAR_LIMITS.description.min} and ${CHAR_LIMITS.description.max} characters`
    }

    if (!project.problemStatement.trim()) {
      formErrors.problemStatement = 'Problem statement is required'
    } else if (project.problemStatement.length < CHAR_LIMITS.problemStatement.min || project.problemStatement.length > CHAR_LIMITS.problemStatement.max) {
      formErrors.problemStatement = `Problem statement must be between ${CHAR_LIMITS.problemStatement.min} and ${CHAR_LIMITS.problemStatement.max} characters`
    }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProject(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof project]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
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
  };

  const removeProjectUser = (id: string) => {
    setProjectUsers(prev => prev.filter(projectUser => projectUser.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !user) return

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

      const data = await response.json()
      console.log('Project created:', data)
      setSubmitStatus('success')
    } catch (error) {
      console.error('Error creating project:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImage = () => {
    if (!newImage.url || !newImage.title) {
      toast({
        title: "Missing information",
        description: "Please provide an image URL and title",
        variant: "destructive"
      })
      return
    }

    try {
      new URL(newImage.url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid image URL",
        variant: "destructive"
      })
      return
    }

    setProject(prev => ({
      ...prev,
      projectImages: [...prev.projectImages, newImage]
    }))
    setNewImage({ url: '', title: '', description: '' })
  }

  const removeImage = (index: number) => {
    setProject(prev => ({
      ...prev,
      projectImages: prev.projectImages.filter((_, i) => i !== index)
    }))
  }

  const isFormValid = () => {
    return !!(
      project.name.trim() &&
      project.description.trim() &&
      project.problemStatement.trim() &&
      project.projectType &&
      project.status &&
      project.keyFeatures.some(f => f.trim()) &&
      projectUsers.length > 0 &&
      (!project.demoUrl || /^https?:\/\/.*/.test(project.demoUrl))
    )
  }

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
        <Card className="w-96 text-center">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to create and manage your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Github className="mr-2 h-4 w-4" />
              Log in with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {enableGithub ? (
                <FileCode2 className="h-8 w-8" />
              ) : (
                <Github className="h-8 w-8" />
              )}
              <div>
                <CardTitle className="text-3xl">Post Your Project</CardTitle>
                <CardDescription>Share your work</CardDescription>
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={!isFormValid() || isSubmitting}
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
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="space-x-2">
            <FileCode className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="space-x-2">
            <LibraryBig className="h-4 w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="space-x-2">
            <Rocket className="h-4 w-4" />
            <span>Features</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="space-x-2">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="space-x-2">
            <LibraryBig className="h-4 w-4" />
            <span>Resources</span>
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Basics</CardTitle>
                <CardDescription>Enter the fundamental details of your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableGithub">Private Repository</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable for private GitHub repositories
                    </div>
                  </div>
                  <Switch
                    id="enableGithub"
                    checked={enableGithub}
                    onCheckedChange={(checked) => {
                      setEnableGithub(checked);
                      if (checked && project.githubUrl) {
                        // Clear GitHub URL when switching to private repository
                        setProject(prev => ({ ...prev, githubUrl: '' }));
                      }
                    }}
                  />
                </div>

                {!enableGithub && (
                  <div className="space-y-4">
                    <Label htmlFor="repoSelect">GitHub Repository</Label>
                    <Select onValueChange={handleRepoSelect} disabled={isLoadingRepos}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingRepos ? "Loading repositories..." : "Select a repository"} />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-72">
                          {repositories.map(repo => (
                            <SelectItem key={repo.full_name} value={repo.full_name}>
                              <div className="flex items-center">
                                <Github className="w-4 h-4 mr-2" />
                                <span>{repo.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={project.name}
                      onChange={handleChange}
                      className={errors.name ? 'border-destructive' : ''}
                      maxLength={CHAR_LIMITS.name.max}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{project.name.length}/{CHAR_LIMITS.name.max} characters</span>
                      <span>Min: {CHAR_LIMITS.name.min} characters</span>
                    </div>
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={project.description}
                      onChange={handleChange}
                      className={`h-24 ${errors.description ? 'border-destructive' : ''}`}
                      placeholder="Describe your project..."
                      maxLength={CHAR_LIMITS.description.max}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{project.description.length}/{CHAR_LIMITS.description.max} characters</span>
                      <span>Min: {CHAR_LIMITS.description.min} characters</span>
                    </div>
                    {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="demoUrl">
                      Demo URL <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <Input
                      id="demoUrl"
                      name="demoUrl"
                      value={project.demoUrl}
                      onChange={handleChange}
                      placeholder="https://your-demo-url.com"
                      className={errors.demoUrl ? 'border-destructive' : ''}
                    />
                    {errors.demoUrl && <p className="text-destructive text-xs mt-1">{errors.demoUrl}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Provide additional information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="problemStatement">Problem Statement</Label>
                    <Textarea
                      id="problemStatement"
                      name="problemStatement"
                      value={project.problemStatement}
                      onChange={handleChange}
                      className="h-24"
                      placeholder="Describe the problem your project aims to solve..."
                      maxLength={CHAR_LIMITS.problemStatement.max}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{project.problemStatement.length}/{CHAR_LIMITS.problemStatement.max} characters</span>
                      <span>Min: {CHAR_LIMITS.problemStatement.min} characters</span>
                    </div>
                    {errors.problemStatement && <p className="text-destructive text-xs mt-1">{errors.problemStatement}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select onValueChange={(value) => setProject(prev => ({ ...prev, projectType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Final Year Project">Final Year Project</SelectItem>
                          <SelectItem value="Personal Project">Personal Project</SelectItem>
                          <SelectItem value="Research Project">Research Project</SelectItem>
                          <SelectItem value="Hackathon Project">Hackathon Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Project Status</Label>
                      <Select onValueChange={(value) => setProject(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Development">
                            <Badge variant="default">In Development</Badge>
                          </SelectItem>
                          <SelectItem value="Completed">
                            <Badge variant="secondary">Completed</Badge>
                          </SelectItem>
                          <SelectItem value="On Hold">
                            <Badge variant="outline">On Hold</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(project.techStack || '').split(',').map((tech, index) => (
                      tech.trim() && (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tech.trim()}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTech(tech.trim())}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )
                    ))}
                  </div>
                  <Select
                    onValueChange={(value) => {
                      addTechStack(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add technologies..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_TECHNOLOGIES.map((tech) => (
                        <SelectItem key={tech.value} value={tech.label}>
                          {tech.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>List the main features of your project</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {project.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...project.keyFeatures]
                            newFeatures[index] = e.target.value
                            setProject(prev => ({ ...prev, keyFeatures: newFeatures }))
                          }}
                          placeholder="Enter a key feature"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newFeatures = project.keyFeatures.filter((_, i) => i !== index)
                            setProject(prev => ({ ...prev, keyFeatures: newFeatures }))
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setProject(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, ''] }))}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Add contributors to your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Input
                    name="githubUsername"
                    value={newProjectUser.githubUsername}
                    onChange={(e) => handleProjectUserChange(e.target.value, 'githubUsername')}
                    placeholder="GitHub Username"
                    className="flex-1"
                  />
                  <Select 
                    onValueChange={(value) => handleProjectUserChange(value, 'role')} 
                    value={newProjectUser.role}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                      <SelectItem value="OWNER">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    onClick={() => void addProjectUser()} 
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add User
                  </Button>
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {projectUsers.map(projectUser => (
                      <div key={projectUser.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          <span>{projectUser.githubUsername}</span>
                          <Badge variant={projectUser.role === 'OWNER' ? 'default' : 'secondary'}>
                            {projectUser.role}
                          </Badge>
                        </span>
                        {projectUser.role !== 'OWNER' && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeProjectUser(projectUser.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {errors.projectUsers && <p className="text-destructive text-xs">{errors.projectUsers}</p>}
              </CardContent>
            </Card>

            
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Resources</CardTitle>
                <CardDescription>
                  Add visual content and supporting documents for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full h-32 border-dashed" variant="outline">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-8 w-8" />
                        <span>Add New Resource</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Project Resource</DialogTitle>
                      <DialogDescription>Add resource details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Resource Type</Label>
                        <Select
                          onValueChange={(value) => setNewResource(prev => ({ ...prev, type: value as ProjectResource['type'] }))}
                          value={newResource.type}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select resource type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="presentation">Presentation</SelectItem>
                            <SelectItem value="paper">Research Paper</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Resource URL</Label>
                        <Input
                          value={newResource.url}
                          onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://i.postimg.cc/your-image-id/image.jpg"
                        />
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Please use <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">postimages.org</a> to upload your image</p>
                          <p>Only direct image URLs from i.postimg.cc are accepted</p>
                          <p>Example: https://i.postimg.cc/image-id/image.jpg</p>
                        </div>
                        {newResource.type === 'image' && newResource.url && (
                          isValidPostImageUrl(newResource.url) ? (
                            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                              <Image
                                src={newResource.url}
                                alt="Preview"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-image.png';
                                }}
                              />
                            </div>
                          ) : (
                            <p className="text-destructive text-xs">Please provide a valid postimages.org URL</p>
                          )
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={newResource.title}
                          onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Resource title"
                          maxLength={CHAR_LIMITS.resourceTitle.max}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{newResource.title.length}/{CHAR_LIMITS.resourceTitle.max} characters</span>
                          <span>Min: {CHAR_LIMITS.resourceTitle.min} characters</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newResource.description}
                          onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe this resource"
                          maxLength={CHAR_LIMITS.resourceDescription.max}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{newResource.description.length}/{CHAR_LIMITS.resourceDescription.max} characters</span>
                          <span>Optional</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
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
                        }}
                        className="w-full"
                      >
                        Add Resource
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <ScrollArea className="h-[500px]">
                  <div className="grid gap-6">
                    {project.resources.map((resource, index) => (
                      <div key={index} className="space-y-3">
                        <div className="relative group">
                          {resource.type === 'image' ? (
                            <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                              <Image
                                src={resource.url}
                                alt={resource.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="p-4 rounded-lg border bg-muted">
                              <div className="flex items-center space-x-2">
                                {resource.type === 'document' && <FileText className="h-4 w-4" />}
                                {resource.type === 'presentation' && <Presentation className="h-4 w-4" />}
                                {resource.type === 'paper' && <ScrollText className="h-4 w-4" />}
                                {resource.type === 'other' && <Link className="h-4 w-4" />}
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                                   className="text-primary hover:underline">
                                  {resource.title}
                                </a>
                              </div>
                            </div>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setProject(prev => ({
                                ...prev,
                                resources: prev.resources.filter((_, i) => i !== index)
                              }))
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                        {index < project.resources.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>

      <AlertDialog open={submitStatus !== 'idle'}>
        <AlertDialogContent>
          <AlertDialogTitle>
            {submitStatus === 'success' ? 'Success!' : 'Error'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {submitStatus === 'success'
              ? 'Your project has been successfully created!'
              : `An error occurred: ${errorMessage}. Please try again.`}
          </AlertDialogDescription>
          <Button onClick={() => resetForm()}>Close</Button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}