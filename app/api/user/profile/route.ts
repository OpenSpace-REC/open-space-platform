import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user data with their projects
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        // Get projects where user is a member
        projects: {
          include: {
            project: {
              select: {
                tags: true,
                projectImages: true,
                votes: true,
                techStack: true,
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

    const techStackSet = new Set<string>();
    user.projects.forEach(projectUser => {
      if (projectUser.project.techStack) {
        projectUser.project.techStack.forEach(tech => techStackSet.add(tech));
      }
    });
    const techStack = Array.from(techStackSet);

    return NextResponse.json({
      user: {
        ...user,
        projectsPosted,
        projectsContributed,
        tagsCreated,
        techStack,
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 