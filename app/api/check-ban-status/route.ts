import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { banned: true, role: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.banned) {
            return NextResponse.json({ error: 'User is banned' }, { status: 403 });
        }

        // Allow admins to bypass access restrictions
        if (user.role === 'ADMIN') {
            return NextResponse.json({ banned: false });
        }

        // Check admin-only access restriction for non-admins
        const settings = await prisma.settings.findUnique({
            where: { id: 'app_settings' }
        });

        if (settings?.adminOnlyAccess) {
            const allowedEmails = process.env.ALLOWED_USERS?.split(',') || [];
            if (!allowedEmails.includes(email)) {
                return NextResponse.json({ error: 'Access restricted' }, { status: 403 });
            }
        }

        return NextResponse.json({ banned: false });
    } catch (error) {
        console.error('Error checking ban status:', error);
        return NextResponse.json(
            { error: 'Failed to check ban status' },
            { status: 500 }
        );
    }
}
