import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aiGadgets").collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiGadgets")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
  },
});

export const addGadget = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    coverImage: v.optional(v.string()),
    features: v.array(v.string()),
    status: v.string(),
    category: v.string(),
    specifications: v.optional(v.object({
      dimensions: v.optional(v.string()),
      weight: v.optional(v.string()),
      battery: v.optional(v.string()),
      connectivity: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiGadgets", {
      ...args,
      createdAt: Date.now(),
    });
  },
}); 