import { PrismaClient } from '@prisma/client'
import { Octokit } from '@octokit/rest'
import { decryptToken } from './encryption'

const prisma = new PrismaClient()

interface TokenResult {
  token: string | null
  error?: string
  user?: {
    name: string | null
    githubUsername: string | null
  }
}

export async function getGithubToken(userid: string): Promise<TokenResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userid },
      select: {
        githubAccessToken: true,
        name: true,
        githubUsername: true
      }
    })

    if (!user) {
      return {
        token: null,
        error: 'User not found'
      }
    }

    if (!user.githubAccessToken) {
      return {
        token: null,
        error: 'GitHub token not found',
        user: {
          name: user.name,
          githubUsername: user.githubUsername
        }
      }
    }

    return {
      token: decryptToken(user.githubAccessToken),
      user: {
        name: user.name,
        githubUsername: user.githubUsername
      }
    }
  } catch (error) {
    console.error('Error fetching GitHub token:', error)
    return {
      token: null,
      error: 'Database error occurred'
    }
  }
}

export async function createOctokitForUser(userId: string): Promise<{
  octokit: Octokit | null
  error?: string
  user?: {
    name: string | null
    githubUsername: string | null
  }
}> {
  const { token, error, user } = await getGithubToken(userId)
  
  if (error || !token) {
    return { octokit: null, error, user }
  }

  const octokit = new Octokit({
    auth: token
  })

  return { octokit, user }
}
  