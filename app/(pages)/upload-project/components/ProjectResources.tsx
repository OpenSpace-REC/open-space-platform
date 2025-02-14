import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Link, Presentation, ScrollText, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useToast } from "@/hooks/use-toast"
import { Project, ProjectResource, CHAR_LIMITS } from './types'

interface ProjectResourcesProps {
  project: Project;
  newResource: ProjectResource;
  onResourceChange: (field: keyof ProjectResource, value: string) => void;
  onAddResource: () => void;
  onRemoveResource: (index: number) => void;
  isValidPostImageUrl: (url: string) => boolean;
}

export function ProjectResources({
  project,
  newResource,
  onResourceChange,
  onAddResource,
  onRemoveResource,
  isValidPostImageUrl
}: ProjectResourcesProps) {
  const { toast } = useToast()

  return (
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
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Project Resource</DialogTitle>
              <DialogDescription>Add resource details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select
                  onValueChange={(value) => onResourceChange('type', value as ProjectResource['type'])}
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
                  onChange={(e) => onResourceChange('url', e.target.value)}
                  placeholder={
                    newResource.type === 'image' ? "https://i.postimg.cc/your-image-id/image.jpg" :
                    newResource.type === 'document' ? "Enter document URL (e.g., PDF link)" :
                    newResource.type === 'presentation' ? "Enter presentation URL (e.g., Slides link)" :
                    newResource.type === 'paper' ? "Enter research paper URL (e.g., PDF or DOI link)" :
                    "Enter resource URL"
                  }
                />
                {newResource.type === 'image' ? (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Please use <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">postimages.org</a> to upload your image</p>
                    <p>Only direct image URLs from i.postimg.cc are accepted</p>
                    <p>Example: https://i.postimg.cc/image-id/image.jpg</p>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground space-y-1">
                    {newResource.type === 'document' && (
                      <>
                        <p>Add a link to your document (PDF, DOC, etc.)</p>
                        <p>You can use services like Google Drive or Dropbox (make sure the link is public)</p>
                      </>
                    )}
                    {newResource.type === 'presentation' && (
                      <>
                        <p>Add a link to your presentation (Google Slides, PowerPoint, etc.)</p>
                        <p>Ensure the presentation is set to public or anyone with the link can view</p>
                      </>
                    )}
                    {newResource.type === 'paper' && (
                      <>
                        <p>Add a link to your research paper (PDF or DOI link)</p>
                        <p>You can use academic repositories or direct PDF links</p>
                      </>
                    )}
                    {newResource.type === 'other' && (
                      <>
                        <p>Add a link to your resource</p>
                        <p>Make sure the link is accessible to others</p>
                      </>
                    )}
                  </div>
                )}
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
                  onChange={(e) => onResourceChange('title', e.target.value)}
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
                  onChange={(e) => onResourceChange('description', e.target.value)}
                  placeholder="Describe this resource"
                  maxLength={CHAR_LIMITS.resourceDescription.max}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{newResource.description.length}/{CHAR_LIMITS.resourceDescription.max} characters</span>
                  <span>Optional</span>
                </div>
              </div>

              <Button onClick={onAddResource} className="w-full">
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
                    onClick={() => onRemoveResource(index)}
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
  )
} 