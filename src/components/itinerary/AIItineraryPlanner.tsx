"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Plane, Car, Utensils, Camera, Star, Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ItineraryDay {
  day: number
  date: string
  activities: ItineraryActivity[]
  totalDuration: string
  estimatedCost: string
}

interface ItineraryActivity {
  id: string
  name: string
  description: string
  location: string
  duration: string
  startTime: string
  category: "sightseeing" | "dining" | "transport" | "accommodation" | "activity" | "relaxation"
  cost: string
  tips?: string[]
  priority: "high" | "medium" | "low"
}

interface ItineraryRequest {
  destination: string
  duration: number
  budget: string
  travelStyle: "adventure" | "relaxation" | "cultural" | "budget" | "luxury"
  interests: string[]
  groupSize: number
  accommodation: string
  transportation: string
}

interface AIItineraryPlannerProps {
  onItineraryGenerated?: (itinerary: ItineraryDay[]) => void
}

export function AIItineraryPlanner({ onItineraryGenerated }: AIItineraryPlannerProps) {
  const [request, setRequest] = useState<ItineraryRequest>({
    destination: "",
    duration: 3,
    budget: "",
    travelStyle: "cultural",
    interests: [],
    groupSize: 1,
    accommodation: "",
    transportation: ""
  })
  
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [loading, setLoading] = useState(false)
  const [customInterests, setCustomInterests] = useState("")
  const { toast } = useToast()

  const travelStyles = [
    { value: "adventure", label: "Adventure", icon: "🏔️" },
    { value: "relaxation", label: "Relaxation", icon: "🧘" },
    { value: "cultural", label: "Cultural", icon: "🏛️" },
    { value: "budget", label: "Budget", icon: "💰" },
    { value: "luxury", label: "Luxury", icon: "✨" }
  ]

  const interestOptions = [
    "History & Culture", "Food & Dining", "Nature & Wildlife", "Adventure Sports",
    "Shopping", "Nightlife", "Art & Museums", "Photography", "Beaches", "Mountains",
    "Local Markets", "Architecture", "Music & Entertainment", "Wellness & Spa"
  ]

  const generateItinerary = async () => {
    if (!request.destination || !request.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in destination and duration.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to generate itinerary')
      }

      const data = await response.json()
      setItinerary(data.itinerary)
      
      if (onItineraryGenerated) {
        onItineraryGenerated(data.itinerary)
      }

      toast({
        title: "Itinerary Generated!",
        description: "Your personalized travel itinerary is ready.",
      })
    } catch (error) {
      console.error('Error generating itinerary:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addCustomInterest = () => {
    if (customInterests.trim() && !request.interests.includes(customInterests.trim())) {
      setRequest(prev => ({
        ...prev,
        interests: [...prev.interests, customInterests.trim()]
      }))
      setCustomInterests("")
    }
  }

  const addInterest = (interest: string) => {
    if (!request.interests.includes(interest)) {
      setRequest(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    }
  }

  const removeInterest = (interest: string) => {
    setRequest(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sightseeing": return <Camera className="h-4 w-4" />
      case "dining": return <Utensils className="h-4 w-4" />
      case "transport": return <Car className="h-4 w-4" />
      case "accommodation": return <MapPin className="h-4 w-4" />
      case "activity": return <Star className="h-4 w-4" />
      case "relaxation": return <Sparkles className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sightseeing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "dining": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "transport": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "accommodation": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "activity": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "relaxation": return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold gradient-primary-text">AI Travel Itinerary Planner</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Let AI create your perfect personalized travel itinerary
        </p>
      </div>

      <Tabs defaultValue="planner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="planner">Plan Your Trip</TabsTrigger>
          <TabsTrigger value="itinerary" disabled={!itinerary.length}>Your Itinerary</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Tell us about your travel preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Input
                    placeholder="Where do you want to go?"
                    value={request.destination}
                    onChange={(e) => setRequest(prev => ({ ...prev, destination: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (days)</label>
                  <Select value={request.duration.toString()} onValueChange={(value) => setRequest(prev => ({ ...prev, duration: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14].map(days => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} {days === 1 ? 'day' : 'days'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget</label>
                  <Select value={request.budget} onValueChange={(value) => setRequest(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget ($50-100/day)</SelectItem>
                      <SelectItem value="mid-range">Mid-range ($100-200/day)</SelectItem>
                      <SelectItem value="comfortable">Comfortable ($200-350/day)</SelectItem>
                      <SelectItem value="luxury">Luxury ($350+/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Style</label>
                  <Select value={request.travelStyle} onValueChange={(value: any) => setRequest(prev => ({ ...prev, travelStyle: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {travelStyles.map(style => (
                        <SelectItem key={style.value} value={style.value}>
                          <span className="mr-2">{style.icon}</span>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Size</label>
                  <Select value={request.groupSize.toString()} onValueChange={(value) => setRequest(prev => ({ ...prev, groupSize: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Solo (1 person)</SelectItem>
                      <SelectItem value="2">Couple (2 people)</SelectItem>
                      <SelectItem value="3-4">Small Group (3-4 people)</SelectItem>
                      <SelectItem value="5+">Large Group (5+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transportation Preference</label>
                  <Select value={request.transportation} onValueChange={(value) => setRequest(prev => ({ ...prev, transportation: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How will you get around?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Transport</SelectItem>
                      <SelectItem value="rental">Rental Car</SelectItem>
                      <SelectItem value="walking">Mostly Walking</SelectItem>
                      <SelectItem value="taxi">Taxi/Rideshare</SelectItem>
                      <SelectItem value="mixed">Mixed Transportation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Interests</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {interestOptions.map(interest => (
                    <Badge
                      key={interest}
                      variant={request.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-all-300"
                      onClick={() => request.interests.includes(interest) ? removeInterest(interest) : addInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom interest..."
                    value={customInterests}
                    onChange={(e) => setCustomInterests(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                  />
                  <Button variant="outline" onClick={addCustomInterest}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Preferences</label>
                <Textarea
                  placeholder="Any specific requirements, dietary restrictions, accessibility needs, or special occasions?"
                  value={request.accommodation}
                  onChange={(e) => setRequest(prev => ({ ...prev, accommodation: e.target.value }))}
                  rows={3}
                />
              </div>

              <Button 
                onClick={generateItinerary} 
                disabled={loading}
                className="w-full gradient-primary hover:scale-105 transition-all-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Your Itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Itinerary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-4">
          {itinerary.map((day) => (
            <Card key={day.day} className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Day {day.day} - {day.date}
                    </CardTitle>
                    <CardDescription>
                      {day.totalDuration} • Estimated cost: {day.estimatedCost}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {day.activities.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{activity.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {activity.startTime} ({activity.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {activity.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {activity.cost}
                          </div>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(activity.category)}>
                        {getCategoryIcon(activity.category)}
                        <span className="ml-1 capitalize">{activity.category}</span>
                      </Badge>
                    </div>
                    
                    {activity.tips && activity.tips.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">💡 Pro Tips:</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {activity.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}