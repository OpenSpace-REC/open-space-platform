import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');

  if (!session) {
    if (isApiRoute) {

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else {

      const url = request.nextUrl.clone();
      url.pathname = '/google-signin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/upload-project',
    // '/api/projects/:path*',
    '/api/users/:path*'
  ],
};