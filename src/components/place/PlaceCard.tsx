"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/ui/ImageCarousel"
import { 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Heart,
  Share2,
  Navigation
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaceCardProps {
  place: {
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
  onClick?: () => void
  className?: string
}

export function PlaceCard({ place, onClick, className }: PlaceCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const categoryColors = {
    NATURE: "bg-green-100 text-green-800",
    CAFE: "bg-orange-100 text-orange-800",
    RESTAURANT: "bg-red-100 text-red-800",
    LAKE: "bg-blue-100 text-blue-800",
    PARK: "bg-emerald-100 text-emerald-800",
    BEACH: "bg-cyan-100 text-cyan-800",
    MOUNTAIN: "bg-purple-100 text-purple-800",
    HISTORICAL: "bg-amber-100 text-amber-800",
    MUSEUM: "bg-indigo-100 text-indigo-800",
    ENTERTAINMENT: "bg-pink-100 text-pink-800",
    SHOPPING: "bg-rose-100 text-rose-800",
    ADVENTURE: "bg-orange-100 text-orange-800",
    CITY_SPOT: "bg-gray-100 text-gray-800",
    OTHER: "bg-gray-100 text-gray-800"
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implement share functionality
  }

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implement directions functionality
  }

  return (
    <Card 
      className={cn(
        "group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Image Carousel */}
        <div className="relative">
          <ImageCarousel
            images={place.media?.map(media => ({
              id: media.id,
              url: media.url,
              type: media.type,
              alt: place.name
            })) || []}
            aspectRatio="landscape"
            showControls={place.media && place.media.length > 1}
            showIndicators={place.media && place.media.length > 1}
            enableFullscreen={true}
            enableDownload={true}
            enableShare={true}
            className="w-full"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2 z-10">
            <Badge 
              className={cn(
                "text-xs font-medium",
                categoryColors[place.category as keyof typeof categoryColors] || categoryColors.OTHER
              )}
            >
              {place.category.toLowerCase().replace("_", " ")}
            </Badge>
            {place.isCurated && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">
                ✨ Curated
              </Badge>
            )}
            {place.isVerified && (
              <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                ✓ Verified
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleSave}
            >
              <Heart className={cn(
                "h-4 w-4",
                isSaved && "fill-red-500 text-red-500"
              )} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 flex-1">
              {place.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{place.location}</span>
          </div>

          {/* Description */}
          {place.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {place.description}
            </p>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {place.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              ))}
              {place.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{place.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              {place._count?.posts !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{place._count.posts} posts</span>
                </div>
              )}
              {place._count?.savedPlaces !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{place._count.savedPlaces} saved</span>
                </div>
              )}
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={handleGetDirections}
            >
              <Navigation className="h-4 w-4 mr-1" />
              Directions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}