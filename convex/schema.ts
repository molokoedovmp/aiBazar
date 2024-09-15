import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { url } from "inspector";

export default defineSchema({
  // Таблица для хранения документов (постов)
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  
  // Таблица для хранения AI инструментов
  categories: defineTable({
    icon: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
  }),

  // Таблица инструментов
  aiTools: defineTable({
    name: v.string(),
    description: v.string(),
    coverImage: v.optional(v.string()),
    url: v.optional(v.string()),
    type: v.string(),
    isActive: v.boolean(),
    rating: v.optional(v.number()),
    categoryId: v.id("categories"),  // Ссылка на категорию
  })
    .index("by_category", ["categoryId"])  // Add this index
    .index("by_rating", ["rating"]), // Add this index
  // Таблица для хранения избранного
  // In your schema file
  favorites: defineTable({
    userId: v.string(),
    itemId: v.union(v.id("aiTools"), v.id("documents")),
    itemType: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_item", ["userId", "itemId"])
    .index("by_user_item_type", ["userId", "itemId", "itemType"]), // Add this new index
    
  feedbackMessages: defineTable({
    name: v.string(),            // Имя отправителя
    email: v.string(),           // Email отправителя
    message: v.string(),         // Текст сообщения
  })
    .index("by_email", ["email"]), // Индекс для быстрого поиска по email

    // Таблица для хранения отзывов
  reviews: defineTable({
    documentId: v.id("documents"),    // ID документа, к которому относится отзыв
    author: v.string(),               // Имя автора отзыва
    content: v.string(),              // Текст отзыва
    rating: v.number(),               // Рейтинг отзыва
  })
    .index("by_document", ["documentId"]),
  
  // New table for services
  services: defineTable({
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    price: v.string(),
    url: v.optional(v.string()),
    features: v.array(v.string()),
  })
    .index("by_title", ["title"])
    .index("by_price", ["price"]),
});
