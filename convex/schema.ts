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
    views: v.optional(v.number()),
    previewText: v.optional(v.string()),
    readTime: v.optional(v.number()),
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
    startPrice: v.optional(v.number()),
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
    name: v.string(),
    email: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
    userId: v.optional(v.string()),
    createdAt: v.optional(v.string()),
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
    icon: v.string(),
    price: v.string(),
    url: v.optional(v.string()),
    features: v.array(v.string()),
  })
    .index("by_title", ["title"])
    .index("by_price", ["price"]),


  aiToolsOrders: defineTable({
    userId: v.string(),
    serviceId: v.id("aiTools"),
    details: v.string(),
    contactInfo: v.string(),
    amount: v.number(),
    status: v.string(),
    createdAt: v.string(),
    serviceName: v.optional(v.string()),
    serviceCover: v.optional(v.string()),
  })
  .index("by_user", ["userId"])
  .index("by_status", ["status"]),

  aiGadgets: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    coverImage: v.optional(v.string()),
    features: v.array(v.string()),
    status: v.string(), // "available" | "coming_soon" | "sold_out"
    category: v.string(), // "smart_home" | "wearables" | "robots" | "other"
    specifications: v.optional(v.object({
      dimensions: v.optional(v.string()),
      weight: v.optional(v.string()),
      battery: v.optional(v.string()),
      connectivity: v.optional(v.string()),
    })),
    createdAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_status", ["status"]),

  // Добавьте в схему новую таблицу для кредитов пользователей
  userCredits: defineTable({
    userId: v.string(),
    totalCredits: v.number(),
    usedCredits: v.number(),
    lastReset: v.number(), // Timestamp последнего сброса
    plan: v.string(), // "free", "basic", "premium"
    expiresAt: v.optional(v.number()), // Timestamp истечения подписки
  })
    .index("by_user", ["userId"]),

  // Таблица для истории использования кредитов
  creditUsageHistory: defineTable({
    userId: v.string(),
    service: v.string(), // "ai-blog", "ai-search", etc.
    timestamp: v.number(),
    amount: v.number(), // Обычно 1, но может быть больше для сложных запросов
  })
    .index("by_user", ["userId"])
    .index("by_user_and_service", ["userId", "service"]),

  // Таблица для покупок кредитов
  creditPurchases: defineTable({
    userId: v.string(),
    amount: v.number(),
    price: v.number(),
    status: v.string(), // "pending", "completed", "failed"
    paymentId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

});
