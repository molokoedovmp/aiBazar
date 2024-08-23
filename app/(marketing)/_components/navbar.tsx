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
import { Menu, X } from "lucide-react"; // Импортируем иконки для бургер-меню

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Состояние для управления мобильным меню

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 flex items-center justify-between p-6 transition-all duration-300",
      scrolled ? "bg-background/75 dark:bg-[#1F1F1F]/75 h-12" : "bg-background dark:bg-[#1F1F1F] h-16",
      scrolled && "border-b shadow-sm",
      "z-50"
    )}>
      <Logo />

      <nav className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/bazar">AI</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/services">Услуги</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog">Сообщество</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/about">О нас</Link>
        </Button>
      </nav>

      <div className="flex items-center gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button size="sm">Войти</Button>
          </SignInButton>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Войти в чат</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        <ModeToggle />

        {/* Кнопка для открытия бургер-меню на мобильных устройствах */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background dark:bg-[#1F1F1F] flex flex-col items-center gap-2 p-4 md:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" onClick={toggleMobileMenu}>Главная</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/bazar" onClick={toggleMobileMenu}>AI</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/services" onClick={toggleMobileMenu}>Услуги</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog" onClick={toggleMobileMenu}>Сообщество</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about" onClick={toggleMobileMenu}>О нас</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
