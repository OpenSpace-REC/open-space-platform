'use client';
import React, { useState } from 'react';
import GitHubRepoList from '@/components/GitHubRepo'; 
import { GitHubRepo } from '../../../components/GitHubRepo'; 
import { Card, CardContent, CardFooter } from '@/components/ui/card'; 
import Link from 'next/link';

export default function UploadProjectsPage() {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  return (
    <div className="flex flex-col gap-9 min-h-screen py-8 px-4">
      {selectedRepo ? (
        <Card className=" text-white w-full max-w-md shadow-lg rounded-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-100">Repository Selected</h3>
            <p className="text-sm text-gray-400">You have selected the repository:</p>
            <p className="text-lg text-white font-medium mt-1">{selectedRepo.name}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center px-6 pb-4">
            <Link
              href={selectedRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-500"
            >
              Open Repository
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <GitHubRepoList onRepoSelect={setSelectedRepo} />
      )}
    </div>
  );
}
