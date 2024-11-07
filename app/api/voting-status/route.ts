import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const status = await prisma.votingStatus.findUnique({
      where: { id: 'voting_status' },
    });
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { isOpen, startTime, endTime } = await request.json();
    
    const status = await prisma.votingStatus.upsert({
      where: { id: 'voting_status' },
      update: { isOpen, startTime, endTime },
      create: { id: 'voting_status', isOpen, startTime, endTime },
    });

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
} 