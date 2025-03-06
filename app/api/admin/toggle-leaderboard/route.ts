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
                leaderboardEnabled: true 
            },
            update: { 
                leaderboardEnabled: !(currentSettings?.leaderboardEnabled ?? true)
            }
        });

        return NextResponse.json({ leaderboardEnabled: settings.leaderboardEnabled });
    } catch (error) {
        console.error('Error toggling leaderboard:', error);
        return NextResponse.json(
            { error: 'Failed to toggle leaderboard' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: 'app_settings' }
        });

        return NextResponse.json({ 
            leaderboardEnabled: settings?.leaderboardEnabled ?? true 
        });
    } catch (error) {
        console.error('Error getting leaderboard status:', error);
        return NextResponse.json(
            { error: 'Failed to get leaderboard status' },
            { status: 500 }
        );
    }
}
