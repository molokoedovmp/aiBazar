import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
// Мутация для добавления сообщения обратной связи


export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Убираем проверку авторизации, чтобы любой мог отправить заявку
    // Получаем идентификатор пользователя, если он авторизован
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    const document = await ctx.db.insert("feedbackMessages", {
      name: args.name,
      email: args.email,
      message: args.message,
      service: args.service,
      userId: userId || "anonymous", // Сохраняем ID пользователя или "anonymous"
      createdAt: new Date().toISOString(),
    });

    return document;
  }
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feedbackMessages").collect();
  },
});

// Алиас для совместимости с существующим кодом
export const submitFeedback = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedbackMessages", {
      name: args.name,
      email: args.email,
      message: args.message,
      service: args.service,
      createdAt: new Date().toISOString(),
    });
  },
});
