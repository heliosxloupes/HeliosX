'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Image from 'next/image'
import Noise from '@/components/Noise'
import { addToCart, getCart } from '@/lib/cart'
// Component added by Ansh - github.com/ansh-dhanani
import GradualBlur from '@/components/GradualBlur'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ScrollReveal from '@/components/ScrollReveal'
import styles from './ProductMenu.module.css'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ProductMenuPage() {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [visibleLines, setVisibleLines] = useState<{ [key: number]: boolean[] }>({})
  const textOverlayRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const productTextLines = [
    // Galileo (index 0)
    [
      'Lightweight',
      'Modern design',
      'Variable magnification: 2.5x • 3.0x • 3.5x'
    ],
    // Newton (index 1)
    [
      'Ultra-light',
      'Comfort Designed',
      'Magnification: 2.5x • 3.0x • 3.5x'
    ],
    // Apollo (index 2)
    [
      'Next generation design',
      'Precision-engineered',
      'Ergonomic form',
      'Magnification: 3.0x • 4.0x • 5.0x • 6.0x'
    ],
    // Kepler (index 3)
    [
      'Signature Design',
      'Upgraded optics',
      'Optimized for comfort',
      'Magnification: 4.0x • 5.0x • 6.0x'
    ]
  ]

  const productImages = [
    '/Galileo/GalileoMainProduct(notext).png',
    '/Newton/NewtonMainProduct(notext).png',
    '/Apollo/ApollomainProduct(Notext).png',
    '/Keppler/KepplerMainProduct(Notext).png',
  ]

  const productTitles = ['Galileo', 'Newton', 'Apollo', 'Keppler']
  
  const productMagnifications = [
    '2.5x • 3.0x • 3.5x',  // Galileo
    '2.5x • 3.0x • 3.5x',  // Newton
    '3.0x • 4.0x • 5.0x • 6.0x',  // Apollo
    '4.0x • 5.0x • 6.0x'   // Keppler
  ]

  const productData = [
    {
      slug: 'galileo',
      name: 'Galileo Surgical Loupes',
      shortName: 'Galileo',
      price: 499,
      image: '/Galileo/GalileoMainProduct.png',
    },
    {
      slug: 'newton',
      name: 'Newton Surgical Loupes',
      shortName: 'Newton',
      price: 449,
      image: '/Newton/NewtonMainProduct.png',
    },
    {
      slug: 'apollo',
      name: 'Apollo Surgical Loupes',
      shortName: 'Apollo',
      price: 599,
      image: '/Apollo/ApollomainProduct.png',
    },
    {
      slug: 'kepler',
      name: 'Kepler Surgical Loupes',
      shortName: 'Kepler',
      price: 549,
      image: '/KepplerMainProduct.png',
    },
  ]

  const handleScrollArrowClick = () => {
    if (titleTextContainerRef.current && lenisRef.current) {
      const targetSection = titleTextContainerRef.current.closest('section')
      if (targetSection) {
        const targetPosition = targetSection.offsetTop
        lenisRef.current.scrollTo(targetPosition, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      }
    }
  }

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
    const product = productData[index]
    
    // Check if item already exists in cart
    const cart = getCart()
    const existingItem = cart.find(item => item.productSlug === product.slug)
    
    // Only add if item doesn't exist in cart (each click should only add one item)
    if (!existingItem) {
      // Mark that this item was added from the product listing page
      // This will be checked when navigating back
      sessionStorage.setItem(`added_from_product_${product.slug}`, 'true')
      
      // Add to cart with quantity 1
      addToCart({
        productSlug: product.slug,
        name: product.name,
        shortName: product.shortName,
        price: product.price,
        quantity: 1,
        image: product.image,
      })
    }

    // Navigate to product detail page after animation
    setTimeout(() => {
      // Scroll to top before navigation to ensure clean state
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      router.push(`/product/${product.slug}`)
      setSelectedIndex(null)
    }, 500) // Delay for smoother click animation
  }

  const pageRef = useRef<HTMLElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const productSectionRef = useRef<HTMLDivElement>(null)
  const productCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleTextContainerRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<SVGPathElement>(null)
  const productTitleRefs = useRef<(HTMLDivElement | null)[]>([])
  const productMagnificationRefs = useRef<(HTMLDivElement | null)[]>([])
  const galileoCardRef = useRef<HTMLDivElement>(null)

  // Track which products have started animating
  const animationStartedRef = useRef<{ [key: number]: boolean }>({})

  // Staggered reveal animation for product texts - triggered when image comes into view
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const allTimeouts: { [key: number]: NodeJS.Timeout[] } = {}

    // Create intersection observer for each image
    imageRefs.current.forEach((imageRef, productIndex) => {
      if (!imageRef) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !animationStartedRef.current[productIndex]) {
              // Mark as started
              animationStartedRef.current[productIndex] = true
              
              // Image is in view, start animating its text
              const lines = productTextLines[productIndex]
              const timeouts: NodeJS.Timeout[] = []
              
              lines.forEach((_, lineIndex) => {
                const timeout = setTimeout(() => {
                  setVisibleLines(prev => {
                    const newLines = { ...prev }
                    if (!newLines[productIndex]) {
                      newLines[productIndex] = []
                    }
                    newLines[productIndex][lineIndex] = true
                    return newLines
                  })
                }, 300 + lineIndex * 400) // 300ms initial delay, 400ms between each line
                timeouts.push(timeout)
              })
              
              allTimeouts[productIndex] = timeouts
            }
          })
        },
        {
          threshold: 0.3, // Trigger when 30% of image is visible
          rootMargin: '0px'
        }
      )

      observer.observe(imageRef)
      observers.push(observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
      Object.values(allTimeouts).forEach(timeouts => 
        timeouts.forEach(timeout => clearTimeout(timeout))
      )
    }
  }, [])


  // Refs for the 3D image layers
  const layeredImageSectionRef = useRef<HTMLDivElement>(null)
  const basexImageRef = useRef<HTMLDivElement>(null)
  const basex1ImageRef = useRef<HTMLDivElement>(null)
  const basex2ImageRef = useRef<HTMLDivElement>(null)
  const basex3ImageRef = useRef<HTMLDivElement>(null)
  const basex4ImageRef = useRef<HTMLDivElement>(null)
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const scrollArrowRef = useRef<HTMLDivElement>(null)

  // Setup Lenis and GSAP ScrollTrigger for 3D layered images
  useLayoutEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Function to set scroll limit based on final state
    const setScrollLimit = () => {
      if (layeredImageSectionRef.current && titleTextContainerRef.current && productSectionRef.current) {
        const titleSection = titleTextContainerRef.current.closest('section')
        
        // Create a ScrollTrigger to limit scrolling when "Our Loupes" reaches top left
        // Final state: "Our Loupes" fully visible at top left
        // Reduced scroll space by 100px - stop 100px earlier
        ScrollTrigger.create({
          trigger: titleSection || titleTextContainerRef.current,
          start: 'top top+=100', // Stop 100px before "Our Loupes" section reaches the top
          end: 'top top+=100',
          pin: false,
          onEnter: () => {
            // Prevent further scrolling when trigger point is reached
            lenis.stop()
          },
          onLeaveBack: () => {
            lenis.start()
          }
        })
      }
    }

    // Wait for DOM to be ready, then set scroll limit
    setTimeout(setScrollLimit, 100)
    window.addEventListener('resize', setScrollLimit)

    // RAF loop for Lenis with ScrollTrigger integration
    function raf(time: number) {
      lenis.raf(time)
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Link Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Setup GSAP ScrollTrigger for 5-layer parallax effect (similar to Trona)
    if (
      layeredImageSectionRef.current &&
      basexImageRef.current &&
      basex1ImageRef.current &&
      basex2ImageRef.current &&
      basex3ImageRef.current &&
      basex4ImageRef.current
    ) {
      // basex (background) - static or very slow movement
      // Clamped to maximum: -11.8064px
      gsap.to(basexImageRef.current, {
        y: -12, // Clamped to maximum translation
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2.0,
        },
      })

      // basex4 (bottom layer) - slowest parallax movement
      // Clamped to maximum: -35.4192px
      gsap.to(basex4ImageRef.current, {
        y: -35, // Clamped to maximum translation
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8,
        },
      })

      // base3.5x (middle-bottom layer) - moderate movement
      // Clamped to maximum: -59.032px
      gsap.to(basex3ImageRef.current, {
        y: -59, // Clamped to maximum translation
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // basex2 (middle-top layer) - faster movement
      // Clamped to maximum: -82.6448px
      gsap.to(basex2ImageRef.current, {
        y: -83, // Clamped to maximum translation
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      // basex1 (top layer) - fastest movement
      // Clamped to maximum: -106.258px
      gsap.to(basex1ImageRef.current, {
        y: -106, // Clamped to maximum translation
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0,
        },
      })

      // Logo animation - translates up when scrolling
      if (logoContainerRef.current) {
        gsap.to(logoContainerRef.current, {
          y: -200, // Increased from -100px for more movement
          ease: 'none',
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

    }

    // ScrollReveal handles its own animation internally
    
    // Animate arrow being drawn
    if (arrowRef.current && titleTextContainerRef.current) {
      const arrow = arrowRef.current
      const container = titleTextContainerRef.current
      
      // Get the total length of the arrow path
      const pathLength = arrow.getTotalLength()
      
      // Set initial state - arrow is invisible (stroke-dasharray and stroke-dashoffset)
      gsap.set(arrow, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 0
      })
      
      // Animate arrow being drawn and fading in
      gsap.to(arrow, {
        strokeDashoffset: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'top 65%',
          scrub: 1.2,
          onEnter: () => {
            gsap.set(arrow, { strokeDashoffset: 0, opacity: 1 })
          },
          onLeave: () => {
            gsap.set(arrow, { strokeDashoffset: 0, opacity: 1 })
          },
          onEnterBack: () => {
            gsap.set(arrow, { strokeDashoffset: 0, opacity: 1 })
          }
        },
      })
    }

    // Product cards - Grow in from below animation
    if (productSectionRef.current && productCardRefs.current.length > 0) {
      const section = productSectionRef.current
      const cards = productCardRefs.current.filter(Boolean) as HTMLDivElement[]

      cards.forEach((card, index) => {
        if (!card) return

        // Set initial state - start invisible, scaled down, and positioned below
        gsap.set(card, {
          opacity: 0,
          scale: 0.3,
          y: 100, // Start 100px below
        })

        // Calculate stagger - reduced delay for faster, smoother animation
        const startOffset = index * 2 // 2% viewport offset for less delay

        // Animate card growing in from below with smooth ease
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: `top ${85 - startOffset}%`, // Staggered start points
            end: `top ${70 - startOffset}%`,
            scrub: 0.8, // Smoother, more responsive scroll-based animation
            onEnter: () => {
              // Keep visible after animation
              if (index === cards.length - 1) {
                cards.forEach(c => {
                  if (c) gsap.set(c, { opacity: 1, scale: 1, y: 0 })
                })
              }
            },
            onLeave: () => {
              // Keep visible when scrolling past
              gsap.set(card, { opacity: 1, scale: 1, y: 0 })
            },
            onEnterBack: () => {
              // Keep visible when scrolling back up
              gsap.set(card, { opacity: 1, scale: 1, y: 0 })
            }
          },
        })
      })
    }

    // Animate product title texts - smooth scroll-based animation with Lenis
    // Animations trigger when scrolling to the bottom of the page
    if (productSectionRef.current && productTitleRefs.current.length > 0) {
      const section = productSectionRef.current
      const titles = productTitleRefs.current.filter(Boolean) as HTMLHeadingElement[]
      const magnifications = productMagnificationRefs.current.filter(Boolean) as HTMLParagraphElement[]

      titles.forEach((title, index) => {
        if (!title) return

        // Get the corresponding product card
        const card = productCardRefs.current[index]
        if (!card) return

        // Set initial state - start invisible and slightly below
        gsap.set(title, {
          opacity: 0,
          y: 30,
        })

        // Animate title appearing (fade in and slide up) - smooth scroll-based
        gsap.to(title, {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%', // Start when card is 85% down the viewport
            end: 'top 50%', // Complete when card reaches 50% of viewport
            scrub: 1, // Smooth scroll-based animation (lower = more responsive)
            markers: false, // Set to true for debugging
            onEnter: () => {
              // Ensure it stays visible after animation
              gsap.set(title, { opacity: 1, y: 0 })
            },
            onLeave: () => {
              gsap.set(title, { opacity: 1, y: 0 })
            },
            onEnterBack: () => {
              gsap.set(title, { opacity: 1, y: 0 })
            }
          },
        })

        // Animate magnification text (fade in and slide from left)
        const magnification = magnifications[index]
        if (magnification) {
          gsap.set(magnification, {
            opacity: 0,
            x: -30,
          })
          
          gsap.to(magnification, {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            duration: 1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
              onEnter: () => {
                gsap.set(magnification, { opacity: 1, x: 0 })
              },
              onLeave: () => {
                gsap.set(magnification, { opacity: 1, x: 0 })
              },
              onEnterBack: () => {
                gsap.set(magnification, { opacity: 1, x: 0 })
              }
            },
          })
        }
      })
    }

    return () => {
      window.removeEventListener('resize', setScrollLimit)
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <>
      <Header />
      <main ref={pageRef} className={styles.productMenuPage}>
        {/* 3D Layered Images Section - Full Viewport */}
        <section 
          ref={layeredImageSectionRef}
          className={styles.layeredImageSection}
        >
          <div className={styles.layeredImageContainer}>
            {/* Tronaeast-style fade overlay - blends into background */}
            <div className={styles.tronaeastFadeOverlay}></div>
            
            {/* basex - Main background image (lowest layer) */}
            <div 
              ref={basexImageRef}
              className={styles.layeredImageLayer}
              style={{ zIndex: 0 }}
            >
              <Image
                src="/basex.png"
                alt="Basex background"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            {/* basex4.5 - Bottom parallax layer */}
            <div 
              ref={basex4ImageRef}
              className={styles.layeredImageLayer}
              style={{ zIndex: 1 }}
            >
              <Image
                src="/basex4.5.png"
                alt="Basex4.5 layer"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            {/* base3.5x - Middle-bottom parallax layer */}
            <div 
              ref={basex3ImageRef}
              className={styles.layeredImageLayer}
              style={{ zIndex: 2 }}
            >
              <Image
                src="/base3.5x.png"
                alt="Base3.5x layer"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            {/* basex2 - Middle-top parallax layer */}
            <div 
              ref={basex2ImageRef}
              className={styles.layeredImageLayer}
              style={{ zIndex: 3 }}
            >
              <Image
                src="/basex2.png"
                alt="Basex2 layer"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            {/* basex1 - Top parallax layer (highest, most bottom of image visually) */}
            <div 
              ref={basex1ImageRef}
              className={styles.layeredImageLayer}
              style={{ zIndex: 4 }}
            >
              <Image
                src="/basex1.png"
                alt="Basex1 layer"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            {/* HeliosX Logo Container - positioned above basex4, below basex2 layer */}
            <div 
              ref={logoContainerRef}
              className={styles.logoInLayeredContainer}
              style={{ zIndex: 2 }}
            >
              <div className={styles.upscaledLogoStack}>
                <Image
                  src="/UpscaledLogoNew.png"
                  alt="HeliosX Logo"
                  width={400}
                  height={400}
                  className={styles.upscaledLogoImage}
                  quality={100}
                  style={{
                    width: 'auto',
                    height: '320px',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
            </div>

            {/* Scroll Indicator Arrow - Bottom Center */}
            <div 
              ref={scrollArrowRef}
              className={styles.scrollIndicatorArrow}
              onClick={handleScrollArrowClick}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </section>

        {/* Title Text Section - "Our Loupes" with ScrollReveal */}
        <section className={styles.titleTextSection}>
          <div className={styles.titleTextContainer} ref={titleTextContainerRef}>
            <ScrollReveal
              scrollContainerRef={null}
              enableBlur={true}
              baseOpacity={0.1}
              baseRotation={3}
              blurStrength={4}
              containerClassName={styles.titleText}
              textClassName={styles.titleTextContent}
              rotationEnd="center center"
              wordAnimationEnd="center center"
            >
              Our Loupes
            </ScrollReveal>
            {/* Animated Arrow */}
            <svg className={styles.titleArrow} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                ref={arrowRef}
                d="M12 4 L12 20 M8 16 L12 20 L16 16"
                stroke="#111111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </section>

        {/* Product Cards Section */}
        <div className={styles.menuContainer} ref={productSectionRef}>
          {/* Product Images Container */}
          <div className={styles.productImagesContainer}>
            {productImages.map((imageSrc, index) => {
              const isHovered = hoveredIndex === index
              const isSelected = selectedIndex === index
              
              return (
              <div
                key={index}
                ref={(el) => { 
                  imageRefs.current[index] = el
                  productCardRefs.current[index] = el
                }}
                className={`${styles.productImageWrapper} ${isHovered ? styles.productImageWrapperHovered : ''} ${isSelected ? styles.productImageWrapperSelected : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleImageClick(index)}
              >
                {/* Glow effect */}
                <div className={styles.productImageGlow}></div>
                <div className={`${styles.productImageFade} ${styles.productImageShadow}`}>
                  <div className={`${styles.productImageInner} ${styles.productImageDark} ${index === 0 ? styles.productImageBright : ''}`}>
                    <Image
                      src={imageSrc}
                      alt={`Product ${index + 1}`}
                      width={600}
                      height={400}
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                      priority={index === 0}
                    />
                    <div className={styles.productImageDarkOverlay}></div>
                    <div className={styles.productImageRetroOverlay}></div>
                    <div className={styles.productImageNoise}>
                      <Noise
                        patternSize={250}
                        patternScaleX={1}
                        patternScaleY={1}
                        patternRefreshInterval={2}
                        patternAlpha={25}
                      />
                    </div>
                    {/* Product Title Container */}
                    <div className={styles.productTitleContainer}>
                      <h1 
                        ref={(el) => { productTitleRefs.current[index] = el }}
                        className={styles.productTitle}
                      >
                        {productTitles[index]}
                      </h1>
                      <p 
                        ref={(el) => { productMagnificationRefs.current[index] = el }}
                        className={styles.productMagnificationText}
                      >
                        {productMagnifications[index]}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Text Overlay - Hidden for now */}
                <div 
                  ref={(el) => { textOverlayRefs.current[index] = el }}
                  className={styles.productTextOverlay}
                  style={{
                    display: 'none'
                  }}
                >
                  <div className={styles.productTextContent}>
                    {productTextLines[index].map((line, lineIdx) => (
                      <div 
                        key={lineIdx} 
                        className={`${styles.productTextLine} ${visibleLines[index]?.[lineIdx] ? styles.productTextLineVisible : ''}`}
                        style={{ '--line-index': lineIdx } as React.CSSProperties}
                      >
                        <span className={styles.productTextLineInner}>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>

      </main>
    </>
  )
}
