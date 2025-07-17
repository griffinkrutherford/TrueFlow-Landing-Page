/**
 * TrueFlow AI FAQ Page
 * Comprehensive questions and answers about TrueFlow AI services
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  MessageSquare,
  Zap,
  Shield,
  Clock,
  BarChart3,
  Users,
  Mail,
  Brain,
  CheckCircle
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'content' | 'automation' | 'ai' | 'integration' | 'business'
  icon: React.ReactNode
}

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

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorTrail, setCursorTrail] = useState<CursorTrailPoint[]>([])
  const cursorTrailRef = useRef<CursorTrailPoint[]>([])
  const animationFrameRef = useRef<number | null>(null)

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

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setMousePosition(newPos)
      
      // Add to cursor trail
      cursorTrailRef.current.push({
        x: newPos.x,
        y: newPos.y,
        timestamp: Date.now()
      })
      
      // Keep only recent trail points (last 300ms)
      const now = Date.now()
      cursorTrailRef.current = cursorTrailRef.current.filter(point => now - point.timestamp < 300)
      setCursorTrail([...cursorTrailRef.current])
    }
    
    // Animation loop for particles
    const animate = () => {
      animateParticles()
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mounted])

  const faqData: FAQItem[] = [
    // Content Creation & Marketing
    {
      id: 'content-1',
      question: 'How does TrueFlow transform my voice into content?',
      answer: 'TrueFlow uses advanced AI to analyze your voice recordings, understanding your tone, style, and key points. It then generates personalized newsletters and blog posts that sound authentically like you, maintaining your unique voice while creating professional, engaging content.',
      category: 'content',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 'content-2',
      question: 'My marketing team struggles with content creation. Can AI help?',
      answer: 'AI generates complete content marketing strategies, writes drafts, builds graphic and video creatives, and personalizes messaging based on customer data. TrueFlow can create email campaigns, blog posts, social media content, and more from just your voice recordings.',
      category: 'content',
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'content-3',
      question: 'Can TrueFlow help with audience targeting and engagement?',
      answer: 'Yes! TrueFlow segments and targets your audience with precision using AI-powered insights. It optimizes publishing times for maximum engagement and tracks performance metrics like opens, clicks, and conversions to continuously improve your content strategy.',
      category: 'content',
      icon: <BarChart3 className="h-5 w-5" />
    },

    // Business Automation
    {
      id: 'business-1',
      question: 'I run an eCommerce business with daily sales, shipping, and returns. How can TrueFlow help?',
      answer: 'We automate order processing, sync inventory across platforms, and handle customer inquiries with AI-powered chat. TrueFlow integrates with your existing eCommerce tools to streamline operations and reduce manual work.',
      category: 'business',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'business-2',
      question: 'We generate a lot of leads but struggle with follow-ups. Can AI help?',
      answer: 'AI automates follow-ups, scores leads based on behavior and engagement, and personalizes outreach based on customer data. TrueFlow can create automated email sequences, schedule calls, and prioritize hot leads for your sales team.',
      category: 'business',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'business-3',
      question: 'I spend hours every week on financial reports. Can AI automate them?',
      answer: 'Yes! TrueFlow can automate financial reporting by connecting to your accounting systems, generating custom reports, tracking KPIs, and providing real-time insights into your business performance. Get automated weekly, monthly, or quarterly reports delivered to your inbox.',
      category: 'business',
      icon: <BarChart3 className="h-5 w-5" />
    },

    // AI & Automation
    {
      id: 'ai-1',
      question: 'My team spends hours manually entering data between tools. Can AI fix this?',
      answer: 'Yes. We connect your systems so data flows automatically without manual entry. TrueFlow creates seamless integrations between your CRM, marketing tools, accounting software, and other business applications.',
      category: 'automation',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'ai-2',
      question: 'Our customer service team is overwhelmed with support tickets. Can AI reduce the workload?',
      answer: 'AI chatbots handle common questions, filter urgent issues, and suggest responses for faster replies. TrueFlow can automate up to 80% of routine customer inquiries, allowing your team to focus on complex issues that need human attention.',
      category: 'ai',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 'ai-3',
      question: 'Can AI improve our hiring process?',
      answer: 'Absolutely! TrueFlow can automate resume screening, schedule interviews, send follow-up emails to candidates, and even conduct initial AI-powered interviews. It helps identify the best candidates faster while providing a better experience for applicants.',
      category: 'ai',
      icon: <Users className="h-5 w-5" />
    },

    // Integration & Systems
    {
      id: 'integration-1',
      question: 'My business uses multiple CRMs, marketing tools, and databases. Can AI unify them?',
      answer: 'Yes. We integrate your platforms so they work as one, reducing errors and duplicate data. TrueFlow creates a unified view of your business operations, ensuring data consistency across all your tools and systems.',
      category: 'integration',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'integration-2',
      question: 'How long does it take to set up TrueFlow with my existing systems?',
      answer: 'Most integrations can be set up in 5-15 minutes using our pre-built connectors. For custom integrations, our team typically completes setup within 24-48 hours. We handle the technical complexity so you can focus on your business.',
      category: 'integration',
      icon: <Clock className="h-5 w-5" />
    },

    // Compliance & Security
    {
      id: 'business-4',
      question: 'Can AI help with compliance and regulatory tasks?',
      answer: 'Yes. AI tracks updates, ensures records meet legal standards, and flags potential risks. TrueFlow monitors regulatory changes in your industry and automatically updates your processes to maintain compliance.',
      category: 'business',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'business-5',
      question: 'Is my data secure with TrueFlow?',
      answer: 'Absolutely. We use enterprise-grade encryption, secure data centers, and follow strict privacy protocols. Your data is never shared with third parties, and we comply with GDPR, CCPA, and other privacy regulations.',
      category: 'business',
      icon: <Shield className="h-5 w-5" />
    },

    // Getting Started
    {
      id: 'business-6',
      question: 'How quickly can I see results with TrueFlow?',
      answer: 'Most clients see immediate time savings within the first week. Content creation becomes 10x faster, and automation starts working immediately after setup. Full ROI is typically achieved within 30-60 days.',
      category: 'business',
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'business-7',
      question: 'Do I need technical expertise to use TrueFlow?',
      answer: 'Not at all! TrueFlow is designed for business owners and teams, not developers. Our intuitive interface makes it easy to create content, set up automations, and manage your AI systems without any technical knowledge.',
      category: 'business',
      icon: <Brain className="h-5 w-5" />
    },

    // Calendar & Scheduling FAQs
    {
      id: 'calendar-1',
      question: 'How does TrueFlow\'s calendar management help me schedule content and appointments?',
      answer: 'TrueFlow provides a unified calendar that syncs with Google Calendar and Outlook. You can schedule content publication, manage client appointments, set reminders, and visualize your entire business schedule in one place. The system automatically prevents double-booking and suggests optimal meeting times.',
      category: 'automation',
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'calendar-2',
      question: 'Can I extract meeting data and insights from my calendar events?',
      answer: 'Yes! TrueFlow\'s calendar intelligence feature extracts key information from your meetings, creates follow-up tasks automatically, and generates meeting summaries. It can identify action items, deadlines, and important contacts mentioned during meetings.',
      category: 'ai',
      icon: <Brain className="h-5 w-5" />
    },

    // CRM & Contact Management
    {
      id: 'crm-1',
      question: 'How does TrueFlow\'s CRM compare to Salesforce or HubSpot?',
      answer: 'TrueFlow combines CRM functionality with AI content creation and automation in one platform. Unlike traditional CRMs, we focus on automating your entire customer journey - from lead capture to content delivery to follow-ups. You get contact management, opportunity tracking, and automated workflows without the complexity.',
      category: 'business',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'crm-2',
      question: 'Can TrueFlow manage my sales pipeline and track deals?',
      answer: 'Absolutely! Our Opportunities feature tracks deals through customizable pipeline stages, calculates deal values, monitors conversion rates, and provides sales forecasting. The system automatically moves deals based on customer interactions and sends alerts for deals that need attention.',
      category: 'business',
      icon: <BarChart3 className="h-5 w-5" />
    },

    // Email Marketing & Automation
    {
      id: 'email-1',
      question: 'How does TrueFlow\'s email builder compare to Mailchimp or Constant Contact?',
      answer: 'TrueFlow\'s email builder includes AI-powered content generation, advanced personalization, and seamless integration with your CRM data. Unlike standalone email tools, you can trigger emails based on any business event, track engagement across all channels, and automatically follow up based on recipient behavior.',
      category: 'content',
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'email-2',
      question: 'Can I create automated email sequences and drip campaigns?',
      answer: 'Yes! Create sophisticated email sequences triggered by user actions, time delays, or business events. Our visual workflow builder lets you design complex nurture campaigns, onboarding sequences, and re-engagement campaigns without coding. Each email can be personalized with dynamic content based on recipient data.',
      category: 'automation',
      icon: <Zap className="h-5 w-5" />
    },

    // Flow Mode & Productivity
    {
      id: 'productivity-1',
      question: 'What is Flow Mode and how does it boost productivity?',
      answer: 'Flow Mode is TrueFlow\'s productivity system that combines the Pomodoro Technique with AI task prioritization. It blocks distractions, tracks focus time, suggests optimal break intervals, and gamifies your work with achievements. Users report 3x productivity gains when using Flow Mode consistently.',
      category: 'ai',
      icon: <Clock className="h-5 w-5" />
    },
    {
      id: 'productivity-2',
      question: 'How does the Brain Dump feature help capture ideas quickly?',
      answer: 'Brain Dump lets you quickly capture thoughts, ideas, and tasks using voice or text. The AI organizes your dumps into actionable items, content ideas, or CRM notes. It\'s perfect for capturing inspiration on the go or clearing your mind before focused work sessions.',
      category: 'content',
      icon: <Brain className="h-5 w-5" />
    },

    // Analytics & Reporting
    {
      id: 'analytics-1',
      question: 'What kind of analytics and reports does TrueFlow provide?',
      answer: 'TrueFlow offers comprehensive analytics including revenue tracking, lead source analysis, conversion funnel visualization, content performance metrics, email engagement stats, and custom KPI dashboards. All reports update in real-time and can be automated for regular delivery.',
      category: 'business',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      id: 'analytics-2',
      question: 'Can I track ROI on my content and marketing campaigns?',
      answer: 'Yes! TrueFlow tracks every piece of content from creation to conversion. See which blog posts generate leads, which emails drive sales, and which social posts create engagement. Our attribution modeling shows exactly how each touchpoint contributes to revenue.',
      category: 'business',
      icon: <BarChart3 className="h-5 w-5" />
    },

    // Integration Questions
    {
      id: 'integration-3',
      question: 'Does TrueFlow integrate with Instagram for social media posting?',
      answer: 'Yes! TrueFlow connects to Instagram Business accounts for automated posting, story creation, and engagement tracking. Schedule posts, monitor comments, and analyze performance all from your TrueFlow dashboard. We also integrate with Facebook, LinkedIn, and Twitter.',
      category: 'integration',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 'integration-4',
      question: 'Can I connect my Gmail and Outlook accounts to TrueFlow?',
      answer: 'Absolutely! TrueFlow syncs with both Gmail and Outlook for unified email management. Send emails from your business address, track opens and clicks, sync contacts automatically, and trigger automations based on email events - all while maintaining your existing email setup.',
      category: 'integration',
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'integration-5',
      question: 'How does TrueFlow handle payment processing and invoicing?',
      answer: 'TrueFlow integrates with Stripe for payment processing and QuickBooks for accounting. Accept payments, send invoices, manage subscriptions, and track revenue - all synced with your accounting system. We handle PCI compliance and security so you can focus on growing your business.',
      category: 'integration',
      icon: <Shield className="h-5 w-5" />
    },

    // AI Capabilities
    {
      id: 'ai-4',
      question: 'How does TrueFlow\'s AI understand my business and industry?',
      answer: 'TrueFlow\'s AI learns from your content, customer interactions, and business data to understand your unique voice, industry terminology, and customer preferences. The more you use it, the better it becomes at creating content that matches your brand and resonates with your audience.',
      category: 'ai',
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: 'ai-5',
      question: 'Can TrueFlow\'s AI create content in multiple languages?',
      answer: 'Yes! TrueFlow supports content creation in over 30 languages. The AI maintains your brand voice and style across all languages, making it perfect for businesses with international audiences. Translation quality rivals professional human translators.',
      category: 'ai',
      icon: <MessageSquare className="h-5 w-5" />
    },

    // Pricing & Plans
    {
      id: 'pricing-1',
      question: 'What\'s included in the $150/week Content Engine plan?',
      answer: 'The Content Engine plan includes AI-powered content creation, voice-to-content transformation, SEO-optimized blog posts, email sequences, social media posts, content dashboard access, and basic analytics. Perfect for solopreneurs and content creators who need powerful content tools.',
      category: 'business',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'pricing-2',
      question: 'What additional features come with the $300/week Complete System?',
      answer: 'The Complete System includes everything in Content Engine plus full CRM functionality, lead tracking, automated follow-ups, sales pipeline management, advanced analytics, customer communication hub, and a dedicated success manager. It\'s ideal for growing businesses that need comprehensive automation.',
      category: 'business',
      icon: <CheckCircle className="h-5 w-5" />
    },

    // Mobile & Accessibility
    {
      id: 'mobile-1',
      question: 'Can I use TrueFlow on my mobile device?',
      answer: 'Yes! TrueFlow is a Progressive Web App (PWA) that works seamlessly on all devices. Install it on your phone for offline access, push notifications, and a native app experience. Create content, manage contacts, and monitor your business from anywhere.',
      category: 'business',
      icon: <MessageSquare className="h-5 w-5" />
    },

    // Content Strategy
    {
      id: 'content-4',
      question: 'How does the Idea Garden help with content planning?',
      answer: 'Idea Garden is your creative hub where ideas grow into content. Capture inspiration instantly, organize ideas by topic or campaign, collaborate with team members, and watch as AI suggests ways to develop each idea into multiple content pieces. Never run out of content ideas again!',
      category: 'content',
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: 'content-5',
      question: 'Can TrueFlow help me repurpose content across different channels?',
      answer: 'Absolutely! TrueFlow\'s AI takes one piece of content and transforms it for multiple channels. Turn a blog post into social media posts, email newsletters, video scripts, and podcast talking points. Each version is optimized for its specific platform while maintaining your message.',
      category: 'content',
      icon: <Zap className="h-5 w-5" />
    }
  ]

  const categories = [
    { id: 'all', label: 'All Questions', icon: <Brain className="h-4 w-4" /> },
    { id: 'content', label: 'Content Creation', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'automation', label: 'Automation', icon: <Zap className="h-4 w-4" /> },
    { id: 'ai', label: 'AI Features', icon: <Brain className="h-4 w-4" /> },
    { id: 'integration', label: 'Integrations', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'business', label: 'Business', icon: <BarChart3 className="h-4 w-4" /> }
  ]

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory)

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id)
  }

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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
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
          const opacity = Math.max(0, 1 - age / 300)
          const size = Math.max(2, 5 - (age / 300) * 3)
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
            rgba(59, 130, 246, 0.02) 0%, 
            rgba(139, 92, 246, 0.01) 25%, 
            transparent 50%)`,
          transition: 'background 0.3s ease-out'
        }}
      />
      {/* Navigation */}
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

            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white/70 hover:text-white transition-colors text-lg">
                Back to Home
              </Link>
              <Link href="/get-started" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Get answers to common questions about TrueFlow AI and how it can transform your business operations.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-500 transform-gpu"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.320, 1)'
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const mouseX = e.clientX - centerX
                  const mouseY = e.clientY - centerY
                  const rotateX = (mouseY / rect.height) * -8
                  const rotateY = (mouseX / rect.width) * 8
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px) scale(1.02)`
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const centerX = rect.left + rect.width / 2
                  const centerY = rect.top + rect.height / 2
                  const mouseX = e.clientX - centerX
                  const mouseY = e.clientY - centerY
                  const rotateX = (mouseY / rect.height) * -8
                  const rotateY = (mouseX / rect.width) * 8
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px) scale(1.02)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-400">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {item.question}
                    </h3>
                  </div>
                  <div className="text-white/70">
                    {openItem === item.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>
                
                {openItem === item.id && (
                  <div className="px-6 pb-6">
                    <div className="ml-9 text-white/80 leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-3xl border border-white/20 p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Still Have Questions?
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Get started with TrueFlow AI and experience the power of voice-to-content transformation for your business.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="https://trueflow.ai/readiness-assessment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity">
                  Start Your Free Trial
                </Link>
                <Link href="/" className="text-white/70 hover:text-white transition-colors underline text-lg">
                  Back to Home
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-8 mt-8 text-white/50">
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
        </div>
      </main>

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
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Features</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Pricing</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">API</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Integrations</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Help Center</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Contact</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Status</Link>
                <Link href="/coming-soon" className="block text-white/70 hover:text-white transition-colors">Community</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-white/50">
            <p>&copy; 2025 TrueFlow™️ AI, LLC. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}