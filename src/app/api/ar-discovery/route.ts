import { NextRequest, NextResponse } from 'next/server'

interface Location {
  lat: number
  lng: number
}

interface ARPlace {
  id: string
  name: string
  description: string
  category: string
  distance: number
  direction: number
  rating: number
  isVerified: boolean
  image?: string
  tags: string[]
  highlights: string[]
  currentVisitors: number
  estimatedWaitTime?: string
  latitude: number
  longitude: number
}

interface DiscoveryRequest {
  location: Location
  heading: number
  radius: number
  category?: string
  limit?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: DiscoveryRequest = await request.json()
    
    // Validate required fields
    if (!body.location || !body.location.lat || !body.location.lng) {
      return NextResponse.json(
        { error: 'Location with latitude and longitude is required' },
        { status: 400 }
      )
    }

    // In a real implementation, this would:
    // 1. Query a database of places
    // 2. Use Google Places API or similar service
    // 3. Calculate distances and directions
    // 4. Filter by category and radius
    // 5. Return real-time data

    // For now, generate mock places around the user's location
    const places = generateMockPlaces(body.location, body.heading, body.radius || 1000)
    
    // Filter by category if specified
    const filteredPlaces = body.category 
      ? places.filter(place => place.category === body.category)
      : places

    // Limit results if specified
    const limitedPlaces = body.limit 
      ? filteredPlaces.slice(0, body.limit)
      : filteredPlaces

    return NextResponse.json({
      places: limitedPlaces,
      total: filteredPlaces.length,
      location: body.location,
      heading: body.heading,
      radius: body.radius || 1000
    })
  } catch (error) {
    console.error('AR discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover places' },
      { status: 500 }
    )
  }
}

function generateMockPlaces(userLocation: Location, userHeading: number, radius: number): ARPlace[] {
  const mockPlacesData = [
    {
      name: "Sunset Restaurant",
      description: "Fine dining with panoramic city views and exceptional cuisine",
      category: "restaurant",
      rating: 4.8,
      isVerified: true,
      tags: ["fine dining", "romantic", "views", "wine"],
      highlights: ["Live music weekends", "Rooftop seating", "Award-winning chef"],
      currentVisitors: 23,
      estimatedWaitTime: "15-20 min"
    },
    {
      name: "Historic Museum",
      description: "Ancient artifacts and interactive exhibits spanning 2000 years of history",
      category: "attraction",
      rating: 4.6,
      isVerified: true,
      tags: ["history", "culture", "education", "family-friendly"],
      highlights: ["VR experiences", "Guided tours", "Gift shop"],
      currentVisitors: 67,
      estimatedWaitTime: "5-10 min"
    },
    {
      name: "Artisan Coffee House",
      description: "Specialty coffee roastery with locally sourced beans and cozy atmosphere",
      category: "cafe",
      rating: 4.9,
      isVerified: false,
      tags: ["coffee", "wifi", "workspace", "pastries"],
      highlights: ["Coffee brewing classes", "Local art displays", "Pet-friendly"],
      currentVisitors: 12,
      estimatedWaitTime: "No wait"
    },
    {
      name: "Central Park",
      description: "Lush green space with walking trails, lake, and recreational facilities",
      category: "nature",
      rating: 4.7,
      isVerified: true,
      tags: ["nature", "walking", "relaxation", "family"],
      highlights: ["Boat rentals", "Outdoor concerts", "Playground"],
      currentVisitors: 156,
      estimatedWaitTime: "No wait"
    },
    {
      name: "Luxury Shopping Mall",
      description: "Premium shopping destination with designer brands and entertainment complex",
      category: "shopping",
      rating: 4.4,
      isVerified: true,
      tags: ["luxury", "shopping", "dining", "entertainment"],
      highlights: ["Designer stores", "Food court", "Cinema complex"],
      currentVisitors: 234,
      estimatedWaitTime: "No wait"
    },
    {
      name: "Tech Innovation Center",
      description: "Interactive technology museum showcasing the latest innovations and future trends",
      category: "attraction",
      rating: 4.5,
      isVerified: true,
      tags: ["technology", "innovation", "interactive", "education"],
      highlights: ["VR experiences", "AI demonstrations", "Coding workshops"],
      currentVisitors: 89,
      estimatedWaitTime: "10-15 min"
    },
    {
      name: "Ocean View Cafe",
      description: "Seaside cafe with fresh seafood and stunning ocean views",
      category: "cafe",
      rating: 4.7,
      isVerified: false,
      tags: ["seafood", "ocean views", "cafe", "relaxation"],
      highlights: ["Fresh seafood", "Sunset views", "Outdoor seating"],
      currentVisitors: 34,
      estimatedWaitTime: "5-10 min"
    },
    {
      name: "Adventure Sports Center",
      description: "Extreme sports facility offering rock climbing, zip-lining, and bungee jumping",
      category: "entertainment",
      rating: 4.6,
      isVerified: true,
      tags: ["adventure", "sports", "extreme", "outdoor"],
      highlights: ["Professional instructors", "Safety equipment", "Group packages"],
      currentVisitors: 45,
      estimatedWaitTime: "20-30 min"
    }
  ]

  // Generate places around user location
  return mockPlacesData.map((placeData, index) => {
    // Generate random position around user location within radius
    const angle = (index * 45 + Math.random() * 30) * Math.PI / 180 // Convert to radians
    const distance = Math.random() * radius * 0.8 + radius * 0.1 // Between 10% and 90% of radius
    
    const placeLocation = {
      lat: userLocation.lat + (distance / 111000) * Math.cos(angle), // 111km ≈ 1 degree latitude
      lng: userLocation.lng + (distance / (111000 * Math.cos(userLocation.lat * Math.PI / 180))) * Math.sin(angle)
    }

    // Calculate direction from user to place
    const direction = Math.atan2(
      placeLocation.lng - userLocation.lng,
      placeLocation.lat - userLocation.lat
    ) * 180 / Math.PI

    // Normalize direction to 0-360
    const normalizedDirection = (direction + 360) % 360

    return {
      id: `place-${index + 1}`,
      ...placeData,
      distance: Math.round(distance),
      direction: Math.round(normalizedDirection),
      latitude: placeLocation.lat,
      longitude: placeLocation.lng
    }
  })
}