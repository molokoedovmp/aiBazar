import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Инициализация OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { query, tools, conversation } = await req.json()

    if (!query || !tools || !Array.isArray(tools)) {
      return NextResponse.json(
        { error: 'Неверные параметры запроса' },
        { status: 400 }
      )
    }

    // Подготовка компактного описания инструментов
    const toolsData = tools
      .filter(tool => tool.isActive)
      .map(tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        price: tool.price,
        rating: tool.rating
      }))

    const toolsDescription = toolsData
      .map(tool =>
        `ID: ${tool.id}, Название: ${tool.name}, Категория: ${tool.category}, Рейтинг: ${tool.rating}, Цена: ${tool.price}, Описание: ${tool.description}`
      )
      .join('\n')

    // Формирование системного сообщения с инструкцией для GPT
    const systemPrompt = `Ты - AI Поиск, помощник для подбора AI-инструментов из каталога AI-Bazar. 
Твоя задача - рекомендовать пользователям наиболее подходящие инструменты на основе их запросов.
Вот каталог доступных инструментов:
${toolsDescription}

Когда пользователь описывает свою задачу или спрашивает о конкретном типе инструмента:
1. Проанализируй запрос и определи ключевые потребности.
2. Найди 2-3 наиболее подходящих инструмента из каталога.
3. Предоставь краткое описание каждого инструмента, его категорию, рейтинг и цену.
4. Форматируй ответ с использованием markdown для лучшей читаемости.
5. В конце ответа, на отдельной строке, верни JSON объект с ключом "recommendedToolIds", содержащим массив ID рекомендованных инструментов, например: {"recommendedToolIds": ["id1", "id2"]}.

Если не можешь найти подходящие инструменты, предложи пользователю уточнить запрос.
Всегда отвечай на русском языке.`

    // Формирование сообщений для GPT (системное сообщение + история разговора)
    const messages = [{ role: 'system', content: systemPrompt }]
    conversation.forEach((msg: any) => {
      messages.push({
        role: msg.role,
        content: msg.content
      })
    })

    // Отправляем запрос к OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000
    })

    // Если aiResponse окажется null, используем пустую строку
    const aiResponse = response.choices[0].message.content ?? ""

    // Извлекаем JSON с рекомендованными инструментами
    let recommendedToolIds: string[] = []
    const jsonMatch = aiResponse.match(/{\s*"recommendedToolIds"\s*:\s*\[[\s\S]*?\]}/)
    if (jsonMatch) {
      try {
        const jsonObj = JSON.parse(jsonMatch[0])
        recommendedToolIds = jsonObj.recommendedToolIds || []
      } catch (e) {
        console.error("Ошибка парсинга JSON:", e)
      }
    }

    // Удаляем JSON из ответа, чтобы пользователь его не видел
    const cleanedResponse = jsonMatch ? aiResponse.replace(jsonMatch[0], '').trim() : aiResponse

    return NextResponse.json({
      response: cleanedResponse,
      recommendedTools: recommendedToolIds
    })
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error)
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    )
  }
}
