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
    price: v.optional(v.number()),
    categoryId: v.id("categories"),
  })
    .index("by_category", ["categoryId"])
    .index("by_rating", ["rating"]),

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
  
  // Таблица сервисов
  services: defineTable({
    title: v.string(),
    description: v.string(),
    fullDescription: v.optional(v.string()),
    price: v.optional(v.number()),
    image: v.optional(v.string()),
    features: v.array(v.string()),
    articleUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  })
    .index("by_title", ["title"]),

  // Новая таблица для корзины покупок
  cart: defineTable({
    userId: v.string(),
    toolId: v.id("aiTools"),
    quantity: v.number(),
    addedAt: v.number(), // timestamp
    status: v.string(), // например: 'in_cart', 'purchased', 'cancelled'
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  // Новая таблица для заказов
  orders: defineTable({
    userId: v.string(),
    items: v.array(v.object({
      toolId: v.id("aiTools"),
      quantity: v.number(),
      priceAtPurchase: v.number(),
    })),
    totalAmount: v.number(),
    status: v.string(), // например: 'pending', 'completed', 'failed'
    createdAt: v.number(),
    updatedAt: v.number(),
    paymentId: v.optional(v.string()), // для хранения ID платежа от платежной системы
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),
});
