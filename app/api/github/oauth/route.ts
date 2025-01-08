import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/github/callback`;

export async function GET() {
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=admin:repo_hook,repo,user`;
  
  return NextResponse.json({ url: githubUrl });
}
