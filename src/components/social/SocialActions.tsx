"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Send,
  Copy,
  Download,
  ExternalLink,
  Users,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

interface SocialActionsProps {
  postId: string
  initialLikes?: number
  initialComments?: number
  initialShares?: number
  isLiked?: boolean
  isSaved?: boolean
  onLike?: () => void
  onComment?: () => void
  onSave?: () => void
  onShare?: (platform: string) => void
  showComments?: boolean
  className?: string
}

export function SocialActions({
  postId,
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  isLiked: initialIsLiked = false,
  isSaved: initialIsSaved = false,
  onLike,
  onComment,
  onSave,
  onShare,
  showComments = false,
  className = ""
}: SocialActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const shareMenuRef = useRef<HTMLDivElement>(null)

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to like posts.",
        variant: "destructive"
      })
      return
    }

    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
    
    // Add animation effect
    if (newLikedState) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }

    if (onLike) {
      onLike()
    }
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

    const newSavedState = !isSaved
    setIsSaved(newSavedState)
    
    toast({
      title: newSavedState ? "Post saved" : "Post unsaved",
      description: newSavedState ? "Post added to your saved items." : "Post removed from your saved items."
    })

    if (onSave) {
      onSave()
    }
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

    if (onComment) {
      onComment()
    }
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

    const shareUrl = `${window.location.origin}/post/${postId}`
    
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
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(facebookUrl, '_blank')
        break
      default:
        toast({
          title: "Share post",
          description: `Sharing to ${platform}...`
        })
    }
    
    if (onShare) {
      onShare(platform)
    }
    
    setShowShareMenu(false)
  }

  const shareOptions = [
    { id: 'copy', label: 'Copy Link', icon: Copy },
    { id: 'instagram', label: 'Share to Instagram', icon: Send },
    { id: 'twitter', label: 'Share to Twitter', icon: ExternalLink },
    { id: 'facebook', label: 'Share to Facebook', icon: Users },
    { id: 'download', label: 'Download Image', icon: Download }
  ]

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 group"
            onClick={handleLike}
          >
            <Heart className={cn(
              "h-6 w-6 transition-all duration-200 group-hover:scale-110",
              isLiked && "fill-red-500 text-red-500 scale-110",
              isAnimating && "animate-pulse"
            )} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 group"
            onClick={handleComment}
          >
            <MessageCircle className={cn(
              "h-6 w-6 transition-all duration-200 group-hover:scale-110",
              showComments && "text-gray-900 dark:text-gray-100"
            )} />
          </Button>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 group"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Send className="h-6 w-6 transition-all duration-200 group-hover:scale-110" />
            </Button>
            
            {/* Share Menu */}
            {showShareMenu && (
              <div 
                ref={shareMenuRef}
                className="absolute bottom-full left-0 mb-2 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-2 min-w-[200px] z-50 animate-in slide-in-from-bottom-2"
              >
                <div className="space-y-1">
                  {shareOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-8 text-sm hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100"
                        onClick={() => handleShare(option.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Stats Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setShowStats(!showStats)}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            {likesCount + initialComments + initialShares}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 group"
            onClick={handleSave}
          >
            <Bookmark className={cn(
              "h-6 w-6 transition-all duration-200 group-hover:scale-110",
              isSaved && "fill-current text-gray-900 dark:text-gray-100 scale-110"
            )} />
          </Button>
        </div>
      </div>

      {/* Engagement Stats */}
      {showStats && (
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-1">
            <Heart className={cn("h-3 w-3", isLiked && "fill-red-500 text-red-500")} />
            <span>{likesCount} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className={cn("h-3 w-3", showComments && "text-gray-900 dark:text-gray-100")} />
            <span>{initialComments} comments</span>
          </div>
          <div className="flex items-center gap-1">
            <Send className="h-3 w-3" />
            <span>{initialShares} shares</span>
          </div>
        </div>
      )}
    </div>
  )
}