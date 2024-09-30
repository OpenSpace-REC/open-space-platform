// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; 
export async function middleware(request: NextRequest) {
  
  const session = await auth(); 

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/google-signin'; 
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); 
}


export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], 
};
