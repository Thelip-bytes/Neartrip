"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  Expand, 
  X, 
  Download,
  Share2,
  Heart,
  Camera
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface CarouselImage {
  id: string
  url: string
  type?: "IMAGE" | "VIDEO"
  thumbnailUrl?: string
  caption?: string
  alt?: string
}

interface ImageCarouselProps {
  images: CarouselImage[]
  className?: string
  aspectRatio?: "square" | "video" | "portrait" | "landscape"
  showControls?: boolean
  showIndicators?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  enableFullscreen?: boolean
  enableDownload?: boolean
  enableShare?: boolean
  onImageClick?: (image: CarouselImage, index: number) => void
  onLike?: (image: CarouselImage, index: number) => void
  initialIndex?: number
}

export function ImageCarousel({
  images,
  className,
  aspectRatio = "square",
  showControls = true,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  enableFullscreen = true,
  enableDownload = false,
  enableShare = false,
  onImageClick,
  onLike,
  initialIndex = 0
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const { toast } = useToast()

  // Handle auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, autoPlayInterval)
    }
    return () => clearInterval(interval)
  }, [isPlaying, images.length, autoPlayInterval])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return
      
      switch (e.key) {
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "Escape":
          setIsFullscreen(false)
          break
        case " ":
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen, isPlaying])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleImageClick = (image: CarouselImage, index: number) => {
    if (onImageClick) {
      onImageClick(image, index)
    } else if (enableFullscreen) {
      setIsFullscreen(true)
    }
  }

  const handleDownload = async (image: CarouselImage) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = image.alt || `image-${image.id}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Download started",
        description: "Image download has started."
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the image.",
        variant: "destructive"
      })
    }
  }

  const handleShare = async (image: CarouselImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.caption || 'Travel Image',
          text: image.caption || 'Check out this amazing travel photo!',
          url: image.url
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(image.url)
      toast({
        title: "Link copied",
        description: "Image link copied to clipboard."
      })
    }
  }

  const handleLike = (image: CarouselImage, index: number) => {
    if (onLike) {
      onLike(image, index)
    }
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrevious()
    }
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "video":
        return "aspect-video"
      case "portrait":
        return "aspect-[3/4]"
      case "landscape":
        return "aspect-[4/3]"
      default:
        return "aspect-square"
    }
  }

  if (images.length === 0) {
    return (
      <div className={cn("bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center", getAspectRatioClass(), className)}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Camera className="h-12 w-12 mx-auto mb-2" />
          <p>No images available</p>
        </div>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className={cn("relative group overflow-hidden rounded-lg", getAspectRatioClass(), className)}>
        <img
          src={images[0].url}
          alt={images[0].alt || "Travel image"}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => handleImageClick(images[0], 0)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        {/* Single image overlay controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          {enableFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
              onClick={() => setIsFullscreen(true)}
            >
              <Expand className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Fullscreen dialog */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative w-full h-full">
              <img
                src={images[0].url}
                alt={images[0].alt || "Travel image"}
                className="w-full h-full object-contain"
              />
              
              {/* Fullscreen controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {images[0].caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                  <p className="text-sm">{images[0].caption}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <>
      <div 
        className={cn("relative group overflow-hidden rounded-lg", getAspectRatioClass(), className)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main image */}
        <img
          key={currentIndex}
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || `Travel image ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-all duration-300"
          onClick={() => handleImageClick(images[currentIndex], currentIndex)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        {/* Image counter */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation controls */}
        {showControls && images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                onClick={() => handleLike(images[currentIndex], currentIndex)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
            {enableDownload && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                onClick={() => handleDownload(images[currentIndex])}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {enableShare && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                onClick={() => handleShare(images[currentIndex])}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {enableFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
              onClick={() => setIsFullscreen(true)}
            >
              <Expand className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Indicators */}
        {showIndicators && images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentIndex 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/70"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Auto-play toggle */}
        {autoPlay && images.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 left-2 h-6 w-6 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <div className={cn(
              "w-1 h-3 bg-white transition-all duration-200",
              isPlaying ? "opacity-100" : "opacity-50"
            )} />
            <div className={cn(
              "w-1 h-3 bg-white transition-all duration-200 ml-0.5",
              isPlaying ? "opacity-100" : "opacity-50"
            )} />
          </Button>
        )}
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <div className="relative w-full h-full bg-black">
            {/* Fullscreen image */}
            <img
              key={currentIndex}
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || `Travel image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Fullscreen controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-black/70 text-white border-0">
                  {currentIndex + 1} / {images.length}
                </Badge>
                {images[currentIndex].caption && (
                  <Badge variant="secondary" className="bg-black/70 text-white border-0 max-w-xs truncate">
                    {images[currentIndex].caption}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                {autoPlay && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <div className={cn(
                      "w-1 h-4 bg-white transition-all duration-200",
                      isPlaying ? "opacity-100" : "opacity-50"
                    )} />
                    <div className={cn(
                      "w-1 h-4 bg-white transition-all duration-200 ml-0.5",
                      isPlaying ? "opacity-100" : "opacity-50"
                    )} />
                  </Button>
                )}
                
                {onLike && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                    onClick={() => handleLike(images[currentIndex], currentIndex)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
                
                {enableDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                    onClick={() => handleDownload(images[currentIndex])}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                
                {enableShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                    onClick={() => handleShare(images[currentIndex])}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Fullscreen navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 text-white hover:text-white bg-black/50 hover:bg-black/70"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Fullscreen indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-200",
                      index === currentIndex 
                        ? "bg-white" 
                        : "bg-white/50 hover:bg-white/70"
                    )}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}

            {/* Caption overlay */}
            {images[currentIndex].caption && (
              <div className="absolute bottom-16 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <p className="text-sm">{images[currentIndex].caption}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}