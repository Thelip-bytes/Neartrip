"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Phone, 
  Globe,
  Star,
  Heart,
  Share2,
  Navigation,
  Calendar,
  Camera,
  MessageCircle,
  Users
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { PostCard } from "@/components/post/PostCard"

interface PlaceDetailsProps {
  place: {
    id: string
    name: string
    description?: string
    category: string
    location: string
    address?: string
    phone?: string
    website?: string
    bestTimeToVisit?: string
    ticketInfo?: string
    openingHours?: string
    latitude?: number
    longitude?: number
    tags?: string[]
    isVerified?: boolean
    isCurated?: boolean
    media?: Array<{
      id: string
      type: "IMAGE" | "VIDEO"
      url: string
      caption?: string
      isPrimary?: boolean
    }>
    _count?: {
      posts: number
      savedPlaces: number
    }
  }
  posts?: Array<any>
  onClose?: () => void
}

export function PlaceDetails({ place, posts = [], onClose }: PlaceDetailsProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleShare = () => {
    // Implement share functionality
  }

  const handleGetDirections = () => {
    if (place.latitude && place.longitude) {
      window.open(`https://maps.google.com/?q=${place.latitude},${place.longitude}`, '_blank')
    }
  }

  const handleCall = () => {
    if (place.phone) {
      window.open(`tel:${place.phone}`, '_self')
    }
  }

  const handleVisitWebsite = () => {
    if (place.website) {
      window.open(place.website, '_blank')
    }
  }

  const primaryImage = place.media?.find(m => m.isPrimary) || place.media?.[0]
  const otherImages = place.media?.filter(m => !m.isPrimary) || []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            {place.isVerified && (
              <Badge className="bg-green-500 hover:bg-green-600">
                ✓ Verified
              </Badge>
            )}
            {place.isCurated && (
              <Badge className="bg-blue-500 hover:bg-blue-600">
                ✨ Curated
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{place.location}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
          >
            <Heart className={cn(
              "h-4 w-4 mr-2",
              isSaved && "fill-red-500 text-red-500"
            )} />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Main Image Gallery */}
      <Card>
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={place.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center';
                  fallback.innerHTML = '<div class="text-center"><div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2"><span class="text-2xl">📍</span></div><p class="text-sm text-gray-600">Place Image</p></div>';
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <MapPin className="h-24 w-24 text-gray-400" />
            </div>
          )}
          
          <div className="absolute top-4 left-4">
            <Badge 
              className={cn(
                "text-sm font-medium",
                categoryColors[place.category as keyof typeof categoryColors] || categoryColors.OTHER
              )}
            >
              {place.category.toLowerCase().replace("_", " ")}
            </Badge>
          </div>

          {place.media && place.media.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
              <Camera className="h-4 w-4 inline mr-1" />
              {place.media.length} photos
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 flex gap-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetDirections}
            className="flex-1"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
          {place.phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCall}
              className="flex-1"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          )}
          {place.website && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVisitWebsite}
              className="flex-1"
            >
              <Globe className="h-4 w-4 mr-2" />
              Website
            </Button>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="posts">
            Posts
            {posts.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {posts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Description */}
          {place.description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{place.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{place._count?.posts || 0}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{place._count?.savedPlaces || 0}</div>
                <div className="text-sm text-gray-500">Saved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-gray-500">Rating</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-gray-500">Reviews</div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          {/* Detailed Information */}
          <div className="grid gap-4">
            {place.address && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Address</h4>
                      <p className="text-gray-600">{place.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {place.openingHours && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Opening Hours</h4>
                      <p className="text-gray-600">{place.openingHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {place.bestTimeToVisit && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Best Time to Visit</h4>
                      <p className="text-gray-600">{place.bestTimeToVisit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {place.ticketInfo && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Ticket Information</h4>
                      <p className="text-gray-600">{place.ticketInfo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {place.phone && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <p className="text-gray-600">{place.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {place.website && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Website</h4>
                      <a 
                        href={place.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {place.website}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-gray-500">Be the first to share your experience at this place!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          {place.media && place.media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {place.media.map((media, index) => (
                <Card key={media.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    {media.type === "IMAGE" ? (
                      <Image
                        src={media.url}
                        alt={media.caption || `Place image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gray-100 flex items-center justify-center';
                            fallback.innerHTML = '<div class="text-center"><div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2"><span class="text-xl">📷</span></div><p class="text-sm text-gray-600">Image</p></div>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-xl">▶</span>
                          </div>
                          <p className="text-sm text-gray-600">Video</p>
                        </div>
                      </div>
                    )}
                    {media.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-sm truncate">{media.caption}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No media available</h3>
                <p className="text-gray-500">No photos or videos have been uploaded for this place yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}