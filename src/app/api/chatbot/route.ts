// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
      messages,
    }),
  });

  const data = await response.json();
  const message = data?.choices?.[0]?.message?.content;

  return NextResponse.json({ message });
}
