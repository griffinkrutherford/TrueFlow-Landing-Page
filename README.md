# TrueFlow AI Landing Page

A completely self-contained, independent landing page for TrueFlow AI with modern design, 3D carousel, and Apple-inspired animations.

## Features

- **3D Orbital Carousel** - Interactive feature showcase with smooth rotations
- **Apple-style Design** - Modern glassmorphism effects and smooth animations
- **Responsive Layout** - Works perfectly on all devices
- **Black Theme** - Elegant dark design with gray scrollbars
- **Performance Optimized** - Fast loading with optimized images and code
- **SEO Ready** - Proper meta tags and semantic HTML

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd trueflow-landing
```

2. Install dependencies:
```bash
npm install
```

3. Add your logo file:
   - Place `true-flow-logo.webp` in the `/public` folder
   - Or update the logo paths in `app/page.tsx` to use your logo

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Deployment Options

This landing page can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify** 
- **AWS Amplify**
- **Traditional hosting** (after `npm run build`)

## Integration with GoHighLevel

### Option 1: Export Static Files
```bash
npm run build
# Copy files from .next/out/ to GHL
```

### Option 2: Embed Sections
- Copy specific components (hero, carousel, testimonials)
- Add to GHL using Custom HTML elements
- Include the CSS from `globals.css`

### Option 3: Iframe Embed
- Deploy landing page separately
- Embed in GHL using iframe element

## Customization

### Colors & Branding
- Update logo in `/public/true-flow-logo.webp`
- Modify colors in `app/globals.css`
- Edit content in `app/page.tsx`

### Features
- Add/remove carousel features in the `features` array
- Update testimonials in the `testimonials` array
- Modify stats in the `stats` array

### Styling
- All styles are in `app/globals.css`
- Uses Tailwind CSS for responsive design
- Custom animations and 3D effects included

## File Structure

```
trueflow-landing/
├── app/
│   ├── globals.css     # All styles and animations
│   ├── layout.tsx      # Root layout with SEO
│   └── page.tsx        # Main landing page component
├── public/
│   └── true-flow-logo.webp  # Logo file
├── package.json        # Dependencies
├── tailwind.config.ts  # Tailwind configuration
└── next.config.js      # Next.js configuration
```

## Dependencies

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **TypeScript** - Type safety

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **3D Animations**: Hardware accelerated

## License

Private - TrueFlow AI

---

**Ready to deploy anywhere!** This landing page is completely self-contained and can run independently of any other system.