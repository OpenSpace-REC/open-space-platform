'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Loader2, X, Plus, Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/components/user-context'

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

interface User {
  id: string
  githubUsername: string
}

interface UploadProjectsPageProps {
  user: User | null
}

export default function UploadProjectsPage() {
  const { user } = useUser();
  const [project, setProject] = useState({
    name: '',
    description: '',
    githubUrl: '',
    techStack: '',
    imageUrl: ''
  })
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([])
  const [newProjectUser, setNewProjectUser] = useState({ githubUsername: '', role: 'CONTRIBUTOR' as const })
  const [errors, setErrors] = useState<Partial<typeof project & { projectUsers: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [isLoadingRepos, setIsLoadingRepos] = useState(false)

  const resetForm = () => {
    setProject({
      name: '',
      description: '',
      githubUrl: '',
      techStack: '',
      imageUrl: ''
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
      setSelectedRepo(selected)
      setProject({
        name: selected.name,
        description: selected.description || '',
        githubUrl: selected.html_url,
        techStack: '',
        imageUrl: ''
      })

      // Fetch README content
      try {
        const readmeResponse = await fetch(`https://api.github.com/repos/${repoFullName}/readme`)
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json()
          const readmeContent = atob(readmeData.content)
          // Update description with README content (you might want to truncate or process this)
          setProject(prev => ({ ...prev, description: readmeContent.substring(0, 500) + '...' }))
        }
      } catch (error) {
        console.error('Error fetching README:', error)
      }
    }
  }

  const validateForm = () => {
    let formErrors: Partial<typeof project & { projectUsers: string }> = {}
    if (!project.name.trim()) formErrors.name = 'Project name is required'
    if (!project.description.trim()) formErrors.description = 'Description is required'
    if (!project.githubUrl.trim()) formErrors.githubUrl = 'GitHub URL is required'
    else if (!/^https?:\/\/github\.com\/.*/.test(project.githubUrl)) {
      formErrors.githubUrl = 'Invalid GitHub URL'
    }
    if (project.imageUrl && !/^https?:\/\/.*/.test(project.imageUrl)) {
      formErrors.imageUrl = 'Invalid image URL'
    }
    if (projectUsers.length === 0) formErrors.projectUsers = 'At least one user is required'
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

  const addProjectUser = () => {
    if (newProjectUser.githubUsername) {
      setProjectUsers(prev => [...prev, { ...newProjectUser, id: Date.now().toString() }])
      setNewProjectUser({ githubUsername: '', role: 'CONTRIBUTOR' })
      setErrors(prev => ({ ...prev, projectUsers: undefined }))
    }
  }

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

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please log in to create a project.</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">Post Your Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="repoSelect">Select GitHub Repository</Label>
              <Select onValueChange={handleRepoSelect} disabled={isLoadingRepos}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingRepos ? "Loading repositories..." : "Select a repository"} />
                </SelectTrigger>
                <SelectContent>
                  {repositories.map(repo => (
                    <SelectItem key={repo.full_name} value={repo.full_name}>
                      <div className="flex items-center">
                        <Github className="w-4 h-4 mr-2" />
                        <span>{repo.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  value={project.githubUrl}
                  onChange={handleChange}
                  className={errors.githubUrl ? 'border-destructive' : ''}
                  readOnly
                />
                {errors.githubUrl && <p className="text-destructive text-xs">{errors.githubUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={project.name}
                  onChange={handleChange}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={project.description}
                onChange={handleChange}
                className={`h-24 ${errors.description ? 'border-destructive' : ''}`}
              />
              {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                <Input
                  id="techStack"
                  name="techStack"
                  value={project.techStack}
                  onChange={handleChange}
                  placeholder="TypeScript, React, Node.js, PostgreSQL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={project.imageUrl}
                  onChange={handleChange}
                  className={errors.imageUrl ? 'border-destructive' : ''}
                />
                {errors.imageUrl && <p className="text-destructive text-xs">{errors.imageUrl}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Project Users</Label>
              <div className="flex flex-wrap gap-4">
                <Input
                  name="githubUsername"  
                  value={newProjectUser.githubUsername}
                  onChange={(e) => handleProjectUserChange(e.target.value, 'githubUsername')}
                  placeholder="GitHub Username"
                  className="flex-1"
                />
                <Select onValueChange={(value) => handleProjectUserChange(value, 'role')} value={newProjectUser.role}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                    <SelectItem value="OWNER">Owner</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addProjectUser} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2">
                {projectUsers.map(projectUser => (
                  <div key={projectUser.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      {projectUser.githubUsername} ({projectUser.role})
                    </span>
                    {projectUser.role !== 'OWNER' && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeProjectUser(projectUser.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.projectUsers && <p className="text-destructive text-xs">{errors.projectUsers}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={submitStatus !== 'idle'}>
        <AlertDialogContent>
          <AlertDialogTitle>
            {submitStatus === 'success' ? 'Success' : 'Error'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {submitStatus === 'success'
              ? 'Project successfully created!'
              : `An error occurred: ${errorMessage}. Please try again.`}
          </AlertDialogDescription>
          <Button onClick={() => resetForm()}>Close</Button>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}