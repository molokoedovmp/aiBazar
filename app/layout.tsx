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
  description: 'aiBazar',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo.svg",
        href: "/logo.svg",
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
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}

// body {
//   padding-top: 4rem; /* Пример для высоты 4rem, измените по необходимости */
// }
