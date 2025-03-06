"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLeaderboard } from "@/hooks/useLeaderboard"

type User = {
  id: string
  name: string
  githubUsername: string | null
  githubAvatarUrl: string | null
  points: number
}

export default function LeaderboardClient() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isEnabled, isLoading: isCheckingAccess } = useLeaderboard();

  useEffect(() => {
    if (!isCheckingAccess && !isEnabled) {
      router.push('/');
      return;
    }

    async function fetchLeaderboardData() {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isEnabled) {
      fetchLeaderboardData();
    }
  }, [isEnabled, isCheckingAccess, router]);

  if (isCheckingAccess || (!isEnabled && isLoading)) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Loading...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isEnabled) {
    return null; // This will prevent any flash of content before redirect
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Developer Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                users.map((user, index) => (
                  <Link 
                    href={`/profile/${user.githubUsername}`} 
                    key={user.id}
                    className="block"
                  >
                    <div
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 text-center font-bold">
                          #{index + 1}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={user.githubAvatarUrl || ''} 
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          {user.githubUsername && (
                            <a
                              href={`https://github.com/${user.githubUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              @{user.githubUsername}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        {user.points.toLocaleString()} pts
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}