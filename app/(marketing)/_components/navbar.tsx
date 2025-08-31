"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import {
  ShoppingBag,
  Briefcase,
  Globe,
  Code,
  Grid2X2,
  User,
  Users,
  Home,
} from "lucide-react";
import { api } from "@/convex/_generated/api";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const routes = [
  { label: "Главная", href: "/" },
  { label: "Bazarius", href: "/aibazargpt" },
  { label: "Сообщество", href: "/blog" },
  { label: "О нас", href: "/about" },
];

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { theme } = useTheme();

  // Категории из БД
  const categories = useQuery(api.categories.get) || [];

  return (
    <>
      {/* ВЕРХНЯЯ ПАНЕЛЬ — ТОЛЬКО ДЕСКТОП. Делаем absolute, чтобы ехала поверх контента */}
      <header className="hidden md:block absolute top-0 left-0 right-0 z-50 h-16 border-b border-white/15 bg-black/60 text-white backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Logo />

          {/* Десктопное меню */}
          <NavigationMenu>
            <NavigationMenuList>
              {/* Каталог нейросетей */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/5 hover:text-white">
                  Каталог Нейросетей
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category: any) => (
                      <li key={category._id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${category._id}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                          >
                            <div className="flex items-center gap-2">
                              {category.icon && (
                                <div className="h-4 w-4 flex-shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={theme === "dark" ? "white" : "black"}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-full w-full"
                                    dangerouslySetInnerHTML={{
                                      __html: atob(category.icon.split(",")[1] ?? ""),
                                    }}
                                  />
                                </div>
                              )}
                              <span className="text-sm font-medium leading-none">
                                {category.name}
                              </span>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                              {category.description || "Категория AI инструментов"}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/bazar"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            <span className="text-sm font-medium leading-none">
                              Все инструменты
                            </span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                            Просмотреть все доступные AI инструменты
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Услуги */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/5 hover:text-white">
                  Услуги
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/services/website"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="text-sm font-medium leading-none">Создание сайтов</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                            Разработка лендингов, корпоративных сайтов и интернет-магазинов
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/services"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-sm font-medium leading-none">Все услуги</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400">
                            Полный список наших услуг
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Остальные пункты */}
              {routes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link href={route.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent text-white hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {route.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Правый блок (десктоп) */}
          <div className="flex items-center gap-2">
            {isLoading && <Spinner />}
            {!isAuthenticated && !isLoading && (
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="border border-white/30 bg-transparent text-white hover:border-white/60 hover:text-white"
                >
                  Войти
                </Button>
              </SignInButton>
            )}
            {isAuthenticated && !isLoading && (
              <>
                <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80">
                  <Link href="/documents">Личный кабинет</Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>
        </div>
      </header>

      {/* НИЖНЯЯ МОБИЛЬНАЯ НАВИГАЦИЯ (мобайл) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] border-t border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="mx-auto grid max-w-7xl grid-cols-5 gap-1 px-2 py-1.5" role="navigation" aria-label="Нижняя навигация">
          {/* Главная */}
          <Link href="/" className="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-white/90 hover:bg-white/5">
            <Home className="h-5 w-5" />
            <span>Главная</span>
          </Link>

          {/* Каталог (BottomSheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-white/90 hover:bg-white/5">
                <Grid2X2 className="h-5 w-5" />
                <span>Каталог</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] border-white/10 bg-black text-white">
              <SheetHeader>
                <SheetTitle className="text-left">Каталог нейросетей</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-2 overflow-y-auto pb-24">
                <Link
                  href="/bazar"
                  className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-sm">Все инструменты</span>
                  </div>
                  <span className="text-xs text-white/50">Перейти</span>
                </Link>

                <div className="grid grid-cols-1 gap-2">
                  {categories.map((category: any) => (
                    <Link
                      key={category._id}
                      href={`/category/${category._id}`}
                      className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        {category.icon ? (
                          <div className="h-4 w-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={theme === "dark" ? "white" : "black"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-full w-full"
                              dangerouslySetInnerHTML={{
                                __html: atob(category.icon.split(",")[1] ?? ""),
                              }}
                            />
                          </div>
                        ) : (
                          <Grid2X2 className="h-4 w-4" />
                        )}
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs text-white/50">Открыть</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Войти / Кабинет */}
          {!isAuthenticated ? (
            <SignInButton mode="modal">
              <button className="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-white/90 hover:bg-white/5">
                <User className="h-5 w-5" />
                <span>Войти</span>
              </button>
            </SignInButton>
          ) : (
            <Link href="/documents" className="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-white/90 hover:bg-white/5">
              <User className="h-5 w-5" />
              <span>Кабинет</span>
            </Link>
          )}

          {/* Сообщество */}
          <Link href="/blog" className="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-white/90 hover:bg-white/5">
            <Users className="h-5 w-5" />
            <span>Сообщество</span>
          </Link>

          {/* Bazarius */}
          <Link href="/aibazargpt" className="flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-white/90 hover:bg-white/5">
            <Code className="h-5 w-5" />
            <span>Bazarius</span>
          </Link>
        </div>
      </div>

      {/* Убираем глобальный верхний padding. Оставляем только нижний для мобайла */}
      <style jsx global>{`
        @media (max-width: 767px) {
          :root { --navbar-bottom-height: 60px; }
          body { padding-bottom: calc(var(--navbar-bottom-height) + env(safe-area-inset-bottom)); }
        }
      `}</style>
    </>
  );
};
