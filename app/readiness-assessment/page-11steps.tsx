/**
 * TrueFlow AI Readiness Assessment Page - Comprehensive Version
 * Combines assessment questions with all get-started page features
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Check,
  Mic,
  Mail,
  FileText,
  BarChart3,
  Users,
  Zap,
  Calendar,
  Target,
  Brain,
  Shield,
  Clock,
  CheckCircle,
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Globe,
  Layers,
  Menu,
  X,
  Play,
  Download,
  Upload,
  Settings
} from 'lucide-react'
import { DebugComponent } from './debug'

interface Question {
  id: string
  category: string
  question: string
  options: {
    value: string
    label: string
    score: number
  }[]
}

interface BusinessType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
}

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
}

interface Plan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
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

const questions: Question[] = [
  {
    id: 'current-content',
    category: 'Content Creation',
    question: 'How do you currently create content for your business?',
    options: [
      { value: 'manual', label: 'Manually write everything', score: 1 },
      { value: 'outsource', label: 'Outsource to freelancers/agencies', score: 2 },
      { value: 'team', label: 'Have an in-house content team', score: 3 },
      { value: 'mixed', label: 'Mix of manual and automated tools', score: 4 }
    ]
  },
  {
    id: 'content-volume',
    category: 'Content Creation',
    question: 'How much content do you need to produce monthly?',
    options: [
      { value: 'minimal', label: '1-5 pieces', score: 1 },
      { value: 'moderate', label: '6-20 pieces', score: 2 },
      { value: 'high', label: '21-50 pieces', score: 3 },
      { value: 'very-high', label: '50+ pieces', score: 4 }
    ]
  },
  {
    id: 'crm-usage',
    category: 'Customer Management',
    question: 'How do you currently manage customer relationships?',
    options: [
      { value: 'spreadsheets', label: 'Spreadsheets or manual tracking', score: 1 },
      { value: 'basic-crm', label: 'Basic CRM system', score: 2 },
      { value: 'advanced-crm', label: 'Advanced CRM with automation', score: 3 },
      { value: 'integrated', label: 'Fully integrated systems', score: 4 }
    ]
  },
  {
    id: 'lead-response',
    category: 'Customer Management',
    question: 'How quickly do you typically respond to new leads?',
    options: [
      { value: 'days', label: 'Within a few days', score: 1 },
      { value: 'hours', label: 'Within 24 hours', score: 2 },
      { value: 'quick', label: 'Within a few hours', score: 3 },
      { value: 'instant', label: 'Almost instantly', score: 4 }
    ]
  },
  {
    id: 'time-spent',
    category: 'Time Management',
    question: 'How much time do you spend on repetitive tasks weekly?',
    options: [
      { value: 'minimal', label: 'Less than 5 hours', score: 4 },
      { value: 'moderate', label: '5-15 hours', score: 3 },
      { value: 'high', label: '15-30 hours', score: 2 },
      { value: 'very-high', label: 'More than 30 hours', score: 1 }
    ]
  },
  {
    id: 'budget',
    category: 'Investment',
    question: 'What\'s your monthly budget for content and customer management?',
    options: [
      { value: 'low', label: 'Less than $500', score: 1 },
      { value: 'moderate', label: '$500 - $2,000', score: 2 },
      { value: 'high', label: '$2,000 - $5,000', score: 3 },
      { value: 'enterprise', label: 'More than $5,000', score: 4 }
    ]
  }
]

export default function ReadinessAssessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('')
  const [contentGoals, setContentGoals] = useState<string[]>([])
  const [integrations, setIntegrations] = useState<string[]>([])
  const [showPlanSelection, setShowPlanSelection] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorTrail, setCursorTrail] = useState<CursorTrailPoint[]>([])
  const cursorTrailRef = useRef<CursorTrailPoint[]>([])
  const animationFrameRef = useRef<number | null>(null)

  // Business types from get-started page
  const businessTypes: BusinessType[] = [
    {
      id: 'creator',
      title: 'Content Creator',
      description: 'Influencers, bloggers, course creators, thought leaders',
      icon: <FileText className="h-8 w-8" />,
      features: ['Turn ideas into SEO blogs', 'Daily email sequences', 'Social media content', 'Brand consistency']
    },
    {
      id: 'podcaster',
      title: 'Podcast Host',
      description: 'Podcast creators, show hosts, audio content producers',
      icon: <Mic className="h-8 w-8" />,
      features: ['Episode transcriptions to blogs', 'Newsletter from show notes', 'Social media clips', 'Audience growth']
    },
    {
      id: 'business',
      title: 'Business Owner',
      description: 'Entrepreneurs, small business owners, consultants',
      icon: <Users className="h-8 w-8" />,
      features: ['Weekly niche Q&A brain dumps', 'Industry expertise content', 'Lead generation blogs', 'Client newsletters']
    },
    {
      id: 'coach',
      title: 'Coach or Consultant',
      description: 'Life coaches, business consultants, fitness trainers',
      icon: <Target className="h-8 w-8" />,
      features: ['Client success stories', 'Educational content', 'Weekly insights', 'Engagement tracking']
    },
    {
      id: 'agency',
      title: 'Marketing Agency',
      description: 'Digital agencies, marketing firms, content teams',
      icon: <BarChart3 className="h-8 w-8" />,
      features: ['Client content creation', 'Multiple brand management', 'Scalable workflows', 'White-label solutions']
    },
    {
      id: 'other',
      title: 'Other Professional',
      description: 'Any professional with expertise to share',
      icon: <Sparkles className="h-8 w-8" />,
      features: ['Custom content strategy', 'Industry-specific messaging', 'Flexible workflows', 'Personal branding']
    }
  ]

  const contentGoalOptions = [
    { id: 'newsletters', label: 'Email Newsletters', icon: <Mail className="h-5 w-5" /> },
    { id: 'blogs', label: 'Blog Posts', icon: <FileText className="h-5 w-5" /> },
    { id: 'social', label: 'Social Media Content', icon: <Users className="h-5 w-5" /> },
    { id: 'courses', label: 'Course Content', icon: <Brain className="h-5 w-5" /> },
    { id: 'sales', label: 'Sales Materials', icon: <Target className="h-5 w-5" /> },
    { id: 'support', label: 'Customer Support', icon: <Shield className="h-5 w-5" /> }
  ]

  const integrationOptions = [
    { id: 'gohighlevel', label: 'GoHighLevel', icon: <Zap className="h-5 w-5" /> },
    { id: 'mailchimp', label: 'Mailchimp', icon: <Mail className="h-5 w-5" /> },
    { id: 'convertkit', label: 'ConvertKit', icon: <Mail className="h-5 w-5" /> },
    { id: 'hubspot', label: 'HubSpot', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'activecampaign', label: 'ActiveCampaign', icon: <Mail className="h-5 w-5" /> },
    { id: 'zapier', label: 'Zapier', icon: <Zap className="h-5 w-5" /> }
  ]

  // Steps definition - 5-step combined approach
  const steps = [
    'Business Profile & Goals',  // Step 1: Business Type + Content Goals
    'Current Practices',         // Step 2: Questions 1-4 combined
    'Resources',                 // Step 3: Questions 5-6 combined
    'Setup',                     // Step 4: Contact Info + Integrations
    'Results & Plan'             // Step 5: Results & Plan Selection
  ]

  const totalSteps = steps.length

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

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      generateParticles()
    }
    
    // Add global error handler for debugging
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (e) => {
        console.error('Global error:', e.error)
      })
      
      window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason)
      })
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

  const plans: Plan[] = [
    {
      id: 'trial',
      name: '14-Day Free Trial',
      price: '$0',
      period: 'then $150/week',
      description: 'Risk-free trial of our full content creation service',
      features: [
        'Complete content dashboard setup',
        'SEO-optimized blog posts from your ideas',
        'Daily email sequences',
        'Branded social media posts',
        'You don\'t pay until it works',
        'Full onboarding & training',
        'Direct access to content team'
      ]
    },
    {
      id: 'standard',
      name: 'Done-For-You Content',
      price: '$150',
      period: '/week',
      description: 'We turn your raw ideas into professional content',
      features: [
        'Transform voice recordings into content',
        'SEO blogs, emails & social posts',
        'Complete content calendar management',
        'Branded design & messaging',
        'Weekly niche question brain dumps',
        'Content dashboard & analytics',
        'Dedicated content strategist',
        'Rate increases to $300/week after 13 weeks'
      ],
      popular: true
    },
    {
      id: 'custom',
      name: 'Custom Enterprise',
      price: 'Contact us',
      period: 'for pricing',
      description: 'Large-scale content operations for agencies & enterprises',
      features: [
        'Multiple brand management',
        'White-label content solutions',
        'Custom workflow development',
        'Dedicated account manager',
        'API access & integrations',
        'Team collaboration tools',
        'Advanced analytics & reporting',
        'Priority support & training'
      ]
    }
  ]

  const handleAnswer = (questionId: string, value: string) => {
    console.log('handleAnswer called:', { questionId, value })
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const calculateScore = () => {
    let totalScore = 0
    let maxScore = 0

    questions.forEach(q => {
      const answer = answers[q.id]
      if (answer) {
        const option = q.options.find(o => o.value === answer)
        if (option) {
          totalScore += option.score
        }
      }
      maxScore += 4 // Maximum score per question
    })

    return Math.round((totalScore / maxScore) * 100)
  }

  const getRecommendation = (score: number) => {
    if (score >= 75) {
      return {
        level: 'Highly Ready',
        color: 'text-green-500',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500',
        message: 'Your business is perfectly positioned to leverage AI automation. TrueFlow can help you maximize your potential.',
        recommendation: 'Complete System'
      }
    } else if (score >= 50) {
      return {
        level: 'Ready',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500',
        message: 'You\'re ready to start automating and scaling with AI. TrueFlow can transform your operations.',
        recommendation: 'Complete System'
      }
    } else if (score >= 25) {
      return {
        level: 'Getting Ready',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500',
        message: 'You have room to grow. Start with content automation to see immediate improvements.',
        recommendation: 'Content Engine'
      }
    } else {
      return {
        level: 'Building Foundation',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500',
        message: 'Begin your AI journey with our Content Engine to establish efficient workflows.',
        recommendation: 'Content Engine'
      }
    }
  }

  const toggleContentGoal = (goalId: string) => {
    setContentGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.includes(integrationId)
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const score = calculateScore()
      const recommendation = getRecommendation(score)
      const businessType = businessTypes.find(type => type.id === selectedBusinessType)?.title || selectedBusinessType
      const planName = plans.find(plan => plan.id === selectedPlan)?.name || selectedPlan

      // Prepare comprehensive lead data
      const leadData = {
        ...contactInfo,
        businessType,
        answers,
        score,
        recommendation: recommendation.recommendation,
        contentGoals,
        integrations,
        selectedPlan: planName,
        timestamp: new Date().toISOString()
      }

      // Send to GHL API
      const response = await fetch('/api/ghl/create-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.message || 'Failed to submit assessment')
      }

      // Send lead notification
      await fetch('/api/lead-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      })

      // Show success page
      setShowSuccess(true)
    } catch (error) {
      console.error('Error submitting assessment:', error)
      setSubmitError('Failed to submit assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentStepNumber = () => {
    // Map current screen to 5-step structure
    if (currentStep === 0) return 1 // Business Profile & Goals
    if (currentStep >= 1 && currentStep <= 4) return 2 // Current Practices (Q1-4)
    if (currentStep >= 5 && currentStep <= 6) return 3 // Resources (Q5-6)
    if (currentStep === 7) return 4 // Setup
    if (currentStep === 8) return 5 // Results & Plan
    return 1
  }

  // Smooth scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const getTotalSteps = () => {
    return 5 // Fixed 5 steps
  }

  const getProgress = () => {
    return Math.round((getCurrentStepNumber() / 5) * 100)
  }

  const handleNext = () => {
    // Handle navigation for combined steps
    if (currentStep === 0) {
      // After Business Profile & Goals, go to first assessment question
      setCurrentStep(1)
    } else if (currentStep >= 1 && currentStep <= questions.length) {
      // During assessment questions
      if (currentStep < questions.length) {
        setCurrentStep(currentStep + 1)
      } else {
        // After last question, go to Setup (Contact + Integrations)
        setCurrentStep(7)
      }
    } else if (currentStep === 7) {
      // After Setup, go to Results & Plan
      setCurrentStep(8)
    }
  }

  const handlePrevious = () => {
    if (currentStep === 1) {
      // From first assessment question, go back to Business Profile & Goals
      setCurrentStep(0)
    } else if (currentStep === 7) {
      // From Setup, go back to last assessment question
      setCurrentStep(questions.length)
    } else if (currentStep === 8) {
      // From Results, go back to Setup
      setCurrentStep(7)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Reusable header component matching FAQ/content-engine style
  const renderHeader = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 transition-all duration-500 bg-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
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
          </div>

          {/* Right side navigation - matching FAQ/content-engine style */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-white/70 hover:text-white transition-colors text-lg">
              ← Back to Home
            </Link>
            <Link href="/get-started" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )

  // Success Page
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
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

        {/* Header */}
        {renderHeader()}

        <main className="pt-48 pb-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Welcome to TrueFlow AI!
            </h1>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              Your account is being set up. You'll receive an email with next steps and your first voice recording instructions.
            </p>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-12 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">What happens next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Welcome Email</h4>
                    <p className="text-white/70">Check your email for personalized setup instructions and next steps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">First Voice Recording</h4>
                    <p className="text-white/70">Record your first 30-60 second voice note about your business</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">AI Content Generation</h4>
                    <p className="text-white/70">Watch as TrueFlow transforms your voice into professional content</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Check Your Email for Next Steps</span>
              </div>
              <Link href="/" className="text-white/70 hover:text-white transition-colors underline text-lg">
                Return to Home
              </Link>
            </div>

            <div className="mt-12 text-center text-white/50">
              <p>Need help getting started? <a href="mailto:griffin@trueflow.ai" className="text-blue-400 hover:text-blue-300">Contact our support team</a></p>
            </div>
          </div>
        </main>
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

      {/* Header */}
      {renderHeader()}

      {/* Progress Bar */}
      <div className="fixed top-24 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Step {getCurrentStepNumber()} of {getTotalSteps()}: {steps[getCurrentStepNumber() - 1]}</span>
            <span className="text-sm text-white/70">{getProgress()}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <main className="pt-48 pb-20 px-4">
        {/* Step Indicator */}
        <div className="max-w-5xl mx-auto mb-12 px-4">
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isActive = getCurrentStepNumber() === stepNumber
              const isCompleted = getCurrentStepNumber() > stepNumber
              
              return (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm font-medium hidden md:block transition-colors duration-300 ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'text-green-400'
                          : 'text-white/50'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 md:w-16 h-0.5 transition-all duration-500 ${
                        isCompleted ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Business Profile & Goals (Combined) */}
          {currentStep === 0 && (
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                Business Profile & Goals
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto text-center">
                Tell us about your business and what content you want to create
              </p>
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50">
                  <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300">Complete both sections to continue</span>
                </div>
              </div>

              {/* Business Type Selection Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Select Your Business Type</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedBusinessType(type.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                        selectedBusinessType === type.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          selectedBusinessType === type.id ? 'bg-blue-500' : 'bg-white/10'
                        }`}>
                          <div className="w-6 h-6 flex items-center justify-center">
                            {React.cloneElement(type.icon as React.ReactElement, { className: 'h-6 w-6' })}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">{type.title}</h3>
                          <p className="text-white/60 text-xs">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Goals Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">What Content Do You Want to Create?</h2>
                </div>
                <p className="text-white/70 mb-6">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {contentGoalOptions.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleContentGoal(goal.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        contentGoals.includes(goal.id)
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          contentGoals.includes(goal.id) ? 'bg-blue-500' : 'bg-white/10'
                        }`}>
                          {goal.icon}
                        </div>
                        <span className="text-white text-sm">{goal.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleNext}
                  disabled={!selectedBusinessType || contentGoals.length === 0}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedBusinessType && contentGoals.length > 0
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Assessment</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Current Practices (Questions 1-4 combined) */}
          {currentStep >= 1 && currentStep <= 4 && (
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                Current Practices
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto text-center">
                Let's understand how you currently manage content and customer relationships
              </p>
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50">
                  <MessageSquare className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300">Answer all 4 questions to continue</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.slice(0, 4).map((question, index) => (
                  <div key={question.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">{question.question}</h3>
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(question.id, option.value)}
                          className={`w-full p-3 rounded-xl border transition-all duration-200 text-left ${
                            answers[question.id] === option.value
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/90">{option.label}</span>
                            {answers[question.id] === option.value && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-12">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <button
                  onClick={() => {
                    // Check if all 4 questions are answered
                    const answeredCount = questions.slice(0, 4).filter(q => answers[q.id]).length
                    if (answeredCount === 4) {
                      setCurrentStep(5) // Go to Resources step
                    }
                  }}
                  disabled={questions.slice(0, 4).filter(q => answers[q.id]).length < 4}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                    questions.slice(0, 4).filter(q => answers[q.id]).length === 4
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Next Step
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resources (Questions 5-6 combined) */}
          {currentStep >= 5 && currentStep <= 6 && (
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                Resources
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto text-center">
                Let's understand your time and budget allocation
              </p>
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50">
                  <Clock className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300">Answer both questions to continue</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.slice(4, 6).map((question, index) => (
                  <div key={question.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">{question.question}</h3>
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(question.id, option.value)}
                          className={`w-full p-3 rounded-xl border transition-all duration-200 text-left ${
                            answers[question.id] === option.value
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/90">{option.label}</span>
                            {answers[question.id] === option.value && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-12">
                <button
                  onClick={() => setCurrentStep(1)} // Go back to first question of Current Practices
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <button
                  onClick={() => {
                    // Check if both questions are answered
                    const answeredCount = questions.slice(4, 6).filter(q => answers[q.id]).length
                    if (answeredCount === 2) {
                      setCurrentStep(7) // Go to Setup step
                    }
                  }}
                  disabled={questions.slice(4, 6).filter(q => answers[q.id]).length < 2}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                    questions.slice(4, 6).filter(q => answers[q.id]).length === 2
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Next Step
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Setup (Contact Info + Integrations Combined) */}
          {currentStep === 7 && (
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
                Setup Information
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto text-center">
                Complete your profile and select your integrations
              </p>
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50">
                  <Settings className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300">Contact info required • Integrations optional</span>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-left text-white/80 mb-2">First Name</label>
                      <input
                        type="text"
                        value={contactInfo.firstName}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-left text-white/80 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={contactInfo.lastName}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-left text-white/80 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={contactInfo.businessName}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-left text-white/80 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label className="block text-left text-white/80 mb-2">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="+1 (555) 555-5555"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrations Card */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Select Your Integrations</h2>
                </div>
                <p className="text-white/70 mb-6">Choose the platforms you'd like to integrate (optional)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {integrationOptions.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => toggleIntegration(integration.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        integrations.includes(integration.id)
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          integrations.includes(integration.id) ? 'bg-blue-500' : 'bg-white/10'
                        }`}>
                          {integration.icon}
                        </div>
                        <span className="text-white text-sm">{integration.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!contactInfo.firstName || !contactInfo.lastName || !contactInfo.businessName || !contactInfo.email}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    contactInfo.firstName && contactInfo.lastName && contactInfo.businessName && contactInfo.email
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <span>See Your Results</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Results & Plan Selection */}
          {currentStep === 8 && (
            <div className="text-center">
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Your AI Readiness Score
                </h1>
                
                {/* Score Display */}
                <div className={`max-w-2xl mx-auto mb-8 ${getRecommendation(calculateScore()).bgColor} ${getRecommendation(calculateScore()).borderColor} border-2 rounded-2xl p-8`}>
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-4">
                      {calculateScore()}%
                    </div>
                    <h2 className={`text-3xl font-bold mb-2 ${getRecommendation(calculateScore()).color}`}>
                      {getRecommendation(calculateScore()).level}
                    </h2>
                    <p className="text-lg text-white/80">
                      {getRecommendation(calculateScore()).message}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6">
                Choose your plan
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Select the plan that best fits your content creation needs
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer transform-gpu ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500 scale-105'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.320, 1)'
                    }}
                    onClick={() => setSelectedPlan(plan.id)}
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
                      e.currentTarget.style.transform = selectedPlan === plan.id 
                        ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1.05)'
                        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                    }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        <span className={`font-bold text-white ${
                          plan.id === 'custom' ? 'text-2xl' : 'text-4xl'
                        }`}>{plan.price}</span>
                        <span className="text-white/70">{plan.period}</span>
                      </div>
                      <p className="text-white/70">{plan.description}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {selectedPlan === plan.id && (
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 max-w-md mx-auto">
                  <AlertCircle className="h-5 w-5 inline mr-2" />
                  {submitError}
                </div>
              )}

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedPlan || isSubmitting}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedPlan && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      
      {showResults && (
        <DebugComponent 
          currentStep={currentStep}
          answers={answers}
          showResults={showResults}
          showContactForm={false}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </div>
  )
}