"use client"

import { useState, useEffect } from "react"
import { CreditCard, Package, Receipt, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type StatsData = {
  totalOrders: number
  totalSpent: number
  activeSubscription: {
    name: string
    price: number
    interval: string
    nextBillingDate: string
    status: string
    daysLeft: number
    percentLeft: number
    features: string[]
  } | null
  accountCreationDate: string
  chartData: { name: string; total: number }[]
  recentOrders: { id: string; amount: number; status: string; date: string; items: any[] }[]
}

export function DashboardSummaryCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard/stats')
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics")
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stats) {
    return (
      <Alert>
        <AlertDescription>No dashboard data available.</AlertDescription>
      </Alert>
    )
  }

  // Calculate last month's data
  const lastMonthData = stats.chartData && stats.chartData.length > 0
    ? stats.chartData[stats.chartData.length - 1].total
    : 0

  // Format the account creation date with error handling
  const memberSince = (() => {
    try {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        year: 'numeric'
      }).format(new Date(stats.accountCreationDate))
    } catch (error) {
      console.error('Error formatting account creation date:', error)
      return 'Unknown'
    }
  })()

  // Format next billing date if there's an active subscription
  const nextBillingDate = stats.activeSubscription ? (() => {
    try {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'long',
        day: 'numeric', 
        year: 'numeric' 
      }).format(new Date(stats.activeSubscription.nextBillingDate))
    } catch (error) {
      console.error('Error formatting next billing date:', error)
      return 'Unknown'
    }
  })() : 'N/A'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscription</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.activeSubscription ? (
            <>
              <div className="text-2xl font-bold">{stats.activeSubscription.name}</div>
              <p className="text-xs text-muted-foreground">Next billing: {nextBillingDate}</p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">No Active Plan</div>
              <p className="text-xs text-muted-foreground">Subscribe to get started</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.recentOrders?.length > 0 
              ? `+${stats.recentOrders.length} recent order${stats.recentOrders.length > 1 ? 's' : ''}`
              : "No recent orders"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</div>
          <p className="text-xs text-muted-foreground">
            {lastMonthData > 0 ? `+${formatPrice(lastMonthData)} last month` : "No spending last month"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Status</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Active</div>
          <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
        </CardContent>
      </Card>
    </div>
  )
} 