"use client"

import { useState, useRef, useEffect } from "react"
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
  Flag,
  Reply,
  ThumbsUp,
  Laugh,
  Heart as HeartFilled,
  Fire,
  Star
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
    replies: number
  }
  isLiked?: boolean
  replies?: Comment[]
}

interface EnhancedCommentSectionProps {
  postId: string
  comments?: Comment[]
  onAddComment?: (content: string, parentId?: string) => void
  onLikeComment?: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
  onReplyComment?: (content: string, parentId: string) => void
  className?: string
}

const reactionEmojis = [
  { id: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
  { id: 'love', icon: HeartFilled, label: 'Love', color: 'text-red-500' },
  { id: 'laugh', icon: Laugh, label: 'Laugh', color: 'text-yellow-500' },
  { id: 'fire', icon: Fire, label: 'Fire', color: 'text-orange-500' },
  { id: 'star', icon: Star, label: 'Star', color: 'text-purple-500' }
]

export function EnhancedCommentSection({ 
  postId, 
  comments = [], 
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onReplyComment,
  className = ""
}: EnhancedCommentSectionProps) {
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [showReactionMenu, setShowReactionMenu] = useState<string | null>(null)
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})

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
        likes: 12,
        replies: 2
      },
      isLiked: false,
      replies: [
        {
          id: "1-1",
          content: "Thanks! I used a Canon EOS R5 with a 24-70mm lens",
          createdAt: "2024-01-15T11:45:00Z",
          author: {
            id: "1",
            name: "Current User",
            username: "currentuser",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
            isVerified: false
          },
          _count: {
            likes: 3,
            replies: 0
          },
          isLiked: true
        },
        {
          id: "1-2",
          content: "Great camera choice! The colors are stunning",
          createdAt: "2024-01-15T12:00:00Z",
          author: {
            id: "3",
            name: "Maria Garcia",
            username: "mariatravels",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            isVerified: false
          },
          _count: {
            likes: 5,
            replies: 0
          },
          isLiked: false
        }
      ]
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
        likes: 8,
        replies: 1
      },
      isLiked: true,
      replies: [
        {
          id: "2-1",
          content: "Yes! The sunset views are incredible",
          createdAt: "2024-01-15T12:30:00Z",
          author: {
            id: "1",
            name: "Current User",
            username: "currentuser",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
            isVerified: false
          },
          _count: {
            likes: 2,
            replies: 0
          },
          isLiked: false
        }
      ]
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

  const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to comment.",
        variant: "destructive"
      })
      return
    }

    const content = parentId ? replyContent : newComment
    if (!content.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (parentId) {
        if (onReplyComment) {
          onReplyComment(content.trim(), parentId)
        }
        setReplyContent("")
        setReplyingTo(null)
        toast({
          title: "Reply posted",
          description: "Your reply has been posted successfully."
        })
      } else {
        if (onAddComment) {
          onAddComment(content.trim())
        }
        setNewComment("")
        toast({
          title: "Comment posted",
          description: "Your comment has been posted successfully."
        })
      }
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

  const handleReaction = (commentId: string, reactionType: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to react to comments.",
        variant: "destructive"
      })
      return
    }

    const currentReaction = userReactions[commentId]
    const newReaction = currentReaction === reactionType ? null : reactionType
    
    setUserReactions(prev => ({
      ...prev,
      [commentId]: newReaction || 'like'
    }))

    if (onLikeComment) {
      onLikeComment(commentId)
    }

    setShowReactionMenu(null)
    
    const reaction = reactionEmojis.find(r => r.id === reactionType)
    if (reaction) {
      toast({
        title: `${reaction.label}d`,
        description: `You ${newReaction ? reaction.label.toLowerCase() : 'unreacted to'} this comment.`
      })
    }
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
  const shouldShowExpandButton = (content: string, commentId: string) => 
    isCommentLong(content) && !expandedComments.has(commentId)

  const renderComment = (comment: Comment, isReply = false) => {
    const userReaction = userReactions[comment.id] || 'like'
    const ReactionIcon = reactionEmojis.find(r => r.id === userReaction)?.icon || ThumbsUp

    return (
      <div key={comment.id} className={cn(
        "p-4 border-b last:border-b-0",
        isReply && "pl-12 bg-gray-50/50 dark:bg-gray-800/30"
      )}>
        <div className="flex gap-3">
          <Avatar className={cn("h-8 w-8", isReply && "h-6 w-6")}>
            <AvatarImage 
              src={comment.author.avatar} 
              alt={comment.author.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <AvatarFallback className={cn(isReply && "text-xs")}>
              {comment.author.name?.charAt(0) || comment.author.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("font-semibold", isReply ? "text-sm" : "text-sm")}>
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
            
            <p className={cn("text-gray-800 mb-2", isReply ? "text-sm" : "text-sm")}>
              {shouldShowExpandButton(comment.content, comment.id) 
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
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 px-0 text-xs hover:bg-gray-100",
                    userReactions[comment.id] && "text-blue-500"
                  )}
                  onClick={() => setShowReactionMenu(
                    showReactionMenu === comment.id ? null : comment.id
                  )}
                >
                  <ReactionIcon className={cn(
                    "h-3 w-3 mr-1",
                    userReactions[comment.id] && reactionEmojis.find(r => r.id === userReaction)?.color
                  )} />
                  {comment._count?.likes || 0}
                </Button>
                
                {/* Reaction Menu */}
                {showReactionMenu === comment.id && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-1 z-50">
                    {reactionEmojis.map((reaction) => {
                      const Icon = reaction.icon
                      return (
                        <Button
                          key={reaction.id}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-6 w-6 p-0 hover:bg-gray-100",
                            userReactions[comment.id] === reaction.id && reaction.color
                          )}
                          onClick={() => handleReaction(comment.id, reaction.id)}
                        >
                          <Icon className="h-3 w-3" />
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-0 text-xs"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
              
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

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <form 
                onSubmit={(e) => handleSubmitComment(e, comment.id)}
                className="mt-3 flex gap-2"
              >
                <Input
                  placeholder={`Reply to ${comment.author.name || comment.author.username}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 h-8 text-sm"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!replyContent.trim() || isSubmitting}
                  className="px-3 h-8"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-2">
                {comment.replies.map(reply => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("border-0 shadow-none", className)}>
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
            <form onSubmit={(e) => handleSubmitComment(e)} className="flex-1 flex gap-2">
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
          {displayComments.map(comment => renderComment(comment))}
        </div>

        {/* Comments Count */}
        <div className="p-3 text-center text-xs text-gray-500 border-t">
          {displayComments.length} {displayComments.length === 1 ? "comment" : "comments"}
        </div>
      </CardContent>
    </Card>
  )
}