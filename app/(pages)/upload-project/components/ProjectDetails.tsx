import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import TechStackSelector from '@/components/ui/dymanic-techstack'
import { Project, CHAR_LIMITS } from './types'

interface ProjectDetailsProps {
  project: Project;
  errors: Partial<Project & { projectUsers: string }>;
  onProjectChange: (field: keyof Project, value: string) => void;
  addTechStack: (tech: string) => void;
  removeTech: (tech: string) => void;
}

export function ProjectDetails({
  project,
  errors,
  onProjectChange,
  addTechStack,
  removeTech
}: ProjectDetailsProps) {
  return (
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
              onChange={(e) => onProjectChange('problemStatement', e.target.value)}
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
              <Select onValueChange={(value) => onProjectChange('projectType', value)}>
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
              <Select onValueChange={(value) => onProjectChange('status', value)}>
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
          <TechStackSelector 
            project={{ techStack: project.techStack }} 
            addTechStack={addTechStack} 
            removeTech={removeTech} 
          />
        </div>
      </CardContent>
    </Card>
  )
} 