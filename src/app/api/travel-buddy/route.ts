import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

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

interface SearchRequest {
  destination?: string
  travelDates?: string
  duration?: number
  travelStyle?: string[]
  interests?: string[]
  budget?: string
  groupSize?: number
  ageRange?: [number, number]
  languages?: string[]
  preferences?: {
    smoking?: boolean
    drinking?: boolean
    adventureLevel?: number
    socialLevel?: number
  }
  searchQuery?: string
  limit?: number
}

interface MatchRequest {
  userId: string
  preferences: {
    destinations: string[]
    travelStyle: string[]
    interests: string[]
    budget: string
    ageRange: [number, number]
    languages: string[]
    preferences: {
      smoking: boolean
      drinking: boolean
      adventureLevel: number
      socialLevel: number
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'search') {
      return await handleSearch(data as SearchRequest)
    } else if (action === 'match') {
      return await handleMatching(data as MatchRequest)
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Travel buddy API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleSearch(request: SearchRequest) {
  // In a real implementation, this would:
  // 1. Query a database of users
  // 2. Apply filters based on search criteria
  // 3. Calculate match scores
  // 4. Return paginated results

  // For now, generate mock results
  const mockBuddies = generateMockBuddies(request)
  
  // Apply filters
  let filteredBuddies = mockBuddies

  if (request.destination) {
    filteredBuddies = filteredBuddies.filter(buddy => 
      buddy.destinations.includes(request.destination!)
    )
  }

  if (request.budget) {
    filteredBuddies = filteredBuddies.filter(buddy => buddy.budget === request.budget)
  }

  if (request.travelStyle && request.travelStyle.length > 0) {
    filteredBuddies = filteredBuddies.filter(buddy =>
      request.travelStyle!.some(style => buddy.travelStyle.includes(style))
    )
  }

  if (request.interests && request.interests.length > 0) {
    filteredBuddies = filteredBuddies.filter(buddy =>
      request.interests!.some(interest => buddy.interests.includes(interest))
    )
  }

  if (request.searchQuery) {
    filteredBuddies = filteredBuddies.filter(buddy =>
      buddy.name.toLowerCase().includes(request.searchQuery!.toLowerCase()) ||
      buddy.location.toLowerCase().includes(request.searchQuery!.toLowerCase()) ||
      buddy.bio.toLowerCase().includes(request.searchQuery!.toLowerCase())
    )
  }

  // Limit results
  const limitedBuddies = request.limit 
    ? filteredBuddies.slice(0, request.limit)
    : filteredBuddies

  return NextResponse.json({
    buddies: limitedBuddies,
    total: filteredBuddies.length,
    filters: request
  })
}

async function handleMatching(request: MatchRequest) {
  try {
    // Initialize ZAI SDK for AI-powered matching
    const zai = await ZAI.create()

    // Create prompt for AI matching
    const prompt = `
    You are an expert travel matching system. Calculate compatibility scores between travelers based on their preferences.
    
    User Preferences:
    - Destinations: ${request.preferences.destinations.join(', ')}
    - Travel Style: ${request.preferences.travelStyle.join(', ')}
    - Interests: ${request.preferences.interests.join(', ')}
    - Budget: ${request.preferences.budget}
    - Age Range: ${request.preferences.ageRange[0]} - ${request.preferences.ageRange[1]}
    - Languages: ${request.preferences.languages.join(', ')}
    - Lifestyle: Smoking=${request.preferences.preferences.smoking}, Drinking=${request.preferences.preferences.drinking}, Adventure Level=${request.preferences.preferences.adventureLevel}/10, Social Level=${request.preferences.preferences.socialLevel}/10
    
    Please provide a detailed compatibility analysis and suggest the top 5 most compatible travel buddies from our database.
    
    Return the response in JSON format with this structure:
    {
      "matches": [
        {
          "userId": "buddy-id",
          "matchScore": 95,
          "compatibilityAnalysis": {
            "destinations": "High compatibility - both interested in similar destinations",
            "travelStyle": "Excellent match - identical travel preferences",
            "interests": "Strong alignment in interests and activities",
            "budget": "Good match - compatible budget ranges",
            "lifestyle": "Great compatibility in lifestyle preferences"
          },
          "strengths": ["Shared love for adventure", "Similar budget range", "Compatible schedules"],
          "potentialChallenges": ["Different language preferences", "Slight age gap"]
        }
      ],
      "recommendations": "Based on your preferences, we recommend focusing on buddies who share your passion for adventure and have compatible budgets."
    }
    `

    // Call AI for matching analysis
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert travel matching system. Always respond with valid JSON and provide detailed compatibility analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })

    // Parse AI response
    let matchData
    try {
      const responseContent = completion.choices[0]?.message?.content || ''
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        matchData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback to simple matching
      matchData = generateFallbackMatches(request)
    }

    return NextResponse.json(matchData)
  } catch (error) {
    console.error('AI matching error:', error)
    // Fallback to simple matching
    const fallbackData = generateFallbackMatches(request)
    return NextResponse.json(fallbackData)
  }
}

function generateMockBuddies(request: SearchRequest): TravelBuddy[] {
  const mockBuddiesData = [
    {
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
      isVerified: true,
      lastActive: "2 hours ago",
      stats: { tripsCompleted: 12, reviewsReceived: 28, averageRating: 4.8 },
      preferences: { smoking: false, drinking: true, earlyBird: true, nightOwl: false, vegetarian: false, adventureLevel: 8, socialLevel: 7 }
    },
    {
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
      isVerified: true,
      lastActive: "5 hours ago",
      stats: { tripsCompleted: 18, reviewsReceived: 35, averageRating: 4.9 },
      preferences: { smoking: false, drinking: true, earlyBird: false, nightOwl: true, vegetarian: true, adventureLevel: 6, socialLevel: 9 }
    },
    {
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
      isVerified: false,
      lastActive: "1 day ago",
      stats: { tripsCompleted: 8, reviewsReceived: 15, averageRating: 4.6 },
      preferences: { smoking: false, drinking: true, earlyBird: true, nightOwl: true, vegetarian: false, adventureLevel: 9, socialLevel: 8 }
    },
    {
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
      isVerified: true,
      lastActive: "3 hours ago",
      stats: { tripsCompleted: 15, reviewsReceived: 22, averageRating: 4.7 },
      preferences: { smoking: false, drinking: false, earlyBird: true, nightOwl: false, vegetarian: false, adventureLevel: 4, socialLevel: 6 }
    }
  ]

  return mockBuddiesData.map((buddyData, index) => ({
    id: `buddy-${index + 1}`,
    ...buddyData,
    matchScore: Math.floor(Math.random() * 30) + 70 // Random match score between 70-100
  }))
}

function generateFallbackMatches(request: MatchRequest) {
  return {
    matches: [
      {
        userId: "buddy-1",
        matchScore: 95,
        compatibilityAnalysis: {
          destinations: "High compatibility - both interested in similar destinations",
          travelStyle: "Excellent match - identical travel preferences",
          interests: "Strong alignment in interests and activities",
          budget: "Good match - compatible budget ranges",
          lifestyle: "Great compatibility in lifestyle preferences"
        },
        strengths: ["Shared love for adventure", "Similar budget range", "Compatible schedules"],
        potentialChallenges: ["Different language preferences", "Slight age gap"]
      },
      {
        userId: "buddy-2",
        matchScore: 88,
        compatibilityAnalysis: {
          destinations: "Good compatibility - some overlapping destinations",
          travelStyle: "Good match - similar travel preferences",
          interests: "Moderate alignment in interests",
          budget: "Acceptable match - budget ranges work",
          lifestyle: "Good compatibility in most areas"
        },
        strengths: ["Complementary interests", "Good communication", "Flexible schedules"],
        potentialChallenges: ["Different adventure levels", "Budget constraints"]
      }
    ],
    recommendations: "Based on your preferences, we recommend focusing on buddies who share your passion for adventure and have compatible budgets."
  }
}