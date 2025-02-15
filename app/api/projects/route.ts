import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const language = searchParams.get('language');
    const minStars = searchParams.get('minStars');
    const department = searchParams.get('department');
    const club = searchParams.get('club');

    const whereClause: Prisma.ProjectWhereInput = {};

    // Search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Language filter
    if (language && language !== 'all') {
      whereClause.techStack = {
        has: language
      };
    }

    // Remove stars filter from whereClause
    if (minStars && parseInt(minStars) > 0) {
      // Stars filtering will be handled after query
    }

    // Department filter
    if (department && department !== 'all') {
      whereClause.department = department;
    }

    // Club filter
    if (club && club !== 'all') {
      whereClause.club = club;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        users: {
          include: {
            user: true
          }
        },
        votes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter and format projects
    const formattedProjects = projects
      .map(project => ({
        ...project,
        stars: project.votes.length,
        users: project.users.map(pu => ({
          user: {
            name: pu.user.name,
            githubAvatarUrl: pu.user.githubAvatarUrl,
            githubUsername: pu.user.githubUsername,
          },
          role: pu.role
        }))
      }))
      .filter(project => !minStars || project.stars >= parseInt(minStars));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}