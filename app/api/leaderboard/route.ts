import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
} 