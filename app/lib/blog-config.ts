// Blog Configuration System for TrueFlow Clients
// This file contains all the customizable settings for the blog engine

export interface BlogBranding {
  logo?: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    text: {
      primary: string
      secondary: string
      muted: string
    }
    background: {
      primary: string
      secondary: string
      card: string
    }
  }
  fonts: {
    heading: string
    body: string
    code?: string
  }
  customCSS?: string
}

export interface BlogFeatures {
  comments: {
    enabled: boolean
    provider?: 'disqus' | 'facebook' | 'custom'
    config?: Record<string, any>
  }
  socialSharing: {
    enabled: boolean
    platforms: Array<'twitter' | 'facebook' | 'linkedin' | 'email' | 'whatsapp'>
    customMessage?: string
  }
  relatedPosts: {
    enabled: boolean
    count: number
    algorithm: 'category' | 'tags' | 'ai-similarity'
  }
  search: {
    enabled: boolean
    provider: 'internal' | 'algolia' | 'elasticsearch'
    config?: Record<string, any>
  }
  newsletter: {
    enabled: boolean
    provider?: 'mailchimp' | 'convertkit' | 'custom'
    config?: Record<string, any>
  }
  rss: {
    enabled: boolean
    title?: string
    description?: string
  }
  analytics: {
    enabled: boolean
    providers: Array<{
      name: 'google' | 'plausible' | 'mixpanel' | 'custom'
      config: Record<string, any>
    }>
  }
}

export interface BlogSEO {
  defaultTitle: string
  titleTemplate: string // e.g., "%s | My Blog"
  defaultDescription: string
  defaultKeywords: string[]
  openGraph: {
    siteName: string
    locale: string
    type: string
    image?: string
  }
  twitter: {
    handle?: string
    cardType: 'summary' | 'summary_large_image'
  }
  jsonLd: {
    enabled: boolean
    organization?: {
      name: string
      logo: string
      url: string
    }
  }
}

export interface BlogLayout {
  postsPerPage: number
  excerptLength: number
  dateFormat: string // e.g., "MMMM DD, YYYY"
  showAuthor: boolean
  showReadTime: boolean
  showTags: boolean
  showCategories: boolean
  sidebar: {
    enabled: boolean
    position: 'left' | 'right'
    widgets: Array<
      | 'recent-posts'
      | 'categories'
      | 'tags'
      | 'newsletter'
      | 'about'
      | 'custom'
    >
  }
}

export interface BlogUrls {
  base: string // e.g., "/blog"
  post: string // e.g., "/blog/[slug]"
  category: string // e.g., "/blog/category/[slug]"
  tag: string // e.g., "/blog/tag/[slug]"
  author: string // e.g., "/blog/author/[slug]"
}

export interface BlogConfig {
  name: string
  description: string
  branding: BlogBranding
  features: BlogFeatures
  seo: BlogSEO
  layout: BlogLayout
  urls: BlogUrls
  customMetadata?: Record<string, any>
}

// Default configuration that clients can override
export const defaultBlogConfig: BlogConfig = {
  name: 'TrueFlow Blog',
  description: 'Insights and resources for business growth',
  branding: {
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      text: {
        primary: '#1F2937',
        secondary: '#4B5563',
        muted: '#9CA3AF'
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        card: '#FFFFFF'
      }
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      code: 'Fira Code, monospace'
    }
  },
  features: {
    comments: {
      enabled: false
    },
    socialSharing: {
      enabled: true,
      platforms: ['twitter', 'facebook', 'linkedin', 'email']
    },
    relatedPosts: {
      enabled: true,
      count: 3,
      algorithm: 'tags'
    },
    search: {
      enabled: true,
      provider: 'internal'
    },
    newsletter: {
      enabled: true
    },
    rss: {
      enabled: true,
      title: 'TrueFlow Blog RSS Feed',
      description: 'Latest posts from TrueFlow Blog'
    },
    analytics: {
      enabled: true,
      providers: []
    }
  },
  seo: {
    defaultTitle: 'TrueFlow Blog',
    titleTemplate: '%s | TrueFlow Blog',
    defaultDescription: 'Discover insights, tips, and strategies for business growth with AI and automation.',
    defaultKeywords: ['business', 'automation', 'AI', 'growth', 'marketing'],
    openGraph: {
      siteName: 'TrueFlow Blog',
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      cardType: 'summary_large_image'
    },
    jsonLd: {
      enabled: true
    }
  },
  layout: {
    postsPerPage: 10,
    excerptLength: 160,
    dateFormat: 'MMMM DD, YYYY',
    showAuthor: true,
    showReadTime: true,
    showTags: true,
    showCategories: true,
    sidebar: {
      enabled: true,
      position: 'right',
      widgets: ['recent-posts', 'categories', 'tags', 'newsletter']
    }
  },
  urls: {
    base: '/blog',
    post: '/blog/[slug]',
    category: '/blog/category/[slug]',
    tag: '/blog/tag/[slug]',
    author: '/blog/author/[slug]'
  }
}

// Configuration loader - allows clients to override defaults
export function loadBlogConfig(customConfig?: Partial<BlogConfig>): BlogConfig {
  if (!customConfig) {
    return defaultBlogConfig
  }

  return {
    ...defaultBlogConfig,
    ...customConfig,
    branding: {
      ...defaultBlogConfig.branding,
      ...customConfig.branding,
      colors: {
        ...defaultBlogConfig.branding.colors,
        ...customConfig.branding?.colors,
        text: {
          ...defaultBlogConfig.branding.colors.text,
          ...customConfig.branding?.colors?.text
        },
        background: {
          ...defaultBlogConfig.branding.colors.background,
          ...customConfig.branding?.colors?.background
        }
      }
    },
    features: {
      ...defaultBlogConfig.features,
      ...customConfig.features,
      comments: {
        ...defaultBlogConfig.features.comments,
        ...customConfig.features?.comments
      },
      socialSharing: {
        ...defaultBlogConfig.features.socialSharing,
        ...customConfig.features?.socialSharing
      },
      relatedPosts: {
        ...defaultBlogConfig.features.relatedPosts,
        ...customConfig.features?.relatedPosts
      },
      search: {
        ...defaultBlogConfig.features.search,
        ...customConfig.features?.search
      },
      newsletter: {
        ...defaultBlogConfig.features.newsletter,
        ...customConfig.features?.newsletter
      },
      rss: {
        ...defaultBlogConfig.features.rss,
        ...customConfig.features?.rss
      },
      analytics: {
        ...defaultBlogConfig.features.analytics,
        ...customConfig.features?.analytics
      }
    },
    seo: {
      ...defaultBlogConfig.seo,
      ...customConfig.seo,
      openGraph: {
        ...defaultBlogConfig.seo.openGraph,
        ...customConfig.seo?.openGraph
      },
      twitter: {
        ...defaultBlogConfig.seo.twitter,
        ...customConfig.seo?.twitter
      },
      jsonLd: {
        ...defaultBlogConfig.seo.jsonLd,
        ...customConfig.seo?.jsonLd
      }
    },
    layout: {
      ...defaultBlogConfig.layout,
      ...customConfig.layout,
      sidebar: {
        ...defaultBlogConfig.layout.sidebar,
        ...customConfig.layout?.sidebar
      }
    },
    urls: {
      ...defaultBlogConfig.urls,
      ...customConfig.urls
    }
  }
}

// Helper function to generate CSS variables from config
export function generateCSSVariables(config: BlogConfig): string {
  const { colors } = config.branding
  
  return `
    :root {
      --blog-color-primary: ${colors.primary};
      --blog-color-secondary: ${colors.secondary};
      --blog-color-accent: ${colors.accent};
      --blog-text-primary: ${colors.text.primary};
      --blog-text-secondary: ${colors.text.secondary};
      --blog-text-muted: ${colors.text.muted};
      --blog-bg-primary: ${colors.background.primary};
      --blog-bg-secondary: ${colors.background.secondary};
      --blog-bg-card: ${colors.background.card};
      --blog-font-heading: ${config.branding.fonts.heading};
      --blog-font-body: ${config.branding.fonts.body};
      --blog-font-code: ${config.branding.fonts.code || config.branding.fonts.body};
    }
  `
}

// Export example configurations for different use cases
export const exampleConfigs = {
  // Tech blog configuration
  techBlog: {
    name: 'TechFlow Blog',
    branding: {
      colors: {
        primary: '#0EA5E9',
        secondary: '#0284C7',
        accent: '#38BDF8'
      }
    },
    features: {
      comments: {
        enabled: true,
        provider: 'disqus' as const
      },
      search: {
        enabled: true,
        provider: 'algolia' as const
      }
    }
  },
  
  // Marketing blog configuration
  marketingBlog: {
    name: 'Marketing Insights',
    branding: {
      colors: {
        primary: '#F59E0B',
        secondary: '#D97706',
        accent: '#FCD34D'
      }
    },
    features: {
      newsletter: {
        enabled: true,
        provider: 'mailchimp' as const
      },
      analytics: {
        enabled: true,
        providers: [
          {
            name: 'google' as const,
            config: { trackingId: 'G-XXXXXXXXXX' }
          }
        ]
      }
    }
  },
  
  // Corporate blog configuration
  corporateBlog: {
    name: 'Company News',
    branding: {
      colors: {
        primary: '#1E40AF',
        secondary: '#1E3A8A',
        accent: '#3B82F6'
      }
    },
    layout: {
      sidebar: {
        enabled: false
      },
      postsPerPage: 20
    }
  }
}