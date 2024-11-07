import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if it's a preview deployment
  const isPreview = process.env.VERCEL_ENV === 'preview'
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // If it's a preview deployment and the path starts with /api/projects,
  // bypass authentication
  if (isPreview && request.nextUrl.pathname.startsWith('/api/projects')) {
    return response
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}