import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  if (!GITHUB_CLIENT_ID || !BASE_URL) {
    return NextResponse.json(
      { error: 'GitHub OAuth configuration missing' },
      { status: 500 }
    );
  }

  const REDIRECT_URI = `${BASE_URL}/api/github/callback`;
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user,user:email,write:repo_hook`;
  
  return NextResponse.json({ url: githubUrl });
}
