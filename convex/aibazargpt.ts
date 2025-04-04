import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Получить все инструменты
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("aibazargpt").collect();
  },
});

// Получить инструмент по ID
export const getById = query({
  args: { id: v.id("aibazargpt") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Создать новый инструмент
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    coverImage: v.optional(v.string()),
    price: v.union(v.number(), v.literal("Бесплатно")),
    type: v.string(),
    status: v.string(),
    features: v.array(v.string()),
    previewUrl: v.optional(v.string()),
    details: v.object({
      overview: v.string(),
      capabilities: v.array(v.object({
        title: v.string(),
        description: v.string(),
        icon: v.optional(v.string()),
      })),
      requirements: v.array(v.string()),
      useCases: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const toolId = await ctx.db.insert("aibazargpt", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return toolId;
  },
});

// Обновить инструмент
export const update = mutation({
  args: {
    id: v.id("aibazargpt"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    price: v.optional(v.union(v.number(), v.literal("Бесплатно"))),
    status: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    previewUrl: v.optional(v.string()),
    type: v.optional(v.string()),
    details: v.optional(v.object({
      overview: v.string(),
      capabilities: v.array(v.object({
        title: v.string(),
        description: v.string(),
        icon: v.optional(v.string()),
      })),
      requirements: v.array(v.string()),
      useCases: v.array(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

// Удалить инструмент
export const remove = mutation({
  args: { id: v.id("aibazargpt") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Проверить доступ пользователя к инструменту
export const checkAccess = query({
  args: { 
    userId: v.string(),
    toolId: v.id("aibazargpt"),
  },
  handler: async (ctx, args) => {
    const access = await ctx.db
      .query("aibazargptAccess")
      .withIndex("by_user_and_tool", (q) => 
        q.eq("userId", args.userId).eq("toolId", args.toolId)
      )
      .first();

    if (!access) return false;
    
    if (access.status !== "active") return false;
    if (access.expiresAt && access.expiresAt < Date.now()) {
      return false;
    }

    return true;
  },
});

// Предоставить доступ к инструменту
export const grantAccess = mutation({
  args: {
    userId: v.string(),
    toolId: v.id("aibazargpt"),
    accessType: v.string(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aibazargptAccess", {
      userId: args.userId,
      toolId: args.toolId,
      accessType: args.accessType,
      expiresAt: args.expiresAt,
      purchasedAt: Date.now(),
      status: "active",
    });
  },
}); 