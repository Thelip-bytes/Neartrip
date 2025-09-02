"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Grid, Bookmark, Heart, BarChart3, Map, Target, Award, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  postsCount?: number
  savedCount?: number
  likedCount?: number
  statsCount?: number
  mapCount?: number
  bucketCount?: number
  badgesCount?: number
  storiesCount?: number
}

export function ProfileTabs({ 
  activeTab, 
  onTabChange, 
  postsCount = 0,
  savedCount = 0,
  likedCount = 0,
  statsCount = 0,
  mapCount = 0,
  bucketCount = 0,
  badgesCount = 0,
  storiesCount = 0
}: ProfileTabsProps) {
  const tabs = [
    {
      id: "posts",
      label: "Posts",
      icon: Grid,
      count: postsCount
    },
    {
      id: "saved",
      label: "Saved",
      icon: Bookmark,
      count: savedCount
    },
    {
      id: "liked",
      label: "Liked",
      icon: Heart,
      count: likedCount
    },
    {
      id: "stats",
      label: "Stats",
      icon: BarChart3,
      count: statsCount
    },
    {
      id: "map",
      label: "Map",
      icon: Map,
      count: mapCount
    },
    {
      id: "bucket",
      label: "Bucket",
      icon: Target,
      count: bucketCount
    },
    {
      id: "badges",
      label: "Badges",
      icon: Award,
      count: badgesCount
    },
    {
      id: "stories",
      label: "Stories",
      icon: Play,
      count: storiesCount
    }
  ]

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "flex-1 flex flex-col items-center gap-1 h-auto py-3",
                isActive 
                  ? "text-foreground border-b-2 border-foreground" 
                  : "text-gray-500 hover:text-foreground"
              )}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="text-xs text-gray-500">{tab.count}</span>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}