/**
 * TrueFlow AI Landing Page - Apple-inspired Design
 * Self-contained landing page with 3D carousel and modern animations
 */

'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './animations.css'
import { 
  ChevronRight, 
  Play, 
  Sparkles, 
  Zap, 
  Brain, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Users, 
  MessageSquare,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
  Clock,
  Target,
  BarChart3,
  Mic,
  FileText,
  Send,
  Filter,
  Menu,
  X,
  MousePointer,
  Smartphone,
  Laptop,
  Shield,
  Layers,
  Instagram,
  Facebook,
  MessageCircle,
  Youtube
} from 'lucide-react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface CursorTrailPoint {
  x: number
  y: number
  timestamp: number
}

// Enhanced animated counter hook
function useAnimatedCounter(endValue: number, duration: number = 2000, prefix: string = '', suffix: string = '', shouldAnimate: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  
  useEffect(() => {
    if (!shouldAnimate || hasStarted) return
    
    setHasStarted(true)
    const startTime = Date.now()
    const startValue = 0
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      
      setCount(Math.floor(currentValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }
    
    requestAnimationFrame(animate)
  }, [endValue, duration, shouldAnimate, hasStarted])
  
  return `${prefix}${count}${suffix}`
}

// Animated step number component to avoid hooks in loops
function AnimatedStepNumber({ stepNumber, index, visible }: { stepNumber: number, index: number, visible: boolean }) {
  const animatedValue = useAnimatedCounter(stepNumber, 1000 + index * 300, '', '', visible)
  
  return (
    <div className={`absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-white to-gray-100 text-black rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold shadow-xl border-2 sm:border-4 border-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`} 
      style={{ animationDelay: `${index * 300 + 800}ms` }}>
      {animatedValue}
    </div>
  )
}

// Generic animated value component
function AnimatedValue({ endValue, duration, prefix = '', suffix = '', visible }: { 
  endValue: number, 
  duration: number, 
  prefix?: string, 
  suffix?: string, 
  visible: boolean 
}) {
  const animatedValue = useAnimatedCounter(endValue, duration, prefix, suffix, visible)
  return <>{animatedValue}</>
}

// TypewriterText component for the hero section
function TypewriterText({ gradientOffset }: { gradientOffset: number }) {
  const phrases = ['think', 'adapt', 'scale', 'grow', 'respond', 'learn', 'optimize', 'automate']
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    // Use setInterval instead of setTimeout for continuous animation
    let animationInterval: NodeJS.Timeout | null = null
    
    const animate = () => {
      const currentPhrase = phrases[currentPhraseIndex]
      
      if (isWaiting) {
        // Keep waiting state for 4 seconds (longer pause to linger)
        const waitStart = Date.now()
        animationInterval = setInterval(() => {
          if (Date.now() - waitStart >= 4000) {
            setIsWaiting(false)
            setIsDeleting(true)
            if (animationInterval) clearInterval(animationInterval)
          }
        }, 50)
      } else if (isDeleting) {
        // Delete animation - slower and more gentle
        animationInterval = setInterval(() => {
          setCurrentText(prev => {
            if (prev.length > 0) {
              return prev.slice(0, -1)
            } else {
              setIsDeleting(false)
              setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
              if (animationInterval) clearInterval(animationInterval)
              return prev
            }
          })
        }, 80) // Delete speed: 80ms per character (slower)
      } else {
        // Typing animation - more gradual
        animationInterval = setInterval(() => {
          setCurrentText(prev => {
            if (prev.length < currentPhrase.length) {
              return currentPhrase.slice(0, prev.length + 1)
            } else {
              setIsWaiting(true)
              if (animationInterval) clearInterval(animationInterval)
              return prev
            }
          })
        }, 150) // Type speed: 150ms per character (more gradual)
      }
    }
    
    // Start animation
    animate()
    
    // Use visibility change API to maintain animation state
    const handleVisibilityChange = () => {
      if (!document.hidden && !animationInterval) {
        animate()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      if (animationInterval) clearInterval(animationInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isDeleting, isWaiting, currentPhraseIndex])

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500) // Blink every 500ms
    return () => clearInterval(cursorTimer)
  }, [])

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientOffset}deg, 
      hsl(${(gradientOffset + 220) % 360}, 70%, 60%), 
      hsl(${(gradientOffset + 280) % 360}, 80%, 65%), 
      hsl(${(gradientOffset + 340) % 360}, 85%, 70%), 
      hsl(${(gradientOffset + 40) % 360}, 75%, 65%))`,
    backgroundSize: '300% 300%',
    animation: `gradient-shift 3s ease-in-out infinite`
  }

  return (
    <span className="relative inline-block">
      <span 
        className="bg-clip-text text-transparent font-bold"
        style={gradientStyle}
      >
        {currentText}{currentText === phrases[currentPhraseIndex] ? '.' : ''}
        <span 
          className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 inline-block ml-1`}
        >
          |
        </span>
      </span>
    </span>
  )
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(-1)
  const [mounted, setMounted] = useState(false)
  const [gradientOffset, setGradientOffset] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorTrail, setCursorTrail] = useState<CursorTrailPoint[]>([])
  const cursorTrailRef = useRef<CursorTrailPoint[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const [statsVisible, setStatsVisible] = useState(true)
  const [animatedValues, setAnimatedValues] = useState<Record<string, string | number>>({
    "10x": "10x",
    "85%": "85%",
    "300%": "300%",
    "500+": "500+"
  })
  const [howItWorksVisible, setHowItWorksVisible] = useState(true)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const [testimonialsVisible, setTestimonialsVisible] = useState(true)
  const [fragmentationProgress, setFragmentationProgress] = useState(0)
  
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const featuresScrollRef = useRef<HTMLDivElement>(null)
  const testimonialsScrollRef = useRef<HTMLDivElement>(null)
  const fragmentationRef = useRef<HTMLDivElement>(null)

  // Enhanced pricing visibility state
  const [pricingVisible, setPricingVisible] = useState(false)
  const pricingRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: <Users className="h-16 w-16" />,
      title: "Lead Capture & Tracking",
      description: "Seamlessly capture leads from multiple channels and track their journey through your sales funnel with real-time analytics and automated scoring.",
      gradient: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: <Mail className="h-16 w-16" />,
      title: "Automated Follow-Up",
      description: "Never miss a follow-up again. Smart automation sends personalized messages at the perfect moment to nurture leads and close deals.",
      gradient: "from-purple-500 to-pink-500",
      delay: 100
    },
    {
      icon: <Shield className="h-16 w-16" />,
      title: "Command Dashboard",
      description: "Get a bird's-eye view of your entire operation. Monitor performance, track KPIs, and make data-driven decisions from one central hub.",
      gradient: "from-green-500 to-emerald-500",
      delay: 200
    },
    {
      icon: <Zap className="h-16 w-16" />,
      title: "AI-Powered Content Engine",
      description: "Transform your voice into engaging content. Create blogs, newsletters, and social media posts automatically from simple voice recordings.",
      gradient: "from-orange-500 to-red-500",
      delay: 300
    }
  ]

  // Auto-rotate features removed for better UX
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentFeatureIndex((prev) => (prev + 1) % features.length)
  //   }, 5000)
  //   
  //   return () => clearInterval(interval)
  // }, [features.length])


  // Generate floating particles
  const generateParticles = () => {
    const particleCount = 50
    const newParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 4)]
      })
    }
    setParticles(newParticles)
  }

  // Animate particles
  const animateParticles = () => {
    setParticles(prev => prev.map(particle => {
      let newX = particle.x + particle.vx
      let newY = particle.y + particle.vy
      
      // Wrap around screen edges
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800
      if (newX > screenWidth) newX = 0
      if (newX < 0) newX = screenWidth
      if (newY > screenHeight) newY = 0
      if (newY < 0) newY = screenHeight
      
      return {
        ...particle,
        x: newX,
        y: newY
      }
    }))
  }

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      generateParticles()
    }
  }, [])

  // Force clean background for landing page
  useEffect(() => {
    const originalBodyStyle = document.body.style.cssText
    const originalHtmlStyle = document.documentElement.style.cssText
    
    document.body.style.background = '#000000'
    document.body.style.backgroundImage = 'none'
    document.body.style.animation = 'none'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.documentElement.style.background = '#000000'
    document.documentElement.style.backgroundImage = 'none'
    
    return () => {
      document.body.style.cssText = originalBodyStyle
      document.documentElement.style.cssText = originalHtmlStyle
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      // Auto-scroll testimonials horizontally with Apple-style lock behavior
      if (testimonialsScrollRef.current) {
        const rect = testimonialsScrollRef.current.getBoundingClientRect()
        const sectionHeight = window.innerHeight * 1.5
        const triggerStart = rect.top + window.innerHeight * 0.3
        const triggerEnd = triggerStart - sectionHeight
        
        if (rect.top <= triggerStart && rect.top >= triggerEnd) {
          const progress = Math.max(0, Math.min(1, (triggerStart - rect.top) / sectionHeight))
          const maxScroll = testimonialsScrollRef.current.scrollWidth - testimonialsScrollRef.current.clientWidth
          testimonialsScrollRef.current.scrollLeft = progress * maxScroll
        }
      }

      // Check if stats are visible for animation
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && !statsVisible) {
          setStatsVisible(true)
          animateStats()
        }
      }

      // Fragmentation animation based on scroll
      if (fragmentationRef.current) {
        const rect = fragmentationRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Calculate progress based on element position in viewport
        const elementTop = rect.top
        const elementHeight = rect.height
        
        // Start animation when element enters viewport from bottom
        if (elementTop < windowHeight && elementTop > -elementHeight) {
          // Progress from 0 (just entering) to 1 (center of viewport)
          const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / windowHeight))
          setFragmentationProgress(progress)
        }
      }

      // Check if how it works section is visible
      if (howItWorksRef.current) {
        const rect = howItWorksRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && !howItWorksVisible) {
          setHowItWorksVisible(true)
        }
      }

      // Check if testimonials section is visible
      if (testimonialsScrollRef.current) {
        const rect = testimonialsScrollRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && !testimonialsVisible) {
          setTestimonialsVisible(true)
        }
      }

      // Check if pricing section is visible
      if (pricingRef.current) {
        const rect = pricingRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && !pricingVisible) {
          setPricingVisible(true)
        }
      }
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setMousePosition(newPos)
      
      // Add to cursor trail
      cursorTrailRef.current.push({
        x: newPos.x,
        y: newPos.y,
        timestamp: Date.now()
      })
      
      // Keep only recent trail points (last 500ms)
      const now = Date.now()
      cursorTrailRef.current = cursorTrailRef.current.filter(point => now - point.timestamp < 500)
      setCursorTrail([...cursorTrailRef.current])
    }
    
    // Animation loop for particles and gradients
    // Use setInterval for gradient animation to continue when tab loses focus
    const gradientInterval = setInterval(() => {
      setGradientOffset(prev => (prev + 0.5) % 360)
    }, 16) // ~60fps but slower rotation (0.5 degree per frame instead of 1)
    
    // Particle animation can use requestAnimationFrame
    const animateLoop = () => {
      animateParticles()
      animationFrameRef.current = requestAnimationFrame(animateLoop)
    }
    
    animationFrameRef.current = requestAnimationFrame(animateLoop)
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(gradientInterval)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted])

  // Don't render dynamic content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const testimonials = [
    {
      name: "Chris",
      role: "Online Fitness Coach",
      company: "",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "Before TrueFlow, I was manually replying to DMs with no follow-up system and feeling overwhelmed with content creation. Now I have automated DM flows and AI-driven content with a clear pipeline. This changed how I run my business.",
      results: ["50% more client inquiries", "Automated DM workflows", "Clear sales pipeline"]
    },
    {
      name: "Melisa", 
      role: "Women's Coaching Program",
      company: "",
      image: "https://images.unsplash.com/photo-1494790108755-2616b9fc6ad1?w=150&h=150&fit=crop&crop=face",
      quote: "I had scattered offers, inconsistent follow-up, and time-consuming planning. TrueFlow gave me clarity in my offer, a structured funnel, and automated lead tracking and scheduling. Now I can focus on coaching.",
      results: ["Waitlist launch in days", "Structured funnel built", "Streamlined operations"]
    },
    {
      name: "Andrew",
      role: "Chiropractic Clinic", 
      company: "",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "I struggled to follow up with leads, track appointments, and manage forms. With TrueFlow's AI-driven lead capture, integrated scheduling, and automatic form tracking system, more calls get booked and intake is smoother. The backend now works like it should.",
      results: ["More calls booked", "Smoother intake process", "Automated form tracking"]
    }
  ]

  const stats = [
    { value: "10x", label: "Faster Content Creation", icon: <Clock className="h-12 w-12" /> },
    { value: "85%", label: "Average Open Rate", icon: <Mail className="h-12 w-12" /> },
    { value: "300%", label: "Engagement Increase", icon: <TrendingUp className="h-12 w-12" /> },
    { value: "500+", label: "Hours Saved Monthly", icon: <Zap className="h-12 w-12" /> }
  ]

  // Animate stats when they come into view
  const animateStats = () => {
    // Reset values to 0 before animating
    setAnimatedValues({
      "10x": "0x",
      "85%": "0%",
      "300%": "0%",
      "500+": "0+"
    })
    
    const targets = {
      "10x": 10,
      "85%": 85,
      "300%": 300,
      "500+": 500
    }

    Object.keys(targets).forEach((key, index) => {
      setTimeout(() => {
        let current = 0
        const target = targets[key as keyof typeof targets]
        const increment = target / 50 // 50 steps
        const interval = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(interval)
          }
          
          setAnimatedValues(prev => ({
            ...prev,
            [key]: key.includes('%') ? `${Math.round(current)}%` : 
                   key.includes('+') ? `${Math.round(current)}+` :
                   key.includes('x') ? `${Math.round(current)}x` : Math.round(current)
          }))
        }, 20) // 20ms intervals for smooth animation
      }, index * 200) // Stagger animations
    })
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.1}s`,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}

      {/* Cursor Trail */}
      <div className="cursor-trail">
        {cursorTrail.map((point, index) => {
          const age = Date.now() - point.timestamp
          const opacity = Math.max(0, 1 - age / 500)
          const size = Math.max(2, 8 - (age / 500) * 6)
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: point.x - size / 2,
                top: point.y - size / 2,
                width: size,
                height: size,
                background: `radial-gradient(circle, rgba(59, 130, 246, ${opacity}) 0%, rgba(139, 92, 246, ${opacity * 0.5}) 50%, transparent 100%)`,
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          )
        })}
      </div>

      {/* Interactive Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(59, 130, 246, 0.05) 0%, 
            rgba(139, 92, 246, 0.03) 25%, 
            transparent 50%)`,
          transition: 'background 0.3s ease-out'
        }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 transition-all duration-500 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex items-center">
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
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/70 hover:text-white transition-colors text-lg">Home</a>
              <Link href="/content-engine" className="text-white/70 hover:text-white transition-colors text-lg">Content Engine</Link>
              <a href="#features" className="text-white/70 hover:text-white transition-colors text-lg">Features</a>
              <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors text-lg">How it Works</a>
              <a href="#testimonials" className="text-white/70 hover:text-white transition-colors text-lg">Success Stories</a>
              <Link href="/faq" className="text-white/70 hover:text-white transition-colors text-lg">FAQs</Link>
              <Link href="/get-started" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold">
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
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-lg">Home</a>
              <Link href="/content-engine" className="block text-white/70 hover:text-white transition-colors text-lg">Content Engine</Link>
              <a href="#features" className="block text-white/70 hover:text-white transition-colors text-lg">Features</a>
              <a href="#how-it-works" className="block text-white/70 hover:text-white transition-colors text-lg">How it Works</a>
              <a href="#testimonials" className="block text-white/70 hover:text-white transition-colors text-lg">Success Stories</a>
              <Link href="/faq" className="block text-white/70 hover:text-white transition-colors text-lg">FAQs</Link>
              <Link href="/get-started" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold block text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 pt-32"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Link href="/content-engine" className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-12 border border-white/20 mt-16 hover:bg-white/20 transition-colors">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-white/90 text-lg">Introducing TrueFlow AI Content Engine</span>
            </Link>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 sm:mb-8 leading-tight px-2">
              We build AI systems that<br />
              <span className="inline-block min-h-[1.2em]">
                <TypewriterText gradientOffset={gradientOffset} />
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/70 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
              Transform your voice into powerful content and automate your entire business. 
              AI-powered content creation, lead management, customer support, and compliance monitoring in one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4">
              <Link 
                href="/get-started" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 lg:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2 sm:space-x-3 relative overflow-hidden group w-full sm:w-auto justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Discover TrueFlow</span>
                <ChevronRight className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link href="/coming-soon" className="flex items-center space-x-3 sm:space-x-4 text-white/70 hover:text-white transition-all duration-300 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-300 relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 "></div>
                  <Play className="h-4 w-4 sm:h-6 sm:w-6 ml-1 relative z-10 group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <span className="text-lg sm:text-xl group-hover:text-blue-400 transition-colors duration-300">Watch Demo</span>
              </Link>
            </div>
          </div>

          {/* Enhanced Floating Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 mb-20 sm:mb-24 lg:mb-32 px-4" ref={statsRef}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 text-center hover:bg-white/10 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden transform-gpu ${
                  ''
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)'
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const mouseX = e.clientX - centerX
                  const mouseY = e.clientY - centerY
                  const rotateX = (mouseY / rect.height) * -12
                  const rotateY = (mouseX / rect.width) * 12
                  e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.05)`
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const mouseX = e.clientX - centerX
                  const mouseY = e.clientY - centerY
                  const rotateX = (mouseY / rect.height) * -12
                  const rotateY = (mouseX / rect.width) * 12
                  e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.05)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.5s_ease-in-out_infinite] -skew-x-12"></div>
                
                {/* Dynamic gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Floating particles on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full animate-[icon-float_2s_ease-in-out_infinite]"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Icon with gentle animation */}
                <div className={`flex justify-center mb-4 text-blue-400 group-hover:text-blue-300 relative z-10 transition-all duration-500 ${
                  ''
                }`} style={{ animationDelay: `${index * 300}ms` }}>
                  {stat.icon}
                </div>
                
                {/* Animated number with gentle effect */}
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-100 transition-all duration-500 relative z-10 ${
                  ''
                }`} 
                style={{ 
                  animationDelay: `${index * 200 + 400}ms`
                }}>
                  {animatedValues[stat.value] || stat.value}
                </div>
                
                {/* Label with slide-in effect */}
                <div className={`text-sm sm:text-base lg:text-lg text-white/70 group-hover:text-white/90 transition-all duration-500 relative z-10 ${
                  'translate-y-0 opacity-100'
                }`}
                style={{ 
                  transitionDelay: `${index * 200 + 600}ms`
                }}>
                  {stat.label}
                </div>

                {/* Gentle border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-all duration-500 animate-[soft-glow_3s_ease-in-out_infinite]" style={{ animationDelay: `${index * 500}ms` }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator - Hide when scrolled */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-300 ${
            scrollY > 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Problem Statement - Storytelling Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Story Timeline */}
          <div className="space-y-20 sm:space-y-24 lg:space-y-32">
            
            {/* Chapter 1: Once Upon A Time */}
            <div className="text-center relative">
              <div className="inline-block bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 mb-8">
                <span className="text-white/70 text-lg font-medium">Chapter 1</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Once Upon A Time...
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-8 leading-relaxed">
                  Manual everything. Growth = more hires = less profit.
                </p>
                
                {/* Dynamic visual - Person overwhelmed with tasks */}
                <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/20 mx-auto max-w-lg overflow-hidden">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Central person icon with stress animation */}
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center animate-pulse">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      
                      {/* Orbiting tasks around the person */}
                      {[
                        { icon: Mail, angle: 0 },
                        { icon: Calendar, angle: 60 },
                        { icon: FileText, angle: 120 },
                        { icon: BarChart3, angle: 180 },
                        { icon: MessageSquare, angle: 240 },
                        { icon: Target, angle: 300 }
                      ].map((task, index) => (
                        <div
                          key={index}
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                            width: '120px',
                            height: '120px',
                            animation: `orbit-wrapper-${task.angle} 15s linear infinite`,
                          }}
                        >
                          <div
                            className="absolute w-8 h-8 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center text-red-400"
                            style={{
                              right: '0',
                              top: '50%',
                              transform: 'translateY(-50%)',
                            }}
                          >
                            <task.icon className="h-4 w-4" />
                          </div>
                        </div>
                      ))}
                      
                      {/* Stress lines radiating from center */}
                      <div className="absolute inset-0 animate-ping">
                        <div className="w-full h-full rounded-full border-2 border-red-500/30"></div>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-center font-medium animate-bounce">
                      One person, infinite responsibilities
                    </p>
                  </div>
                  
                  {/* Background stress pattern */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-red-400 rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${2 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Transition from Chapter 1 to Chapter 2 */}
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-500/50"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500/50 to-red-500/50"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-red-500/50 to-transparent"></div>
              </div>
            </div>

            {/* Chapter 2: Then Came Automation */}
            <div className="text-center relative">
              <div className="inline-block bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 mb-8">
                <span className="text-white/70 text-lg font-medium">Chapter 2</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Then Came Automation & Intelligence
              </h2>
              
              <div className="max-w-4xl mx-auto mb-16">
                <p className="text-xl text-white/80 mb-8">
                  More tools. Better results. Higher costs.
                </p>
                
                {/* Simple Tools Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
                  {[
                    { 
                      name: 'CRMs', 
                      color: 'from-blue-500 to-blue-600',
                      icon: Users
                    },
                    { 
                      name: 'Zapier', 
                      color: 'from-orange-500 to-red-500',
                      icon: Zap
                    },
                    { 
                      name: 'AI Tools', 
                      color: 'from-cyan-500 to-blue-500',
                      icon: Brain
                    },
                  ].map((tool, index) => (
                    <div
                      key={tool.name}
                      className={`bg-gradient-to-r ${tool.color} p-4 rounded-lg text-center flex flex-col items-center justify-center`}
                    >
                      <tool.icon className="w-8 h-8 text-white mb-2" />
                      <span className="text-white font-medium text-xs">{tool.name}</span>
                    </div>
                  ))}
                </div>

                <p className="text-2xl text-white/90 font-semibold mb-6">
                  But then reality hit...
                </p>
                
                {/* Simple Problem Statement */}
                <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20 max-w-xl mx-auto">
                  <p className="text-red-400 font-semibold text-lg mb-2">$1500+/month. Data everywhere.</p>
                  <p className="text-red-400 font-semibold text-lg mb-2">$10,000+ per month for employees to manage those tools...</p>
                  <p className="text-white/70 text-sm">Think systems administrators, social media managers, virtual assistants...</p>
                  <p className="text-white/70 mt-2">Fragmented & Disconnected</p>
                </div>
              </div>
            </div>

            {/* Transition from Chapter 2 to Chapter 3 */}
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500/50"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50"></div>
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg shadow-purple-500/50" style={{ animationDelay: '0.3s' }}>
                  <Sparkles className="h-3 w-3 text-white m-auto mt-1" />
                </div>
                <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" style={{ animationDelay: '0.6s' }}></div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              </div>
            </div>

            {/* Chapter 3: Now */}
            <div className="text-center relative">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-6 py-3 border-2 border-blue-400/50 mb-8 shadow-lg shadow-blue-500/25">
                <span className="text-white text-lg font-bold">Chapter 3</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Now... TrueFlow
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-8 leading-relaxed">
                  Everything in one place. One subscription. One system that works.
                </p>
                
                {/* Dynamic unification visual */}
                <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/20 mx-auto max-w-lg overflow-hidden">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Central TrueFlow hub with converging elements */}
                    <div className="relative w-40 h-40">
                      {/* Central TrueFlow logo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Static positioned elements attached to lines */}
                      {[
                        { icon: Mail, angle: 0, name: 'Email' },
                        { icon: Calendar, angle: 60, name: 'Calendar' },
                        { icon: BarChart3, angle: 120, name: 'Analytics' },
                        { icon: MessageSquare, angle: 180, name: 'Chat' },
                        { icon: Target, angle: 240, name: 'CRM' },
                        { icon: FileText, angle: 300, name: 'Content' }
                      ].map((tool, index) => {
                        const radians = (tool.angle - 90) * Math.PI / 180;
                        const x = 80 + 60 * Math.cos(radians);
                        const y = 80 + 60 * Math.sin(radians);
                        return (
                          <div
                            key={tool.name}
                            className="absolute w-6 h-6 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-lg animate-pulse"
                            style={{
                              left: `${x - 12}px`,
                              top: `${y - 12}px`,
                              animationDelay: `${index * 0.2}s`
                            }}
                          >
                            <tool.icon className="h-3 w-3 text-white" />
                          </div>
                        );
                      })}
                      
                      {/* Connecting lines that pulse */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
                        {/* Lines for all 6 icons */}
                        {[0, 60, 120, 180, 240, 300].map((angle, index) => {
                          const radians = (angle - 90) * Math.PI / 180;
                          const x = 80 + 60 * Math.cos(radians);
                          const y = 80 + 60 * Math.sin(radians);
                          return (
                            <line
                              key={angle}
                              x1="80"
                              y1="80"
                              x2={x}
                              y2={y}
                              stroke="url(#connectionGradient)"
                              strokeWidth="2"
                              className="animate-pulse"
                              style={{
                                animationDelay: `${index * 0.3}s`,
                                animationDuration: '2s'
                              }}
                            />
                          );
                        })}
                        <defs>
                          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Energy rings */}
                      <div className="absolute inset-0 animate-ping">
                        <div className="w-full h-full rounded-full border border-blue-400/30"></div>
                      </div>
                      <div className="absolute inset-4 animate-ping" style={{ animationDelay: '0.5s' }}>
                        <div className="w-full h-full rounded-full border border-purple-400/30"></div>
                      </div>
                    </div>
                    
                    <p className="text-white/90 text-center font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Your business. Unified.
                    </p>
                    
                    {/* Success indicators */}
                    <div className="flex items-center justify-center space-x-6 text-green-400">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 animate-pulse" />
                        <span className="text-sm font-medium">One Platform</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <span className="text-sm font-medium">One Price</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 animate-pulse" style={{ animationDelay: '1s' }} />
                        <span className="text-sm font-medium">One Solution</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Background harmony pattern */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                        style={{
                          left: `${20 + (i % 3) * 30}%`,
                          top: `${20 + Math.floor(i / 3) * 20}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: '3s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transition element to next section */}
          <div className="text-center mt-16 sm:mt-20 lg:mt-24">
            <div className="w-1 h-16 bg-gradient-to-b from-white/50 to-transparent mx-auto mb-8"></div>
            <p className="text-white/50 text-lg">Discover how TrueFlow transforms your business</p>
            <button 
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-12 h-12 border-2 border-white/30 rounded-full flex items-center justify-center mx-auto mt-6 animate-bounce hover:border-white/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6 text-white/50 rotate-90" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Carousel Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 overflow-hidden pt-16 sm:pt-24 lg:pt-32" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8">
              TrueFlow Core System
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
              Everything you need. Nothing you don't. Built for speed, clarity, and scale.
            </p>
          </div>

          {/* Modern Feature Grid */}
          <div className="relative">
            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10 hover:border-white/15 transition-all duration-500 hover:bg-white/7 cursor-pointer ${
                    index === currentFeatureIndex ? 'ring-1 ring-blue-500/30 bg-white/8' : ''
                  }`}
                  onClick={() => setCurrentFeatureIndex(index)}
                  style={{
                    animationDelay: `${feature.delay}ms`
                  }}
                >
                  {/* Gradient border effect */}
                  <div 
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${
                      index === currentFeatureIndex ? 'opacity-20' : ''
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        feature.gradient.includes('from-blue-500') && feature.gradient.includes('to-cyan-500') ? '#3b82f6, #06b6d4' :
                        feature.gradient.includes('from-purple-500') && feature.gradient.includes('to-pink-500') ? '#8b5cf6, #ec4899' :
                        feature.gradient.includes('from-green-500') && feature.gradient.includes('to-emerald-500') ? '#10b981, #059669' :
                        feature.gradient.includes('from-orange-500') && feature.gradient.includes('to-red-500') ? '#f97316, #ef4444' :
                        '#3b82f6, #06b6d4'
                      })`,
                      filter: 'blur(20px)',
                      zIndex: -1
                    }}
                  />
                  
                  {/* Icon */}
                  <div className={`mb-6 text-white transition-all duration-500 flex items-center justify-center w-16 h-16 rounded-xl ${
                    `bg-gradient-to-br ${feature.gradient}`
                  } group-hover:scale-105`}>
                    <div className="scale-75">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Learn More Link */}
                  <Link href="/content-engine" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300 group-hover:translate-x-2">
                    <span className="font-medium">Learn More</span>
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300" />
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center space-x-3">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatureIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeatureIndex 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 px-4" ref={howItWorksRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-5xl md:text-7xl font-bold text-white mb-8 transition-all duration-1000 ${
              ''
            }`}>
              How It Works
            </h2>
            <p className={`text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto px-4 transition-all duration-1000 ${
              ''
            }`}>
              Transform your ideas into powerful content in three simple steps
            </p>
          </div>

          {/* Animated Progress Line */}
          <div className="relative mb-20">
            <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-white/20 rounded-full">
              <div className={`h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full transition-all duration-2000 ${
                'w-full'
              }`}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 relative px-4 sm:px-0">
            {[
              {
                step: 1,
                title: "Record Your Ideas",
                description: "Simply speak your thoughts, insights, or topics you want to share. Our AI captures every nuance of your voice and style.",
                icon: <Mic className="h-16 w-16" strokeWidth={1.5} />,
                color: "from-green-500 to-emerald-600",
                animation: "slide-in-left"
              },
              {
                step: 2, 
                title: "AI Transforms Content",
                description: "Our advanced AI analyzes your transcript and creates engaging newsletters and blog posts that sound authentically you.",
                icon: <Brain className="h-16 w-16" strokeWidth={1.5} />,
                color: "from-blue-500 to-purple-600",
                animation: "slide-in-up"
              },
              {
                step: 3,
                title: "Automated Publishing",
                description: "Content is automatically scheduled and sent to your audience at optimal times for maximum engagement and results.",
                icon: <Send className="h-16 w-16" strokeWidth={1.5} />,
                color: "from-purple-500 to-pink-600",
                animation: "slide-in-right"
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`text-center group bg-black/40 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 hover:bg-black/60 hover:border-white/30 relative transition-all duration-700 transform-gpu perspective-1000 ${
                  ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const mouseX = e.clientX - centerX
                  const mouseY = e.clientY - centerY
                  const rotateX = (mouseY / rect.height) * -20
                  const rotateY = (mouseX / rect.width) * 20
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.05)`
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const mouseX = e.clientX - centerX
                  const mouseY = e.clientY - centerY
                  const rotateX = (mouseY / rect.height) * -20
                  const rotateY = (mouseX / rect.width) * 20
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.05)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Floating microparticles */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/40 rounded-full animate-[icon-float_3s_ease-in-out_infinite]"
                      style={{
                        left: `${15 + i * 10}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.4}s`
                      }}
                    />
                  ))}
                </div>

                <div className="relative mb-8 sm:mb-10 lg:mb-12 transform transition-all duration-500 group-hover:scale-105" style={{ margin: '2rem 0.5rem 2rem 0.5rem' }}>
                  {/* Animated circle with gentle glow */}
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto text-white shadow-xl group-hover:shadow-2xl transition-all duration-500 relative ${
                    ''
                  }`} style={{ animationDelay: `${index * 500}ms` }}>
                    {/* Gentle rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="absolute inset-2 rounded-full border border-white/10 opacity-50"></div>
                    
                    {/* Icon with gentle animation */}
                    <div className={`transform transition-all duration-500 group-hover:scale-105 ${
                      ''
                    }`} style={{ animationDelay: `${index * 700}ms` }}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Step number with enhanced styling - positioned to not get cut off */}
                  <AnimatedStepNumber stepNumber={step.step} index={index} visible={howItWorksVisible} />
                </div>

                {/* Title with typewriter effect */}
                <h3 className={`text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 transition-all duration-500 group-hover:text-blue-100 ${
                  'translate-y-0 opacity-100'
                }`} style={{ transitionDelay: `${index * 300 + 1000}ms` }}>
                  {step.title}
                </h3>

                {/* Description with slide-in */}
                <p className={`text-white/70 leading-relaxed text-sm sm:text-base lg:text-lg group-hover:text-white/90 transition-all duration-500 ${
                  'translate-y-0 opacity-100'
                }`} style={{ transitionDelay: `${index * 300 + 1200}ms` }}>
                  {step.description}
                </p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-32 px-4" ref={testimonialsScrollRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 transition-all duration-1000 ${
              ''
            }`}>
              Real Results from Real Businesses
            </h2>
            <p className={`text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto px-4 transition-all duration-1000 ${
              ''
            }`}>
              See how TrueFlow is transforming content creation for entrepreneurs worldwide
            </p>
          </div>

          {/* Enhanced Testimonials Horizontal Scroll */}
          <div className="relative">
            <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hidden pb-8 pt-8 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8" style={{ scrollSnapType: 'x mandatory' }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`flex-none w-80 sm:w-88 lg:w-96 bg-black/60 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 scroll-snap-align-start hover:bg-black/80 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 group relative overflow-hidden transform-gpu ${
                    ''
                  }`}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const centerX = rect.left + rect.width / 2
                    const centerY = rect.top + rect.height / 2
                    const mouseX = e.clientX - centerX
                    const mouseY = e.clientY - centerY
                    const rotateX = (mouseY / rect.height) * -15
                    const rotateY = (mouseX / rect.width) * 15
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.02)`
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const centerX = rect.left + rect.width / 2
                    const centerY = rect.top + rect.height / 2
                    const mouseX = e.clientX - centerX
                    const mouseY = e.clientY - centerY
                    const rotateX = (mouseY / rect.height) * -15
                    const rotateY = (mouseX / rect.width) * 15
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.02)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                  }}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_ease-in-out_infinite] -skew-x-12"></div>

                  {/* Profile section with enhanced animations */}
                  <div className={`flex items-center mb-4 sm:mb-6 relative z-10 ${
                    ''
                  }`} style={{ animationDelay: `${index * 200 + 400}ms` }}>
                    {/* Profile image with glow effect */}
                    <div className="relative mr-3 sm:mr-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/30"
                      />
                      {/* Animated ring around profile */}
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400/0 group-hover:border-blue-400/50 transition-all duration-500 "></div>
                    </div>
                    
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-100 transition-colors duration-300">{testimonial.name}</h4>
                      <p className="text-sm sm:text-base text-white/70 group-hover:text-white/90 transition-colors duration-300">{testimonial.role}</p>
                      <p className="text-white/50 text-xs sm:text-sm group-hover:text-white/70 transition-colors duration-300">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  {/* Quote with typewriter reveal effect */}
                  <blockquote className={`text-white/80 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed group-hover:text-white/95 transition-all duration-500 relative z-10 overflow-hidden ${
                    ''
                  }`} style={{ animationDelay: `${index * 200 + 600}ms` }}>
                    {/* Quote mark decoration */}
                    <span className="absolute -top-2 -left-2 text-4xl text-blue-400/30 font-serif">"</span>
                    <span className="relative">{testimonial.quote}</span>
                    <span className="absolute -bottom-4 -right-2 text-4xl text-blue-400/30 font-serif">"</span>
                  </blockquote>

                  {/* Results with staggered reveal */}
                  <div className="space-y-2 relative z-10">
                    {testimonial.results.map((result, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center space-x-2 transition-all duration-500 ${
                          'translate-x-0 opacity-100'
                        }`}
                        style={{ transitionDelay: `${index * 200 + 800 + idx * 100}ms` }}
                      >
                        {/* Gentle checkmark */}
                        <div className="relative">
                          <CheckCircle className="h-4 w-4 text-green-400 transition-all duration-300 group-hover:scale-105 group-hover:text-green-300" />
                          <div className="absolute inset-0 bg-green-400/10 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                        </div>
                        <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">{result}</span>
                      </div>
                    ))}
                  </div>


                  {/* Floating particles on hover */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-[icon-float_4s_ease-in-out_infinite]"
                        style={{
                          left: `${10 + i * 15}%`,
                          top: `${15 + (i % 3) * 30}%`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    'bg-blue-400'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8">
              Seamless{' '}
              <span 
                className="bg-clip-text text-transparent "
                style={{
                  backgroundImage: `linear-gradient(${gradientOffset}deg, 
                    hsl(${(gradientOffset + 220) % 360}, 70%, 60%), 
                    hsl(${(gradientOffset + 280) % 360}, 80%, 65%), 
                    hsl(${(gradientOffset + 340) % 360}, 85%, 70%), 
                    hsl(${(gradientOffset + 40) % 360}, 75%, 65%))`,
                  backgroundSize: '300% 300%',
                  animation: `gradient-shift 3s ease-in-out infinite`
                }}
              >
                Integrations
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto px-4">
              Connect with your favorite tools and platforms to supercharge your workflow
            </p>
          </div>

          {/* Orbital Animation Container */}
          <div className="relative flex items-center justify-center min-h-[500px] sm:min-h-[600px] lg:min-h-[800px]" style={{ perspective: '1000px' }}>
            {/* Central TrueFlow Infinity Symbol */}
            <div className="absolute z-10">
              {/* Outer dark blue glow ring */}
              <div className="absolute inset-0 w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full blur-2xl opacity-75" 
                style={{
                  background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.8) 0%, rgba(8, 145, 178, 0.6) 30%, rgba(14, 165, 233, 0.4) 50%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%'
                }}
              />
              
              {/* Main symbol container - transparent background */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex items-center justify-center relative">
                {/* Enhanced dark blue glow effect */}
                <div 
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(8, 145, 178, 0.6) 0%, rgba(8, 145, 178, 0.4) 30%, rgba(14, 165, 233, 0.2) 50%, transparent 70%)',
                  }}
                />
                
                {/* Inner bright dark blue ring */}
                <div 
                  className="absolute inset-2 rounded-full blur-lg"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.5) 0%, rgba(14, 165, 233, 0.3) 50%, transparent 70%)',
                  }}
                />
                
                <Image 
                  src="/brand-kit/true-flow-logo-no-text.png" 
                  alt="TrueFlow Infinity Symbol" 
                  width={60} 
                  height={60} 
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)]"
                />
              </div>
            </div>

            {/* Orbiting Integration Icons */}
            {[
              {
                name: 'Instagram',
                logo: <Instagram className="w-8 h-8" />,
                color: 'from-pink-400 to-purple-500',
              },
              {
                name: 'Facebook',
                logo: <Facebook className="w-8 h-8" />,
                color: 'from-blue-500 to-blue-600',
              },
              {
                name: 'WhatsApp',
                logo: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                ),
                color: 'from-green-400 to-green-500',
              },
              {
                name: 'YouTube',
                logo: <Youtube className="w-8 h-8" />,
                color: 'from-red-500 to-red-600',
              },
              {
                name: 'Discord',
                logo: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189z"/>
                  </svg>
                ),
                color: 'from-indigo-400 to-purple-500',
              },
              {
                name: 'X',
                logo: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>
                ),
                color: 'from-gray-700 to-black',
              },
              {
                name: 'Zapier',
                logo: <Zap className="w-8 h-8" />,
                color: 'from-orange-500 to-red-500',
              },
              {
                name: 'GoHighLevel',
                logo: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 8V22H5V8H8L4 3L0 8H3Z"/>
                    <path d="M11 13V22H13V13H16L12 8L8 13H11Z"/>
                    <path d="M19 8V22H21V8H24L20 3L16 8H19Z"/>
                  </svg>
                ),
                color: 'from-green-400 to-green-600',
              }
            ].map((integration, index) => {
              const angle = (index * 45) + (scrollY * 0.1); // 45 degrees apart, rotates with scroll
              const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 150 + Math.sin(scrollY * 0.005 + index) * 15 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 200 + Math.sin(scrollY * 0.005 + index) * 20 : 280 + Math.sin(scrollY * 0.005 + index) * 30; // Responsive radius
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              // 3D depth effects - forward/backward movement only
              const baseDepth = (index % 4) * 30 - 45; // Base depth variation: -45, -15, 15, 45
              const scrollDepth = Math.sin(scrollY * 0.008 + index * 1.2) * 40; // Dynamic depth based on scroll
              const totalDepth = baseDepth + scrollDepth; // Combined depth effect
              
              return (
                <div
                  key={index}
                  className="absolute transition-all duration-300 ease-out"
                  style={{
                    transform: `translate(${x}px, ${y}px) translateZ(${totalDepth}px)`,
                    transformStyle: 'preserve-3d',
                    zIndex: 5 + Math.floor(totalDepth / 15) // Closer items have higher z-index
                  }}
                >
                  <div className="group relative">
                    {/* Tapered connection line to center - Always render for all logos */}
                    {/* Force render connecting lines for ALL integration logos */}
                    <div 
                      className="absolute transition-opacity duration-300"
                      style={{
                        width: `${radius}px`,
                        height: `8px`, // Slightly increased height for better visibility
                        transformOrigin: '0 50%',
                        transform: `rotate(${angle + 180}deg) translateY(-50%)`,
                        zIndex: -1,
                        top: '50%',
                        left: '50%',
                        opacity: Math.max(0.25, 0.4 + totalDepth * 0.003),
                        clipPath: `polygon(0 0%, 0 100%, 80% 90%, 100% 50%, 80% 10%)`, // Dramatic taper: thick at outer logo, invisible near TrueFlow center
                        background: (() => {
                          // Enhanced gradient with transparency for taper effect
                          const colorMap: Record<number, string> = {
                            0: 'linear-gradient(to left, transparent 0%, rgba(190, 24, 93, 0.3) 50%, #be185d 100%)', // Instagram
                            1: 'linear-gradient(to left, transparent 0%, rgba(29, 78, 216, 0.3) 50%, #1d4ed8 100%)', // Facebook
                            2: 'linear-gradient(to left, transparent 0%, rgba(21, 128, 61, 0.3) 50%, #15803d 100%)', // WhatsApp
                            3: 'linear-gradient(to left, transparent 0%, rgba(220, 38, 38, 0.3) 50%, #dc2626 100%)', // YouTube
                            4: 'linear-gradient(to left, transparent 0%, rgba(67, 56, 202, 0.3) 50%, #4338ca 100%)', // Discord
                            5: 'linear-gradient(to left, transparent 0%, rgba(55, 65, 81, 0.3) 50%, #374151 100%)', // X
                            6: 'linear-gradient(to left, transparent 0%, rgba(234, 88, 12, 0.3) 50%, #ea580c 100%)', // Zapier
                            7: 'linear-gradient(to left, transparent 0%, rgba(21, 128, 61, 0.3) 50%, #15803d 100%)', // GoHighLevel
                          };
                          return colorMap[index] || 'linear-gradient(to left, transparent 0%, rgba(59, 130, 246, 0.3) 50%, #3b82f6 100%)';
                        })()
                      }}
                    />
                    
                    <div 
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${integration.color} rounded-full flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative z-10`}
                      style={{
                        boxShadow: `
                          0 ${Math.max(2, 8 + totalDepth * 0.2)}px ${Math.max(4, 16 + Math.abs(totalDepth) * 0.4)}px rgba(0,0,0,${Math.min(0.6, 0.3 + Math.abs(totalDepth) * 0.008)}),
                          0 ${Math.max(1, 4 + totalDepth * 0.1)}px ${Math.max(2, 8 + Math.abs(totalDepth) * 0.2)}px rgba(0,0,0,${Math.min(0.3, 0.15 + Math.abs(totalDepth) * 0.004)}),
                          0 0 ${Math.max(10, 20 + Math.abs(totalDepth) * 0.3)}px rgba(255,255,255,${totalDepth > 0 ? Math.min(0.3, totalDepth * 0.005) : 0})
                        `,
                        transform: `scale(${Math.max(0.8, 1 + totalDepth * 0.008)})`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {integration.logo}
                    </div>
                    
                    {/* Service name tooltip on hover */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-black/80 backdrop-blur-md rounded-lg px-2 py-1 text-white text-xs whitespace-nowrap">
                        {integration.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}


            {/* Orbital rings for visual effect */}
            <div className="absolute border border-white/10 rounded-full w-[600px] h-[600px] animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute border border-white/5 rounded-full w-[520px] h-[520px] animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          </div>

          <div className="text-center mt-16">
            <p className="text-white/60 mb-8">And many more integrations coming soon...</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Slack', 'Notion', 'Airtable', 'Stripe', 'PayPal', 'Shopify'].map((tool, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/10 rounded-full text-white/60 text-sm backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Pricing Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg sm:text-xl text-white/80">
              Choose the plan that fits your business needs
            </p>
          </div>

              {/* Pricing Options */}
              <div ref={pricingRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
                {/* Plan 1: Content Engine Only */}
                <div className="relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer transform-gpu bg-white/5 border-white/20 hover:bg-white/10">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Content Engine</h3>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <span className="text-4xl font-bold text-white">$150</span>
                      <span className="text-white/70">/week</span>
                    </div>
                    <p className="text-white/70">Access to our powerful AI content creation system</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      'AI-powered content creation',
                      'Transform voice to content',
                      'SEO-optimized blog posts',
                      'Email sequences',
                      'Social media posts',
                      'Content dashboard access',
                      'Basic analytics'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/get-started" className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full font-bold hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 w-full block text-center border-2 border-gray-500 text-lg relative overflow-hidden group">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </Link>
                </div>

                {/* Plan 2: Complete System with CRM */}
                <div className="relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer transform-gpu bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500 scale-105 ring-2 ring-purple-500">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Complete System</h3>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <span className="text-4xl font-bold text-white">$300</span>
                      <span className="text-white/70">/week</span>
                    </div>
                    <p className="text-white/70">Everything in Content Engine plus full CRM</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      'Everything in Content Engine',
                      'Full CRM system',
                      'Lead capture & tracking',
                      'Automated follow-ups',
                      'Sales pipeline management',
                      'Customer communication hub',
                      'Advanced analytics & reporting',
                      'Dedicated success manager'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/get-started" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 transition-all duration-300 w-full block text-center border-2 border-blue-500 text-lg relative overflow-hidden group">
                    <span className="relative z-10">Get Complete System</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </Link>
                </div>

                {/* Plan 3: Custom Enterprise */}
                <div className="relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer transform-gpu bg-white/5 border-white/20 hover:bg-white/10">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500/20 text-purple-400 px-4 py-1 rounded-full text-sm font-semibold border border-purple-500/30">
                      Premium
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Custom Enterprise</h3>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <span className="text-2xl font-bold text-white">Contact us</span>
                      <span className="text-white/70">for pricing</span>
                    </div>
                    <p className="text-white/70">Large-scale content operations for agencies & enterprises</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      'Multiple brand management',
                      'White-label content solutions',
                      'Custom workflow development',
                      'Dedicated account manager',
                      'API access & integrations',
                      'Team collaboration tools',
                      'Advanced analytics & reporting',
                      'Priority support & training'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-white/10 text-white hover:bg-white/20 border border-white/20">
                    Contact Sales
                  </button>
                </div>
              </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 bg-black/80 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <Image 
                  src="/true-flow-logo.webp" 
                  alt="TrueFlow" 
                  width={120} 
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-white/60 text-sm">
                The most powerful AI-driven Business Operating System for content creation and audience engagement.
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">Features</Link></li>
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">API</Link></li>
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">Integrations</Link></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">Help Center</Link></li>
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">Contact</Link></li>
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">Status</Link></li>
                <li><Link href="/coming-soon" className="text-white/60 hover:text-white transition-colors text-sm">Community</Link></li>
              </ul>
            </div>
            
            {/* CTA */}
            <div>
              <Link href="/get-started" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-block text-center">
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2025 TrueFlow™️ AI, LLC. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/coming-soon" className="text-white/40 hover:text-white/60 transition-colors text-sm">Terms</Link>
              <Link href="/coming-soon" className="text-white/40 hover:text-white/60 transition-colors text-sm">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>


      {/* Scroll to Top Button */}
      {scrollY > 500 && (
        <div className="fixed bottom-8 left-8 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-black/50 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-black/70 transition-all duration-300 hover:scale-110 animate-float-up-down border border-white/20"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}