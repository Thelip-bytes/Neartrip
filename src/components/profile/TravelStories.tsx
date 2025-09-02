"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImageCarousel } from "@/components/ui/ImageCarousel"
import { 
  Play, 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin,
  Calendar,
  Eye,
  MoreHorizontal,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TravelStory {
  id: string
  title: string
  description: string
  location: string
  country: string
  category: string
  duration: number // in seconds
  thumbnailUrl: string
  videoUrl?: string
  media: Array<{
    id: string
    url: string
    caption?: string
  }>
  views: number
  likes: number
  comments: number
  createdAt: string
  isLiked: boolean
  tags: string[]
}

const mockStories: TravelStory[] = [
  {
    id: "1",
    title: "Sunset in Santorini",
    description: "Amazing sunset views from Oia village",
    location: "Santorini",
    country: "Greece",
    category: "Nature",
    duration: 30,
    thumbnailUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=600&fit=crop",
    media: [
      {
        id: "1-1",
        url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=600&fit=crop",
        caption: "Classic Santorini sunset"
      },
      {
        id: "1-2",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
        caption: "Blue domes of Oia"
      },
      {
        id: "1-3",
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=600&fit=crop",
        caption: "Caldera view"
      }
    ],
    views: 1250,
    likes: 89,
    comments: 12,
    createdAt: "2024-01-20T10:30:00Z",
    isLiked: false,
    tags: ["sunset", "greece", "santorini", "nature"]
  },
  {
    id: "2",
    title: "Tokyo Street Food Adventure",
    description: "Exploring the vibrant street food scene in Shibuya",
    location: "Tokyo",
    country: "Japan",
    category: "Food",
    duration: 45,
    thumbnailUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=600&fit=crop",
    media: [
      {
        id: "2-1",
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=600&fit=crop",
        caption: "Ramen street food"
      },
      {
        id: "2-2",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
        caption: "Takoyaki stall"
      },
      {
        id: "2-3",
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=600&fit=crop",
        caption: "Shibuya crossing"
      },
      {
        id: "2-4",
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=600&fit=crop",
        caption: "Temple food market"
      }
    ],
    views: 2340,
    likes: 156,
    comments: 23,
    createdAt: "2024-01-18T15:20:00Z",
    isLiked: true,
    tags: ["tokyo", "food", "street-food", "japan"]
  },
  {
    id: "3",
    title: "Northern Lights Magic",
    description: "Witnessing the aurora borealis in Iceland",
    location: "Reykjavik",
    country: "Iceland",
    category: "Adventure",
    duration: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=600&fit=crop",
    media: [
      {
        id: "3-1",
        url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=600&fit=crop",
        caption: "Northern lights dancing"
      },
      {
        id: "3-2",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
        caption: "Ice cave exploration"
      },
      {
        id: "3-3",
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=600&fit=crop",
        caption: "Glacier lagoon"
      }
    ],
    views: 3450,
    likes: 234,
    comments: 34,
    createdAt: "2024-01-15T20:45:00Z",
    isLiked: false,
    tags: ["northern-lights", "iceland", "aurora", "nature"]
  },
  {
    id: "4",
    title: "Paris Cafe Culture",
    description: "Morning coffee at a charming Parisian cafe",
    location: "Paris",
    country: "France",
    category: "Culture",
    duration: 25,
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    media: [
      {
        id: "4-1",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
        caption: "Parisian cafe terrace"
      },
      {
        id: "4-2",
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=600&fit=crop",
        caption: "Fresh croissants"
      }
    ],
    views: 890,
    likes: 67,
    comments: 8,
    createdAt: "2024-01-12T09:15:00Z",
    isLiked: true,
    tags: ["paris", "cafe", "coffee", "france"]
  }
]

export function TravelStories() {
  const { toast } = useToast()
  const [stories, setStories] = useState<TravelStory[]>(mockStories)
  const [selectedStory, setSelectedStory] = useState<TravelStory | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [filter, setFilter] = useState<"all" | "recent" | "popular">("all")
  
  const [newStory, setNewStory] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    category: "",
    tags: "",
    duration: ""
  })

  const filteredStories = [...stories].sort((a, b) => {
    if (filter === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (filter === "popular") {
      return b.views - a.views
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleLike = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            isLiked: !story.isLiked,
            likes: story.isLiked ? story.likes - 1 : story.likes + 1
          }
        : story
    ))
    
    const story = stories.find(s => s.id === storyId)
    if (story) {
      toast({
        title: story.isLiked ? "Unliked" : "Liked",
        description: story.isLiked 
          ? "Removed from your liked stories"
          : "Added to your liked stories"
      })
    }
  }

  const handleCreateStory = () => {
    if (!newStory.title.trim() || !newStory.description.trim()) {
      toast({
        title: "Title and description required",
        description: "Please enter both title and description for your story.",
        variant: "destructive"
      })
      return
    }

    const story: TravelStory = {
      id: Date.now().toString(),
      title: newStory.title,
      description: newStory.description,
      location: newStory.location,
      country: newStory.country,
      category: newStory.category,
      duration: parseInt(newStory.duration) || 30,
      thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      tags: newStory.tags.split(",").map(tag => tag.trim()).filter(Boolean)
    }

    setStories(prev => [story, ...prev])
    setNewStory({
      title: "",
      description: "",
      location: "",
      country: "",
      category: "",
      tags: "",
      duration: ""
    })
    setIsCreateDialogOpen(false)
    
    toast({
      title: "Story created!",
      description: "Your travel story has been created successfully."
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Nature": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Food": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      "Adventure": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "Culture": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "City": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5" />
              Travel Stories & Reels
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Story
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Travel Story</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newStory.title}
                      onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter story title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newStory.description}
                      onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your travel story..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newStory.location}
                        onChange={(e) => setNewStory(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newStory.country}
                        onChange={(e) => setNewStory(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newStory.category}
                        onChange={(e) => setNewStory(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Nature"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (seconds)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newStory.duration}
                        onChange={(e) => setNewStory(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="30"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={newStory.tags}
                      onChange={(e) => setNewStory(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateStory}>
                      Create Story
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="h-8"
            >
              All Stories
            </Button>
            <Button
              variant={filter === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("recent")}
              className="h-8"
            >
              Recent
            </Button>
            <Button
              variant={filter === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("popular")}
              className="h-8"
            >
              Popular
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStories.map((story) => (
          <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Story Media Carousel */}
            <div className="relative">
              <ImageCarousel
                images={story.media.map(media => ({
                  id: media.id,
                  url: media.url,
                  caption: media.caption,
                  alt: media.caption || story.title
                }))}
                aspectRatio="portrait"
                showControls={story.media.length > 1}
                showIndicators={story.media.length > 1}
                enableFullscreen={true}
                enableDownload={true}
                enableShare={true}
                onLike={(image, index) => handleLike(story.id)}
                className="w-full"
              />
              
              {/* Duration Badge */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                {formatDuration(story.duration)}
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-2 left-2 z-10">
                <Badge className={`text-xs ${getCategoryColor(story.category)}`}>
                  {story.category}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {story.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{story.location}, {story.country}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatViews(story.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{story.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{story.comments}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(story.id)}
                    className={`h-8 w-8 p-0 ${
                      story.isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${story.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                {/* Tags */}
                {story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {story.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{story.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Story Viewer Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="sm:max-w-4xl">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStory.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Story Media Carousel */}
                <div className="relative">
                  <ImageCarousel
                    images={selectedStory.media.map(media => ({
                      id: media.id,
                      url: media.url,
                      caption: media.caption,
                      alt: media.caption || selectedStory.title
                    }))}
                    aspectRatio="video"
                    showControls={selectedStory.media.length > 1}
                    showIndicators={selectedStory.media.length > 1}
                    enableFullscreen={false} // Already in fullscreen dialog
                    enableDownload={true}
                    enableShare={true}
                    onLike={(image, index) => handleLike(selectedStory.id)}
                    autoPlay={false}
                    className="w-full"
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                    <Button
                      size="lg"
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black pointer-events-auto"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>
                
                {/* Story Info */}
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedStory.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedStory.location}, {selectedStory.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedStory.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(selectedStory.id)}
                        className={`h-8 px-3 ${
                          selectedStory.isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${selectedStory.isLiked ? 'fill-current' : ''}`} />
                        {selectedStory.likes}
                      </Button>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-8 px-3">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {selectedStory.comments}
                    </Button>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatViews(selectedStory.views)} views
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {selectedStory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedStory.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredStories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Share your travel experiences with amazing stories and reels!
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}