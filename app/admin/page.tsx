"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

// Цвета для графиков
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Компонент для отображения загрузки графика
const ChartSkeleton = () => (
  <div className="h-80 flex items-center justify-center">
    <Skeleton className="h-full w-full" />
  </div>
);

export default function AdminPage() {
  const router = useRouter();
  const aiTools = useQuery(api.aiTools.get);
  const documents = useQuery(api.documents.get);
  const documentStats = useQuery(api.documents.getDocumentStats);
  const orders = useQuery(api.aiToolsOrders.get);
  const categories = useQuery(api.categories.get);
  
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
  
  // Функция для форматирования даты
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ru });
  };
  
  // Функция для определения статуса заказа
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Выполнен</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">В обработке</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Отменен</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };
  
  // Подготовка данных для графика по месяцам
  const getMonthlyData = () => {
    if (!orders) return [];
    
    const monthlyData: { [key: string]: { month: string, count: number, revenue: number } } = {};
    const now = new Date();
    
    // Инициализируем данные за последние 6 месяцев
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('ru-RU', { month: 'short' });
      monthlyData[monthKey] = { month: monthName, count: 0, revenue: 0 };
    }
    
    // Заполняем данные из заказов
    orders.forEach(order => {
      const date = new Date(order._creationTime);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].count += 1;
        monthlyData[monthKey].revenue += order.amount;
      }
    });
    
    // Преобразуем объект в массив и сортируем по месяцам
    return Object.values(monthlyData).reverse();
  };
  
  // Подготовка данных для графика по статусам
  const getStatusData = () => {
    if (!orders) return [];
    
    const statusCounts: { [key: string]: number } = {
      completed: 0,
      pending: 0,
      failed: 0
    };
    
    orders.forEach(order => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status] += 1;
      }
    });
    
    return [
      { name: 'Выполнен', value: statusCounts.completed },
      { name: 'В обработке', value: statusCounts.pending },
      { name: 'Отменен', value: statusCounts.failed }
    ];
  };
  
  const monthlyData = getMonthlyData();
  const statusData = getStatusData();
  
  // Получаем последние 5 заказов
  const recentOrders = orders ? [...orders].sort((a, b) => b._creationTime - a._creationTime).slice(0, 5) : [];
  
  // Для документов - добавляем график по статусу публикации и наличию контента
  const getDocumentStatusData = () => {
    if (!documents) return [];
    
    const published = documents.filter(doc => doc.isPublished).length;
    const unpublished = documents.filter(doc => !doc.isPublished).length;
    const withContent = documents.filter(doc => doc.content && doc.content.trim().length > 0).length;
    const withoutContent = documents.filter(doc => !doc.content || doc.content.trim().length === 0).length;
    
    return [
      { name: 'Опубликованные', value: published },
      { name: 'Неопубликованные', value: unpublished },
      { name: 'С контентом', value: withContent },
      { name: 'Без контента', value: withoutContent }
    ];
  };

  // Для инструментов - добавляем график по категориям и использованию
  const getToolCategoryData = () => {
    if (!aiTools || !categories) return [];
    
    // Функция для получения названия категории по ID
    const getCategoryName = (categoryId: string) => {
      // Ищем категорию по ID в полученных данных
      const category = categories.find(cat => cat._id === categoryId);
      return category ? category.name : `Категория ${categoryId.substring(0, 8)}...`;
    };
    
    const categoryData: { [key: string]: number } = {};
    
    aiTools.forEach(tool => {
      const categoryId = tool.categoryId ? tool.categoryId : 'Без категории';
      const categoryName = getCategoryName(categoryId);
      
      if (categoryData[categoryName]) {
        categoryData[categoryName]++;
      } else {
        categoryData[categoryName] = 1;
      }
    });
    
    return Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  };

  // Для инструментов - добавляем график по популярности (на основе заказов)
  const getToolPopularityData = () => {
    if (!orders || !aiTools) return [];
    
    const toolCounts: { [key: string]: number } = {};
    
    orders.forEach(order => {
      if (toolCounts[order.serviceId]) {
        toolCounts[order.serviceId]++;
      } else {
        toolCounts[order.serviceId] = 1;
      }
    });
    
    // Получаем топ-5 популярных инструментов
    const topTools = Object.entries(toolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const tool = aiTools.find(t => t._id === id);
        return {
          name: tool ? tool.name : 'Неизвестный инструмент',
          value: count
        };
      });
    
    return topTools;
  };

  const documentStatusData = getDocumentStatusData();
  const toolCategoryData = getToolCategoryData();
  const toolPopularityData = getToolPopularityData();
  
  // Добавим функцию для подготовки данных о созданных документах по месяцам
  const getDocumentsByMonth = () => {
    if (!documents) return [];
    
    const monthlyData: { [key: string]: { month: string, count: number } } = {};
    const now = new Date();
    
    // Инициализируем данные за последние 6 месяцев
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('ru-RU', { month: 'short' });
      monthlyData[monthKey] = { month: monthName, count: 0 };
    }
    
    // Заполняем данные из документов
    documents.forEach(doc => {
      const date = new Date(doc._creationTime);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].count += 1;
      }
    });
    
    // Преобразуем объект в массив и сортируем по месяцам
    return Object.values(monthlyData).reverse();
  };

  const documentsByMonth = getDocumentsByMonth();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
      </div>
      
      {/* Секция с основными показателями */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Всего инструментов</p>
              <h3 className="text-2xl font-bold">{totalTools}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChartIcon className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Активные инструменты</p>
              <h3 className="text-2xl font-bold">{activeTools}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <BarChartIcon className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Всего документов</p>
              <h3 className="text-2xl font-bold">{documents?.length || 0}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Всего заказов</p>
              <h3 className="text-2xl font-bold">{orders?.length || 0}</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Секция с графиками заказов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Заказы по месяцам</CardTitle>
            <CardDescription>Количество и доход от заказов за последние 6 месяцев</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="count" name="Количество" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="revenue" name="Доход (₽)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Статусы заказов</CardTitle>
            <CardDescription>Распределение заказов по статусам</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" name="Количество заказов" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Секция с графиками документов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Статус документов</CardTitle>
            <CardDescription>Распределение документов по статусу и наличию контента</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={documentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {documentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Создание документов по месяцам</CardTitle>
            <CardDescription>Количество созданных документов за последние 6 месяцев</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={documentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Количество документов" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Секция с графиками инструментов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Категории инструментов</CardTitle>
            <CardDescription>Распределение инструментов по категориям</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={toolCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {toolCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Популярные инструменты</CardTitle>
            <CardDescription>Топ-5 самых заказываемых инструментов</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={toolPopularityData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" name="Количество заказов" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Секция с последними заказами */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>Недавние заказы инструментов</CardDescription>
          </div>
          <Button onClick={() => router.push('/admin/payment')}>
            Все заказы
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {order.serviceName || "Неизвестный инструмент"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {order._id.substring(0, 10)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order._creationTime)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(order.status)}
                      <p className="font-medium text-primary">
                        {order.amount} ₽
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">Нет заказов</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 