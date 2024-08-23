import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    categoryId: v.id("categories"),  // Ссылка на категорию
  })
    .index("by_category", ["categoryId"]),
  // Таблица для хранения избранного
  favorites: defineTable({
    userId: v.string(),               // ID пользователя, которому принадлежит избранное
    itemId: v.union(v.id("aiTools"), v.id("documents")), // ID элемента (инструмента или поста)
    itemType: v.string(),             // Тип элемента ("aiTool" или "document")
  })
    .index("by_user", ["userId"])
    .index("by_user_item", ["userId", "itemId"]),
    // Новая таблица для хранения сообщений от формы обратной связи
  feedbackMessages: defineTable({
    name: v.string(),            // Имя отправителя
    email: v.string(),           // Email отправителя
    message: v.string(),         // Текст сообщения
  })
    .index("by_email", ["email"]), // Индекс для быстрого поиска по email
});
