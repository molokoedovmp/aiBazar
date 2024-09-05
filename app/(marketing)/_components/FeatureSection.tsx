"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Tool {
  _id: string
  name: string
  description: string
  coverImage?: string
  categoryId: string
  url: string
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Skeleton className="w-full h-48 rounded-t-lg" />
      <CardContent className="p-4 flex-grow flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4 flex-grow" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export default function FeaturePage() {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const aiTools = useQuery(api.aiTools.get) as Tool[] | undefined

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const toolsToShow = aiTools?.slice(0, 4) || []

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-6">
        {!aiTools ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <SkeletonCard key={index} />
              ))}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {toolsToShow.map((tool) => (
                <Card key={tool._id} className="overflow-hidden flex flex-col h-full">
                  <CardContent className="p-0 flex-shrink-0">
                    <img
                      src={tool.coverImage || "/default.png?height=192&width=256"}
                      alt={tool.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardContent>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{tool.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex w-full space-x-2">
                      <Button className="w-full" asChild size="sm">
                        <Link href={`https://t.me/aiBazar1`}>Купить</Link>
                      </Button>
                      <Button className="w-full" asChild size="sm" variant="outline">
                        <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                          Смотреть
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/bazar"
                className="button-custom"
                prefetch={false}
              >
                Смотреть все
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// interface Tool {
//   _id: string;
//   name: string;
//   description: string;
//   coverImage?: string;
//   url: string;
// }

// function SkeletonCard() {
//   return (
//     <Card className="overflow-hidden">
//       <Skeleton className="w-full h-48 rounded-t-lg" />
//       <CardContent className="p-0">
//         <Skeleton className="h-6 w-3/4 mb-2" />
//         <Skeleton className="h-4 w-1/2 mb-4" />
//         <Skeleton className="h-10 w-full" />
//       </CardContent>
//     </Card>
//   );
// }

// export default function FeaturePage() {
//   const [searchTerm, setSearchTerm] = useState<string>(""); 
//   const [isMobile, setIsMobile] = useState<boolean>(false); 

//   const staticAiTools: Tool[] = [
//     {
//       _id: "1",
//       name: "Suno",
//       description: "Генерация музыки по текстовому запросу",
//       coverImage: "", // Убедитесь, что изображение доступно по этому пути
//       url: "https://openai.com",
//     },
//     {
//       _id: "2",
//       name: "Framer",
//       description: "Инструмент для создания и прототипирования интерфейсов",
//       coverImage: "",
//       url: "https://openai.com",
//     },
//     {
//       _id: "3",
//       name: "ChatGPT",
//       description: "Модель для создания диалогов на основе ИИ от OpenAI",
//       coverImage: "",
//       url: "https://chat.openai.com",
//     },
//     {
//       _id: "4",
//       name: "Midjourney",
//       description: "ИИ для генерации изображений из текста",
//       coverImage: "",
//       url: "https://openai.com/dall-e-2/",
//     },
//   ];

//   // Определяем, является ли устройство мобильным
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768); // Пороговое значение для мобильных устройств
//     };
    
//     handleResize();
//     window.addEventListener("resize", handleResize);
    
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const toolsToShow = staticAiTools.filter((tool) =>
//     tool.name.toLowerCase().includes(searchTerm.toLowerCase())
//   ).slice(0, 4);

//   return (
//     <div className="flex flex-col">
//       <main className="flex-1 p-6">
//         {!toolsToShow.length ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {Array(4)
//               .fill(0)
//               .map((_, index) => (
//                 <SkeletonCard key={index} />
//               ))}
//           </div>
//         ) : (
//           <div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
//               {toolsToShow.map((tool) => (
//                 <Card key={tool._id} className="overflow-hidden">
//                   <CardContent className="p-0">
//                     <img
//                       src={tool.coverImage || "/default.png"}
//                       alt={tool.name}
//                       className="w-full h-48 object-cover"
//                     />
//                   </CardContent>
//                   <CardFooter className="flex flex-col items-start p-4">
//                     <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
//                     <p className="text-gray-600 mb-4">{tool.description}</p>
//                     <div className="flex w-full space-x-2">
//                       <Button className="w-full" asChild size="sm">
//                         <Link href={`/tool/${tool._id}`}>Купить</Link>
//                       </Button>
//                       <Button className="w-full" asChild size="sm" variant="outline">
//                         <Link href={tool.url} target="_blank" rel="noopener noreferrer">
//                           Смотреть
//                         </Link>
//                       </Button>
//                     </div>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//             <div className="flex justify-center mt-8">
//               <Button asChild size="lg">
//                 <Link href="/bazar">Смотреть все</Link>
//               </Button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



// "use client";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// interface Tool {
//   _id: string;
//   name: string;
//   description: string;
//   coverImage?: string;
//   url: string;
// }

// function SkeletonCard() {
//   return (
//     <Card className="overflow-hidden">
//       <Skeleton className="w-full h-48 rounded-t-lg" />
//       <CardContent className="p-0">
//         <Skeleton className="h-6 w-3/4 mb-2" />
//         <Skeleton className="h-4 w-1/2 mb-4" />
//         <Skeleton className="h-10 w-full" />
//       </CardContent>
//     </Card>
//   );
// }

// export default function FeaturePage() {
//   const [searchTerm, setSearchTerm] = useState<string>(""); 
//   const [isMobile, setIsMobile] = useState<boolean>(false); // Состояние для определения мобильного устройства
//   const aiTools = useQuery(api.aiTools.get) as Tool[] | undefined;

//   // Определяем, является ли устройство мобильным
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768); // Пороговое значение для мобильных устройств
//     };
    
//     handleResize();
//     window.addEventListener("resize", handleResize);
    
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const toolsToShow = aiTools?.filter((tool) =>
//     tool.name.toLowerCase().includes(searchTerm.toLowerCase())
//   ).slice(0, 4) || [];

//   return (
//     <div className="flex flex-col">
//       <main className="flex-1 p-6">
//         {!aiTools ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {Array(4)
//               .fill(0)
//               .map((_, index) => (
//                 <SkeletonCard key={index} />
//               ))}
//           </div>
//         ) : (
//           <div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
//               {toolsToShow.map((tool) => (
//                 <Card key={tool._id} className="overflow-hidden">
//                   <CardContent className="p-0">
//                     <img
//                       src={tool.coverImage || "/default.png"}
//                       alt={tool.name}
//                       className="w-full h-48 object-cover"
//                     />
//                   </CardContent>
//                   <CardFooter className="flex flex-col items-start p-4">
//                     <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
//                     <p className="text-gray-600 mb-4">{tool.description}</p>
//                     <div className="flex w-full space-x-2">
//                       <Button className="w-full" asChild size="sm">
//                         <Link href={`/tool/${tool._id}`}>Купить</Link>
//                       </Button>
//                       <Button className="w-full" asChild size="sm" variant="outline">
//                         <Link href={tool.url} target="_blank" rel="noopener noreferrer">
//                           Смотреть
//                         </Link>
//                       </Button>
//                     </div>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//             <div className="flex justify-center mt-8">
//               <Button asChild size="lg">
//                 <Link href="/bazar">Смотреть все</Link>
//               </Button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
