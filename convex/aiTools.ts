import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Функция для получения всех инструментов
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aiTools").collect();
  },
});


export const getById = query({
  args: { 
    aiToolsId: v.id("aiTools") 
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.aiToolsId);
    return document;
  }
  
});


export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiTools")
      .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
      .collect();
  },
});

// Добавляем мутации для создания и обновления с поддержкой startPrice

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    coverImage: v.optional(v.string()),
    url: v.optional(v.string()),
    type: v.string(),
    isActive: v.boolean(),
    rating: v.optional(v.number()),
    price: v.optional(v.number()),
    startPrice: v.optional(v.number()),
    categoryId: v.id("categories"),
    exchangeRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { exchangeRate, ...toolData } = args;
    
    // Если указана стартовая цена, но не указана основная, рассчитываем её
    if (toolData.startPrice && !toolData.price) {
      const rate = exchangeRate || 90; // Курс по умолчанию
      const commission = 750;
      toolData.price = Math.round(toolData.startPrice * rate + commission);
    }
    
    return await ctx.db.insert("aiTools", toolData);
  },
});

export const update = mutation({
  args: {
    id: v.id("aiTools"),
    name: v.string(),
    description: v.string(),
    url: v.optional(v.string()),
    type: v.optional(v.string()),
    isActive: v.boolean(),
    rating: v.optional(v.number()),
    price: v.optional(v.number()),
    startPrice: v.optional(v.number()),
    categoryId: v.id("categories"),
    coverImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, name, description, url, type, isActive, rating, price, startPrice, categoryId, coverImage } = args;
    
    await ctx.db.patch(id, {
      name,
      description,
      url: url || "",
      type: type || "tool",
      isActive,
      rating: rating || 0,
      price: price || 0,
      startPrice,
      categoryId,
      coverImage: coverImage || "",
    });
    
    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("aiTools"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const calculatePriceFromStartPrice = mutation({
  args: {
    id: v.optional(v.id("aiTools")),
    startPrice: v.optional(v.number()),
    exchangeRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const exchangeRate = args.exchangeRate || 90;
    const commission = 750;
    
    if (args.id) {
      const tool = await ctx.db.get(args.id);
      if (!tool) {
        throw new Error(`AI Tool with ID ${args.id} not found`);
      }
      
      const startPrice = tool.startPrice || args.startPrice;
      
      if (startPrice) {
        const priceInRubles = Math.round(startPrice * exchangeRate + commission);
        
        await ctx.db.patch(args.id, { price: priceInRubles });
        
        return { 
          success: true, 
          id: args.id, 
          startPrice: startPrice, 
          price: priceInRubles 
        };
      } else {
        throw new Error("No startPrice available for calculation");
      }
    } 
    else if (args.startPrice) {
      const priceInRubles = Math.round(args.startPrice * exchangeRate + commission);
      
      return { 
        success: true, 
        startPrice: args.startPrice, 
        price: priceInRubles 
      };
    } else {
      throw new Error("Either id or startPrice must be provided");
    }
  },
});

// Добавляем новую мутацию для обновления цен всех существующих инструментов

export const updateAllPricesFromStartPrice = mutation({
  args: {
    exchangeRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const exchangeRate = args.exchangeRate || 90; // Курс по умолчанию
    const commission = 750; // Фиксированная комиссия
    
    // Получаем все инструменты, у которых есть startPrice
    const tools = await ctx.db
      .query("aiTools")
      .filter((q) => q.neq(q.field("startPrice"), undefined))
      .collect();
    
    const results = [];
    
    // Обновляем цену для каждого инструмента
    for (const tool of tools) {
      if (tool.startPrice) {
        const priceInRubles = Math.round(tool.startPrice * exchangeRate + commission);
        
        // Обновляем цену в базе данных
        await ctx.db.patch(tool._id, { price: priceInRubles });
        
        results.push({
          id: tool._id,
          name: tool.name,
          startPrice: tool.startPrice,
          oldPrice: tool.price,
          newPrice: priceInRubles
        });
      }
    }
    
    return {
      success: true,
      updatedCount: results.length,
      details: results
    };
  },
});

// Запрос для получения статистики по использованию инструментов
export const getToolUsageStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Не авторизован");
    }
    
    // Получаем все инструменты
    const tools = await ctx.db.query("aiTools").collect();
    
    // Создаем статистику использования (в реальном приложении это должно быть из таблицы использований)
    const toolUsage = tools.map(tool => ({
      name: tool.name,
      usage: Math.floor(Math.random() * 70) + 10 // Генерируем случайные данные для примера
    }));
    
    return toolUsage;
  }
});

// Запрос для получения статистики по покупкам по месяцам
export const getPurchaseStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Не авторизован");
    }
    
    // В реальном приложении здесь должен быть запрос к таблице покупок
    // Для примера генерируем случайные данные
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    const purchaseData = months.map(name => ({
      name,
      purchases: Math.floor(Math.random() * 15) + 1
    }));
    
    return purchaseData;
  }
});

