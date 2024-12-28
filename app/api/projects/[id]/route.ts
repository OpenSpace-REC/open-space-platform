import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        resources: true,
        projectImages: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      keyFeatures,
      resources,
      users,
    } = body;

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
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
        // Update resources
        resources: {
          deleteMany: {},
          create: resources.map((resource: any) => ({
            url: resource.url,
            title: resource.title,
            type: resource.type,
            description: resource.description
          }))
        },
        // Update users
        users: {
          deleteMany: {},
          create: users.map((user: any) => ({
            userId: user.id,
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

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete all related records first
    await prisma.$transaction(async (tx) => {
      // Delete project resources
      await tx.projectResource.deleteMany({
        where: { projectId: params.id }
      });

      // Delete project images
      await tx.projectImage.deleteMany({
        where: { projectId: params.id }
      });

      // Delete project tags
      await tx.projectTag.deleteMany({
        where: { projectId: params.id }
      });

      // Delete project users
      await tx.projectUser.deleteMany({
        where: { projectId: params.id }
      });

      // Delete pending project users
      await tx.pendingProjectUser.deleteMany({
        where: { projectId: params.id }
      });

      // Delete votes
      await tx.vote.deleteMany({
        where: { projectId: params.id }
      });

      // Finally delete the project
      await tx.project.delete({
        where: { id: params.id }
      });
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}