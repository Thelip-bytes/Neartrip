"use client"

import { useState } from "react"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileTabs } from "./ProfileTabs"
import { UserSettings } from "./UserSettings"
import { PostCard } from "../post/PostCard"
import { PlaceCard } from "../place/PlaceCard"
import { TravelStatistics } from "./TravelStatistics"
import { TravelMap } from "./TravelMap"
import { TravelBucketList } from "./TravelBucketList"
import { TravelBadges } from "./TravelBadges"
import { TravelStories } from "./TravelStories"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Settings, User } from "lucide-react"

interface ProfilePageProps {
  userId?: string
}

// Mock data for demonstration
const mockUser = {
  id: "1",
  name: "Sarah Johnson",
  username: "sarahj_travels",
  email: "sarah@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  isVerified: true,
  bio: "🌍 Travel enthusiast | 📸 Photography lover | ✈️ Exploring the world one place at a time",
  location: "San Francisco, CA",
  joinedAt: "2023-01-15",
  website: "sarahtravels.com",
  _count: {
    posts: 24,
    followers: 1240,
    following: 350
  }
}

const mockPosts = [
  {
    id: "1",
    caption: "Amazing sunset views from the Golden Gate Bridge 🌅 The colors were absolutely breathtaking! #sunset #sanfrancisco #goldengate",
    location: "San Francisco, CA",
    createdAt: "2024-01-15T10:30:00Z",
    author: mockUser,
    place: {
      id: "1",
      name: "Golden Gate Bridge",
      category: "CITY_SPOT"
    },
    media: [
      {
        id: "1",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        caption: "Golden Gate Bridge sunset"
      },
      {
        id: "2",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        caption: "Bridge details"
      },
      {
        id: "3",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        caption: "City view from bridge"
      }
    ],
    _count: {
      likes: 120,
      comments: 15,
      shares: 5
    }
  },
  {
    id: "2",
    caption: "Coffee with a view ☕️ Found this amazing artisan coffee shop in Berkeley with the perfect ambiance",
    location: "Berkeley, CA",
    createdAt: "2024-01-14T15:20:00Z",
    author: mockUser,
    place: {
      id: "2",
      name: "Artisan Coffee Roasters",
      category: "CAFE"
    },
    media: [
      {
        id: "4",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=600&h=600&fit=crop",
        caption: "Coffee art"
      },
      {
        id: "5",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=600&h=600&fit=crop",
        caption: "Coffee shop interior"
      }
    ],
    _count: {
      likes: 89,
      comments: 8,
      shares: 2
    }
  },
  {
    id: "3",
    caption: "Weekend hiking adventure! 🥾 The trails were challenging but the views made it all worthwhile",
    location: "Marin County, CA",
    createdAt: "2024-01-13T09:15:00Z",
    author: mockUser,
    place: {
      id: "3",
      name: "Mount Tamalpais",
      category: "NATURE"
    },
    media: [
      {
        id: "6",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        caption: "Mountain view"
      },
      {
        id: "7",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        caption: "Trail path"
      },
      {
        id: "8",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        caption: "Summit achievement"
      },
      {
        id: "9",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
        caption: "Wildlife sighting"
      }
    ],
    _count: {
      likes: 156,
      comments: 23,
      shares: 7
    }
  }
]

const mockSavedPlaces = [
  {
    id: "3",
    name: "Yosemite National Park",
    description: "Beautiful national park with stunning waterfalls and granite cliffs. Perfect for hiking and nature photography.",
    category: "NATURE",
    location: "California, USA",
    tags: ["hiking", "nature", "waterfalls", "photography"],
    isVerified: true,
    isCurated: true,
    media: [
      {
        id: "3-1",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isPrimary: true
      },
      {
        id: "3-2",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=300&fit=crop",
        isPrimary: false
      },
      {
        id: "3-3",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isPrimary: false
      }
    ],
    _count: {
      posts: 45,
      savedPlaces: 1200
    }
  },
  {
    id: "4",
    name: "Blue Bottle Coffee",
    description: "Artisan coffee roasters known for their single-origin beans and perfect brewing techniques.",
    category: "CAFE",
    location: "San Francisco, CA",
    tags: ["coffee", "artisan", "specialty", "local"],
    isVerified: true,
    isCurated: false,
    media: [
      {
        id: "4-1",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=300&fit=crop",
        isPrimary: true
      },
      {
        id: "4-2",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=300&fit=crop",
        isPrimary: false
      }
    ],
    _count: {
      posts: 23,
      savedPlaces: 890
    }
  },
  {
    id: "5",
    name: "Golden Gate Park",
    description: "Large urban park featuring gardens, museums, and recreational activities. A must-visit destination in San Francisco.",
    category: "PARK",
    location: "San Francisco, CA",
    tags: ["park", "nature", "outdoors", "family"],
    isVerified: true,
    isCurated: true,
    media: [
      {
        id: "5-1",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isPrimary: true
      },
      {
        id: "5-2",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1554118811-0733d0fa4b2d?w=400&h=300&fit=crop",
        isPrimary: false
      },
      {
        id: "5-3",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isPrimary: false
      },
      {
        id: "5-4",
        type: "IMAGE" as const,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isPrimary: false
      }
    ],
    _count: {
      posts: 67,
      savedPlaces: 2340
    }
  }
]

export function ProfilePage({ userId }: ProfilePageProps) {
  const { user: currentUser, updateUser } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: mockUser.name,
    username: mockUser.username,
    bio: mockUser.bio,
    location: mockUser.location,
    website: mockUser.website
  })

  const isOwnProfile = !userId || userId === currentUser?.id

  const handleEditProfile = () => {
    setIsEditDialogOpen(true)
  }

  const handleSaveProfile = () => {
    if (currentUser) {
      updateUser({
        ...currentUser,
        ...editForm
      })
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      })
      setIsEditDialogOpen(false)
    }
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed" : "Followed",
      description: isFollowing 
        ? `You unfollowed ${mockUser.name}`
        : `You are now following ${mockUser.name}`
    })
  }

  const handleMessage = () => {
    toast({
      title: "Message feature",
      description: "Messaging feature coming soon!"
    })
  }

  const handleSettings = () => {
    setIsSettingsOpen(true)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )
      case "saved":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSavedPlaces.map((place) => (
              <PlaceCard 
                key={place.id} 
                place={place}
                onClick={() => {
                  toast({
                    title: "Place details",
                    description: "Place details page coming soon!"
                  })
                }}
              />
            ))}
          </div>
        )
      case "liked":
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Liked posts will appear here</p>
            <Button variant="outline">
              Explore Posts
            </Button>
          </div>
        )
      case "stats":
        return (
          <TravelStatistics />
        )
      case "map":
        return (
          <TravelMap />
        )
      case "bucket":
        return (
          <TravelBucketList />
        )
      case "badges":
        return (
          <TravelBadges />
        )
      case "stories":
        return (
          <TravelStories />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader
        user={mockUser}
        isOwnProfile={isOwnProfile}
        onEditProfile={handleEditProfile}
        onMessage={handleMessage}
        onFollow={handleFollow}
        onSettings={handleSettings}
        isFollowing={isFollowing}
      />

      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        postsCount={mockUser._count?.posts}
        savedCount={mockSavedPlaces.length}
        likedCount={0}
        statsCount={1}
        mapCount={mockSavedPlaces.length}
        bucketCount={4}
        badgesCount={2}
        storiesCount={4}
      />

      <div className="min-h-screen">
        {renderContent()}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Sheet */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="right" className="w-full sm:w-[540px] sm:max-w-none overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <UserSettings onClose={() => setIsSettingsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}