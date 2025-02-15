import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma'; 
export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const email = session?.user?.email;

    if(!email){
        return NextResponse.json({"message": "email does not exist"});
    }

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            projects: {
                include: {
                    project: true
                }
            }
        }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, bio, techStack } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name,
        bio: bio,
        techStack: techStack,
      },
      include: {
        projects: {
          include: {
            project: true
          }
        }
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
