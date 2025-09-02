"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Chrome } from "lucide-react"

interface GoogleSignInProps {
  onSuccess?: () => void
  onError?: () => void
}

export function GoogleSignIn({ onSuccess, onError }: GoogleSignInProps) {
  const { login } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock Google user data
      const googleUserData = {
        id: `google_${Date.now()}`,
        name: "Alex Johnson",
        username: "alexj_google",
        email: "alex.johnson@gmail.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        isVerified: true,
        bio: "🌍 Travel enthusiast | Google user",
        _count: {
          posts: 0,
          followers: 0,
          following: 0
        }
      }
      
      login(googleUserData)
      toast({
        title: "Welcome to NeaTrip!",
        description: "You have successfully signed in with Google.",
      })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Google Sign-In failed",
        description: "Please try again later.",
        variant: "destructive"
      })
      
      if (onError) {
        onError()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-3 h-12"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <Chrome className="h-5 w-5" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  )
}