'use client'

import React, { useEffect, useRef, useState, ReactNode } from 'react'

// Custom hook for intersection observer with scroll progress
export function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
      if (entry.isIntersecting) {
        setHasBeenInView(true)
        setScrollProgress(entry.intersectionRatio)
      }
    }, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px 0px -50px 0px',
      ...options
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options])

  return { ref, isInView, hasBeenInView, scrollProgress }
}

// Animation wrapper components
interface AnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeInUp({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView, scrollProgress } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView 
          ? `translateY(0) translateZ(0)`
          : `translateY(60px) translateZ(-50px)`,
        opacity: hasBeenInView ? 1 : 0,
        filter: hasBeenInView ? 'blur(0px)' : 'blur(2px)',
        transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  )
}

export function SlideInLeft({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView 
          ? 'translateX(0) rotateY(0deg) scale(1)' 
          : 'translateX(-120px) rotateY(25deg) scale(0.9)',
        opacity: hasBeenInView ? 1 : 0,
        transformOrigin: 'right center',
        perspective: '1000px',
        transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

export function SlideInRight({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView ? 'translateX(0)' : 'translateX(100px)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export function ScaleIn({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView 
          ? 'scale(1) rotate(0deg)' 
          : 'scale(0.7) rotate(-5deg)',
        opacity: hasBeenInView ? 1 : 0,
        filter: hasBeenInView ? 'brightness(1)' : 'brightness(0.8)',
        transition: `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${delay}s`,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  )
}

export function RotateIn({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView 
          ? 'rotate(0deg) scale(1) translateZ(0)' 
          : 'rotate(-180deg) scale(0.5) translateZ(-100px)',
        opacity: hasBeenInView ? 1 : 0,
        transformStyle: 'preserve-3d',
        transition: `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${delay}s`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

export function FlipIn({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView 
          ? 'rotateY(0deg) rotateX(0deg) scale(1)' 
          : 'rotateY(180deg) rotateX(10deg) scale(0.8)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

export function ZoomIn({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView 
          ? 'scale(1) translateZ(0)' 
          : 'scale(0.3) translateZ(-200px)',
        opacity: hasBeenInView ? 1 : 0,
        filter: hasBeenInView ? 'blur(0px) brightness(1)' : 'blur(5px) brightness(0.7)',
        transition: `all ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  )
}

// Staggered animation for groups
interface StaggeredAnimationProps {
  children: ReactNode[]
  delay?: number
  staggerDelay?: number
  animation?: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn' | 'flipIn' | 'zoomIn' | 'blurIn' | 'morphIn' | 'glitchIn' | 'waveIn' | 'card3D'
}

export function StaggeredAnimation({ 
  children, 
  delay = 0, 
  staggerDelay = 0.1,
  animation = 'fadeInUp' 
}: StaggeredAnimationProps) {
  const AnimationComponent = {
    fadeInUp: FadeInUp,
    slideInLeft: SlideInLeft,
    slideInRight: SlideInRight,
    scaleIn: ScaleIn,
    rotateIn: RotateIn,
    flipIn: FlipIn,
    zoomIn: ZoomIn,
    blurIn: BlurIn,
    morphIn: MorphIn,
    glitchIn: GlitchIn,
    waveIn: WaveIn,
    card3D: Card3D,
  }[animation]

  const childrenArray = React.Children.toArray(children)

  return (
    <>
      {childrenArray.map((child, index) => (
        <AnimationComponent key={index} delay={delay + index * staggerDelay}>
          {child}
        </AnimationComponent>
      ))}
    </>
  )
}

// Enhanced Parallax scroll effect with rotation and scale
export function ParallaxScroll({ 
  children, 
  speed = 0.5, 
  rotateSpeed = 0.1,
  scaleSpeed = 0.001,
  className = '' 
}: AnimationProps & { speed?: number; rotateSpeed?: number; scaleSpeed?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ y: 0, rotate: 0, scale: 1 })

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.scrollY
        const viewportHeight = window.innerHeight
        const elementTop = rect.top + scrolled
        const elementCenter = elementTop + rect.height / 2
        const windowCenter = scrolled + viewportHeight / 2
        const distance = windowCenter - elementCenter
        
        setTransform({
          y: distance * speed * 0.5,
          rotate: distance * rotateSpeed * 0.1,
          scale: 1 + Math.abs(distance) * scaleSpeed * 0.001,
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, rotateSpeed, scaleSpeed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${transform.y}px) rotate(${transform.rotate}deg) scale(${transform.scale})`,
        transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

// Text reveal animation
export function TextReveal({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const { ref, hasBeenInView } = useInView()
  const words = text.split(' ')

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden"
          style={{ marginRight: '0.25em' }}
        >
          <span
            className="inline-block"
            style={{
              transform: hasBeenInView ? 'translateY(0)' : 'translateY(100%)',
              opacity: hasBeenInView ? 1 : 0,
              transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay + index * 0.05}s`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  )
}

// Blur in animation
export function BlurIn({ children, delay = 0, duration = 1, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        filter: hasBeenInView ? 'blur(0px)' : 'blur(10px)',
        opacity: hasBeenInView ? 1 : 0,
        transform: hasBeenInView ? 'scale(1)' : 'scale(1.1)',
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// Morph animation - element morphs from one shape to another
export function MorphIn({ children, delay = 0, duration = 1.2, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        clipPath: hasBeenInView 
          ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' 
          : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        transform: hasBeenInView 
          ? 'rotate(0deg) scale(1)' 
          : 'rotate(180deg) scale(0.5)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s`,
        willChange: 'clip-path, transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

// Glitch effect animation
export function GlitchIn({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  const [glitchActive, setGlitchActive] = useState(false)
  
  useEffect(() => {
    if (hasBeenInView && !glitchActive) {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), duration * 1000)
    }
  }, [hasBeenInView, duration, glitchActive])
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        opacity: hasBeenInView ? 1 : 0,
        transform: glitchActive 
          ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)` 
          : 'translate(0, 0)',
        filter: glitchActive 
          ? `hue-rotate(${Math.random() * 360}deg) saturate(${Math.random() * 2 + 1})` 
          : 'none',
        transition: `opacity ${duration}s ease ${delay}s, transform 0.1s ease, filter 0.1s ease`,
      }}
    >
      {children}
    </div>
  )
}

// Wave animation - ripple effect
export function WaveIn({ children, delay = 0, duration = 1.5, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        opacity: hasBeenInView ? 1 : 0,
        transform: hasBeenInView 
          ? 'translateY(0) scale(1)' 
          : 'translateY(50px) scale(0.95)',
        animation: hasBeenInView 
          ? `wave ${duration}s ease-out ${delay}s forwards` 
          : 'none',
        willChange: 'transform, opacity',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateY(50px) scale(0.95); }
          50% { transform: translateY(-10px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

// 3D Card flip with content change
export function Card3D({ children, delay = 0, duration = 1, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView 
          ? 'perspective(1000px) rotateX(0deg) rotateY(0deg)' 
          : 'perspective(1000px) rotateX(-30deg) rotateY(45deg)',
        opacity: hasBeenInView ? 1 : 0,
        transformStyle: 'preserve-3d',
        transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        boxShadow: hasBeenInView 
          ? '0 10px 40px rgba(0,0,0,0.1)' 
          : '0 5px 20px rgba(0,0,0,0.05)',
        willChange: 'transform, opacity, box-shadow',
      }}
    >
      {children}
    </div>
  )
}

// Magnetic hover effect
export function MagneticHover({ children, strength = 0.3, className = '' }: AnimationProps & { strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setTransform({ x, y })
  }
  
  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 })
  }
  
  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

// Spotlight follow animation
export function SpotlightReveal({ children, delay = 0, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{
          opacity: hasBeenInView ? 1 : 0,
          transition: `opacity 0.8s ease ${delay}s`,
          background: hasBeenInView 
            ? `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.4) 100%)` 
            : 'rgba(0,0,0,0.8)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Progressive blur animation based on scroll
export function ProgressiveBlur({ children, maxBlur = 10, className = '' }: AnimationProps & { maxBlur?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [blur, setBlur] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight))
        setBlur(maxBlur * (1 - progress))
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [maxBlur])
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        filter: `blur(${blur}px)`,
        transform: `scale(${1 + blur * 0.01})`,
        transition: 'filter 0.3s ease, transform 0.3s ease',
        willChange: 'filter, transform',
      }}
    >
      {children}
    </div>
  )
}

// Scroll-triggered counter animation
export function CountUp({ 
  end, 
  duration = 2, 
  prefix = '', 
  suffix = '', 
  className = '' 
}: { end: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const { ref, hasBeenInView } = useInView()
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (hasBeenInView) {
      const startTime = Date.now()
      const endTime = startTime + duration * 1000
      
      const updateCount = () => {
        const now = Date.now()
        const progress = Math.min(1, (now - startTime) / (duration * 1000))
        const currentCount = Math.floor(end * progress)
        setCount(currentCount)
        
        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }
      
      requestAnimationFrame(updateCount)
    }
  }, [hasBeenInView, end, duration])
  
  return (
    <div ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

// Split text animation with individual character control
export function SplitText({ 
  text, 
  delay = 0, 
  staggerDelay = 0.03, 
  className = '' 
}: { text: string; delay?: number; staggerDelay?: number; className?: string }) {
  const { ref, hasBeenInView } = useInView()
  const characters = text.split('')
  
  return (
    <div ref={ref} className={className}>
      {characters.map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            transform: hasBeenInView 
              ? 'translateY(0) rotateZ(0deg)' 
              : 'translateY(50px) rotateZ(180deg)',
            opacity: hasBeenInView ? 1 : 0,
            transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay + index * staggerDelay}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}

// Scroll progress indicator
function ScrollProgressInternal({ height = 4, color = '#007AFF', className = '' }: { height?: number; color?: string; className?: string }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalHeight) * 100
      setProgress(currentProgress)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div
      className={`fixed top-0 left-0 z-50 ${className}`}
      style={{
        width: `${progress}%`,
        height: `${height}px`,
        background: color,
        transition: 'width 0.1s ease-out',
        transformOrigin: 'left',
        boxShadow: `0 0 10px ${color}40`,
      }}
    />
  )
}