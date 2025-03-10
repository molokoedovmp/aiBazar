"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { id: "all", label: "Все" },
  { id: "smart_home", label: "Умный дом" },
  { id: "wearables", label: "Носимые устройства" },
  { id: "robots", label: "Роботы" },
  { id: "other", label: "Другое" },
];

export default function GadgetsPage() {
  const gadgets = useQuery(api.aiGadgets.get);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredGadgets = gadgets?.filter(
    (gadget) => selectedCategory === "all" || gadget.category === selectedCategory
  );

  if (!gadgets) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">AI Гаджеты</h1>
      
      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGadgets?.map((gadget) => (
          <Card key={gadget._id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={gadget.coverImage || "/placeholder.png"}
                alt={gadget.name}
                fill
                className="object-cover"
              />
              {gadget.status === "coming_soon" && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm">
                  Скоро в продаже
                </div>
              )}
              {gadget.status === "sold_out" && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                  Распродано
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{gadget.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {gadget.description}
              </p>
              <div className="text-lg font-bold mb-4">{gadget.price} ₽</div>
              <div className="space-y-2">
                {gadget.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {feature}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                className="w-full"
                disabled={gadget.status !== "available"}
                variant={gadget.status === "available" ? "default" : "secondary"}
              >
                {gadget.status === "available"
                  ? "Купить"
                  : gadget.status === "coming_soon"
                  ? "Скоро в продаже"
                  : "Нет в наличии"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 