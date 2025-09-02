"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Camera, 
  MapPin, 
  Star, 
  Navigation, 
  Info, 
  Maximize2, 
  Compass,
  RotateCcw,
  Zap,
  Eye,
  Filter,
  X
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ARPlace {
  id: string
  name: string
  description: string
  category: string
  distance: number // in meters
  direction: number // in degrees
  rating: number
  isVerified: boolean
  image?: string
  tags: string[]
  highlights: string[]
  currentVisitors: number
  estimatedWaitTime?: string
}

interface ARPlaceDiscoveryProps {
  onPlaceSelect?: (place: ARPlace) => void
}

export function ARPlaceDiscovery({ onPlaceSelect }: ARPlaceDiscoveryProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [places, setPlaces] = useState<ARPlace[]>([])
  const [selectedPlace, setSelectedPlace] = useState<ARPlace | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userHeading, setUserHeading] = useState(0)
  const [filter, setFilter] = useState<string>("all")
  const [isCalibrating, setIsCalibrating] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const categories = [
    { value: "all", label: "All Places", icon: "🌍" },
    { value: "restaurant", label: "Restaurants", icon: "🍽️" },
    { value: "attraction", label: "Attractions", icon: "🏛️" },
    { value: "cafe", label: "Cafes", icon: "☕" },
    { value: "shopping", label: "Shopping", icon: "🛍️" },
    { value: "nature", label: "Nature", icon: "🌳" },
    { value: "entertainment", label: "Entertainment", icon: "🎭" }
  ]

  // Mock AR places data
  const mockPlaces: ARPlace[] = [
    {
      id: "1",
      name: "Sunset Restaurant",
      description: "Fine dining with panoramic city views and exceptional cuisine",
      category: "restaurant",
      distance: 150,
      direction: 45,
      rating: 4.8,
      isVerified: true,
      tags: ["fine dining", "romantic", "views", "wine"],
      highlights: ["Live music weekends", "Rooftop seating", "Award-winning chef"],
      currentVisitors: 23,
      estimatedWaitTime: "15-20 min"
    },
    {
      id: "2",
      name: "Historic Museum",
      description: "Ancient artifacts and interactive exhibits spanning 2000 years of history",
      category: "attraction",
      distance: 320,
      direction: 120,
      rating: 4.6,
      isVerified: true,
      tags: ["history", "culture", "education", "family-friendly"],
      highlights: ["VR experiences", "Guided tours", "Gift shop"],
      currentVisitors: 67,
      estimatedWaitTime: "5-10 min"
    },
    {
      id: "3",
      name: "Artisan Coffee House",
      description: "Specialty coffee roastery with locally sourced beans and cozy atmosphere",
      category: "cafe",
      distance: 85,
      direction: 180,
      rating: 4.9,
      isVerified: false,
      tags: ["coffee", "wifi", "workspace", "pastries"],
      highlights: ["Coffee brewing classes", "Local art displays", "Pet-friendly"],
      currentVisitors: 12,
      estimatedWaitTime: "No wait"
    },
    {
      id: "4",
      name: "Central Park",
      description: "Lush green space with walking trails, lake, and recreational facilities",
      category: "nature",
      distance: 500,
      direction: 270,
      rating: 4.7,
      isVerified: true,
      tags: ["nature", "walking", "relaxation", "family"],
      highlights: ["Boat rentals", "Outdoor concerts", "Playground"],
      currentVisitors: 156,
      estimatedWaitTime: "No wait"
    },
    {
      id: "5",
      name: "Luxury Shopping Mall",
      description: "Premium shopping destination with designer brands and entertainment complex",
      category: "shopping",
      distance: 280,
      direction: 315,
      rating: 4.4,
      isVerified: true,
      tags: ["luxury", "shopping", "dining", "entertainment"],
      highlights: ["Designer stores", "Food court", "Cinema complex"],
      currentVisitors: 234,
      estimatedWaitTime: "No wait"
    }
  ]

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive"
          })
        }
      )
    }

    // Simulate device orientation for AR
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setUserHeading(event.alpha)
      }
    }

    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [toast])

  // Reload places when filter changes and camera is active
  useEffect(() => {
    if (isCameraActive && userLocation) {
      loadNearbyPlaces()
    }
  }, [filter, userLocation, userHeading])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        
        // Load places from API
        await loadNearbyPlaces()
        
        // Start AR overlay
        requestAnimationFrame(updateAROverlay)
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      })
    }
  }

  const loadNearbyPlaces = async () => {
    if (!userLocation) return

    try {
      const response = await fetch('/api/ar-discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: userLocation,
          heading: userHeading,
          radius: 1000, // 1km radius
          category: filter !== "all" ? filter : undefined,
          limit: 20
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to load places')
      }

      const data = await response.json()
      setPlaces(data.places)
    } catch (error) {
      console.error('Error loading places:', error)
      // Fallback to mock data
      setPlaces(mockPlaces)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const updateAROverlay = () => {
    if (!isCameraActive || !canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Filter places based on current filter and field of view
    const fov = 60 // Field of view in degrees
    const visiblePlaces = places.filter(place => {
      const angleDiff = Math.abs(((place.direction - userHeading + 180) % 360) - 180)
      return angleDiff <= fov / 2 && (filter === "all" || place.category === filter)
    })

    // Draw AR overlays for visible places
    visiblePlaces.forEach(place => {
      const angleDiff = ((place.direction - userHeading + 180) % 360) - 180
      const xPosition = (angleDiff / fov) * canvas.width + canvas.width / 2
      
      // Calculate distance-based size and opacity
      const distance = Math.max(100, place.distance)
      const size = Math.max(50, 200 - (distance / 1000) * 150)
      const opacity = Math.max(0.3, 1 - (distance / 1000))

      // Draw place marker
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = '#8B5CF6'
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 3
      
      // Draw circular marker
      ctx.beginPath()
      ctx.arc(xPosition, 100, size / 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
      
      // Draw distance text
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${place.distance}m`, xPosition, 105)
      
      ctx.restore()
    })

    // Continue animation
    if (isCameraActive) {
      requestAnimationFrame(updateAROverlay)
    }
  }

  const calibrateCompass = () => {
    setIsCalibrating(true)
    toast({
      title: "Calibrating Compass",
      description: "Please move your device in a figure-8 pattern.",
    })
    
    setTimeout(() => {
      setIsCalibrating(false)
      toast({
        title: "Calibration Complete",
        description: "Compass has been calibrated successfully.",
      })
    }, 3000)
  }

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  const getDirectionIcon = (direction: number) => {
    const normalizedDirection = ((direction - userHeading + 180) % 360) - 180
    if (Math.abs(normalizedDirection) < 22.5) return "⬆️"
    if (normalizedDirection < -157.5) return "⬆️"
    if (normalizedDirection > 157.5) return "⬆️"
    if (normalizedDirection < -67.5) return "⬅️"
    if (normalizedDirection > 67.5) return "➡️"
    return "⬇️"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "restaurant": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "attraction": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "cafe": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "shopping": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "nature": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "entertainment": return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Eye className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold gradient-primary-text">AR Place Discovery</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Point your camera to discover amazing places around you
        </p>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-96 bg-black rounded-2xl overflow-hidden">
        {!isCameraActive ? (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <Camera className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg mb-4">Camera is inactive</p>
            <Button onClick={toggleCamera} className="gradient-primary">
              <Camera className="h-4 w-4 mr-2" />
              Start AR Discovery
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              width="1280"
              height="720"
              className="absolute inset-0 w-full h-full"
            />
            
            {/* AR Overlay UI */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Crosshair */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Compass */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-white">
                  <Compass className="h-5 w-5" />
                  <span className="font-mono">{Math.round(userHeading)}°</span>
                </div>
              </div>
              
              {/* Location indicator */}
              {userLocation && (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>GPS Active</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Control buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={calibrateCompass}
                disabled={isCalibrating}
                className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
              >
                {isCalibrating ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Compass className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleCamera}
                className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Filter and Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {categories.map(category => (
          <Button
            key={category.value}
            variant={filter === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category.value)}
            className="text-xs"
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>

      {/* Places List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Nearby Places</h3>
        {places
          .filter(place => filter === "all" || place.category === filter)
          .sort((a, b) => a.distance - b.distance)
          .map(place => (
            <Card key={place.id} className="glass-effect hover:scale-105 transition-all-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{place.name}</h4>
                      {place.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                      <Badge className={getCategoryColor(place.category)}>
                        {categories.find(c => c.value === place.category)?.icon}
                        <span className="ml-1 capitalize">{place.category}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {place.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {place.distance}m {getDirectionIcon(place.direction)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {place.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {place.currentVisitors} visitors
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {place.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {place.estimatedWaitTime && (
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        ⏱️ Estimated wait: {place.estimatedWaitTime}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {place.name}
                            {place.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </DialogTitle>
                          <DialogDescription>
                            {place.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Highlights</h5>
                            <ul className="text-sm space-y-1">
                              {place.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Zap className="h-3 w-3 text-yellow-500" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">All Tags</h5>
                            <div className="flex flex-wrap gap-1">
                              {place.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-sm text-gray-500">
                              {place.distance}m away
                            </div>
                            <Button 
                              onClick={() => {
                                setSelectedPlace(place)
                                if (onPlaceSelect) onPlaceSelect(place)
                              }}
                              className="gradient-primary"
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Navigate
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        setSelectedPlace(place)
                        if (onPlaceSelect) onPlaceSelect(place)
                      }}
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}