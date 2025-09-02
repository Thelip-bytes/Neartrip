"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { 
  Bell, 
  X, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  MapPin, 
  Star,
  TrendingUp,
  Gift,
  Calendar,
  Plane,
  Camera,
  CheckCircle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'location' | 'achievement' | 'trending' | 'gift' | 'event' | 'trip'
  title: string
  description: string
  user?: {
    id: string
    name: string
    username: string
    avatar: string
  }
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: any
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    title: "New like on your post",
    description: "Sarah Johnson liked your photo from Santorini",
    user: {
      id: "1",
      name: "Sarah Johnson",
      username: "sarahj_travels",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    actionUrl: "/post/123"
  },
  {
    id: "2",
    type: "comment",
    title: "New comment",
    description: "Mike Chen commented: 'Amazing view! I want to visit here too!'",
    user: {
      id: "2",
      name: "Mike Chen",
      username: "mikec_explorer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
    actionUrl: "/post/123"
  },
  {
    id: "3",
    type: "follow",
    title: "New follower",
    description: "Emma Wilson started following you",
    user: {
      id: "3",
      name: "Emma Wilson",
      username: "emma_wanders",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: true
  },
  {
    id: "4",
    type: "location",
    title: "Place recommendation",
    description: "Based on your interests, you might love Bali, Indonesia",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    actionUrl: "/place/bali"
  },
  {
    id: "5",
    type: "achievement",
    title: "Achievement unlocked!",
    description: "You've visited 10 different countries! 🌍",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true
  },
  {
    id: "6",
    type: "trending",
    title: "Trending destination",
    description: "Tokyo is trending this week. See what travelers are saying!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
    actionUrl: "/place/tokyo"
  },
  {
    id: "7",
    type: "gift",
    title: "Special offer!",
    description: "Get 20% off premium features this week only",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: true
  },
  {
    id: "8",
    type: "event",
    title: "Travel event nearby",
    description: "Travel Photography Workshop happening this weekend",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: true,
    actionUrl: "/events/photography-workshop"
  },
  {
    id: "9",
    type: "trip",
    title: "Trip reminder",
    description: "Your trip to Paris starts in 3 days! 🗼",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: "/trips/paris"
  }
]

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like': return <Heart className="h-4 w-4 text-red-500" />
    case 'comment': return <MessageCircle className="h-4 w-4 text-blue-500" />
    case 'follow': return <UserPlus className="h-4 w-4 text-green-500" />
    case 'mention': return <MessageCircle className="h-4 w-4 text-purple-500" />
    case 'location': return <MapPin className="h-4 w-4 text-orange-500" />
    case 'achievement': return <Star className="h-4 w-4 text-yellow-500" />
    case 'trending': return <TrendingUp className="h-4 w-4 text-pink-500" />
    case 'gift': return <Gift className="h-4 w-4 text-indigo-500" />
    case 'event': return <Calendar className="h-4 w-4 text-teal-500" />
    case 'trip': return <Plane className="h-4 w-4 text-cyan-500" />
    default: return <Bell className="h-4 w-4" />
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'like': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    case 'comment': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    case 'follow': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    case 'mention': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
    case 'location': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
    case 'achievement': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    case 'trending': return 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
    case 'gift': return 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
    case 'event': return 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'
    case 'trip': return 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800'
    default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
  }
}

export function NotificationsSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    })
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      // In a real app, this would navigate to the action URL
      toast({
        title: "Navigation",
        description: `Would navigate to: ${notification.actionUrl}`,
      })
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['like', 'comment', 'follow'][Math.floor(Math.random() * 3)] as Notification['type'],
          title: "New activity",
          description: "Someone interacted with your content",
          user: {
            id: Math.random().toString(),
            name: "New User",
            username: "newuser",
            avatar: `https://picsum.photos/seed/${Math.random()}/200/200.jpg`
          },
          timestamp: new Date(),
          read: false
        }
        
        setNotifications(prev => [newNotification, ...prev])
        
        toast({
          title: "New notification",
          description: newNotification.description,
        })
      }
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 p-0"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 shadow-xl border-0 z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-64">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mb-2" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        notification.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/10'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                              </p>
                              
                              {notification.user && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={notification.user.avatar} />
                                    <AvatarFallback>
                                      {notification.user.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-gray-500">
                                    {notification.user.name}
                                  </span>
                                </div>
                              )}
                              
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}