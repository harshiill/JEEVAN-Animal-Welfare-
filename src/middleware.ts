import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === '/login' ||
    path === '/signup' ||
    path === '/verify-code' ||
    path === '/forgot-password' ||
    path === '/reset-password';

  const token = request.cookies.get('token')?.value;

  // If user is already logged in and accessing a public route, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in and trying to access a protected route
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // Allow request to continue
}

export const config = {
  matcher: [
    
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
