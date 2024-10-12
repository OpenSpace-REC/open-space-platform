import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, githubUrl, techStack, imageUrl, users } = body;


    const existingProject = await prisma.project.findUnique({
      where: { githubUrl },
    });

    if (existingProject) {
      return NextResponse.json({ error: 'Project with this GitHub URL already exists' }, { status: 400 });
    }

    if (!name || !githubUrl || !users || users.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        githubUrl,
        techStack,
        imageUrl,
        users: {
          create: await Promise.all(users.map(async (user: { githubUsername: string; role: string }) => {
            const dbUser = await prisma.user.findUnique({
              where: { githubUsername: user.githubUsername },
            });

            if (dbUser) {
              return {
                userId: dbUser.id,
                role: user.role,
              };
            } else {
              return null;
            }
          })).then(results => results.filter(result => result !== null)),
        },
        pendingUsers: {
          create: await Promise.all(users.map(async (user: { githubUsername: string; role: string }) => {
            const dbUser = await prisma.user.findUnique({
              where: { githubUsername: user.githubUsername },
            });

            if (!dbUser) {
              return {
                githubUsername: user.githubUsername,
                role: user.role,
              };
            } else {
              return null;
            }
          })).then(results => results.filter(result => result !== null)),
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        pendingUsers: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
