import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    serviceId: v.id("aibazargpt"),
    amount: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const service = await ctx.db.get(args.serviceId);

    const payment = await ctx.db.insert("payments", {
      serviceId: args.serviceId,
      amount: args.amount,
      status: args.status,
      userId: identity.subject,
      createdAt: Date.now(),
      serviceName: service?.title || "Неизвестный сервис",
      serviceCover: service?.coverImage || "/default.png",
    }) as Id<"payments">;

    return { id: payment };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("payments"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
    return { success: true };
  },
});

export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // Получаем информацию о сервисах для каждого платежа
    const paymentWithServices = await Promise.all(
      payments.map(async (payment) => {
        const service = await ctx.db.get(payment.serviceId);
        return {
          ...payment,
          serviceName: service?.title || "Неизвестный сервис",
          serviceCover: service?.coverImage || "/default.png"
        };
      })
    );

    return paymentWithServices;
  },
});

// Метод для получения всех платежей
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("payments").collect();
  },
});

// Метод для удаления платежа
export const remove = mutation({
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
}); 