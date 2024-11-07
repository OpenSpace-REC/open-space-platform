'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface Vote {
  id: string;
  userEmail: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  votes: Vote[];
}

interface VotingStatus {
  isOpen: boolean;
  startTime: string | null;
  endTime: string | null;
}

export default function DevFestAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingStatus, setVotingStatus] = useState<VotingStatus | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const checkAdminAccess = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/check-admin');
      if (!response.ok) {
        toast.error('Unauthorized access');
        router.push('/devfest');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/devfest');
    }
  }, [router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/admin/votes');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    checkAdminAccess();
    fetchProjects();
    fetchVotingStatus();
  }, [session, checkAdminAccess]);

  const toggleVoting = async () => {
    try {
      const response = await fetch('/api/voting-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isOpen: !votingStatus?.isOpen,
          startTime: !votingStatus?.isOpen ? new Date().toISOString() : votingStatus?.startTime,
          endTime: votingStatus?.isOpen ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update voting status');
      
      const data = await response.json();
      setVotingStatus(data);
      toast.success(`Voting ${data.isOpen ? 'opened' : 'closed'} successfully`);
    } catch (error) {
      toast.error('Failed to update voting status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">/Open-Space X DevFest'24 Admin</h1>
            <p className="text-muted-foreground mt-1">Vote Results Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Voting is {votingStatus?.isOpen ? 'Open' : 'Closed'}</span>
            <Switch
              checked={votingStatus?.isOpen || false}
              onCheckedChange={toggleVoting}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="p-4 sm:p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead className="text-right">Vote Count</TableHead>
                <TableHead className="hidden sm:table-cell">Last Vote</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-right">{project.votes.length}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {project.votes.length > 0
                      ? new Date(
                          Math.max(
                            ...project.votes.map((v) => new Date(v.createdAt).getTime())
                          )
                        ).toLocaleDateString()
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </main>
  );
} 