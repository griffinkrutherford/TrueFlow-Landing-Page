import { notFound } from 'next/navigation'
import { getBlogPost, getRelatedPosts, getPublishedPosts } from '@/app/data/blog-posts'
import BlogHeader from '@/app/components/blog/BlogHeader'
import BlogContent from '@/app/components/blog/BlogContent'
import AuthorBio from '@/app/components/blog/AuthorBio'
import RelatedPosts from '@/app/components/blog/RelatedPosts'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import ParticleBackground from '@/app/components/ParticleBackground'

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: post.seo?.metaTitle || `${post.title} | TrueFlow Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords?.join(', ') || '',
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      images: post.featuredImage ? [post.featuredImage.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage.url] : [],
    }
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post || !post.published) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post, 3)

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Particle Background */}
      <ParticleBackground particleCount={40} />
      
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="pt-24">
        <article>
          <BlogHeader post={post} />
          <BlogContent content={post.content} />
          <AuthorBio author={post.author} />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
        )}
      </main>

      {/* Footer CTA */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content Creation?</h2>
          <p className="text-white/80 mb-8">
            Join thousands of businesses using TrueFlow to automate their marketing.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-semibold"
          >
            Start Your Free Assessment
          </Link>
        </div>
      </section>
    </div>
  )
}