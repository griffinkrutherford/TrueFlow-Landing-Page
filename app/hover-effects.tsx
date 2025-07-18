'use client';

import React, { useEffect, useRef, useState, MouseEvent, TouchEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// 1. MagneticButton - Follows cursor with magnetic effect
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className = '', strength = 0.5 }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || !isHovered) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;
    
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative transition-all ${className}`}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// 2. LiquidButton - Morphing blob/liquid effect
export const LiquidButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = '#3b82f6' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`relative px-8 py-4 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="liquid">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              result="noise"
              seed={isHovered ? 5 : 1}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isHovered ? 8 : 0}
            />
          </filter>
        </defs>
        <rect
          width="200"
          height="60"
          fill={color}
          filter="url(#liquid)"
          className="transition-all duration-300"
          rx={isHovered ? 30 : 10}
        />
      </svg>
      <span className="relative z-10 text-white font-medium">{children}</span>
    </button>
  );
};

// 3. TextScramble - Scrambles text on hover
export const TextScramble: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const intervalRef = useRef<NodeJS.Timeout>();

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const originalText = text;
    
    intervalRef.current = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      className={`cursor-pointer font-mono ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
};

// 4. RippleEffect - Material design ripple
export const RippleEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className = '', color = 'rgba(255, 255, 255, 0.5)' }) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: color,
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0 }}
            animate={{
              width: 300,
              height: 300,
              x: -150,
              y: -150,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// 5. GlowCard - Dynamic glow that follows cursor
export const GlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}> = ({ children, className = '', glowColor = '#3b82f6' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}22, transparent 40%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 0.5 : 0,
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}44, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// 6. TiltCard - Advanced 3D tilt based on mouse position
export const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}> = ({ children, className = '', maxTilt = 20 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      ref={ref}
      className={`transition-transform duration-200 ease-out transform-gpu ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// 7. BorderBeam - Animated border that travels around element
export const BorderBeam: React.FC<{
  children: React.ReactNode;
  className?: string;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}> = ({ 
  children, 
  className = '', 
  duration = 3,
  borderWidth = 2,
  colorFrom = '#3b82f6',
  colorTo = '#8b5cf6'
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            padding: borderWidth,
            background: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
            backgroundSize: '200% 100%',
            animation: `beam ${duration}s linear infinite`,
          }}
        >
          <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg" />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        @keyframes beam {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

// 8. ShimmerButton - Shimmer effect that passes through
export const ShimmerButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
}> = ({ children, className = '', shimmerColor = 'rgba(255, 255, 255, 0.5)' }) => {
  return (
    <button
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${shimmerColor} 50%, transparent 60%)`,
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </button>
  );
};

// 9. MorphingSVG - SVG icons that morph on hover
export const MorphingSVG: React.FC<{
  defaultPath: string;
  hoverPath: string;
  className?: string;
  size?: number;
}> = ({ defaultPath, hoverPath, className = '', size = 24 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.path
        d={isHovered ? hoverPath : defaultPath}
        fill="currentColor"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </svg>
  );
};

// 10. ElasticButton - Elastic/jelly physics on hover
export const ElasticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, {
    stiffness: 300,
    damping: 10,
  });

  return (
    <motion.button
      className={`relative ${className}`}
      style={{ scale: scaleSpring }}
      onMouseEnter={() => scale.set(1.2)}
      onMouseLeave={() => scale.set(1)}
      onMouseDown={() => scale.set(0.9)}
      onMouseUp={() => scale.set(1.2)}
    >
      {children}
    </motion.button>
  );
};

// Export all components
export default {
  MagneticButton,
  LiquidButton,
  TextScramble,
  RippleEffect,
  GlowCard,
  TiltCard,
  BorderBeam,
  ShimmerButton,
  MorphingSVG,
  ElasticButton,
};