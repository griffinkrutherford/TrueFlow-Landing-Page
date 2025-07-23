'use client';

import React from 'react';
import { AnimationShowcaseTrigger } from '../animation-showcase';

export default function AnimationDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Animation Library Demo
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Welcome to the TrueFlow AI animation library demonstration. This page showcases
              our comprehensive collection of animation components designed for modern web applications.
            </p>

            <h2>Available Animation Categories</h2>
            <ul>
              <li><strong>Number Animations:</strong> Odometer, Morphing, Particle, and Count-up effects</li>
              <li><strong>Hover Effects:</strong> 10 unique interactive hover animations</li>
              <li><strong>Particle Systems:</strong> Interactive fields, confetti, matrix rain, and fireworks</li>
              <li><strong>Parallax Effects:</strong> Multi-layer, mouse-tracking, and scroll-based parallax</li>
              <li><strong>Scroll Animations:</strong> Fade, scale, rotate, and stagger animations on scroll</li>
            </ul>

            <h2>How to Use</h2>
            <p>
              Click the "Animation Showcase" button in the bottom-right corner to open the interactive
              showcase. From there, you can:
            </p>
            <ul>
              <li>Browse different animation categories</li>
              <li>Adjust animation parameters in real-time</li>
              <li>View performance metrics</li>
              <li>Reset animations to see them replay</li>
              <li>Copy code examples for implementation</li>
            </ul>

            <h2>Performance Considerations</h2>
            <p>
              All animations are optimized for performance using:
            </p>
            <ul>
              <li>GPU acceleration where possible</li>
              <li>RequestAnimationFrame for smooth 60fps animations</li>
              <li>Intersection Observer for scroll-triggered animations</li>
              <li>Efficient React rendering with proper memoization</li>
            </ul>

            <h2>Integration Example</h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-4">
              <pre className="text-sm">
                <code>{`import { AnimatedNumber } from '@/app/advanced-animations';
import { MagneticButton } from '@/app/hover-effects';
import { ParticleField } from '@/app/particle-systems';

// Number animation
<AnimatedNumber
  from={0}
  to={1000}
  duration={2000}
  variant="odometer"
  prefix="$"
/>

// Hover effect
<MagneticButton strength={0.5}>
  Click Me
</MagneticButton>

// Particle system
<ParticleField
  particleCount={100}
  interactive={true}
/>`}</code>
              </pre>
            </div>
          </div>

          <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Ready to explore?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Click the Animation Showcase button to start exploring all available animations
              with interactive controls and real-time customization.
            </p>
          </div>
        </div>
      </div>

      {/* Animation Showcase Trigger Button */}
      <AnimationShowcaseTrigger />
    </div>
  );
}