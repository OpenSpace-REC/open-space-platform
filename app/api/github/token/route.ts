export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { decryptToken } from "@/lib/encryption"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { githubAccessToken: true }
    })

    if (!user?.githubAccessToken) {
      return NextResponse.json({ error: 'No GitHub token found' }, { status: 404 })
    }

    const decryptedToken = decryptToken(user.githubAccessToken)
    return NextResponse.json({ token: decryptedToken })
  } catch (error) {
    console.error('Error fetching GitHub token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 