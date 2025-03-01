import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

// Создание заказа
export const create = mutation({
  args: {
    serviceId: v.id("aiTools"),
    details: v.string(),
    contactInfo: v.string(),
    amount: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const order = await ctx.db.insert("aiToolsOrders", {
      userId: userId.subject,
      serviceId: args.serviceId,
      details: args.details,
      contactInfo: args.contactInfo,
      amount: args.amount,
      status: args.status || 'processing',
      createdAt: new Date().toISOString(),
    });

    return order;
  },
});

// Обновление статуса заказа
export const updateStatus = mutation({
  args: {
    id: v.id("aiToolsOrders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});

// Получение заказов пользователя
export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const orders = await ctx.db
      .query("aiToolsOrders")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    return orders;
  },
});

// Получение всех заказов пользователя (не только completed)
export const getPaidByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const orders = await ctx.db
      .query("aiToolsOrders")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // Получаем информацию о сервисах для каждого заказа
    const ordersWithServices = await Promise.all(
      orders.map(async (order) => {
        const service = await ctx.db.get(order.serviceId);
        return {
          ...order,
          serviceName: service?.name || "Неизвестный сервис",
          serviceCover: service?.coverImage || "/default.png"
        };
      })
    );

    return ordersWithServices;
  },
}); 