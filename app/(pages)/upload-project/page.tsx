'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, X } from 'lucide-react';
import { useUser } from '@/components/user-context';

interface ProjectUser {
  id: string;
  githubUsername: string;
  role: 'OWNER' | 'CONTRIBUTOR';
}

export default function UploadProjectsPage() {
  const { user } = useUser();
  const [project, setProject] = useState({
    name: '',
    description: '',
    githubUrl: '',
    techStack: '',
    imageUrl: ''
  });
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const [newProjectUser, setNewProjectUser] = useState({ githubUsername: '', role: 'CONTRIBUTOR' as const });
  const [errors, setErrors] = useState<Partial<typeof project & { projectUsers: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
      setProjectUsers([{ id: user.id, githubUsername: user.githubUsername, role: 'OWNER' }]);
    }
  }, [user]);

  const validateForm = () => {
    let formErrors: Partial<typeof project & { projectUsers: string }> = {};
    if (!project.name.trim()) formErrors.name = 'Project name is required';
    if (!project.description.trim()) formErrors.description = 'Description is required';
    if (!project.githubUrl.trim()) formErrors.githubUrl = 'GitHub URL is required';
    else if (!/^https?:\/\/github\.com\/.*/.test(project.githubUrl)) {
      formErrors.githubUrl = 'Invalid GitHub URL';
    }
    if (project.imageUrl && !/^https?:\/\/.*/.test(project.imageUrl)) {
      formErrors.imageUrl = 'Invalid image URL';
    }
    if (projectUsers.length === 0) formErrors.projectUsers = 'At least one user is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof project]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleProjectUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProjectUser(prev => ({ ...prev, [name]: value }));
  };

  const addProjectUser = () => {
    if (newProjectUser.githubUsername) {
      setProjectUsers(prev => [...prev, { ...newProjectUser, id: Date.now().toString() }]);
      setNewProjectUser({ githubUsername: '', role: 'CONTRIBUTOR' });
      setErrors(prev => ({ ...prev, projectUsers: undefined }));
    }
  };

  const removeProjectUser = (id: string) => {
    setProjectUsers(prev => prev.filter(projectUser => projectUser.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;
  
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
  
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
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Project with this GitHub URL already exists') {
          setErrorMessage('A project with this GitHub URL already exists. Please check the URL or use a different one.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setSubmitStatus('error');
        return;
      }
  
      const data = await response.json();
      console.log('Project created:', data);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error creating project:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!user) {
    return <div>Please log in to create a project.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6">Post Your Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              name="name"
              value={project.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              value={project.githubUrl}
              onChange={handleChange}
              className={errors.githubUrl ? 'border-red-500' : ''}
            />
            {errors.githubUrl && <p className="text-red-500 text-xs mt-1">{errors.githubUrl}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            className={`h-24 ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
            <Input
              id="techStack"
              name="techStack"
              value={project.techStack}
              onChange={handleChange}
              placeholder="TypeScript, React, Node.js, PostgreSQL"
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={project.imageUrl}
              onChange={handleChange}
              className={errors.imageUrl ? 'border-red-500' : ''}
            />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
          </div>
        </div>

        <div>
          <Label>Project Users</Label>
          <div className="flex space-x-2 mb-2">
            <Input
              name="githubUsername"  
              value={newProjectUser.githubUsername}
              onChange={handleProjectUserChange}
              placeholder="GitHub Username"
              className="flex-1"
            />
            <select
              name="role"
              value={newProjectUser.role}
              onChange={handleProjectUserChange}
              className="border rounded px-2 py-1"
            >
              <option value="CONTRIBUTOR">Contributor</option>
            </select>
            <Button type="button" onClick={addProjectUser}>Add</Button>
          </div>

          <div className="max-h-32 overflow-y-auto">
            {projectUsers.map(projectUser => (
              <div key={projectUser.id} className="flex items-center space-x-2 mb-2">
                <span className="flex-1">{projectUser.githubUsername} ({projectUser.role})</span>
                {projectUser.role !== 'OWNER' && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeProjectUser(projectUser.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.projectUsers && <p className="text-red-500 text-xs mt-1">{errors.projectUsers}</p>}
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
          <Button onClick={resetForm}>Close</Button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}