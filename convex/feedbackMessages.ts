import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Получение всех сообщений
export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("feedbackMessages").collect();
  },
});

// Создание нового сообщения
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Получаем идентификатор пользователя, если он авторизован
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    
    // Создаем новое сообщение
    const createdAt = new Date().toISOString();
    const messageId = await ctx.db.insert("feedbackMessages", {
      name: args.name,
      email: args.email,
      message: args.message,
      service: args.service,
      userId,
      createdAt,
    });
    
    // Отправляем уведомление на почту
    try {
      console.log("Отправка уведомления о новом сообщении:", messageId);
      
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      console.log("URL приложения:", appUrl);
      
      await fetch(`${appUrl}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: args.name,
          email: args.email,
          message: args.message,
          service: args.service,
          createdAt,
          type: "feedback",
          messageId: messageId
        }),
      });
      
      console.log("Запрос на отправку уведомления выполнен");
    } catch (error) {
      // Логируем ошибку, но не прерываем выполнение функции
      console.error("Ошибка при отправке уведомления:", error);
    }
    
    return messageId;
  },
});

// Удаление сообщения
export const remove = mutation({
  args: { id: v.id("feedbackMessages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
}); 