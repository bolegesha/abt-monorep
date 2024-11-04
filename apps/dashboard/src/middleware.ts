import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/auth'];

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  const isAuthPage = request.nextUrl.pathname === '/auth';
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // If user is logged in and tries to access auth page, redirect to profile
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // If user is not logged in and tries to access protected route, redirect to auth
  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 