import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: 'app_settings' }
        });

        if (!settings?.leaderboardEnabled) {
            return NextResponse.json(
                { error: 'Leaderboard is currently disabled' },
                { status: 403 }
            );
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                githubUsername: true,
                githubAvatarUrl: true,
                points: true,
            },
            orderBy: {
                points: 'desc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard data' },
            { status: 500 }
        );
    }
}