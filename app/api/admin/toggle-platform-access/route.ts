import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        
        // Check if user is admin
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // First get current settings
        const currentSettings = await prisma.settings.findUnique({
            where: { id: 'app_settings' }
        });

        // Then update with the opposite value
        const settings = await prisma.settings.upsert({
            where: { id: 'app_settings' },
            create: { 
                id: 'app_settings', 
                adminOnlyAccess: true,
                leaderboardEnabled: true
            },
            update: { 
                adminOnlyAccess: !(currentSettings?.adminOnlyAccess ?? false)
            }
        });

        return NextResponse.json({ adminOnlyAccess: settings.adminOnlyAccess });
    } catch (error) {
        console.error('Error toggling platform access:', error);
        return NextResponse.json(
            { error: 'Failed to toggle platform access' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await prisma.settings.findUnique({
            where: { id: 'app_settings' }
        });

        // First check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        });

        // Admins always have access
        if (user?.role === 'ADMIN') {
            return NextResponse.json({ 
                adminOnlyAccess: settings?.adminOnlyAccess ?? false,
                hasAccess: true
            });
        }

        // For non-admins, check allowlist if in admin-only mode
        if (settings?.adminOnlyAccess) {
            const allowedEmails = process.env.ALLOWED_USERS?.split(',') || [];
            const hasAccess = allowedEmails.includes(session.user.email);
            
            return NextResponse.json({ 
                adminOnlyAccess: true,
                hasAccess
            });
        }

        // If not in admin-only mode, everyone has access
        return NextResponse.json({ 
            adminOnlyAccess: false,
            hasAccess: true
        });
    } catch (error) {
        console.error('Error getting platform access status:', error);
        return NextResponse.json(
            { error: 'Failed to get platform access status' },
            { status: 500 }
        );
    }
}
