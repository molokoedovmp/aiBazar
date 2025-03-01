'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icon } from '@iconify/react'

export default function MenuBar() {
  const router = useRouter()
  const categories = useQuery(api.categories.get)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="h-full hidden xl:block w-48">
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r h-full w-48">
        <div className="p-2">
          <ScrollArea className="h-[calc(100vh-1rem)]">
            <div className="flex flex-col gap-1 pr-2">
              {categories?.map((category) => (
                <Button
                  key={category._id}
                  onClick={() => router.push(`/category/${category._id}`)}
                  variant="ghost"
                  className="w-full justify-start text-sm text-muted-foreground hover:text-primary px-2 py-1.5 truncate"
                  aria-label={`Go to ${category.name} category`}
                >
                  {category.icon && (
                    <div className="mr-2 h-4 w-4 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={theme === 'dark' ? 'white' : 'black'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: atob(category.icon.split(',')[1]) }}
                      />
                    </div>
                  )}
                  <span className="truncate">{category.name}</span>
                </Button>
              ))}
              
              <Button
                onClick={() => router.push('/bazar')}
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-primary px-2 py-1.5 mt-1"
              >
                <span>Все категории</span>
              </Button>
            </div>
          </ScrollArea>
        </div>
      </nav>
    </div>
  )
}
