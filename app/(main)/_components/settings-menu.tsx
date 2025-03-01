"use client"

import { useTheme } from "next-themes"
import { useClerk } from "@clerk/clerk-react"
import { User, Settings, Shield, LogOut, KeyRound } from "lucide-react"
import { Item } from "./item"
import { cn } from "@/lib/utils"

export const SettingsMenu = () => {
  const { setTheme } = useTheme()
  const { signOut } = useClerk()

  return (
    <div className="flex flex-col space-y-2">
      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold mb-2">Мой аккаунт</h2>
        <div className="space-y-1">
          <Item
            label="Редактировать профиль"
            icon={User}
            onClick={() => window.location.href = '/user-profile'}
          />
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold mb-2">Внешний вид</h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2">
            <span>Тема</span>
            <select 
              onChange={(e) => setTheme(e.target.value)}
              className="bg-transparent border rounded px-2 py-1"
            >
              <option value="light">Светлая</option>
              <option value="dark">Темная</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold mb-2">Уведомления</h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2">
            <span>Уведомления на почту</span>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold mb-2">Язык и регион</h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2">
            <span>Язык</span>
            <select 
              className="bg-transparent border rounded px-2 py-1"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold mb-2">Безопасность</h2>
        <div className="space-y-1">
          <Item
            label="Двухфакторная аутентификация"
            icon={Shield}
            onClick={() => {}}
          />
          <Item
            label="Изменить пароль"
            icon={KeyRound}
            onClick={() => {}}
          />
        </div>
      </div>

      <div className="px-3 py-2 border-t">
        <Item
          label="Выйти"
          icon={LogOut}
          onClick={() => signOut()}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        />
      </div>
    </div>
  )
} 