'use client'
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
  
    if (status === "loading") {
      return <p>Loading session...</p>;
    }
  
    if (!session) {
      return <p>No active session</p>;
    }
  
  
    if (!userData && session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUserData(data);
          }
        })
        .catch((error) => console.error(error));
    }

  return (
    <div className="container mx-auto p-4  text-white min-h-screen">
      <Card className="w-full mx-auto bg-transparent text-white border-gray-700">
        <CardHeader className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-44 h-44">
              <AvatarImage src={userData?.githubAvatarUrl} alt={userData?.name} />
              <AvatarFallback>{userData?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{userData?.name}</h1>
              <Badge variant="secondary" className="bg-gray-700 text-white">{`Rank: ${userData?.rank}`}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Email</h2>
            <p className="text-gray-100">{userData?.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-300">GitHub</h2>
            <a 
              href={userData?.githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
            >
              <Github size={20} />
              <span>{userData?.githubUsername}</span>
            </a>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Joined</h2>
            <p className="text-gray-100">{new Date(userData?.joinDate).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}