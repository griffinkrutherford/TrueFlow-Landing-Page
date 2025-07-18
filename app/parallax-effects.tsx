'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from 'framer-motion';

// ========== 1. MultiLayerParallax ==========
interface MultiLayerParallaxProps {
  layers: {
    content: ReactNode;
    speed: number;
    offset?: number;
  }[];
  className?: string;
}

export const MultiLayerParallax: React.FC<MultiLayerParallaxProps> = ({ layers, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {layers.map((layer, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [layer.offset || 0, -100 * layer.speed]
        );
        const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

        return (
          <motion.div
            key={index}
            style={{ y: smoothY }}
            className="absolute inset-0 will-change-transform"
          >
            {layer.content}
          </motion.div>
        );
      })}
    </div>
  );
};

// ========== 2. ParallaxText ==========
interface ParallaxTextProps {
  children: string;
  baseVelocity?: number;
  className?: string;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({ 
  children, 
  baseVelocity = 5,
  className = '' 
}) => {
  const baseX = useSpring(0, { stiffness: 100, damping: 30 });
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  useEffect(() => {
    let lastTime = 0;
    let lastScrollY = 0;

    const updatePosition = (time: number) => {
      if (lastTime) {
        const delta = time - lastTime;
        const scrollDelta = window.scrollY - lastScrollY;
        
        baseX.set(baseX.get() + (scrollDelta * baseVelocity * 0.05));
        
        if (baseX.get() < -100) {
          baseX.set(0);
        } else if (baseX.get() > 0) {
          baseX.set(-100);
        }
      }
      
      lastTime = time;
      lastScrollY = window.scrollY;
      requestAnimationFrame(updatePosition);
    };

    const rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [baseX, baseVelocity]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        <span className="block pr-8">{children}</span>
        <span className="block pr-8">{children}</span>
        <span className="block pr-8">{children}</span>
        <span className="block pr-8">{children}</span>
      </motion.div>
    </div>
  );
};

// ========== 3. ScrollProgress ==========
interface ScrollProgressProps {
  height?: number;
  color?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ 
  height = 4,
  color = 'bg-blue-600',
  showPercentage = false,
  className = ''
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className={`relative h-[${height}px] bg-gray-200`}>
        <motion.div
          className={`absolute inset-y-0 left-0 ${color}`}
          style={{ scaleX, transformOrigin: '0%' }}
        />
      </div>
      {showPercentage && (
        <motion.div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-sm font-medium">
          {percentage.get().toFixed(0)}%
        </motion.div>
      )}
    </div>
  );
};

// ========== 4. ScrollSnapSection ==========
interface ScrollSnapSectionProps {
  children: ReactNode[];
  className?: string;
}

export const ScrollSnapSection: React.FC<ScrollSnapSectionProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = container.children;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const { offsetTop } = section;
        
        if (scrollTop >= offsetTop - containerHeight / 2) {
          setActiveSection(i);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`h-screen overflow-y-scroll snap-y snap-mandatory ${className}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      {children.map((child, index) => (
        <div 
          key={index} 
          className="h-screen snap-start flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            initial={{ opacity: 0, rotateX: -30 }}
            animate={{ 
              opacity: activeSection === index ? 1 : 0.3,
              rotateX: activeSection === index ? 0 : -30
            }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            {child}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

// ========== 5. ParallaxImage ==========
interface ParallaxImageProps {
  src: string;
  alt: string;
  zoomRange?: [number, number];
  className?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({ 
  src, 
  alt,
  zoomRange = [1, 1.2],
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], zoomRange);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ scale: smoothScale, y: smoothY }}
        className="w-full h-full object-cover will-change-transform"
      />
    </div>
  );
};

// ========== 6. ScrollReveal3D ==========
interface ScrollReveal3DProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export const ScrollReveal3D: React.FC<ScrollReveal3DProps> = ({ 
  children, 
  direction = 'up',
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const rotationMap = {
    left: { rotateY: -90 },
    right: { rotateY: 90 },
    up: { rotateX: -90 },
    down: { rotateX: 90 }
  };

  return (
    <div 
      ref={ref} 
      className={`${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        initial={{ 
          opacity: 0, 
          ...rotationMap[direction],
          z: -100
        }}
        animate={isInView ? { 
          opacity: 1, 
          rotateX: 0, 
          rotateY: 0,
          z: 0
        } : {}}
        transition={{ 
          duration: 0.8, 
          ease: [0.6, -0.05, 0.01, 0.99] 
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

// ========== 7. StickyParallax ==========
interface StickyParallaxProps {
  background: ReactNode;
  foreground: ReactNode;
  className?: string;
}

export const StickyParallax: React.FC<StickyParallaxProps> = ({ 
  background, 
  foreground, 
  className = '' 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`relative h-[200vh] ${className}`}>
      <motion.div 
        style={{ y: smoothBackgroundY }}
        className="absolute inset-0 will-change-transform"
      >
        {background}
      </motion.div>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {foreground}
      </div>
    </div>
  );
};

// ========== 8. WaveScroll ==========
interface WaveScrollProps {
  children: ReactNode;
  amplitude?: number;
  frequency?: number;
  className?: string;
}

export const WaveScroll: React.FC<WaveScrollProps> = ({ 
  children, 
  amplitude = 20,
  frequency = 0.01,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const wave = useTransform(
    scrollY,
    (value) => Math.sin(value * frequency) * amplitude
  );
  
  const smoothWave = useSpring(wave, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ x: smoothWave }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ========== 9. DepthCards ==========
interface DepthCardsProps {
  cards: ReactNode[];
  spacing?: number;
  className?: string;
}

export const DepthCards: React.FC<DepthCardsProps> = ({ 
  cards, 
  spacing = 100,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {cards.map((card, index) => {
        const progress = useTransform(
          scrollYProgress,
          [index * 0.25, (index + 1) * 0.25],
          [0, 1]
        );
        
        const y = useTransform(progress, [0, 1], [index * spacing, 0]);
        const scale = useTransform(progress, [0, 1], [0.8, 1]);
        const opacity = useTransform(progress, [0, 0.5, 1], [0, 0.5, 1]);
        
        const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
        const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

        return (
          <motion.div
            key={index}
            style={{ 
              y: smoothY, 
              scale: smoothScale,
              opacity,
              zIndex: cards.length - index
            }}
            className="sticky top-20 will-change-transform"
          >
            <div style={{ perspective: '1000px' }}>
              {card}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ========== 10. ScrollTimeline ==========
interface TimelineItem {
  title: string;
  description: string;
  date: string;
}

interface ScrollTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const ScrollTimeline: React.FC<ScrollTimelineProps> = ({ items, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const smoothLineHeight = useSpring(lineHeight, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 -translate-x-1/2" />
      <motion.div 
        className="absolute left-1/2 top-0 w-0.5 bg-blue-600 -translate-x-1/2"
        style={{ height: smoothLineHeight }}
      />
      
      {items.map((item, index) => {
        const itemProgress = useTransform(
          scrollYProgress,
          [index / items.length, (index + 1) / items.length],
          [0, 1]
        );
        
        const opacity = useTransform(itemProgress, [0, 0.5], [0.3, 1]);
        const scale = useTransform(itemProgress, [0, 0.5], [0.8, 1]);
        const x = useTransform(
          itemProgress,
          [0, 0.5],
          [index % 2 === 0 ? -50 : 50, 0]
        );
        
        const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
        const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

        return (
          <motion.div
            key={index}
            style={{ opacity, scale: smoothScale, x: smoothX }}
            className={`relative flex items-center mb-32 ${
              index % 2 === 0 ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block p-6 bg-white rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </motion.div>
            </div>
            
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"
              style={{ scale: smoothScale }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// ========== Utility Hooks ==========
export const useScrollPercentage = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const updatePercentage = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percent = (scrolled / scrollHeight) * 100;
      setPercentage(Math.min(100, Math.max(0, percent)));
    };

    updatePercentage();
    window.addEventListener('scroll', updatePercentage, { passive: true });
    return () => window.removeEventListener('scroll', updatePercentage);
  }, []);

  return percentage;
};

export const useParallaxOffset = (speed: number = 0.5) => {
  const { scrollY } = useScroll();
  const offset = useTransform(scrollY, (value) => value * speed);
  return useSpring(offset, { stiffness: 100, damping: 30 });
};