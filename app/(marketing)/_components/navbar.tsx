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

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 flex items-center justify-between p-6 transition-all duration-300 text-white",
      scrolled ? "bg-black/75 h-12" : "bg-black h-16",
      scrolled && "border-b shadow-sm",
      "z-50"
    )}>
      <Logo />

      <nav className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="text-white hover:text-black/80">
          <Link href="/bazar">AI</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-white hover:text-black/80">
          <Link href="/services">Услуги</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-white hover:text-black/80">
          <Link href="/blog">Сообщество</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-white hover:text-black/80">
          <Link href="/about">О нас</Link>
        </Button>
      </nav>

      <div className="flex items-center gap-x-2">
        <ModeToggle />
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button size="sm" className="text-white bg-transparent border border-white hover:bg-white hover:text-black">Войти</Button>
          </SignInButton>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild className="text-white hover:text-black/80">
              <Link href="/documents">Войти</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white hover:text-white/80"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black flex flex-col items-center gap-2 p-4 md:hidden">
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80">
            <Link href="/" onClick={toggleMobileMenu}>Главная</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80">
            <Link href="/bazar" onClick={toggleMobileMenu}>AI</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80">
            <Link href="/services" onClick={toggleMobileMenu}>Услуги</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80">
            <Link href="/blog" onClick={toggleMobileMenu}>Сообщество</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80">
            <Link href="/about" onClick={toggleMobileMenu}>О нас</Link>
          </Button>
        </div>
      )}
    </header>
  );
}