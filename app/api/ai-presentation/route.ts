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
      console.log('Отсутствует запрос в теле запроса')
      return NextResponse.json(
        { error: 'Неверные параметры запроса' },
        { status: 400 }
      )
    }

    // Улучшенный системный промпт с добавлением констант PowerPoint
    const systemPrompt = `Ты эксперт по созданию презентаций PowerPoint и VBA-коду. Твоя задача — генерировать корректный и рабочий VBA код для PowerPoint, который пользователь сможет использовать для автоматического создания презентаций.
    
Требования:
1. Отвечай только VBA кодом, без дополнительных пояснений вне кода.
2. Код должен использовать объектную модель PowerPoint (не Excel).
3. Код должен начинаться с 'Sub CreatePresentation()' и заканчиваться 'End Sub'.
4. Используй правильные объекты PowerPoint: Application, Presentations, Slides, Shapes.
5. Каждый слайд должен добавляться через ActivePresentation.Slides.Add.
6. Включай комментарии в код для объяснения важных частей.
7. Обрабатывай базовые элементы: заголовки, текст, маркированные списки, фигуры, изображения.
8. Избегай использования системных функций, которые могут вызвать ошибки безопасности.

Константы макетов PowerPoint:
Const ppLayoutBlank = 12            ' Пустой слайд
Const ppLayoutChart = 8             ' Слайд с диаграммой
Const ppLayoutChartAndText = 6      ' Слайд с диаграммой и текстом
Const ppLayoutClipartAndText = 10   ' Слайд с клипартом и текстом
Const ppLayoutFourObjects = 24      ' Слайд с четырьмя объектами
Const ppLayoutLargeObject = 15      ' Слайд с большим объектом
Const ppLayoutMediaClipAndText = 18 ' Слайд с медиа и текстом
Const ppLayoutObject = 16           ' Слайд с объектом
Const ppLayoutObjectAndText = 14    ' Слайд с объектом и текстом
Const ppLayoutObjectOverText = 19   ' Слайд с объектом поверх текста
Const ppLayoutPictureWithCaption = 30 ' Слайд с изображением и подписью
Const ppLayoutSection = 33          ' Слайд с разделом
Const ppLayoutTable = 4             ' Слайд с таблицей
Const ppLayoutText = 2              ' Слайд с текстом
Const ppLayoutTextAndChart = 5      ' Слайд с текстом и диаграммой
Const ppLayoutTextAndClipart = 9    ' Слайд с текстом и клипартом
Const ppLayoutTextAndMediaClip = 17 ' Слайд с текстом и медиа
Const ppLayoutTextAndObject = 13    ' Слайд с текстом и объектом
Const ppLayoutTextAndTwoObjects = 21 ' Слайд с текстом и двумя объектами
Const ppLayoutTextOverObject = 20   ' Слайд с текстом поверх объекта
Const ppLayoutTitle = 1             ' Титульный слайд
Const ppLayoutTitleOnly = 7         ' Слайд только с заголовком
Const ppLayoutTwoColumnText = 3     ' Слайд с двумя колонками текста
Const ppLayoutTwoObjects = 29       ' Слайд с двумя объектами
Const ppLayoutTwoObjectsAndText = 22 ' Слайд с двумя объектами и текстом
Const ppLayoutTwoObjectsOverText = 23 ' Слайд с двумя объектами поверх текста

Код должен начинаться с определения констант:

Sub CreatePresentation()
    ' Константы макетов PowerPoint
    Const ppLayoutTitle = 1
    Const ppLayoutText = 2
    Const ppLayoutTwoColumnText = 3
    Const ppLayoutTable = 4
    Const ppLayoutTitleOnly = 7
    
    ' Далее ваш код...
End Sub

Пример полного рабочего кода:
Sub CreatePresentation()
    ' Константы макетов PowerPoint
    Const ppLayoutTitle = 1
    Const ppLayoutText = 2
    
    ' Добавляем титульный слайд
    ActivePresentation.Slides.Add 1, ppLayoutTitle
    With ActivePresentation.Slides(1).Shapes(1).TextFrame.TextRange
        .Text = "Заголовок презентации"
    End With
    
    ' Добавляем второй слайд с текстом
    ActivePresentation.Slides.Add 2, ppLayoutText
    With ActivePresentation.Slides(2).Shapes(1).TextFrame.TextRange
        .Text = "Раздел 1"
    End With
End Sub`

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
    
    try {
      console.log('Отправка запроса к OpenAI API...')
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages as any,
        temperature: 0.5,
        max_tokens: 3500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })

      let aiResponse = response.choices[0].message.content ?? ""
      console.log('Получен ответ от OpenAI API, длина ответа:', aiResponse.length)
      
      // Удаляем потенциальные обратные кавычки (```vba, ```)
      aiResponse = aiResponse.replace(/```vba/g, '').replace(/```/g, '');
      
      // Проверяем, что ответ содержит VBA код и исправляем при необходимости
      if (!aiResponse.includes("Sub CreatePresentation()")) {
        console.error("API не сгенерировал VBA код с правильной структурой")
        // Добавляем базовую структуру, если её нет
        aiResponse = `Sub CreatePresentation()
' Константы макетов PowerPoint
Const ppLayoutTitle = 1
Const ppLayoutText = 2
Const ppLayoutTwoColumnText = 3
Const ppLayoutTable = 4
Const ppLayoutTitleOnly = 7

' Автоматизированная презентация PowerPoint
${aiResponse}
End Sub`
      }
      
      // Проверяем, есть ли константы в коде, если нет - добавляем
      if (!aiResponse.includes("Const ppLayoutTitle")) {
        aiResponse = aiResponse.replace("Sub CreatePresentation()", 
`Sub CreatePresentation()
' Константы макетов PowerPoint
Const ppLayoutTitle = 1
Const ppLayoutText = 2
Const ppLayoutTwoColumnText = 3
Const ppLayoutTable = 4
Const ppLayoutTitleOnly = 7
`);
      }
      
      return NextResponse.json({
        response: aiResponse
      })
    } catch (apiError: any) {
      // Подробное логирование ошибок OpenAI API
      console.error('Ошибка API OpenAI:', apiError)
      
      let errorMessage = 'Ошибка при генерации презентации.'
      let statusCode = 500
      
      // Обработка типичных ошибок OpenAI API
      if (apiError.status === 429) {
        errorMessage = 'Превышен лимит запросов к API. Попробуйте позже.'
        statusCode = 429
        console.error('Ошибка лимита запросов:', apiError.statusText)
      } else if (apiError.status === 400) {
        errorMessage = 'Неверный запрос к API. Попробуйте с более коротким или другим запросом.'
        console.error('Ошибка в запросе:', apiError.statusText)
      } else if (apiError.name === 'TimeoutError') {
        errorMessage = 'Превышено время ожидания ответа. Попробуйте с более коротким запросом.'
        console.error('Таймаут запроса:', apiError.message)
      } else {
        // Логируем полную информацию об ошибке для других случаев
        console.error('Полные данные ошибки:', {
          name: apiError.name,
          message: apiError.message,
          stack: apiError.stack,
          type: typeof apiError,
          status: apiError.status,
          response: apiError.response
        })
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          errorDetails: process.env.NODE_ENV === 'development' ? {
            name: apiError.name,
            message: apiError.message,
            status: apiError.status
          } : undefined
        },
        { status: statusCode }
      )
    }
  } catch (error: any) {
    // Улучшенная обработка общих ошибок
    console.error('Ошибка при обработке запроса:', error)
    console.error('Тип ошибки:', error.name)
    console.error('Сообщение ошибки:', error.message)
    console.error('Стек вызовов:', error.stack)
    
    return NextResponse.json(
      { 
        error: 'Ошибка при обработке запроса',
        errorDetails: process.env.NODE_ENV === 'development' ? {
          name: error.name,
          message: error.message
        } : undefined
      },
      { status: 500 }
    )
  }
}
