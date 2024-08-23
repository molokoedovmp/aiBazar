import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
// Мутация для добавления сообщения обратной связи


export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("feedbackMessages", {
      name: args.name,
      email: args.email,
      message: args.message,
    });

    return document;
  }
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feedbackMessages").collect();
  },
});
