export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import { encryptToken } from "@/lib/encryption";

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        scope: 'admin:repo_hook'
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return NextResponse.json({ error: errorData }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      return NextResponse.json({ error: errorData }, { status: 400 });
    }

    const userData = await userResponse.json();
    const email = session.user.email;

    const result = await prisma.$transaction(async (tx) => {
    
      const updatedUser = await tx.user.update({
        where: { email },
        data: {
          githubUsername: userData.login,
          githubProfileUrl: userData.html_url,
          githubAvatarUrl: userData.avatar_url,
          githubAccessToken: encryptToken(tokenData.access_token), 
        },
      });

      const pendingUsers = await tx.pendingProjectUser.findMany({
        where: { githubUsername: userData.login }
      });

      for (const pendingUser of pendingUsers) {
        await tx.projectUser.create({
          data: {
            userId: updatedUser.id,
            projectId: pendingUser.projectId,
            role: pendingUser.role
          }
        });

        await tx.pendingProjectUser.delete({
          where: { id: pendingUser.id }
        });
      }

      return {
        user: updatedUser,
        convertedCount: pendingUsers.length
      };
    });

    console.log(`GitHub linked successfully. Converted ${result.convertedCount} pending project memberships.`);

    const redirectUrl = new URL(`${BASE_URL}/dashboard`);
    redirectUrl.searchParams.set('github_linked', 'true');
    redirectUrl.searchParams.set('converted_projects', result.convertedCount.toString());

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Error in GitHub callback:', error);
    return NextResponse.redirect(`${BASE_URL}/error?message=Failed to link GitHub account`);
  } finally {
    await prisma.$disconnect();
  }
}
