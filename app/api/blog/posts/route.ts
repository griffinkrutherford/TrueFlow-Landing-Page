import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts, getPostsByCategory, getPostsByTag } from '@/app/data/blog-posts'
import { calculatePagination, searchPosts } from '@/app/lib/blog-utils'
import { BlogPost } from '@/app/types/blog'

// GET /api/blog/posts - List all posts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'date' // date, title, readTime
    const sortOrder = searchParams.get('sortOrder') || 'desc' // asc, desc
    
    // Get all published posts
    let posts = getPublishedPosts()
    
    // Apply filters
    if (category) {
      posts = getPostsByCategory(category)
    } else if (tag) {
      posts = getPostsByTag(tag)
    }
    
    // Apply search
    if (search) {
      posts = searchPosts(posts, search)
    }
    
    // Sort posts
    posts = sortPosts(posts, sortBy, sortOrder)
    
    // Calculate pagination
    const pagination = calculatePagination(posts.length, page, limit)
    
    // Get posts for current page
    const paginatedPosts = posts.slice(pagination.startIndex, pagination.endIndex)
    
    // Remove content from list response to reduce payload
    const postsWithoutContent = paginatedPosts.map(({ content, ...post }) => post)
    
    return NextResponse.json({
      posts: postsWithoutContent,
      pagination: {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        total: pagination.totalItems,
        totalPages: pagination.totalPages,
        hasNext: pagination.hasNext,
        hasPrevious: pagination.hasPrevious
      },
      filters: {
        category,
        tag,
        search,
        sortBy,
        sortOrder
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// Helper function to sort posts
function sortPosts(posts: BlogPost[], sortBy: string, sortOrder: string): BlogPost[] {
  const sorted = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'readTime':
        return a.readTime - b.readTime
      case 'date':
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })
  
  return sortOrder === 'desc' ? sorted.reverse() : sorted
}