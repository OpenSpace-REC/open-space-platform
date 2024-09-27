import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.AUTH_GITHUB_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(request: Request) {
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
  const updatedUser = await prisma.user.upsert({
    where: { email },
    update: {
      githubUsername: userData.login,
      githubProfileUrl: userData.html_url,
      githubAvatarUrl: userData.avatar_url,
    },
    create: {
      googleId: session.googleId || '',
      name: session.user.name || '',
      email,
      githubUsername: userData.login,
      githubProfileUrl: userData.html_url,
      githubAvatarUrl: userData.avatar_url,
    },
  });

  console.log('Updated or created user:', updatedUser);

  return NextResponse.redirect(`${BASE_URL}/landing`);
}