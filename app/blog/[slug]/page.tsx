import { notFound } from 'next/navigation'
import { getBlogPost, getRelatedPosts, getPublishedPosts } from '@/app/data/blog-posts'
import BlogHeader from '@/app/components/blog/BlogHeader'
import BlogContent from '@/app/components/blog/BlogContent'
import AuthorBio from '@/app/components/blog/AuthorBio'
import RelatedPosts from '@/app/components/blog/RelatedPosts'
import Link from 'next/link'
import Image from 'next/image'
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
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 transition-all duration-500 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/true-flow-logo.webp"
                  alt="TrueFlow"
                  width={280}
                  height={70}
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto transform hover:scale-105 transition-transform"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">Home</Link>
              <Link href="/content-engine" className="text-white/70 hover:text-white transition-colors text-sm">Content Engine</Link>
              <a href="/#features" className="text-white/70 hover:text-white transition-colors text-sm">Features</a>
              <a href="/#how-it-works" className="text-white/70 hover:text-white transition-colors text-sm">How it Works</a>
              <a href="/#testimonials" className="text-white/70 hover:text-white transition-colors text-sm">Success Stories</a>
              <Link href="/blog" className="text-white transition-colors text-sm">Blog</Link>
              <Link href="/faq" className="text-white/70 hover:text-white transition-colors text-sm">FAQs</Link>
              <Link href="/readiness-assessment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
            href="/readiness-assessment"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-semibold"
          >
            Start Your Free Assessment
          </Link>
        </div>
      </section>
    </div>
  )
}