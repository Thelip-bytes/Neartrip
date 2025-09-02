"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { LoginDialog } from "@/components/auth/LoginDialog"
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User,
  Bell,
  Eye
} from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  notificationCount?: number
}

export function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  notificationCount = 0 
}: BottomNavigationProps) {
  const { isAuthenticated, logout } = useAuth()
  
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "ar", icon: Eye, label: "AR" },
    { id: "create", icon: PlusSquare, label: "Create" },
    { id: "notifications", icon: Bell, label: "Notifications", badge: notificationCount > 0 ? notificationCount : undefined },
    { 
      id: "profile", 
      icon: User, 
      label: isAuthenticated ? "Profile" : "Login",
      action: isAuthenticated ? undefined : "login"
    },
  ]

  const handleTabClick = (tabId: string, action?: string) => {
    if (action === "login") {
      // Login dialog will be handled by the LoginDialog component
      return
    }
    onTabChange(tabId)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-purple-200 dark:border-purple-800 shadow-2xl">
      <div className="flex justify-around items-center h-14 md:h-16 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <div key={tab.id} className="flex flex-col items-center justify-center h-full w-full">
              {tab.action === "login" && !isAuthenticated ? (
                <LoginDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex flex-col items-center justify-center h-full w-full rounded-none gap-0.5 md:gap-1",
                      "hover:scale-105 transition-all-300",
                      isActive && "text-purple-600 dark:text-purple-400"
                    )}
                  >
                    <div className={cn(
                      "relative p-1.5 md:p-2 rounded-xl transition-all-300",
                      isActive ? "gradient-primary text-white animate-pulse-glow" : "hover:bg-purple-100 dark:hover:bg-purple-900/20"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5 md:h-6 md:w-6",
                        isActive && "scale-110"
                      )} />
                    </div>
                    <span className={cn(
                      "text-xs md:text-sm font-medium transition-all-300",
                      isActive ? "gradient-primary-text font-bold" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {tab.label}
                    </span>
                  </Button>
                </LoginDialog>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabClick(tab.id, tab.action)}
                  className={cn(
                    "flex flex-col items-center justify-center h-full w-full rounded-none gap-0.5 md:gap-1",
                    "hover:scale-105 transition-all-300",
                    isActive && "text-purple-600 dark:text-purple-400"
                  )}
                >
                  <div className="relative">
                    <div className={cn(
                      "relative p-1.5 md:p-2 rounded-xl transition-all-300",
                      isActive ? "gradient-primary text-white animate-pulse-glow" : "hover:bg-purple-100 dark:hover:bg-purple-900/20"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5 md:h-6 md:w-6",
                        isActive && "scale-110"
                      )} />
                      {tab.badge && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-xs animate-pulse bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg"
                        >
                          {tab.badge > 99 ? "99+" : tab.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs md:text-sm font-medium transition-all-300",
                    isActive ? "gradient-primary-text font-bold" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {tab.label}
                  </span>
                </Button>
              )}
            </div>
          )
        })}
        
  
      </div>
    </nav>
  )
}