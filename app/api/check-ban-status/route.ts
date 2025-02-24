import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

   
        const result = await prisma.$queryRaw`
            SELECT "banned" FROM "User" WHERE email = ${email};
        `;

     
        const userBanStatus = Array.isArray(result) && result.length > 0 ? result[0] : null;

        if (!userBanStatus) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (userBanStatus.banned === true) {
            return NextResponse.json({ error: 'User is banned' }, { status: 403 });
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
