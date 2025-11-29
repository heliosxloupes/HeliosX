# Daylight Computer - Quick Implementation Guide

## Tech Stack Summary

```json
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript",
  "styling": {
    "primary": "Tailwind CSS",
    "secondary": "CSS Modules",
    "tokens": "CSS Custom Properties"
  },
  "ui": "Radix UI",
  "smoothScroll": "Lenis",
  "video": "Mux",
  "images": "Next.js Image",
  "state": "React Context + Local State"
}
```

## Quick Start Commands

```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest . --typescript --tailwind --app

# Install dependencies
npm install @radix-ui/react-navigation-menu @radix-ui/react-dialog
npm install lenis
npm install react-player
npm install @mux/mux-player-react  # or alternative video solution
```

## Component Structure Template

### Header Component
```tsx
// components/Header/Header.tsx
import styles from './Header.module.css';
import { NavigationMenu } from '@radix-ui/react-navigation-menu';

export function Header() {
  return (
    <header className={styles.header}>
      <NavigationMenu>
        {/* Navigation items */}
      </NavigationMenu>
    </header>
  );
}
```

### CSS Module Pattern
```css
/* components/Header/Header.module.css */
.header {
  /* Component-specific styles */
}

.header__wrapper {
  /* BEM-like naming */
}
```

### Tailwind + CSS Modules Hybrid
```tsx
<div className={`${styles.component} flex items-center lg:p-vw-4`}>
  {/* Tailwind utilities + CSS Module classes */}
</div>
```

## Routing Structure

```
app/
├── layout.tsx          # Root layout with Header/Footer
├── page.tsx            # Home (/)
├── product/
│   └── page.tsx        # Product page (/product)
├── faq/
│   └── page.tsx        # FAQ (/faq)
└── guides/
    └── page.tsx        # Guides (/guides)
```

## Styling Configuration

### tailwind.config.js
```js
module.exports = {
  theme: {
    extend: {
      spacing: {
        'vw-4': '4vw',  // Viewport-based spacing
      },
      fontSize: {
        'vw-8xl': '8vw',  // Viewport-based typography
      },
      colors: {
        moonlight: '#...',  // Custom color palette
      },
    },
  },
}
```

### CSS Custom Properties (globals.css)
```css
:root {
  --header-height: 58px;
  --font-system: system-ui, -apple-system, sans-serif;
  --z-index-10: 10;
  --spacing-vw-4: 4vw;
  --font-size-vw-8xl: 8vw;
}
```

## Key Component Patterns

### 1. Hero Section
- Full-width container
- Background images (Next.js Image)
- Video player (Mux/React Player)
- Overlay content with CTA
- Responsive image handling

### 2. Feature Cards
- Grid layout (Tailwind grid)
- Icon + heading + description
- Hover states
- Responsive columns

### 3. Navigation
- Radix UI NavigationMenu
- Horizontal layout (desktop)
- Mobile menu (hamburger)
- Active state management
- Smooth scroll to sections

### 4. Newsletter Modal
- Radix UI Dialog
- Form with email input
- Submit handler
- Close/expand states

### 5. Testimonials
- Twitter embed cards
- Grid layout
- External links
- Social proof section

## Image Optimization Pattern

```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Description"
  width={1920}
  height={1080}
  loading="lazy"  // For below-fold images
  quality={100}   // Adjust per use case
  className="w-full h-auto"
/>
```

## Smooth Scroll Setup

```tsx
// app/layout.tsx or _app.tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function RootLayout({ children }) {
  useEffect(() => {
    const lenis = new Lenis();
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return <html className="lenis lenis-smooth">{children}</html>;
}
```

## State Management Pattern

### Context for Global State
```tsx
// contexts/ThemeContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Local State for UI
```tsx
'use client';
import { useState } from 'react';

export function Newsletter() {
  const [isOpen, setIsOpen] = useState(false);
  // Component-specific state
}
```

## Performance Checklist

- [ ] Use Next.js Image for all images
- [ ] Implement lazy loading for below-fold content
- [ ] Code split by route
- [ ] Optimize font loading
- [ ] Minimize CSS bundle size
- [ ] Use CSS Modules for component styles
- [ ] Implement proper caching headers

## Accessibility Checklist

- [ ] Use Radix UI primitives (accessible by default)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for all images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Focus management for modals
- [ ] Color contrast compliance

## Responsive Breakpoints

```js
// Tailwind default + custom
sm: '640px',   // Small devices
md: '768px',   // Medium devices
lg: '1024px',  // Large devices (primary breakpoint)
xl: '1280px',  // Extra large
```

## Common Patterns

### Glassmorphism Effect
```css
backdrop-blur-lg bg-moonlight/80 border border-black/10
```

### Viewport-Based Typography
```css
font-size: var(--font-size-vw-8xl);
/* or */
text-[8vw]
```

### Responsive Padding
```tsx
className="p-4 lg:p-vw-4"
```

### Component with CSS Module + Tailwind
```tsx
<div className={`${styles.card} flex flex-col lg:flex-row p-4`}>
```

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `Header.tsx`)
- CSS Modules: `ComponentName.module.css`
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

## Component Export Pattern

```tsx
// components/Header/index.ts
export { Header } from './Header';
export type { HeaderProps } from './Header';
```

## Environment Variables

```env
NEXT_PUBLIC_MUX_TOKEN=...
NEXT_PUBLIC_GA_ID=...
NEXT_PUBLIC_SHOPIFY_STORE=...
```

---

## Quick Reference: Component Hierarchy

```
Layout
  ├── Header
  │   ├── Logo
  │   ├── Nav (Radix)
  │   └── CTA Button
  │
  ├── Main
  │   ├── Hero
  │   ├── Features
  │   ├── Testimonials
  │   └── Footer CTA
  │
  └── Footer
      ├── Links
      ├── Social
      └── Newsletter
```

---

*Use this guide alongside ARCHITECTURE_MAP.md for complete implementation details*











