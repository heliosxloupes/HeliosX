# Daylight Computer - Architecture Map

## Overview
This document maps the core architecture of daylightcomputer.com for cloning purposes. The site is built with Next.js (App Router), Tailwind CSS, CSS Modules, and Radix UI.

---

## 1. Framework & Core Stack

### Framework
- **Next.js** (App Router)
  - Evidence: `/_next/static/chunks/app/` paths in network requests
  - File-based routing structure
  - Server-side rendering (SSR) + Client-side navigation
  - Image optimization via Next.js Image component (52 instances detected)

### Language
- **TypeScript** (inferred from `.tsx` extensions in chunk names)

---

## 2. Routing Architecture

### Route Structure
```
/                    → Home page
/product             → Product page
/product#specs       → Product specs section (hash routing)
/faq                 → FAQ page
/guides              → Guides page
/cart                → Shopping cart (detected in links)
```

### Routing Pattern
- **File-based routing** (Next.js App Router)
- **Client-side navigation** for internal links
- **Hash routing** for in-page sections (`#specs`)
- **External links** handled normally (e.g., support subdomain, social media)

### Navigation Components
- **Header Navigation**: Horizontal menu with logo, nav items, CTA button
- **Footer Navigation**: Multi-column layout with links, socials, newsletter
- **Breadcrumbs/Deep Links**: "Dive deeper" section with image-based navigation cards

---

## 3. Component Architecture

### Component Hierarchy

```
App Layout
├── Header (Banner)
│   ├── Logo (Link to home)
│   ├── Navigation Menu (Radix UI)
│   │   ├── Home
│   │   ├── Product
│   │   ├── FAQ
│   │   └── Order Now (CTA Button)
│   └── Daylight Kids Banner (conditional)
│
├── Main Content
│   ├── Hero Section
│   │   ├── Hero Images (Next.js Image)
│   │   ├── Video Player (Mux)
│   │   ├── Headline & Description
│   │   └── CTA Section (Stock status + Order button)
│   │
│   ├── Feature Sections
│   │   ├── Display Features (60fps, calm, health)
│   │   ├── Use Cases (Reading, Note-taking, Writing)
│   │   ├── Apps Section
│   │   ├── Vision Section
│   │   └── Outdoor Computing
│   │
│   ├── Social Proof
│   │   └── Testimonials (Twitter embeds)
│   │
│   ├── Company Story
│   │   └── Public Benefit Co. section
│   │
│   └── Product Summary
│       └── DC-1 at a glance
│
└── Footer
    ├── Product Image & CTA
    ├── Legal Links
    ├── Navigation Links
    ├── Social Links
    └── Newsletter Signup
```

### Component Modules (CSS Modules Pattern)
Detected component modules using BEM-like naming:
- `header_*` - Header components
- `button_*` - Button variants
- `newsletter_*` - Newsletter components
- `hero_*` - Hero section components
- `footer_*` - Footer components
- `product-label_*` - Product labeling
- `link_*` - Link components
- `modern-devices_*` - Device showcase

**Naming Convention**: `{module}_{component}__{hash}` (e.g., `header_header-wrapper__3S3ls`)

---

## 4. Styling Architecture

### Styling Approach: Hybrid
1. **Tailwind CSS** (Utility-first)
   - Classes: `flex`, `items-center`, `whitespace-nowrap`, `backdrop-blur-lg`
   - Responsive: `lg:`, `max-lg:`
   - Custom spacing: `p-vw-4`, `em-[58/16]` (viewport/em-based units)

2. **CSS Modules** (Component-scoped)
   - Scoped styles for complex components
   - BEM-like naming convention
   - Used for component-specific styling

3. **CSS Custom Properties** (Design Tokens)
   - `--header-height`
   - `--font-system`
   - `--z-index-10`
   - `--spacing-vw-4`
   - `--font-size-vw-8xl`
   - `--text-scale-screen-min`
   - Leva UI variables (likely for dev tools)

### Typography
- Custom font loading (multiple `.woff` files detected)
- Viewport-based font scaling (`--font-size-vw-8xl`)
- System font fallback (`--font-system`)

### Responsive Design
- Mobile-first approach
- Breakpoints: `lg:`, `max-lg:`
- Viewport-based units for fluid typography/spacing

---

## 5. State Management

### State Patterns
- **No global state library detected** (no Redux, Zustand, or MobX)
- Likely using:
  - **React Context** for theme/global state
  - **Local component state** (useState) for UI interactions
  - **URL state** for routing/navigation

### Interactive Components
- Newsletter modal (open/close state)
- Video player controls
- Navigation menu (mobile/desktop states)
- Scroll-based animations (Lenis smooth scroll)

---

## 6. UI Component Library

### Radix UI Primitives
- **Navigation Menu** (`data-radix-collection-item`)
- Accessible, unstyled primitives
- Custom styling via CSS Modules/Tailwind

### Custom Components
- Button variants (primary, unstyled)
- Link components
- Input/Form components (newsletter)
- Image components (Next.js Image wrapper)

---

## 7. Media & Assets

### Image Handling
- **Next.js Image Component** (52 instances)
  - Automatic optimization
  - Lazy loading (36 lazy images detected)
  - Responsive images with `srcset`
  - WebP format support

### Video
- **Mux** for video hosting/streaming
  - HLS streaming (`*.m3u8` files)
  - Thumbnail generation
  - Adaptive bitrate streaming
- **React Player** (detected in chunks)

### 3D/Animation Assets
- Texture files: `noise-2.png`, `halftone.png`, `baked-shadows.png`
- Image sequences: `Comp_00000.webp` through `Comp_00169.webp` (170 frames)
- Likely used for hero animations or product reveals

---

## 8. Interactions & Animations

### Smooth Scrolling
- **Lenis** smooth scroll library
  - Classes: `lenis`, `lenis-smooth`
  - Custom scroll behavior

### Scroll Animations
- Likely Intersection Observer for scroll-triggered animations
- Text animations (letter-by-letter in "What people are saying")

### Transitions
- Header color transitions (`header_header-menu-color-transition__1qECW`)
- Backdrop blur effects
- Modal/dialog transitions

---

## 9. Performance Optimizations

### Code Splitting
- Next.js automatic code splitting
- Route-based chunks
- Component-based chunks

### Image Optimization
- Next.js Image optimization
- Lazy loading (36 images)
- WebP format
- Responsive image sizes

### Font Loading
- Custom font files (`.woff`, `.woff2`)
- Font loading strategy (likely `fonts-loaded` class)

### Asset Delivery
- CDN for static assets (`/_next/static/`)
- External CDN for video (Mux)
- External CDN for textures (`daylight.basement.earth`)

---

## 10. Third-Party Integrations

### Analytics & Tracking
- **Google Tag Manager** (GTM-5BXRSPL5)
- **Google Analytics** (G-YLXW0MCLMC, G-V556R2N7QX)
- **Vercel Analytics** (`/_vercel/insights/`)

### E-commerce
- **Shopify** integration (detected: `2f08e0.myshopify.com`)
- Referral tracking (`socialsnowball.io`)
- Affiliate tracking (`uppromote.com`)

### Social Media
- Twitter/X embeds (testimonials)
- Social sharing links

### Video
- **Mux** for video hosting
- **HLS.js** for adaptive streaming

---

## 11. Development Tools

### Dev Tools
- **Leva** UI controls (CSS variables detected)
- React DevTools support
- Console branding ("From the basement. https://basement.studio")

---

## 12. File Structure (Inferred)

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── product/
│   └── page.tsx            # Product page
├── faq/
│   └── page.tsx            # FAQ page
└── guides/
    └── page.tsx            # Guides page

components/
├── Header/
│   ├── Header.tsx
│   └── Header.module.css
├── Footer/
│   ├── Footer.tsx
│   └── Footer.module.css
├── Button/
│   ├── Button.tsx
│   └── Button.module.css
├── Newsletter/
│   ├── Newsletter.tsx
│   └── Newsletter.module.css
└── Hero/
    ├── Hero.tsx
    └── Hero.module.css

styles/
├── globals.css             # Global styles + Tailwind
└── variables.css           # CSS custom properties

public/
├── textures/               # Image textures
└── fonts/                  # Custom fonts
```

---

## 13. Key Patterns & Best Practices

### Component Patterns
1. **CSS Modules + Tailwind hybrid**: Use Tailwind for utilities, CSS Modules for component-specific styles
2. **BEM-like naming**: `{module}_{component}__{hash}`
3. **Composition**: Small, reusable components
4. **Accessibility**: Radix UI primitives for accessible components

### Styling Patterns
1. **Viewport-based units**: Use `vw`, `em` for fluid typography/spacing
2. **CSS custom properties**: Design tokens in `:root`
3. **Responsive utilities**: Tailwind breakpoints
4. **Backdrop blur**: Glassmorphism effects

### Performance Patterns
1. **Image optimization**: Always use Next.js Image
2. **Lazy loading**: For below-fold content
3. **Code splitting**: Route-based and component-based
4. **Font optimization**: Custom font loading strategy

### Interaction Patterns
1. **Smooth scrolling**: Lenis for enhanced UX
2. **Scroll animations**: Intersection Observer
3. **Modal management**: Radix UI Dialog
4. **Form handling**: Controlled components

---

## 14. Implementation Checklist

### Core Setup
- [ ] Next.js 14+ (App Router)
- [ ] TypeScript
- [ ] Tailwind CSS
- [ ] CSS Modules support
- [ ] Radix UI primitives

### Styling
- [ ] Configure Tailwind with custom spacing/typography
- [ ] Set up CSS custom properties
- [ ] Implement viewport-based units
- [ ] Create component CSS Modules

### Components
- [ ] Header with navigation
- [ ] Footer with links
- [ ] Button variants
- [ ] Newsletter modal
- [ ] Hero section
- [ ] Feature sections
- [ ] Testimonials section

### Media
- [ ] Next.js Image setup
- [ ] Mux video integration (or alternative)
- [ ] Lazy loading strategy
- [ ] Asset optimization

### Interactions
- [ ] Lenis smooth scroll
- [ ] Scroll animations
- [ ] Modal/dialog system
- [ ] Form handling

### Performance
- [ ] Code splitting
- [ ] Image optimization
- [ ] Font loading strategy
- [ ] Analytics setup

---

## 15. Technical Notes

### Custom Units
- `em-[58/16]` - Calculated em values
- `p-vw-4` - Viewport-based padding
- `--font-size-vw-8xl` - Viewport-based font sizes

### Color System
- `bg-moonlight/80` - Tailwind color with opacity
- `border-black/10` - Black with 10% opacity
- Custom color palette (likely in Tailwind config)

### Z-Index Management
- CSS custom properties for z-index (`--z-index-10`)
- Layered approach for header, modals, etc.

---

## References

- **Site**: https://daylightcomputer.com/
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + CSS Modules
- **UI Library**: Radix UI
- **Smooth Scroll**: Lenis
- **Video**: Mux
- **Analytics**: Google Tag Manager, Vercel Analytics

---

*Last Updated: Based on analysis of daylightcomputer.com architecture*











