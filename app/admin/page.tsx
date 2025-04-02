"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { BarChart as BarChartIcon, DollarSign, ShoppingCart, Users, FileText, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Цвета для графиков
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Компонент для отображения загрузки графика
const ChartSkeleton = () => (
  <div className="h-80 flex items-center justify-center">
    <Skeleton className="h-full w-full" />
  </div>
);

export default function AdminPage() {
  // Получаем данные из Convex
  const aiTools = useQuery(api.aiTools.get);
  const documents = useQuery(api.documents.get);
  const documentStats = useQuery(api.documents.getDocumentStats);
  
  // Состояние для данных Vercel Analytics
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("7d"); // 24h, 7d, 30d
  
  // Вычисляем статистику по инструментам
  const totalTools = aiTools?.length || 0;
  const activeTools = aiTools?.filter(tool => tool.isActive).length || 0;
  const freeTools = aiTools?.filter(tool => !tool.price || tool.price === 0).length || 0;
  const paidTools = aiTools?.filter(tool => tool.price && tool.price > 0).length || 0;
  
  // Получаем данные для графиков
  const documentTypeData = documentStats?.documentTypes || [];
  const documentActivityData = documentStats?.activityByDay || [];
  
  // Получаем данные из Vercel Analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      
      try {
        const response = await fetch(`/api/analytics?timeframe=${analyticsTimeframe}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка при получении данных: ${response.status}`);
        }
        
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Ошибка при получении аналитики:", error);
        setAnalyticsError(error instanceof Error ? error.message : "Неизвестная ошибка");
      } finally {
        setAnalyticsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [analyticsTimeframe]);
  
  // Подготавливаем данные для графиков на основе реальных данных
  
  // Данные по ценам инструментов (для столбчатого графика)
  const toolPriceData = aiTools?.map(tool => ({
    name: tool.name,
    price: tool.price || 0
  })) || [];
  
  // Данные для круговой диаграммы инструментов
  const toolTypeData = [
    { name: 'Активные', value: activeTools },
    { name: 'Неактивные', value: totalTools - activeTools },
    { name: 'Бесплатные', value: freeTools },
    { name: 'Платные', value: paidTools },
  ];
  
  // Преобразуем данные аналитики для графиков
  const pageViewsData = analyticsData?.pageviews?.map((item: any) => ({
    name: new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    просмотры: item.value
  })) || [];
  
  const visitorsData = analyticsData?.visitors?.map((item: any) => ({
    name: new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    посетители: item.value
  })) || [];
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего инструментов
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTools}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные инструменты
            </CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTools}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Бесплатные инструменты
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{freeTools}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Платные инструменты
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidTools}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Vercel Analytics */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Vercel Analytics</h2>
          <div className="flex gap-2">
            <Button 
              variant={analyticsTimeframe === "24h" ? "default" : "outline"} 
              onClick={() => setAnalyticsTimeframe("24h")}
            >
              24 часа
            </Button>
            <Button 
              variant={analyticsTimeframe === "7d" ? "default" : "outline"} 
              onClick={() => setAnalyticsTimeframe("7d")}
            >
              7 дней
            </Button>
            <Button 
              variant={analyticsTimeframe === "30d" ? "default" : "outline"} 
              onClick={() => setAnalyticsTimeframe("30d")}
            >
              30 дней
            </Button>
          </div>
        </div>
        
        {analyticsLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Просмотры страниц</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartSkeleton />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Уникальные посетители</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartSkeleton />
              </CardContent>
            </Card>
          </div>
        ) : analyticsError ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">
                <p>Ошибка при загрузке данных аналитики:</p>
                <p>{analyticsError}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setAnalyticsTimeframe(analyticsTimeframe)}
                >
                  Попробовать снова
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Просмотры страниц</CardTitle>
                <LineChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {!pageViewsData.length ? (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Нет данных за выбранный период</p>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={pageViewsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="просмотры" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Уникальные посетители</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {!visitorsData.length ? (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Нет данных за выбранный период</p>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={visitorsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="посетители" 
                          stroke="#82ca9d" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Графики инструментов и документов */}
      <Tabs defaultValue="tools" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="tools">Инструменты</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tools">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Столбчатый график цен инструментов */}
            <Card>
              <CardHeader>
                <CardTitle>Цены инструментов</CardTitle>
              </CardHeader>
              <CardContent>
                {!toolPriceData.length ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={toolPriceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="price" 
                          fill="#82ca9d" 
                          name="Цена (руб.)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Круговой график типов инструментов */}
            <Card>
              <CardHeader>
                <CardTitle>Распределение инструментов</CardTitle>
              </CardHeader>
              <CardContent>
                {!toolTypeData.length ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={toolTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {toolTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="grid gap-6 md:grid-cols-2">
            {/* График активности документов */}
            <Card>
              <CardHeader>
                <CardTitle>Активность документов</CardTitle>
              </CardHeader>
              <CardContent>
                {!documentActivityData.length ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={documentActivityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="created" 
                          stackId="1"
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          name="Создано"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="edited" 
                          stackId="1"
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          name="Отредактировано"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="viewed" 
                          stackId="1"
                          stroke="#ffc658" 
                          fill="#ffc658" 
                          name="Просмотрено"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Круговой график типов документов */}
            <Card>
              <CardHeader>
                <CardTitle>Типы документов</CardTitle>
              </CardHeader>
              <CardContent>
                {!documentTypeData.length ? (
                  <ChartSkeleton />
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={documentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {documentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 