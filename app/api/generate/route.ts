import { NextResponse } from 'next/server';

import OpenAI from 'openai';



// Инициализация OpenAI с ключом API из переменных окружения

const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY,

});



export async function POST(req: Request) {

  try {

    // Получаем данные из запроса

    const body = await req.json();

    const { prompt, currentText, isEditing } = body;



    if (!prompt) {

      return NextResponse.json(

        { error: 'Отсутствует запрос' },

        { status: 400 }

      );

    }



    // Формируем контекст для запроса к API

    let context = 'Ты - помощник для написания текста. Используй форматирование: заголовки (# Заголовок), подзаголовки (## Подзаголовок), маркированные списки (- пункт) и нумерованные списки (1. пункт). Пиши подробные, хорошо структурированные тексты. ';

    

    if (currentText) {

      context += `Вот текущий текст документа:\n\n${currentText}\n\n`;

    }

    

    // Определяем режим работы на основе флага isEditing

    if (isEditing) {

      context += 'Пользователь просит отредактировать текст. Ты должен вернуть ПОЛНУЮ отредактированную версию всего текста с учетом запроса пользователя. Не добавляй комментарии о том, что было изменено - просто верни готовый отредактированный текст целиком. Сохрани структуру и форматирование.';

    } else {

      context += 'Пользователь хочет дополнить текст. Сгенерируй подробный, хорошо структурированный контент на основе запроса. Используй заголовки, списки и абзацы для лучшей читаемости. Не повторяй существующий текст - генерируй только новый контент, который будет добавлен к существующему.';

    }



    // Отправляем запрос к OpenAI

    const response = await openai.chat.completions.create({

      model: 'gpt-4o-mini',

      messages: [

        { role: 'system', content: context },

        { role: 'user', content: prompt }

      ],

      temperature: 0.7,

      max_tokens: 2500,

    });



    // Получаем ответ от API

    const generatedText = response.choices[0]?.message?.content || '';



    return NextResponse.json({ text: generatedText });

  } catch (error) {

    console.error('Ошибка при генерации текста:', error);

    return NextResponse.json(

      { error: 'Произошла ошибка при обработке запроса' },

      { status: 500 }

    );

  }

} 