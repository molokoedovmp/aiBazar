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
    
    // Подготовка данных о инструментах для отправки в OpenAI
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
    
    // Подготовка сообщений для OpenAI
    const messages = [
      {
        role: 'system',
        content: `Ты - AI Поиск, помощник для подбора AI-инструментов из каталога AI-Bazar. 
        Твоя задача - рекомендовать пользователям наиболее подходящие инструменты на основе их запросов.
        
        Вот каталог доступных инструментов:
        ${JSON.stringify(toolsData)}
        
        Когда пользователь описывает свою задачу или спрашивает о конкретном типе инструмента:
        1. Проанализируй запрос и определи ключевые потребности
        2. Найди 2-3 наиболее подходящих инструмента из каталога
        3. Предоставь краткое описание каждого инструмента, его категорию, рейтинг и цену
        4. Форматируй ответ с использованием markdown для лучшей читаемости
        5. В конце ответа спроси, хочет ли пользователь узнать больше о каком-то конкретном инструменте
        
        Если не можешь найти подходящие инструменты, предложи пользователю уточнить запрос.
        Всегда отвечай на русском языке.`
      }
    ]
    
    // Добавляем историю разговора
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
    
    const aiResponse = response.choices[0].message.content
    
    // Извлекаем ID рекомендованных инструментов из ответа
    // Это упрощенная логика, в реальном приложении нужно более надежное извлечение
    const recommendedTools = toolsData
      .filter(tool => aiResponse?.includes(tool.name))
      .map(tool => tool.id)
    
    return NextResponse.json({
      response: aiResponse,
      recommendedTools
    })
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error)
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    )
  }
} 