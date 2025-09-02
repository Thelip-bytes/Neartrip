// Analytics and error tracking utilities
import { useRouter } from 'next/router'

// Event types for analytics
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

// User properties for analytics
export interface UserProperties {
  userId?: string
  email?: string
  username?: string
  createdAt?: string
  plan?: string
  role?: string
}

// Page view tracking
export interface PageView {
  path: string
  title: string
  referrer?: string
  timestamp: number
  userId?: string
  sessionId?: string
}

// Error tracking interface
export interface ErrorEvent {
  message: string
  stack?: string
  type: 'javascript' | 'api' | 'network'
  timestamp: number
  userId?: string
  sessionId?: string
  context?: Record<string, any>
}

// Performance metrics
export interface PerformanceMetrics {
  pageLoadTime?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  cumulativeLayoutShift?: number
  firstInputDelay?: number
  timestamp: number
  path: string
}

// Analytics configuration
interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  sampleRate: number
  endpoint?: string
  apiKey?: string
}

class Analytics {
  private config: AnalyticsConfig
  private sessionId: string
  private userId?: string
  private eventQueue: AnalyticsEvent[] = []
  private errorQueue: ErrorEvent[] = []
  private isOnline = true

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: true,
      debug: false,
      sampleRate: 1,
      ...config,
    }

    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private initialize() {
    if (typeof window === 'undefined') return

    // Set up online/offline detection
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushQueues()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Track page views
    this.trackPageView()

    // Track performance metrics
    this.trackPerformance()

    // Track unhandled errors
    this.trackErrors()

    // Set up periodic flushing
    setInterval(() => this.flushQueues(), 30000) // Flush every 30 seconds

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushQueuesSync()
    })
  }

  // User identification
  identifyUser(userId: string, properties?: UserProperties) {
    this.userId = userId
    
    if (this.config.enabled && this.shouldSample()) {
      this.track('user_identified', {
        userId,
        ...properties,
      })
    }
  }

  // Event tracking
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.config.enabled || !this.shouldSample()) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    }

    if (this.config.debug) {
      console.log('[Analytics] Event:', event)
    }

    if (this.isOnline) {
      this.sendEvent(event)
    } else {
      this.eventQueue.push(event)
    }
  }

  // Page view tracking
  trackPageView(path?: string, title?: string) {
    if (!this.config.enabled || !this.shouldSample()) return

    const pageView: PageView = {
      path: path || window.location.pathname,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    }

    if (this.config.debug) {
      console.log('[Analytics] Page View:', pageView)
    }

    this.track('page_view', pageView)
  }

  // Error tracking
  trackError(error: Error | string, type: ErrorEvent['type'] = 'javascript', context?: Record<string, any>) {
    if (!this.config.enabled) return

    const errorEvent: ErrorEvent = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' && 'stack' in error ? error.stack : undefined,
      type,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      context,
    }

    if (this.config.debug) {
      console.log('[Analytics] Error:', errorEvent)
    }

    if (this.isOnline) {
      this.sendError(errorEvent)
    } else {
      this.errorQueue.push(errorEvent)
    }
  }

  // Performance tracking
  private trackPerformance() {
    if (typeof window === 'undefined' || !('performance' in window)) return

    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.track('performance', {
                metric: 'first_contentful_paint',
                value: entry.startTime,
              })
            }
          })
        })
        paintObserver.observe({ entryTypes: ['paint'] })

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.track('performance', {
              metric: 'largest_contentful_paint',
              value: entry.startTime,
            })
          })
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.track('performance', {
              metric: 'cumulative_layout_shift',
              value: (entry as any).value,
            })
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.track('performance', {
              metric: 'first_input_delay',
              value: (entry as any).processingStart - (entry as any).startTime,
            })
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (error) {
        console.warn('Performance tracking not fully supported:', error)
      }
    }

    // Track page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          this.track('performance', {
            metric: 'page_load_time',
            value: navigation.loadEventEnd - navigation.navigationStart,
          })
        }
      }, 0)
    })
  }

  // Error tracking setup
  private trackErrors() {
    if (typeof window === 'undefined') return

    // Unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(event.error || event.message, 'javascript', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        event.reason instanceof Error ? event.reason : String(event.reason),
        'javascript',
        { type: 'unhandled_promise_rejection' }
      )
    })
  }

  // Sampling logic
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate
  }

  // Send event to server
  private async sendEvent(event: AnalyticsEvent) {
    if (!this.config.endpoint) return

    try {
      const response = await fetch(`${this.config.endpoint}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {}),
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.warn('Failed to send analytics event:', error)
      this.eventQueue.push(event)
    }
  }

  // Send error to server
  private async sendError(error: ErrorEvent) {
    if (!this.config.endpoint) return

    try {
      const response = await fetch(`${this.config.endpoint}/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {}),
        },
        body: JSON.stringify(error),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.warn('Failed to send error event:', error)
      this.errorQueue.push(error)
    }
  }

  // Flush queues
  private async flushQueues() {
    if (!this.isOnline || !this.config.endpoint) return

    // Flush events
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (event) {
        await this.sendEvent(event)
      }
    }

    // Flush errors
    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift()
      if (error) {
        await this.sendError(error)
      }
    }
  }

  // Synchronous flush for page unload
  private flushQueuesSync() {
    if (!this.isOnline || !this.config.endpoint) return

    // Use sendBeacon for reliable delivery during page unload
    if (this.eventQueue.length > 0) {
      const data = JSON.stringify(this.eventQueue)
      navigator.sendBeacon(`${this.config.endpoint}/events/batch`, data)
      this.eventQueue = []
    }

    if (this.errorQueue.length > 0) {
      const data = JSON.stringify(this.errorQueue)
      navigator.sendBeacon(`${this.config.endpoint}/errors/batch`, data)
      this.errorQueue = []
    }
  }

  // Get session info
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      isOnline: this.isOnline,
    }
  }

  // Reset session
  resetSession() {
    this.sessionId = this.generateSessionId()
    this.eventQueue = []
    this.errorQueue = []
  }
}

// Create analytics instance
export const analytics = new Analytics({
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  sampleRate: 1, // Track 100% of events in production
  endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
  apiKey: process.env.NEXT_PUBLIC_ANALYTICS_API_KEY,
})

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    identifyUser: analytics.identifyUser.bind(analytics),
    getSessionInfo: analytics.getSessionInfo.bind(analytics),
  }
}

// Error boundary integration
export function trackErrorBoundary(error: Error, errorInfo: React.ErrorInfo) {
  analytics.trackError(error, 'javascript', {
    componentStack: errorInfo.componentStack,
  })
}

// Performance monitoring hook
export function usePerformanceTracking() {
  const { track } = useAnalytics()

  React.useEffect(() => {
    // Track component mount time
    const mountTime = performance.now()
    
    return () => {
      // Track component unmount time
      const unmountTime = performance.now()
      track('component_lifecycle', {
        action: 'unmount',
        duration: unmountTime - mountTime,
      })
    }
  }, [track])
}

// Custom event tracking hooks
export function useEventTracking(eventName: string, properties?: Record<string, any>) {
  const { track } = useAnalytics()

  React.useEffect(() => {
    track(eventName, properties)
  }, [eventName, properties, track])
}

// Page view tracking hook
export function usePageViewTracking() {
  const { trackPageView } = useAnalytics()
  const router = useRouter()

  React.useEffect(() => {
    trackPageView()
  }, [router.pathname, trackPageView])
}