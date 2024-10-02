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

  const CategoryList = () => (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-2 pr-4">
        {categories?.map((category) => (
          <Button
            key={category._id}
            onClick={() => {
              router.push(`/category/${category._id}`)
              if (isMobile) {
                setIsOpen(false)
              }
            }}
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-primary p-2" // Уменьшен padding
            aria-label={`Go to ${category.name} category`}
          >
            {category.icon && (
              <div className="mr-1 h-5 w-5 relative"> {/* Уменьшено расстояние справа */}
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
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex">
        {isMobile ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="lg:hidden fixed top-4 left-4 z-50">
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                Выбрать категорию
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <nav className="mt-4">
                <CategoryList />
              </nav>
            </DialogContent>
          </Dialog>
        ) : (
          <nav className="bg-muted/40 border-r p-2 hidden lg:block w-auto"> {/* Уменьшен padding */}
            <CategoryList />
          </nav>
        )}
      </div>
    </div>
  )
}
