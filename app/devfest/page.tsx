'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

interface Vote {
  id: string;
  userEmail: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  votes: Vote[];
  imageUrl: string | null;
  techStack: string[];
}

export default function DevFestPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [votingStatus, setVotingStatus] = useState<{ isOpen: boolean }>({ isOpen: false });
  const { data: session } = useSession();

  useEffect(() => {
    fetchProjects();
    fetchVotingStatus();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const response = await fetch('/api/voting-status');
      const data = await response.json();
      setVotingStatus(data);
    } catch (error) {
      console.error('Error fetching voting status:', error);
    }
  };

  const hasUserVotedAny = () => {
    return projects.some(project => 
      project.votes.some(vote => vote.userEmail === session?.user?.email)
    );
  };

  const handleVote = async (projectId: string) => {
    if (!session) {
      toast.error('Please sign in to vote');
      return;
    }

    if (hasUserVotedAny()) {
      toast.error('You can only vote for one project');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to vote');
      }

      fetchProjects();
      toast.success('Vote recorded successfully!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to record vote');
    }
  };

  const getVoteButtonText = (project: Project) => {
    if (!session) return 'Sign in to Vote';
    if (hasUserVotedAny()) {
      return project.votes.some(vote => vote.userEmail === session?.user?.email)
        ? 'Your Vote'
        : 'Already Voted';
    }
    return 'Vote';
  };

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">/Open-Space X DevFest'24</h1>
          <p className="text-muted-foreground mt-1">DevSpirit Projects - Vote for your favorite project</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
          {!votingStatus.isOpen && (
            <p className="text-sm text-muted-foreground">Voting is currently closed</p>
          )}
          {!session ? (
            <Link href="/devfest-signin">
              <Button >Sign in to Vote</Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>

      {session && hasUserVotedAny() && (
        <div className="mb-6 p-4 rounded-lg border bg-background">
          <p className="text-sm text-muted-foreground">
            You have already cast your vote. Thank you for participating!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((project) => (
          <Link 
            href={`/project/${project.id}`}
            key={project.id}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
              <CardHeader className="space-y-2">
                {project.imageUrl && (
                  <div className="w-full h-48 relative overflow-hidden rounded-lg mb-2">
                    <Image
                      src={project.imageUrl}
                      alt={project.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {project.description || 'No description available'}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end items-center pt-4">
                <Button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation when clicking the vote button
                    handleVote(project.id);
                  }}
                  disabled={!session || hasUserVotedAny()}
                  variant={
                    !session 
                      ? 'secondary'
                      : project.votes.some(vote => vote.userEmail === session?.user?.email)
                      ? 'default'
                      : hasUserVotedAny()
                      ? 'outline'
                      : 'default'
                  }
                  className="min-w-[120px]"
                >
                  {getVoteButtonText(project)}
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}