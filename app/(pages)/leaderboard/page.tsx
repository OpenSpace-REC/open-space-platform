import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {prisma }from '@/lib/prisma';


type User = {
  id: string
  name: string
  githubUsername: string | null
  githubAvatarUrl: string | null
  points: number
}

async function getLeaderboardData() {
  try {
    const users = await prisma.user.findMany({
      where: {
        points: {
          gt: 0  
        }
      },
      orderBy: {
        points: 'desc'
      },
      select: {
        id: true,
        name: true,
        githubUsername: true,
        githubAvatarUrl: true,
        points: true
      }
    });
    return users;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
}

export default async function LeaderboardPage() {
  const users = await getLeaderboardData();

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
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
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
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}