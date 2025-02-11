import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const validStatuses = ['PUBLISHED', 'IN_REVIEW', 'DRAFT', 'COMPLETED', 'ONGOING'] as const;
type ProjectTagStatus = typeof validStatuses[number];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!(user?.role === 'CURATOR' || user?.role === 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, projectId, title, status, conference, date, competition } = body;

    if (!validStatuses.includes(status as ProjectTagStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const isoDate = date ? new Date(date).toISOString() : null;

 
    const projectIds = Array.isArray(projectId) ? projectId : [projectId];

    const tags = await Promise.all(
      projectIds.map((id) =>
        prisma.projectTag.create({
          data: {
            name,
            projectId: id,
            curatorId: user.id,
            title,
            status: status as ProjectTagStatus,
            conference,
            date: isoDate,
            competition,
          },
        })
      )
    );

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error creating tags:', error);
    return NextResponse.json({ error: 'Failed to create tags' }, { status: 500 });
  }
}
