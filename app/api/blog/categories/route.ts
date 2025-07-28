import { NextResponse } from 'next/server'
import { categories, getPublishedPosts } from '@/app/data/blog-posts'

// GET /api/blog/categories - List categories with post counts
export async function GET() {
  try {
    const posts = getPublishedPosts()
    
    // Count posts per category
    const categoryCounts: Record<string, number> = {}
    posts.forEach(post => {
      const slug = post.category.slug
      categoryCounts[slug] = (categoryCounts[slug] || 0) + 1
    })
    
    // Format categories with counts
    const categoriesWithCounts = Object.entries(categories).map(([key, category]) => ({
      ...category,
      postCount: categoryCounts[category.slug] || 0
    }))
    
    // Sort by post count (descending) then by name
    categoriesWithCounts.sort((a, b) => {
      if (b.postCount !== a.postCount) {
        return b.postCount - a.postCount
      }
      return a.name.localeCompare(b.name)
    })
    
    return NextResponse.json({
      categories: categoriesWithCounts,
      total: categoriesWithCounts.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}