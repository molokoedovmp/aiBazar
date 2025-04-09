// convex/creditPurchases.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Создание записи о покупке
export const create = mutation({
  args: { 
    userId: v.string(),
    amount: v.number(),
    price: v.number(),
    status: v.string(),
    timestamp: v.number(),
    paymentId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const purchaseId = await ctx.db.insert("creditPurchases", {
      userId: args.userId,
      amount: args.amount,
      price: args.price,
      status: args.status,
      timestamp: args.timestamp,
      paymentId: args.paymentId
    });
    return purchaseId;
  },
});

// Помечаем покупку как завершённую (статус: completed)
export const markAsCompleted = mutation({
  args: {
    purchaseId: v.id("creditPurchases"),
    paymentId: v.string(),
  },
  handler: async (ctx, { purchaseId, paymentId }) => {
    const purchase = await ctx.db.get(purchaseId);
    if (!purchase) throw new Error("Покупка не найдена");
    await ctx.db.patch(purchaseId, { status: "completed", paymentId });
    return purchaseId;
  },
});

// Помечаем покупку как отменённую (статус: canceled)
export const markAsCanceled = mutation({
  args: { purchaseId: v.id("creditPurchases") },
  handler: async (ctx, { purchaseId }) => {
    const purchase = await ctx.db.get(purchaseId);
    if (!purchase) throw new Error("Покупка не найдена");
    await ctx.db.patch(purchaseId, { status: "canceled" });
    return purchaseId;
  },
});

// Получение записи о покупке по идентификатору
export const getById = query({
  args: { purchaseId: v.string() },
  handler: async (ctx, { purchaseId }) => {
    const purchase = await ctx.db
      .query("creditPurchases")
      .filter((q) => q.eq(q.field("_id"), purchaseId))
      .first();
    return purchase;
  },
});
