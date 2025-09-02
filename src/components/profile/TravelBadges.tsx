"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  Award, 
  Star, 
  MapPin, 
  Camera, 
  Heart, 
  TrendingUp,
  Globe,
  Plane,
  Users,
  Calendar,
  Crown,
  Sparkles
} from "lucide-react"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rarity: "common" | "rare" | "epic" | "legendary"
  progress: number
  maxProgress: number
  isUnlocked: boolean
  unlockedAt?: string
}

const mockBadges: Badge[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Create your first travel post",
    icon: "star",
    category: "Content",
    rarity: "common",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Explorer",
    description: "Visit 5 different countries",
    icon: "globe",
    category: "Travel",
    rarity: "rare",
    progress: 3,
    maxProgress: 5,
    isUnlocked: false
  },
  {
    id: "3",
    name: "Photographer",
    description: "Share 100 travel photos",
    icon: "camera",
    category: "Content",
    rarity: "rare",
    progress: 45,
    maxProgress: 100,
    isUnlocked: false
  },
  {
    id: "4",
    name: "Social Butterfly",
    description: "Get 1000 likes on your posts",
    icon: "heart",
    category: "Social",
    rarity: "epic",
    progress: 750,
    maxProgress: 1000,
    isUnlocked: false
  },
  {
    id: "5",
    name: "Globetrotter",
    description: "Visit 25 different cities",
    icon: "mapPin",
    category: "Travel",
    rarity: "epic",
    progress: 12,
    maxProgress: 25,
    isUnlocked: false
  },
  {
    id: "6",
    name: "Trendsetter",
    description: "Have 500 followers",
    icon: "trendingUp",
    category: "Social",
    rarity: "rare",
    progress: 280,
    maxProgress: 500,
    isUnlocked: false
  },
  {
    id: "7",
    name: "Local Guide",
    description: "Write 50 place reviews",
    icon: "star",
    category: "Content",
    rarity: "rare",
    progress: 23,
    maxProgress: 50,
    isUnlocked: false
  },
  {
    id: "8",
    name: "Travel Champion",
    description: "Complete all travel challenges",
    icon: "crown",
    category: "Achievement",
    rarity: "legendary",
    progress: 3,
    maxProgress: 10,
    isUnlocked: false
  },
  {
    id: "9",
    name: "Early Bird",
    description: "Join NeaTrip in the first month",
    icon: "calendar",
    category: "Special",
    rarity: "rare",
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: "2024-01-01"
  },
  {
    id: "10",
    name: "World Traveler",
    description: "Visit 10 different countries",
    icon: "plane",
    category: "Travel",
    rarity: "epic",
    progress: 8,
    maxProgress: 10,
    isUnlocked: false
  },
  {
    id: "11",
    name: "Community Star",
    description: "Get 1000 followers",
    icon: "users",
    category: "Social",
    rarity: "epic",
    progress: 620,
    maxProgress: 1000,
    isUnlocked: false
  },
  {
    id: "12",
    name: "Master Explorer",
    description: "Unlock all other badges",
    icon: "sparkles",
    category: "Achievement",
    rarity: "legendary",
    progress: 2,
    maxProgress: 11,
    isUnlocked: false
  }
]

const rarityColors = {
  common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  rare: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  epic: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  legendary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
}

const rarityBorders = {
  common: "border-gray-300 dark:border-gray-600",
  rare: "border-blue-400 dark:border-blue-600",
  epic: "border-purple-400 dark:border-purple-600",
  legendary: "border-yellow-400 dark:border-yellow-600"
}

const iconComponents = {
  star: Star,
  globe: Globe,
  camera: Camera,
  heart: Heart,
  trendingUp: TrendingUp,
  mapPin: MapPin,
  crown: Crown,
  calendar: Calendar,
  plane: Plane,
  users: Users,
  sparkles: Sparkles
}

export function TravelBadges() {
  const categories = ["All", "Travel", "Content", "Social", "Achievement", "Special"]
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  const filteredBadges = selectedCategory === "All" 
    ? mockBadges 
    : mockBadges.filter(badge => badge.category === selectedCategory)

  const unlockedCount = mockBadges.filter(badge => badge.isUnlocked).length
  const totalCount = mockBadges.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "👑"
      case "epic":
        return "💜"
      case "rare":
        return "💙"
      default:
        return "⚪"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Travel Badges & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {unlockedCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {completionPercentage}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Collection Progress</span>
              <span className="font-medium">{unlockedCount}/{totalCount}</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-8"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rarity Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Rarity Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-sm">Common</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              <span className="text-sm">Rare</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-400"></div>
              <span className="text-sm">Epic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-sm">Legendary</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const Icon = iconComponents[badge.icon as keyof typeof iconComponents] || Star
          const progressPercentage = Math.round((badge.progress / badge.maxProgress) * 100)
          
          return (
            <Card 
              key={badge.id} 
              className={`transition-all duration-200 hover:shadow-lg ${
                badge.isUnlocked 
                  ? `${rarityBorders[badge.rarity]} border-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900`
                  : 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                    ${badge.isUnlocked 
                      ? `${rarityColors[badge.rarity]} border-2 ${rarityBorders[badge.rarity]}`
                      : 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }
                  `}>
                    <Icon className={`h-6 w-6 ${
                      badge.isUnlocked 
                        ? 'text-foreground'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${
                        badge.isUnlocked 
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {badge.name}
                      </h3>
                      <span className="text-xs">{getRarityIcon(badge.rarity)}</span>
                      {badge.isUnlocked && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${rarityColors[badge.rarity]}`}
                        >
                          {badge.rarity}
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-xs mb-2 ${
                      badge.isUnlocked 
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {badge.description}
                    </p>
                    
                    {!badge.isUnlocked ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="font-medium">
                            {badge.progress}/{badge.maxProgress}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-1" />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {progressPercentage}% complete
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Unlocked on {new Date(badge.unlockedAt!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {mockBadges
            .filter(badge => badge.isUnlocked)
            .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
            .slice(0, 3)
            .map((badge) => {
              const Icon = iconComponents[badge.icon as keyof typeof iconComponents] || Star
              
              return (
                <div key={badge.id} className="flex items-center gap-3 py-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rarityColors[badge.rarity]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {badge.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(badge.unlockedAt!).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {badge.rarity}
                  </Badge>
                </div>
              )
            })}
          
          {mockBadges.filter(badge => badge.isUnlocked).length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No badges unlocked yet. Start exploring to earn your first badge!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}