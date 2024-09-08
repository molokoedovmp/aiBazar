// File: convex/favorites.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggleFavorite = mutation({
  args: { 
    itemId: v.id("aiTools"), 
    itemType: v.literal("aiTool") 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const { itemId, itemType } = args;

    const existingFavorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_item_type", (q) => 
        q.eq("userId", userId)
         .eq("itemId", itemId)
         .eq("itemType", itemType)
      )
      .first();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
      return false; // Removed from favorites
    } else {
      await ctx.db.insert("favorites", { userId, itemId, itemType });
      return true; // Added to favorites
    }
  },
});

export const getByUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return []; // Return an empty array for unauthenticated users
    }

    const userId = identity.subject;

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return favorites;
  }
});