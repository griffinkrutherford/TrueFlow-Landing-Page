'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Utility functions
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
const distance = (x1: number, y1: number, x2: number, y2: number) => 
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

// Base Particle class
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  
  constructor(x: number, y: number, vx = 0, vy = 0, size = 2, life = 1, color = '#ffffff') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.color = color;
  }
  
  update(deltaTime: number) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime * 0.01;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// 1. ParticleField - Interactive particle system that reacts to mouse
export const ParticleField: React.FC<{ 
  particleCount?: number;
  color?: string;
  interactive?: boolean;
  className?: string;
}> = ({ 
  particleCount = 100, 
  color = '#3b82f6',
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => 
      new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        Math.random() * 3 + 1,
        1,
        color
      )
    );
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update(deltaTime);
        
        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const dist = distance(particle.x, particle.y, mouseRef.current.x, mouseRef.current.y);
          
          if (dist < 100) {
            const force = (100 - dist) / 100;
            particle.vx -= (dx / dist) * force * 0.5;
            particle.vy -= (dy / dist) * force * 0.5;
          }
        }
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Speed limit
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
        if (speed > 2) {
          particle.vx = (particle.vx / speed) * 2;
          particle.vy = (particle.vy / speed) * 2;
        }
        
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, color, interactive]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

// 2. ParticleText - Particles that form text on hover/scroll
export const ParticleText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  className?: string;
}> = ({ text, fontSize = 60, color = '#ffffff', className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const isHoveredRef = useRef(false);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 200;
    
    // Create text bitmap
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Get text pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    targetPositionsRef.current = [];
    particlesRef.current = [];
    
    // Sample pixels to create particles
    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        const alpha = pixels[index + 3];
        
        if (alpha > 128) {
          targetPositionsRef.current.push({ x, y });
          particlesRef.current.push(
            new Particle(
              Math.random() * canvas.width,
              Math.random() * canvas.height,
              0, 0, 2, 1, color
            )
          );
        }
      }
    }
    
    const handleMouseEnter = () => { isHoveredRef.current = true; };
    const handleMouseLeave = () => { isHoveredRef.current = false; };
    
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, i) => {
        const target = targetPositionsRef.current[i];
        if (!target) return;
        
        if (isHoveredRef.current) {
          // Move to target position
          particle.x = lerp(particle.x, target.x, 0.1);
          particle.y = lerp(particle.y, target.y, 0.1);
        } else {
          // Random movement
          particle.vx = (Math.random() - 0.5) * 2;
          particle.vy = (Math.random() - 0.5) * 2;
          particle.update(deltaTime);
          
          // Boundary check
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        }
        
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, fontSize, color]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`cursor-pointer ${className}`}
      style={{ width: '800px', height: '200px' }}
    />
  );
};

// 3. ParticleExplosion - Burst animations for CTAs
export const ParticleExplosion: React.FC<{
  trigger?: boolean;
  x?: number;
  y?: number;
  particleCount?: number;
  colors?: string[];
  className?: string;
}> = ({ 
  trigger = false,
  x = 0,
  y = 0,
  particleCount = 50,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!trigger) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create explosion particles
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return new Particle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.random() * 4 + 2,
        1,
        color
      );
    });
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update(deltaTime);
        particle.vy += 0.1; // Gravity
        
        if (particle.life > 0) {
          particle.draw(ctx);
          return true;
        }
        return false;
      });
      
      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate(0);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, x, y, particleCount, colors]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 9999 }}
    />
  );
};

// 4. ConnectedParticles - Particles with connecting lines (constellation effect)
export const ConnectedParticles: React.FC<{
  particleCount?: number;
  connectionDistance?: number;
  particleColor?: string;
  lineColor?: string;
  className?: string;
}> = ({ 
  particleCount = 75,
  connectionDistance = 150,
  particleColor = '#3b82f6',
  lineColor = 'rgba(59, 130, 246, 0.2)',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => 
      new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        Math.random() * 2 + 1,
        1,
        particleColor
      )
    );
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        particle.update(deltaTime);
        
        // Boundary check with wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        particle.draw(ctx);
        
        // Draw connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dist = distance(particle.x, particle.y, other.x, other.y);
          
          if (dist < connectionDistance) {
            const opacity = 1 - (dist / connectionDistance);
            ctx.strokeStyle = lineColor.replace('0.2', opacity.toFixed(2));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, connectionDistance, particleColor, lineColor]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

// 5. FlowField - Particle flow field with vector-based movement
export const FlowField: React.FC<{
  particleCount?: number;
  noiseScale?: number;
  particleColor?: string;
  className?: string;
}> = ({ 
  particleCount = 1000,
  noiseScale = 0.01,
  particleColor = 'rgba(59, 130, 246, 0.5)',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  
  // Simple noise function
  const noise = (x: number, y: number, t: number) => {
    const n = Math.sin(x * noiseScale + t) * Math.cos(y * noiseScale + t);
    return (n + 1) / 2;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => 
      new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        0, 0, 1, 1, particleColor
      )
    );
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current += deltaTime * 0.001;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        // Calculate flow field angle
        const angle = noise(particle.x, particle.y, timeRef.current) * Math.PI * 4;
        const force = 0.5;
        
        particle.vx = Math.cos(angle) * force;
        particle.vy = Math.sin(angle) * force;
        
        particle.update(deltaTime);
        
        // Boundary check with wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, noiseScale, particleColor]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{ background: '#000' }}
    />
  );
};

// 6. MorphingBackground - Dynamic mesh gradient background
export const MorphingBackground: React.FC<{
  colors?: string[];
  speed?: number;
  className?: string;
}> = ({ 
  colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
  speed = 0.001,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current += deltaTime * speed;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Create morphing gradient
      const gradient = ctx.createLinearGradient(
        width * (0.5 + Math.sin(timeRef.current) * 0.3),
        height * (0.5 + Math.cos(timeRef.current * 0.7) * 0.3),
        width * (0.5 + Math.cos(timeRef.current * 1.3) * 0.3),
        height * (0.5 + Math.sin(timeRef.current * 0.9) * 0.3)
      );
      
      colors.forEach((color, i) => {
        const offset = (i / (colors.length - 1) + Math.sin(timeRef.current + i) * 0.1) % 1;
        gradient.addColorStop(Math.max(0, Math.min(1, offset)), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, speed]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
    />
  );
};

// 7. WaveBackground - Animated wave patterns
export const WaveBackground: React.FC<{
  waveCount?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  colors?: string[];
  className?: string;
}> = ({ 
  waveCount = 3,
  amplitude = 50,
  frequency = 0.01,
  speed = 0.001,
  colors = ['rgba(59, 130, 246, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(236, 72, 153, 0.3)'],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current += deltaTime * speed;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < waveCount; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        
        for (let x = 0; x <= canvas.width; x++) {
          const y = canvas.height / 2 + 
            Math.sin(x * frequency + timeRef.current + i * Math.PI / waveCount) * 
            amplitude * (1 + i * 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveCount, amplitude, frequency, speed, colors]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
    />
  );
};

// 8. GeometricBackground - Animated geometric shapes
export const GeometricBackground: React.FC<{
  shapeCount?: number;
  shapeType?: 'triangle' | 'square' | 'hexagon' | 'mixed';
  rotationSpeed?: number;
  scaleSpeed?: number;
  colors?: string[];
  className?: string;
}> = ({ 
  shapeCount = 20,
  shapeType = 'mixed',
  rotationSpeed = 0.001,
  scaleSpeed = 0.0005,
  colors = ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)'],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const shapesRef = useRef<any[]>([]);
  const timeRef = useRef(0);
  
  const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.866, size * 0.5);
    ctx.lineTo(-size * 0.866, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  
  const drawSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  };
  
  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = size * Math.cos(angle);
      const py = size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize shapes
      shapesRef.current = Array.from({ length: shapeCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 50 + 30,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * rotationSpeed * 2,
        scaleOffset: Math.random() * Math.PI * 2,
        type: shapeType === 'mixed' ? 
          ['triangle', 'square', 'hexagon'][Math.floor(Math.random() * 3)] : 
          shapeType,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current += deltaTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      shapesRef.current.forEach(shape => {
        shape.rotation += shape.rotationSpeed * deltaTime;
        const scale = 1 + Math.sin(timeRef.current * scaleSpeed + shape.scaleOffset) * 0.3;
        const size = shape.size * scale;
        
        ctx.fillStyle = shape.color;
        
        switch (shape.type) {
          case 'triangle':
            drawTriangle(ctx, shape.x, shape.y, size, shape.rotation);
            break;
          case 'square':
            drawSquare(ctx, shape.x, shape.y, size, shape.rotation);
            break;
          case 'hexagon':
            drawHexagon(ctx, shape.x, shape.y, size, shape.rotation);
            break;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shapeCount, shapeType, rotationSpeed, scaleSpeed, colors]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
    />
  );
};

// 9. NoiseBackground - Perlin noise animated background
export const NoiseBackground: React.FC<{
  scale?: number;
  speed?: number;
  octaves?: number;
  color?: string;
  opacity?: number;
  className?: string;
}> = ({ 
  scale = 0.002,
  speed = 0.0005,
  octaves = 4,
  color = '#3b82f6',
  opacity = 0.1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  
  // Simplified Perlin noise implementation
  const noise = (x: number, y: number, t: number) => {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += Math.sin(x * frequency * scale + t) * 
               Math.cos(y * frequency * scale + t) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return value / maxValue;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current += deltaTime * speed;
      
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      // Parse color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          const n = (noise(x, y, timeRef.current) + 1) / 2;
          const index = (y * canvas.width + x) * 4;
          
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = n * 255 * opacity;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scale, speed, octaves, color, opacity]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
    />
  );
};

// Additional component exports for missing components

// ConfettiCannon - Celebratory particle burst effect
const ConfettiCannon: React.FC<{
  trigger?: boolean;
  origin?: { x: number; y: number };
  particleCount?: number;
  spread?: number;
  colors?: string[];
  className?: string;
}> = ({
  trigger = false,
  origin = { x: window.innerWidth / 2, y: window.innerHeight },
  particleCount = 100,
  spread = 45,
  colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create confetti particles
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180) - Math.PI / 2;
      const velocity = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      return new Particle(
        origin.x,
        origin.y,
        Math.cos(angle) * velocity,
        Math.sin(angle) * velocity,
        Math.random() * 6 + 3,
        1,
        color
      );
    });

    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update(deltaTime);
        particle.vy += 0.2; // Gravity
        particle.vx *= 0.99; // Air resistance

        if (particle.life > 0 && particle.y < canvas.height) {
          // Draw rectangular confetti
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.x * 0.01);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.life;
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 2);
          ctx.restore();
          return true;
        }
        return false;
      });

      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate(0);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, origin, particleCount, spread, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 9999 }}
    />
  );
};

// MatrixRain - Digital rain effect
const MatrixRain: React.FC<{
  charSet?: string;
  fontSize?: number;
  speed?: number;
  color?: string;
  className?: string;
}> = ({
  charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  fontSize = 16,
  speed = 0.5,
  color = '#00ff00',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const columnsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const columns = Math.floor(canvas.width / fontSize);
      columnsRef.current = new Array(columns).fill(0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      columnsRef.current.forEach((y, x) => {
        const char = charSet[Math.floor(Math.random() * charSet.length)];
        const xPos = x * fontSize;
        const yPos = y * fontSize;

        ctx.fillText(char, xPos, yPos);

        if (yPos > canvas.height && Math.random() > 0.975) {
          columnsRef.current[x] = 0;
        } else {
          columnsRef.current[x] = y + speed;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [charSet, fontSize, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{ background: '#000' }}
    />
  );
};

// FireworkDisplay - Fireworks animation
const FireworkDisplay: React.FC<{
  autoStart?: boolean;
  interval?: number;
  maxFireworks?: number;
  colors?: string[];
  className?: string;
}> = ({
  autoStart = true,
  interval = 1000,
  maxFireworks = 5,
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<any[]>([]);
  const animationRef = useRef<number>();

  class Firework {
    x: number;
    y: number;
    targetY: number;
    vx: number;
    vy: number;
    color: string;
    exploded: boolean;
    particles: Particle[];

    constructor(x: number, targetY: number, color: string) {
      this.x = x;
      this.y = window.innerHeight;
      this.targetY = targetY;
      this.vx = 0;
      this.vy = -15;
      this.color = color;
      this.exploded = false;
      this.particles = [];
    }

    update() {
      if (!this.exploded) {
        this.y += this.vy;
        if (this.y <= this.targetY) {
          this.explode();
        }
      } else {
        this.particles = this.particles.filter(particle => {
          particle.update(16);
          particle.vy += 0.2;
          return particle.life > 0;
        });
      }
    }

    explode() {
      this.exploded = true;
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 / 50) * i;
        const velocity = Math.random() * 5 + 2;
        this.particles.push(
          new Particle(
            this.x,
            this.y,
            Math.cos(angle) * velocity,
            Math.sin(angle) * velocity,
            Math.random() * 3 + 1,
            1,
            this.color
          )
        );
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (!this.exploded) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 2, this.y - 10, 4, 10);
      } else {
        this.particles.forEach(particle => particle.draw(ctx));
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let intervalId: NodeJS.Timeout;
    if (autoStart) {
      intervalId = setInterval(() => {
        if (fireworksRef.current.length < maxFireworks) {
          const x = Math.random() * canvas.width;
          const targetY = Math.random() * canvas.height * 0.5;
          const color = colors[Math.floor(Math.random() * colors.length)];
          fireworksRef.current.push(new Firework(x, targetY, color));
        }
      }, interval);
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworksRef.current = fireworksRef.current.filter(firework => {
        firework.update();
        firework.draw(ctx);
        return !firework.exploded || firework.particles.length > 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (intervalId) clearInterval(intervalId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoStart, interval, maxFireworks, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

// ParticleEmitter - Continuous particle emission from a point
const ParticleEmitter: React.FC<{
  position: { x: number; y: number };
  emissionRate?: number;
  particleLife?: number;
  spread?: number;
  velocity?: number;
  color?: string;
  className?: string;
}> = ({
  position,
  emissionRate = 5,
  particleLife = 2,
  spread = 45,
  velocity = 2,
  color = '#3b82f6',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const lastEmissionRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Emit new particles
      if (currentTime - lastEmissionRef.current > 1000 / emissionRate) {
        const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180) - Math.PI / 2;
        const speed = Math.random() * velocity + velocity / 2;

        particlesRef.current.push(
          new Particle(
            position.x,
            position.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            Math.random() * 4 + 2,
            particleLife,
            color
          )
        );
        lastEmissionRef.current = currentTime;
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update(deltaTime);
        if (particle.life > 0) {
          particle.draw(ctx);
          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position, emissionRate, particleLife, spread, velocity, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
    />
  );
};

// Export the new components
export { ConfettiCannon, MatrixRain, FireworkDisplay, ParticleEmitter };

// 10. ParticleTrail - Particles that follow cursor movement
export const ParticleTrail: React.FC<{
  trailLength?: number;
  particleSize?: number;
  fadeSpeed?: number;
  colors?: string[];
  className?: string;
}> = ({ 
  trailLength = 20,
  particleSize = 4,
  fadeSpeed = 0.95,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<{ x: number; y: number; life: number; color: string }[]>([]);
  const animationRef = useRef<number>();
  const lastMouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add new trail particle if mouse moved enough
      const dx = x - lastMouseRef.current.x;
      const dy = y - lastMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        trailRef.current.push({
          x,
          y,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        
        if (trailRef.current.length > trailLength) {
          trailRef.current.shift();
        }
        
        lastMouseRef.current = { x, y };
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw trail
      trailRef.current = trailRef.current.filter(particle => {
        particle.life *= fadeSpeed;
        
        if (particle.life > 0.01) {
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particleSize * particle.life, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });
      
      ctx.globalAlpha = 1;
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trailLength, particleSize, fadeSpeed, colors]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 9999 }}
    />
  );
};

// WebGL-enhanced version for complex effects
export const WebGLParticleSystem: React.FC<{
  particleCount?: number;
  textureUrl?: string;
  className?: string;
}> = ({ 
  particleCount = 10000,
  textureUrl,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Vertex shader
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      in vec2 a_velocity;
      in float a_life;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      out float v_life;
      
      void main() {
        vec2 position = a_position + a_velocity * u_time;
        
        // Wrap around screen
        position = mod(position, u_resolution);
        
        vec2 clipSpace = ((position / u_resolution) * 2.0) - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = 2.0 * a_life;
        
        v_life = a_life;
      }
    `;
    
    // Fragment shader
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      in float v_life;
      uniform vec4 u_color;
      
      out vec4 outColor;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) {
          discard;
        }
        
        outColor = u_color * v_life;
      }
    `;
    
    // Compile shader
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };
    
    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;
    
    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }
    
    // Get locations
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const velocityLoc = gl.getAttribLocation(program, 'a_velocity');
    const lifeLoc = gl.getAttribLocation(program, 'a_life');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const colorLoc = gl.getUniformLocation(program, 'u_color');
    
    // Create particle data
    const positions = new Float32Array(particleCount * 2);
    const velocities = new Float32Array(particleCount * 2);
    const lives = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 2] = Math.random() * canvas.width;
      positions[i * 2 + 1] = Math.random() * canvas.height;
      velocities[i * 2] = (Math.random() - 0.5) * 2;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 2;
      lives[i] = Math.random();
    }
    
    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    const velocityBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, velocities, gl.STATIC_DRAW);
    
    const lifeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, lives, gl.STATIC_DRAW);
    
    // Setup VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer);
    gl.enableVertexAttribArray(velocityLoc);
    gl.vertexAttribPointer(velocityLoc, 2, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
    gl.enableVertexAttribArray(lifeLoc);
    gl.vertexAttribPointer(lifeLoc, 1, gl.FLOAT, false, 0, 0);
    
    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const time = (Date.now() - startTime) * 0.001;
      
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      
      gl.uniform1f(timeLoc, time);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform4f(colorLoc, 0.23, 0.51, 0.96, 1.0);
      
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      
      gl.drawArrays(gl.POINTS, 0, particleCount);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Cleanup WebGL resources
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(velocityBuffer);
      gl.deleteBuffer(lifeBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [particleCount, textureUrl]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
    />
  );
};