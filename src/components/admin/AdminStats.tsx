'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Project } from '@/lib/supabase';

interface CategoryCount {
  category: string;
  count: number;
}

interface Stats {
  totalProjects: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentProjects: Project[];
  popularCategories: CategoryCount[];
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentProjects: [],
    popularCategories: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch total projects
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      // Fetch total users (if you have a users table)
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch recent projects
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch popular categories
      const { data: projects } = await supabase
        .from('projects')
        .select('category')

      const categoryCount = projects?.reduce((acc: Record<string, number>, project: { category: string }) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {}) || {};

      const popularCategories: CategoryCount[] = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalProjects: projectCount || 0,
        totalUsers: userCount || 0,
        totalOrders: 0, // You can implement this when you have an orders table
        totalRevenue: 0, // You can implement this when you have an orders table
        recentProjects: recentProjects || [],
        popularCategories
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Analytics & Statistics</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              IoT projects available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Revenue generated
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Latest projects added to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No projects yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">${project.price}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>
              Most popular project categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.popularCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No categories yet</p>
            ) : (
              <div className="space-y-4">
                {stats.popularCategories.map((category: CategoryCount, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{category.count} projects</span>
                      <Badge variant="secondary">{index + 1}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Future Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>
              Coming soon - Track your sales performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-gray-500">
              <TrendingUp className="w-8 h-8 mr-2" />
              <span>Sales charts coming soon</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>
              Coming soon - Monitor user activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-gray-500">
              <TrendingDown className="w-8 h-8 mr-2" />
              <span>Engagement metrics coming soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
