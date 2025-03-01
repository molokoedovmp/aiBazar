import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.error('[CHAT_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 