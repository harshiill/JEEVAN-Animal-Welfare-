import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Auth middleware disabled — all routes are publicly accessible
  return NextResponse.next();
}

export const config = {
  matcher: [],
};