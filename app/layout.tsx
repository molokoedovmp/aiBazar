import { Toaster } from "sonner";
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'aiBazar',
  description: 'aiBazar - это сервис, который предоставляет доступ к различным AI-инструментам и сервисам.',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo-main.ico",
        href: "/logo-main.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-main.ico",
        href: "/logo-main.ico",
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="yandex-verification" content="31f9fbf9bddca189" />
      <body className="bg-background min-h-screen">
        <EdgeStoreProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="jotion-theme-2"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  )
}
