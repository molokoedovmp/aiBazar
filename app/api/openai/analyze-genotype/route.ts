import { NextResponse } from "next/server";
import OpenAI from "openai";

// Инициализация клиента OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image, prompt } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Изображение обязательно" },
        { status: 400 }
      );
    }

    // Создаем запрос к OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    // Получаем результат в формате JSON
    const resultText = response.choices[0].message.content;
    let result;
    
    try {
      result = JSON.parse(resultText || "{}");
    } catch (error) {
      console.error("Ошибка при парсинге JSON:", error);
      return NextResponse.json(
        { error: "Не удалось проанализировать ответ API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Ошибка при запросе к OpenAI:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при обработке запроса" },
      { status: 500 }
    );
  }
} 