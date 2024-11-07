import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch projects with votes
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        votes: {
          select: {
            id: true,
            userEmail: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching vote data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vote data' },
      { status: 500 }
    );
  }
} 