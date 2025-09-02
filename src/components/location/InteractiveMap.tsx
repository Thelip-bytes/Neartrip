"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MapPin, 
  Navigation, 
  Star, 
  Heart, 
  Share2, 
  Filter,
  Search,
  Layers,
  Satellite,
  Terrain,
  Compass,
  Users,
  Camera,
  TrendingUp,
  Route,
  Map,
  Maximize,
  Minimize
} from "lucide-react"

interface Place {
  id: string
  name: string
  description: string
  category: string
  location: {
    lat: number
    lng: number
    country: string
    city: string
  }
  rating: number
  reviews: number
  images: string[]
  tags: string[]
  distance?: number
  isSaved: boolean
  isTrending: boolean
  visitors: number
  bestTimeToVisit: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
  }
}

const mockPlaces: Place[] = [
  {
    id: "1",
    name: "Santorini Caldera",
    description: "Stunning volcanic caldera with breathtaking sunset views and white-washed buildings overlooking the Aegean Sea.",
    category: "Natural Wonder",
    location: {
      lat: 36.3932,
      lng: 25.4615,
      country: "Greece",
      city: "Santorini"
    },
    rating: 4.8,
    reviews: 2847,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=300&fit=crop"
    ],
    tags: ["sunset", "photography", "romantic", "island"],
    distance: 2.5,
    isSaved: false,
    isTrending: true,
    visitors: 15420,
    bestTimeToVisit: "April - November",
    author: {
      id: "1",
      name: "Maria Koutsoukou",
      username: "maria_k_travels",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    }
  },
  {
    id: "2",
    name: "Ubud Monkey Forest",
    description: "Sacred forest sanctuary home to over 700 long-tailed macaques, ancient temples, and lush jungle pathways.",
    category: "Wildlife Sanctuary",
    location: {
      lat: -8.5204,
      lng: 115.2624,
      country: "Indonesia",
      city: "Ubud"
    },
    rating: 4.6,
    reviews: 1523,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=300&fit=crop"
    ],
    tags: ["wildlife", "nature", "temple", "adventure"],
    distance: 5.8,
    isSaved: true,
    isTrending: false,
    visitors: 8934,
    bestTimeToVisit: "Year Round",
    author: {
      id: "2",
      name: "Budi Santoso",
      username: "budi_explorer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    }
  },
  {
    id: "3",
    name: "Shibuya Crossing",
    description: "World's busiest pedestrian crossing, iconic Tokyo experience with neon lights and organized chaos.",
    category: "Urban Landmark",
    location: {
      lat: 35.6598,
      lng: 139.7006,
      country: "Japan",
      city: "Tokyo"
    },
    rating: 4.7,
    reviews: 3256,
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop"
    ],
    tags: ["urban", "photography", "culture", "nightlife"],
    distance: 12.3,
    isSaved: false,
    isTrending: true,
    visitors: 25678,
    bestTimeToVisit: "Year Round",
    author: {
      id: "3",
      name: "Yuki Tanaka",
      username: "yuki_photography",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
    }
  },
  {
    id: "4",
    name: "Eiffel Tower",
    description: "Iconic iron lattice tower and symbol of Paris, offering panoramic city views from its observation decks.",
    category: "Historical Monument",
    location: {
      lat: 48.8584,
      lng: 2.2945,
      country: "France",
      city: "Paris"
    },
    rating: 4.6,
    reviews: 4521,
    images: [
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop"
    ],
    tags: ["historical", "romantic", "architecture", "landmark"],
    distance: 8.7,
    isSaved: true,
    isTrending: false,
    visitors: 31245,
    bestTimeToVisit: "April - October",
    author: {
      id: "4",
      name: "Pierre Dubois",
      username: "pierre_paris",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    }
  },
  {
    id: "5",
    name: "Central Park",
    description: "Vast urban park in Manhattan featuring lakes, trails, and recreational facilities amidst the city skyline.",
    category: "City Park",
    location: {
      lat: 40.7829,
      lng: -73.9654,
      country: "USA",
      city: "New York"
    },
    rating: 4.7,
    reviews: 2890,
    images: [
      "https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1533106493333-274dd720b9a1?w=400&h=300&fit=crop"
    ],
    tags: ["nature", "urban", "recreation", "photography"],
    distance: 3.2,
    isSaved: false,
    isTrending: true,
    visitors: 19876,
    bestTimeToVisit: "April - October",
    author: {
      id: "5",
      name: "John Smith",
      username: "john_nyc",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    }
  }
]

const categories = [
  "All", "Natural Wonder", "Urban Landmark", "Historical Monument", 
  "Wildlife Sanctuary", "City Park", "Beach", "Mountain", "Cultural Site"
]

const filters = [
  { name: "Nearby", icon: Navigation },
  { name: "Trending", icon: TrendingUp },
  { name: "Top Rated", icon: Star },
  { name: "Most Visited", icon: Users },
  { name: "Recently Added", icon: Camera }
]

export function InteractiveMap() {
  const [places, setPlaces] = useState<Place[]>(mockPlaces)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedFilter, setSelectedFilter] = useState("Nearby")
  const [searchQuery, setSearchQuery] = useState("")
  const [mapStyle, setMapStyle] = useState("terrain")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log("Location access denied or unavailable")
        }
      )
    }
  }, [])

  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory === "All" || place.category === selectedCategory
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const toggleSavePlace = (placeId: string) => {
    setPlaces(prev =>
      prev.map(place =>
        place.id === placeId ? { ...place, isSaved: !place.isSaved } : place
      )
    )
  }

  const calculateDistance = (place: Place) => {
    if (!userLocation) return null
    
    const R = 6371 // Earth's radius in kilometers
    const dLat = (place.location.lat - userLocation.lat) * Math.PI / 180
    const dLng = (place.location.lng - userLocation.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(place.location.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getDirections = (place: Place) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.location.lat},${place.location.lng}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Map Area */}
      <div className={`flex-1 relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Map Background - Simulated */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20">
          {/* Simulated map with place markers */}
          {filteredPlaces.map((place, index) => {
            const distance = calculateDistance(place)
            const isSelected = selectedPlace?.id === place.id
            
            // Simulate marker positions based on coordinates
            const markerStyle = {
              left: `${((place.location.lng + 180) / 360) * 100}%`,
              top: `${((90 - place.location.lat) / 180) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }
            
            return (
              <div
                key={place.id}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'
                }`}
                style={markerStyle}
                onClick={() => setSelectedPlace(place)}
              >
                <div className={`relative ${
                  isSelected ? 'animate-pulse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                    place.isTrending ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  {place.isTrending && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white" />
                  )}
                  {distance && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap">
                      {distance.toFixed(1)} km
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          
          {/* User location marker */}
          {userLocation && (
            <div
              className="absolute z-30"
              style={{
                left: `${((userLocation.lng + 180) / 360) * 100}%`,
                top: `${((90 - userLocation.lat) / 180) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-30" />
            </div>
          )}
        </div>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-white/90 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapStyle(mapStyle === "terrain" ? "satellite" : "terrain")}
            className="bg-white/90 backdrop-blur-sm"
          >
            {mapStyle === "terrain" ? <Satellite className="h-4 w-4" /> : <Terrain className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (userLocation) {
                // Center map on user location
                console.log("Centering on user location")
              }
            }}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Compass className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Map Style Indicator */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          {mapStyle === "terrain" ? "Terrain View" : "Satellite View"}
        </div>
        
        {/* Fullscreen close button */}
        {isFullscreen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-sm"
          >
            <Minimize className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        )}
      </div>
      
      {/* Sidebar */}
      <div className="w-96 border-l border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Explore Places</h2>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Categories */}
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Filters */}
          <div className="flex gap-1 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter.name}
                variant={selectedFilter === filter.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.name)}
                className="flex-shrink-0"
              >
                <filter.icon className="h-3 w-3 mr-1" />
                {filter.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Places List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {filteredPlaces.map((place) => {
              const distance = calculateDistance(place)
              const isSelected = selectedPlace?.id === place.id
              
              return (
                <Card
                  key={place.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPlace(place)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{place.name}</h3>
                            <p className="text-xs text-gray-500 mb-1">
                              {place.location.city}, {place.location.country}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{place.rating}</span>
                              </div>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{place.reviews} reviews</span>
                              {distance && (
                                <>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">{distance.toFixed(1)} km</span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {place.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {place.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{place.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleSavePlace(place.id)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Heart className={`h-3 w-3 ${place.isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            
                            {place.isTrending && (
                              <Badge variant="destructive" className="text-xs">
                                Trending
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={place.author.avatar} />
                              <AvatarFallback className="text-xs">
                                {place.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              {place.author.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            {place.visitors.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
        
        {/* Selected Place Details */}
        {selectedPlace && (
          <Card className="m-4 border-t-0 rounded-t-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedPlace.location.city}, {selectedPlace.location.country}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlace(null)}
                >
                  ×
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {selectedPlace.description}
              </p>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">{selectedPlace.rating}</span>
                  <span className="text-xs text-gray-500">({selectedPlace.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedPlace.visitors.toLocaleString()} visitors</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSavePlace(selectedPlace.id)}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-1 ${selectedPlace.isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  {selectedPlace.isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getDirections(selectedPlace)}
                  className="flex-1"
                >
                  <Route className="h-4 w-4 mr-1" />
                  Directions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}