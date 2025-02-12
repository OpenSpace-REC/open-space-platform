import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, X } from 'lucide-react'
import { Project } from './types'

interface KeyFeaturesProps {
  project: Project;
  onKeyFeaturesChange: (features: string[]) => void;
}

export function KeyFeatures({ project, onKeyFeaturesChange }: KeyFeaturesProps) {
  const addFeature = () => {
    onKeyFeaturesChange([...project.keyFeatures, ''])
  }

  const removeFeature = (index: number) => {
    const newFeatures = project.keyFeatures.filter((_, i) => i !== index)
    onKeyFeaturesChange(newFeatures)
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...project.keyFeatures]
    newFeatures[index] = value
    onKeyFeaturesChange(newFeatures)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Features</CardTitle>
        <CardDescription>List the main features of your project</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {project.keyFeatures.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Enter a key feature"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeFeature(index)}
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
          onClick={addFeature}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Feature
        </Button>
      </CardContent>
    </Card>
  )
} 