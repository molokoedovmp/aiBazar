import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Инициализация OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { query, conversation } = await req.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Неверные параметры запроса' },
        { status: 400 }
      )
    }

    // Формирование системного сообщения для генерации VBA кода
    const systemPrompt = `Ты GPT для создания презентаций. Твоя задача — генерировать корректный и рабочий VBA код для Excel, который пользователь сможет использовать в макросе для автоматического создания презентаций.
    
Требования:
1. Ответ должен содержать исключительно VBA код, без лишних пояснений. Если необходимо, можно добавить краткие комментарии прямо в код.
2. Код должен быть готовым для вставки в редактор макросов Excel (Alt+F11).
3. Основывайся на описании, предоставленном пользователем, для создания презентации.
    
Всегда отвечай на русском языке.`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ]
    
    if (conversation && Array.isArray(conversation)) {
      conversation.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      })
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1500
    })

    const aiResponse = response.choices[0].message.content ?? ""
    
    return NextResponse.json({
      response: aiResponse
    })
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error)
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    )
  }
}
