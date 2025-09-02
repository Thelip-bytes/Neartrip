"use client"

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Dynamic import with loading component
export function DynamicImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType,
  loadingComponent?: React.ComponentType
) {
  const DynamicComponent = dynamic(importFn, {
    loading: loadingComponent || (() => <div>Loading...</div>),
    ssr: false,
  })

  return DynamicComponent
}

// Lazy loading component with intersection observer
interface LazyLoadProps {
  children: React.ReactNode
  placeholder?: React.ReactNode
  rootMargin?: string
  threshold?: number
  triggerOnce?: boolean
}

export function LazyLoad({
  children,
  placeholder = <div style={{ height: '200px', background: '#f0f0f0' }} />,
  rootMargin = '50px',
  threshold = 0.1,
  triggerOnce = true,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, inView] = useIntersectionObserver({
    rootMargin,
    threshold,
    triggerOnce,
  })

  useEffect(() => {
    if (inView && !isVisible) {
      setIsVisible(true)
    }
  }, [inView, isVisible, triggerOnce])

  return (
    <div ref={ref}>
      {isVisible ? children : placeholder}
    </div>
  )
}

// Image optimization component
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'empty',
  blurDataURL,
  priority = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false)
    setHasError(false)
    setImageSrc(src)
  }, [src])

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!isLoaded && placeholder === 'blur' && blurDataURL && (
        <div
          className="absolute inset-0 blur-sm"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      
      {!isLoaded && placeholder === 'empty' && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}

      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}

// Performance monitoring component
interface PerformanceMetricsProps {
  onMetrics?: (metrics: PerformanceMetrics) => void
}

interface PerformanceMetrics {
  fcp: number | null
  lcp: number | null
  cls: number | null
  fid: number | null
  ttfb: number | null
}

export function PerformanceMonitor({ onMetrics }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      const lcp = performance.getEntriesByType('largest-contentful-paint')
      const cls = performance.getEntriesByType('layout-shift')
      const fid = performance.getEntriesByType('first-input')

      const newMetrics: PerformanceMetrics = {
        fcp: paint.find((p) => p.name === 'first-contentful-paint')?.startTime || null,
        lcp: lcp.length > 0 ? lcp[lcp.length - 1].startTime : null,
        cls: cls.reduce((acc, curr) => acc + (curr as any).value, 0),
        fid: fid.length > 0 ? (fid[0] as any).processingStart - (fid[0] as any).startTime : null,
        ttfb: navigation ? navigation.responseStart - navigation.requestStart : null,
      }

      setMetrics(newMetrics)
      onMetrics?.(newMetrics)
    }

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      setTimeout(collectMetrics, 0)
    } else {
      window.addEventListener('load', () => {
        setTimeout(collectMetrics, 0)
      })
    }

    // Set up PerformanceObserver for real-time metrics
    if ('PerformanceObserver' in window) {
      try {
        // Observe LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          if (entries.length > 0) {
            const lcp = entries[entries.length - 1]
            setMetrics(prev => ({ ...prev, lcp: lcp.startTime }))
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Observe CLS
        const clsObserver = new PerformanceObserver((list) => {
          const clsValue = list.getEntries().reduce((acc, curr) => {
            return acc + (curr as any).value
          }, 0)
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // Observe FID
        const fidObserver = new PerformanceObserver((list) => {
          const fid = list.getEntries()[0]
          if (fid) {
            const fidValue = (fid as any).processingStart - (fid as any).startTime
            setMetrics(prev => ({ ...prev, fid: fidValue }))
          }
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (error) {
        console.warn('PerformanceObserver not fully supported:', error)
      }
    }

    return () => {
      // Cleanup observers if needed
    }
  }, [onMetrics])

  return null
}

// Memory usage monitoring (development only)
export function MemoryMonitor() {
  const [memory, setMemory] = useState<PerformanceMemory | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    if (typeof window === 'undefined' || !('performance' in window)) return

    const interval = setInterval(() => {
      const mem = (performance as any).memory as PerformanceMemory
      if (mem) {
        setMemory(mem)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !memory) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>JS Heap: {Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB</div>
      <div>Limit: {Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB</div>
    </div>
  )
}

// Bundle size analyzer hook
export function useBundleSize() {
  const [bundleInfo, setBundleInfo] = useState<{
    totalSize: number
    chunkSizes: Array<{ name: string; size: number }>
  } | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    // This would typically be populated by your build system
    // For now, we'll simulate it
    const mockBundleInfo = {
      totalSize: 1500000, // 1.5MB
      chunkSizes: [
        { name: 'main.js', size: 500000 },
        { name: 'vendor.js', size: 800000 },
        { name: 'runtime.js', size: 200000 },
      ],
    }

    setBundleInfo(mockBundleInfo)
  }, [])

  return bundleInfo
}

// Preloading utility
export function usePreload() {
  const preloadComponent = useCallback((componentPath: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'script'
    link.href = componentPath
    document.head.appendChild(link)
  }, [])

  const preloadImage = useCallback((imageUrl: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = imageUrl
    document.head.appendChild(link)
  }, [])

  const prefetchPage = useCallback((pageUrl: string) => {
    if (typeof window === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = pageUrl
    document.head.appendChild(link)
  }, [])

  return { preloadComponent, preloadImage, prefetchPage }
}

// Code splitting utility
export function createCodeSplitComponent<T extends React.ComponentType<any>>(
  componentLoader: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  return dynamic(componentLoader, {
    loading: fallback || (() => <div>Loading...</div>),
    ssr: false,
  })
}

// Performance optimization hook
export function usePerformanceOptimization() {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Detect low-end devices
    const isLowEnd = 
      navigator.hardwareConcurrency <= 4 ||
      (navigator as any).deviceMemory <= 4
    
    setIsLowEndDevice(isLowEnd)

    // Detect slow connections
    if ('connection' in navigator) {
      const connection = (navigator as any).connection as NetworkInformation
      setIsSlowConnection(
        connection.effectiveType.includes('2g') ||
        connection.saveData ||
        connection.downlink < 1
      )
    }

    // Reduce animations for low-end devices or slow connections
    if (isLowEnd || isSlowConnection) {
      document.documentElement.classList.add('reduce-motion')
    }
  }, [])

  return {
    isLowEndDevice,
    isSlowConnection,
    shouldReduceAnimations: isLowEndDevice || isSlowConnection,
  }
}