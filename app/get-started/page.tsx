/**
 * TrueFlow AI Readiness Assessment Page - Combined Steps Version
 * Strategically combines 11 steps into 5 for better user experience
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../components/Navigation'
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
  Settings,
  HelpCircle
} from 'lucide-react'

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

// Step definitions for the combined flow
const stepDefinitions = [
  { id: 1, name: 'Setup', description: 'Contact and integration preferences' },
  { id: 2, name: 'Business Profile & Goals', description: 'Tell us about your business and content goals' },
  { id: 3, name: 'Current Practices', description: 'How you currently operate' },
  { id: 4, name: 'Resources', description: 'Your time and budget' },
  { id: 5, name: 'Results & Plan', description: 'Your AI readiness score and plan selection' }
]

export default function ReadinessAssessment() {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('')
  const [contentGoals, setContentGoals] = useState<string[]>([])
  const [integrations, setIntegrations] = useState<string[]>([])
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
  const [planRecommendation, setPlanRecommendation] = useState<{ planId: string; reason: string } | null>(null)

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
      id: 'content-engine',
      name: 'Content Engine',
      price: '$150',
      period: '/week',
      description: 'AI-powered content creation system',
      features: [
        'AI-powered content creation',
        'Transform voice to content',
        'SEO-optimized blog posts',
        'Email newsletter generation',
        'Multi-platform publishing',
        'Content calendar & planning',
        'Analytics dashboard',
        'Basic integrations'
      ]
    },
    {
      id: 'complete-system',
      name: 'Complete System',
      price: '$300',
      period: '/week',
      description: 'Full automation suite with CRM',
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
      description: 'Tailored solutions for large organizations',
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
    },
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

    const percentage = Math.round((totalScore / maxScore) * 100)
    // Cap the score at 100% in case of any calculation issues
    return Math.min(percentage, 100)
  }

  const getSmartPlanRecommendation = () => {
    const score = calculateScore()
    
    // Get individual answer values for detailed analysis
    const contentVolume = answers['content-volume']
    const currentContent = answers['current-content']
    const crmUsage = answers['crm-usage']
    const leadResponse = answers['lead-response']
    const budget = answers['budget']
    
    // Count key indicators
    let contentEngineIndicators = 0
    let completeSystemIndicators = 0
    let enterpriseIndicators = 0
    
    // Content volume analysis
    if (contentVolume === 'minimal') contentEngineIndicators++
    else if (contentVolume === 'moderate') completeSystemIndicators++
    else if (contentVolume === 'high' || contentVolume === 'very-high') enterpriseIndicators++
    
    // Current content creation method
    if (currentContent === 'manual' || currentContent === 'outsource') contentEngineIndicators++
    else if (currentContent === 'mixed') completeSystemIndicators++
    else if (currentContent === 'team') enterpriseIndicators++
    
    // CRM usage
    if (crmUsage === 'spreadsheets') contentEngineIndicators++
    else if (crmUsage === 'basic-crm') completeSystemIndicators++
    else if (crmUsage === 'advanced-crm' || crmUsage === 'integrated') enterpriseIndicators++
    
    // Lead response time
    if (leadResponse === 'days') contentEngineIndicators++
    else if (leadResponse === 'hours' || leadResponse === 'quick') completeSystemIndicators++
    else if (leadResponse === 'instant') enterpriseIndicators++
    
    // Budget analysis
    if (budget === 'low' || budget === 'moderate') contentEngineIndicators++
    else if (budget === 'high') completeSystemIndicators++
    else if (budget === 'enterprise') enterpriseIndicators++
    
    // Determine recommendation based on indicators and score
    let recommendedPlan = 'not-sure'
    let recommendationReason = ''
    
    if (score < 25) {
      recommendedPlan = 'not-sure'
      recommendationReason = 'Based on your assessment, we recommend scheduling a consultation to better understand your needs and create a custom solution.'
    } else if (enterpriseIndicators >= 3 && score >= 75) {
      recommendedPlan = 'custom'
      recommendationReason = 'Your high content volume, advanced systems, and substantial budget make you ideal for our Custom Enterprise solution with dedicated support.'
    } else if (completeSystemIndicators >= 2 && score >= 50) {
      recommendedPlan = 'complete-system'
      recommendationReason = 'Your medium content needs and existing systems position you perfectly for our Complete System to streamline both content and customer management.'
    } else if (contentEngineIndicators >= 3 || score < 50) {
      recommendedPlan = 'content-engine'
      recommendationReason = 'Starting with our Content Engine will help you establish efficient content workflows and see immediate time savings.'
    } else if (score >= 50) {
      recommendedPlan = 'complete-system'
      recommendationReason = 'Your readiness score indicates you\'re prepared for full automation with our Complete System.'
    } else {
      recommendedPlan = 'content-engine'
      recommendationReason = 'Our Content Engine is the perfect starting point for your AI automation journey.'
    }
    
    return {
      planId: recommendedPlan,
      reason: recommendationReason
    }
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

  const getCategoryScores = () => {
    const categoryScores: Record<string, number> = {}
    const categoryMaxScores: Record<string, number> = {}
    
    questions.forEach(q => {
      const answer = answers[q.id]
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = 0
        categoryMaxScores[q.category] = 0
      }
      
      if (answer) {
        const option = q.options.find(o => o.value === answer)
        if (option) {
          categoryScores[q.category] += option.score
        }
      }
      categoryMaxScores[q.category] += 4 // Maximum score per question
    })
    
    const result: Record<string, number> = {}
    Object.keys(categoryScores).forEach(category => {
      result[category] = Math.round((categoryScores[category] / categoryMaxScores[category]) * 100)
    })
    
    return result
  }

  const generateInsights = () => {
    const score = calculateScore()
    const categoryScores = getCategoryScores()
    const insights: string[] = []
    
    // Overall readiness insight
    if (score >= 75) {
      insights.push("Your business shows exceptional readiness for AI automation across all key areas")
    } else if (score >= 50) {
      insights.push("You have a solid foundation for automation with room for strategic improvements")
    } else {
      insights.push("Building your automation foundation will unlock significant growth potential")
    }
    
    // Category-specific insights
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (category === 'content-creation' && score >= 75) {
        insights.push("Your content creation processes are prime for AI enhancement, potentially saving 20+ hours weekly")
      } else if (category === 'content-creation' && score < 50) {
        insights.push("Streamlining content creation could be your biggest quick win for time savings")
      }
      
      if (category === 'audience-engagement' && score >= 75) {
        insights.push("Strong audience engagement foundation means AI can amplify your reach exponentially")
      } else if (category === 'audience-engagement' && score < 50) {
        insights.push("Improving audience engagement metrics will maximize your content ROI")
      }
      
      if (category === 'business-operations' && score >= 75) {
        insights.push("Your operational maturity positions you to see immediate automation benefits")
      } else if (category === 'business-operations' && score < 50) {
        insights.push("Optimizing operations first will ensure smooth automation implementation")
      }
    })
    
    // Time to value insight
    if (score >= 75) {
      insights.push("Expected time to positive ROI: 2-4 weeks with full implementation")
    } else if (score >= 50) {
      insights.push("Expected time to positive ROI: 4-8 weeks with guided onboarding")
    } else {
      insights.push("Expected time to positive ROI: 8-12 weeks with foundational support")
    }
    
    return insights.slice(0, 4) // Return top 4 insights
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
    
    // Check for network connectivity
    if (!navigator.onLine) {
      setSubmitError('No internet connection. Please check your network and try again.')
      setIsSubmitting(false)
      return
    }

    try {
      const score = calculateScore()
      const recommendation = getRecommendation(score)
      const businessType = businessTypes.find(type => type.id === selectedBusinessType)?.title || selectedBusinessType
      const planName = selectedPlan === 'not-sure' 
        ? 'Not Sure Yet' 
        : plans.find(plan => plan.id === selectedPlan)?.name || selectedPlan

      // Calculate raw score for the email
      let rawTotalScore = 0
      questions.forEach(q => {
        const answer = answers[q.id]
        if (answer) {
          const option = q.options.find(o => o.value === answer)
          if (option) {
            rawTotalScore += option.score
          }
        }
      })

      // Prepare comprehensive lead data with all assessment details
      const leadData = {
        // Contact information
        ...contactInfo,
        
        // Business profile
        businessType,
        contentGoals,
        
        // Assessment answers with questions for context
        assessmentAnswers: Object.entries(answers).map(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId)
          return {
            questionId,
            category: question?.category || 'Unknown',
            question: question?.question || 'Unknown question',
            answer: question?.options.find(opt => opt.value === answer)?.label || answer,
            score: question?.options.find(opt => opt.value === answer)?.score || 0
          }
        }),
        
        // Raw answers for backup
        answers,
        
        // Scoring and recommendations
        totalScore: rawTotalScore,
        maxPossibleScore: questions.length * 4, // 4 is max score per question
        scorePercentage: score, // score is already a percentage
        recommendation: recommendation.recommendation,
        readinessLevel: recommendation.level,
        
        // Preferences
        integrations,
        selectedPlan: planName,
        
        // Metadata
        timestamp: new Date().toISOString(),
        assessmentVersion: '2.0',
        source: 'readiness-assessment'
      }

      // Send to GHL API
      console.log('[Form Submit] Sending data to API...')
      console.log('[Form Submit] API URL:', '/api/ghl/create-lead-v4')
      console.log('[Form Submit] Request body:', JSON.stringify(leadData, null, 2))
      
      const response = await fetch('/api/ghl/create-lead-v4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      })

      console.log('[Form Submit] Response status:', response.status)
      console.log('[Form Submit] Response ok:', response.ok)
      console.log('[Form Submit] Response headers:', response.headers)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (parseError) {
          console.error('[Form Submit] Failed to parse error response:', parseError)
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('[Form Submit] API Error Response:', errorData)
        console.error('[Form Submit] Full response:', response)
        throw new Error(errorData.message || errorData.error || `Failed to submit assessment (HTTP ${response.status})`)
      }

      const result = await response.json()
      console.log('Form submitted successfully:', result)

      // Send lead notification email (backup to ensure emails are sent)
      try {
        console.log('[Form Submit] Sending email notification...')
        const emailResponse = await fetch('/api/form-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData)
        })
        
        if (emailResponse.ok) {
          console.log('[Form Submit] Email notification sent successfully')
        } else {
          console.error('[Form Submit] Email notification failed:', emailResponse.status)
        }
      } catch (emailError) {
        console.error('[Form Submit] Email notification error:', emailError)
        // Don't throw - email is backup, main submission succeeded
      }

      // Show success page
      setShowSuccess(true)
    } catch (error) {
      console.error('[Form Submit] Submission failed:', error)
      console.error('[Form Submit] Error type:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('[Form Submit] Error message:', error instanceof Error ? error.message : String(error))
      console.error('[Form Submit] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      
      // Set a more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setSubmitError(`Failed to submit: ${errorMessage}`)
      
      // Log the full form state for debugging
      console.error('[Form Submit] Form state at time of error:', {
        contactInfo,
        selectedBusinessType,
        contentGoals,
        integrations,
        answers,
        selectedPlan,
        currentStep,
        score: calculateScore(),
        recommendation: getRecommendation(calculateScore())
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProgress = () => {
    return Math.round((currentStep / stepDefinitions.length) * 100)
  }

  const canProceedStep1 = contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.businessName
  const canProceedStep2 = selectedBusinessType && contentGoals.length > 0
  const canProceedStep3 = answers['current-content'] && answers['content-volume'] && answers['crm-usage'] && answers['lead-response']
  const canProceedStep4 = answers['time-spent'] && answers['budget']

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentStep < stepDefinitions.length) {
      // Calculate plan recommendation when moving to Step 5
      if (currentStep === 4) {
        const recommendation = getSmartPlanRecommendation()
        setPlanRecommendation(recommendation)
        setSelectedPlan(recommendation.planId)
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentStep > 1) {
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
            <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
              ← Back to Home
            </Link>
            <Link href="/get-started" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-semibold">
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

        <main className="pt-64 sm:pt-48 pb-20 px-4">
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
              <Link href="/" className="text-white/70 hover:text-white transition-colors underline text-sm">
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

      {/* Step Indicators */}
      <div className="fixed top-24 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {stepDefinitions.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                {/* Step circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  currentStep >= step.id 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' 
                    : 'bg-white/10 text-white/50 border border-white/20'
                }`}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                
                {/* Step name and description */}
                <div className="text-center">
                  <span className={`text-xs font-medium block ${
                    currentStep === step.id ? 'text-white' : 'text-white/50'
                  }`}>
                    {step.name}
                  </span>
                  {currentStep === step.id && (
                    <span className="text-xs text-white/70 mt-1 block">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="pt-64 sm:pt-56 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Setup (Contact + Integrations) */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-4">
                  Setup Your Account
                </h1>
                <p className="text-xl text-white/70">
                  Contact information and integration preferences
                </p>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-left text-white/80 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={contactInfo.firstName}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-left text-white/80 mb-2">Last Name *</label>
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
                    <label className="block text-left text-white/80 mb-2">Business Name *</label>
                    <input
                      type="text"
                      value={contactInfo.businessName}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-left text-white/80 mb-2">Email Address *</label>
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

              {/* Integrations Section */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-bold">Integration Preferences (Optional)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {integrationOptions.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => toggleIntegration(integration.id)}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        integrations.includes(integration.id)
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                        integrations.includes(integration.id) ? 'bg-blue-500' : 'bg-white/10'
                      }`}>
                        {integration.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-white">{integration.label}</h3>
                      {integrations.includes(integration.id) && (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-white/50">
                  Please fill in all required fields to continue
                </div>
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    canProceedStep1
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

          {/* Step 2: Business Profile & Goals */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Business Profile & Goals
                </h1>
                <p className="text-xl text-white/70">
                  Tell us about your business and what content you want to create
                </p>
              </div>

              {/* Business Type Section */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-bold">Select Your Business Type</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedBusinessType(type.id)}
                      className={`p-6 rounded-xl border text-left transition-all duration-500 transform-gpu ${
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
              </div>

              {/* Content Goals Section */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-bold">What Content Do You Want to Create?</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentGoalOptions.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleContentGoal(goal.id)}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        contentGoals.includes(goal.id)
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                        contentGoals.includes(goal.id) ? 'bg-blue-500' : 'bg-white/10'
                      }`}>
                        {goal.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-white">{goal.label}</h3>
                      {contentGoals.includes(goal.id) && (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    canProceedStep2
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

          {/* Step 3: Current Practices */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Current Practices Assessment
                </h1>
                <p className="text-xl text-white/70">
                  Help us understand how you currently operate
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {questions.slice(0, 4).map((question, index) => (
                    <div key={question.id} className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold">{question.question}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleAnswer(question.id, option.value)}
                            className={`w-full p-3 rounded-lg border text-left transition-all duration-300 text-sm ${
                              answers[question.id] === option.value
                                ? 'bg-white/10 border-blue-500'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.label}</span>
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
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceedStep3}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    canProceedStep3
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

          {/* Step 4: Resources */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Your Resources
                </h1>
                <p className="text-xl text-white/70">
                  Tell us about your available time and budget
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {questions.slice(4, 6).map((question, index) => (
                    <div key={question.id} className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold">{question.question}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleAnswer(question.id, option.value)}
                            className={`w-full p-3 rounded-lg border text-left transition-all duration-300 text-sm ${
                              answers[question.id] === option.value
                                ? 'bg-white/10 border-blue-500'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option.label}</span>
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
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceedStep4}
                  className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    canProceedStep4
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

          {/* Step 5: Results & Plan Selection */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Your AI Readiness Score
                </h1>
                <p className="text-xl text-white/70">
                  Based on your assessment, here's your personalized recommendation
                </p>
              </div>
              
              {/* Score Display */}
              <div className={`${getRecommendation(calculateScore()).bgColor} ${getRecommendation(calculateScore()).borderColor} border-2 rounded-2xl p-8 text-center`}>
                <div className="text-6xl font-bold mb-4">
                  {calculateScore()}%
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${getRecommendation(calculateScore()).color}`}>
                  {getRecommendation(calculateScore()).level}
                </h2>
                <p className="text-lg text-white/80">
                  {getRecommendation(calculateScore()).message}
                </p>
                
                {/* Programmatic Analysis */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white/90">Your Readiness Analysis:</h3>
                  <div className="space-y-3">
                    {Object.entries(getCategoryScores()).map(([category, score]) => (
                      <div key={category} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <span className="text-white/70 capitalize">{category.replace(/-/g, ' ')}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                score >= 75 ? 'bg-green-500' :
                                score >= 50 ? 'bg-blue-500' :
                                score >= 25 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-white/60 text-sm w-12 text-right">{score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <h4 className="text-lg font-medium text-white/90 mb-2">Key Insights:</h4>
                    <ul className="space-y-2 text-white/70">
                      {generateInsights().map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  Choose Your Plan
                </h2>
                
                {/* Smart Recommendation Display */}
                {planRecommendation && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/50 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          AI-Powered Recommendation
                        </h3>
                        <p className="text-white/80 mb-3">
                          {planRecommendation.reason}
                        </p>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-white/70">
                            We've pre-selected the best plan for you based on your assessment
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer transform-gpu ${
                        selectedPlan === plan.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500 scale-105'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => setSelectedPlan(plan.id)}
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
                            <span className="text-white/80 text-sm">{feature}</span>
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
              </div>

              {submitError && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                  <AlertCircle className="h-5 w-5 inline mr-2" />
                  {submitError}
                </div>
              )}

              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
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
    </div>
  )
}