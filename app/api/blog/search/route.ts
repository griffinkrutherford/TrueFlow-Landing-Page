import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts } from '@/app/data/blog-posts'
import { searchPosts } from '@/app/lib/blog-utils'

// GET /api/blog/search - Search posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || searchParams.get('query') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const searchIn = searchParams.get('searchIn')?.split(',') as any[] || ['title', 'excerpt', 'content']
    
    if (!query) {
      return NextResponse.json({
        results: [],
        query: '',
        total: 0
      })
    }
    
    // Get all published posts
    const posts = getPublishedPosts()
    
    // Search posts
    const results = searchPosts(posts, query, searchIn)
    
    // Limit results
    const limitedResults = results.slice(0, limit)
    
    // Remove content from search results to reduce payload
    const resultsWithoutContent = limitedResults.map(({ content, ...post }) => ({
      ...post,
      // Add a snippet with highlighted search terms
      snippet: createSearchSnippet(content, query, 200)
    }))
    
    return NextResponse.json({
      results: resultsWithoutContent,
      query,
      total: results.length,
      searchIn
    })
  } catch (error) {
    console.error('Error searching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to search blog posts' },
      { status: 500 }
    )
  }
}

// Helper function to create search snippet with highlighted terms
function createSearchSnippet(content: string, query: string, maxLength: number = 200): string {
  const lowerContent = content.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  // Find the position of the query in the content
  const position = lowerContent.indexOf(lowerQuery)
  
  if (position === -1) {
    // If not found in content, return beginning of content
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '')
  }
  
  // Calculate snippet boundaries
  const start = Math.max(0, position - 50)
  const end = Math.min(content.length, position + query.length + 150)
  
  let snippet = content.substring(start, end)
  
  // Add ellipsis if needed
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'
  
  // Highlight the search term (wrap in <mark> tags)
  const regex = new RegExp(`(${query})`, 'gi')
  snippet = snippet.replace(regex, '<mark>$1</mark>')
  
  return snippet
}