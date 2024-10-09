import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.AUTH_GITHUB_ID;
const REDIRECT_URI = `http://localhost:3000/api/github/callback`;

export async function GET() {
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;
  
  return NextResponse.json({ url: githubUrl });
}
