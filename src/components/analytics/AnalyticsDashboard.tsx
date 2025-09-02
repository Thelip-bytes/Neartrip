"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Clock,
  Globe,
  Smartphone,
  Camera,
  Star,
  Filter,
  Download
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  overview: {
    totalViews: number
    totalLikes: number
    totalComments: number
    totalShares: number
    followersGrowth: number
    engagementRate: number
  }
  posts: {
    total: number
    topPerforming: Array<{
      id: string
      title: string
      views: number
      likes: number
      comments: number
      shares: number
      engagement: number
    }>
  }
  audience: {
    demographics: {
      ageGroups: Array<{ range: string; percentage: number }>
      genders: Array<{ gender: string; percentage: number }>
      locations: Array<{ location: string; percentage: number }>
    }
    devices: Array<{ device: string; percentage: number }>
    times: Array<{ hour: number; views: number }>
  }
  content: {
    categories: Array<{ category: string; posts: number; engagement: number }>
    hashtags: Array<{ tag: string; uses: number; reach: number }>
  }
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [isLoading, setIsLoading] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 125420,
          totalLikes: 8750,
          totalComments: 1240,
          totalShares: 890,
          followersGrowth: 12.5,
          engagementRate: 6.8
        },
        posts: {
          total: 24,
          topPerforming: [
            {
              id: "1",
              title: "Sunset at Golden Gate Bridge",
              views: 15420,
              likes: 890,
              comments: 124,
              shares: 45,
              engagement: 6.7
            },
            {
              id: "2",
              title: "Coffee with a view in Tokyo",
              views: 12350,
              likes: 756,
              comments: 89,
              shares: 34,
              engagement: 7.1
            },
            {
              id: "3",
              title: "Hidden gems in Santorini",
              views: 9870,
              likes: 645,
              comments: 67,
              shares: 28,
              engagement: 7.5
            }
          ]
        },
        audience: {
          demographics: {
            ageGroups: [
              { range: "18-24", percentage: 25 },
              { range: "25-34", percentage: 35 },
              { range: "35-44", percentage: 20 },
              { range: "45-54", percentage: 12 },
              { range: "55+", percentage: 8 }
            ],
            genders: [
              { gender: "Female", percentage: 58 },
              { gender: "Male", percentage: 40 },
              { gender: "Other", percentage: 2 }
            ],
            locations: [
              { location: "United States", percentage: 35 },
              { location: "United Kingdom", percentage: 15 },
              { location: "Canada", percentage: 10 },
              { location: "Australia", percentage: 8 },
              { location: "Germany", percentage: 7 },
              { location: "Other", percentage: 25 }
            ]
          },
          devices: [
            { device: "Mobile", percentage: 68 },
            { device: "Desktop", percentage: 25 },
            { device: "Tablet", percentage: 7 }
          ],
          times: [
            { hour: 9, views: 1200 },
            { hour: 12, views: 2100 },
            { hour: 15, views: 1800 },
            { hour: 18, views: 2400 },
            { hour: 21, views: 1600 }
          ]
        },
        content: {
          categories: [
            { category: "Nature", posts: 8, engagement: 7.2 },
            { category: "City Spots", posts: 6, engagement: 6.8 },
            { category: "Food & Drink", posts: 4, engagement: 8.1 },
            { category: "Beaches", posts: 3, engagement: 7.5 },
            { category: "Mountains", posts: 3, engagement: 6.9 }
          ],
          hashtags: [
            { tag: "#TravelPhotography", uses: 15420, reach: 89200 },
            { tag: "#SunsetLovers", uses: 8930, reach: 56700 },
            { tag: "#HiddenGems", uses: 6750, reach: 43200 },
            { tag: "#FoodAdventures", uses: 5420, reach: 38900 },
            { tag: "#MountainViews", uses: 4890, reach: 35600 }
          ]
        }
      }
      
      setAnalytics(mockData)
    } catch (error) {
      toast({
        title: "Failed to load analytics",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getEngagementColor = (rate: number): string => {
    if (rate >= 8) return 'text-green-500'
    if (rate >= 5) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getGrowthColor = (growth: number): string => {
    if (growth >= 10) return 'text-green-500'
    if (growth >= 0) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (isLoading || !analytics) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your performance and grow your audience
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range as any)}
                className="h-8 px-3"
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Views</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.overview.totalViews)}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12.5%</span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Likes</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.overview.totalLikes)}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8.3%</span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Engagement Rate</p>
                <p className={`text-2xl font-bold ${getEngagementColor(analytics.overview.engagementRate)}`}>
                  {analytics.overview.engagementRate}%
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+2.1%</span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">New Followers</p>
                <p className="text-2xl font-bold">+{formatNumber(Math.round(analytics.overview.totalViews * 0.0125))}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className={getGrowthColor(analytics.overview.followersGrowth)}>
                    {analytics.overview.followersGrowth > 0 ? '+' : ''}{analytics.overview.followersGrowth}%
                  </span>
                  <span className="text-gray-500">growth rate</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Top Performing Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.posts.topPerforming.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatNumber(post.views)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {formatNumber(post.likes)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {formatNumber(post.comments)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {formatNumber(post.shares)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getEngagementColor(post.engagement)}`}>
                    {post.engagement}%
                  </div>
                  <div className="text-sm text-gray-500">Engagement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Age Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.audience.demographics.ageGroups.map((group) => (
                <div key={group.range} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{group.range}</span>
                    <span>{group.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${group.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.audience.devices.map((device) => (
                <div key={device.device} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{device.device}</span>
                    <span>{device.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Content Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.content.categories.map((category) => (
                <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{category.category}</h4>
                    <p className="text-sm text-gray-500">{category.posts} posts</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getEngagementColor(category.engagement)}`}>
                      {category.engagement}%
                    </div>
                    <div className="text-sm text-gray-500">Engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Hashtags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Hashtags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.content.hashtags.map((hashtag) => (
                <div key={hashtag.tag} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{hashtag.tag}</h4>
                    <p className="text-sm text-gray-500">{formatNumber(hashtag.uses)} uses</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatNumber(hashtag.reach)}</div>
                    <div className="text-sm text-gray-500">Reach</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {analytics.audience.demographics.locations.map((location) => (
              <div key={location.location} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {location.percentage}%
                </div>
                <div className="text-sm text-gray-600">{location.location}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Best Time to Post</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                6:00 PM - 9:00 PM shows highest engagement rates
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">Top Category</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Food & Drink content performs 18% better than average
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900 dark:text-purple-100">Audience</span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                68% of your audience engages from mobile devices
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}