import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function middleware(request: NextRequest) {

  const isPreview = process.env.VERCEL_ENV === 'preview'
  const response = NextResponse.next()


  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')


  if (isPreview && request.nextUrl.pathname.startsWith('/api/projects')) {
    return response
  }

 
  const publicPaths = ['/banned', '/', '/auth/google-signin', '/api/auth', '/api/check-ban-status', '/api/admin/toggle-platform-access', '/restricted']
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return response
  }

  try {
    const session = await auth()
    

    if (!session?.user?.email) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { banned: true, role: true }
    });

    if (!user) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (user.banned) {
    
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'User is banned' },
          { status: 403 }
        )
      }
      

      return NextResponse.redirect(new URL('/banned', request.url))
    }

    
    const settings = await prisma.settings.findUnique({
      where: { id: 'app_settings' }
    });

    
    if (settings?.adminOnlyAccess === true) {
     
      if (user.role !== 'ADMIN') {
     
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Platform is currently restricted to admin users only' },
            { status: 403 }
          )
        }
        

        return NextResponse.redirect(new URL('/restricted', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)

    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}