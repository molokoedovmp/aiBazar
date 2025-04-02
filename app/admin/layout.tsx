"use client"

import { useAuth, useUser } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/admin/_components/sidebar"
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { ThemeToggle } from '@/components/theme-toggle'

// Учетные данные администратора
const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "Mishaboss228"
}

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId, isSignedIn } = useAuth()
  const { user } = useUser()
  
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [error, setError] = useState("")
  
  // Проверяем, авторизован ли пользователь как администратор
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem("adminToken")
      if (adminToken === "admin_authenticated") {
        setIsAdmin(true)
        setShowLoginForm(false)
      }
    }
  }, [])
  
  // Удаляем все стили, которые могли быть добавлены ранее
  useEffect(() => {
    const style = document.getElementById("admin-theme-style");
    if (style) {
      style.remove();
    }
  }, []);
  
  // Добавим стиль для компенсации отступа из globals.css
  useEffect(() => {
    const style = document.getElementById("admin-theme-style");
    if (style) {
      style.remove();
    }
    
    // Создаем новый стиль только для компенсации отступа
    const compensationStyle = document.createElement("style");
    compensationStyle.id = "admin-theme-style";
    compensationStyle.innerHTML = `
      .admin-layout-container {
        margin-top: -4rem; /* Компенсируем padding-top: 4rem из globals.css */
        min-height: calc(100vh + 4rem); /* Увеличиваем минимальную высоту */
      }
    `;
    document.head.appendChild(compensationStyle);
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loginEmail === ADMIN_CREDENTIALS.email && loginPassword === ADMIN_CREDENTIALS.password) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("adminToken", "admin_authenticated")
      }
      setIsAdmin(true)
      setShowLoginForm(false)
      setError("")
    } else {
      setError("Неверный логин или пароль")
    }
  }
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("adminToken")
    }
    setIsAdmin(false)
    setShowLoginForm(true)
  }
  
  if (!isAdmin) {
    return (
      <div className="admin-layout-container min-h-screen flex items-center justify-center bg-white dark:bg-[#121212]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Вход в панель администратора</CardTitle>
            <CardDescription>
              Введите учетные данные администратора для доступа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Пароль</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </div>
              <Button className="w-full mt-6" type="submit">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <SidebarProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="jotion-theme-2"
      >
        <div className="admin-layout-container h-screen flex w-full bg-white dark:bg-[#121212]">
          <AdminSidebar onLogout={handleLogout} />
          <div className="flex-1 w-full bg-white dark:bg-[#121212]">
            <div className="flex justify-between items-center p-2 border-b">
              <SidebarTrigger />
              <ThemeToggle />
            </div>
            <div className="h-[calc(100vh-41px)] overflow-y-auto overflow-x-hidden bg-white dark:bg-[#121212]">
              {children}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  );
}
