"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  MessageSquare, 
  Send, 
  Search, 
  MoreHorizontal, 
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  Circle,
  CircleDot
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image' | 'file'
}

interface Conversation {
  id: string
  userId: string
  name: string
  username: string
  avatar: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  isOnline: boolean
  isTyping?: boolean
}

interface User {
  id: string
  name: string
  username: string
  avatar: string
  isOnline: boolean
  lastSeen?: Date
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "sarahj_travels",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    isOnline: true
  },
  {
    id: "2",
    name: "Mike Chen",
    username: "mikec_explorer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    isOnline: true,
    lastSeen: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: "3",
    name: "Emma Wilson",
    username: "emma_wanders",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: "4",
    name: "David Park",
    username: "davidp_adventures",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    isOnline: true
  },
  {
    id: "5",
    name: "Lisa Garcia",
    username: "lisa_g_travel",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
]

const mockConversations: Conversation[] = [
  {
    id: "1",
    userId: "1",
    name: "Sarah Johnson",
    username: "sarahj_travels",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    lastMessage: "Hey! Are you still planning to visit Bali next month?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 2),
    unreadCount: 2,
    isOnline: true
  },
  {
    id: "2",
    userId: "2",
    name: "Mike Chen",
    username: "mikec_explorer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    lastMessage: "Thanks for the restaurant recommendation! It was amazing 🍜",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 0,
    isOnline: true
  },
  {
    id: "3",
    userId: "3",
    name: "Emma Wilson",
    username: "emma_wanders",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    lastMessage: "Let me know when you're free for a coffee ☕",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
    unreadCount: 1,
    isOnline: false
  },
  {
    id: "4",
    userId: "4",
    name: "David Park",
    username: "davidp_adventures",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    lastMessage: "Check out this new hiking trail I found!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
    isOnline: true
  },
  {
    id: "5",
    userId: "5",
    name: "Lisa Garcia",
    username: "lisa_g_travel",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    lastMessage: "Have you been to Japan yet?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    isOnline: false
  }
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      receiverId: "current",
      content: "Hey! Are you still planning to visit Bali next month?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      read: false,
      type: "text"
    },
    {
      id: "2",
      senderId: "current",
      receiverId: "1",
      content: "Yes! I'm really excited about it. Have you been before?",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      read: true,
      type: "text"
    },
    {
      id: "3",
      senderId: "1",
      receiverId: "current",
      content: "I went last year! It's absolutely beautiful. I'll send you some recommendations 🏝️",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: true,
      type: "text"
    }
  ],
  "2": [
    {
      id: "4",
      senderId: "2",
      receiverId: "current",
      content: "Thanks for the restaurant recommendation! It was amazing 🍜",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: true,
      type: "text"
    },
    {
      id: "5",
      senderId: "current",
      receiverId: "2",
      content: "I'm glad you liked it! The ramen there is incredible",
      timestamp: new Date(Date.now() - 1000 * 60 * 16),
      read: true,
      type: "text"
    }
  ]
}

export function MessagingSystem() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "current",
      receiverId: activeConversation,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: "text"
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: new Date(),
              unreadCount: 0
            }
          : conv
      )
    )

    // Simulate typing indicator and response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeConversation,
        receiverId: "current",
        content: "That sounds great! I'd love to hear more about it.",
        timestamp: new Date(),
        read: false,
        type: "text"
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId)
    setMessages(mockMessages[conversationId] || [])
    
    // Mark conversation as read
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate receiving new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && activeConversation) { // 20% chance every 15 seconds
        const responses = [
          "That's awesome! 🎉",
          "I'd love to visit there someday!",
          "Great photos! 📸",
          "Thanks for sharing!",
          "That looks incredible!",
          "I need to add this to my travel list! ✈️"
        ]
        
        const response: Message = {
          id: Date.now().toString(),
          senderId: activeConversation,
          receiverId: "current",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          read: false,
          type: "text"
        }
        
        setMessages(prev => [...prev, response])
        
        // Show toast notification
        const conversation = conversations.find(c => c.id === activeConversation)
        if (conversation) {
          toast({
            title: `New message from ${conversation.name}`,
            description: response.content,
          })
        }
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [activeConversation, conversations, toast])

  const activeConvData = conversations.find(c => c.id === activeConversation)

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  activeConversation === conversation.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                      conversation.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">
                        {conversation.name}
                      </h3>
                      {conversation.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {conversation.isTyping && (
                      <div className="flex items-center gap-1 mt-1">
                        <CircleDot className="h-2 w-2 text-blue-500 animate-pulse" />
                        <span className="text-xs text-blue-500">typing...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation && activeConvData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConvData.avatar} />
                    <AvatarFallback>
                      {activeConvData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white dark:border-gray-900 ${
                    activeConvData.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">{activeConvData.name}</h3>
                  <p className="text-xs text-gray-500">
                    {activeConvData.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 'current'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'current' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <Circle className="h-2 w-2 text-gray-500 animate-pulse" />
                        <Circle className="h-2 w-2 text-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <Circle className="h-2 w-2 text-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p className="text-sm">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}