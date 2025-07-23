/**
 * TrueFlow AI Content Engine Detail Page
 * Deep dive into the AI content creation capabilities
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Play,
  Mic,
  Brain,
  FileText,
  Mail,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  Users,
  Target,
  Sparkles,
  Upload,
  Download,
  Edit3,
  Send,
  Calendar,
  TrendingUp,
  Globe,
  Shield,
  Layers,
  MessageSquare
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

export default function ContentEnginePage() {
  const [mounted, setMounted] = useState(false)
  const [activeDemo, setActiveDemo] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [gradientOffset, setGradientOffset] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorTrail, setCursorTrail] = useState<CursorTrailPoint[]>([])
  const cursorTrailRef = useRef<CursorTrailPoint[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [sectionsVisible, setSectionsVisible] = useState({
    hero: true,
    workflow: true,
    features: true,
    contentTypes: true,
    capabilities: true,
    cta: true
  })
  
  // Refs for scroll animations
  const heroRef = useRef(null)
  const workflowRef = useRef(null)
  const featuresRef = useRef(null)
  const contentTypesRef = useRef(null)
  const capabilitiesRef = useRef(null)
  const ctaRef = useRef(null)

  // Generate floating particles
  const generateParticles = () => {
    const particleCount = 50
    const newParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
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
      if (newX > window.innerWidth) newX = 0
      if (newX < 0) newX = window.innerWidth
      if (newY > window.innerHeight) newY = 0
      if (newY < 0) newY = window.innerHeight
      
      return {
        ...particle,
        x: newX,
        y: newY
      }
    }))
  }

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      generateParticles()
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Check visibility of sections
      const checkVisibility = (ref: React.RefObject<HTMLElement>, sectionName: keyof typeof sectionsVisible) => {
        if (ref.current && !sectionsVisible[sectionName]) {
          const rect = ref.current.getBoundingClientRect()
          if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
            setSectionsVisible(prev => ({ ...prev, [sectionName]: true }))
          }
        }
      }

      checkVisibility(heroRef, 'hero')
      checkVisibility(workflowRef, 'workflow')
      checkVisibility(featuresRef, 'features')
      checkVisibility(contentTypesRef, 'contentTypes')
      checkVisibility(capabilitiesRef, 'capabilities')
      checkVisibility(ctaRef, 'cta')
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
    const animate = () => {
      animateParticles()
      setGradientOffset(prev => (prev + 1) % 360)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    // Initial check
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted])

  const workflowSteps = [
    {
      id: 'record',
      title: 'Record Your Voice',
      description: 'Speak naturally about your ideas, insights, or topics you want to share',
      icon: <Mic className="h-12 w-12" />,
      details: [
        'Record 30 seconds to 10 minutes',
        'No script needed - speak naturally',
        'Multiple topics in one recording',
        'Mobile app or web interface'
      ],
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'analyze',
      title: 'AI Analysis & Understanding',
      description: 'Advanced AI processes your voice, understanding context, tone, and intent',
      icon: <Brain className="h-12 w-12" />,
      details: [
        'Voice-to-text transcription',
        'Tone and style analysis',
        'Key point extraction',
        'Brand voice learning'
      ],
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'generate',
      title: 'Content Generation',
      description: 'AI creates professional newsletters, blogs, and social content in your voice',
      icon: <Edit3 className="h-12 w-12" />,
      details: [
        'Multiple content formats',
        'Maintains your unique voice',
        'SEO-optimized writing',
        'Custom templates'
      ],
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'distribute',
      title: 'Smart Distribution',
      description: 'Automated scheduling and sending to your audience across multiple channels',
      icon: <Send className="h-12 w-12" />,
      details: [
        'Optimal timing algorithms',
        'Multi-platform publishing',
        'Audience segmentation',
        'Performance tracking'
      ],
      color: 'from-orange-500 to-red-600'
    }
  ]

  const contentTypes = [
    {
      name: 'Email Newsletters',
      description: 'Personalized newsletters that engage your audience and drive action - FULLY AUTOMATED',
      icon: <Mail className="h-8 w-8" />,
      features: [
        'Subject line optimization',
        'Personalization at scale',
        'A/B testing capabilities',
        'Deliverability optimization'
      ],
      example: 'Transform a 5-minute voice note into a compelling weekly newsletter that your subscribers love to read.',
      status: 'automated'
    },
    {
      name: 'Blog Posts',
      description: 'SEO-optimized articles that establish thought leadership and drive traffic - FULLY AUTOMATED',
      icon: <FileText className="h-8 w-8" />,
      features: [
        'SEO keyword integration',
        'Engaging headlines',
        'Structured formatting',
        'Call-to-action placement'
      ],
      example: 'Turn your expertise into authoritative blog posts that rank on Google and convert readers into customers.',
      status: 'automated'
    },
    {
      name: 'Social Media Content',
      description: 'Platform-specific posts for Instagram, Facebook, WhatsApp, YouTube and more - BETA',
      icon: <Users className="h-8 w-8" />,
      features: [
        'Platform optimization',
        'Hashtag suggestions',
        'Engagement hooks',
        'Visual content ideas'
      ],
      example: 'Create weeks of social media content from a single voice recording, optimized for each platform.',
      status: 'beta'
    }
  ]

  const aiCapabilities = [
    {
      title: 'Voice Recognition & Transcription',
      description: 'Industry-leading accuracy in converting speech to text, understanding context and nuance',
      icon: <Mic className="h-6 w-6" />,
      stats: '99.5% accuracy'
    },
    {
      title: 'Natural Language Processing',
      description: 'Advanced AI that understands intent, emotion, and style to maintain your unique voice',
      icon: <Brain className="h-6 w-6" />,
      stats: '50+ languages'
    },
    {
      title: 'Content Optimization',
      description: 'SEO-aware writing that balances human readability with search engine visibility',
      icon: <Target className="h-6 w-6" />,
      stats: '3x better engagement'
    },
    {
      title: 'Brand Voice Learning',
      description: 'AI learns your style, terminology, and preferences to create consistently on-brand content',
      icon: <Users className="h-6 w-6" />,
      stats: 'Learns in 3 sessions'
    }
  ]


  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .cursor-trail {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }
        .particle {
          position: fixed;
          pointer-events: none;
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

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
          const opacity = Math.max(0, 1 - age / 400)
          const size = Math.max(2, 6 - (age / 400) * 4)
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
            rgba(59, 130, 246, 0.03) 0%, 
            rgba(139, 92, 246, 0.02) 25%, 
            transparent 50%)`,
          transition: 'background 0.3s ease-out'
        }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
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

            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white/70 hover:text-white transition-colors text-lg">
                Back to Home
              </Link>
              <Link href="/readiness-assessment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="pt-32 pb-20 px-4" ref={heroRef}>
        <div className="max-w-6xl mx-auto text-center">
          <div className={`inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20 transition-all duration-1000 ${
            ''
          }`}>
            <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            <span className="text-white/90 text-lg">TrueFlow AI Content Engine</span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-bold text-white mb-8 leading-tight transition-all duration-1000 ${
            ''
          }`}>
            Transform Your Voice Into{" "}
            <span 
              className="bg-clip-text text-transparent animate-pulse"
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
              Powerful Content
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-white/70 max-w-4xl mx-auto mb-12 transition-all duration-1000 ${
            ''
          }`}>
            The most advanced AI content creation system that understands your voice, 
            learns your style, and creates professional content that sounds authentically you.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 transition-all duration-1000 ${
            ''
          }`}>
            <Link href="/readiness-assessment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Try It Now</span>
              <ChevronRight className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <button className="flex items-center space-x-4 text-white/70 hover:text-white transition-all duration-300 group hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:border-blue-400/30 transition-all duration-300 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Play className="h-6 w-6 ml-1 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xl">Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-20 px-4" ref={workflowRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
              ''
            }`}>
              How the Content Engine Works
            </h2>
            <p className={`text-xl text-white/70 max-w-3xl mx-auto transition-all duration-1000 ${
              ''
            }`}>
              From voice recording to published content in minutes, not hours
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                <div 
                  className={`bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center hover:bg-white/10 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 h-full group relative overflow-hidden transform-gpu ${
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
                    const rotateX = (mouseY / rect.height) * -15
                    const rotateY = (mouseX / rect.width) * 15
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.05)`
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const centerX = rect.left + rect.width / 2
                    const centerY = rect.top + rect.height / 2
                    const mouseX = e.clientX - centerX
                    const mouseY = e.clientY - centerY
                    const rotateX = (mouseY / rect.height) * -15
                    const rotateY = (mouseX / rect.width) * 15
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.05)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100  -skew-x-12"></div>
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-[float_3s_ease-in-out_infinite]"
                        style={{
                          left: `${20 + i * 20}%`,
                          top: `${30 + (i % 2) * 40}%`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>

                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-105 group-hover:shadow-2xl transition-all duration-500 relative ${
                    ''
                  }`} style={{ animationDelay: `${index * 300}ms` }}>
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className={`transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                      ''
                    }`} style={{ 
                      animationDelay: `${index * 500}ms`,
                      filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))'
                    }}>
                      <div className="transition-all duration-300 group-hover:animate-pulse text-white" style={{ strokeWidth: '2px' }}>
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold text-white mb-4 group-hover:text-blue-100 transition-all duration-500 ${
                    'translate-y-0 opacity-100'
                  }`} style={{ transitionDelay: `${index * 200 + 300}ms` }}>{step.title}</h3>
                  
                  <p className={`text-white/70 mb-6 group-hover:text-white/90 transition-all duration-500 ${
                    'translate-y-0 opacity-100'
                  }`} style={{ transitionDelay: `${index * 200 + 400}ms` }}>{step.description}</p>
                  
                  <div className="space-y-2 relative z-10">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className={`flex items-center space-x-2 text-left transition-all duration-500 ${
                        'translate-x-0 opacity-100'
                      }`} style={{ transitionDelay: `${index * 200 + 500 + idx * 100}ms` }}>
                        <div className="relative">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 group-hover:scale-105 group-hover:text-green-300 transition-all duration-300" />
                          <div className="absolute inset-0 bg-green-400/10 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                        </div>
                        <span className="text-white/80 text-sm group-hover:text-white/95 transition-colors duration-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {index < workflowSteps.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 transition-all duration-1000 ${
                    'opacity-100 translate-x-0'
                  }`} style={{ transitionDelay: `${index * 200 + 800}ms` }}>
                    <div className="relative">
                      <ArrowRight className="h-8 w-8 text-white/70 group-hover:text-blue-400 transition-colors duration-300" />
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced AI Workflows Section */}
      <section className="py-20 px-4 bg-white/5" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
              ''
            }`}>
              Complete AI Business Workflows
            </h2>
            <p className={`text-xl text-white/70 max-w-3xl mx-auto transition-all duration-1000 ${
              ''
            }`}>
              Beyond content creation - TrueFlow automates your entire business operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Smart Scheduling Workflow */}
            <div 
              className={`bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:bg-black/80 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group relative overflow-hidden transform-gpu ${
                ''
              }`} 
              style={{ 
                animationDelay: '500ms',
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
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.03)`
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const mouseX = e.clientX - centerX
                const mouseY = e.clientY - centerY
                const rotateX = (mouseY / rect.height) * -12
                const rotateY = (mouseX / rect.width) * 12
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.03)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
              }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Smart Scheduling</h3>
              </div>
              
              <p className="text-white/70 mb-6">AI-driven content calendar that analyzes audience behavior to optimize publishing times for maximum engagement</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Audience activity analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Cross-platform optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Automated posting queues</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Performance tracking</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
                <p className="text-white/90 italic">Automatically schedule your content at optimal times across email, social media, and blog platforms for 3x better engagement.</p>
              </div>
            </div>

            {/* Lead Management Workflow */}
            <div 
              className={`bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:bg-black/80 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 group relative overflow-hidden transform-gpu ${
                ''
              }`} 
              style={{ 
                animationDelay: '700ms',
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
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.03)`
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const mouseX = e.clientX - centerX
                const mouseY = e.clientY - centerY
                const rotateX = (mouseY / rect.height) * -12
                const rotateY = (mouseX / rect.width) * 12
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.03)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100  -skew-x-12"></div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-105 transition-transform duration-300">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">Lead Management</h3>
              </div>
              
              <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">Automated lead scoring, follow-ups, and nurturing sequences that convert prospects into customers</p>
              
              <div className="space-y-3 mb-6">
                {['Behavioral lead scoring', 'Automated follow-up sequences', 'Personalized outreach', 'CRM integration'].map((feature, idx) => (
                  <div key={idx} className={`flex items-center space-x-2 transition-all duration-500 ${
                    'translate-x-0 opacity-100'
                  }`} style={{ transitionDelay: `${700 + idx * 100}ms` }}>
                    <CheckCircle className="h-4 w-4 text-green-400 group-hover:scale-105 group-hover:text-green-300 transition-all duration-300" />
                    <span className="text-white/80 text-sm group-hover:text-white/95 transition-colors duration-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30 group-hover:border-purple-400/50 transition-colors duration-300">
                <p className="text-white/90 italic group-hover:text-white transition-colors duration-300">Never lose a lead again. AI tracks every interaction and automatically nurtures prospects with personalized content.</p>
              </div>
            </div>

            {/* Customer Support Workflow */}
            <div 
              className={`bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:bg-black/80 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden transform-gpu ${
                ''
              }`} 
              style={{ 
                animationDelay: '900ms',
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
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.03)`
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const mouseX = e.clientX - centerX
                const mouseY = e.clientY - centerY
                const rotateX = (mouseY / rect.height) * -12
                const rotateY = (mouseX / rect.width) * 12
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) scale(1.03)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
              }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Smart Support</h3>
              </div>
              
              <p className="text-white/70 mb-6">AI-powered customer support that handles routine inquiries and escalates complex issues to your team</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">24/7 AI chat support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Intelligent ticket routing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Knowledge base integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Sentiment analysis</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
                <p className="text-white/90 italic">Reduce support workload by 80% while improving customer satisfaction with instant, accurate AI responses.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compliance & Security */}
            <div 
              className="bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:bg-black/80 transition-all duration-500 transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)'
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const mouseX = e.clientX - centerX
                const mouseY = e.clientY - centerY
                const rotateX = (mouseY / rect.height) * -10
                const rotateY = (mouseX / rect.width) * 10
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.02)`
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const mouseX = e.clientX - centerX
                const mouseY = e.clientY - centerY
                const rotateX = (mouseY / rect.height) * -10
                const rotateY = (mouseX / rect.width) * 10
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.02)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
              }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Compliance & Security</h3>
              </div>
              
              <p className="text-white/70 mb-6">Automated compliance monitoring, security audits, and regulatory reporting</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">GDPR compliance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Security monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Audit trails</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Risk assessment</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-lg p-4 border border-indigo-500/30">
                <p className="text-white/90 italic">Stay compliant automatically with AI that tracks regulations and flags potential risks before they become problems.</p>
              </div>
            </div>

            {/* Process Automation */}
            <div 
              className="bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:bg-black/80 transition-all duration-500 transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)'
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const mouseX = e.clientX - centerX
                const mouseY = e.clientY - centerY
                const rotateX = (mouseY / rect.height) * -10
                const rotateY = (mouseX / rect.width) * 10
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.02)`
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const mouseX = e.clientX - centerX
                const mouseY = e.clientY - centerY
                const rotateX = (mouseY / rect.height) * -10
                const rotateY = (mouseX / rect.width) * 10
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px) scale(1.02)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
              }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Process Automation</h3>
              </div>
              
              <p className="text-white/70 mb-6">Connect your systems so data flows automatically without manual entry or duplicate work</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">System integrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Data synchronization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Workflow automation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white/80 text-sm">Error reduction</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
                <p className="text-white/90 italic">Eliminate manual data entry and connect all your business tools for seamless operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Content Types Section */}
      <section className="py-20 px-4" ref={contentTypesRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
              ''
            }`}>
              Content Types You Can Create
            </h2>
            <p className={`text-xl text-white/70 max-w-3xl mx-auto transition-all duration-1000 ${
              ''
            }`}>
              One voice recording becomes multiple pieces of professional content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contentTypes.map((type, index) => (
              <div 
                key={index} 
                className={`bg-black/60 backdrop-blur-md rounded-2xl border p-8 hover:bg-black/80 hover:shadow-2xl transition-all duration-700 group relative overflow-hidden transform-gpu ${
                type.status === 'automated' ? 'border-green-500/50 hover:border-green-400/70 hover:shadow-green-500/20' : 'border-orange-500/50 hover:border-orange-400/70 hover:shadow-orange-500/20'
              } ${''}`} 
                style={{ 
                  animationDelay: `${index * 300 + 500}ms`,
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
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px) scale(1.05)`
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const mouseX = e.clientX - centerX
                  const mouseY = e.clientY - centerY
                  const rotateX = (mouseY / rect.height) * -15
                  const rotateY = (mouseX / rect.width) * 15
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px) scale(1.05)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                }}
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  type.status === 'automated' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                }`}>
                  {type.status === 'automated' ? 'FULLY AUTOMATED' : 'BETA'}
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-3 rounded-lg ${
                    type.status === 'automated' ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white pr-20">{type.name}</h3>
                </div>
                
                <p className="text-white/70 mb-6">{type.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className={`rounded-lg p-4 border ${
                  type.status === 'automated' 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-500/30'
                    : 'bg-gradient-to-r from-orange-500/20 to-red-600/20 border-orange-500/30'
                }`}>
                  <p className="text-white/90 italic">{type.example}</p>
                </div>

                {/* Social Platform Logos for Social Media Content */}
                {type.name === 'Social Media Content' && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-white/60 text-sm mb-4">Supported Platforms (Beta):</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Instagram</div>
                      </div>
                      <div className="bg-blue-600 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Facebook</div>
                      </div>
                      <div className="bg-green-500 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
                        </svg>
                        <div className="text-white/80 text-xs">WhatsApp</div>
                      </div>
                      <div className="bg-red-600 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <div className="text-white/80 text-xs">YouTube</div>
                      </div>
                      <div className="bg-blue-500 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Discord</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-black mb-2">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <div className="text-black/80 text-xs">X</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Course Platform Logos for Course Content */}
                {type.name === 'Course Content' && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-white/60 text-sm mb-4">Supported Platforms (Beta):</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-orange-500 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                          <path d="M8 8h8v8H8z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Teachable</div>
                      </div>
                      <div className="bg-purple-600 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm5.5 18.5h-11v-13h11v13z"/>
                          <path d="M8.5 7.5h7v1h-7zm0 2h7v1h-7zm0 2h7v1h-7zm0 2h5v1h-5z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Thinkific</div>
                      </div>
                      <div className="bg-blue-700 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
                          <path d="M9 7l6 5-6 5V7z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Kajabi</div>
                      </div>
                      <div className="bg-green-600 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm5 13h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                        </svg>
                        <div className="text-white/80 text-xs">LearnDash</div>
                      </div>
                      <div className="bg-indigo-600 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm8.392 16.5L12 21.5l-8.392-4.5v-9L12 3.5l8.392 4.5v9z"/>
                          <path d="M12 6L7 9v6l5 3 5-3V9l-5-3z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Coursera</div>
                      </div>
                      <div className="bg-red-500 rounded-lg p-4 text-center flex flex-col items-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white mb-2">
                          <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                          <path d="M8 8.5h8v7H8z"/>
                        </svg>
                        <div className="text-white/80 text-xs">Udemy</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced AI Capabilities Section */}
      <section className="py-20 px-4" ref={capabilitiesRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 ${
              ''
            }`}>
              Advanced AI Capabilities
            </h2>
            <p className={`text-xl text-white/70 max-w-3xl mx-auto transition-all duration-1000 ${
              ''
            }`}>
              Powered by cutting-edge technology that understands and amplifies your unique voice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className={`flex items-start space-x-6 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/10 hover:scale-105 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 group relative overflow-hidden ${
                ''
              }`} style={{ animationDelay: `${index * 200 + 500}ms` }}>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex-shrink-0">
                  {capability.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{capability.title}</h3>
                    <span className="text-blue-400 font-semibold">{capability.stats}</span>
                  </div>
                  <p className="text-white/70">{capability.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Enhanced CTA Section */}
      <section className="py-20 px-4" ref={ctaRef}>
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-3xl border border-white/20 p-12 relative overflow-hidden group transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/20 transform-gpu ${
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
              const rotateX = (mouseY / rect.height) * -8
              const rotateY = (mouseX / rect.width) * 8
              e.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2
              const mouseX = e.clientX - centerX
              const mouseY = e.clientY - centerY
              const rotateX = (mouseY / rect.height) * -8
              const rotateY = (mouseX / rect.width) * 8
              e.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100  -skew-x-12"></div>
            
            <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 relative z-10 transition-all duration-1000 ${
              ''
            }`}>
              Ready to Transform Your Content Creation?
            </h2>
            <p className={`text-xl text-white/70 mb-10 max-w-3xl mx-auto relative z-10 group-hover:text-white/90 transition-all duration-500 ${
              ''
            }`}>
              Join thousands of creators who've revolutionized their content workflow with TrueFlow AI.
            </p>
            
            <div className={`flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 relative z-10 transition-all duration-1000 ${
              ''
            }`}>
              <Link href="/readiness-assessment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:scale-110 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group/btn">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Start Creating Now</span>
              </Link>
              <Link href="/faq" className="text-white/70 hover:text-white hover:scale-105 transition-all duration-300 underline text-xl relative group/link">
                <span className="relative z-10">Have Questions?</span>
                <div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover/link:scale-100 transition-transform duration-300 -z-10 px-4 py-2"></div>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-10 text-white/50">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <Image 
                  src="/true-flow-logo.webp" 
                  alt="TrueFlow" 
                  width={200} 
                  height={60} 
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-white/70 mb-6 max-w-md">
                The most powerful AI-driven Business Operating System for content creation and audience engagement.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="/content-engine" className="block text-white/70 hover:text-white transition-colors">Content Engine</Link>
                <Link href="/readiness-assessment" className="block text-white/70 hover:text-white transition-colors">Get Started</Link>
                <Link href="/faq" className="block text-white/70 hover:text-white transition-colors">FAQs</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Help Center</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Contact</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Community</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50">
            <p>&copy; 2025 TrueFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}