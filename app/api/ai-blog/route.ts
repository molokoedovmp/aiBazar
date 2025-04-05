import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Инициализация OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { prompt, style, length } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Не указан prompt' }, { status: 400 })
    }

    // Формируем системное сообщение с учетом дополнительных настроек
    const systemPrompt = `Ты AI для написания статей. Твоя задача — написать уникальную, интересную и информативную статью на основе запроса пользователя.
    
Настройки:
- Стиль: ${style ? style : 'стандартный'}
- Длина: ${length ? length : 'средняя'}

Пиши статью на русском языке, придерживаясь заданных параметров. Если какие-либо настройки не указаны, используй значения по умолчанию.`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ]

    // Отправляем запрос к OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1500
    })

    const aiResponse = response.choices[0].message.content ?? ""

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error)
    return NextResponse.json({ error: "Ошибка при обработке запроса" }, { status: 500 })
  }
}
