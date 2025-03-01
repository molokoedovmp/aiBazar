import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Создание заказа
export const create = mutation({
  args: {
    items: v.array(v.object({
      toolId: v.id("aiTools"),
      quantity: v.number(),
      priceAtPurchase: v.number(),
    })),
    totalAmount: v.number(),
    status: v.string(),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("orders", {
      userId: identity.subject,
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Получение всех заказов пользователя
export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();
  },
});

// Получение оплаченных заказов
export const getPaidByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();
  },
});

// Обновление статуса заказа
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});