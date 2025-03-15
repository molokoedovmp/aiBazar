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
  const [theme, setTheme] = useState("dark") // По умолчанию тёмная тема
  
  // Проверяем, авторизован ли пользователь как администратор
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem("adminToken")
      if (adminToken === "admin_authenticated") {
        setIsAdmin(true)
        setShowLoginForm(false)
      }
      
      // Проверяем текущую тему
      const currentTheme = localStorage.getItem("theme") || "dark"
      setTheme(currentTheme)
      
      // Добавляем слушатель для изменения темы
      const handleThemeChange = (e: Event) => {
        if (e instanceof CustomEvent && e.detail && e.detail.theme) {
          setTheme(e.detail.theme)
        }
      }
      
      window.addEventListener("themeChange", handleThemeChange)
      
      return () => {
        window.removeEventListener("themeChange", handleThemeChange)
      }
    }
  }, [])
  
  // Применяем глобальные стили для тёмной темы, а для светлой оставляем только отступы
  useEffect(() => {
    let style = document.getElementById("admin-theme-style") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "admin-theme-style";
      document.head.appendChild(style);
    }
    
    if (theme === "dark") {
      style.innerHTML = `
        html, body {
          overflow: hidden;
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #121212 !important;
        }
        
        #__next, main, [data-overlay-container="true"] {
          background-color: #121212 !important;
        }
        
        .admin-content {
          background-color: #121212 !important;
          color: white;
        }
        
        .admin-card {
          background-color: #1e1e1e !important;
          border: 1px solid #333;
          color: white;
        }
        
        .admin-main-container {
          height: 100vh;
          overflow: hidden;
          background-color: #121212 !important;
          width: 100%;
        }
        
        .admin-content-scrollable {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: #121212 !important;
          width: 100%;
        }
        
        body::after {
          content: "";
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          background-color: #121212 !important;
          z-index: -1;
        }
      `;
    } else {
      // Для светлой темы оставляем только сброс отступов
      style.innerHTML = `
        html, body {
          margin: 0;
          padding: 0;
        }
      `;
    }
  }, [theme]);
  
  // Функция для переключения темы
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme)
      window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme: newTheme } }))
    }
  }
  
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px] admin-card">
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
        <div className="admin-main-container flex w-full">
          <AdminSidebar onLogout={handleLogout} />
          <div className="flex-1 admin-content w-full">
            <div className="flex justify-between items-center p-2 border-b">
              <SidebarTrigger />
              <ThemeToggle />
            </div>
            <div className="admin-content-scrollable">
              {children}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  );
}
