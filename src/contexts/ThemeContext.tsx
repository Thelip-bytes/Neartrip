"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme | undefined
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark" | undefined
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "neatrip-theme",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  [key: string]: any
}) {
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    setMounted(true)
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setResolvedTheme("dark")
    } else {
      setResolvedTheme("light")
    }
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light")
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Add custom theme transition
  useEffect(() => {
    if (mounted) {
      document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    }
  }, [mounted, resolvedTheme])

  if (!mounted) {
    return <div className="hidden">{children}</div>
  }

  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      attribute="class"
      enableSystem={true}
      disableTransitionOnChange={false}
      {...props}
    >
      <ThemeContext.Provider value={{ 
        theme: defaultTheme, 
        setTheme: (theme: Theme) => {
          // This will be handled by next-themes
          document.documentElement.setAttribute('data-theme', theme)
        }, 
        resolvedTheme 
      }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}