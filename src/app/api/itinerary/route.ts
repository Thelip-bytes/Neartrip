import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ItineraryRequest {
  destination: string
  duration: number
  budget: string
  travelStyle: string
  interests: string[]
  groupSize: number
  accommodation: string
  transportation: string
}

interface ItineraryActivity {
  id: string
  name: string
  description: string
  location: string
  duration: string
  startTime: string
  category: string
  cost: string
  tips?: string[]
  priority: string
}

interface ItineraryDay {
  day: number
  date: string
  activities: ItineraryActivity[]
  totalDuration: string
  estimatedCost: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ItineraryRequest = await request.json()
    
    // Validate required fields
    if (!body.destination || !body.duration) {
      return NextResponse.json(
        { error: 'Destination and duration are required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create prompt for AI
    const prompt = `
    You are an expert travel planner. Create a detailed ${body.duration}-day itinerary for ${body.destination}.
    
    Travel Preferences:
    - Budget: ${body.budget}
    - Travel Style: ${body.travelStyle}
    - Group Size: ${body.groupSize}
    - Interests: ${body.interests.join(', ')}
    - Transportation: ${body.transportation}
    - Special Requirements: ${body.accommodation || 'None'}
    
    Please provide a day-by-day itinerary with the following structure for each day:
    - Day number and date
    - 3-4 activities with realistic timing
    - Each activity should include: name, description, location, duration, start time, category, cost, and pro tips
    - Total duration and estimated cost for the day
    
    Categories to use: sightseeing, dining, transport, accommodation, activity, relaxation
    - Make activities realistic and well-timed
    - Include local insights and practical tips
    - Consider travel time between locations
    - Match the budget level specified
    - Include a mix of activities based on interests
    
    Return the response in JSON format with this structure:
    {
      "itinerary": [
        {
          "day": 1,
          "date": "2024-01-15",
          "activities": [
            {
              "id": "1-1",
              "name": "Activity Name",
              "description": "Detailed description",
              "location": "Location name",
              "duration": "2 hours",
              "startTime": "09:00",
              "category": "sightseeing",
              "cost": "$25",
              "tips": ["Tip 1", "Tip 2"],
              "priority": "high"
            }
          ],
          "totalDuration": "8 hours",
          "estimatedCost": "$150"
        }
      ]
    }
    `

    // Call AI to generate itinerary
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert travel planner who creates detailed, realistic, and helpful travel itineraries. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    // Parse the AI response
    let itineraryData
    try {
      const responseContent = completion.choices[0]?.message?.content || ''
      // Extract JSON from the response (in case AI adds extra text)
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        itineraryData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback to mock data if AI response is invalid
      itineraryData = generateMockItinerary(body)
    }

    return NextResponse.json(itineraryData)
  } catch (error) {
    console.error('Itinerary generation error:', error)
    
    // Fallback to mock data
    const body: ItineraryRequest = await request.json()
    const fallbackData = generateMockItinerary(body)
    
    return NextResponse.json(fallbackData)
  }
}

// Fallback mock data generator
function generateMockItinerary(request: ItineraryRequest) {
  const mockActivities = [
    {
      id: "1",
      name: "Historic City Center Walking Tour",
      description: "Explore the ancient heart of the city with a knowledgeable local guide",
      location: "Old Town Square",
      duration: "3 hours",
      startTime: "09:00",
      category: "sightseeing",
      cost: "$25",
      tips: ["Wear comfortable shoes", "Bring a camera", "Book in advance"],
      priority: "high"
    },
    {
      id: "2",
      name: "Traditional Local Restaurant",
      description: "Experience authentic local cuisine in a family-owned establishment",
      location: "Grandma's Kitchen",
      duration: "1.5 hours",
      startTime: "13:00",
      category: "dining",
      cost: "$35",
      tips: ["Try the signature dish", "Make reservations"],
      priority: "medium"
    },
    {
      id: "3",
      name: "Scenic Viewpoint Hike",
      description: "Hike to breathtaking panoramic views of the surrounding landscape",
      location: "Eagle Peak Trail",
      duration: "4 hours",
      startTime: "15:00",
      category: "activity",
      cost: "$15",
      tips: ["Bring water and snacks", "Wear hiking boots", "Check weather"],
      priority: "high"
    },
    {
      id: "4",
      name: "Local Art Museum Visit",
      description: "Discover the region's artistic heritage and contemporary works",
      location: "Municipal Art Museum",
      duration: "2 hours",
      startTime: "10:00",
      category: "sightseeing",
      cost: "$20",
      tips: ["Audio guide recommended", "Photography allowed in most areas"],
      priority: "medium"
    },
    {
      id: "5",
      name: "Sunset Beach Relaxation",
      description: "Unwind at the beautiful beach with stunning sunset views",
      location: "Golden Beach",
      duration: "2 hours",
      startTime: "17:00",
      category: "relaxation",
      cost: "$0",
      tips: ["Bring a towel", "Best time for photos is 30 min before sunset"],
      priority: "low"
    }
  ]

  const itinerary = Array.from({ length: request.duration }, (_, index) => ({
    day: index + 1,
    date: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    activities: mockActivities.slice(0, 3).map((activity, actIndex) => ({
      ...activity,
      id: `${index + 1}-${actIndex + 1}`,
      startTime: `${9 + actIndex * 3}:00`
    })),
    totalDuration: "8 hours",
    estimatedCost: `$${Math.floor(Math.random() * 150) + 100}`
  }))

  return { itinerary }
}