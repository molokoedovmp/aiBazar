import { Navbar } from "./_components/navbar";

export const metadata = {
  title: 'AI Bazar - Магазин нейросетей и AI-решений',
  description: 'Платформа для покупки и продажи AI-инструментов, нейросетей и сервисов искусственного интеллекта. Создание сайтов, разработка AI-решений и маркетинговые услуги.',
  keywords: 'AI, нейросети, искусственный интеллект, магазин нейросетей, AI-инструменты, создание сайтов, AI-решения',
};

const MarketingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <body className="bg-background min-h-screen">
      <div className="h-full dark:bg-[#1F1F1F]">
        <Navbar />
        <main>
          <head>
            {/* Структурированные данные для организации */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "AI Bazar",
                  "url": "https://aibazar.ru",
                  "logo": "https://aibazar.ru/logo-main.png",
                  "description": "Платформа для покупки и продажи AI-инструментов, нейросетей и сервисов искусственного интеллекта. Создание сайтов, разработка AI-решений и маркетинговые услуги.",
                  "foundingDate": "2024",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Москва",
                    "addressRegion": "Москва",
                    "addressCountry": "Россия"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "email": "info@aibazar.ru"
                  },
                  "sameAs": [
                    "https://t.me/aibazaru"
                  ]
                })
              }}
            />
          </head>
          {children}
        </main>
      </div>
    </body>
   );
}
 
export default MarketingLayout;