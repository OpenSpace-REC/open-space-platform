import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        
        // Check if user is authenticated
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        // Delete all related records first
        await prisma.$transaction([
            // Delete project users
            prisma.projectUser.deleteMany({
                where: { projectId },
            }),
            // Delete pending project users
            prisma.pendingProjectUser.deleteMany({
                where: { projectId },
            }),
            // Delete project images
            prisma.projectImage.deleteMany({
                where: { projectId },
            }),
            // Delete project tags
            prisma.projectTag.deleteMany({
                where: { projectId },
            }),
            // Finally delete the project
            prisma.project.delete({
                where: { id: projectId },
            }),
        ]);

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
