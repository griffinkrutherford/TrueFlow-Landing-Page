/**
 * TrueFlow AI Readiness Assessment Page
 * Interactive assessment to help businesses determine their AI readiness
 */

'use client'

import { useState } from 'react'
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
  Layers
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

  const handleAnswer = (questionId: string, value: string) => {
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
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / questions.length) * 100

  if (showResults) {
    const score = calculateScore()
    const recommendation = getRecommendation(score)

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image 
                  src="/true-flow-logo-no-text.png" 
                  alt="TrueFlow AI Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold">TrueFlow AI</span>
            </Link>
          </nav>
        </header>

        <main className="pt-32 pb-20 px-4">
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
            <div className="flex flex-col sm:flex-row gap-4">
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
      <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <Image 
                src="/true-flow-logo-no-text.png" 
                alt="TrueFlow AI Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold">TrueFlow AI</span>
          </Link>
          
          <Link 
            href="/" 
            className="text-white/70 hover:text-white transition-colors flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </nav>
      </header>

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
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
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
          <div className="flex justify-between">
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
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}