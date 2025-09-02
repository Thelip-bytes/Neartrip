"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Globe, 
  MapPin, 
  Camera, 
  Heart, 
  Star, 
  TrendingUp,
  Award,
  Calendar,
  Plane
} from "lucide-react"

interface TravelStatisticsProps {
  stats?: {
    countriesVisited: number
    citiesVisited: number
    placesReviewed: number
    photosShared: number
    totalLikes: number
    totalFollowers: number
    travelDistance: number
    daysTraveled: number
    achievements: string[]
    currentStreak: number
    longestStreak: number
  }
}

const mockStats = {
  countriesVisited: 12,
  citiesVisited: 28,
  placesReviewed: 45,
  photosShared: 156,
  totalLikes: 2840,
  totalFollowers: 1240,
  travelDistance: 45000,
  daysTraveled: 86,
  achievements: ["Explorer", "Photographer", "Reviewer", "Social Butterfly"],
  currentStreak: 7,
  longestStreak: 23
}

const achievementIcons = {
  "Explorer": Globe,
  "Photographer": Camera,
  "Reviewer": Star,
  "Social Butterfly": Heart,
  "Globetrotter": Plane,
  "Local Guide": MapPin,
  "Trendsetter": TrendingUp,
  "Champion": Award
}

export function TravelStatistics({ stats = mockStats }: TravelStatisticsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(0)}k km`
    }
    return `${distance} km`
  }

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.countriesVisited}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Countries</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.citiesVisited}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cities</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Camera className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(stats.photosShared)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Photos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(stats.totalLikes)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Likes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Travel Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Travel Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Distance Traveled</span>
              <span className="font-medium">{formatDistance(stats.travelDistance)}</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Days Traveled</span>
              <span className="font-medium">{stats.daysTraveled} days</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Places Reviewed</span>
              <span className="font-medium">{stats.placesReviewed}</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Streak Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Travel Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.currentStreak}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.longestStreak}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.achievements.map((achievement) => {
              const Icon = achievementIcons[achievement as keyof typeof achievementIcons] || Award
              return (
                <Badge 
                  key={achievement} 
                  variant="secondary" 
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <Icon className="h-3 w-3" />
                  {achievement}
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}