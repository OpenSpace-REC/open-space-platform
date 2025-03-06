import { headers } from 'next/headers';
import crypto from 'crypto';
import {prisma }from '@/lib/prisma'; // Adjust this import based on your prisma client location

// Add interfaces for GitHub webhook payloads
interface GitHubUser {
  login: string;
}

interface PullRequest {
  user: GitHubUser;
  merged: boolean;
  base: {
    repo: {
      full_name: string;
    };
  };
}

interface Repository {
  full_name: string;
}

interface PullRequestPayload {
  action: string;
  pull_request: PullRequest;
  repository: Repository;
}

interface Review {
  user: GitHubUser;
}

interface PullRequestReviewPayload {
  action: string;
  review: Review;
  pull_request: PullRequest;
}

// Point values for different actions
const POINTS_CONFIG = {
  PULL_REQUEST_OPENED: 5,
  PULL_REQUEST_MERGED: 10,
  PULL_REQUEST_REVIEWED: 3,
} as const;

async function updateUserPoints(githubUsername: string, points: number) {
  try {
    
    const user = await prisma.user.findUnique({
      where: { githubUsername },
    });

    if (!user) {
      console.log(`User not found for GitHub username: ${githubUsername}`);
      return null;
    }


    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: {
          increment: points
        }
      },
    });

    return updatedUser;
  } catch (error) {
    console.error('Error updating user points:', error);
    throw error;
  }
}

async function addContributorRole(githubUsername: string, repoFullName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { githubUsername },
      select: { id: true }
    });

    if (!user) {
      console.log(`User not found for GitHub username: ${githubUsername}`);
      return null;
    }

    const project = await prisma.project.findUnique({
      where: { githubUrl: `https://github.com/${repoFullName}` },
      select: { id: true }
    });

    if (!project) {
      console.log(`Project not found for repo: ${repoFullName}`);
      return null;
    }

    const existingRole = await prisma.projectUser.findFirst({
      where: {
        userId: user.id,
        projectId: project.id
      }
    });

    if (existingRole) {
      console.log(`User ${githubUsername} already has a role in project ${project.id}`);
      return existingRole;
    }

    const projectUser = await prisma.projectUser.create({
      data: {
        userId: user.id,
        projectId: project.id,
        role: 'CONTRIBUTOR'
      }
    });

    return projectUser;
  } catch (error) {
    console.error('Error adding contributor role:', error);
    throw error;
  }
}

async function handlePullRequestEvent(payload: PullRequestPayload) {
  const { action, pull_request } = payload;
  const githubUsername = pull_request.user.login;

  // Handle PR opened
  if (action === 'opened') {
    await updateUserPoints(githubUsername, POINTS_CONFIG.PULL_REQUEST_OPENED);
  }
  
  // Handle PR merged
  if (action === 'closed' && pull_request.merged) {
    await updateUserPoints(githubUsername, POINTS_CONFIG.PULL_REQUEST_MERGED);
    await addContributorRole(githubUsername, pull_request.base.repo.full_name);
  }
}

async function handlePullRequestReviewEvent(payload: PullRequestReviewPayload) {
  const { action, review, pull_request } = payload;
  const githubUsername = review.user.login;

  if (action === 'submitted') {
    await updateUserPoints(githubUsername, POINTS_CONFIG.PULL_REQUEST_REVIEWED);
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const signature = headersList.get('x-hub-signature-256');
    const event = headersList.get('x-github-event');
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    // Get raw body as text first
    const rawBody = await request.text();
    
    // Generate signature from raw body
    const generatedSignature = `sha256=${crypto
      .createHmac('sha256', secret!)
      .update(rawBody)
      .digest('hex')}`;

    if (signature !== generatedSignature) {
      console.error('Signature mismatch:', {
        received: signature,
        generated: generatedSignature,
      });
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = JSON.parse(rawBody);
    console.log('Webhook event:', event);

    let result = null;

    switch (event) {
      case 'pull_request':
        result = await handlePullRequestEvent(body);
        break;
        
      case 'pull_request_review':
        result = await handlePullRequestReviewEvent(body);
        break;

      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return new Response(JSON.stringify({ 
      message: 'Webhook processed successfully',
      event,
      result 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}