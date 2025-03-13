"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu as MenuIcon,
  X as XIcon,
  PieChart,
  BrainCircuit,
  FolderTree,
  Banknote,
  Briefcase,
  Cpu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onLogout: () => void;
}

const routes = [
  { label: "Панель управления", icon: PieChart, href: "/admin" },
  { label: "Инструменты", icon: BrainCircuit, href: "/admin/tools" },
  { label: "Категории", icon: FolderTree, href: "/admin/categories" },
  { label: "Оплата инструментов", icon: Banknote, href: "/admin/payment" },
  { label: "Базариус", icon: Briefcase, href: "/admin/bazarius" },
  { label: "Гаджеты", icon: Cpu, href: "/admin/gadgets" },
  { label: "Пользователи", icon: User, href: "/admin/users" },
  { label: "Настройки", icon: Settings, href: "/admin/settings" },
];

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Боковая панель (Десктоп) */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen border-r transition-all duration-300",
          "bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Шапка Sidebar */}
        <div className="p-4 border-b dark:border-neutral-800 border-gray-200 flex items-center justify-between">
          {/* Поле поиска, скрывается при свернутом меню */}
          {!isCollapsed && (
            <input
              type="text"
              placeholder="Поиск..."
              className={cn(
                "w-full px-3 py-2 text-sm rounded-md",
                "bg-gray-100 text-gray-800 placeholder-gray-400",
                "dark:bg-neutral-800 dark:text-gray-100 dark:placeholder-gray-500",
                "focus:outline-none focus:ring-1 focus:ring-primary"
              )}
            />
          )}

          {/* Кнопка свернуть/развернуть меню */}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gray-200 text-gray-900 dark:bg-neutral-800 dark:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                )}
              >
                <route.icon className="h-5 w-5" />
                {!isCollapsed && <span>{route.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Кнопка выхода */}
        <div className="p-4 border-t dark:border-neutral-800 border-gray-200">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sm font-medium gap-2",
              "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              "dark:text-gray-400 dark:hover:text-white dark:hover:bg-neutral-800"
            )}
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 text-red-500" />
            {!isCollapsed && "Выйти"}
          </Button>
        </div>
      </div>

      {/* Боковая панель (Мобильная версия) */}
      <div className="md:hidden">
        {/* Кнопка открытия сайдбара */}
        <Button variant="ghost" size="icon" className="m-4" onClick={() => setShowMobileMenu(true)}>
          <MenuIcon className="h-6 w-6" />
        </Button>

        {/* Мобильное меню (выезжающее) */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity",
            showMobileMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setShowMobileMenu(false)}
        />

        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-neutral-900 border-r dark:border-neutral-800",
            "transition-transform duration-300 ease-in-out",
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Шапка с кнопкой закрытия */}
          <div className="p-4 border-b dark:border-neutral-800 border-gray-200 flex items-center justify-between">
            <span className="text-lg font-bold">Меню</span>
            <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)}>
              <XIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Навигация */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-200 text-gray-900 dark:bg-neutral-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  )}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <route.icon className="h-5 w-5" />
                  <span>{route.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Кнопка выхода */}
          <div className="p-4 border-t dark:border-neutral-800 border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium gap-2"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 text-red-500" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
