# Animation Showcase Component

A comprehensive interactive showcase for all animation components in the TrueFlow AI project.

## Features

### 1. **Interactive Modal Interface**
- Full-screen modal with categorized navigation
- Real-time parameter controls
- Performance monitoring
- Animation reset and pause controls

### 2. **Animation Categories**

#### Number Animations
- **OdometerNumber**: Rolling number effect with customizable easing
- **MorphingNumber**: SVG-based morphing digit animations
- **ParticleNumber**: Numbers with particle explosion effects
- **CountUpOnScroll**: Scroll-triggered number animations

#### Hover Effects (10 Types)
1. **MagneticButton**: Follows cursor with magnetic attraction
2. **LiquidButton**: Morphing liquid/blob effect
3. **TextScramble**: Scrambles text characters on hover
4. **RippleEffect**: Material Design ripple on click
5. **GlowCard**: Dynamic glow that follows cursor
6. **TiltCard**: 3D perspective tilt effect
7. **BorderBeam**: Animated traveling border
8. **ShimmerButton**: Shimmer effect that passes through
9. **MorphingSVG**: SVG path morphing on hover
10. **ElasticButton**: Elastic/jelly physics animation

#### Particle Systems
- **ParticleField**: Interactive particle field with mouse interaction
- **ConfettiCannon**: Triggered confetti explosions
- **MatrixRain**: Matrix-style falling characters
- **FireworkDisplay**: Animated firework effects
- **ParticleEmitter**: Customizable particle emitter

#### Parallax Effects
- **MultiLayerParallax**: Multiple parallax layers with different speeds
- **ParallaxText**: Infinite scrolling text
- **MouseParallax**: Content that follows mouse movement
- **ScrollRotate**: Rotation based on scroll position
- **ZoomParallax**: Zoom effect on scroll

#### Scroll Animations
- **FadeInUp/Down/Left/Right**: Directional fade animations
- **ScaleIn**: Scale from 0 to full size
- **RotateIn**: Rotation with fade
- **SlideInUp**: Slide up from viewport bottom
- **BlurIn**: Blur to focus transition
- **StaggerChildren**: Sequential child animations

### 3. **Performance Monitoring**
- Real-time FPS counter
- Memory usage tracking (when available)
- Visual indicators for performance

### 4. **Parameter Controls**
Adjust animation parameters in real-time:
- Duration
- Easing functions
- Colors
- Particle counts
- Strength/intensity values

## Usage

### Basic Implementation

```tsx
import { AnimationShowcase, AnimationShowcaseTrigger } from '@/app/animation-showcase';

// Option 1: Use the pre-built trigger button
export default function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <AnimationShowcaseTrigger />
    </div>
  );
}

// Option 2: Custom implementation
export default function MyPage() {
  const [showAnimations, setShowAnimations] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowAnimations(true)}>
        Open Animation Showcase
      </button>
      
      <AnimationShowcase 
        isOpen={showAnimations} 
        onClose={() => setShowAnimations(false)} 
      />
    </div>
  );
}
```

### Accessing Individual Animations

```tsx
// Import specific animations
import { MagneticButton, TextScramble } from '@/app/hover-effects';
import { AnimatedNumber } from '@/app/advanced-animations';
import { ParticleField } from '@/app/particle-systems';

// Use in your components
<MagneticButton strength={0.5}>
  Hover Me
</MagneticButton>

<AnimatedNumber
  from={0}
  to={1000}
  duration={2000}
  variant="particle"
  particleConfig={{
    colors: ['#3B82F6', '#8B5CF6'],
    count: 30
  }}
/>
```

## Customization

### Adding New Animations

1. Add your animation component to the appropriate file:
   - `hover-effects.tsx` for hover animations
   - `advanced-animations.tsx` for number animations
   - `particle-systems.tsx` for particle effects
   - `parallax-effects.tsx` for parallax effects
   - `scroll-animations.tsx` for scroll-triggered animations

2. Update the showcase component to include your new animation in the appropriate category section.

### Modifying Parameters

The parameter controls in the sidebar can be extended by updating the parameter state and adding new input controls:

```tsx
const [customParams, setCustomParams] = useState({
  myNewParam: 'default value'
});

// In the parameters section
<div>
  <label className="text-xs font-medium">My New Parameter</label>
  <input
    type="text"
    value={customParams.myNewParam}
    onChange={(e) => setCustomParams({ ...customParams, myNewParam: e.target.value })}
    className="w-full mt-1 px-2 py-1 rounded"
  />
</div>
```

## Performance Tips

1. **Use the pause button** when not actively viewing animations to reduce CPU usage
2. **Monitor FPS** with the performance toggle to identify heavy animations
3. **Adjust particle counts** for better performance on lower-end devices
4. **Test on various devices** using the showcase to ensure smooth performance

## Browser Support

All animations are tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

Some advanced features may have reduced functionality on older browsers.

## Troubleshooting

### Animation not playing
- Check if animations are paused
- Verify browser supports required features
- Check console for errors

### Poor performance
- Reduce particle counts
- Disable complex animations on low-end devices
- Use performance monitor to identify bottlenecks

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check for conflicting global styles
- Verify dark mode classes are applied correctly

## Demo

Visit `/animation-demo` to see the showcase in action with documentation and examples.