import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Github, Plus, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { ProjectUser } from './types'

interface TeamMembersProps {
  projectUsers: ProjectUser[];
  newProjectUser: { githubUsername: string; role: 'OWNER' | 'CONTRIBUTOR' };
  errors: { projectUsers?: string };
  onProjectUserChange: (value: string, field: 'githubUsername' | 'role') => void;
  onAddProjectUser: () => Promise<void>;
  onRemoveProjectUser: (id: string) => void;
}

export function TeamMembers({
  projectUsers,
  newProjectUser,
  errors,
  onProjectUserChange,
  onAddProjectUser,
  onRemoveProjectUser
}: TeamMembersProps) {
  const { toast } = useToast()

  return (
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
            onChange={(e) => onProjectUserChange(e.target.value, 'githubUsername')}
            placeholder="GitHub Username"
            className="flex-1"
          />
          <Select 
            onValueChange={(value) => onProjectUserChange(value, 'role')} 
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
            onClick={() => void onAddProjectUser()} 
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
                  <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveProjectUser(projectUser.id)}>
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
  )
} 