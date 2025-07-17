/**
 * TrueFlow AI Get Started Page
 * Multi-step onboarding process for new users
 */

'use client'

import { useState, useEffect, useRef } from 'react'
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
  Play,
  Download,
  Upload,
  Settings,
  Sparkles
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
    businessName: '',
    email: '',
    firstName: '',
    lastName: '',
    contentGoals: [] as string[],
    integrations: [] as string[]
  })
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

  const nextStep = () => {
    if (currentStep < 5) {
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

  const submitLead = async () => {
    try {
      // Get the business type name from the selected ID
      const businessType = businessTypes.find(type => type.id === selectedBusinessType)?.title || selectedBusinessType
      
      // Get the plan name from the selected ID
      const planName = plans.find(plan => plan.id === selectedPlan)?.name || selectedPlan

      // Prepare the lead data
      const leadData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        businessName: formData.businessName,
        businessType: businessType,
        selectedPlan: planName,
        contentGoals: formData.contentGoals,
        integrations: formData.integrations,
        timestamp: new Date().toISOString()
      }

      // Send lead notification to Griffin and Matt
      const response = await fetch('/api/lead-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      })

      if (!response.ok) {
        throw new Error('Failed to send lead notification')
      }

      const result = await response.json()
      console.log('Lead notification sent successfully:', result)
      
      // Continue to step 5 (success page)
      nextStep()
      
    } catch (error) {
      console.error('Error submitting lead:', error)
      // Still proceed to success page even if notification fails
      // You might want to show a different message or retry logic here
      nextStep()
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
                height={84} 
                className="h-20 w-auto transform hover:scale-105 transition-transform"
                priority
              />
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white/70 hover:text-white transition-colors text-lg">
                <ArrowLeft className="h-6 w-6" />
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
          
          {/* Step 1: Business Type Selection */}
          {currentStep === 1 && (
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

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Tell us about your business
              </h1>
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                We'll use this information to personalize your TrueFlow experience
              </p>

              <div className="max-w-2xl mx-auto space-y-6 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-left text-white/80 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-left text-white/80 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

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

                <div>
                  <label className="block text-left text-white/80 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your email address"
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
                  disabled={!formData.firstName || !formData.lastName || !formData.businessName || !formData.email}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    formData.firstName && formData.lastName && formData.businessName && formData.email
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

          {/* Step 3: Content Goals */}
          {currentStep === 3 && (
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

          {/* Step 4: Plan Selection */}
          {currentStep === 4 && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Choose your plan
              </h1>
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

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={submitLead}
                  disabled={!selectedPlan}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedPlan
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <span>Complete Setup</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Setup Complete */}
          {currentStep === 5 && (
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