"use client"

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageLoading } from '@/components/loading/LoadingComponents'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <PageLoading />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requiredRole?: string; redirectTo?: string } = {}
) {
  return function WithAuth(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useAuth()

  const hasPermission = React.useCallback((permission: string) => {
    if (!user) return false
    return user.permissions?.includes(permission) || false
  }, [user])

  const hasRole = React.useCallback((role: string) => {
    if (!user) return false
    return user.role === role
  }, [user])

  const hasAnyRole = React.useCallback((roles: string[]) => {
    if (!user) return false
    return roles.includes(user.role)
  }, [user])

  return { hasPermission, hasRole, hasAnyRole }
}

// Permission-based component renderer
interface PermissionGateProps {
  permission: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const { hasPermission } = usePermissions()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Role-based component renderer
interface RoleGateProps {
  roles: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const { hasAnyRole } = usePermissions()

  if (!hasAnyRole(roles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Auth state monitoring component
interface AuthMonitorProps {
  children: React.ReactNode
  onAuthChange?: (isAuthenticated: boolean) => void
}

export function AuthMonitor({ children, onAuthChange }: AuthMonitorProps) {
  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    onAuthChange?.(isAuthenticated)
  }, [isAuthenticated, onAuthChange])

  return <>{children}</>
}

// Session timeout handler
export function useSessionTimeout(timeoutMinutes = 30, warningMinutes = 5) {
  const { logout } = useAuth()
  const [showWarning, setShowWarning] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState(0)

  React.useEffect(() => {
    let warningTimer: NodeJS.Timeout
    let timeoutTimer: NodeJS.Timeout

    const resetTimers = () => {
      clearTimeout(warningTimer)
      clearTimeout(timeoutTimer)
      
      // Show warning before timeout
      warningTimer = setTimeout(() => {
        setShowWarning(true)
        setTimeLeft(warningMinutes * 60)
      }, (timeoutMinutes - warningMinutes) * 60 * 1000)

      // Logout after timeout
      timeoutTimer = setTimeout(() => {
        logout()
      }, timeoutMinutes * 60 * 1000)
    }

    // Reset timers on user activity
    const handleActivity = () => {
      setShowWarning(false)
      resetTimers()
    }

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    resetTimers()

    // Countdown timer for warning
    const countdownInterval = setInterval(() => {
      if (showWarning && timeLeft > 0) {
        setTimeLeft(prev => prev - 1)
      }
    }, 1000)

    return () => {
      clearTimeout(warningTimer)
      clearTimeout(timeoutTimer)
      clearInterval(countdownInterval)
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [timeoutMinutes, warningMinutes, logout, showWarning, timeLeft])

  const extendSession = React.useCallback(() => {
    setShowWarning(false)
  }, [])

  return { showWarning, timeLeft, extendSession }
}

// Session timeout warning dialog
interface SessionTimeoutWarningProps {
  timeLeft: number
  onExtend: () => void
}

export function SessionTimeoutWarning({ timeLeft, onExtend }: SessionTimeoutWarningProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium">Session Timeout</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onExtend}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}