# TrueFlow Blog Engine Documentation

## Overview

The TrueFlow Blog Engine is a white-label, extendable blog solution designed for TrueFlow clients. It provides a complete blogging platform with customization options, API endpoints, and an admin interface.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Configuration](#configuration)
3. [API Endpoints](#api-endpoints)
4. [Customization](#customization)
5. [Admin Dashboard](#admin-dashboard)
6. [Extending Functionality](#extending-functionality)
7. [Deployment](#deployment)
8. [Best Practices](#best-practices)

## Getting Started

### Quick Setup

1. Clone or copy the blog engine files to your project
2. Install dependencies: `npm install`
3. Create your custom configuration in `app/lib/blog-config.ts`
4. Start the development server: `npm run dev`

### File Structure

```
app/
├── lib/
│   ├── blog-config.ts      # Blog configuration system
│   └── blog-utils.ts       # Utility functions
├── api/blog/
│   ├── posts/              # Posts API endpoints
│   ├── categories/         # Categories API
│   ├── tags/               # Tags API
│   ├── search/             # Search API
│   └── rss/                # RSS feed generation
├── blog/
│   ├── [slug]/             # Individual blog post pages
│   ├── admin/              # Admin dashboard
│   └── page.tsx            # Blog listing page
├── types/
│   └── blog.ts             # TypeScript type definitions
└── data/
    └── blog-posts.ts       # Blog post data
```

## Configuration

### Basic Configuration

Edit `app/lib/blog-config.ts` to customize your blog:

```typescript
import { loadBlogConfig } from '@/app/lib/blog-config'

const customConfig = loadBlogConfig({
  name: 'My Company Blog',
  description: 'Insights and updates from our team',
  branding: {
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#38BDF8'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif'
    }
  },
  features: {
    comments: {
      enabled: true,
      provider: 'disqus',
      config: {
        shortname: 'your-disqus-shortname'
      }
    },
    newsletter: {
      enabled: true,
      provider: 'mailchimp',
      config: {
        apiKey: 'your-mailchimp-api-key',
        listId: 'your-list-id'
      }
    }
  }
})
```

### Configuration Options

#### Branding
- **logo**: Custom logo configuration
- **colors**: Primary, secondary, accent, text, and background colors
- **fonts**: Heading, body, and code fonts
- **customCSS**: Additional CSS styles

#### Features
- **comments**: Enable/disable comments with provider configuration
- **socialSharing**: Configure social sharing platforms
- **relatedPosts**: Algorithm and count settings
- **search**: Internal or external search providers
- **newsletter**: Email newsletter integration
- **rss**: RSS feed configuration
- **analytics**: Multiple analytics provider support

#### SEO
- **defaultTitle**: Default page title
- **titleTemplate**: Template for page titles (use %s for dynamic content)
- **defaultDescription**: Default meta description
- **openGraph**: Open Graph settings
- **twitter**: Twitter Card configuration
- **jsonLd**: Structured data settings

#### Layout
- **postsPerPage**: Number of posts per page
- **excerptLength**: Maximum excerpt length
- **dateFormat**: Date display format
- **sidebar**: Sidebar configuration and widgets

## API Endpoints

### List Posts
```http
GET /api/blog/posts?page=1&limit=10&category=marketing&sortBy=date&sortOrder=desc
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)
- `category`: Filter by category slug
- `tag`: Filter by tag slug
- `search`: Search query
- `sortBy`: Sort field (date, title, readTime)
- `sortOrder`: Sort order (asc, desc)

**Response:**
```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false
  },
  "filters": {
    "category": "marketing",
    "tag": null,
    "search": null,
    "sortBy": "date",
    "sortOrder": "desc"
  }
}
```

### Get Single Post
```http
GET /api/blog/posts/[slug]?includeRelated=true&relatedCount=3
```

**Query Parameters:**
- `includeRelated`: Include related posts (default: true)
- `relatedCount`: Number of related posts (default: 3)

**Response:**
```json
{
  "post": {
    "id": "1",
    "slug": "post-slug",
    "title": "Post Title",
    "content": "...",
    "author": {...},
    "category": {...},
    "tags": [...],
    "seo": {...}
  },
  "seo": {
    "title": "...",
    "description": "...",
    "openGraph": {...},
    "twitter": {...},
    "jsonLd": {...}
  },
  "relatedPosts": [...],
  "config": {
    "features": {
      "comments": {...},
      "socialSharing": {...}
    }
  }
}
```

### List Categories
```http
GET /api/blog/categories
```

**Response:**
```json
{
  "categories": [
    {
      "name": "Marketing",
      "slug": "marketing",
      "description": "Marketing insights",
      "postCount": 8
    }
  ],
  "total": 3
}
```

### List Tags
```http
GET /api/blog/tags
```

**Response:**
```json
{
  "tags": [
    {
      "name": "AI Tools",
      "slug": "ai-tools",
      "postCount": 5,
      "size": "lg"
    }
  ],
  "tagCloud": [...],
  "total": 9
}
```

### Search Posts
```http
GET /api/blog/search?q=automation&limit=10&searchIn=title,excerpt,content
```

**Query Parameters:**
- `q` or `query`: Search query
- `limit`: Maximum results (default: 10)
- `searchIn`: Fields to search (comma-separated)

**Response:**
```json
{
  "results": [
    {
      "id": "1",
      "title": "...",
      "excerpt": "...",
      "snippet": "...with <mark>automation</mark>..."
    }
  ],
  "query": "automation",
  "total": 5,
  "searchIn": ["title", "excerpt", "content"]
}
```

### RSS Feed
```http
GET /api/blog/rss
```

Returns RSS XML feed with proper content type headers.

## Customization

### Custom Styling

1. **CSS Variables**: The blog engine generates CSS variables based on your configuration:
```css
:root {
  --blog-color-primary: #8B5CF6;
  --blog-color-secondary: #7C3AED;
  --blog-text-primary: #1F2937;
  /* ... more variables */
}
```

2. **Custom CSS**: Add custom styles via configuration:
```typescript
branding: {
  customCSS: `
    .blog-post h2 {
      border-bottom: 2px solid var(--blog-color-accent);
    }
  `
}
```

### Custom Components

Replace default components with your own:

```typescript
// app/components/blog/CustomBlogCard.tsx
export function CustomBlogCard({ post }) {
  return (
    <div className="custom-card">
      {/* Your custom design */}
    </div>
  )
}
```

### Adding Custom Widgets

Add custom sidebar widgets:

```typescript
// app/components/blog/widgets/CustomWidget.tsx
export function CustomWidget() {
  return (
    <div className="widget">
      <h3>Custom Widget</h3>
      {/* Widget content */}
    </div>
  )
}
```

## Admin Dashboard

Access the admin dashboard at `/blog/admin`

### Features
- **Post Management**: Create, edit, and delete posts
- **Category & Tag Management**: Organize content
- **Analytics Overview**: View post performance
- **Settings**: Configure blog options

### Admin API Integration

The admin dashboard is a mockup. To make it functional:

1. Add authentication
2. Create backend API endpoints for CRUD operations
3. Connect to a database or CMS
4. Implement real-time analytics

## Extending Functionality

### Adding Comment Systems

#### Disqus Integration
```typescript
features: {
  comments: {
    enabled: true,
    provider: 'disqus',
    config: {
      shortname: 'your-site-shortname'
    }
  }
}
```

#### Custom Comment System
```typescript
// app/components/blog/comments/CustomComments.tsx
export function CustomComments({ postId }) {
  // Implement your comment system
}
```

### Adding Analytics

#### Google Analytics
```typescript
features: {
  analytics: {
    enabled: true,
    providers: [{
      name: 'google',
      config: {
        trackingId: 'G-XXXXXXXXXX'
      }
    }]
  }
}
```

#### Custom Analytics
```typescript
// app/lib/analytics.ts
export function trackPageView(path: string) {
  // Your analytics implementation
}
```

### Newsletter Integration

#### Mailchimp
```typescript
features: {
  newsletter: {
    enabled: true,
    provider: 'mailchimp',
    config: {
      apiKey: process.env.MAILCHIMP_API_KEY,
      listId: process.env.MAILCHIMP_LIST_ID
    }
  }
}
```

#### Custom Newsletter
```typescript
// app/api/newsletter/subscribe/route.ts
export async function POST(request: Request) {
  // Handle newsletter subscription
}
```

## Deployment

### Environment Variables

Create a `.env.local` file:

```env
# API Keys
MAILCHIMP_API_KEY=your-key
DISQUS_SHORTNAME=your-shortname

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Database (if using)
DATABASE_URL=your-database-url
```

### Deployment Options

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Performance Optimization

1. **Static Generation**: Pre-render blog posts at build time
2. **Image Optimization**: Use Next.js Image component
3. **Caching**: Implement proper cache headers
4. **CDN**: Serve static assets via CDN

## Best Practices

### Content Management

1. **Consistent Formatting**: Use markdown consistently
2. **SEO Optimization**: Always fill in SEO metadata
3. **Image Optimization**: Compress images before upload
4. **Regular Updates**: Keep content fresh and relevant

### Performance

1. **Lazy Loading**: Load images and components as needed
2. **Code Splitting**: Split large components
3. **Minimize JavaScript**: Remove unused code
4. **Cache Strategy**: Implement proper caching

### Security

1. **Input Validation**: Validate all user inputs
2. **XSS Prevention**: Sanitize HTML content
3. **Rate Limiting**: Implement API rate limits
4. **Authentication**: Secure admin routes

### Maintenance

1. **Regular Backups**: Backup content regularly
2. **Monitor Performance**: Track loading times
3. **Update Dependencies**: Keep packages updated
4. **Test Changes**: Test in staging before production

## Example Implementations

### Tech Blog
```typescript
const techBlogConfig = {
  name: 'DevTech Blog',
  branding: {
    colors: {
      primary: '#0EA5E9',
      secondary: '#0284C7'
    }
  },
  features: {
    comments: { enabled: true, provider: 'disqus' },
    search: { enabled: true, provider: 'algolia' }
  }
}
```

### Marketing Blog
```typescript
const marketingBlogConfig = {
  name: 'Marketing Insights',
  branding: {
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706'
    }
  },
  features: {
    newsletter: { enabled: true, provider: 'mailchimp' },
    analytics: { enabled: true }
  }
}
```

### Corporate Blog
```typescript
const corporateBlogConfig = {
  name: 'Company News',
  branding: {
    colors: {
      primary: '#1E40AF',
      secondary: '#1E3A8A'
    }
  },
  layout: {
    sidebar: { enabled: false },
    postsPerPage: 20
  }
}
```

## Support

For questions or issues:
- Check the documentation
- Review example implementations
- Contact TrueFlow support

---

Last updated: January 2024