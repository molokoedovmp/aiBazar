"use client"

import { useAuth, useUser } from "@clerk/clerk-react"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/admin/_components/sidebar"

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
    // Проверяем localStorage только на клиенте
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem("adminToken")
      if (adminToken === "admin_authenticated") {
        setIsAdmin(true)
        setShowLoginForm(false)
      }
    }
  }, [])
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Проверяем учетные данные
    if (loginEmail === ADMIN_CREDENTIALS.email && loginPassword === ADMIN_CREDENTIALS.password) {
      // Сохраняем токен в localStorage только на клиенте
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
  
  // Если пользователь не администратор, показываем форму входа
  if (!isAdmin) {
    return (
      <body className="bodyadmin">
      <div className="flex items-center justify-center min-h-screen">
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
      </body>
    )
  }
  
  // Если пользователь администратор, показываем панель управления
  return (
    <SidebarProvider>
      <AdminSidebar onLogout={handleLogout} /> {/* Передаём проп onLogout */}
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
} 