"use client"

import { useState } from "react"
import { ErrorBoundary } from "@/components/error/ErrorBoundary"
import { BottomNavigation } from "@/components/layout/BottomNavigation"
import { Feed } from "@/components/feed/Feed"
import { PlaceDiscovery } from "@/components/place/PlaceDiscovery"
import { PlaceDetails } from "@/components/place/PlaceDetails"
import { ProfilePage } from "@/components/profile/ProfilePage"
import { LoginDialog } from "@/components/auth/LoginDialog"
import { LandingPage } from "@/components/auth/LandingPage"
import { NotificationsSystem } from "@/components/realtime/NotificationsSystem"
import { MessagingSystem } from "@/components/realtime/MessagingSystem"
import { AdvancedPostCreation } from "@/components/post-creation/AdvancedPostCreation"
import { InteractiveMap } from "@/components/location/InteractiveMap"
import { SearchAndDiscovery } from "@/components/search/SearchAndDiscovery"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { AIItineraryPlanner } from "@/components/itinerary/AIItineraryPlanner"
import { ARPlaceDiscovery } from "@/components/ar/ARPlaceDiscovery"
import { Search, ArrowLeft, Plus, MessageSquare, Sparkles, MapPin, Heart, Star, Route, Eye } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [view, setView] = useState<"main" | "place-details" | "messages" | "itinerary">("main")
  const [createSubTab, setCreateSubTab] = useState<"post" | "itinerary">("post")
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  const handleTabChange = (tab: string) => {
    // Check if user is authenticated for protected tabs
    const protectedTabs = ["profile", "create", "notifications", "ar"]
    if (protectedTabs.includes(tab) && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access this feature.",
        variant: "destructive"
      })
      return
    }
    
    setActiveTab(tab)
    setView("main") // Reset to main view when switching tabs
    if (tab === "home") {
      setRefreshTrigger(prev => prev + 1)
    }
    if (tab === "create") {
      setCreateSubTab("post") // Reset to post creation when switching to create tab
    }
  }

  const handlePlaceClick = (place: any) => {
    setSelectedPlace(place)
    setView("place-details")
  }

  const handleBackToMain = () => {
    setView("main")
    setSelectedPlace(null)
  }

  const handleMessagesClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access messages.",
        variant: "destructive"
      })
      return
    }
    setView("messages")
  }

  const renderContent = () => {
    // Show landing page for unauthenticated users on home tab
    if (!isAuthenticated && activeTab === "home") {
      return <LandingPage />
    }

    // If we're in messages view, show messaging system
    if (view === "messages") {
      return (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToMain}
            className="mb-4 glass-effect hover:scale-105 transition-all-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <ErrorBoundary>
            <MessagingSystem />
          </ErrorBoundary>
        </div>
      )
    }

    // If we're in place details view, show that regardless of active tab
    if (view === "place-details" && selectedPlace) {
      return (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToMain}
            className="mb-4 glass-effect hover:scale-105 transition-all-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <ErrorBoundary>
            <PlaceDetails 
              place={selectedPlace} 
              posts={[]} // Will be populated with actual data
              onClose={handleBackToMain}
            />
          </ErrorBoundary>
        </div>
      )
    }

    switch (activeTab) {
      case "home":
        return (
          <ErrorBoundary>
            <Feed refreshTrigger={refreshTrigger} />
          </ErrorBoundary>
        )
      
      case "search":
        return (
          <ErrorBoundary>
            <SearchAndDiscovery />
          </ErrorBoundary>
        )
      
      case "ar":
        return (
          <ErrorBoundary>
            <ARPlaceDiscovery />
          </ErrorBoundary>
        )
      
      case "create":
        return (
          <div className="flex flex-col items-center py-12 px-4">
            <div className="text-center mb-8 animate-float">
              <div className="w-32 h-32 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-glow">
                <Plus className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-3 gradient-primary-text">
                Create & Share
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                Share your amazing travel experiences and inspire others to explore the world
              </p>
            </div>
            
            {/* Sub-tab Navigation */}
            <div className="flex gap-2 mb-6 w-full max-w-sm">
              <Button
                variant={createSubTab === "post" ? "default" : "outline"}
                onClick={() => setCreateSubTab("post")}
                className="flex-1 h-12 hover:scale-105 transition-all-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <Button
                variant={createSubTab === "itinerary" ? "default" : "outline"}
                onClick={() => setCreateSubTab("itinerary")}
                className="flex-1 h-12 hover:scale-105 transition-all-300"
              >
                <Route className="h-4 w-4 mr-2" />
                Plan Trip
              </Button>
            </div>

            {/* Content based on sub-tab */}
            {createSubTab === "post" ? (
              <div className="space-y-4 w-full max-w-sm">
                <ErrorBoundary>
                  <AdvancedPostCreation />
                </ErrorBoundary>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-14 text-base font-medium border-2 hover:scale-105 transition-all-300 glass-effect">
                    <Plus className="h-5 w-5 mr-2" />
                    Video Reel
                  </Button>
                  <Button variant="outline" className="h-14 text-base font-medium border-2 hover:scale-105 transition-all-300 glass-effect">
                    <Plus className="h-5 w-5 mr-2" />
                    Review
                  </Button>
                </div>
                
                <div className="mt-6 p-4 rounded-2xl gradient-glass">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold text-sm">Pro Tips</h3>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Add stunning photos to get more engagement</li>
                    <li>• Share your honest experiences</li>
                    <li>• Tag locations to help others discover</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl">
                <ErrorBoundary>
                  <AIItineraryPlanner />
                </ErrorBoundary>
              </div>
            )}
          </div>
        )
      
      case "notifications":
        return (
          <div className="space-y-6 px-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <span className="text-2xl">🔔</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 gradient-primary-text">Notifications</h2>
              <p className="text-gray-600 dark:text-gray-400">Stay connected with your travel community</p>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <span className="text-3xl">📱</span>
              </div>
              <p className="text-lg font-medium mb-2">No notifications yet</p>
              <p className="text-sm text-center max-w-xs">
                When you get notifications, they'll appear here
              </p>
              
              <div className="mt-6 grid grid-cols-3 gap-4 max-w-xs">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-xs">Likes</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-xs">Comments</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Star className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-xs">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case "profile":
        return (
          <ErrorBoundary>
            <ProfilePage userId={user?.id} />
          </ErrorBoundary>
        )
      
      default:
        return (
          <ErrorBoundary>
            <Feed refreshTrigger={refreshTrigger} />
          </ErrorBoundary>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-black dark:to-gray-900 pb-20 md:pb-0">
      {/* Header - Only show for authenticated users or when not on landing page */}
      {isAuthenticated || activeTab !== "home" ? (
        <header className="sticky top-0 glass-effect border-b border-purple-200 dark:border-purple-800 z-50 animate-gradient-shift">
          <div className="flex items-center justify-between p-3 md:p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <span className="text-white font-bold text-lg md:text-xl">NT</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black gradient-primary-text">NeaTrip</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Discover. Share. Explore.</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 md:h-9 md:w-9 p-0 hover:scale-110 transition-all-300">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <ThemeToggle />
              {isAuthenticated && (
                <>
                  <ErrorBoundary>
                    <NotificationsSystem />
                  </ErrorBoundary>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 md:h-9 md:w-9 p-0 hover:scale-110 transition-all-300"
                    onClick={handleMessagesClick}
                  >
                    <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
      ) : null}

      {/* Main Content */}
      <main className={isAuthenticated || activeTab !== "home" ? "max-w-md mx-auto px-0 py-0" : ""}>
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </main>

      {/* Bottom Navigation - Only show for authenticated users or when not on landing page */}
      {isAuthenticated || activeTab !== "home" ? (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          notificationCount={3}
        />
      ) : null}
    </div>
  )
}