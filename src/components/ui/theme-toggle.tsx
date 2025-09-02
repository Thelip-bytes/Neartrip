"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme)
    // Add a subtle animation feedback
    document.documentElement.style.transform = 'scale(0.98)'
    setTimeout(() => {
      document.documentElement.style.transform = 'scale(1)'
    }, 150)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:scale-110 transition-all-300">
          <div className="relative">
            {resolvedTheme === "light" ? (
              <Sun className="h-5 w-5 text-yellow-500 animate-pulse" />
            ) : resolvedTheme === "dark" ? (
              <Moon className="h-5 w-5 text-purple-400 animate-pulse" />
            ) : (
              <Monitor className="h-5 w-5 text-blue-500 animate-pulse" />
            )}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-effect">
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")} 
          className="hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all-300"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")} 
          className="hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all-300"
        >
          <Moon className="mr-2 h-4 w-4 text-purple-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")} 
          className="hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all-300"
        >
          <Monitor className="mr-2 h-4 w-4 text-blue-500" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}