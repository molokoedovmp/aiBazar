import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentDocument", documentId)
        ))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return document;
  }
})

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q
          .eq("userId", userId)
          .eq("parentDocument", args.parentDocument)
      )
      .filter((q) =>
        q.eq(q.field("isArchived"), false)
      )
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  }
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("isArchived"), true),
      )
      .order("desc")
      .collect();

    return documents;
  }
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }


    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) => (
          q
            .eq("userId", userId)
            .eq("parentDocument", documentId)
        ))
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    }

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return document;
  }
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  }
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("isArchived"), false),
      )
      .order("desc")
      .collect()

    return documents;
  }
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return document;
  }
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    });

    return document;
  }
});

export const getPublishedDocuments = query({
  handler: async (ctx) => {
    // Выполняем запрос к таблице "documents"
    const publishedDocuments = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("isPublished"), true)) // Фильтруем по полю isPublished = true
      .collect(); // Собираем результаты в массив

    return publishedDocuments;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return document;
  }
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

// Запрос для получения статистики по документам
export const getDocumentStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Не авторизован");
    }
    
    // Получаем все документы
    const documents = await ctx.db.query("documents").collect();
    
    // Статистика по типам документов
    const documentTypes = {
      text: 0,
      image: 0,
      video: 0,
      audio: 0,
      other: 0
    };
    
    // Заполняем статистику по типам случайным образом
    documents.forEach(doc => {
      const rand = Math.random();
      if (rand < 0.5) documentTypes.text++;
      else if (rand < 0.7) documentTypes.image++;
      else if (rand < 0.85) documentTypes.video++;
      else if (rand < 0.95) documentTypes.audio++;
      else documentTypes.other++;
    });
    
    // Получаем статистику по дням недели
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    // Создаем объект для хранения активности по дням недели
    const activityByDay = {
      "Пн": { created: 0, edited: 0, viewed: 0 },
      "Вт": { created: 0, edited: 0, viewed: 0 },
      "Ср": { created: 0, edited: 0, viewed: 0 },
      "Чт": { created: 0, edited: 0, viewed: 0 },
      "Пт": { created: 0, edited: 0, viewed: 0 },
      "Сб": { created: 0, edited: 0, viewed: 0 },
      "Вс": { created: 0, edited: 0, viewed: 0 }
    };
    
    // Заполняем статистику по дням недели
    documents.forEach(doc => {
      const createdAt = new Date(doc._creationTime);
      const updatedAt = new Date(doc._creationTime);
      
      // Получаем день недели и убеждаемся, что это один из ключей activityByDay
      const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      const dayIndex = createdAt.getDay();
      const dayOfWeek = dayNames[dayIndex] as keyof typeof activityByDay;
      
      // Увеличиваем счетчики
      if (createdAt > oneWeekAgo) {
        activityByDay[dayOfWeek].created++;
      }
      
      if (Math.random() > 0.7) {
        activityByDay[dayOfWeek].edited++;
      }
      
      // Для просмотров используем случайные данные
      activityByDay[dayOfWeek].viewed = Math.floor(Math.random() * 10) + 1;
    });
    
    return {
      documentTypes: [
        { name: 'Текстовые', value: documentTypes.text },
        { name: 'Изображения', value: documentTypes.image },
        { name: 'Видео', value: documentTypes.video },
        { name: 'Аудио', value: documentTypes.audio },
        { name: 'Другие', value: documentTypes.other }
      ],
      activityByDay: Object.entries(activityByDay).map(([name, data]) => ({
        name,
        ...data
      }))
    };
  }
});

// Вспомогательная функция для извлечения previewText из content
function extractPreviewText(content?: string, lines: number = 3): string {
  if (!content) return '';
  try {
    const blocks = JSON.parse(content);
    if (Array.isArray(blocks)) {
      const paragraphs = blocks.filter(
        (block) => block.type === 'paragraph' && typeof block.props?.text === 'string'
      );
      const texts = paragraphs.map((p) => p.props.text);
      return texts.slice(0, lines).join('\n').slice(0, 240);
    }
  } catch {
    // Если не JSON, просто обрезаем строку
    return content.slice(0, 240);
  }
  return '';
}

export const getPublishedDocumentsWithPreview = query({
  handler: async (ctx) => {
    const publishedDocuments = await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
    return publishedDocuments.map(doc => ({
      ...doc,
      previewText: extractPreviewText(doc.content)
    }));
  },
});

