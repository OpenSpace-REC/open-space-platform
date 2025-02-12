'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit3, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type StatusType = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';

interface TagFormData {
  name: string;
  projectId: string | string[];
  title: string;
  status: StatusType | '';
  conference: string;
  date: string;
  competition: string;
}

interface CuratorToolsProps {
  hasTaggingPermissions: boolean;
}

const statusOptions: StatusType[] = ['DRAFT', 'IN_PROGRESS', 'COMPLETED'];

export function CuratorTools({ hasTaggingPermissions }: CuratorToolsProps) {
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [tagFormData, setTagFormData] = useState<TagFormData>({
    name: '',
    projectId: '',
    title: '',
    status: '',
    conference: '',
    date: '',
    competition: ''
  });

  const handleProjectIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagFormData(prev => ({ ...prev, projectId: value }));
    
    if (value.endsWith(',')) {
      const newId = value.slice(0, -1).trim();
      if (newId && !projectIds.includes(newId)) {
        setProjectIds(prev => [...prev, newId]);
        setTagFormData(prev => ({ ...prev, projectId: '' }));
      }
    }
  };

  const removeProjectId = (idToRemove: string) => {
    setProjectIds(prev => prev.filter(id => id !== idToRemove));
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleCreateTag = async () => {
    try {
      if (tagFormData.date && !isValidDate(tagFormData.date)) {
        toast.error('Invalid date format');
        return;
      }

      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tagFormData,
          date: tagFormData.date ? new Date(tagFormData.date).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Failed to create tag');
        }
        return;
      }

      toast.success('Tag created successfully');
      setIsCreatingTag(false);
      setTagFormData({
        name: '',
        projectId: '',
        title: '',
        status: '',
        conference: '',
        date: '',
        competition: ''
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create tag');
      }
    }
  };

  if (!hasTaggingPermissions) return null;

  return (
    <Card className="w-full mb-4 sm:mb-6">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold">Curator Tools</h2>
          <p className="text-sm text-muted-foreground">Manage project tags and achievements</p>
        </div>
        <Dialog open={isCreatingTag} onOpenChange={setIsCreatingTag}>
          <DialogTrigger asChild>
            <Button variant="default" className="w-full sm:w-auto">
              <Edit3 className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="projectIds">Project IDs</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {projectIds.map((id) => (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {id}
                      <button
                        onClick={() => removeProjectId(id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="projectIds"
                  value={tagFormData.projectId}
                  onChange={handleProjectIdInput}
                  placeholder="Enter project IDs (comma-separated)"
                  className="col-span-3"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Tag Name</Label>
                <Input
                  id="name"
                  value={tagFormData.name}
                  onChange={(e) => setTagFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter tag name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={tagFormData.title}
                  onChange={(e) => setTagFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={tagFormData.status}
                  onValueChange={(value) => setTagFormData(prev => ({ ...prev, status: value as StatusType }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="conference">Conference</Label>
                <Input
                  id="conference"
                  value={tagFormData.conference}
                  onChange={(e) => setTagFormData(prev => ({ ...prev, conference: e.target.value }))}
                  placeholder="Enter conference name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={tagFormData.date}
                  onChange={(e) => setTagFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="competition">Competition</Label>
                <Input
                  id="competition"
                  value={tagFormData.competition}
                  onChange={(e) => setTagFormData(prev => ({ ...prev, competition: e.target.value }))}
                  placeholder="Enter competition name"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsCreatingTag(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleCreateTag}
              >
                Create Tag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
} 