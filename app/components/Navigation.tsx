'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])
  
  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/true-flow-logo.webp" 
              alt="TrueFlow" 
              width={280} 
              height={70} 
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto transform hover:scale-105 transition-transform"
              priority
              style={{ 
                maxWidth: '100%',
                objectFit: 'contain'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {pathname !== '/' && (
              <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                Back to Home
              </Link>
            )}
            {pathname === '/' && (
              <>
                <Link href="/content-engine" className="text-white/70 hover:text-white transition-colors">Content Engine</Link>
                <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How it Works</a>
                <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Success Stories</a>
                <a href="#blog" className="text-white/70 hover:text-white transition-colors">Blog</a>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">FAQs</Link>
              </>
            )}
            <Link 
              href="/get-started" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            <Link 
              href="/" 
              onClick={handleLinkClick}
              className={`block hover:text-white transition-colors text-lg ${pathname === '/' ? 'text-white font-semibold' : 'text-white/70'}`}
            >
              Home
            </Link>
            <Link 
              href="/content-engine" 
              onClick={handleLinkClick}
              className={`block hover:text-white transition-colors text-lg ${pathname === '/content-engine' ? 'text-white font-semibold' : 'text-white/70'}`}
            >
              Content Engine
            </Link>
            <Link 
              href="/blog" 
              onClick={handleLinkClick}
              className={`block hover:text-white transition-colors text-lg ${pathname.startsWith('/blog') ? 'text-white font-semibold' : 'text-white/70'}`}
            >
              Blog
            </Link>
            <Link 
              href="/faq" 
              onClick={handleLinkClick}
              className={`block hover:text-white transition-colors text-lg ${pathname === '/faq' ? 'text-white font-semibold' : 'text-white/70'}`}
            >
              FAQs
            </Link>
            {pathname === '/' && (
              <>
                <a 
                  href="#features" 
                  onClick={handleLinkClick}
                  className="block text-white/70 hover:text-white transition-colors text-lg"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={handleLinkClick}
                  className="block text-white/70 hover:text-white transition-colors text-lg"
                >
                  How it Works
                </a>
                <a 
                  href="#testimonials" 
                  onClick={handleLinkClick}
                  className="block text-white/70 hover:text-white transition-colors text-lg"
                >
                  Success Stories
                </a>
              </>
            )}
            <Link 
              href="/get-started" 
              onClick={handleLinkClick}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold block text-center mt-6"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}