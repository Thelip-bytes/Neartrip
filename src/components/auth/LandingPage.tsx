"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginDialog } from "./LoginDialog"
import { GoogleSignIn } from "./GoogleSignIn"
import { 
  MapPin, 
  Camera, 
  Heart, 
  Users, 
  Star,
  TrendingUp,
  Globe,
  Plane,
  Sparkles,
  Zap,
  Target,
  Award
} from "lucide-react"

export function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)

  const features = [
    {
      icon: MapPin,
      title: "Discover Places",
      description: "Find amazing travel destinations shared by our community"
    },
    {
      icon: Camera,
      title: "Share Photos",
      description: "Upload and showcase your travel photography"
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Keep track of places you want to visit"
    },
    {
      icon: Users,
      title: "Connect",
      description: "Follow travelers and get inspired by their journeys"
    }
  ]

  const stats = [
    { icon: Globe, label: "Places", value: "10K+" },
    { icon: Users, label: "Travelers", value: "50K+" },
    { icon: Camera, label: "Photos", value: "1M+" },
    { icon: Heart, label: "Likes", value: "5M+" }
  ]

  const testimonials = [
    {
      icon: Star,
      text: "NeaTrip completely changed how I plan my trips!",
      author: "Sarah M.",
      role: "Travel Blogger"
    },
    {
      icon: Heart,
      text: "Amazing community and stunning travel photos.",
      author: "Alex K.",
      role: "Photographer"
    },
    {
      icon: Target,
      text: "Found hidden gems I never knew existed.",
      author: "Maria L.",
      role: "Adventure Seeker"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-gradient-shift"></div>
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
          <div className="mb-6 md:mb-8 animate-float">
            <div className="w-20 h-20 md:w-24 md:h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl animate-pulse-glow">
              <span className="text-white font-bold text-2xl md:text-3xl">NT</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 gradient-primary-text">
              NeaTrip
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto">
              Discover amazing places, share your travel experiences, and connect with fellow travelers around the world.
            </p>
          </div>

          {/* Sign Up Buttons */}
          <div className="space-y-4 max-w-sm mx-auto mb-8 md:mb-12">
            <GoogleSignIn onSuccess={() => setShowLogin(false)} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-purple-200 dark:border-purple-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-500 dark:text-gray-400">
                  Or sign up with email
                </span>
              </div>
            </div>
            <LoginDialog>
              <Button className="w-full h-12 md:h-14 text-base font-bold shadow-xl hover:shadow-2xl transition-all-300 animate-gradient-shift">
                Create Account
              </Button>
            </LoginDialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center mb-2 group-hover:scale-110 transition-all-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 gradient-primary rounded-xl flex items-center justify-center">
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold gradient-primary-text">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mr-2" />
            <h2 className="text-2xl md:text-4xl font-bold gradient-primary-text">Why Choose NeaTrip?</h2>
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-purple-500 ml-2" />
          </div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to make your travel experiences unforgettable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center floating-card hover:scale-105 transition-all-300 border-0 group">
              <CardHeader>
                <div className="w-16 h-16 md:w-20 md:h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow transition-all-300">
                  <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl font-bold gradient-primary-text">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm md:text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mr-2" />
            <h2 className="text-2xl md:text-4xl font-bold gradient-primary-text">What Travelers Say</h2>
            <Award className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real stories from our amazing community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="floating-card hover:scale-105 transition-all-300 border-0 gradient-glass">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 gradient-primary rounded-xl flex items-center justify-center mr-3">
                    <testimonial.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base md:text-lg">{testimonial.author}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-primary text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 md:h-8 md:w-8 text-white mr-2 animate-pulse" />
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <Zap className="h-6 w-6 md:h-8 md:w-8 text-white ml-2 animate-pulse" />
          </div>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90">
            Join thousands of travelers sharing their amazing experiences
          </p>
          <div className="space-y-4 max-w-sm mx-auto">
            <GoogleSignIn onSuccess={() => setShowLogin(false)} />
            <LoginDialog>
              <Button variant="outline" className="w-full h-12 md:h-14 text-base font-bold border-white text-white hover:bg-white hover:text-purple-600 transition-all-300 glass-effect">
                Sign Up with Email
              </Button>
            </LoginDialog>
          </div>
        </div>
      </div>
    </div>
  )
}