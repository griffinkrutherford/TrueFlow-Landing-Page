/**
 * TrueFlow AI Readiness Assessment Page
 * Interactive assessment to help businesses determine their AI readiness
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
  Sparkles,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Globe,
  Layers,
  Menu,
  X
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

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  businessName?: string
}

export default function ReadinessAssessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
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

  useEffect(() => {
    setMounted(true)
    
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

  const handleNext = () => {
    console.log('handleNext called:', { currentStep, totalQuestions: questions.length })
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
      console.log('Moving to next question:', currentStep + 1)
    } else {
      console.log('Last question reached, showing contact form')
      setShowContactForm(true)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleContactSubmit called:', contactInfo)
    
    // Validate required fields
    if (!contactInfo.firstName.trim() || !contactInfo.lastName.trim() || !contactInfo.email.trim()) {
      console.log('Validation failed - missing required fields')
      setSubmitError('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const score = calculateScore()
      const recommendation = getRecommendation(score)

      // Send to GHL API
      const response = await fetch('/api/ghl/create-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...contactInfo,
          answers,
          score,
          recommendation: recommendation.recommendation,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.message || 'Failed to submit assessment')
      }

      // Show results after successful submission
      setShowResults(true)
      setShowContactForm(false)
    } catch (error) {
      console.error('Error submitting assessment:', error)
      setSubmitError('Failed to submit assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrevious = () => {
    console.log('handlePrevious called:', { currentStep })
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      console.log('Moving to previous question:', currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / questions.length) * 100

  // Reusable header component matching homepage
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors text-lg">Home</Link>
            <Link href="/content-engine" className="text-white/70 hover:text-white transition-colors text-lg">Content Engine</Link>
            <Link href="/#features" className="text-white/70 hover:text-white transition-colors text-lg">Features</Link>
            <Link href="/#how-it-works" className="text-white/70 hover:text-white transition-colors text-lg">How it Works</Link>
            <Link href="/#testimonials" className="text-white/70 hover:text-white transition-colors text-lg">Success Stories</Link>
            <Link href="/faq" className="text-white/70 hover:text-white transition-colors text-lg">FAQs</Link>
            <Link href="/readiness-assessment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold">
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
            <Link href="/" className="block text-white/70 hover:text-white transition-colors text-lg">Home</Link>
            <Link href="/content-engine" className="block text-white/70 hover:text-white transition-colors text-lg">Content Engine</Link>
            <Link href="/#features" className="block text-white/70 hover:text-white transition-colors text-lg">Features</Link>
            <Link href="/#how-it-works" className="block text-white/70 hover:text-white transition-colors text-lg">How it Works</Link>
            <Link href="/#testimonials" className="block text-white/70 hover:text-white transition-colors text-lg">Success Stories</Link>
            <Link href="/faq" className="block text-white/70 hover:text-white transition-colors text-lg">FAQs</Link>
            <Link href="/readiness-assessment" className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold text-center">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )

  // Contact Form UI
  if (showContactForm && !showResults) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Navigation - matching homepage exactly */}
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-white/70 hover:text-white transition-colors text-lg">Home</Link>
                <Link href="/content-engine" className="text-white/70 hover:text-white transition-colors text-lg">Content Engine</Link>
                <Link href="/#features" className="text-white/70 hover:text-white transition-colors text-lg">Features</Link>
                <Link href="/#how-it-works" className="text-white/70 hover:text-white transition-colors text-lg">How it Works</Link>
                <Link href="/#testimonials" className="text-white/70 hover:text-white transition-colors text-lg">Success Stories</Link>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors text-lg">FAQs</Link>
                <Link href="/readiness-assessment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold">
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
                <Link href="/" className="block text-white/70 hover:text-white transition-colors text-lg">Home</Link>
                <Link href="/content-engine" className="block text-white/70 hover:text-white transition-colors text-lg">Content Engine</Link>
                <Link href="/#features" className="block text-white/70 hover:text-white transition-colors text-lg">Features</Link>
                <Link href="/#how-it-works" className="block text-white/70 hover:text-white transition-colors text-lg">How it Works</Link>
                <Link href="/#testimonials" className="block text-white/70 hover:text-white transition-colors text-lg">Success Stories</Link>
                <Link href="/faq" className="block text-white/70 hover:text-white transition-colors text-lg">FAQs</Link>
                <Link href="/readiness-assessment" className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity text-lg font-semibold text-center">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </nav>

        <main className="pt-48 pb-20 px-4 relative">
          {/* Floating Particles - matching get-started page */}
          {mounted && [...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 20}s`
              }}
            />
          ))}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Almost There!
              </h2>
              <p className="text-xl text-white/70">
                Enter your information to see your personalized AI readiness score and recommendations
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="bg-white/5 rounded-2xl p-8 border border-white/10 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={contactInfo.firstName}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={contactInfo.lastName}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 555-5555"
                />
              </div>

              <div className="mb-8">
                <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                  Business Name (Optional)
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={contactInfo.businessName}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Acme Corp"
                />
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                  <AlertCircle className="h-5 w-5 inline mr-2" />
                  {submitError}
                </div>
              )}

              <div className="flex justify-between relative z-20">
                <button
                  type="button"
                  onClick={() => {
                    setShowContactForm(false)
                    setCurrentStep(questions.length - 1)
                  }}
                  className="flex items-center px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-8 py-3 rounded-full transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      See My Results
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const recommendation = getRecommendation(score)

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        {renderHeader()}

        <main className="pt-48 pb-20 px-4 relative">
          {/* Floating Particles - matching get-started page */}
          {mounted && [...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 20}s`
              }}
            />
          ))}
          <div className="max-w-3xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your AI Readiness Results
              </h1>
              <p className="text-xl text-white/70">
                Based on your responses, here's your personalized recommendation
              </p>
            </div>

            {/* Score Display */}
            <div className={`${recommendation.bgColor} ${recommendation.borderColor} border-2 rounded-2xl p-8 mb-8`}>
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                  {score}%
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${recommendation.color}`}>
                  {recommendation.level}
                </h2>
                <p className="text-lg text-white/80">
                  {recommendation.message}
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white/5 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                Recommended Plan: {recommendation.recommendation}
              </h3>
              
              {recommendation.recommendation === 'Complete System' ? (
                <div className="space-y-4">
                  <p className="text-white/80">
                    The Complete System includes everything you need to transform your business:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>AI Content Engine for automated content creation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>Full CRM with lead management and automation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>Customer support automation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>Analytics and insights dashboard</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/80">
                    Start with our Content Engine to automate your content creation:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>Voice-to-content transformation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>Multi-channel content distribution</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>SEO optimization and insights</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mt-0.5 mr-2 text-green-500" />
                      <span>Content performance analytics</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-20">
              <Link 
                href="/get-started"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 text-center"
              >
                Get Started with TrueFlow
              </Link>
              <button
                onClick={() => {
                  setShowResults(false)
                  setCurrentStep(0)
                  setAnswers({})
                }}
                className="flex-1 bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const isAnswered = answers[currentQuestion.id] !== undefined

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      {renderHeader()}

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-white/60">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm text-white/60">
                {currentQuestion.category}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-4 relative z-20">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left relative z-20 ${
                    answers[currentQuestion.id] === option.value
                      ? 'bg-white/10 border-blue-500'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {answers[currentQuestion.id] === option.value && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between relative z-20">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                isAnswered
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? 'Continue' : 'Next'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </main>
      <DebugComponent 
        currentStep={currentStep}
        answers={answers}
        showResults={showResults}
        showContactForm={showContactForm}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  )
}