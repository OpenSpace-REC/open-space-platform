import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Github, Loader2 } from 'lucide-react'
import { Project, Repository, CHAR_LIMITS } from './types'

interface BasicInfoProps {
  project: Project;
  enableGithub: boolean;
  repositories: Repository[];
  isLoadingRepos: boolean;
  errors: Partial<Project & { projectUsers: string }>;
  onProjectChange: (field: keyof Project, value: string) => void;
  onEnableGithubChange: (checked: boolean) => void;
  onRepoSelect: (repoFullName: string) => void;
}

export function BasicInfo({
  project,
  enableGithub,
  repositories,
  isLoadingRepos,
  errors,
  onProjectChange,
  onEnableGithubChange,
  onRepoSelect
}: BasicInfoProps) {
  const departments = [
    'Computer Science',
    'Electronics and Communication',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology',
    'Other'
  ]

  const clubs = [
    'Coding Club',
    'Robotics Club',
    'IEEE Student Branch',
    'Innovation Club',
    'Research Club',
    'Design Club',
    'Other'
  ]

  return (
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
            onCheckedChange={onEnableGithubChange}
          />
        </div>

        {!enableGithub && (
          <div className="space-y-4">
            <Label htmlFor="repoSelect">GitHub Repository</Label>
            <Select 
              onValueChange={onRepoSelect} 
              disabled={isLoadingRepos}
              value={repositories.find(repo => repo.html_url === project.githubUrl)?.full_name}
            >
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
              onChange={(e) => onProjectChange('name', e.target.value)}
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
            <Label htmlFor="department">Department</Label>
            <Select
              value={project.department}
              onValueChange={(value) => onProjectChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="club">Club</Label>
            <Select
              value={project.club}
              onValueChange={(value) => onProjectChange('club', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select club" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club} value={club}>
                    {club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={project.description}
              onChange={(e) => onProjectChange('description', e.target.value)}
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
              onChange={(e) => onProjectChange('demoUrl', e.target.value)}
              placeholder="https://your-demo-url.com"
              className={errors.demoUrl ? 'border-destructive' : ''}
            />
            {errors.demoUrl && <p className="text-destructive text-xs mt-1">{errors.demoUrl}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 