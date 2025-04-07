import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Получение информации о кредитах пользователя
export const getUserCredits = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Проверяем, существует ли запись для пользователя
    const userCredit = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    if (!userCredit) {
      // Если записи нет, создаем новую с бесплатным планом (10 кредитов)
      return {
        totalCredits: 10,
        remainingCredits: 10,
        plan: "free",
        resetDate: null
      };
    }
    
    // Проверяем, не истекла ли подписка
    if (userCredit.expiresAt && userCredit.expiresAt < Date.now()) {
      return {
        totalCredits: 10, // Возвращаемся к бесплатному плану
        remainingCredits: 10 - userCredit.usedCredits,
        plan: "free",
        resetDate: getNextResetDate(userCredit.lastReset)
      };
    }
    
    // Проверяем, не нужно ли сбросить счетчик использованных кредитов
    const now = Date.now();
    const resetDate = getNextResetDate(userCredit.lastReset);
    
    if (now > resetDate) {
      // Пора сбросить счетчик
      return {
        totalCredits: userCredit.totalCredits,
        remainingCredits: userCredit.totalCredits, // Все кредиты доступны снова
        plan: userCredit.plan,
        resetDate: getNextResetDate(now) // Следующий сброс через месяц
      };
    }
    
    // Возвращаем текущее состояние
    return {
      totalCredits: userCredit.totalCredits,
      remainingCredits: Math.max(0, userCredit.totalCredits - userCredit.usedCredits),
      plan: userCredit.plan,
      resetDate
    };
  },
});

// Использование кредита
export const useCredit = mutation({
  args: { 
    userId: v.string(),
    service: v.string(),
    amount: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const creditAmount = args.amount || 1; // По умолчанию используем 1 кредит
    
    // Получаем или создаем запись о кредитах пользователя
    let userCredit = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    const now = Date.now();
    
    if (!userCredit) {
      // Создаем новую запись для пользователя
      const userId = await ctx.db.insert("userCredits", {
        userId: args.userId,
        totalCredits: 10, // Бесплатный план
        usedCredits: creditAmount,
        lastReset: now,
        plan: "free"
      });
      
      // Записываем использование в историю
      await ctx.db.insert("creditUsageHistory", {
        userId: args.userId,
        service: args.service,
        timestamp: now,
        amount: creditAmount
      });
      
      return { success: true, remainingCredits: 10 - creditAmount };
    }
    
    // Проверяем, не нужно ли сбросить счетчик
    const resetDate = getNextResetDate(userCredit.lastReset);
    
    if (now > resetDate) {
      // Сбрасываем счетчик и обновляем дату последнего сброса
      await ctx.db.patch(userCredit._id, {
        usedCredits: creditAmount,
        lastReset: now
      });
      
      // Записываем использование в историю
      await ctx.db.insert("creditUsageHistory", {
        userId: args.userId,
        service: args.service,
        timestamp: now,
        amount: creditAmount
      });
      
      return { success: true, remainingCredits: userCredit.totalCredits - creditAmount };
    }
    
    // Проверяем, достаточно ли кредитов
    const remainingCredits = userCredit.totalCredits - userCredit.usedCredits;
    
    if (remainingCredits < creditAmount) {
      return { 
        success: false, 
        error: "Недостаточно кредитов",
        remainingCredits
      };
    }
    
    // Обновляем счетчик использованных кредитов
    await ctx.db.patch(userCredit._id, {
      usedCredits: userCredit.usedCredits + creditAmount
    });
    
    // Записываем использование в историю
    await ctx.db.insert("creditUsageHistory", {
      userId: args.userId,
      service: args.service,
      timestamp: now,
      amount: creditAmount
    });
    
    return { 
      success: true, 
      remainingCredits: remainingCredits - creditAmount 
    };
  },
});

// Добавление кредитов (например, после покупки)
export const addCredits = mutation({
  args: { 
    userId: v.string(),
    amount: v.number(),
    plan: v.optional(v.string()),
    expiresAt: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Получаем или создаем запись о кредитах пользователя
    let userCredit = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    if (!userCredit) {
      // Создаем новую запись для пользователя
      await ctx.db.insert("userCredits", {
        userId: args.userId,
        totalCredits: args.amount,
        usedCredits: 0,
        lastReset: Date.now(),
        plan: args.plan || "free",
        expiresAt: args.expiresAt
      });
      
      return { success: true, totalCredits: args.amount };
    }
    
    // Обновляем существующую запись
    const updates: any = {
      totalCredits: args.amount
    };
    
    if (args.plan) {
      updates.plan = args.plan;
    }
    
    if (args.expiresAt) {
      updates.expiresAt = args.expiresAt;
    }
    
    await ctx.db.patch(userCredit._id, updates);
    
    return { 
      success: true, 
      totalCredits: args.amount,
      remainingCredits: args.amount - userCredit.usedCredits
    };
  },
});

// Вспомогательная функция для определения даты следующего сброса
function getNextResetDate(lastReset: number): number {
  const date = new Date(lastReset);
  date.setMonth(date.getMonth() + 1);
  return date.getTime();
} 