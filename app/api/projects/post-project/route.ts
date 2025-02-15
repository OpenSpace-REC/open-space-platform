import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Resource } from '@/app/types/project';

async function getNextProjectId() {
  const year = new Date().getFullYear();
  const counter = await prisma.counter.upsert({
    where: { id: 'project_counter' },
    update: { count: { increment: 1 } },
    create: { id: 'project_counter', count: 1 },
  });
  return `${year}-${String(counter.count).padStart(4, '0')}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      department,
      club,
      keyFeatures,
      resources,
      users,
      ownerId,
    } = body;

    // Check if a project with the same GitHub URL already exists
    if (githubUrl) {
      const existingProject = await prisma.project.findUnique({
        where: { githubUrl },
      });

      if (existingProject) {
        return NextResponse.json(
          { error: 'Project with this GitHub URL already exists' },
          { status: 400 }
        );
      }
    }

    // Get the current counter value
    const counter = await prisma.counter.findUnique({
      where: { id: 'project_counter' },
    });

    // If counter doesn't exist, create it
    if (!counter) {
      await prisma.counter.create({
        data: {
          id: 'project_counter',
          count: 0,
        },
      });
    }

    // Increment counter and get new value
    const updatedCounter = await prisma.counter.update({
      where: { id: 'project_counter' },
      data: { count: { increment: 1 } },
    });

    // Generate project ID
    const projectId = `PRJ${String(updatedCounter.count).padStart(5, '0')}`;

    // First, fetch all users by their GitHub usernames to get their actual IDs
    const userGithubUsernames = users.map((user: { githubUsername: string }) => user.githubUsername);
    const dbUsers = await prisma.user.findMany({
      where: {
        githubUsername: {
          in: userGithubUsernames
        }
      }
    });

    // Create a mapping of GitHub usernames to user IDs
    const usernameToIdMap = new Map(
      dbUsers.map(user => [user.githubUsername, user.id])
    );

    // Create project with proper user IDs
    const project = await prisma.project.create({
      data: {
        id: projectId,
        name,
        description,
        githubUrl,
        demoUrl,
        techStack,
        imageUrl,
        problemStatement,
        status,
        projectType,
        department,
        club,
        keyFeatures,
        resources: {
          create: resources.map((resource: Resource) => ({
            url: resource.url,
            title: resource.title,
            type: resource.type,
            description: resource.description
          }))
        },
        users: {
          create: users
            .filter((user: { githubUsername: string; role: string }) => usernameToIdMap.has(user.githubUsername))
            .map((user: { githubUsername: string; role: string }) => ({
              userId: usernameToIdMap.get(user.githubUsername),
              role: user.role,
            }))
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        resources: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
