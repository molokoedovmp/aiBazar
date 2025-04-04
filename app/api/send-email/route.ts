import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, service, createdAt, type, orderId, messageId, amount } = body;
    
    console.log("Получен запрос на отправку почты:", {
      type,
      email,
      service,
      messageId,
      orderId
    });
    
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
    
    console.log("Настройки SMTP:", {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: process.env.EMAIL_SERVER_SECURE,
      user: process.env.EMAIL_SERVER_USER,
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO
    });
    
    // Форматируем дату
    const formattedDate = new Date(createdAt).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    // Формируем HTML для письма в зависимости от типа уведомления
    let html = '';
    let subject = '';
    
    if (type === 'order') {
      subject = `Новый заказ #${orderId}`;
      html = `
        <h2>Новый заказ на сайте</h2>
        <p><strong>ID заказа:</strong> ${orderId}</p>
        <p><strong>Контактная информация:</strong> ${email}</p>
        <p><strong>Сервис:</strong> ${service || 'Не указан'}</p>
        <p><strong>Сумма:</strong> ${amount} ₽</p>
        <p><strong>Дата:</strong> ${formattedDate}</p>
        <p><strong>Детали заказа:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders">Перейти к управлению заказами</a></p>
      `;
    } else {
      subject = `Новое сообщение от ${name}`;
      html = `
        <h2>Новое сообщение с формы обратной связи</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${service ? `<p><strong>Сервис:</strong> ${service}</p>` : ""}
        <p><strong>Дата:</strong> ${formattedDate}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/feedback">Перейти к сообщениям</a></p>
      `;
    }
    
    console.log("Подготовлено письмо:", { subject });
    
    // Отправляем письмо
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject,
      html,
    });
    
    console.log("Письмо отправлено:", info.messageId);
    
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Ошибка при отправке письма:", error);
    return NextResponse.json(
      { error: "Ошибка при отправке уведомления на почту", details: error.message },
      { status: 500 }
    );
  }
} 