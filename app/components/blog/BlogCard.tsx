import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import type { BlogPost } from '@/app/types/blog'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className={`bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
        {/* Featured Image */}
        <div className={`${featured ? 'h-64 lg:h-96' : 'h-48'} relative overflow-hidden`}>
          {post.featuredImage ? (
            <>
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </>
          ) : (
            <div className={`h-full bg-gradient-to-br ${
              post.id === '1' ? 'from-sky-500 to-blue-600' :
              post.id === '2' ? 'from-purple-500 to-pink-600' :
              post.id === '3' ? 'from-green-500 to-teal-600' :
              post.id === '4' ? 'from-orange-500 to-pink-600' :
              'from-indigo-500 to-purple-600'
            }`}>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {post.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? 'lg:p-8' : ''}`}>
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

          <h3 className={`${featured ? 'text-2xl lg:text-3xl' : 'text-xl'} font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors`}>
            {post.title}
          </h3>

          <p className={`text-white/70 mb-4 ${featured ? 'lg:text-lg' : ''} line-clamp-3`}>
            {post.excerpt}
          </p>

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
}