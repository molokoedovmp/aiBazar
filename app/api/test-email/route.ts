import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    // Создаем транспорт для отправки почты
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
    
    // Отправляем тестовое письмо
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "Тестовое письмо",
      html: "<h1>Это тестовое письмо</h1><p>Если вы его получили, значит отправка почты работает.</p>",
    });
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Ошибка при отправке тестового письма:", error);
    return NextResponse.json(
      { error: "Ошибка при отправке тестового письма", details: error.message },
      { status: 500 }
    );
  }
} 