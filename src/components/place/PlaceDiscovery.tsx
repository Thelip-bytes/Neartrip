"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { PlaceCard } from "./PlaceCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  RefreshCw,
  Grid,
  List,
  ChevronDown,
  X,
  Heart,
  Award,
  TrendingUp
} from "lucide-react"

interface Place {
  id: string
  name: string
  description?: string
  category: string
  location: string
  tags?: string[]
  isVerified?: boolean
  isCurated?: boolean
  media?: Array<{
    id: string
    type: "IMAGE" | "VIDEO"
    url: string
    isPrimary?: boolean
  }>
  _count?: {
    posts: number
    savedPlaces: number
  }
}

interface PlaceDiscoveryProps {
  onPlaceClick?: (place: Place) => void
}

export function PlaceDiscovery({ onPlaceClick }: PlaceDiscoveryProps) {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    curatedOnly: false,
    hasHighRating: false,
    minPosts: 0
  })

  // Mock data for development
  const mockPlaces: Place[] = [
    {
      id: "1",
      name: "Sunset Lake",
      description: "A breathtaking lake perfect for evening walks and photography. The sunset views are absolutely stunning.",
      category: "LAKE",
      location: "Hillside Valley",
      tags: ["sunset", "photography", "nature", "peaceful"],
      isVerified: true,
      isCurated: true,
      media: [
        {
          id: "1",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          isPrimary: true
        }
      ],
      _count: {
        posts: 45,
        savedPlaces: 234
      }
    },
    {
      id: "2",
      name: "Artisan Coffee Roasters",
      description: "Cozy cafe with specialty coffee and homemade pastries. Perfect for remote work and casual meetings.",
      category: "CAFE",
      location: "Downtown District",
      tags: ["coffee", "wifi", "pastries", "cozy"],
      isVerified: true,
      isCurated: true,
      media: [
        {
          id: "2",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=300&fit=crop",
          isPrimary: true
        }
      ],
      _count: {
        posts: 67,
        savedPlaces: 189
      }
    },
    {
      id: "3",
      name: "Eagle Peak Trail",
      description: "Challenging hiking trail with rewarding panoramic views. Best visited during sunrise.",
      category: "MOUNTAIN",
      location: "Mountain Range",
      tags: ["hiking", "sunrise", "views", "adventure"],
      isVerified: false,
      isCurated: true,
      media: [
        {
          id: "3",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          isPrimary: true
        }
      ],
      _count: {
        posts: 34,
        savedPlaces: 156
      }
    },
    {
      id: "4",
      name: "Central Park Gardens",
      description: "Beautiful botanical gardens in the heart of the city. Perfect for picnics and leisurely strolls.",
      category: "PARK",
      location: "City Center",
      tags: ["gardens", "picnic", "walking", "nature"],
      isVerified: true,
      isCurated: true,
      media: [
        {
          id: "4",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          isPrimary: true
        }
      ],
      _count: {
        posts: 89,
        savedPlaces: 445
      }
    },
    {
      id: "5",
      name: "Golden Beach",
      description: "Pristine sandy beach with crystal clear waters. Great for swimming and beach volleyball.",
      category: "BEACH",
      location: "Coastal Area",
      tags: ["beach", "swimming", "volleyball", "sunset"],
      isVerified: true,
      isCurated: true,
      media: [
        {
          id: "5",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=400&h=300&fit=crop",
          isPrimary: true
        }
      ],
      _count: {
        posts: 123,
        savedPlaces: 567
      }
    },
    {
      id: "6",
      name: "Historic Museum",
      description: "Step back in time and explore the rich history of our region. Interactive exhibits for all ages.",
      category: "MUSEUM",
      location: "Old Town",
      tags: ["history", "culture", "education", "family"],
      isVerified: true,
      isCurated: false,
      media: [
        {
          id: "6",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          isPrimary: true
        }
      ],
      _count: {
        posts: 23,
        savedPlaces: 89
      }
    }
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "NATURE", label: "Nature" },
    { value: "CAFE", label: "Cafes" },
    { value: "RESTAURANT", label: "Restaurants" },
    { value: "LAKE", label: "Lakes" },
    { value: "PARK", label: "Parks" },
    { value: "BEACH", label: "Beaches" },
    { value: "MOUNTAIN", label: "Mountains" },
    { value: "MUSEUM", label: "Museums" },
    { value: "HISTORICAL", label: "Historical" },
    { value: "ENTERTAINMENT", label: "Entertainment" },
    { value: "SHOPPING", label: "Shopping" },
    { value: "ADVENTURE", label: "Adventure" },
    { value: "CITY_SPOT", label: "City Spots" }
  ]

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "recent", label: "Recently Added" },
    { value: "name", label: "Name A-Z" },
    { value: "saved", label: "Most Saved" },
    { value: "rating", label: "Top Rated" }
  ]

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter and sort mock data
      let filteredPlaces = mockPlaces

      // Apply category filter
      if (selectedCategory !== "all") {
        filteredPlaces = filteredPlaces.filter(place => place.category === selectedCategory)
      }

      // Apply search filter
      if (searchQuery) {
        filteredPlaces = filteredPlaces.filter(place =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }

      // Apply location filter
      if (locationQuery) {
        filteredPlaces = filteredPlaces.filter(place =>
          place.location.toLowerCase().includes(locationQuery.toLowerCase())
        )
      }

      // Apply advanced filters
      if (filters.verifiedOnly) {
        filteredPlaces = filteredPlaces.filter(place => place.isVerified)
      }

      if (filters.curatedOnly) {
        filteredPlaces = filteredPlaces.filter(place => place.isCurated)
      }

      if (filters.hasHighRating) {
        filteredPlaces = filteredPlaces.filter(place => 
          (place._count?.posts || 0) > 50
        )
      }

      if (filters.minPosts > 0) {
        filteredPlaces = filteredPlaces.filter(place => 
          (place._count?.posts || 0) >= filters.minPosts
        )
      }

      // Apply sorting
      filteredPlaces = [...filteredPlaces].sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return (b._count?.posts || 0) - (a._count?.posts || 0)
          case "recent":
            return b.id.localeCompare(a.id) // Simple mock for recent
          case "name":
            return a.name.localeCompare(b.name)
          case "saved":
            return (b._count?.savedPlaces || 0) - (a._count?.savedPlaces || 0)
          case "rating":
            return (b._count?.posts || 0) - (a._count?.posts || 0) // Mock rating by posts
          default:
            return 0
        }
      })

      setPlaces(filteredPlaces)
    } catch (error) {
      console.error("Failed to fetch places:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaces()
  }, [searchQuery, locationQuery, selectedCategory, sortBy, filters])

  const handlePlaceClick = (place: Place) => {
    if (onPlaceClick) {
      onPlaceClick(place)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bars */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search places, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filter by location..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvancedFilters && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, verifiedOnly: checked as boolean }))
                    }
                  />
                  <label htmlFor="verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Verified Only
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="curated"
                    checked={filters.curatedOnly}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, curatedOnly: checked as boolean }))
                    }
                  />
                  <label htmlFor="curated" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Curated Only
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="high-rating"
                    checked={filters.hasHighRating}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, hasHighRating: checked as boolean }))
                    }
                  />
                  <label htmlFor="high-rating" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    High Rating (50+ posts)
                  </label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex gap-1 ml-auto">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "all" || searchQuery || locationQuery || filters.verifiedOnly || filters.curatedOnly || filters.hasHighRating) && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="cursor-pointer">
                {categories.find(c => c.value === selectedCategory)?.label}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {locationQuery && (
              <Badge variant="secondary" className="cursor-pointer">
                Location: {locationQuery}
                <button
                  onClick={() => setLocationQuery("")}
                  className="ml-1 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.verifiedOnly && (
              <Badge variant="secondary" className="cursor-pointer">
                <Award className="h-3 w-3 mr-1" />
                Verified
                <button
                  onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: false }))}
                  className="ml-1 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.curatedOnly && (
              <Badge variant="secondary" className="cursor-pointer">
                <Star className="h-3 w-3 mr-1" />
                Curated
                <button
                  onClick={() => setFilters(prev => ({ ...prev, curatedOnly: false }))}
                  className="ml-1 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.hasHighRating && (
              <Badge variant="secondary" className="cursor-pointer">
                <TrendingUp className="h-3 w-3 mr-1" />
                High Rating
                <button
                  onClick={() => setFilters(prev => ({ ...prev, hasHighRating: false }))}
                  className="ml-1 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {places.length} {places.length === 1 ? "Place" : "Places"} Found
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPlaces}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Places Grid/List */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No places found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <Button onClick={() => { 
            setSearchQuery(""); 
            setLocationQuery(""); 
            setSelectedCategory("all");
            setFilters({
              verifiedOnly: false,
              curatedOnly: false,
              hasHighRating: false,
              minPosts: 0
            });
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => handlePlaceClick(place)}
              className={viewMode === "list" ? "flex flex-row max-h-40" : ""}
            />
          ))}
        </div>
      )}
    </div>
  )
}