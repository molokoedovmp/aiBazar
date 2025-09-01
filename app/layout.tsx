import { Toaster } from "sonner";
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Analytics } from "@vercel/analytics/react"

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
  },
  // Добавлены Open Graph метатеги
  openGraph: {
    title: 'aiBazar',
    description: 'aiBazar - это сервис, который предоставляет доступ к различным AI-инструментам и сервисам.',
    url: 'https://aibazar.com', // Замените на ваш реальный URL
    siteName: 'aiBazar',
    images: [
      {
        url: 'https://aibazar.com/og-image.jpg', // Замените на путь к вашему изображению для превью
        width: 1200,
        height: 630,
        alt: 'aiBazar Preview',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  // Добавлены Twitter Card метатеги
  twitter: {
    card: 'summary_large_image',
    title: 'aiBazar',
    description: 'aiBazar - это сервис, который предоставляет доступ к различным AI-инструментам и сервисам.',
    images: ['https://aibazar.com/twitter-image.jpg'], // Замените на путь к вашему изображению для Twitter
  },
  // Добавлен canonical URL
  alternates: {
    canonical: 'https://aibazar.com', // Замените на ваш реальный URL
  },
  // Добавлены дополнительные важные метатеги
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token', // Замените на ваш токен верификации Google
    yandex: '31f9fbf9bddca189',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="HF0qat6HUMU9JgjhU408NBRBYEiZKuX-wSm91x24W0g" />
        <meta name="yandex-verification" content="31f9fbf9bddca189" />
        {/* JSON-LD разметка для поисковых систем */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://aibazar.com/",
                "name": "aiBazar",
                "description": "aiBazar - это сервис, который предоставляет доступ к различным AI-инструментам и сервисам.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://aibazar.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            `
          }}
        />
        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(100407501, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true
              });
            `
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/100407501" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}
        
        {/* Top.Mail.Ru counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var _tmr = window._tmr || (window._tmr = []);
              _tmr.push({id: "3625705", type: "pageView", start: (new Date()).getTime()});
              (function (d, w, id) {
                if (d.getElementById(id)) return;
                var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
                ts.src = "https://top-fwz1.mail.ru/js/code.js";
                var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
                if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
              })(document, window, "tmr-code");
            `
          }}
        />
        <noscript>
          <div>
            <img src="https://top-fwz1.mail.ru/counter?id=3625705;js=na" style={{ position: 'absolute', left: '-9999px' }} alt="Top.Mail.Ru" />
          </div>
        </noscript>
        {/* /Top.Mail.Ru counter */}
        
        {/* Favicon для всех устройств */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`bg-black ${inter.className}`}>
        <EdgeStoreProvider>
          <ConvexClientProvider>
            
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
              <Analytics />

          </ConvexClientProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  )
}