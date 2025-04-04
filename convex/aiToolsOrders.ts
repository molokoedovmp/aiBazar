import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

// Получение всех заказов
export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("aiToolsOrders").collect();
  },
});

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
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Не авторизован");
    }
    
    const userId = identity.subject;
    
    // Получаем информацию о сервисе
    const service = await ctx.db.get(args.serviceId);
    
    if (!service) {
      throw new Error("Сервис не найден");
    }
    
    // Создаем новый заказ
    const createdAt = new Date().toISOString();
    const orderId = await ctx.db.insert("aiToolsOrders", {
      userId,
      serviceId: args.serviceId,
      details: args.details,
      contactInfo: args.contactInfo,
      amount: args.amount,
      status: args.status,
      createdAt,
      serviceName: service.name,
      serviceCover: service.coverImage,
    });
    
    // Отправляем уведомление на почту
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Новый заказ",
          email: args.contactInfo,
          message: `Новый заказ на сумму ${args.amount} руб.\nДетали: ${args.details}`,
          service: service.name,
          createdAt,
          type: "order",
          orderId: orderId,
          amount: args.amount
        }),
      });
    } catch (error) {
      // Логируем ошибку, но не прерываем выполнение функции
      console.error("Ошибка при отправке уведомления:", error);
    }
    
    return orderId;
  },
});

// Обновление статуса заказа
export const updateStatus = mutation({
  args: {
    id: v.id("aiToolsOrders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    
    if (!order) {
      throw new Error("Заказ не найден");
    }
    
    await ctx.db.patch(args.id, {
      status: args.status,
    });
    
    return args.id;
  },
});

// Получение заказов пользователя
export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Не авторизован");
    }
    
    const userId = identity.subject;
    
    return await ctx.db
      .query("aiToolsOrders")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const remove = mutation({
  args: {
    id: v.id("aiToolsOrders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
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