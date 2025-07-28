import { NextRequest, NextResponse } from 'next/server'
import { getBlogPost, getRelatedPosts } from '@/app/data/blog-posts'
import { generateSEOMetadata, getRelatedPostsWithScoring } from '@/app/lib/blog-utils'
import { loadBlogConfig } from '@/app/lib/blog-config'

// GET /api/blog/posts/[slug] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const searchParams = request.nextUrl.searchParams
    const includeRelated = searchParams.get('includeRelated') !== 'false'
    const relatedCount = parseInt(searchParams.get('relatedCount') || '3')
    
    // Get the blog post
    const post = getBlogPost(slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // Check if post is published
    if (!post.published) {
      return NextResponse.json(
        { error: 'Post not published' },
        { status: 403 }
      )
    }
    
    // Load blog configuration
    const config = loadBlogConfig()
    
    // Generate SEO metadata
    const baseUrl = request.headers.get('host') || 'localhost:3001'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const fullBaseUrl = `${protocol}://${baseUrl}`
    
    const seoMetadata = generateSEOMetadata(post, config, fullBaseUrl)
    
    // Get related posts if requested
    let relatedPosts: any[] = []
    if (includeRelated && config.features.relatedPosts.enabled) {
      relatedPosts = getRelatedPostsWithScoring(
        post,
        getRelatedPosts(post, relatedCount),
        relatedCount,
        config.features.relatedPosts.algorithm
      )
    }
    
    return NextResponse.json({
      post,
      seo: seoMetadata,
      relatedPosts: relatedPosts.map(({ content, ...post }) => post),
      config: {
        features: {
          comments: config.features.comments,
          socialSharing: config.features.socialSharing
        }
      }
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}