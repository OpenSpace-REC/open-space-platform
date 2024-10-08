'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, X } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UploadProjectsPage() {
    const [project, setProject] = useState({
        name: '',
        description: '',
        githubUrl: '',
        techStack: '',
        imageUrl: ''
    });
    const [authors, setAuthors] = useState<Author[]>([]);
    const [newAuthor, setNewAuthor] = useState({ email: '', role: '' });
    const [errors, setErrors] = useState<Partial<typeof project & { authors: string }>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const validateForm = () => {
        let formErrors: Partial<typeof project & { authors: string }> = {};
        if (!project.name.trim()) formErrors.name = 'Project name is required';
        if (!project.description.trim()) formErrors.description = 'Description is required';
        if (!project.githubUrl.trim()) formErrors.githubUrl = 'GitHub URL is required';
        else if (!/^https?:\/\/github\.com\/.*/.test(project.githubUrl)) {
            formErrors.githubUrl = 'Invalid GitHub URL';
        }
        if (project.imageUrl && !/^https?:\/\/.*/.test(project.imageUrl)) {
            formErrors.imageUrl = 'Invalid image URL';
        }
        if (authors.length === 0) formErrors.authors = 'At least one author is required';
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

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAuthor(prev => ({ ...prev, [name]: value }));
    };

    const addAuthor = () => {
        if (newAuthor.email && newAuthor.role) {
            setAuthors(prev => [...prev, { ...newAuthor, id: Date.now().toString(), name: '' }]);
            setNewAuthor({ email: '', role: '' });
            setErrors(prev => ({ ...prev, authors: undefined }));
        }
    };

    const removeAuthor = (id: string) => {
        setAuthors(prev => prev.filter(author => author.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center mb-6">Post Project</h1>
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
                            placeholder="React, Node.js, MongoDB"
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
                    <Label>Authors</Label>
                    <div className="flex space-x-2 mb-2">
                        <Input
                            name="email"
                            value={newAuthor.email}
                            onChange={handleAuthorChange}
                            placeholder="Author Email"
                            className="flex-1"
                        />
                        <Input
                            name="role"
                            value={newAuthor.role}
                            onChange={handleAuthorChange}
                            placeholder="Author Role"
                            className="flex-1"
                        />
                        <Button type="button" onClick={addAuthor}>Add</Button>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                        {authors.map(author => (
                            <div key={author.id} className="flex items-center space-x-2 mb-2">
                                <span className="flex-1">{author.email} - {author.role}</span>
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeAuthor(author.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {errors.authors && <p className="text-red-500 text-xs mt-1">{errors.authors}</p>}
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
                            : 'An error occurred. Please try again.'}
                    </AlertDialogDescription>
                    <Button onClick={() => setSubmitStatus('idle')}>Close</Button>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}