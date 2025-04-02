import { NextResponse } from 'next/server';

import OpenAI from 'openai';



// Инициализация OpenAI с ключом API из переменных окружения

const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY,

});



// Указываем, что этот маршрут должен быть динамическим

export const dynamic = 'force-dynamic';

export const maxDuration = 60; // Увеличиваем максимальную продолжительность до 60 секунд



export async function POST(req: Request) {

  try {

    console.log("API: Получен запрос на генерацию");

    

    // Получаем данные из запроса

    const body = await req.json();

    const { prompt, currentText, isEditing } = body;



    if (!prompt) {

      console.error("API: Отсутствует запрос");

      return NextResponse.json(

        { error: 'Отсутствует запрос' },

        { status: 400 }

      );

    }



    console.log(`API: Обработка запроса: "${prompt.substring(0, 50)}..." (${isEditing ? 'редактирование' : 'генерация'})`);



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



    console.log("API: Отправка запроса к OpenAI");

    

    // Отправляем запрос к OpenAI с обработкой ошибок и повторными попытками

    let attempts = 0;

    let generatedText = '';

    let error = null;

    

    while (attempts < 3 && !generatedText) {

      try {

        attempts++;

        console.log(`API: Попытка ${attempts}`);

        

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

        generatedText = response.choices[0]?.message?.content || '';

        

        if (!generatedText) {

          console.warn("API: Пустой ответ от OpenAI");

          throw new Error("Пустой ответ от API");

        }

        

        console.log(`API: Получен ответ от OpenAI (${generatedText.length} символов)`);

      } catch (err) {

        error = err;

        console.error(`API: Ошибка при попытке ${attempts}:`, err);

        // Ждем перед повторной попыткой

        if (attempts < 3) {

          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));

        }

      }

    }

    

    if (!generatedText) {

      console.error("API: Все попытки завершились неудачно:", error);

      return NextResponse.json(

        { error: `Не удалось получить ответ от API после ${attempts} попыток: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` },

        { status: 500 }

      );

    }



    return NextResponse.json({ text: generatedText });

  } catch (error) {

    console.error('API: Критическая ошибка при генерации текста:', error);

    return NextResponse.json(

      { error: `Произошла ошибка при обработке запроса: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` },

      { status: 500 }

    );

  }

} 