/**
 * TrueFlow AI Content Engine Offer Page
 * Hidden secondary landing page for ad campaigns
 * Follows homepage design language with Apple-inspired dark theme
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ChevronRight,
  Sparkles,
  Brain,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  FileText,
  Mail,
  Calendar,
  Zap,
  Star,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'

// Animated counter component
function AnimatedCounter({ endValue, duration = 2000, prefix = '', suffix = '', shouldStart = false }: {
  endValue: number
  duration?: number
  prefix?: string
  suffix?: string
  shouldStart?: boolean
}) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!shouldStart) return
    
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(endValue * easeOutQuart)
      
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [endValue, duration, shouldStart])
  
  return <>{prefix}{count}{suffix}</>
}

export default function ContentOfferLanding() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    // Observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <Image 
                src="/true-flow-logo.webp" 
                alt="TrueFlow" 
                width={280} 
                height={70} 
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
                priority
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                FAQ
              </Link>
              <Link 
                href="/get-started" 
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <Link 
                href="/" 
                className="block text-white/70 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/faq" 
                className="block text-white/70 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/get-started" 
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-white/70">Join 2,847+ entrepreneurs who've automated their content</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Get 52 SEO Blog Posts +
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              260 Newsletter Drafts This Year
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12">
            Without writing a single word. Save 20+ hours per week. 
            Turn content into $50K+ in new business annually.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/get-started" 
              className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 flex items-center gap-2"
            >
              Get My Free Content Engine
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#how-it-works" 
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
            >
              See How It Works
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              30-day money-back guarantee
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Setup in 5 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Spending $2,000+/month on content that isn't working?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              87% of entrepreneurs waste 20+ hours weekly on content that generates zero ROI. Here's why:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                emoji: "💸",
                title: "Expensive Freelance Writers",
                description: "Paying $500+ per blog post for content that doesn't sound like you and takes weeks to get right."
              },
              {
                icon: <Clock className="h-8 w-8" />,
                emoji: "⏰",
                title: "Content Creation Burnout", 
                description: "Spending 6+ hours every week writing instead of selling, strategizing, or growing your business."
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                emoji: "📉",
                title: "Zero Search Rankings",
                description: "Your blog posts aren't ranking on Google. Competitors steal your customers while you create into the void."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-8 bg-black/60 backdrop-blur-xl border border-red-500/20 rounded-2xl hover:bg-black/80 hover:border-red-500/40 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-semibold mb-2 text-red-400">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                TrueFlow Content Engine
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              AI-Powered Content Creation That Never Stops
            </p>
          </div>

          {/* Stats Section */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                <AnimatedCounter endValue={52} shouldStart={statsVisible} />
              </div>
              <p className="text-white/70 mt-2">Blog Posts/Year</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                <AnimatedCounter endValue={260} shouldStart={statsVisible} />
              </div>
              <p className="text-white/70 mt-2">Newsletters/Year</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                <AnimatedCounter endValue={100} shouldStart={statsVisible} suffix="%" />
              </div>
              <p className="text-white/70 mt-2">SEO Optimized</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                <AnimatedCounter endValue={20} shouldStart={statsVisible} suffix="h" />
              </div>
              <p className="text-white/70 mt-2">Saved Weekly</p>
            </div>
          </div>

          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: "1",
                title: "Connect Your Site",
                description: "Link your website and upload writing samples to train your voice.",
                icon: <Brain className="h-6 w-6" />
              },
              {
                step: "2",
                title: "Set Your Topics",
                description: "Choose your industry focus and content themes for blogs and newsletters.",
                icon: <Target className="h-6 w-6" />
              },
              {
                step: "3",
                title: "Content Flows",
                description: "Blogs publish weekly to your site. Newsletter drafts arrive in your inbox daily.",
                icon: <Zap className="h-6 w-6" />
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold">
                  {item.step}
                </div>
                <div className="mb-4 text-cyan-400">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-8 text-center">What's Included in Your Free Trial</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: <FileText />, title: "Weekly Blog Publishing", desc: "SEO-optimized posts published directly to your site" },
                { icon: <Mail />, title: "Daily Newsletter Drafts", desc: "Monday-Friday drafts delivered to your inbox" },
                { icon: <BarChart3 />, title: "SEO Optimization", desc: "Keywords, meta descriptions, and proper structure" },
                { icon: <Sparkles />, title: "Voice Matching", desc: "AI learns and writes in your unique style" },
                { icon: <Calendar />, title: "Content Calendar", desc: "Plan and schedule content months ahead" },
                { icon: <CheckCircle />, title: "Full Automation", desc: "Set once and forget - runs on autopilot" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-cyan-400 mt-1">{feature.icon}</div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-white/70">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Real Results From Real Entrepreneurs
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 text-white/90">
                "TrueFlow generated 847 qualified leads in 90 days from our automated blog posts. 
                I went from spending 20 hours/week on content to zero. My traffic increased 312% 
                and we closed $47K in new business directly from blog leads."
              </p>
              <div>
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-sm text-white/70">Marketing Consultant, $2M Agency</p>
              </div>
            </div>

            <div className="p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg mb-6 text-white/90">
                "In 6 months, TrueFlow published 180 blog posts that rank on page 1 for our 
                target keywords. We saved $36K in freelance costs and our organic traffic is 
                up 400%. Best ROI investment we've ever made."
              </p>
              <div>
                <p className="font-semibold">Marcus Rodriguez</p>
                <p className="text-sm text-white/70">CEO, TechStart Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                Get 52 Blog Posts + 260 Newsletters This Year
              </span>
            </h2>
            <p className="text-lg text-white/70">Limited to 50 new users this month • 47 spots remaining</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-cyan-500/20">
            {/* Bonus banner */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-full inline-block mb-8 font-bold">
              🎁 FREE BONUS: Content Strategy Audit (Worth $497)
            </div>

            <h3 className="text-3xl font-bold mb-4">14-Day Free Trial + Bonuses</h3>
            
            <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              $0
            </div>
            <p className="text-white/70 mb-8">for 14 days • then $150/week • Cancel anytime</p>

            {/* Guarantee badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                ✓ 30-Day Money-Back Guarantee
              </span>
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                ✓ No Setup Fees
              </span>
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                ✓ No Contracts
              </span>
            </div>

            {/* CTA */}
            <Link 
              href="/get-started" 
              className="block w-full text-center px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 group"
            >
              Start Getting Weekly Blogs + Daily Newsletters
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-center text-white/50 text-sm mt-4">
              🔒 Your information is 100% secure and private
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How are blog posts published to my website?",
                a: "We integrate directly with your WordPress, Webflow, or other CMS. Blogs are published automatically with proper SEO optimization and formatting."
              },
              {
                q: "Are newsletter drafts automatically sent to subscribers?",
                a: "No, newsletters are drafted and sent to your email for review. You have full control over when and what gets sent to your subscribers."
              },
              {
                q: "How is the content SEO optimized?",
                a: "Every blog post includes targeted keywords, meta descriptions, proper heading structure, and internal linking to boost your search rankings."
              },
              {
                q: "Can I control what topics are covered?",
                a: "Yes! You set your industry focus, target audience, and content themes. TrueFlow creates content within your specified parameters."
              }
            ].map((item, index) => (
              <div key={index} className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                <p className="text-white/70">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/faq" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              See More FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Don't Let Your Competitors Steal Your Traffic Another Day
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/70 mb-8">
            Join 2,847+ entrepreneurs getting weekly blogs + daily newsletters automatically. 
            Limited spots remaining.
          </p>

          <Link 
            href="/get-started" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 group"
          >
            Start My Free Content Engine
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              47 spots left this month
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Image 
                src="/true-flow-logo.webp" 
                alt="TrueFlow" 
                width={140} 
                height={35} 
                className="h-8 w-auto opacity-70"
              />
              <span className="text-white/50 text-sm">© 2024 TrueFlow AI</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-white/50 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/faq" className="text-white/50 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}