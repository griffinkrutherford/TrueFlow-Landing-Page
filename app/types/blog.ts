// Blog post types
export interface Author {
  name: string
  role: string
  avatar?: string
  bio?: string
}

export interface Category {
  name: string
  slug: string
  description?: string
}

export interface Tag {
  name: string
  slug: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: Author
  date: string
  category: Category
  tags: Tag[]
  primaryTag?: Tag // The primary tag determines the gradient color
  readTime: number // in minutes
  featuredImage?: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  published: boolean
}

// For blog list pages
export interface BlogPostPreview extends Omit<BlogPost, 'content'> {
  // Preview doesn't need full content
}

// For related posts
export interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage?: BlogPost['featuredImage']
  category: Category
  date: string
  readTime: number
}