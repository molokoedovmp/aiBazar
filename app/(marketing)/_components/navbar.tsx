"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Menu, X, ShoppingBag, Briefcase, Globe, Code } from "lucide-react";
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

const routes = [
  {
    label: 'Bazarius',
    href: '/aibazargpt',
  },
  {
    label: 'AI Гаджеты',
    href: '/gadgets',
  },
  {
    label: 'Сообщество',
    href: '/blog',
  },
  {
    label: 'О нас',
    href: '/about',
  },
];

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  
  // Получаем категории из базы данных
  const categories = useQuery(api.categories.get) || [];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 flex items-center justify-between p-6 text-white z-50 h-16 bg-black border-b border-white/20 shadow-sm"
    >
      <Logo />

      {/* Десктопное меню (скрыто на мобильных) */}
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            {/* Магазин нейросетей с выпадающим меню категорий */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-gray-300 bg-transparent hover:bg-transparent">
                Магазин Нейросетей
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {categories.map((category) => (
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
                                  stroke={theme === 'dark' ? 'white' : 'black'}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-full h-full"
                                  dangerouslySetInnerHTML={{ __html: atob(category.icon.split(',')[1]) }}
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

            {/* Выпадающее меню для "Услуги" */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-gray-300 bg-transparent hover:bg-transparent">
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

            {/* Остальные пункты меню */}
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "text-white hover:text-gray-300 bg-transparent hover:bg-transparent"
                  )}>
                    {route.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-x-2">
        {/* Переключатель темы */}


        {isLoading && <Spinner />}

        {/* Если не аутентифицирован - кнопка "Войти" */}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button
              size="sm"
              className="text-white bg-transparent border border-white hover:border-gray-300 hover:text-gray-300"
            >
              Войти
            </Button>
          </SignInButton>
          
        )}

        {/* Если аутентифицирован - кнопка на документы и иконка профиля */}
        {isAuthenticated && !isLoading && (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:text-gray-300"
            >
              <Link href="/documents">Войти</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}

        {/* Кнопка открытия мобильного меню (видна только на мобильных) */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white hover:text-gray-300"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Мобильное меню (видно только когда mobileMenuOpen === true) */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black flex flex-col items-start gap-2 p-4 md:hidden border-b border-gray-800">
          {/* Основные разделы */}
          <div className="w-full border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm">
              <ShoppingBag className="h-4 w-4" />
              <span>Магазин</span>
            </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
              className="text-white hover:text-gray-300 w-full justify-start pl-6"
          >
            <Link href="/bazar" onClick={toggleMobileMenu}>
                Все инструменты
            </Link>
          </Button>
            
            {categories.map((category) => (
          <Button
                key={category._id}
            variant="ghost"
            size="sm"
            asChild
                className="text-white hover:text-gray-300 w-full justify-start pl-6"
              >
                <Link 
                  href={`/category/${category._id}`} 
                  onClick={toggleMobileMenu}
                  className="flex items-center gap-2"
                >
                  {category.icon && (
                    <div className="h-4 w-4 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={theme === 'dark' ? 'white' : 'black'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: atob(category.icon.split(',')[1]) }}
                      />
                    </div>
                  )}
                  <span>{category.name}</span>
            </Link>
          </Button>
            ))}
          </div>
          
          {/* Услуги */}
          <div className="w-full border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm">
              <Briefcase className="h-4 w-4" />
              <span>Услуги</span>
            </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
              className="text-white hover:text-gray-300 w-full justify-start pl-6"
            >
              <Link href="/services/website" onClick={toggleMobileMenu}>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Создание сайтов</span>
                </div>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
              className="text-white hover:text-gray-300 w-full justify-start pl-6"
            >
              <Link href="/services" onClick={toggleMobileMenu}>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Все услуги</span>
                </div>
            </Link>
          </Button>
          </div>
          
          {/* Остальные пункты меню */}
          <div className="w-full">
            {routes.map((route) => (
          <Button
                key={route.href}
            variant="ghost"
            size="sm"
            asChild
                className="text-white hover:text-gray-300 w-full justify-start"
          >
                <Link href={route.href} onClick={toggleMobileMenu}>
                  {route.label}
            </Link>
          </Button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
