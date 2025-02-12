'use client';
import React from 'react';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


import { Button } from "@/components/ui/button";
import { GitPullRequest, Star } from "lucide-react";
import Link from "next/link";

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  pullRequests: number;
  stars: number;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{project.language}</span>
            <div className="space-x-4">
              <span>🔀 {project.pullRequests}</span>
              <span>⭐ {project.stars}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}