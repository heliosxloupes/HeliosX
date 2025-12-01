'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Image from 'next/image'
import LightRays from '@/components/LightRays'
import Noise from '@/components/Noise'
import { addToCart, getCart } from '@/lib/cart'
// Component added by Ansh - github.com/ansh-dhanani
import GradualBlur from '@/components/GradualBlur'
import styles from './ProductMenu.module.css'

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
    '/Galileo/GalileoMainProduct.png',
    '/Newton/NewtonMainProduct.png',
    '/Apollo/ApollomainProduct.png',
    '/Keppler/KepplerMainProduct.png',
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

  const [scrollProgress, setScrollProgress] = useState(0)
  const pageRef = useRef<HTMLElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

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

  // Scroll-based animation for all text overlays (matches image behavior)
  useEffect(() => {
    const handleScroll = () => {
      textOverlayRefs.current.forEach((textOverlayRef, index) => {
        if (!textOverlayRef) return
        
        // Use the same transform logic as each image
        const imageProgress = scrollProgress - index

        // Same logic as getImageTransform: starts moving up after 30% scroll
        if (imageProgress < 0.3) {
          textOverlayRef.style.transform = 'translateY(-50%)'
          textOverlayRef.style.opacity = '1'
        } else if (imageProgress >= 0.3 && imageProgress < 0.7) {
          const moveProgress = (imageProgress - 0.3) / 0.4 // 0 to 1
          const translateY = -moveProgress * 120 // Move up 120vh
          const opacity = 1 - moveProgress
          textOverlayRef.style.transform = `translateY(calc(-50% + ${translateY}vh))`
          textOverlayRef.style.opacity = String(Math.max(0, opacity))
        } else {
          // After 70% scroll, fully faded and moved up
          textOverlayRef.style.transform = 'translateY(calc(-50% + -120vh))'
          textOverlayRef.style.opacity = '0'
        }
      })
    }

    // Use requestAnimationFrame for smoother animation
    let rafId: number
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [scrollProgress])

  // Calculate scroll progress for the page (similar to homepage)
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!pageRef.current) return

        const windowHeight = window.innerHeight
        const scrollPosition = window.scrollY
        const pageStart = pageRef.current.offsetTop
        const pageHeight = pageRef.current.scrollHeight
        const scrollableHeight = Math.max(pageHeight - windowHeight, windowHeight * (productImages.length - 0.5))

        // Calculate progress (0 to ~productImages.length range)
        // Each image gets a scroll range
        const progress = scrollableHeight > 0 
          ? Math.min(productImages.length, Math.max(0, ((scrollPosition - pageStart) / scrollableHeight) * productImages.length))
          : 0
        setScrollProgress(progress)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [productImages.length])

  // Calculate transform for each image based on scrollProgress - same as homepage main image
  const getImageTransform = (index: number) => {
    // Each image has its own scroll progress range based on its position
    // Image 0: progress 0-1, Image 1: progress 1-2, etc.
    const imageProgress = scrollProgress - index

    // Same logic as homepage getDeviceTransform: starts moving up after 30% scroll
    if (imageProgress < 0.3) {
      return { transform: 'translateY(0)', opacity: 1, translateY: 0, translateYValue: 0 }
    }
    
    // Image moves up and fades out between 30% and 70% (same as homepage: 0.3 to 0.7)
    if (imageProgress >= 0.3 && imageProgress < 0.7) {
      const moveProgress = (imageProgress - 0.3) / 0.4 // 0 to 1
      const translateY = -moveProgress * 120 // Move up 120vh (same as homepage)
      const opacity = 1 - moveProgress
      
      return {
        transform: `translateY(${translateY}vh)`,
        opacity: Math.max(0, opacity),
        translateY: translateY,
        translateYValue: translateY
      }
    }
    
    // After 70% scroll, fully faded and moved up
    return {
      transform: `translateY(-120vh)`,
      opacity: 0,
      translateY: -120,
      translateYValue: -120
    }
  }

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <Header />
      <main ref={pageRef} className={styles.productMenuPage}>
        {/* LightRays Background */}
        <div className={styles.lightRaysBackground}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={1}
            rayLength={2}
            pulsating={false}
            fadeDistance={2}
            saturation={1.0}
            followMouse={true}
            mouseInfluence={0.1}
          />
        </div>

        {/* GradualBlur Component at Top - added by Ansh - github.com/ansh-dhanani */}
        <GradualBlur
          target="page"
          position="top"
          height="6rem"
          strength={4.5}
          divCount={10}
          curve="bezier"
          exponential={true}
          opacity={1}
        />

        <div className={styles.menuContainer}>
          {/* Text Overlay - Left Side */}
          <div className={styles.productPageTextOverlay}>
            <h1 className={styles.productPageHeadline}>
              Clarity without compromise.
            </h1>
            <p className={styles.productPageSubheadline}>
              Premium surgical loupes without the predatory price tag.
            </p>
            <div className={styles.logoContainer}>
              <div className={styles.logoStack}>
                <Image
                  src="/LogoMinimal.png"
                  alt="HeliosX Logo"
                  width={200}
                  height={200}
                  className={styles.logoImage}
                  style={{
                    width: 'auto',
                    height: '320px',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Images Container */}
          <div className={styles.productImagesContainer}>
            {productImages.map((imageSrc, index) => {
              const imageTransform = getImageTransform(index)
              const isHovered = hoveredIndex === index
              const isSelected = selectedIndex === index
              
              // Combine scroll transform with hover effect
              let combinedTransform = imageTransform.transform
              if (isHovered && !isSelected) {
                const currentY = imageTransform.translateYValue || 0
                // Use transform to add hover offset while preserving scroll position
                combinedTransform = `translateY(${currentY}vh) translateY(-8px) scale(1.02)`
              } else if (isSelected) {
                const currentY = imageTransform.translateYValue || 0
                combinedTransform = `translateY(${currentY}vh) scale(0.98)`
              }
              
              return (
              <div
                key={index}
                ref={(el) => { imageRefs.current[index] = el }}
                className={`${styles.productImageWrapper} ${isHovered ? styles.productImageWrapperHovered : ''} ${isSelected ? styles.productImageWrapperSelected : ''}`}
                style={{
                  transform: combinedTransform,
                  opacity: imageTransform.opacity,
                  transition: isSelected 
                    ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out'
                    : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleImageClick(index)}
              >
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
                  </div>
                </div>
                {/* Animated Text Overlay - Right side for each product */}
                <div 
                  ref={(el) => { textOverlayRefs.current[index] = el }}
                  className={styles.productTextOverlay}
                  style={{
                    right: index === 0 ? '-50rem' : 
                           index === 1 ? '-40rem' : 
                           index === 2 ? '-50rem' : 
                           '-40rem'
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

        {/* Scroll Down Indicator */}
        <button 
          className={styles.scrollIndicator}
          onClick={handleScrollDown}
          aria-label="Scroll down"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {/* GradualBlur Component - added by Ansh - github.com/ansh-dhanani */}
        <GradualBlur
          target="page"
          position="bottom"
          height="6rem"
          strength={4.5}
          divCount={10}
          curve="bezier"
          exponential={true}
          opacity={1}
        />
      </main>
    </>
  )
}
