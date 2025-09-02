"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Heart, 
  Send,
  MoreHorizontal,
  Trash2,
  Flag
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name?: string
    username?: string
    avatar?: string
    isVerified?: boolean
  }
  _count?: {
    likes: number
  }
  isLiked?: boolean
}

interface CommentSectionProps {
  postId: string
  comments?: Comment[]
  onAddComment?: (content: string) => void
  onLikeComment?: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
}

export function CommentSection({ 
  postId, 
  comments = [], 
  onAddComment,
  onLikeComment,
  onDeleteComment
}: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: "1",
      content: "Amazing shot! The lighting is perfect 📸",
      createdAt: "2024-01-15T11:30:00Z",
      author: {
        id: "2",
        name: "Alex Chen",
        username: "alexchen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      _count: {
        likes: 12
      },
      isLiked: false
    },
    {
      id: "2",
      content: "I've been here too! Such a beautiful place 🌅",
      createdAt: "2024-01-15T12:15:00Z",
      author: {
        id: "3",
        name: "Maria Garcia",
        username: "mariatravels",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isVerified: false
      },
      _count: {
        likes: 8
      },
      isLiked: true
    },
    {
      id: "3",
      content: "Great composition! What camera did you use?",
      createdAt: "2024-01-15T13:45:00Z",
      author: {
        id: "4",
        name: "David Kim",
        username: "davidkim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      _count: {
        likes: 5
      },
      isLiked: false
    }
  ]

  const displayComments = comments.length > 0 ? comments : mockComments

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to comment.",
        variant: "destructive"
      })
      return
    }

    if (!newComment.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (onAddComment) {
        onAddComment(newComment.trim())
      }
      
      setNewComment("")
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully."
      })
    } catch (error) {
      toast({
        title: "Failed to post comment",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = (commentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to like comments.",
        variant: "destructive"
      })
      return
    }

    if (onLikeComment) {
      onLikeComment(commentId)
    }
    
    toast({
      title: "Comment liked",
      description: "You liked this comment."
    })
  }

  const handleDeleteComment = (commentId: string) => {
    if (onDeleteComment) {
      onDeleteComment(commentId)
    }
    
    toast({
      title: "Comment deleted",
      description: "Your comment has been deleted."
    })
  }

  const toggleExpandComment = (commentId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  const isCommentLong = (content: string) => content.length > 100
  const shouldShowExpandButton = (content: string) => isCommentLong(content) && !expandedComments.has(commentId)

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        {/* Add Comment */}
        <div className="p-4 border-b">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user?.avatar} 
                alt={user?.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <AvatarFallback>
                {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <form onSubmit={handleSubmitComment} className="flex-1 flex gap-2">
              <Input
                placeholder={isAuthenticated ? "Add a comment..." : "Login to comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!isAuthenticated || isSubmitting}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!isAuthenticated || !newComment.trim() || isSubmitting}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Comments List */}
        <div className="max-h-96 overflow-y-auto">
          {displayComments.map((comment) => (
            <div key={comment.id} className="p-4 border-b last:border-b-0">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={comment.author.avatar} 
                    alt={comment.author.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <AvatarFallback>
                    {comment.author.name?.charAt(0) || comment.author.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {comment.author.name || comment.author.username}
                    </span>
                    {comment.author.isVerified && (
                      <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full text-xs">
                        ✓
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-800 mb-2">
                    {shouldShowExpandButton(comment.id) 
                      ? `${comment.content.substring(0, 100)}...` 
                      : comment.content
                    }
                    {isCommentLong(comment.content) && (
                      <button
                        onClick={() => toggleExpandComment(comment.id)}
                        className="text-blue-500 hover:text-blue-600 text-xs ml-1"
                      >
                        {expandedComments.has(comment.id) ? "Show less" : "Show more"}
                      </button>
                    )}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-0 text-xs"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart className={cn(
                        "h-3 w-3 mr-1",
                        comment.isLiked && "fill-red-500 text-red-500"
                      )} />
                      {comment._count?.likes || 0}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-0 text-xs"
                    >
                      Reply
                    </Button>
                    
                    {user?.id === comment.author.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-0 text-xs text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-0 text-xs"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comments Count */}
        <div className="p-3 text-center text-xs text-gray-500 border-t">
          {displayComments.length} {displayComments.length === 1 ? "comment" : "comments"}
        </div>
      </CardContent>
    </Card>
  )
}