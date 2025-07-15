import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Success! The test API route is working.' });
}