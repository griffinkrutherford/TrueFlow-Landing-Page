'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

// Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
}

export interface NumberAnimationProps extends AnimationConfig {
  from?: number;
  to: number;
  className?: string;
  onComplete?: () => void;
  formatValue?: (value: number) => string;
}

export interface ParticleConfig {
  count?: number;
  colors?: string[];
  size?: number;
  spread?: number;
  gravity?: number;
  fadeOut?: boolean;
}

// Easing functions
export type EasingFunction = (t: number) => number;

export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

// Utility functions
const formatNumber = (
  value: number,
  decimals: number = 0,
  separator: string = ','
): string => {
  const parts = value.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
};

const useAnimation = (
  from: number,
  to: number,
  duration: number,
  easing: EasingFunction,
  onComplete?: () => void
) => {
  const [value, setValue] = useState(from);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const animate = useCallback(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    const elapsed = performance.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = from + (to - from) * easedProgress;

    setValue(currentValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  }, [from, to, duration, easing, onComplete]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return value;
};

// OdometerNumber Component
export const OdometerNumber: React.FC<NumberAnimationProps> = ({
  from = 0,
  to,
  duration = 2000,
  delay = 0,
  easing = easings.easeOutCubic,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  onComplete,
  formatValue
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(from);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const animatedValue = useAnimation(
    from,
    to,
    isAnimating ? duration : 0,
    easing,
    onComplete
  );

  useEffect(() => {
    setDisplayValue(isAnimating ? animatedValue : from);
  }, [animatedValue, from, isAnimating]);

  const formattedValue = formatValue
    ? formatValue(displayValue)
    : formatNumber(displayValue, decimals, separator);

  const digits = formattedValue.split('');

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center ${className}`}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix && <span className="odometer-prefix">{prefix}</span>}
      <div className="relative inline-flex overflow-hidden">
        {digits.map((digit, index) => {
          const isNumber = !isNaN(parseInt(digit));
          const digitValue = isNumber ? parseInt(digit) : digit;
          const translateY = isNumber
            ? -(digitValue as number) * 100
            : 0;

          return (
            <div
              key={`${index}-${digit}`}
              className="relative inline-block"
              style={{
                height: '1em',
                overflow: 'hidden'
              }}
            >
              {isNumber ? (
                <div
                  className="flex flex-col transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateY(${translateY}%)`
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <div key={num} className="h-full flex items-center">
                      {num}
                    </div>
                  ))}
                </div>
              ) : (
                <span>{digit}</span>
              )}
            </div>
          );
        })}
      </div>
      {suffix && <span className="odometer-suffix">{suffix}</span>}
    </div>
  );
};

// CountUpOnScroll Component
export const CountUpOnScroll: React.FC<
  NumberAnimationProps & {
    threshold?: number;
    triggerOnce?: boolean;
  }
> = ({
  threshold = 0.5,
  triggerOnce = true,
  ...props
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce
  });

  const shouldAnimate = inView && (!triggerOnce || !hasAnimated);

  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [shouldAnimate, hasAnimated]);

  return (
    <div ref={ref}>
      <OdometerNumber
        {...props}
        from={shouldAnimate ? props.from : props.from || 0}
        to={shouldAnimate ? props.to : props.from || 0}
        onComplete={() => {
          props.onComplete?.();
        }}
      />
    </div>
  );
};

// MorphingNumber Component
export const MorphingNumber: React.FC<NumberAnimationProps> = ({
  from = 0,
  to,
  duration = 2000,
  delay = 0,
  easing = easings.easeInOutCubic,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  onComplete,
  formatValue
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const animatedValue = useAnimation(
    from,
    to,
    isAnimating ? duration : 0,
    easing,
    onComplete
  );

  const formattedValue = formatValue
    ? formatValue(animatedValue)
    : formatNumber(animatedValue, decimals, separator);

  // SVG paths for digits 0-9
  const digitPaths = useMemo(() => ({
    '0': 'M50,10 C70,10 90,30 90,50 L90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 L10,50 C10,30 30,10 50,10 Z',
    '1': 'M30,20 L50,10 L50,90 M30,90 L70,90',
    '2': 'M30,30 C30,20 40,10 50,10 C60,10 70,20 70,30 C70,40 60,50 50,50 L30,90 L70,90',
    '3': 'M30,20 L50,10 L70,20 L50,50 L70,80 L50,90 L30,80',
    '4': 'M60,90 L60,10 L10,60 L90,60',
    '5': 'M70,10 L30,10 L30,50 L50,40 C60,40 70,50 70,60 C70,70 60,80 50,80 C40,80 30,70 30,60',
    '6': 'M70,30 C70,20 60,10 50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 C70,90 90,70 90,50 C90,30 70,10 50,10',
    '7': 'M10,10 L90,10 L50,90',
    '8': 'M50,10 C70,10 90,20 90,35 C90,50 70,50 50,50 C30,50 10,50 10,35 C10,20 30,10 50,10 Z M50,50 C70,50 90,60 90,75 C90,90 70,90 50,90 C30,90 10,90 10,75 C10,60 30,50 50,50 Z',
    '9': 'M50,90 C70,90 90,70 90,50 C90,30 70,10 50,10 C30,10 10,30 10,50 C10,70 30,90 50,90 L50,10'
  }), []);

  return (
    <div className={`inline-flex items-center ${className}`}>
      {prefix && <span>{prefix}</span>}
      <div className="relative inline-flex">
        {formattedValue.split('').map((char, index) => {
          const isDigit = !isNaN(parseInt(char));
          
          if (!isDigit) {
            return <span key={index}>{char}</span>;
          }

          return (
            <svg
              key={index}
              width="1em"
              height="1em"
              viewBox="0 0 100 100"
              className="inline-block"
              style={{ overflow: 'visible' }}
            >
              <path
                ref={pathRef}
                d={digitPaths[char as keyof typeof digitPaths]}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            </svg>
          );
        })}
      </div>
      <div ref={textRef} className="sr-only">
        {formattedValue}
      </div>
      {suffix && <span>{suffix}</span>}
    </div>
  );
};

// ParticleNumber Component
export const ParticleNumber: React.FC<
  NumberAnimationProps & {
    particleConfig?: ParticleConfig;
  }
> = ({
  from = 0,
  to,
  duration = 2000,
  delay = 0,
  easing = easings.easeOutExpo,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  onComplete,
  formatValue,
  particleConfig = {}
}) => {
  const {
    count = 20,
    colors = ['#3B82F6', '#8B5CF6', '#EC4899'],
    size = 4,
    spread = 50,
    gravity = 0.5,
    fadeOut = true
  } = particleConfig;

  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    opacity: number;
  }>>([]);
  
  const [showParticles, setShowParticles] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<number>();

  const animatedValue = useAnimation(from, to, duration, easing, () => {
    setShowParticles(true);
    onComplete?.();
  });

  useEffect(() => {
    if (showParticles && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * spread,
        vy: (Math.random() - 0.5) * spread - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: size + Math.random() * size,
        opacity: 1
      }));

      setParticles(newParticles);

      const animateParticles = () => {
        setParticles((prev) =>
          prev.map((p) => ({
            ...p,
            x: p.x + p.vx * 0.1,
            y: p.y + p.vy * 0.1,
            vy: p.vy + gravity,
            opacity: fadeOut ? Math.max(0, p.opacity - 0.02) : p.opacity
          })).filter((p) => p.opacity > 0)
        );

        if (particles.length > 0) {
          particlesRef.current = requestAnimationFrame(animateParticles);
        }
      };

      particlesRef.current = requestAnimationFrame(animateParticles);
    }

    return () => {
      if (particlesRef.current) {
        cancelAnimationFrame(particlesRef.current);
      }
    };
  }, [showParticles, count, colors, size, spread, gravity, fadeOut, particles.length]);

  const formattedValue = formatValue
    ? formatValue(animatedValue)
    : formatNumber(animatedValue, decimals, separator);

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <span>
        {prefix}
        {formattedValue}
        {suffix}
      </span>
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Composite component for easy usage
export const AnimatedNumber: React.FC<
  NumberAnimationProps & {
    variant?: 'odometer' | 'morphing' | 'particle' | 'countup';
    scrollTrigger?: boolean;
    particleConfig?: ParticleConfig;
  }
> = ({ variant = 'odometer', scrollTrigger = false, ...props }) => {
  const Component = {
    odometer: OdometerNumber,
    morphing: MorphingNumber,
    particle: ParticleNumber,
    countup: OdometerNumber
  }[variant];

  if (scrollTrigger) {
    return <CountUpOnScroll {...props} />;
  }

  return <Component {...props} />;
};

// Export all components and utilities
export default {
  OdometerNumber,
  CountUpOnScroll,
  MorphingNumber,
  ParticleNumber,
  AnimatedNumber,
  easings,
  formatNumber
};