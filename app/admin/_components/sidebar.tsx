"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  BrainCircuit,
  FolderTree,
  Banknote,
  Briefcase,
  Cpu,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface SidebarProps {
  onLogout: () => void;
}

const routes = [
  { label: "Панель управления", icon: Home, href: "/admin" },
  { label: "Инструменты", icon: BrainCircuit, href: "/admin/tools" },
  { label: "Категории", icon: FolderTree, href: "/admin/categories" },
  { label: "Оплата инструментов", icon: Banknote, href: "/admin/payment" },
  { label: "Базариус", icon: Briefcase, href: "/admin/bazarius" },
  { label: "Настройки", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader>
        <h2 className="text-lg font-bold">Меню</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <SidebarMenuItem key={route.href}>
                <Link
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
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start text-sm font-medium gap-2"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 text-red-500" />
          {!isCollapsed && "Выйти"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}