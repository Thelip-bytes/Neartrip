"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SocialActions } from "@/components/social/SocialActions"
import { EnhancedCommentSection } from "@/components/social/EnhancedCommentSection"
import { ImageCarousel } from "@/components/ui/ImageCarousel"
import { 
  MoreHorizontal,
  MapPin,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

interface PostCardProps {
  post: {
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
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to like posts.",
        variant: "destructive"
      })
      return
    }

    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save posts.",
        variant: "destructive"
      })
      return
    }

    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Post unsaved" : "Post saved",
      description: isSaved ? "Post removed from your saved items." : "Post added to your saved items."
    })
  }

  const handleComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to comment.",
        variant: "destructive"
      })
      return
    }

    setShowComments(!showComments)
  }

  const handleShare = (platform: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to share posts.",
        variant: "destructive"
      })
      return
    }

    const shareUrl = `${window.location.origin}/post/${post.id}`
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard."
        })
        break
      case 'instagram':
        toast({
          title: "Share to Instagram",
          description: "Opening Instagram share dialog..."
        })
        break
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=Check out this amazing post on NeaTrip!&url=${encodeURIComponent(shareUrl)}`
        window.open(twitterUrl, '_blank')
        break
      case 'download':
        toast({
          title: "Download image",
          description: "Image download started..."
        })
        break
      default:
        toast({
          title: "Share post",
          description: `Sharing to ${platform}...`
        })
    }
  }

  const handleAddComment = (content: string) => {
    // Update comments count
    if (post._count) {
      post._count.comments = (post._count.comments || 0) + 1
    }
  }

  const handleLikeComment = (commentId: string) => {
    // Handle comment like
    console.log("Liked comment:", commentId)
  }

  const handleDeleteComment = (commentId: string) => {
    // Handle comment deletion
    console.log("Deleted comment:", commentId)
    if (post._count && post._count.comments > 0) {
      post._count.comments -= 1
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className="border-0 shadow-none mb-0 bg-white dark:bg-black">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-transparent">
              <AvatarImage 
                src={post.author.avatar} 
                alt={post.author.name}
                onError={(e) => {
                  // Fallback to default avatar if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold">
                {post.author.name?.charAt(0) || post.author.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {post.author.name || post.author.username}
                </span>
                {post.author.isVerified && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-blue-500 text-white border-0">
                    ✓
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Media */}
        <div className="relative">
          {post.media.length > 0 && (
            <div className="relative">
              <ImageCarousel
                images={post.media.map(media => ({
                  id: media.id,
                  url: media.url,
                  type: media.type,
                  caption: media.caption,
                  alt: media.caption || "Post image"
                }))}
                aspectRatio="square"
                showControls={true}
                showIndicators={true}
                enableFullscreen={true}
                enableDownload={true}
                enableShare={true}
                onLike={(image, index) => {
                  // Handle individual image like if needed
                  handleLike()
                }}
                className="w-full"
              />
              {post.isReel && (
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white border-0 z-10">
                  Reel
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Place Tag */}
        {post.place && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{post.place.name}</span>
              <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                {post.place.category.toLowerCase().replace("_", " ")}
              </Badge>
            </div>
          </div>
        )}

        {/* Post Actions */}
        <SocialActions
          postId={post.id}
          initialLikes={post._count?.likes || 0}
          initialComments={post._count?.comments || 0}
          initialShares={post._count?.shares || 0}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={handleLike}
          onComment={handleComment}
          onSave={handleSave}
          onShare={handleShare}
          showComments={showComments}
          className="px-3 py-2"
        />

        {/* Post Stats */}
        <div className="px-3 pb-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {likesCount.toLocaleString()} {likesCount === 1 ? "like" : "likes"}
          </p>
          {(post._count?.comments || 0) > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {post._count!.comments} {post._count!.comments === 1 ? "comment" : "comments"}
            </p>
          )}
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="px-3 pb-3">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold mr-2">
                {post.author.name || post.author.username}
              </span>
              {post.caption}
            </p>
          </div>
        )}

        {/* Location */}
        {post.location && !post.place && (
          <div className="px-3 pb-3">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{post.location}</span>
            </div>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <EnhancedCommentSection
            postId={post.id}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onDeleteComment={handleDeleteComment}
          />
        )}
      </CardContent>
    </Card>
  )
}