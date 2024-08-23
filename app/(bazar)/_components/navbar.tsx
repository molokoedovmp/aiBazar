"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/(marketing)/_components/logo";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div className={cn(
      "z-50 fixed top-0 flex items-center justify-between w-full p-6 transition-all duration-300",
      scrolled ? "bg-background/75 dark:bg-[#1F1F1F]/75 h-12" : "bg-background dark:bg-[#1F1F1F] h-16",
      scrolled && "border-b shadow-sm"
    )}>
      <Logo />
      
      <nav className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documents">AI</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documents">Услуги</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documents">Сообщество</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documents">О нас</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documents">Контакты</Link>
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
      </div>
    </div>
  )
}
