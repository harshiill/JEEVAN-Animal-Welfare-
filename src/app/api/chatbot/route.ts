import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

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
            content: 'You are a helpful and friendly dog care assistant.',
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
    return NextResponse.json({ message: '⚠️ Error: Unable to reach server.' }, { status: 500 });
  }
}
