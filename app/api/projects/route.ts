import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        techStack: true,
        githubUrl: true,
        users: {
          select: {
            role: true,
            user: {
              select: {
                name: true,
                githubAvatarUrl: true,
                githubUsername: true,
              },
            },
          },
        },
        votes: {
          select: {
            id: true,
            userEmail: true,
          },
        },
      },
    });

    // Transform the data to match the expected format
    const formattedProjects = projects.map(project => ({
      ...project,
      githubUrl: project.githubUrl || '',  // Ensure githubUrl is never null
      language: project.techStack[0] || 'Unknown', // Use first tech stack item as language
      pullRequests: 0, // Default values for optional fields
      stars: 0,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}