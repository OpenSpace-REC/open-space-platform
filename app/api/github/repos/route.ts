import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';  
import { prisma } from '@/lib/prisma';  

export async function GET(request: Request) {
  console.log("GET /api/github/repos called");

  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    console.log("Not authenticated");
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch the user from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.access_token || !user.githubUsername) {
    console.log("GitHub is not linked.");
    return NextResponse.json({ error: 'GitHub is not linked.' }, { status: 400 });
  }

  try {
    // Fetch repositories from GitHub API
    const repoResponse = await fetch(`https://api.github.com/users/${user.githubUsername}/repos`, {
      headers: {
        Authorization: `token ${user.access_token}`,
        'Accept': 'application/vnd.github.v3+json',  
      },
    });

    if (!repoResponse.ok) {
      const errorData = await repoResponse.json();
      console.log("Error fetching repos:", errorData);
      return NextResponse.json({ error: errorData }, { status: repoResponse.status });
    }

    const repositories = await repoResponse.json();
    return NextResponse.json(repositories);
  } catch (error) {
    console.log("Error fetching repositories:", error);
    return NextResponse.json({ error: 'Failed to fetch GitHub repositories.' }, { status: 500 });
  }
}
