/**
 * TrueFlow AI Get Started Page
 * Multi-step onboarding process for new users
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
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
  Play,
  Download,
  Upload,
  Settings,
  Sparkles,
  HelpCircle
} from 'lucide-react'

interface BusinessType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
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

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    contentGoals: [] as string[],
    integrations: [] as string[]
  })
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    phone: ''
  })
  const [partialLeadSent, setPartialLeadSent] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorTrail, setCursorTrail] = useState<CursorTrailPoint[]>([])
  const cursorTrailRef = useRef<CursorTrailPoint[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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

  const plans: Plan[] = [
    {
      id: 'content-engine',
      name: 'Content Engine',
      price: '$150',
      period: '/week',
      description: 'Access to our powerful AI content creation system',
      features: [
        'AI-powered content creation',
        'Transform voice to content',
        'SEO-optimized blog posts',
        'Email sequences',
        'Social media posts',
        'Content dashboard access',
        'Basic analytics'
      ]
    },
    {
      id: 'complete-system',
      name: 'Complete System',
      price: '$300',
      period: '/week',
      description: 'Everything in Content Engine plus full CRM',
      features: [
        'Everything in Content Engine',
        'Full CRM system',
        'Lead capture & tracking',
        'Automated follow-ups',
        'Sales pipeline management',
        'Customer communication hub',
        'Advanced analytics & reporting',
        'Dedicated success manager'
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

  const contentGoals = [
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

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return 'Name is required'
    if (/\d/.test(name)) return 'Name cannot contain numbers'
    if (!/^[a-zA-Z\s\-']+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes'
    return ''
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required'
    if (!email.includes('@')) return 'Email must contain @ symbol'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return ''
  }

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Phone number is required'
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length !== 10) return 'Phone number must be 10 digits'
    return ''
  }

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly.length <= 3) return digitsOnly
    if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '')
    if (digitsOnly.length <= 10) {
      const formatted = formatPhoneNumber(digitsOnly)
      setFormData(prev => ({ ...prev, phone: formatted }))
      setValidationErrors(prev => ({ ...prev, phone: validatePhone(formatted) }))
    }
  }

  const sendPartialLead = async () => {
    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ')
      const lastName = lastNameParts.join(' ') || ''
      
      const partialLeadData = {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        timestamp: new Date().toISOString(),
        isPartialLead: true
      }

      const response = await fetch('/api/partial-lead-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partialLeadData)
      })

      if (response.ok) {
        setPartialLeadSent(true)
        console.log('Partial lead notification sent successfully')
      }
    } catch (error) {
      console.error('Error sending partial lead:', error)
    }
  }

  const nextStep = async () => {
    // Validate contact info on step 1
    if (currentStep === 1) {
      const nameError = validateName(formData.fullName)
      const emailError = validateEmail(formData.email)
      const phoneError = validatePhone(formData.phone)
      
      setValidationErrors({
        fullName: nameError,
        email: emailError,
        phone: phoneError
      })
      
      if (nameError || emailError || phoneError) {
        return
      }
      
      // Send partial lead notification when moving from step 1 to step 2
      if (!partialLeadSent) {
        await sendPartialLead()
      }
    }
    
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleContentGoal = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      contentGoals: prev.contentGoals.includes(goalId)
        ? prev.contentGoals.filter(id => id !== goalId)
        : [...prev.contentGoals, goalId]
    }))
  }

  const toggleIntegration = (integrationId: string) => {
    setFormData(prev => ({
      ...prev,
      integrations: prev.integrations.includes(integrationId)
        ? prev.integrations.filter(id => id !== integrationId)
        : [...prev.integrations, integrationId]
    }))
  }

  // Function to determine recommended tier based on user inputs
  const getRecommendedTier = () => {
    const contentGoalCount = formData.contentGoals.length
    const businessType = selectedBusinessType
    const hasIntegrations = formData.integrations.length > 0
    const needsCRM = formData.contentGoals.includes('sales') || formData.contentGoals.includes('support')
    const needsEmailMarketing = formData.contentGoals.includes('newsletters')
    const needsSocialMedia = formData.contentGoals.includes('social')
    
    // Custom enterprise for agencies and large-scale operations
    if (businessType === 'agency' || contentGoalCount >= 5) {
      return {
        id: 'custom',
        reason: 'Based on your agency needs and multiple content types, our Custom Enterprise plan offers the scalability and white-label solutions you need.',
        confidence: 'high',
        alternativeReason: 'Perfect for managing multiple clients and brands with dedicated support.'
      }
    }
    
    // Complete System for businesses needing CRM + content
    if (
      (businessType === 'business' || businessType === 'coach') && 
      (contentGoalCount >= 3 || needsCRM || hasIntegrations)
    ) {
      return {
        id: 'complete-system',
        reason: 'Your business would benefit from our Complete System with integrated CRM to manage leads and customer relationships alongside content creation.',
        confidence: 'high',
        alternativeReason: `Ideal for ${businessType === 'coach' ? 'managing client relationships' : 'growing your business'} with automated follow-ups and sales pipeline.`
      }
    }
    
    // Content Engine for creators and podcasters focused on content
    if (
      (businessType === 'creator' || businessType === 'podcaster') && 
      contentGoalCount <= 3 &&
      !needsCRM
    ) {
      return {
        id: 'content-engine',
        reason: 'The Content Engine is perfect for transforming your creative ideas into professional content across multiple channels.',
        confidence: 'high',
        alternativeReason: businessType === 'podcaster' ? 'Transform episodes into SEO blogs and grow your audience.' : 'Focus on content creation without the complexity of CRM features.'
      }
    }
    
    // Special case: Other professionals with specific needs
    if (businessType === 'other') {
      if (needsCRM || hasIntegrations || contentGoalCount >= 4) {
        return {
          id: 'complete-system',
          reason: 'Based on your content goals and integration needs, the Complete System offers the most flexibility.',
          confidence: 'medium',
          alternativeReason: 'Provides both content creation and customer management capabilities.'
        }
      } else {
        return {
          id: 'content-engine',
          reason: 'The Content Engine provides a focused solution for your content creation needs.',
          confidence: 'medium',
          alternativeReason: 'Start with content creation and upgrade later if you need CRM features.'
        }
      }
    }
    
    // Default recommendation: Complete System for comprehensive needs
    return {
      id: 'complete-system',
      reason: 'Our Complete System provides the most comprehensive solution for growing your business with both content creation and customer management tools.',
      confidence: 'medium',
      alternativeReason: 'Covers all bases with content creation, lead management, and automation features.'
    }
  }

  const submitLead = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Get the business type name from the selected ID
      const businessType = businessTypes.find(type => type.id === selectedBusinessType)?.title || selectedBusinessType
      
      // Get the plan name from the selected ID
      const planName = selectedPlan === 'not-sure' 
        ? 'Not Sure' 
        : plans.find(plan => plan.id === selectedPlan)?.name || selectedPlan

      // Split full name into first and last
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ')
      const lastName = lastNameParts.join(' ') || ''

      // Prepare the lead data
      const leadData = {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        businessType: businessType,
        selectedPlan: planName,
        contentGoals: formData.contentGoals,
        integrations: formData.integrations,
        timestamp: new Date().toISOString()
      }

      console.log('Submitting lead data:', leadData)

      // Send lead notification to Griffin and Matt using the get-started specific endpoint
      const response = await fetch('/api/get-started-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      })

      let responseData;
      try {
        responseData = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse response JSON:', jsonError)
        responseData = { error: 'Invalid response from server' }
      }
      
      if (!response.ok) {
        // Log the full error for debugging
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        })
        throw new Error(responseData.error || `Failed to send lead notification (Status: ${response.status})`)
      }

      console.log('Lead notification sent successfully:', responseData)
      
      // Continue to step 6 (success page)
      setCurrentStep(6)
      
    } catch (error) {
      console.error('Error submitting lead:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form. Please try again.')
      
      // Try to proceed to success page after a delay to show error
      setTimeout(() => {
        setCurrentStep(6)
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
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

            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-24 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Step {currentStep} of 5</span>
            <span className="text-sm text-white/70">{Math.round((currentStep / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-48 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Let's get started
              </h1>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Enter your contact information to begin your TrueFlow journey
              </p>

              <div className="max-w-2xl mx-auto space-y-6 mb-12">
                <div>
                  <label className="block text-left text-white/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData(prev => ({ ...prev, fullName: value }))
                      setValidationErrors(prev => ({ ...prev, fullName: validateName(value) }))
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-400 text-sm text-left mt-1">{validationErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-left text-white/80 mb-2">Business Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData(prev => ({ ...prev, email: value }))
                      setValidationErrors(prev => ({ ...prev, email: validateEmail(value) }))
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your business email"
                  />
                  {validationErrors.email && (
                    <p className="text-red-400 text-sm text-left mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-left text-white/80 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="(123) 456-7890"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-400 text-sm text-left mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              <button
                onClick={nextStep}
                disabled={!formData.fullName || !formData.email || !formData.phone}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto ${
                  formData.fullName && formData.email && formData.phone
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 2: Business Type Selection */}
          {currentStep === 2 && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Tell us about yourself
              </h1>
              <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
                We'll customize our done-for-you content service to turn your ideas into SEO blogs, daily emails, and branded social posts that drive results.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {businessTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedBusinessType(type.id)}
                    className={`p-6 rounded-2xl border text-left transition-all duration-500 transform-gpu ${
                      selectedBusinessType === type.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500 shadow-lg'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
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
                      const rotateX = (mouseY / rect.height) * -10
                      const rotateY = (mouseX / rect.width) * 10
                      e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const centerX = rect.left + rect.width / 2
                      const centerY = rect.top + rect.height / 2
                      const mouseX = e.clientX - centerX
                      const mouseY = e.clientY - centerY
                      const rotateX = (mouseY / rect.height) * -10
                      const rotateY = (mouseX / rect.width) * 10
                      e.currentTarget.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-lg ${
                        selectedBusinessType === type.id ? 'bg-blue-500' : 'bg-white/10'
                      }`}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{type.title}</h3>
                        <p className="text-white/70 text-sm">{type.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-white/80 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={!selectedBusinessType}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto ${
                  selectedBusinessType
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 3: Business Details */}
          {currentStep === 3 && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Tell us about your business
              </h1>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                We'll use this information to personalize your TrueFlow experience
              </p>

              <div className="max-w-2xl mx-auto space-y-6 mb-12">
                <div>
                  <label className="block text-left text-white/80 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your business name"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.businessName}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    formData.businessName
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Content Goals */}
          {currentStep === 4 && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What content do you want to create?
              </h1>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Select all the types of content you'd like TrueFlow to help you create
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {contentGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleContentGoal(goal.id)}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      formData.contentGoals.includes(goal.id)
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                      formData.contentGoals.includes(goal.id) ? 'bg-blue-500' : 'bg-white/10'
                    }`}>
                      {goal.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{goal.label}</h3>
                    {formData.contentGoals.includes(goal.id) && (
                      <CheckCircle className="h-6 w-6 text-green-400 mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={formData.contentGoals.length === 0}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    formData.contentGoals.length > 0
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Plan Selection */}
          {currentStep === 5 && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Choose your plan
              </h1>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Select the plan that best fits your content creation needs
              </p>

              {/* Recommendation Banner */}
              {selectedPlan !== 'not-sure' && (() => {
                const recommendation = getRecommendedTier()
                const recommendedPlan = plans.find(p => p.id === recommendation.id)
                return (
                  <div className="mb-12 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/30 rounded-2xl p-6">
                      <div className="flex items-center justify-center mb-3">
                        <Sparkles className="h-6 w-6 text-blue-400 mr-2" />
                        <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
                      </div>
                      <p className="text-white/80 mb-2">
                        {recommendation.reason}
                      </p>
                      {recommendation.alternativeReason && (
                        <p className="text-white/70 text-sm mb-3">
                          {recommendation.alternativeReason}
                        </p>
                      )}
                      <div className="flex items-center justify-center space-x-3">
                        <p className="text-blue-400 font-semibold">
                          We recommend: {recommendedPlan?.name}
                        </p>
                        {recommendation.confidence === 'high' && (
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                            Best Match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {plans.map((plan) => {
                  const recommendation = getRecommendedTier()
                  const isRecommended = plan.id === recommendation.id
                  return (
                    <div
                      key={plan.id}
                      className={`relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer transform-gpu ${
                        selectedPlan === plan.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500 scale-105'
                          : isRecommended
                          ? 'bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-500/50 hover:border-blue-500'
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
                    
                    {isRecommended && !plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Recommended
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
                  )
                })}
              </div>

              {/* Not Sure Option - Separate button below main options */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setSelectedPlan('not-sure')}
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedPlan === 'not-sure'
                      ? 'bg-white/20 text-white border-2 border-white/40'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/15 hover:text-white/90'
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Not sure which plan is right for me</span>
                </button>
                {selectedPlan === 'not-sure' && (
                  <p className="text-white/60 text-sm mt-2">
                    No problem! We'll help you find the perfect plan after you submit.
                  </p>
                )}
              </div>

              {submitError && (
                <div className="mb-6 mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 max-w-2xl mx-auto">
                  <p className="font-semibold">Error submitting form:</p>
                  <p>{submitError}</p>
                </div>
              )}

              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={submitLead}
                  disabled={!selectedPlan || isSubmitting}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedPlan && !isSubmitting
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span>Submitting...</span>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

          {/* Step 6: Setup Complete */}
          {currentStep === 6 && (
            <div className="text-center">
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
          )}

        </div>
      </main>
    </div>
  )
}