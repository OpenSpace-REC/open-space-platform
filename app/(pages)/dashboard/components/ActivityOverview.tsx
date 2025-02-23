'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Code, GitPullRequest } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string;
  techStack: string[];
  imageUrl: string | null;
}

interface ActivityOverviewProps {
  projects?: Array<{
    project: Project;
    role: string;
  }>;
  points?: number;
}

export function ActivityOverview({ projects = [], points = 0 }: ActivityOverviewProps) {
  const ownedProjects = projects.filter(p => p.role === 'OWNER');
  const contributedProjects = projects.filter(p => p.role !== 'OWNER');

  return (
    <Card className="w-full mb-4 sm:mb-6 bg-card">
      <CardHeader className="space-y-1">
        <h2 className="text-lg font-semibold">Activity Overview</h2>
        <p className="text-sm text-muted-foreground">Track your project contributions and activity</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className="bg-muted p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-muted-foreground" />
              <span className="font-medium">Contribution Points</span>
            </div>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              {points} points
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Points reflect your overall contribution to the platform</p>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-muted">
            <CardContent className="flex flex-col items-center p-4">
              <Code size={24} className="mb-2 text-muted-foreground" />
              <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">
                {ownedProjects.length}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Projects Created</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="flex flex-col items-center p-4">
              <GitPullRequest size={24} className="mb-2 text-muted-foreground" />
              <Badge variant="secondary" className="text-lg font-semibold bg-secondary text-secondary-foreground">
                {contributedProjects.length}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Projects Contributed</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 