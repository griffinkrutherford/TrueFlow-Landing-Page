// Blog Utility Functions
// Reusable functions for common blog operations

import { BlogPost } from '@/app/types/blog'
import { BlogConfig } from './blog-config'

// SEO Metadata Generation
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  openGraph: {
    title: string
    description: string
    type: string
    url?: string
    image?: string
    siteName?: string
    locale?: string
  }
  twitter: {
    card: string
    title: string
    description: string
    image?: string
    creator?: string
  }
  jsonLd?: any
}

export function generateSEOMetadata(
  post: BlogPost,
  config: BlogConfig,
  baseUrl: string
): SEOMetadata {
  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt
  const keywords = post.seo?.keywords || config.seo.defaultKeywords
  const image = post.featuredImage?.url ? `${baseUrl}${post.featuredImage.url}` : undefined

  const formattedTitle = config.seo.titleTemplate.replace('%s', title)
  
  const metadata: SEOMetadata = {
    title: formattedTitle,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}${config.urls.base}/${post.slug}`,
      image,
      siteName: config.seo.openGraph.siteName,
      locale: config.seo.openGraph.locale
    },
    twitter: {
      card: config.seo.twitter.cardType,
      title,
      description,
      image,
      creator: config.seo.twitter.handle
    }
  }

  // Generate JSON-LD structured data
  if (config.seo.jsonLd.enabled) {
    metadata.jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      author: {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role
      },
      datePublished: post.date,
      dateModified: post.date,
      image: image,
      publisher: config.seo.jsonLd.organization ? {
        '@type': 'Organization',
        name: config.seo.jsonLd.organization.name,
        logo: {
          '@type': 'ImageObject',
          url: config.seo.jsonLd.organization.logo
        }
      } : undefined,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}${config.urls.base}/${post.slug}`
      }
    }
  }

  return metadata
}

// Reading Time Calculation
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // Remove HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, '')
  
  // Remove code blocks
  const withoutCode = plainText.replace(/```[\s\S]*?```/g, '')
  
  // Count words
  const words = withoutCode.trim().split(/\s+/).filter(word => word.length > 0).length
  
  // Calculate reading time (minimum 1 minute)
  const time = Math.ceil(words / wordsPerMinute)
  
  return Math.max(1, time)
}

// Excerpt Generation
export function generateExcerpt(
  content: string,
  maxLength: number = 160,
  stripMarkdown: boolean = true
): string {
  let text = content

  // Strip markdown if requested
  if (stripMarkdown) {
    // Remove headers
    text = text.replace(/^#{1,6}\s+(.*)$/gm, '$1')
    
    // Remove bold/italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
    text = text.replace(/\*([^*]+)\*/g, '$1')
    text = text.replace(/__([^_]+)__/g, '$1')
    text = text.replace(/_([^_]+)_/g, '$1')
    
    // Remove links
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    
    // Remove images
    text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    
    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '')
    text = text.replace(/`([^`]+)`/g, '$1')
    
    // Remove blockquotes
    text = text.replace(/^>\s+(.*)$/gm, '$1')
    
    // Remove lists
    text = text.replace(/^[\s]*[-*+]\s+(.*)$/gm, '$1')
    text = text.replace(/^[\s]*\d+\.\s+(.*)$/gm, '$1')
    
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '')
  }

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim()

  // Truncate to max length
  if (text.length <= maxLength) {
    return text
  }

  // Find the last complete word within the limit
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

// Slug Generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}

// Date Formatting
export function formatDate(
  date: string | Date,
  format: string = 'MMMM DD, YYYY'
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  const replacements: Record<string, string> = {
    'YYYY': d.getFullYear().toString(),
    'YY': d.getFullYear().toString().slice(-2),
    'MMMM': months[d.getMonth()],
    'MMM': monthsShort[d.getMonth()],
    'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
    'M': (d.getMonth() + 1).toString(),
    'DD': d.getDate().toString().padStart(2, '0'),
    'D': d.getDate().toString()
  }
  
  let formatted = format
  Object.entries(replacements).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(key, 'g'), value)
  })
  
  return formatted
}

// Social Share URL Generation
export function generateShareUrls(
  post: BlogPost,
  baseUrl: string,
  platforms: string[] = ['twitter', 'facebook', 'linkedin', 'email']
): Record<string, string> {
  const postUrl = `${baseUrl}/blog/${post.slug}`
  const title = encodeURIComponent(post.title)
  const excerpt = encodeURIComponent(post.excerpt)
  
  const urls: Record<string, string> = {}
  
  if (platforms.includes('twitter')) {
    urls.twitter = `https://twitter.com/intent/tweet?text=${title}&url=${postUrl}`
  }
  
  if (platforms.includes('facebook')) {
    urls.facebook = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`
  }
  
  if (platforms.includes('linkedin')) {
    urls.linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`
  }
  
  if (platforms.includes('email')) {
    urls.email = `mailto:?subject=${title}&body=${excerpt}%0A%0A${postUrl}`
  }
  
  if (platforms.includes('whatsapp')) {
    urls.whatsapp = `https://wa.me/?text=${title}%20${postUrl}`
  }
  
  return urls
}

// Tag Cloud Generation
export interface TagCloudItem {
  name: string
  slug: string
  count: number
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function generateTagCloud(posts: BlogPost[]): TagCloudItem[] {
  // Count tag occurrences
  const tagCounts: Record<string, { name: string; slug: string; count: number }> = {}
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!tagCounts[tag.slug]) {
        tagCounts[tag.slug] = { name: tag.name, slug: tag.slug, count: 0 }
      }
      tagCounts[tag.slug].count++
    })
  })
  
  // Convert to array and sort by count
  const tags = Object.values(tagCounts).sort((a, b) => b.count - a.count)
  
  if (tags.length === 0) return []
  
  // Calculate sizes based on count distribution
  const maxCount = tags[0].count
  const minCount = tags[tags.length - 1].count
  const range = maxCount - minCount
  
  return tags.map(tag => {
    let size: TagCloudItem['size']
    
    if (range === 0) {
      size = 'md'
    } else {
      const percentage = (tag.count - minCount) / range
      if (percentage >= 0.8) size = 'xl'
      else if (percentage >= 0.6) size = 'lg'
      else if (percentage >= 0.4) size = 'md'
      else if (percentage >= 0.2) size = 'sm'
      else size = 'xs'
    }
    
    return {
      name: tag.name,
      slug: tag.slug,
      count: tag.count,
      size
    }
  })
}

// Pagination Helper
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  startIndex: number
  endIndex: number
  hasNext: boolean
  hasPrevious: boolean
}

export function calculatePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationInfo {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const safePage = Math.max(1, Math.min(currentPage, totalPages))
  const startIndex = (safePage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  return {
    currentPage: safePage,
    totalPages,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNext: safePage < totalPages,
    hasPrevious: safePage > 1
  }
}

// Search Function
export function searchPosts(
  posts: BlogPost[],
  query: string,
  searchIn: ('title' | 'excerpt' | 'content' | 'tags' | 'category')[] = ['title', 'excerpt', 'content']
): BlogPost[] {
  const lowerQuery = query.toLowerCase().trim()
  
  if (!lowerQuery) return posts
  
  return posts.filter(post => {
    if (searchIn.includes('title') && post.title.toLowerCase().includes(lowerQuery)) {
      return true
    }
    
    if (searchIn.includes('excerpt') && post.excerpt.toLowerCase().includes(lowerQuery)) {
      return true
    }
    
    if (searchIn.includes('content') && post.content.toLowerCase().includes(lowerQuery)) {
      return true
    }
    
    if (searchIn.includes('tags')) {
      const tagMatch = post.tags.some(tag => 
        tag.name.toLowerCase().includes(lowerQuery) ||
        tag.slug.toLowerCase().includes(lowerQuery)
      )
      if (tagMatch) return true
    }
    
    if (searchIn.includes('category')) {
      const categoryMatch = 
        post.category.name.toLowerCase().includes(lowerQuery) ||
        post.category.slug.toLowerCase().includes(lowerQuery)
      if (categoryMatch) return true
    }
    
    return false
  })
}

// Related Posts Scoring
export function scoreRelatedPost(
  currentPost: BlogPost,
  candidatePost: BlogPost,
  algorithm: 'category' | 'tags' | 'ai-similarity' = 'tags'
): number {
  if (currentPost.id === candidatePost.id) return -1
  
  let score = 0
  
  // Category match (high weight)
  if (currentPost.category.slug === candidatePost.category.slug) {
    score += 50
  }
  
  // Tag matches (medium weight)
  if (algorithm === 'tags' || algorithm === 'category') {
    const currentTags = new Set(currentPost.tags.map(t => t.slug))
    const candidateTags = new Set(candidatePost.tags.map(t => t.slug))
    
    let tagMatches = 0
    currentTags.forEach(tag => {
      if (candidateTags.has(tag)) {
        tagMatches++
      }
    })
    
    score += tagMatches * 20
  }
  
  // Date proximity (low weight) - prefer recent posts
  const currentDate = new Date(currentPost.date).getTime()
  const candidateDate = new Date(candidatePost.date).getTime()
  const daysDifference = Math.abs(currentDate - candidateDate) / (1000 * 60 * 60 * 24)
  
  if (daysDifference < 30) score += 10
  else if (daysDifference < 90) score += 5
  else if (daysDifference < 180) score += 2
  
  // AI similarity would go here if implemented
  if (algorithm === 'ai-similarity') {
    // This would use embeddings or other ML techniques
    // For now, we'll use a simple keyword matching as a placeholder
    const currentWords = new Set(
      currentPost.title.toLowerCase().split(/\s+/)
        .concat(currentPost.excerpt.toLowerCase().split(/\s+/))
        .filter(word => word.length > 3)
    )
    
    const candidateWords = new Set(
      candidatePost.title.toLowerCase().split(/\s+/)
        .concat(candidatePost.excerpt.toLowerCase().split(/\s+/))
        .filter(word => word.length > 3)
    )
    
    let wordMatches = 0
    currentWords.forEach(word => {
      if (candidateWords.has(word)) {
        wordMatches++
      }
    })
    
    score += wordMatches * 5
  }
  
  return score
}

// Get related posts with scoring
export function getRelatedPostsWithScoring(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  count: number = 3,
  algorithm: 'category' | 'tags' | 'ai-similarity' = 'tags'
): BlogPost[] {
  const scoredPosts = allPosts
    .map(post => ({
      post,
      score: scoreRelatedPost(currentPost, post, algorithm)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.post)
  
  return scoredPosts
}

// Table of Contents Generation
export interface TOCItem {
  id: string
  text: string
  level: number
  children?: TOCItem[]
}

export function generateTableOfContents(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const matches = Array.from(content.matchAll(headingRegex))
  
  const items: TOCItem[] = []
  const stack: TOCItem[] = []
  
  matches.forEach((match, index) => {
    const level = match[1].length
    const text = match[2].trim()
    const id = generateSlug(text) + (index > 0 ? `-${index}` : '')
    
    const item: TOCItem = { id, text, level }
    
    // Find the appropriate parent
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      items.push(item)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    }
    
    stack.push(item)
  })
  
  return items
}