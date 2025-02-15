'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, Mail, Github, Calendar, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { type User } from '@/components/user-context';
import TechStackSelector from '@/components/ui/dymanic-techstack';

interface ProfileSectionProps {
  user: {
    name: string;
    bio: string | null;
    email: string;
    githubUsername?: string;
    githubProfileUrl?: string;
    githubAvatarUrl?: string;
    joinDate?: string;
    rank?: string;
    techStack?: string[];
  };
  updateUser: (user: User) => void;
}

interface EditableProfileData {
  name: string;
  bio: string | null;
  techStack: string;
}

interface ValidationErrors {
  name?: string;
  bio?: string;
}

export function ProfileSection({ user, updateUser }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<EditableProfileData>({
    name: user.name,
    bio: user.bio,
    techStack: user.techStack?.join(',') || ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    setEditableData({
      name: user.name,
      bio: user.bio,
      techStack: user.techStack?.join(',') || ''
    });
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!editableData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editableData.name.trim(),
          bio: editableData.bio?.trim() || null,
          techStack: editableData.techStack.split(',').filter(tech => tech.trim()),
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditableData({
        name: user.name,
        bio: user.bio,
        techStack: user.techStack?.join(',') || ''
      });
      setErrors({});
    }
    setIsEditing(open);
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${user.githubUsername}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy profile link');
    }
  };

  const addTechStack = (tech: string) => {
    const currentTechs = editableData.techStack.split(',').filter(t => t.trim());
    if (!currentTechs.includes(tech)) {
      setEditableData(prev => ({
        ...prev,
        techStack: [...currentTechs, tech].join(',')
      }));
    }
  };

  const removeTech = (techToRemove: string) => {
    setEditableData(prev => ({
      ...prev,
      techStack: prev.techStack
        .split(',')
        .filter(tech => tech.trim() !== techToRemove)
        .join(',')
    }));
  };

  return (
    <Card className="w-full mb-4 sm:mb-6 bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage src={user.githubAvatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left flex-grow space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <Button variant="outline" size="sm" onClick={handleShare} className="w-full sm:w-auto">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Dialog open={isEditing} onOpenChange={handleDialogClose}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-1">
                          Name
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={editableData.name}
                          onChange={(e) => {
                            setEditableData(prev => ({ ...prev, name: e.target.value }));
                            if (errors.name) {
                              setErrors(prev => ({ ...prev, name: undefined }));
                            }
                          }}
                          placeholder="Your name"
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editableData.bio || ''}
                          onChange={(e) => setEditableData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tech Stack</Label>
                        <TechStackSelector
                          project={{ techStack: editableData.techStack }}
                          addTechStack={addTechStack}
                          removeTech={removeTech}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleDialogClose(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleEditSubmit}
                          className="w-full sm:w-auto"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                Rank: {user.rank || 'Beginner'}
              </Badge>
              <Badge variant="outline" className="border-accent text-accent-foreground">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{user.bio || "No bio available"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
          <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
            <Mail className="text-muted-foreground" size={16} />
            <span>{user.email}</span>
          </Badge>
          {user.githubUsername && (
            <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
              <Github className="text-muted-foreground" size={16} />
              <a
                href={user.githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {user.githubUsername}
              </a>
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center space-x-2 px-3 py-1 bg-muted text-muted-foreground">
            <Calendar className="text-muted-foreground" size={16} />
            <span>
              Joined: {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Date not available'}
            </span>
          </Badge>
        </div>

        {user.techStack && user.techStack.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-center sm:text-left">Technologies Used</h3>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {user.techStack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
    </Card>
  );
} 