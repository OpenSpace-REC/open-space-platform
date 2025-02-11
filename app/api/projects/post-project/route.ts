import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

async function getNextProjectId() {
  const year = new Date().getFullYear();
  const counter = await prisma.counter.upsert({
    where: { id: 'project_counter' },
    update: { count: { increment: 1 } },
    create: { id: 'project_counter', count: 1 },
  });
  return `${year}-${String(counter.count).padStart(4, '0')}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      githubUrl,
      demoUrl,
      techStack,
      imageUrl,
      problemStatement,
      status,
      projectType,
      keyFeatures,
      resources,
      users,
      ownerId,
    } = body;

    const userPromises = users.map(async (user: { githubUsername: string; role: string }) => {
      const existingUser = await prisma.user.findUnique({
        where: { githubUsername: user.githubUsername }
      });
      return {
        ...user,
        exists: !!existingUser
      };
    });

    const userResults = await Promise.all(userPromises);
    const existingUsers = userResults.filter(user => user.exists);
    const pendingUsers = userResults.filter(user => !user.exists);

    const projectId = await getNextProjectId();

    const project = await prisma.project.create({
      data: {
        id: projectId,
        name,
        description,
        ...(githubUrl ? { githubUrl } : {}),
        demoUrl,
        techStack,
        imageUrl,
        problemStatement,
        status,
        projectType,
        keyFeatures,
        resources: {
          create: resources.map((resource: {
            url: string;
            title: string;
            type: string;
            description: string;
          }) => ({
            url: resource.url,
            title: resource.title,
            type: resource.type,
            description: resource.description
          }))
        },
        users: {
          create: existingUsers.map((user) => ({
            role: user.role,
            user: {
              connect: {
                githubUsername: user.githubUsername,
              },
            },
          })),
        },
        pendingUsers: {
          create: pendingUsers.map((user) => ({
            githubUsername: user.githubUsername,
            role: user.role,
          })),
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        pendingUsers: true,
        resources: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A project with this GitHub URL already exists' },
          { status: 409 }
        );
      }
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'One or more users could not be found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
