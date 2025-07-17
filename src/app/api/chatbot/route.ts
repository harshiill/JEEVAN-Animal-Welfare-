import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages } = body as {
      messages: { role: 'user' | 'system' | 'assistant'; content: string }[];
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful and friendly dog care assistant who answers dog disease, pet care, and vet-related questions.',
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return NextResponse.json({ message: '⚠️ Error: Failed to respond.' }, { status: 500 });
    }

    return NextResponse.json({ message: data.choices[0].message.content });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: 'Error: ' + err.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred.' }, { status: 500 });
  }
}
