"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post/PostCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Post {
  id: string
  caption?: string
  location?: string
  createdAt: string
  isReel?: boolean
  author: {
    id: string
    name?: string
    username?: string
    avatar?: string
    isVerified?: boolean
  }
  place?: {
    id: string
    name: string
    category: string
  }
  media: Array<{
    id: string
    type: "IMAGE" | "VIDEO"
    url: string
    caption?: string
  }>
  _count?: {
    likes: number
    comments: number
    shares: number
  }
}

interface FeedProps {
  refreshTrigger?: number
}

export function Feed({ refreshTrigger = 0 }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Mock data for development
  const mockPosts: Post[] = [
    {
      id: "1",
      caption: "Amazing sunset at the lake today! Perfect spot for weekend relaxation 🌅",
      location: "Sunset Lake",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: {
        id: "1",
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      place: {
        id: "1",
        name: "Sunset Lake",
        category: "LAKE"
      },
      media: [
        {
          id: "1",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
          caption: "Beautiful sunset"
        }
      ],
      _count: {
        likes: 234,
        comments: 45,
        shares: 12
      }
    },
    {
      id: "2",
      caption: "Found this hidden gem in the city! The coffee here is incredible ☕",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      author: {
        id: "2",
        name: "Mike Chen",
        username: "mikec",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isVerified: false
      },
      place: {
        id: "2",
        name: "Hidden Cafe",
        category: "CAFE"
      },
      media: [
        {
          id: "2",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=600&h=600&fit=crop",
          caption: "Cozy cafe interior"
        }
      ],
      _count: {
        likes: 156,
        comments: 23,
        shares: 8
      }
    },
    {
      id: "3",
      caption: "Weekend hiking adventure! The view from the top was worth every step 🏔️",
      location: "Mountain Trail",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      isReel: true,
      author: {
        id: "3",
        name: "Emma Wilson",
        username: "emmaw",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      media: [
        {
          id: "3",
          type: "VIDEO",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
          caption: "Mountain view video"
        }
      ],
      _count: {
        likes: 445,
        comments: 67,
        shares: 34
      }
    },
    {
      id: "4",
      caption: "Perfect spot for a morning run! The park is so peaceful at dawn 🌳",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      author: {
        id: "4",
        name: "Alex Rivera",
        username: "alexr",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: false
      },
      place: {
        id: "3",
        name: "Central Park",
        category: "PARK"
      },
      media: [
        {
          id: "4",
          type: "IMAGE",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
          caption: "Morning in the park"
        }
      ],
      _count: {
        likes: 89,
        comments: 15,
        shares: 5
      }
    }
  ]

  const fetchPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, use mock data
      const newPosts = pageNum === 1 ? mockPosts : [...posts, ...mockPosts]
      
      setPosts(newPosts)
      setHasMore(pageNum < 5) // Simulate having 5 pages
      setError(null)
    } catch (err) {
      setError("Failed to load posts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1)
  }, [refreshTrigger])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }

  const refreshFeed = () => {
    setPage(1)
    fetchPosts(1)
  }

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-0">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            {/* Header skeleton */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Media skeleton */}
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            
            {/* Actions skeleton */}
            <div className="flex items-center justify-between p-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="px-3 pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
            </div>
            
            {/* Caption skeleton */}
            <div className="px-3 pb-3">
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={refreshFeed} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button 
            onClick={loadMore} 
            variant="outline" 
            disabled={loading}
            className="w-full max-w-xs"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Load More
          </Button>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end of the feed
        </div>
      )}
    </div>
  )
}