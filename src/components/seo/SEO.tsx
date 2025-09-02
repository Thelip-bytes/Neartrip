"use client"

import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  siteName?: string
  locale?: string
  noIndex?: boolean
  structuredData?: any
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterSite?: string
  twitterCreator?: string
  additionalMetaTags?: Array<{
    name: string
    content: string
    property?: string
  }>
}

const defaultConfig = {
  title: 'NeaTrip - Travel Social Platform',
  description: 'Discover amazing places, share your travel experiences, and connect with fellow travelers around the world.',
  keywords: ['travel', 'social media', 'places', 'travel community', 'share experiences'],
  siteName: 'NeaTrip',
  locale: 'en',
  type: 'website',
  twitterCard: 'summary_large_image' as const,
}

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type,
  siteName,
  locale,
  noIndex,
  structuredData,
  twitterCard,
  twitterSite,
  twitterCreator,
  additionalMetaTags = [],
}: SEOProps) {
  const router = useRouter()
  const currentUrl = url || `${process.env.NEXT_PUBLIC_SITE_URL || ''}${router.asPath}`
  const currentTitle = title ? `${title} | ${siteName || defaultConfig.siteName}` : defaultConfig.title
  const currentDescription = description || defaultConfig.description
  const currentKeywords = keywords ? [...defaultConfig.keywords, ...keywords] : defaultConfig.keywords
  const currentImage = image || `${process.env.NEXT_PUBLIC_SITE_URL || ''}/og-image.jpg`
  const currentType = type || defaultConfig.type
  const currentLocale = locale || defaultConfig.locale
  const currentTwitterCard = twitterCard || defaultConfig.twitterCard

  // Generate structured data
  const generateStructuredData = () => {
    if (!structuredData) return null

    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName || defaultConfig.siteName,
      "url": process.env.NEXT_PUBLIC_SITE_URL || '',
      "description": currentDescription,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    }

    return { ...baseStructuredData, ...structuredData }
  }

  const structuredDataJson = generateStructuredData()

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />
      <meta name="keywords" content={currentKeywords.join(', ')} />
      <meta name="author" content={siteName || defaultConfig.siteName} />
      <link rel="canonical" href={currentUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      
      {noIndex && (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      )}

      {/* Open Graph Tags */}
      <meta property="og:type" content={currentType} />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:image" content={currentImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName || defaultConfig.siteName} />
      <meta property="og:locale" content={currentLocale} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={currentTwitterCard} />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={currentImage} />
      
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* Additional Meta Tags */}
      {additionalMetaTags.map((tag, index) => (
        <meta
          key={index}
          name={tag.name}
          content={tag.content}
          property={tag.property}
        />
      ))}

      {/* Structured Data */}
      {structuredDataJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataJson),
          }}
        />
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />
    </Head>
  )
}

// Hook for dynamic SEO
export function useDynamicSEO() {
  const updateSEO = React.useCallback((props: SEOProps) => {
    // This would typically update the document head
    // In Next.js, this is handled by the SEO component
    console.log('SEO updated:', props)
  }, [])

  return { updateSEO }
}

// Page-specific SEO components
export function HomePageSEO() {
  return (
    <SEO
      title="Discover Amazing Places"
      description="Join NeaTrip to discover amazing travel destinations, share your experiences, and connect with travelers worldwide."
      keywords={['travel destinations', 'travel community', 'share experiences', 'connect travelers']}
      type="website"
    />
  )
}

export function ProfilePageSEO({ username }: { username: string }) {
  return (
    <SEO
      title={`${username}'s Profile`}
      description={`View ${username}'s travel experiences, photos, and favorite places on NeaTrip.`}
      keywords={['travel profile', 'travel photos', 'travel experiences', username]}
      type="profile"
    />
  )
}

export function PostPageSEO({ title, author }: { title: string; author: string }) {
  return (
    <SEO
      title={title}
      description={`Read about ${title} by ${author} on NeaTrip. Discover amazing travel experiences and destinations.`}
      keywords={['travel post', 'travel experience', 'travel story', title]}
      type="article"
    />
  )
}

export function PlacePageSEO({ name, location }: { name: string; location: string }) {
  return (
    <SEO
      title={name}
      description={`Discover ${name} in ${location}. Read reviews, view photos, and plan your visit with NeaTrip.`}
      keywords={['travel destination', 'place review', 'travel guide', name, location]}
      type="website"
    />
  )
}

export function SearchPageSEO({ query }: { query: string }) {
  return (
    <SEO
      title={`Search Results for "${query}"`}
      description={`Search results for "${query}" on NeaTrip. Find travel destinations, posts, and travelers.`}
      keywords={['travel search', 'find destinations', 'travel results', query]}
      noIndex={true}
    />
  )
}

// Error page SEO
export function ErrorPageSEO() {
  return (
    <SEO
      title="Page Not Found"
      description="The page you're looking for doesn't exist on NeaTrip."
      noIndex={true}
    />
  )
}