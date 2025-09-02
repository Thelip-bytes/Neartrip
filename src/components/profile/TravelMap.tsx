"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Globe, 
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react"

interface TravelMapProps {
  visitedPlaces?: Array<{
    id: string
    name: string
    country: string
    city: string
    category: string
    visitDate: string
    coordinates: {
      lat: number
      lng: number
    }
  }>
}

const mockVisitedPlaces = [
  {
    id: "1",
    name: "Eiffel Tower",
    country: "France",
    city: "Paris",
    category: "Landmark",
    visitDate: "2024-01-15",
    coordinates: { lat: 48.8584, lng: 2.2945 }
  },
  {
    id: "2",
    name: "Colosseum",
    country: "Italy",
    city: "Rome",
    category: "Historical",
    visitDate: "2024-02-20",
    coordinates: { lat: 41.8902, lng: 12.4922 }
  },
  {
    id: "3",
    name: "Sagrada Familia",
    country: "Spain",
    city: "Barcelona",
    category: "Architecture",
    visitDate: "2024-03-10",
    coordinates: { lat: 41.4036, lng: 2.1744 }
  },
  {
    id: "4",
    name: "Big Ben",
    country: "United Kingdom",
    city: "London",
    category: "Landmark",
    visitDate: "2024-04-05",
    coordinates: { lat: 51.5007, lng: -0.1246 }
  },
  {
    id: "5",
    name: "Brandenburg Gate",
    country: "Germany",
    city: "Berlin",
    category: "Historical",
    visitDate: "2024-05-12",
    coordinates: { lat: 52.5163, lng: 13.3777 }
  }
]

export function TravelMap({ visitedPlaces = mockVisitedPlaces }: TravelMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)
  const [mapScale, setMapScale] = useState(1)

  const categories = ["all", "Landmark", "Historical", "Architecture", "Nature", "Cultural"]
  
  const filteredPlaces = selectedCategory === "all" 
    ? visitedPlaces 
    : visitedPlaces.filter(place => place.category === selectedCategory)

  const getMapPosition = (lat: number, lng: number) => {
    // Simple projection for demo purposes
    const x = ((lng + 180) / 360) * 100
    const y = ((90 - lat) / 180) * 100
    return { x, y }
  }

  const handleZoom = (direction: "in" | "out") => {
    setMapScale(prev => direction === "in" ? Math.min(prev + 0.2, 2) : Math.max(prev - 0.2, 0.5))
  }

  const resetMap = () => {
    setMapScale(1)
    setSelectedPlace(null)
    setSelectedCategory("all")
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Travel Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom("out")}
                disabled={mapScale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom("in")}
                disabled={mapScale >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetMap}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="h-8"
            >
              All ({visitedPlaces.length})
            </Button>
            {categories.slice(1).map(category => {
              const count = visitedPlaces.filter(p => p.category === category).length
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="h-8"
                  disabled={count === 0}
                >
                  {category} ({count})
                </Button>
              )
            })}
          </div>

          {/* Interactive Map */}
          <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg overflow-hidden" 
               style={{ height: "400px" }}>
            {/* Simple World Map Representation */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-r from-blue-200 via-green-200 to-yellow-200 dark:from-blue-800 dark:via-green-800 dark:to-yellow-800"></div>
            </div>

            {/* Map Points */}
            <div className="relative w-full h-full" style={{ transform: `scale(${mapScale})`, transformOrigin: 'center' }}>
              {filteredPlaces.map((place) => {
                const position = getMapPosition(place.coordinates.lat, place.coordinates.lng)
                const isSelected = selectedPlace === place.id
                
                return (
                  <div
                    key={place.id}
                    className={`absolute cursor-pointer transition-all duration-200 ${
                      isSelected ? 'z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: `translate(-50%, -50%) scale(${isSelected ? 1.5 : 1})`
                    }}
                    onClick={() => setSelectedPlace(isSelected ? null : place.id)}
                  >
                    <div className={`
                      relative flex items-center justify-center
                      ${isSelected ? 'animate-pulse' : ''}
                    `}>
                      <div className={`
                        w-4 h-4 rounded-full border-2 border-white shadow-lg
                        ${isSelected ? 'bg-red-500 scale-125' : 'bg-blue-500'}
                        transition-all duration-200
                      `}></div>
                      {isSelected && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-max">
                          <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {place.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {place.city}, {place.country}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
              <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-2">
                Map Legend
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Visited Place</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Selected Place</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Place Details */}
      {selectedPlace && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Place Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const place = visitedPlaces.find(p => p.id === selectedPlace)
              if (!place) return null
              
              return (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {place.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {place.city}, {place.country}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{place.category}</Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Visited on {new Date(place.visitDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Coordinates: {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Places List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Visited Places ({filteredPlaces.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlace === place.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedPlace(place.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {place.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {place.city}, {place.country}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {place.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}