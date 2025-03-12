import { mutation, query } from "./_generated/server";
import { v } from "convex/values"; // Импорт валидатора

// Получение всех категорий
export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Создание новой категории
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { name, description, icon } = args;
    
    const categoryId = await ctx.db.insert("categories", {
      name,
      description: description || "",
      icon: icon || "",
    });
    
    return categoryId;
  },
});

// Обновление категории
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, name, description, icon } = args;
    
    await ctx.db.patch(id, {
      name,
      description: description || "",
      icon: icon || "",
    });
    
    return id;
  },
});

// Удаление категории
export const remove = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    
    // Проверяем, есть ли инструменты с этой категорией
    const toolsWithCategory = await ctx.db
      .query("aiTools")
      .withIndex("by_category", (q) => q.eq("categoryId", id))
      .collect();
    
    if (toolsWithCategory.length > 0) {
      throw new Error("Нельзя удалить категорию, которая используется в инструментах");
    }
    
    await ctx.db.delete(id);
    
    return id;
  },
});

export const getByCategory = query({
  args: { categoryId: v.string() },
  handler: async (ctx, { categoryId }) => {
    // Получаем все инструменты и фильтруем их по categoryId
    const allTools = await ctx.db.query("aiTools").collect();
    return allTools.filter(tool => tool.categoryId === categoryId);
  },
});
