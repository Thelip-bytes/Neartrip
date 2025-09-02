"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Users, 
  Search, 
  Heart, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Star,
  Filter,
  Sparkles,
  Plane,
  Coffee,
  Mountain,
  Camera,
  Music,
  Utensils,
  Book,
  Dumbbell,
  Palette,
  Gamepad2,
  Briefcase,
  HeartHandshake,
  Send,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TravelBuddy {
  id: string
  name: string
  age: number
  location: string
  bio: string
  travelStyle: string[]
  interests: string[]
  destinations: string[]
  availability: string
  budget: string
  languages: string[]
  matchScore: number
  isVerified: boolean
  lastActive: string
  stats: {
    tripsCompleted: number
    reviewsReceived: number
    averageRating: number
  }
  preferences: {
    smoking: boolean
    drinking: boolean
    earlyBird: boolean
    nightOwl: boolean
    vegetarian: boolean
    adventureLevel: number
    socialLevel: number
  }
}

interface TravelBuddyRequest {
  destination: string
  travelDates: string
  duration: number
  travelStyle: string[]
  interests: string[]
  budget: string
  groupSize: number
  ageRange: [number, number]
  languages: string[]
  preferences: {
    smoking: boolean
    drinking: boolean
    adventureLevel: number
    socialLevel: number
  }
}

interface TravelBuddyMatchingProps {
  onBuddySelect?: (buddy: TravelBuddy) => void
}

export function TravelBuddyMatching({ onBuddySelect }: TravelBuddyMatchingProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [selectedBudget, setSelectedBudget] = useState("")
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [buddies, setBuddies] = useState<TravelBuddy[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")
  const { toast } = useToast()

  const destinations = [
    "Bali, Indonesia", "Tokyo, Japan", "Paris, France", "New York, USA", 
    "Rome, Italy", "Barcelona, Spain", "Bangkok, Thailand", "London, UK",
    "Sydney, Australia", "Dubai, UAE", "Singapore", "Amsterdam, Netherlands"
  ]

  const travelStyles = [
    "Adventure", "Relaxation", "Cultural", "Budget", "Luxury", "Backpacking",
    "Business", "Family", "Solo", "Group", "Romantic", "Digital Nomad"
  ]

  const interests = [
    { icon: Mountain, label: "Hiking & Nature" },
    { icon: Camera, label: "Photography" },
    { icon: Utensils, label: "Food & Dining" },
    { icon: Music, label: "Music & Nightlife" },
    { icon: Book, label: "History & Culture" },
    { icon: Dumbbell, label: "Sports & Fitness" },
    { icon: Palette, label: "Art & Museums" },
    { icon: Gamepad2, label: "Entertainment" },
    { icon: Briefcase, label: "Shopping" },
    { icon: Coffee, label: "Cafes & Workspaces" }
  ]

  const budgetRanges = [
    "Budget ($500-1000)", "Mid-range ($1000-2000)", "Comfortable ($2000-3500)", "Luxury ($3500+)"
  ]

  // Mock travel buddies data
  const mockBuddies: TravelBuddy[] = [
    {
      id: "1",
      name: "Sarah Chen",
      age: 28,
      location: "San Francisco, USA",
      bio: "Adventure seeker and photography enthusiast. Love exploring hidden gems and local cultures. Always up for spontaneous trips!",
      travelStyle: ["Adventure", "Cultural", "Budget"],
      interests: ["Hiking & Nature", "Photography", "Food & Dining"],
      destinations: ["Bali, Indonesia", "Tokyo, Japan", "Bangkok, Thailand"],
      availability: "Flexible",
      budget: "Mid-range ($1000-2000)",
      languages: ["English", "Mandarin"],
      matchScore: 95,
      isVerified: true,
      lastActive: "2 hours ago",
      stats: {
        tripsCompleted: 12,
        reviewsReceived: 28,
        averageRating: 4.8
      },
      preferences: {
        smoking: false,
        drinking: true,
        earlyBird: true,
        nightOwl: false,
        vegetarian: false,
        adventureLevel: 8,
        socialLevel: 7
      }
    },
    {
      id: "2",
      name: "Marco Rodriguez",
      age: 32,
      location: "Barcelona, Spain",
      bio: "Digital nomad and food lover. Seeking travel buddies for culinary adventures and cultural experiences. Fluent in 4 languages!",
      travelStyle: ["Cultural", "Relaxation", "Digital Nomad"],
      interests: ["Food & Dining", "History & Culture", "Art & Museums"],
      destinations: ["Rome, Italy", "Paris, France", "London, UK"],
      availability: "Weekends",
      budget: "Comfortable ($2000-3500)",
      languages: ["Spanish", "English", "Italian", "French"],
      matchScore: 88,
      isVerified: true,
      lastActive: "5 hours ago",
      stats: {
        tripsCompleted: 18,
        reviewsReceived: 35,
        averageRating: 4.9
      },
      preferences: {
        smoking: false,
        drinking: true,
        earlyBird: false,
        nightOwl: true,
        vegetarian: true,
        adventureLevel: 6,
        socialLevel: 9
      }
    },
    {
      id: "3",
      name: "Emma Johnson",
      age: 25,
      location: "London, UK",
      bio: "Backpacker and budget travel expert. Love meeting new people and sharing travel stories. Always looking for the next adventure!",
      travelStyle: ["Backpacking", "Budget", "Adventure"],
      interests: ["Hiking & Nature", "Sports & Fitness", "Entertainment"],
      destinations: ["Bali, Indonesia", "Sydney, Australia", "Bangkok, Thailand"],
      availability: "Flexible",
      budget: "Budget ($500-1000)",
      languages: ["English", "French"],
      matchScore: 82,
      isVerified: false,
      lastActive: "1 day ago",
      stats: {
        tripsCompleted: 8,
        reviewsReceived: 15,
        averageRating: 4.6
      },
      preferences: {
        smoking: false,
        drinking: true,
        earlyBird: true,
        nightOwl: true,
        vegetarian: false,
        adventureLevel: 9,
        socialLevel: 8
      }
    },
    {
      id: "4",
      name: "Yuki Tanaka",
      age: 30,
      location: "Tokyo, Japan",
      bio: "Luxury travel enthusiast and art lover. Seeking sophisticated travel companions for high-end experiences and cultural immersion.",
      travelStyle: ["Luxury", "Cultural", "Romantic"],
      interests: ["Art & Museums", "Shopping", "Food & Dining"],
      destinations: ["Paris, France", "New York, USA", "Singapore"],
      availability: "Flexible",
      budget: "Luxury ($3500+)",
      languages: ["Japanese", "English"],
      matchScore: 78,
      isVerified: true,
      lastActive: "3 hours ago",
      stats: {
        tripsCompleted: 15,
        reviewsReceived: 22,
        averageRating: 4.7
      },
      preferences: {
        smoking: false,
        drinking: false,
        earlyBird: true,
        nightOwl: false,
        vegetarian: false,
        adventureLevel: 4,
        socialLevel: 6
      }
    }
  ]

  useEffect(() => {
    // Load initial buddies
    setBuddies(mockBuddies)
  }, [])

  const searchBuddies = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter buddies based on search criteria
      let filteredBuddies = mockBuddies

      if (selectedDestination) {
        filteredBuddies = filteredBuddies.filter(buddy => 
          buddy.destinations.includes(selectedDestination)
        )
      }

      if (selectedBudget) {
        filteredBuddies = filteredBuddies.filter(buddy => buddy.budget === selectedBudget)
      }

      if (selectedTravelStyle.length > 0) {
        filteredBuddies = filteredBuddies.filter(buddy =>
          selectedTravelStyle.some(style => buddy.travelStyle.includes(style))
        )
      }

      if (selectedInterests.length > 0) {
        filteredBuddies = filteredBuddies.filter(buddy =>
          selectedInterests.some(interest => buddy.interests.includes(interest))
        )
      }

      if (searchQuery) {
        filteredBuddies = filteredBuddies.filter(buddy =>
          buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          buddy.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          buddy.bio.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      setBuddies(filteredBuddies)
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search for travel buddies. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTravelStyle = (style: string) => {
    setSelectedTravelStyle(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    )
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 dark:bg-green-900/20"
    if (score >= 80) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
    if (score >= 70) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
  }

  const getAdventureLevelColor = (level: number) => {
    if (level >= 8) return "bg-red-500"
    if (level >= 6) return "bg-orange-500"
    if (level >= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getSocialLevelColor = (level: number) => {
    if (level >= 8) return "bg-purple-500"
    if (level >= 6) return "bg-blue-500"
    if (level >= 4) return "bg-cyan-500"
    return "bg-gray-500"
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <HeartHandshake className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold gradient-primary-text">Travel Buddy Matching</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Find your perfect travel companion based on shared interests and travel style
        </p>
      </div>

      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover Buddies</TabsTrigger>
          <TabsTrigger value="my-profile">My Profile</TabsTrigger>
          <TabsTrigger value="matches">My Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Find Your Travel Buddy
              </CardTitle>
              <CardDescription>
                Filter by destination, travel style, and interests to find compatible companions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, location, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={searchBuddies} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="Where are you going?" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map(destination => (
                        <SelectItem key={destination} value={destination}>
                          {destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget Range</label>
                  <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map(budget => (
                        <SelectItem key={budget} value={budget}>
                          {budget}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Travel Style</label>
                <div className="flex flex-wrap gap-2">
                  {travelStyles.map(style => (
                    <Badge
                      key={style}
                      variant={selectedTravelStyle.includes(style) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-all-300"
                      onClick={() => toggleTravelStyle(style)}
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Interests</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {interests.map(({ icon: Icon, label }) => (
                    <Badge
                      key={label}
                      variant={selectedInterests.includes(label) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-all-300 flex items-center gap-1"
                      onClick={() => toggleInterest(label)}
                    >
                      <Icon className="h-3 w-3" />
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {buddies.length} Potential Buddies Found
              </h3>
              <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Match
              </Button>
            </div>

            {buddies.map(buddy => (
              <Card key={buddy.id} className="glass-effect hover:scale-105 transition-all-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`/api/placeholder/avatar/${buddy.id}`} />
                        <AvatarFallback>{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {buddy.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{buddy.name}, {buddy.age}</h4>
                            {buddy.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                            <Badge className={getMatchScoreColor(buddy.matchScore)}>
                              {buddy.matchScore}% Match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {buddy.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {buddy.availability}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {buddy.stats.averageRating} ({buddy.stats.reviewsReceived})
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {buddy.bio}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {buddy.travelStyle.slice(0, 3).map(style => (
                          <Badge key={style} variant="outline" className="text-xs">
                            {style}
                          </Badge>
                        ))}
                        {buddy.interests.slice(0, 2).map(interest => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>Adventure:</span>
                            <div className={`w-2 h-2 rounded-full ${getAdventureLevelColor(buddy.preferences.adventureLevel)}`} />
                            <span>{buddy.preferences.adventureLevel}/10</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Social:</span>
                            <div className={`w-2 h-2 rounded-full ${getSocialLevelColor(buddy.preferences.socialLevel)}`} />
                            <span>{buddy.preferences.socialLevel}/10</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Plane className="h-3 w-3" />
                            <span>{buddy.stats.tripsCompleted} trips</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {buddy.name}'s Travel Profile
                                  {buddy.isVerified && (
                                    <Badge variant="secondary" className="text-xs">
                                      ✓ Verified
                                    </Badge>
                                  )}
                                </DialogTitle>
                                <DialogDescription>
                                  Learn more about {buddy.name}'s travel preferences and style
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h5 className="font-medium mb-3">Basic Info</h5>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Age:</span>
                                        <span>{buddy.age}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Location:</span>
                                        <span>{buddy.location}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Budget:</span>
                                        <span>{buddy.budget}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Availability:</span>
                                        <span>{buddy.availability}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Languages:</span>
                                        <span>{buddy.languages.join(', ')}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-medium mb-3">Travel Stats</h5>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Trips Completed:</span>
                                        <span>{buddy.stats.tripsCompleted}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Reviews Received:</span>
                                        <span>{buddy.stats.reviewsReceived}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Average Rating:</span>
                                        <div className="flex items-center gap-1">
                                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                          <span>{buddy.stats.averageRating}</span>
                                        </div>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Last Active:</span>
                                        <span>{buddy.lastActive}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-medium mb-3">Travel Preferences</h5>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-500">Adventure Level:</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                          <div 
                                            className={`h-2 rounded-full ${getAdventureLevelColor(buddy.preferences.adventureLevel)}`}
                                            style={{ width: `${buddy.preferences.adventureLevel * 10}%` }}
                                          />
                                        </div>
                                        <span>{buddy.preferences.adventureLevel}/10</span>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Social Level:</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                          <div 
                                            className={`h-2 rounded-full ${getSocialLevelColor(buddy.preferences.socialLevel)}`}
                                            style={{ width: `${buddy.preferences.socialLevel * 10}%` }}
                                          />
                                        </div>
                                        <span>{buddy.preferences.socialLevel}/10</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-medium mb-3">Lifestyle Preferences</h5>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Checkbox checked={buddy.preferences.earlyBird} />
                                      <span>Early Bird</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox checked={buddy.preferences.nightOwl} />
                                      <span>Night Owl</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox checked={buddy.preferences.smoking} />
                                      <span>Smoking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox checked={buddy.preferences.drinking} />
                                      <span>Drinking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox checked={buddy.preferences.vegetarian} />
                                      <span>Vegetarian</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-medium mb-3">Preferred Destinations</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {buddy.destinations.map(destination => (
                                      <Badge key={destination} variant="outline">
                                        {destination}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                  <Button 
                                    onClick={() => {
                                      setSelectedBuddy(buddy)
                                      if (onBuddySelect) onBuddySelect(buddy)
                                    }}
                                    className="flex-1 gradient-primary"
                                  >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Send Message
                                  </Button>
                                  <Button variant="outline">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button 
                            onClick={() => {
                              if (onBuddySelect) onBuddySelect(buddy)
                            }}
                            className="gradient-primary"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-profile" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>My Travel Profile</CardTitle>
              <CardDescription>
                Complete your profile to get better travel buddy matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">Profile setup coming soon!</p>
                <Button variant="outline">Complete Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>My Matches</CardTitle>
              <CardDescription>
                View and manage your travel buddy connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">No matches yet. Start discovering buddies!</p>
                <Button onClick={() => setActiveTab("discover")}>Discover Buddies</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}