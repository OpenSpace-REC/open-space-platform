import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const session = await auth();
    const isOwnProfile = session?.user?.email ? 
      (await prisma.user.findUnique({ 
        where: { email: session.user.email },
        select: { githubUsername: true }
      }))?.githubUsername === username 
      : false;

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

    // Only remove email if it's not the user's own profile
    const { email, ...publicUser } = user;
    const userData = isOwnProfile ? user : publicUser;

    return NextResponse.json({
      user: {
        ...userData,
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