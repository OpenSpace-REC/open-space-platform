import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    // Fetch user data with their projects
    const user = await prisma.user.findUnique({
      where: { githubUsername: username },
      include: {
        // Get projects where user is a member
        projects: {
          include: {
            project: {
              include: {
                tags: true,
                projectImages: true,
                votes: true,
              }
            }
          }
        },
        // Get tags curated by the user
        projectTags: {
          include: {
            project: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate contribution metrics
    const projectsPosted = user.projects.filter(p => p.role === 'OWNER').length;
    const projectsContributed = user.projects.filter(p => p.role !== 'OWNER').length;
    const tagsCreated = user.projectTags.length;

    // Remove sensitive information for non-own profiles
    const { email, ...publicUser } = user;

    return NextResponse.json({
      user: {
        ...publicUser,
        projectsPosted,
        projectsContributed,
        tagsCreated,
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 