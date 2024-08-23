"use client"; // Убедитесь, что это первая строка в файле

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Id } from "@/convex/_generated/dataModel"; // Импорт Id из Convex

interface aiToolIdPageProps {
  params: {
    aiToolsId: Id<"aiTools">;
  };
}

const aiToolIdPage = ({
  params,
}: aiToolIdPageProps) => {
  
  if (!params.aiToolsId) {
    return <div>Tool ID is missing or invalid.</div>;
  }
  // Получаем данные о товаре по ID
  const tool = useQuery(api.aiTools.getById, {
    aiToolsId: params.aiToolsId,
  });

  if (!tool) {
    return <div>Loading...</div>; // Заглушка при загрузке данных
  }

  if (tool === null) {
    return <div>Not found</div>; // Если данные не найдены
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
      <div className="grid gap-4 md:gap-8">
        <div className="grid gap-4">
          <img
            src={tool.coverImage || "/default.png"}
            alt={tool.name}
            width={600}
            height={900}
            className="aspect-[2/3] object-cover border w-full rounded-lg overflow-hidden"
          />
          <div className="hidden md:flex gap-4 items-start">
            <button className="border hover:border-primary rounded-lg overflow-hidden transition-colors">
              <img
                src={tool.coverImage || "/default.png"}
                alt="Preview thumbnail"
                width={100}
                height={100}
                className="aspect-square object-cover"
              />
              <span className="sr-only">View Image</span>
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:gap-10 items-start">
        <div className="grid gap-4">
          <h1 className="font-bold text-3xl lg:text-4xl">{tool.name}</h1>
          <div>
            <p>{tool.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            </div>
            <div className="text-4xl font-bold">$99</div> {/* Замените цену на актуальную */}
          </div>
        </div>
        <form className="grid gap-4 md:gap-10">
          <Button size="lg" asChild>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">Go to Tool</a>
          </Button>
        </form>
        <Separator />
        <div className="grid gap-4 text-sm leading-loose">
          <h2 className="text-lg font-bold">Product Details</h2>
          <p>{tool.description}</p>
          <h2 className="text-lg font-bold">Specifications</h2>
          <ul className="list-disc pl-6">
            <li>Type: {tool.type}</li>
            <li>Status: {tool.isActive ? "Active" : "Inactive"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default aiToolIdPage;
