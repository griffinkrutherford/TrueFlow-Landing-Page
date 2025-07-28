import { NextResponse } from 'next/server'
import { tags, getPublishedPosts } from '@/app/data/blog-posts'
import { generateTagCloud } from '@/app/lib/blog-utils'

// GET /api/blog/tags - List tags with post counts
export async function GET() {
  try {
    const posts = getPublishedPosts()
    
    // Generate tag cloud data
    const tagCloud = generateTagCloud(posts)
    
    // Also provide a simple list of all tags
    const allTags = Object.values(tags).map(tag => {
      const cloudItem = tagCloud.find(item => item.slug === tag.slug)
      return {
        ...tag,
        postCount: cloudItem?.count || 0,
        size: cloudItem?.size || 'xs'
      }
    })
    
    // Sort by post count (descending) then by name
    allTags.sort((a, b) => {
      if (b.postCount !== a.postCount) {
        return b.postCount - a.postCount
      }
      return a.name.localeCompare(b.name)
    })
    
    return NextResponse.json({
      tags: allTags,
      tagCloud,
      total: allTags.length
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}