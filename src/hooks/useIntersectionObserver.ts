"use client"

import React from 'react'

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
}

interface UseIntersectionObserverReturn {
  ref: (node: Element | null) => void
  inView: boolean
  entry?: IntersectionObserverEntry
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
  } = options

  const [inView, setInView] = React.useState(false)
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>()
  const [node, setNode] = React.useState<Element | null>(null)

  React.useEffect(() => {
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        setEntry(entry)

        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(node)
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
    }
  }, [node, root, rootMargin, threshold, triggerOnce])

  const ref = React.useCallback((node: Element | null) => {
    setNode(node)
  }, [])

  return { ref, inView, entry }
}

// Hook for detecting if element is visible in viewport
export function useIsVisible(options?: UseIntersectionObserverOptions) {
  const { inView, ref } = useIntersectionObserver(options)
  return { isVisible: inView, ref }
}

// Hook for lazy loading images
export function useLazyImage(src: string, options?: UseIntersectionObserverOptions) {
  const [imageSrc, setImageSrc] = React.useState<string>('')
  const { ref, inView } = useIntersectionObserver(options)

  React.useEffect(() => {
    if (inView && src) {
      setImageSrc(src)
    }
  }, [inView, src])

  return { ref, imageSrc, loaded: !!imageSrc }
}

// Hook for infinite scrolling
export function useInfiniteScroll(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { ref } = useIntersectionObserver({
    ...options,
    threshold: 0.1,
    triggerOnce: false,
  })

  React.useEffect(() => {
    if (ref && typeof callback === 'function') {
      callback()
    }
  }, [ref, callback])

  return ref
}

// Hook for scroll position
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = React.useState(0)

  React.useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset)
    }

    window.addEventListener('scroll', updatePosition)
    updatePosition()

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}

// Hook for scroll direction
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = React.useState<'up' | 'down'>('down')
  const [lastScrollPosition, setLastScrollPosition] = React.useState(0)

  React.useEffect(() => {
    const updateScrollDirection = () => {
      const scrollPosition = window.pageYOffset

      if (scrollPosition > lastScrollPosition) {
        setScrollDirection('down')
      } else if (scrollPosition < lastScrollPosition) {
        setScrollDirection('up')
      }

      setLastScrollPosition(scrollPosition)
    }

    window.addEventListener('scroll', updateScrollDirection)
    return () => window.removeEventListener('scroll', updateScrollDirection)
  }, [lastScrollPosition])

  return scrollDirection
}

// Hook for element size
export function useElementSize() {
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const ref = React.useCallback((node: Element | null) => {
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })

    observer.observe(node)

    return () => observer.unobserve(node)
  }, [])

  return { ref, ...size }
}

// Hook for mouse position
export function useMousePosition() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return mousePosition
}

// Hook for window size
export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Hook for breakpoint detection
export function useBreakpoint() {
  const { width } = useWindowSize()

  const breakpoints = {
    xs: width >= 0,
    sm: width >= 640,
    md: width >= 768,
    lg: width >= 1024,
    xl: width >= 1280,
    '2xl': width >= 1536,
  }

  return breakpoints
}

// Hook for online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Hook for clipboard API
export function useClipboard() {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      setIsCopied(false)
    }
  }, [])

  return { isCopied, copyToClipboard }
}

// Hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = React.useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Hook for session storage
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = React.useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Hook for click outside detection
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void
) {
  const ref = React.useRef<T>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handler])

  return ref
}

// Hook for keyboard shortcuts
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {}
) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const {
        ctrl = false,
        alt = false,
        shift = false,
        meta = false,
      } = options

      if (
        event.key === key &&
        event.ctrlKey === ctrl &&
        event.altKey === alt &&
        event.shiftKey === shift &&
        event.metaKey === meta
      ) {
        callback(event)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, options])
}