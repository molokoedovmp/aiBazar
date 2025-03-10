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
    icon: v.string(),
    price: v.string(),
    url: v.optional(v.string()),
    features: v.array(v.string()),
  })
    .index("by_title", ["title"])
    .index("by_price", ["price"]),

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

  aibazargpt: defineTable({
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    coverImage: v.optional(v.string()),
    price: v.union(v.number(), v.literal("Бесплатно")),
    type: v.string(),
    status: v.string(),
    features: v.array(v.string()),
    previewUrl: v.optional(v.string()),
    details: v.object({
      overview: v.string(),
      capabilities: v.array(v.object({
        title: v.string(),
        description: v.string(),
        icon: v.optional(v.string()),
      })),
      requirements: v.array(v.string()),
      useCases: v.array(v.string()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_type", ["type"]),

  // Таблица для отслеживания доступа к инструментам aibazargpt
  aibazargptAccess: defineTable({
    userId: v.string(),
    toolId: v.id("aibazargpt"),
    accessType: v.string(), // "trial", "purchased"
    expiresAt: v.optional(v.number()),
    purchasedAt: v.number(),
    status: v.string(), // "active", "expired"
  }).index("by_user", ["userId"])
    .index("by_tool", ["toolId"])
    .index("by_user_and_tool", ["userId", "toolId"]),

  payments: defineTable({
    serviceId: v.id("aibazargpt"),
    amount: v.number(),
    status: v.string(), // "pending" | "completed" | "failed"
    userId: v.string(),
    createdAt: v.number(),
    serviceName: v.string(),
    serviceCover: v.string(),
  }).index("by_user", ["userId"]),

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
});
