"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useDashboard } from "../hooks/useDashboard"
import { formatCurrency } from "../../../utils/formatCurrency"
import { 
  TrendingUp, 
  AlertTriangle, 
  AlertCircle, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  CreditCard 
} from "lucide-react"

export const DashboardContent = () => {
  const {
    totalRevenue,
    totalSales,
    totalInventory,
    totalPurchases,
    recentSells,
    monthlyRevenue,
    isLoading,
    isError
  } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        <p>Error loading dashboard data</p>
      </div>
    )
  }

  const calculateProgress = (value: number, total: number) => {
    return (value / total) * 100
  }

  return (
    <div className="space-y-6   dark:bg-gray-900">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Success Card */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg font-medium">Total Revenue</CardTitle>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalRevenue)}</div>
            <Progress 
              value={calculateProgress(totalRevenue, totalRevenue * 1.2)} 
              className="h-2 mt-2 bg-green-100 dark:bg-green-900"
            />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500 font-medium">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Warning Card */}
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg font-medium">Total Sales</CardTitle>
            </div>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{totalSales}</div>
            <Progress 
              value={calculateProgress(totalSales, totalSales * 1.3)} 
              className="h-2 mt-2 bg-yellow-100 dark:bg-yellow-900"
            />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-yellow-500 font-medium">+8.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Critical Card */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg font-medium">Inventory Value</CardTitle>
            </div>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalInventory)}</div>
            <Progress 
              value={calculateProgress(totalInventory, totalInventory * 1.4)} 
              className="h-2 mt-2 bg-red-100 dark:bg-red-900"
            />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-red-500 font-medium">-5.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <Card className="shadow-lg dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="url(#colorGradient)" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="shadow-lg dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentSells.map((sale) => (
                <div 
                  key={sale.id} 
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-700">
                    <AvatarImage src={sale.image || "/placeholder.svg"} alt={sale.name} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300">
                      {sale.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none dark:text-gray-200">{sale.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Units: {sale.Quantity} {sale.unit}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-blue-600 dark:text-blue-400">
                    {sale.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 