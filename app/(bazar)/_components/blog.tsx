"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton"; // Импортируем Skeleton

const ITEMS_PER_PAGE = 10; // Количество элементов на странице

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState<number>(1); // Состояние для текущей страницы

  const documents = useQuery(api.documents.getPublishedDocuments);
  
  // Проверка, загружаются ли данные
  const isLoading = !documents; // Предположим, что данные загружаются, пока они не определены

  const filteredDocuments = documents
    ?.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime();
      } else {
        return new Date(a._creationTime).getTime() - new Date(b._creationTime).getTime();
      }
    });

  // Расчет количества страниц
  const totalPages = Math.ceil((filteredDocuments?.length || 0) / ITEMS_PER_PAGE);

  // Получение документов для текущей страницы
  const paginatedDocuments = filteredDocuments?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="flex justify-between items-center p-4">
          <Input
            placeholder="Искать в сообществе..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex space-x-4">
            <Button
              variant={sortOrder === "newest" ? "default" : "outline"}
              onClick={() => setSortOrder("newest")}
            >
              Новые
            </Button>
            <Button
              variant={sortOrder === "oldest" ? "default" : "outline"}
              onClick={() => setSortOrder("oldest")}
            >
              Старые
            </Button>
          </div>
        </div>

        <main className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                <Skeleton className="w-full h-48" />
                <div className="p-4 bg-background">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))
          ) : (
            paginatedDocuments?.map((doc) => (
              <Link
                key={doc._id}
                href={`/preview/${doc._id}`}
                className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2"
              >
                <img
                  src={doc.coverImage || "/default.png"}
                  alt={doc.title}
                  className="object-cover w-full h-48"
                />
                <div className="p-4 bg-background">
                  <h3 className="text-lg font-bold">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium line-clamp-1">
                      {new Date(doc._creationTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </main>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
