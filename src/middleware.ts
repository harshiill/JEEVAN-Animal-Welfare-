import { NextRequest,NextResponse } from "next/server";

export function middleware(request : NextRequest)
{
    const path=request.nextUrl.pathname;

    const isPublicPath = path==='api/login' || path=='api/signup' || path ==='api/verify-code' || path === 'api/forgot-password' || path === 'api/reset-password';

    const token = request.cookies.get('token')?.value;

    if(isPublicPath && token)
    {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if(!isPublicPath && !token)
    {
        return NextResponse.redirect(new URL('/login', request.url));

    }
}

export const config = {
    matcher:[

    ]
}