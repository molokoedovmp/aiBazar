import { query} from "./_generated/server";
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

