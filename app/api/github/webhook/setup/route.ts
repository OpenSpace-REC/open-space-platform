import { NextResponse } from 'next/server';
import { createOctokitForUser } from '@/lib/octokit';

// Add type for GitHub API error response
interface GitHubErrorResponse {
  response?: {
    data?: {
      message?: string;
      [key: string]: unknown;
    };
  };
}

export async function POST(request: Request) {
  try {
    const { userId, reponame } = await request.json();

    console.log('Request payload:', { userId, reponame });

    if (!userId || !reponame) {
      console.error('Validation error: userId or reponame missing');
      return NextResponse.json(
        { error: 'userId and reponame are required' },
        { status: 400 }
      );
    }

    const { octokit, error, user } = await createOctokitForUser(userId);

    console.log('Octokit creation result:', { octokit, error, user });

    if (error || !octokit) {
      console.error('Failed to create Octokit instance:', error);
      return NextResponse.json(
        { error: error || 'Failed to create Octokit instance' },
        { status: 400 }
      );
    }

    if (!user?.githubUsername) {
      console.error('GitHub username not found for user:', userId);
      return NextResponse.json(
        { error: 'GitHub username not found' },
        { status: 400 }
      );
    }

    const webhookUrl = 'https://laptop-483nic2i.tail7526d.ts.net/api/github/webhook/listen';

    console.log('Webhook URL:', webhookUrl);

    try {
      const webhookResponse = await octokit.repos.createWebhook({
        owner: user.githubUsername,
        repo: reponame,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: process.env.GITHUB_WEBHOOK_SECRET,
        },
        events: [
          'push',
          'pull_request',
          'pull_request_review',
          'issues',
          'issue_comment',
          'discussion',
          'discussion_comment',
          'fork',
          'watch',
        ],
      });

      console.log('Webhook created successfully:', webhookResponse.data);

      return NextResponse.json(webhookResponse.data);
    } catch (webhookError) {
      if (webhookError instanceof Error) {
        const gitHubError = webhookError as Error & GitHubErrorResponse;
        console.error('GitHub API webhook creation error:', {
          message: gitHubError.message,
          ...(gitHubError.response?.data && { data: gitHubError.response.data }),
        });

        return NextResponse.json(
          {
            error: 'GitHub API webhook creation error',
            details: gitHubError.message,
          },
          { status: 500 }
        );
      }

      console.error('Unexpected error type:', webhookError);
      return NextResponse.json(
        { error: 'Unexpected error while creating webhook' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error setting up webhook:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to set up webhook', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
