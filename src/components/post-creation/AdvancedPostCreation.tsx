"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Image, 
  Video, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  X,
  Plus,
  Camera,
  Film,
  MapPinned,
  Clock,
  Tag,
  Send,
  Filter,
  Palette,
  Music,
  Link,
  Smile,
  MoreHorizontal
} from "lucide-react"

interface MediaFile {
  id: string
  file: File
  type: 'image' | 'video'
  preview: string
  caption?: string
  location?: string
  tags?: string[]
}

interface Location {
  id: string
  name: string
  country: string
  coordinates: { lat: number; lng: number }
}

const mockLocations: Location[] = [
  { id: "1", name: "Santorini", country: "Greece", coordinates: { lat: 36.3932, lng: 25.4615 } },
  { id: "2", name: "Bali", country: "Indonesia", coordinates: { lat: -8.3405, lng: 115.0920 } },
  { id: "3", name: "Tokyo", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: "4", name: "Paris", country: "France", coordinates: { lat: 48.8566, lng: 2.3522 } },
  { id: "5", name: "New York", country: "USA", coordinates: { lat: 40.7128, lng: -74.0060 } }
]

const categories = [
  "Adventure", "Beach", "Mountain", "City", "Cultural", "Food", "Nature", "Historical"
]

const filters = [
  { name: "Original", icon: Palette },
  { name: "Vintage", icon: Palette },
  { name: "Black & White", icon: Palette },
  { name: "Vivid", icon: Palette },
  { name: "Warm", icon: Palette },
  { name: "Cool", icon: Palette }
]

export function AdvancedPostCreation() {
  const [isOpen, setIsOpen] = useState(false)
  const [caption, setCaption] = useState("")
  const [location, setLocation] = useState<Location | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Original")
  const [allowComments, setAllowComments] = useState(true)
  const [showLocation, setShowLocation] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (type: 'image' | 'video') => {
    const input = type === 'image' ? fileInputRef.current : videoInputRef.current
    if (input) {
      input.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (type === 'image' && !file.type.startsWith('image/')) return
      if (type === 'video' && !file.type.startsWith('video/')) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const newMedia: MediaFile = {
          id: Date.now().toString() + Math.random(),
          file,
          type,
          preview: e.target?.result as string
        }
        setMediaFiles(prev => [...prev, newMedia])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(m => m.id !== id))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handlePostSubmit = async () => {
    if (mediaFiles.length === 0) {
      toast({
        title: "No media selected",
        description: "Please select at least one photo or video to post.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Post created successfully!",
        description: scheduleDate ? "Your post has been scheduled." : "Your post is now live.",
      })
      
      // Reset form
      setCaption("")
      setLocation(null)
      setSelectedCategory("")
      setTags([])
      setMediaFiles([])
      setScheduleDate("")
      setScheduleTime("")
      setSelectedFilter("Original")
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="h-5 w-5 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Media Upload Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              {mediaFiles.length === 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleFileSelect('image')}
                      className="flex flex-col items-center gap-2 h-20 w-20"
                    >
                      <Camera className="h-6 w-6" />
                      <span className="text-xs">Photos</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleFileSelect('video')}
                      className="flex flex-col items-center gap-2 h-20 w-20"
                    >
                      <Film className="h-6 w-6" />
                      <span className="text-xs">Videos</span>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Share your travel experiences with the community
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {mediaFiles.map((media, index) => (
                      <div key={media.id} className="relative group">
                        {media.type === 'image' ? (
                          <img
                            src={media.preview}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={media.preview}
                            className="w-full h-32 object-cover rounded-lg"
                            controls={false}
                          />
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMedia(media.id)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                          {media.type === 'image' ? '📷' : '🎥'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect('image')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileSelect('video')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Video
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Filters */}
            {mediaFiles.length > 0 && mediaFiles.some(m => m.type === 'image') && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {filters.map((filter) => (
                      <Button
                        key={filter.name}
                        variant={selectedFilter === filter.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.name)}
                        className="flex-shrink-0"
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Post Details Section */}
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-500">sarahj_travels</p>
              </div>
            </div>
            
            {/* Caption */}
            <div>
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
            
            {/* Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select onValueChange={(value) => {
                const loc = mockLocations.find(l => l.id === value)
                setLocation(loc || null)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Add location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {loc.name}, {loc.country}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button onClick={addTag} size="sm">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    #{tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Schedule */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Schedule Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Privacy Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Allow comments</span>
                  <Button
                    variant={allowComments ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAllowComments(!allowComments)}
                  >
                    {allowComments ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show location</span>
                  <Button
                    variant={showLocation ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowLocation(!showLocation)}
                  >
                    {showLocation ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Post visibility</span>
                  <Button
                    variant={isPublic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPublic(!isPublic)}
                  >
                    {isPublic ? "Public" : "Private"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePostSubmit}
                disabled={isUploading || mediaFiles.length === 0}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : scheduleDate ? "Schedule Post" : "Share Post"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'image')}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFileChange(e, 'video')}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  )
}