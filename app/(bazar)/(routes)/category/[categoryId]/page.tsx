"use client";

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel"; // Импорт Id из Convex

// Компонент скелетона для карточек
function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function CategoryPage() {
  const { categoryId } = useParams(); // Получаем ID категории из URL
  const [searchTerm, setSearchTerm] = useState<string>(""); // Состояние для поиска
  const categories = useQuery(api.categories.get); // Получаем все категории
  const aiTools = useQuery(api.aiTools.get); // Получаем все инструменты

  // Преобразуем categoryId в Id<"categories">
  const categoryConvexId = categoryId as unknown as Id<"categories">;

  const currentCategory = categories?.find(category => category._id === categoryConvexId);
  const toolsInCategory = aiTools?.filter(tool => tool.categoryId === categoryConvexId) || [];

  // Фильтруем инструменты по поисковому запросу
  const filteredTools = toolsInCategory.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      {/* Поле поиска */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Искать AI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-full max-w-sm"
        />
      </div>

      {/* Вывод названия категории */}
      <h1 className="text-3xl font-bold mb-6">{currentCategory?.name || "Category Name"}</h1>

      {/* Вывод карточек с уменьшенным расстоянием */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(!categories || !aiTools) ? (
          // Показать скелетоны, пока данные загружаются
          Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          filteredTools.map((tool) => (
            <Card key={tool._id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={tool.coverImage || "/default.png"}
                  alt={tool.name}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="flex w-full space-x-2">
                  <Button className="w-full" asChild size="sm">
                    <Link href={`/tool/${tool._id}`}>Купить</Link>
                  </Button>
                  <Button className="w-full" asChild size="sm" variant="outline">
                    <Link 
                      href={tool.url ?? "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Смотреть
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
