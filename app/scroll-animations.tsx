'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

// Custom hook for intersection observer
export function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
      if (entry.isIntersecting) {
        setHasBeenInView(true)
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
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

  return { ref, isInView, hasBeenInView }
}

// Animation wrapper components
interface AnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeInUp({ children, delay = 0, duration = 0.8, className = '' }: AnimationProps) {
  const { ref, hasBeenInView } = useInView()
  
  return (
    <div
      ref={ref}
      className={`${className} ${hasBeenInView ? 'animate-in' : 'opacity-0'}`}
      style={{
        transform: hasBeenInView ? 'translateY(0)' : 'translateY(40px)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
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
        transform: hasBeenInView ? 'translateX(0)' : 'translateX(-100px)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
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
        transform: hasBeenInView ? 'scale(1)' : 'scale(0.8)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
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
        transform: hasBeenInView ? 'rotate(0deg) scale(1)' : 'rotate(-10deg) scale(0.9)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
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
        transform: hasBeenInView ? 'rotateY(0deg)' : 'rotateY(90deg)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
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
        transform: hasBeenInView ? 'scale(1)' : 'scale(0)',
        opacity: hasBeenInView ? 1 : 0,
        transition: `all ${duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
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
  animation?: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn' | 'flipIn' | 'zoomIn'
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
  }[animation]

  return (
    <>
      {children.map((child, index) => (
        <AnimationComponent key={index} delay={delay + index * staggerDelay}>
          {child}
        </AnimationComponent>
      ))}
    </>
  )
}

// Parallax scroll effect
export function ParallaxScroll({ children, speed = 0.5, className = '' }: AnimationProps & { speed?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.scrollY
        const rate = scrolled * -speed
        setOffset(rate)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s linear',
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