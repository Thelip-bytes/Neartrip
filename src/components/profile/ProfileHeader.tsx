"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Calendar, 
  Edit, 
  Settings, 
  Share2,
  UserPlus,
  MessageCircle
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
  user: {
    id: string
    name?: string
    username?: string
    email?: string
    avatar?: string
    isVerified?: boolean
    bio?: string
    location?: string
    joinedAt?: string
    website?: string
    _count?: {
      posts: number
      followers: number
      following: number
    }
  }
  isOwnProfile?: boolean
  onEditProfile?: () => void
  onMessage?: () => void
  onFollow?: () => void
  onSettings?: () => void
  isFollowing?: boolean
}

export function ProfileHeader({ 
  user, 
  isOwnProfile = false, 
  onEditProfile,
  onMessage,
  onFollow,
  onSettings,
  isFollowing = false
}: ProfileHeaderProps) {
  const { user: currentUser } = useAuth()

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  return (
    <Card className="border-0 shadow-none mb-0 bg-white dark:bg-black">
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg"></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 mb-4">
            <div className="flex items-end gap-4 mb-4 sm:mb-0">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-black ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-purple-500">
                <AvatarImage 
                  src={user.avatar} 
                  alt={user.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <AvatarFallback className="text-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">
                  {user.name?.charAt(0) || user.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 truncate">
                    {user.name || user.username}
                  </h1>
                  {user.isVerified && (
                    <Badge variant="secondary" className="h-5 w-5 p-0 rounded-full bg-blue-500 text-white border-0 flex-shrink-0">
                      ✓
                    </Badge>
                  )}
                </div>
                {user.username && (
                  <p className="text-gray-500 dark:text-gray-400 mb-2 truncate">@{user.username}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onEditProfile}
                    className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={onSettings} className="border-gray-300 dark:border-gray-600">
                    <Settings className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    onClick={onFollow}
                    className={cn(
                      "flex items-center gap-2",
                      isFollowing && "border-gray-300 dark:border-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-700"
                    )}
                  >
                    <UserPlus className="h-4 w-4" />
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={onMessage} className="border-gray-300 dark:border-gray-600">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-gray-900 dark:text-gray-100 mb-3">{user.bio}</p>
          )}

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="text-gray-900 dark:text-gray-100">{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <span className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 cursor-pointer">
                  {user.website}
                </span>
              </div>
            )}
            {user.joinedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatJoinDate(user.joinedAt)}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {user._count?.posts || 0}
              </div>
              <div className="text-gray-500 dark:text-gray-400">posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {user._count?.followers || 0}
              </div>
              <div className="text-gray-500 dark:text-gray-400">followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {user._count?.following || 0}
              </div>
              <div className="text-gray-500 dark:text-gray-400">following</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}