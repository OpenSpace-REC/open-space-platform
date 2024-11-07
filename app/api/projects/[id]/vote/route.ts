import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if voting is open
    const votingStatus = await prisma.votingStatus.findUnique({
      where: { id: 'voting_status' },
    });

    if (!votingStatus?.isOpen) {
      return NextResponse.json(
        { error: 'Voting is currently closed' },
        { status: 403 }
      );
    }

    const projectId = params.id;

    // Check if user has voted for ANY project
    const existingVote = await prisma.vote.findFirst({
      where: {
        userEmail: session.user.email,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You can only vote for one project' },
        { status: 400 }
      );
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        project: { connect: { id: projectId } },
        userEmail: session.user.email,
      },
    });

    return NextResponse.json({ message: 'Vote recorded successfully', vote });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 