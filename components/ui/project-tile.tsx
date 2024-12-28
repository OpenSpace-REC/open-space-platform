import { Fragment } from 'react';
import Link from 'next/link';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { StarIcon, GitPullRequestIcon, CodeIcon, UsersIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface ProjectUser {
  user: {
    name: string;
    githubAvatarUrl: string | null;
    githubUsername: string;
  };
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  githubUrl: string;
  techStack: string[];
  imageUrl: string | null;
  users: ProjectUser[];
  language?: string;
  pullRequests?: number;
  stars?: number;
}

interface ProjectTileProps {
  project: Project;
  onClick?: () => void;
  isEditable?: boolean;
}

// Add character limit constants at the top
const DISPLAY_LIMITS = {
  title: 50,
  description: {
    chars: 150,    // Maximum characters
    lines: 2       // Maximum lines to show
  },
  techStack: 5,    // Maximum number of tech stack items to display
  contributors: 3  // Maximum number of contributors to show in tooltip
}

export default function ProjectTile({ project, onClick, isEditable = false }: ProjectTileProps) {
  const projectLink = project?.id ? `/project/${project.id}` : '/projects';

  // Truncate long text with ellipsis
  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  }

  // Get limited tech stack items
  const displayedTechStack = project.techStack?.slice(0, DISPLAY_LIMITS.techStack);
  const remainingTechCount = (project.techStack?.length || 0) - DISPLAY_LIMITS.techStack;

  // Render different components based on isEditable
  if (isEditable) {
    return (
      <Card 
        className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full bg-zinc-900/90 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700"
        onClick={onClick}
      >
        <CardContent className="p-6">
          {/* Project Image with enhanced gradient overlay */}
          {project.imageUrl && (
            <div className="mb-4 w-full h-48 relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent z-10" />
              <img
                src={project.imageUrl}
                alt={project.name}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}

          {/* Project Title and Description */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors truncate max-w-[200px]">
                        {truncateText(project.name, DISPLAY_LIMITS.title)}
                      </h3>
                    </TooltipTrigger>
                    {project.name.length > DISPLAY_LIMITS.title && (
                      <TooltipContent side="top">
                        {project.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                
                {/* GitHub Stats with updated colors */}
                <div className="flex items-center space-x-3 text-zinc-400">
                  {project.language && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center space-x-1 hover:text-zinc-300 transition-colors">
                            <CodeIcon className="w-4 h-4" />
                            <span className="text-xs truncate max-w-[60px]">{project.language}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-800 border-zinc-700">
                          Primary Language
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {project.stars !== undefined && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="w-4 h-4" />
                            <span className="text-xs">{project.stars}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>GitHub Stars</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {project.pullRequests !== undefined && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center space-x-1">
                            <GitPullRequestIcon className="w-4 h-4" />
                            <span className="text-xs">{project.pullRequests}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Pull Requests</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p 
                      className="text-zinc-400 text-sm whitespace-pre-line line-clamp-2 cursor-pointer"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: DISPLAY_LIMITS.description.lines,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {project.description?.split('\n').map(line => line.trim()).join('\n') || 'No description available'}
                    </p>
                  </TooltipTrigger>
                  {project.description && (
                    <TooltipContent 
                      side="right" 
                      className="max-w-sm bg-zinc-800 border-zinc-700"
                    >
                      <p className="whitespace-pre-line">
                        {project.description}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Tech Stack Badges with matte finish */}
            <div className="flex flex-wrap gap-2">
              {displayedTechStack?.map((tech, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 hover:border-zinc-700"
                >
                  {tech}
                </Badge>
              ))}
              {remainingTechCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline">
                        +{remainingTechCount} more
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {project.techStack?.slice(DISPLAY_LIMITS.techStack).join(', ')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Contributors Section with updated styling */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-300 transition-colors">
                      <UsersIcon className="w-4 h-4" />
                      <span className="text-sm">
                        {project.users?.[0]?.user.githubUsername ? (
                          <span className="text-sm font-mono truncate max-w-[120px] inline-block align-bottom">
                            @{project.users[0].user.githubUsername}
                          </span>
                        ) : (
                          'No contributors'
                        )}
                        {project.users?.length > 1 && (
                          <span className="text-zinc-500"> +{project.users.length - 1}</span>
                        )}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-800 border-zinc-700">
                    <div className="space-y-1 font-mono text-zinc-300">
                      {project.users?.slice(0, DISPLAY_LIMITS.contributors).map((user, index) => (
                        <div key={index} className="text-sm">
                          @{user.user.githubUsername}
                        </div>
                      ))}
                      {project.users && project.users.length > DISPLAY_LIMITS.contributors && (
                        <div className="text-sm text-zinc-500">
                          +{project.users.length - DISPLAY_LIMITS.contributors} more contributors
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={projectLink}>
      <Card 
        className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full bg-zinc-900/90 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700"
        onClick={onClick}
      >
        <CardContent className="p-6">
          {/* Project Image with enhanced gradient overlay */}
          {project.imageUrl && (
            <div className="mb-4 w-full h-48 relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent z-10" />
              <img
                src={project.imageUrl}
                alt={project.name}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}

          {/* Project Title and Description */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors truncate max-w-[200px]">
                        {truncateText(project.name, DISPLAY_LIMITS.title)}
                      </h3>
                    </TooltipTrigger>
                    {project.name.length > DISPLAY_LIMITS.title && (
                      <TooltipContent side="top">
                        {project.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                
                {/* GitHub Stats with updated colors */}
                <div className="flex items-center space-x-3 text-zinc-400">
                  {project.language && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center space-x-1 hover:text-zinc-300 transition-colors">
                            <CodeIcon className="w-4 h-4" />
                            <span className="text-xs truncate max-w-[60px]">{project.language}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-800 border-zinc-700">
                          Primary Language
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {project.stars !== undefined && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center space-x-1">
                            <StarIcon className="w-4 h-4" />
                            <span className="text-xs">{project.stars}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>GitHub Stars</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {project.pullRequests !== undefined && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center space-x-1">
                            <GitPullRequestIcon className="w-4 h-4" />
                            <span className="text-xs">{project.pullRequests}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Pull Requests</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p 
                      className="text-zinc-400 text-sm whitespace-pre-line line-clamp-2 cursor-pointer"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: DISPLAY_LIMITS.description.lines,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {project.description?.split('\n').map(line => line.trim()).join('\n') || 'No description available'}
                    </p>
                  </TooltipTrigger>
                  {project.description && (
                    <TooltipContent 
                      side="right" 
                      className="max-w-sm bg-zinc-800 border-zinc-700"
                    >
                      <p className="whitespace-pre-line">
                        {project.description}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Tech Stack Badges with matte finish */}
            <div className="flex flex-wrap gap-2">
              {displayedTechStack?.map((tech, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 hover:border-zinc-700"
                >
                  {tech}
                </Badge>
              ))}
              {remainingTechCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline">
                        +{remainingTechCount} more
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {project.techStack?.slice(DISPLAY_LIMITS.techStack).join(', ')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Contributors Section with updated styling */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-2 text-zinc-400 hover:text-zinc-300 transition-colors">
                      <UsersIcon className="w-4 h-4" />
                      <span className="text-sm">
                        {project.users?.[0]?.user.githubUsername ? (
                          <span className="text-sm font-mono truncate max-w-[120px] inline-block align-bottom">
                            @{project.users[0].user.githubUsername}
                          </span>
                        ) : (
                          'No contributors'
                        )}
                        {project.users?.length > 1 && (
                          <span className="text-zinc-500"> +{project.users.length - 1}</span>
                        )}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-800 border-zinc-700">
                    <div className="space-y-1 font-mono text-zinc-300">
                      {project.users?.slice(0, DISPLAY_LIMITS.contributors).map((user, index) => (
                        <div key={index} className="text-sm">
                          @{user.user.githubUsername}
                        </div>
                      ))}
                      {project.users && project.users.length > DISPLAY_LIMITS.contributors && (
                        <div className="text-sm text-zinc-500">
                          +{project.users.length - DISPLAY_LIMITS.contributors} more contributors
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
