'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/Navigation'
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react'
import { getPublishedPosts, categories, tagColorPalettes } from '@/app/data/blog-posts'
import type { BlogPost, Category } from '@/app/types/blog'
import ParticleBackground from '@/app/components/ParticleBackground'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const allPosts = getPublishedPosts()
    setPosts(allPosts)
    setFilteredPosts(allPosts)
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category.slug === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [selectedCategory, searchQuery, posts])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Particle Background */}
      <ParticleBackground particleCount={50} />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight pb-2">
            TrueFlow Blog
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Insights, strategies, and tips to transform your business with AI-powered automation
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All Posts
            </button>
            {Object.values(categories).map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg">No posts found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                // Use primary tag for color, fallback to first tag
                const primaryTagSlug = post.primaryTag?.slug || post.tags[0]?.slug
                const gradientClass = primaryTagSlug && tagColorPalettes[primaryTagSlug] 
                  ? tagColorPalettes[primaryTagSlug]
                  : 'from-gray-500 to-slate-600'
                
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 h-full flex flex-col border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/10 transform hover:-translate-y-1">
                      {/* Featured Image */}
                      <div className={`h-48 bg-gradient-to-br ${gradientClass} relative overflow-hidden group`}>
                        {post.featuredImage ? (
                          <>
                            <Image
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Color-coded transparency overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-60 group-hover:opacity-50 transition-opacity duration-300`}></div>
                            {/* Additional dark overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                          </>
                        ) : (
                          <>
                            {/* Decorative elements for posts without images */}
                            <div className="absolute inset-0 overflow-hidden">
                              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-full"></div>
                            </div>
                            {/* Pattern overlay */}
                            <div className="absolute inset-0 opacity-20" style={{
                              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
                            }}></div>
                          </>
                        )}
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            {post.category.name}
                          </span>
                        </div>
                      </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime} min read
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-white/70 mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => {
                          const tagGradient = tagColorPalettes[tag.slug] || 'from-gray-500 to-slate-600'
                          return (
                            <span
                              key={tag.slug}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${tagGradient} text-white opacity-80`}
                            >
                              {tag.name}
                            </span>
                          )
                        })}
                        {post.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">
                          By {post.author.name}
                        </span>
                        <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}