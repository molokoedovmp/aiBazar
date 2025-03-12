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
    startPrice: v.optional(v.number()), // Добавляем новое поле
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiTools", {
      name: args.name,
      description: args.description,
      coverImage: args.coverImage,
      url: args.url,
      type: args.type,
      isActive: args.isActive,
      rating: args.rating,
      price: args.price,
      startPrice: args.startPrice, // Включаем новое поле
      categoryId: args.categoryId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("aiTools"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    url: v.optional(v.string()),
    type: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    price: v.optional(v.number()),
    startPrice: v.optional(v.number()), // Добавляем новое поле
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    
    // Получаем текущий документ
    const existingTool = await ctx.db.get(id);
    if (!existingTool) {
      throw new Error(`AI Tool with ID ${id} not found`);
    }
    
    // Обновляем только предоставленные поля
    return await ctx.db.patch(id, rest);
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

