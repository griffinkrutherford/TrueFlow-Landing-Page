'use client'

import { Calendar, Clock, Share2, Twitter, Linkedin, Facebook } from 'lucide-react'
import type { BlogPost } from '@/app/types/blog'
import { useState } from 'react'
import Image from 'next/image'

interface BlogHeaderProps {
  post: BlogPost
}

export default function BlogHeader({ post }: BlogHeaderProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post.title

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  }

  return (
    <header className="relative">
      {/* Hero Background */}
      <div className="h-96 relative overflow-hidden">
        {post.featuredImage ? (
          <>
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </>
        ) : (
          <div className={`h-full bg-gradient-to-br ${
            post.id === '1' ? 'from-sky-500 via-blue-600 to-purple-600' :
            post.id === '2' ? 'from-purple-500 via-pink-600 to-red-500' :
            post.id === '3' ? 'from-green-500 via-teal-600 to-blue-600' :
            post.id === '4' ? 'from-orange-500 via-pink-500 to-purple-600' :
            'from-indigo-500 via-purple-600 to-pink-600'
          } animate-gradient-xy`}>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            {/* Animated particles with glow */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full animate-float ${
                    i % 3 === 0 ? 'w-2 h-2 bg-yellow-300/40 shadow-glow-yellow' :
                    i % 3 === 1 ? 'w-1.5 h-1.5 bg-cyan-300/40 shadow-glow-cyan' :
                    'w-1 h-1 bg-pink-300/40 shadow-glow-pink'
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${10 + Math.random() * 20}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:shadow-neon-blue transition-all duration-300 hover:scale-105">
              {post.category.name}
            </span>
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={tag.slug} 
                className={`relative px-3 py-1 rounded-full text-sm transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-neon-cyan' :
                  index === 1 ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 hover:shadow-neon-purple' :
                  'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 hover:from-orange-500/30 hover:to-red-500/30 hover:shadow-neon-orange'
                }`}
              >
                #{tag.name}
              </span>
            ))}
          </div>

          {/* Title with animated gradient */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-gradient-x bg-300%">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-white/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow duration-300">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  post.author.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                <p className="text-sm">{post.author.role}</p>
              </div>
            </div>
            
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>

            {/* Share Button - Coming Soon */}
            {/* <div className="relative ml-auto">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full hover:bg-white/10"
              >
                <Share2 className="h-4 w-4 hover:rotate-12 transition-transform duration-300" />
                Share
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 p-2 z-10">
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </a>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </header>
  )
}