import { query} from "./_generated/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
// Функция для получения всех инструментов
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});


export const createReview = mutation({
  args: {
    documentId: v.id("documents"),
    author: v.string(),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Вставка нового отзыва в таблицу "reviews"
    const review = await ctx.db.insert("reviews", {
      documentId: args.documentId,
      author: args.author,
      content: args.content,
      rating: args.rating,
    });

    return review;
  },

});


export const getByDocumentId = query({
  args: { documentId: v.string() },
  handler: async (ctx, { documentId }) => {
    // Получаем все инструменты и фильтруем их по categoryId
    const reviews = await ctx.db.query("reviews").collect();
    return reviews.filter(tool => tool.documentId === documentId);
  },
});
