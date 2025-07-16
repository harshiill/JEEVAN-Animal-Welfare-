import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === '/' || // ✅ Allow everyone to access homepage
    path === '/login' ||
    path === '/signup' ||
    path === '/verify-code' ||
    path === '/forgot-password' ||
    path === '/reset-password';

  const token = request.cookies.get('token')?.value;

  if (isPublicPath && token && path !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // ✅ Allow request to continue
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
