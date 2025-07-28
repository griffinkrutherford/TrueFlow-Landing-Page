import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts } from '@/app/data/blog-posts'
import { loadBlogConfig } from '@/app/lib/blog-config'
import { formatDate } from '@/app/lib/blog-utils'

// GET /api/blog/rss - Generate RSS feed
export async function GET(request: NextRequest) {
  try {
    const config = loadBlogConfig()
    
    // Check if RSS is enabled
    if (!config.features.rss.enabled) {
      return NextResponse.json(
        { error: 'RSS feed is disabled' },
        { status: 404 }
      )
    }
    
    // Get base URL
    const baseUrl = request.headers.get('host') || 'localhost:3001'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const fullBaseUrl = `${protocol}://${baseUrl}`
    
    // Get all published posts (sorted by date, newest first)
    const posts = getPublishedPosts().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    // Generate RSS XML
    const rssXml = generateRSSFeed(posts, config, fullBaseUrl)
    
    // Return RSS with proper content type
    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    )
  }
}

function generateRSSFeed(posts: any[], config: any, baseUrl: string): string {
  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  const rssItems = posts.map(post => {
    const postUrl = `${baseUrl}${config.urls.base}/${post.slug}`
    const pubDate = new Date(post.date).toUTCString()
    
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author.name)}</author>
      <category>${escapeXml(post.category.name)}</category>
      ${post.tags.map((tag: any) => `<category>${escapeXml(tag.name)}</category>`).join('\n      ')}
      ${post.featuredImage ? `<enclosure url="${baseUrl}${post.featuredImage.url}" type="image/jpeg" />` : ''}
    </item>`
  }).join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(config.features.rss.title || config.name)}</title>
    <link>${baseUrl}${config.urls.base}</link>
    <description>${escapeXml(config.features.rss.description || config.description)}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/blog/rss" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`
}