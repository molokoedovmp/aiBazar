"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";
import { useState } from "react";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Menu, X } from "lucide-react";

const routes = [
  {
    label: 'Главная',
    href: '/',
  },
  {
    label: 'О нас',
    href: '/about',
  },
  {
    label: 'Блог',
    href: '/blog',
  },
  {
    label: 'Сервисы',
    href: '/services',
  },
  {
    label: 'AI Гаджеты',
    href: '/gadgets',
  },
];

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        // Базовые стили
        "fixed top-0 left-0 right-0 flex items-center justify-between p-6 text-white z-50",
        // Меняем фон и высоту при скролле
        scrolled 
          ? "h-12 bg-black/75 backdrop-blur-sm" 
          : "h-16 bg-black",
        // Добавляем бордер при скролле
        scrolled && "border-b border-white/20 shadow-sm"
      )}
    >
      <Logo />

      {/* Десктопное меню (скрыто на мобильных) */}
      <nav className="hidden md:flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white hover:text-gray-300"
        >
          <Link href="/bazar">Магазин Нейросетей</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white hover:text-gray-300"
        >
          <Link href="/aibazargpt">Bazarius</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white hover:text-gray-300"
        >
          <Link href="/services">Услуги</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white hover:text-gray-300"
        >
          <Link href="/blog">Сообщество</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white hover:text-gray-300"
        >
          <Link href="/about">О нас</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-white hover:text-gray-300"
        >
          <Link href="/gadgets">AI Гаджеты</Link>
        </Button>
      </nav>

      <div className="flex items-center gap-x-2">
        {/* Переключатель темы (не влияет на цвет Navbar) */}
        <ModeToggle />

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
        <div className="absolute top-16 left-0 w-full bg-black flex flex-col items-center gap-2 p-4 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-gray-300"
          >
            <Link href="/" onClick={toggleMobileMenu}>
              Главная
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-gray-300"
          >
            <Link href="/bazar" onClick={toggleMobileMenu}>
              Магазин Нейросетей
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-gray-300"
          >
            <Link href="/aibazargpt" onClick={toggleMobileMenu}>
              Bazarius
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-gray-300"
          >
            <Link href="/services" onClick={toggleMobileMenu}>
              Услуги
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-gray-300"
          >
            <Link href="/blog" onClick={toggleMobileMenu}>
              Сообщество
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-gray-300"
          >
            <Link href="/about" onClick={toggleMobileMenu}>
              О нас
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-gray-300"
          >
            <Link href="/gadgets" onClick={toggleMobileMenu}>
              AI Гаджеты
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
};
