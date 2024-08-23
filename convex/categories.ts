import { query } from "./_generated/server";
import { v } from "convex/values"; // Импорт валидатора

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
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
