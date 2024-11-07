import { Project } from '@/types/project';
import ProjectTile from '@/components/ui/project-tile';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

export function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectTile
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project.id)}
        />
      ))}
    </div>
  );
} 