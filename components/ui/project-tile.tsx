import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, GitPullRequest, Star } from "lucide-react";
import Link from 'next/link';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    githubUrl: string;
    techStack: string[];
    imageUrl: string | null;
    users: Array<{
      user: {
        name: string;
        githubAvatarUrl: string | null;
        githubUsername: string; 
      };
      role: string;
    }>;
    language: string;
    pullRequests: number;
    stars: number;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const shortenDescription = (desc: string | null, maxLength: number = 100) => {
    if (!desc) return '';
    return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
  };

  return (
    <Card className="flex flex-col h-full w-full max-w-sm bg-card text-white border border-white/10 transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{project.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-grow"> 
        <p className="text-sm text-white/70 mb-4">{shortenDescription(project.description)}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary" className="transition-colors hover:bg-white/20">{tech}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap space-x-2 overflow-hidden mb-4">
          {project.users.slice(0, 3).map((projectUser, index) => (
            <span key={index} className="bg-white/10 text-white text-sm px-2 py-1 rounded">
              {projectUser.user.githubUsername} 
            </span>
          ))}
          {project.users.length > 3 && (
            <span className="bg-white/10 text-white text-sm px-2 py-1 rounded">
              +{project.users.length - 3}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto"> 
        <div className="flex items-center space-x-3"> 
          <Badge variant="outline" className="flex items-center space-x-1 border-white/30 hover:bg-white/10 transition-colors">
            <GitPullRequest size={14} />
            <span>{project.pullRequests}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1 border-white/30 hover:bg-white/10 transition-colors">
            <Star size={14} />
            <span>{project.stars}</span>
          </Badge>
        </div>
        <Link href={project.githubUrl} aria-label={`View ${project.name} on GitHub`}>
          <Button 
            variant="outline" 
            className="h-10 text-white border-white/30 hover:bg-white/10 transition-colors" 
          >
            <Github className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
