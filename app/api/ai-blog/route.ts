import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Инициализация OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { prompt, style, tone, length } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Не указан prompt' }, { status: 400 })
    }

    // Улучшенное системное сообщение с инструкциями по форматированию
    const systemPrompt = `Ты AI для написания статей. Твоя задача — написать уникальную, интересную и информативную статью на основе запроса пользователя.
    
Настройки:
- Стиль: ${style ? style : 'стандартный'}
- Тональность: ${tone ? tone : 'нейтральная'}
- Длина: ${length ? length : 'средняя'}

Важные требования к форматированию:
1. Используй структурированный подход с заголовками и подзаголовками (# для главного заголовка, ## для подзаголовков, ### для подразделов)
2. Включай маркированные списки (используй - или * для элементов списка) для перечисления важных пунктов
3. Используй нумерованные списки (1., 2., 3.) для последовательных шагов или рейтингов
4. Выделяй **важные термины и ключевые фразы жирным шрифтом**
5. Разбивай текст на логические абзацы для лучшей читаемости

Пиши статью на русском языке, придерживаясь заданных параметров. Обязательно используй разнообразное форматирование для улучшения структуры и читаемости текста.`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ]

    // Отправляем запрос к OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2000
    })

    const aiResponse = response.choices[0].message.content ?? ""

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error)
    return NextResponse.json({ error: "Ошибка при обработке запроса" }, { status: 500 })
  }
}
