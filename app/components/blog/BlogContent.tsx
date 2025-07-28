'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  const [processedContent, setProcessedContent] = useState('')

  useEffect(() => {
    // Process markdown-like content to HTML
    const processContent = (text: string) => {
      // First, handle special arrow markers (→) by replacing them with bullet points
      let html = text.replace(/^→ /gm, '- ')
      
      // Split content into sections to handle lists properly
      const sections = html.split(/\n\n+/)
      
      // Process each section
      html = sections.map(section => {
        // Check if this section is a list
        const isNumberedList = /^\d+\. /.test(section.trim())
        const isBulletList = /^- /.test(section.trim())
        
        if (isNumberedList || isBulletList) {
          // Process the entire list as one unit
          return section
        }
        return section
      }).join('\n\n')
      
      // Process markdown elements
      html = html
        // Links - process before other elements to avoid conflicts
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
          // Check if it's an internal link
          if (url.startsWith('/') || url.startsWith('#')) {
            return `<a href="${url}" class="internal-link relative text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:from-blue-300 hover:to-purple-300">${linkText}</a>`
          } else {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="relative text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-purple-400 after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:from-blue-300 hover:to-purple-300">${linkText}</a>`
          }
        })
        // Headers with gradient text
        .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-8 mb-4 hover:from-cyan-300 hover:to-blue-400 transition-all duration-300">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mt-12 mb-6 hover:from-purple-300 hover:via-pink-400 hover:to-red-400 transition-all duration-300">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-12 mb-6 animate-gradient-x">$1</h1>')
        // Bold with glow effect
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white relative inline-block hover:text-yellow-300 transition-colors duration-200">$1</strong>')
        // Italic
        .replace(/\*([^*]+)\*/g, '<em class="italic text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text">$1</em>')
        // Lists with colorful markers
        .replace(/^\d+\. (.+)$/gim, '<li class="ml-6 mb-2 list-decimal marker:text-purple-400 hover:marker:text-purple-300 transition-all duration-200">$1</li>')
        .replace(/^- (.+)$/gim, '<li class="ml-6 mb-2 list-disc marker:text-cyan-400 hover:marker:text-cyan-300 transition-all duration-200">$1</li>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p class="text-white/80 leading-relaxed mb-6 hover:text-white/90 transition-colors duration-200">')
        // Code blocks with gradient border
        .replace(/```([\s\S]+?)```/g, '<pre class="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-transparent bg-clip-padding rounded-lg p-4 mb-6 overflow-x-auto relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500 before:to-blue-500 before:rounded-lg before:-z-10 before:p-[1px] hover:from-purple-900/30 hover:to-blue-900/30 transition-all duration-300"><code class="text-sm text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text font-mono">$1</code></pre>')
        // Inline code with hover effect
        .replace(/`(.+?)`/g, '<code class="bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-2 py-1 rounded text-sm text-cyan-300 hover:from-purple-500/30 hover:to-blue-500/30 hover:text-cyan-200 transition-all duration-200 font-mono">$1</code>')
        // Blockquotes with colorful styling
        .replace(/^> (.+)$/gim, '<blockquote class="my-6"><span class="text-transparent bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text italic">$1</span></blockquote>')

      // Wrap in paragraph tags
      html = `<p class="text-white/80 leading-relaxed mb-6">${html}</p>`

      // Clean up list items by wrapping consecutive ones in ul/ol tags
      html = html.replace(/(<li class="ml-6 mb-2 list-disc">[\s\S]*?<\/li>\s*)+/g, (match) => {
        return `<ul class="mb-6 space-y-2">${match}</ul>`
      })
      html = html.replace(/(<li class="ml-6 mb-2 list-decimal">[\s\S]*?<\/li>\s*)+/g, (match) => {
        return `<ol class="mb-6 space-y-2" style="list-style-type: decimal; counter-reset: item;">${match}</ol>`
      })

      return html
    }

    setProcessedContent(processContent(content))
  }, [content])

  // Handle internal link clicks
  useEffect(() => {
    const handleInternalLinks = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a.internal-link') as HTMLAnchorElement
      
      if (link && link.href) {
        e.preventDefault()
        const url = new URL(link.href)
        window.location.href = url.pathname + url.hash
      }
    }

    document.addEventListener('click', handleInternalLinks)
    return () => document.removeEventListener('click', handleInternalLinks)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style jsx>{`
        :global(ol) {
          counter-reset: list-counter;
        }
        :global(ol li) {
          counter-increment: list-counter;
        }
      `}</style>
      <div className="prose prose-lg prose-invert max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: processedContent }}
          className="[&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mt-12 [&>h1]:mb-6
                     [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mt-12 [&>h2]:mb-6
                     [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4
                     [&>p]:text-white/80 [&>p]:leading-relaxed [&>p]:mb-6
                     [&>ul]:mb-6 [&>ul]:space-y-2 [&>ul>li]:ml-6 [&>ul>li]:list-disc [&>ul>li]:text-white/80 [&>ul>li]:hover:text-white [&>ul>li]:transition-colors
                     [&>ol]:mb-6 [&>ol]:space-y-2 [&>ol]:list-decimal [&>ol]:list-inside [&>ol>li]:ml-6 [&>ol>li]:text-white/80 [&>ol>li]:hover:text-white [&>ol>li]:transition-colors
                     [&>blockquote]:border-l-4 [&>blockquote]:border-gradient-to-b [&>blockquote]:from-purple-500 [&>blockquote]:to-blue-500 [&>blockquote]:pl-6 [&>blockquote]:pr-4 [&>blockquote]:py-4 [&>blockquote]:italic [&>blockquote]:text-white/70 [&>blockquote]:bg-gradient-to-r [&>blockquote]:from-purple-500/10 [&>blockquote]:to-blue-500/10 [&>blockquote]:rounded-r-lg [&>blockquote]:hover:from-purple-500/20 [&>blockquote]:hover:to-blue-500/20 [&>blockquote]:transition-all [&>blockquote]:duration-300
                     [&>pre]:mb-6 [&>pre]:overflow-x-auto
                     [&_a]:relative [&_a]:text-transparent [&_a]:bg-gradient-to-r [&_a]:from-blue-400 [&_a]:to-purple-400 [&_a]:bg-clip-text [&_a]:font-medium [&_a]:after:content-[''] [&_a]:after:absolute [&_a]:after:left-0 [&_a]:after:bottom-0 [&_a]:after:w-full [&_a]:after:h-0.5 [&_a]:after:bg-gradient-to-r [&_a]:after:from-blue-400 [&_a]:after:to-purple-400 [&_a]:after:transform [&_a]:after:scale-x-0 [&_a]:after:transition-transform [&_a]:after:duration-300 [&_a:hover]:after:scale-x-100 [&_a:hover]:from-blue-300 [&_a:hover]:to-purple-300
                     [&_strong]:font-semibold [&_strong]:text-white
                     [&_em]:italic [&_em]:text-transparent [&_em]:bg-gradient-to-r [&_em]:from-yellow-300 [&_em]:to-orange-400 [&_em]:bg-clip-text"
        />
      </div>
    </div>
  )
}