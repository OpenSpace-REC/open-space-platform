'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Code, GitPullRequest, GitMerge } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string;
  techStack: string[];
  imageUrl: string | null;
  users: {
    user: {
      name: string;
      githubAvatarUrl: string | null;
      githubUsername: string;
    };
    role: string;
  }[];
  language: string;
  pullRequests: number;
  stars: number;
}

interface ActivityOverviewProps {
  ownedProjects: Project[];
  contributedProjects: Project[];
}

export function ActivityOverview({ ownedProjects, contributedProjects }: ActivityOverviewProps) {
  return (
    <Card className="w-full mb-4 sm:mb-6 bg-card">
      <CardHeader className="space-y-1">
        <h2 className="text-lg font-semibold">Activity Overview</h2>
        <p className="text-sm text-muted-foreground">Track your project contributions and activity</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">Total Projects</span>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              <Activity size={14} className="mr-1" />
              {ownedProjects.length}
            </Badge>
          </div>
          <Progress value={ownedProjects.length} max={10} className="h-2 bg-secondary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-muted">
            <CardContent className="flex flex-col items-center p-3 sm:p-4">
              <Code size={20} className="mb-2 text-muted-foreground w-5 h-5 sm:w-6 sm:h-6" />
              <Badge variant="secondary" className="text-base sm:text-lg font-semibold bg-secondary text-secondary-foreground">
                {ownedProjects.length}
              </Badge>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">Projects Posted</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="flex flex-col items-center p-3 sm:p-4">
              <GitPullRequest size={20} className="mb-2 text-muted-foreground w-5 h-5 sm:w-6 sm:h-6" />
              <Badge variant="secondary" className="text-base sm:text-lg font-semibold bg-secondary text-secondary-foreground">
                {contributedProjects.length}
              </Badge>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">Projects Contributed</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardContent className="flex flex-col items-center p-3 sm:p-4">
              <GitMerge size={20} className="mb-2 text-muted-foreground w-5 h-5 sm:w-6 sm:h-6" />
              <Badge variant="secondary" className="text-base sm:text-lg font-semibold bg-secondary text-secondary-foreground">0</Badge>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">Pull Requests Merged</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 