import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const session = await auth();
        
        // Check if user is authenticated
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = await prisma.user.findUnique({
            where: { email: session.user.email! },
        });

        if (!admin || admin.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { email, banned } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Don't allow admins to be banned
        const targetUser = await prisma.user.findUnique({
            where: { email },
            select: { role: true }
        });

        if (targetUser?.role === 'ADMIN') {
            return NextResponse.json({ error: 'Cannot ban admin users' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { banned },
        });

        return NextResponse.json({
            message: `User ${banned ? 'banned' : 'unbanned'} successfully`,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user ban status:', error);
        return NextResponse.json(
            { error: 'Failed to update user ban status' },
            { status: 500 }
        );
    }
}
