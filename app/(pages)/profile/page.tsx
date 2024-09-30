'use client'; 
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";
import { useUser } from '@/components/user-context'; 
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user } = useUser(); 

  if (!user) {
    return <Skeleton />; 
  }

  return (
    <div className="container mx-auto text-white min-h-screen">
      <Card className="w-full mx-auto bg-transparent text-white border-gray-700">
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-44 h-44">
              <AvatarImage src={user.githubAvatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Badge variant="secondary" className="bg-gray-700 text-white">{`Rank: ${user.rank}`}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Email</h2>
            <p className="text-gray-100">{user.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-300">GitHub</h2>
            <a 
              href={user.githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <Github size={20} />
              <span>{user.githubUsername}</span>
            </a>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Joined</h2>
            <p className="text-gray-100">
              {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Date not available'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
