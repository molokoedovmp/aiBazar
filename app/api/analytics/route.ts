import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const timeframe = searchParams.get("timeframe") || "7d";
  
  try {
    // Для тестирования возвращаем тестовые данные
    // В реальном приложении здесь должен быть запрос к Vercel Analytics API
    
    // Генерируем тестовые данные для просмотров и посетителей
    const testData = generateTestData(timeframe);
    
    return NextResponse.json(testData);
    
    // Закомментированный код для реального использования Vercel Analytics API
    /*
    // Получаем токен из переменных окружения
    const token = process.env.VERCEL_ANALYTICS_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: "Токен Vercel Analytics не настроен" },
        { status: 500 }
      );
    }
    
    // Получаем данные о просмотрах страниц
    const pageviewsResponse = await fetch(
      `https://api.vercel.com/v1/web/analytics/pageviews?siteId=${process.env.VERCEL_SITE_ID}&from=${getFromDate(timeframe)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Получаем данные о посетителях
    const visitorsResponse = await fetch(
      `https://api.vercel.com/v1/web/analytics/visitors?siteId=${process.env.VERCEL_SITE_ID}&from=${getFromDate(timeframe)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!pageviewsResponse.ok || !visitorsResponse.ok) {
      return NextResponse.json(
        { error: "Ошибка при получении данных из Vercel Analytics" },
        { status: 500 }
      );
    }
    
    const pageviews = await pageviewsResponse.json();
    const visitors = await visitorsResponse.json();
    
    return NextResponse.json({
      pageviews: pageviews.data,
      visitors: visitors.data,
    });
    */
  } catch (error) {
    console.error("Ошибка при получении данных из Vercel Analytics:", error);
    return NextResponse.json(
      { error: "Ошибка при получении данных из Vercel Analytics" },
      { status: 500 }
    );
  }
}

// Функция для получения даты начала периода
function getFromDate(timeframe: string): string {
  const now = new Date();
  
  switch (timeframe) {
    case "24h":
      now.setHours(now.getHours() - 24);
      break;
    case "7d":
      now.setDate(now.getDate() - 7);
      break;
    case "30d":
      now.setDate(now.getDate() - 30);
      break;
    default:
      now.setDate(now.getDate() - 7);
  }
  
  return now.toISOString();
}

// Функция для генерации тестовых данных
function generateTestData(timeframe: string) {
  const dataPoints = timeframe === "24h" ? 24 : timeframe === "7d" ? 7 : 30;
  const pageviews = [];
  const visitors = [];
  
  const now = new Date();
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(now);
    
    if (timeframe === "24h") {
      date.setHours(date.getHours() - i);
    } else {
      date.setDate(date.getDate() - i);
    }
    
    // Генерируем случайные значения для просмотров и посетителей
    const pageviewValue = Math.floor(Math.random() * 100) + 50;
    const visitorValue = Math.floor(pageviewValue * 0.7); // Посетителей обычно меньше, чем просмотров
    
    pageviews.push({
      date: date.toISOString(),
      value: pageviewValue
    });
    
    visitors.push({
      date: date.toISOString(),
      value: visitorValue
    });
  }
  
  // Сортируем данные по дате (от старых к новым)
  pageviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  visitors.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return {
    pageviews,
    visitors
  };
} 