import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Создание записи о покупке кредитов
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

// Завершение покупки и добавление кредитов
export const completePurchase = mutation({
  args: { 
    purchaseId: v.string()
  },
  handler: async (ctx, args) => {
    try {
      // Получаем информацию о покупке из таблицы creditPurchases
      const purchase = await ctx.db
        .query("creditPurchases")
        .filter((q) => q.eq(q.field("_id"), args.purchaseId))
        .first();
      
      if (!purchase) {
        return { success: false, error: "Покупка не найдена" };
      }
      
      // Проверяем тип покупки и наличие необходимых полей
      if (!('status' in purchase) || !('userId' in purchase) || !('amount' in purchase)) {
        return { success: false, error: "Некорректные данные покупки" };
      }
      
      if (purchase.status === "completed") {
        return { success: true, message: "Покупка уже завершена" };
      }
      
      // Принудительно обновляем статус покупки на "completed"
      await ctx.db.patch(purchase._id, {
        status: "completed"
      });
      
      // Получаем информацию о пользователе
      let userCredit = await ctx.db
        .query("userCredits")
        .withIndex("by_user", (q) => q.eq("userId", purchase.userId))
        .first();
      
      const now = Date.now();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Срок действия 30 дней
      
      if (!userCredit) {
        // Создаем новую запись для пользователя
        await ctx.db.insert("userCredits", {
          userId: purchase.userId,
          totalCredits: purchase.amount,
          usedCredits: 0,
          lastReset: now,
          plan: "paid",
          expiresAt: expiresAt.getTime()
        });
      } else {
        // Обновляем существующую запись
        await ctx.db.patch(userCredit._id, {
          totalCredits: userCredit.totalCredits + purchase.amount,
          plan: "paid",
          expiresAt: expiresAt.getTime()
        });
      }
      
      // Записываем в историю
      await ctx.db.insert("creditUsageHistory", {
        userId: purchase.userId,
        service: "purchase",
        timestamp: now,
        amount: purchase.amount
      });
      
      return { success: true };
    } catch (error) {
      console.error("Ошибка при завершении покупки:", error);
      return { success: false, error: "Внутренняя ошибка сервера" };
    }
  },
});

// Обновление статуса платежа (вызывается из вебхука)
export const updatePaymentStatus = mutation({
  args: { 
    purchaseId: v.string(),
    paymentId: v.string(),
    status: v.string()
  },
  handler: async (ctx, args) => {
    try {
      // Получаем информацию о покупке из таблицы creditPurchases
      const purchase = await ctx.db
        .query("creditPurchases")
        .filter((q) => q.eq(q.field("_id"), args.purchaseId))
        .first();
      
      if (!purchase) {
        return { success: false, error: "Покупка не найдена" };
      }
      
      // Проверяем тип покупки и наличие необходимых полей
      if (!('status' in purchase) || !('userId' in purchase) || !('amount' in purchase)) {
        return { success: false, error: "Некорректные данные покупки" };
      }
      
      if (purchase.status === "completed") {
        return { success: true, message: "Покупка уже завершена" };
      }
      
      // Обновляем статус покупки
      await ctx.db.patch(purchase._id, {
        status: args.status,
        paymentId: args.paymentId
      });
      
      // Если статус "completed", добавляем кредиты пользователю
      if (args.status === "completed") {
        // Получаем информацию о пользователе
        let userCredit = await ctx.db
          .query("userCredits")
          .withIndex("by_user", (q) => q.eq("userId", purchase.userId))
          .first();
        
        const now = Date.now();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // Срок действия 30 дней
        
        if (!userCredit) {
          // Создаем новую запись для пользователя
          await ctx.db.insert("userCredits", {
            userId: purchase.userId,
            totalCredits: purchase.amount,
            usedCredits: 0,
            lastReset: now,
            plan: "paid",
            expiresAt: expiresAt.getTime()
          });
        } else {
          // Обновляем существующую запись
          await ctx.db.patch(userCredit._id, {
            totalCredits: userCredit.totalCredits + purchase.amount,
            plan: "paid",
            expiresAt: expiresAt.getTime()
          });
        }
        
        // Записываем в историю
        await ctx.db.insert("creditUsageHistory", {
          userId: purchase.userId,
          service: "purchase",
          timestamp: now,
          amount: purchase.amount
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Ошибка при обновлении статуса платежа:", error);
      return { success: false, error: "Внутренняя ошибка сервера" };
    }
  },
});

// Получение покупки по ID
export const getById = query({
  args: { 
    purchaseId: v.string()
  },
  handler: async (ctx, args) => {
    try {
      // Получаем информацию о покупке из таблицы creditPurchases
      const purchase = await ctx.db
        .query("creditPurchases")
        .filter((q) => q.eq(q.field("_id"), args.purchaseId))
        .first();
      
      return purchase;
    } catch (error) {
      console.error("Ошибка при получении покупки:", error);
      return null;
    }
  },
});

// Получение покупок кредитов пользователя
export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return [];
    }
    
    const userId = identity.subject;
    
    // Получаем все покупки кредитов пользователя
    const purchases = await ctx.db
      .query("creditPurchases")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    
    return purchases;
  },
});

// Добавляем метод list для получения всех записей
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("creditPurchases").collect();
  },
});

// Если нужен метод для удаления записи (вместо completePurchase)
export const remove = mutation({
  args: { id: v.id("creditPurchases") },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
    return id;
  },
});

// Полное обновление записи (если updatePaymentStatus недостаточно)
export const update = mutation({
  args: { 
    id: v.id("creditPurchases"),
    userId: v.string(),
    amount: v.number(),
    price: v.number(),
    status: v.string(),
    paymentId: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return id;
  },
});

// Добавьте эту функцию в ваш файл
export const markAsCompleted = mutation({
  args: { 
    purchaseId: v.string(),
    paymentId: v.string()
  },
  handler: async (ctx, args) => {
    const { purchaseId, paymentId } = args;
    
    // Находим запись о покупке
    const purchases = await ctx.db
      .query("creditPurchases")
      .filter(q => q.eq(q.field("_id"), purchaseId))
      .collect();
    
    if (purchases.length === 0) {
      throw new Error("Покупка не найдена");
    }
    
    const purchase = purchases[0];
    
    // Обновляем статус
    await ctx.db.patch(purchase._id, {
      status: "completed",
      paymentId: paymentId
    });
    
    return purchase._id;
  }
});

// Добавьте эту функцию в ваш файл
export const getAllPending = query({
  handler: async (ctx) => {
    const purchases = await ctx.db
      .query("creditPurchases")
      .filter(q => q.eq(q.field("status"), "pending"))
      .collect();
    
    return purchases;
  }
}); 