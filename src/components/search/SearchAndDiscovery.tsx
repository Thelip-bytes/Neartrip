"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  TrendingUp, 
  MapPin, 
  Users, 
  Hash,
  X,
  Clock,
  Star,
  Heart,
  Compass,
  Camera,
  Coffee,
  Mountain,
  Waves,
  Building,
  TreePine
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  type: 'user' | 'place' | 'post' | 'hashtag'
  title: string
  subtitle?: string
  description?: string
  image?: string
  location?: string
  category?: string
  tags?: string[]
  stats?: {
    likes?: number
    followers?: number
    posts?: number
    saved?: number
  }
  isVerified?: boolean
  isTrending?: boolean
}

interface SearchAndDiscoveryProps {
  onResultClick?: (result: SearchResult) => void
  className?: string
}

const searchCategories = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'places', label: 'Places', icon: MapPin },
  { id: 'posts', label: 'Posts', icon: Camera },
  { id: 'hashtags', label: 'Hashtags', icon: Hash }
]

const trendingTopics = [
  { id: '1', title: '#TravelPhotography', posts: 15420, trend: '+12%' },
  { id: '2', title: '#SunsetLovers', posts: 8930, trend: '+8%' },
  { id: '3', title: '#HiddenGems', posts: 6750, trend: '+15%' },
  { id: '4', title: '#FoodAdventures', posts: 5420, trend: '+5%' },
  { id: '5', title: '#MountainViews', posts: 4890, trend: '+20%' }
]

const suggestedUsers = [
  {
    id: '1',
    name: 'Emma Wilson',
    username: 'emmawilson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    bio: 'Travel photographer | Nature enthusiast',
    followers: 15420,
    isVerified: true
  },
  {
    id: '2',
    name: 'Alex Chen',
    username: 'alexchen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'Urban explorer | Coffee addict',
    followers: 8930,
    isVerified: false
  },
  {
    id: '3',
    name: 'Maria Garcia',
    username: 'mariatravels',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    bio: 'Food blogger | Adventure seeker',
    followers: 6750,
    isVerified: true
  }
]

const popularPlaces = [
  {
    id: '1',
    name: 'Yosemite National Park',
    location: 'California, USA',
    category: 'NATURE',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    posts: 15420,
    saved: 8930,
    isVerified: true
  },
  {
    id: '2',
    name: 'Tokyo Skytree',
    location: 'Tokyo, Japan',
    category: 'CITY_SPOT',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    posts: 8930,
    saved: 6750,
    isVerified: true
  },
  {
    id: '3',
    name: 'Santorini',
    location: 'Greece',
    category: 'BEACH',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
    posts: 6750,
    saved: 5420,
    isVerified: true
  }
]

export function SearchAndDiscovery({ onResultClick, className = "" }: SearchAndDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Mock search results
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      type: 'user',
      title: 'Sarah Johnson',
      subtitle: '@sarahj_travels',
      description: '🌍 Travel enthusiast | 📸 Photography lover',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      stats: { followers: 1240, posts: 24 },
      isVerified: true
    },
    {
      id: '2',
      type: 'place',
      title: 'Golden Gate Bridge',
      subtitle: 'San Francisco, CA',
      description: 'Iconic suspension bridge and photography spot',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      category: 'CITY_SPOT',
      location: 'San Francisco, CA',
      stats: { posts: 15420, saved: 8930 },
      isVerified: true
    },
    {
      id: '3',
      type: 'post',
      title: 'Sunset at the beach',
      subtitle: 'by @sarahj_travels',
      description: 'Amazing sunset view at Malibu Beach 🌅',
      image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=400&h=400&fit=crop',
      stats: { likes: 120 },
      tags: ['sunset', 'beach', 'malibu']
    },
    {
      id: '4',
      type: 'hashtag',
      title: '#TravelPhotography',
      subtitle: '154,420 posts',
      description: 'Share your best travel photos',
      stats: { posts: 15420 },
      isTrending: true
    }
  ]

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true)
      // Simulate API call
      const timer = setTimeout(() => {
        const filteredResults = mockSearchResults.filter(result => {
          const matchesSearch = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.description?.toLowerCase().includes(searchQuery.toLowerCase())
          
          const matchesCategory = activeCategory === 'all' || result.type === activeCategory
          
          return matchesSearch && matchesCategory
        })
        setSearchResults(filteredResults)
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery, activeCategory])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    }
    
    toast({
      title: `Opening ${result.type}`,
      description: `Viewing ${result.title}`
    })
  }

  const handleFollowUser = (userId: string, username: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to follow users.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Followed",
      description: `You are now following ${username}`
    })
  }

  const handleSavePlace = (placeId: string, placeName: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save places.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Place saved",
      description: `${placeName} added to your saved places`
    })
  }

  const renderSearchResult = (result: SearchResult) => {
    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'NATURE': return <TreePine className="h-4 w-4" />
        case 'CITY_SPOT': return <Building className="h-4 w-4" />
        case 'BEACH': return <Waves className="h-4 w-4" />
        case 'CAFE': return <Coffee className="h-4 w-4" />
        case 'MOUNTAIN': return <Mountain className="h-4 w-4" />
        default: return <MapPin className="h-4 w-4" />
      }
    }

    return (
      <Card 
        key={result.id} 
        className="border-0 shadow-none hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
        onClick={() => handleResultClick(result)}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {result.image && (
              <div className="flex-shrink-0">
                {result.type === 'user' ? (
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={result.image} alt={result.title} />
                    <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                    <img 
                      src={result.image} 
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">
                  {result.title}
                </h3>
                {result.isVerified && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full text-xs">
                    ✓
                  </Badge>
                )}
                {result.isTrending && (
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {result.category && (
                  <Badge variant="outline" className="text-xs">
                    {getCategoryIcon(result.category)}
                    <span className="ml-1">{result.category.toLowerCase().replace('_', ' ')}</span>
                  </Badge>
                )}
              </div>
              
              {result.subtitle && (
                <p className="text-xs text-gray-500 mb-1">{result.subtitle}</p>
              )}
              
              {result.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {result.description}
                </p>
              )}
              
              {result.stats && (
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {result.stats.followers && (
                    <span>{result.stats.followers.toLocaleString()} followers</span>
                  )}
                  {result.stats.posts && (
                    <span>{result.stats.posts.toLocaleString()} posts</span>
                  )}
                  {result.stats.likes && (
                    <span>{result.stats.likes.toLocaleString()} likes</span>
                  )}
                  {result.stats.saved && (
                    <span>{result.stats.saved.toLocaleString()} saved</span>
                  )}
                </div>
              )}
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {result.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0">
              {result.type === 'user' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFollowUser(result.id, result.title)
                  }}
                >
                  Follow
                </Button>
              )}
              {result.type === 'place' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSavePlace(result.id, result.title)
                  }}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
              {result.type === 'post' && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleResultClick(result)
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("max-w-2xl mx-auto p-4", className)}>
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-4 text-gray-900 dark:text-gray-100">Search & Discover</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search users, places, posts, hashtags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 h-12 bg-gray-100 dark:bg-gray-900 border-0 focus:ring-2 focus:ring-purple-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {searchCategories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "flex-shrink-0",
                  activeCategory === category.id 
                    ? "bg-purple-500 hover:bg-purple-600 text-white border-0" 
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            )
          })}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-4 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {['Trending', 'Verified', 'Nearby', 'Recent', 'Popular'].map((filter) => (
                  <Badge
                    key={filter}
                    variant={selectedFilters.includes(filter) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      selectedFilters.includes(filter)
                        ? "bg-purple-500 hover:bg-purple-600 text-white border-0"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900"
                    )}
                    onClick={() => handleFilterToggle(filter)}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-8">
          {isSearching ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-0 shadow-none bg-white dark:bg-black">
                  <CardContent className="p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {searchResults.length} results for "{searchQuery}"
              </p>
              {searchResults.map(renderSearchResult)}
            </div>
          ) : (
            <Card className="border-0 shadow-none bg-white dark:bg-black">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No results found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Try different keywords or browse categories</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Discover Content (shown when not searching) */}
      {!searchQuery && (
        <div className="space-y-8">
          {/* Trending Topics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <TrendingUp className="h-5 w-5" />
                Trending Now
              </h2>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                See all
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trendingTopics.map((topic) => (
                <Card key={topic.id} className="border-0 shadow-none hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors bg-white dark:bg-black">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-gray-100">{topic.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{topic.posts.toLocaleString()} posts</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        +{topic.trend}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Suggested Users */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Users className="h-5 w-5" />
                Suggested Users
              </h2>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                See all
              </Button>
            </div>
            <div className="space-y-3">
              {suggestedUsers.map((user) => (
                <Card key={user.id} className="border-0 shadow-none bg-white dark:bg-black">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-transparent">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{user.name}</h3>
                            {user.isVerified && (
                              <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500 text-white border-0">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{user.bio}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleFollowUser(user.id, user.username)}
                      >
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Places */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Compass className="h-5 w-5" />
                Popular Places
              </h2>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularPlaces.map((place) => (
                <Card key={place.id} className="border-0 shadow-none hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={place.image} 
                        alt={place.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {place.category.toLowerCase().replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1">{place.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{place.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{place.posts.toLocaleString()} posts</span>
                          <span>{place.saved.toLocaleString()} saved</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleSavePlace(place.id, place.name)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}