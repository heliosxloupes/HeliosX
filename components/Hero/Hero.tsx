'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Noise from '../Noise'
import MagicBento, { BentoCardProps } from '../MagicBento'
import BlurText from '../BlurText'
import ColorBends from '../ColorBends'
import styles from './Hero.module.css'

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [firstTextWords, setFirstTextWords] = useState<string[]>([])
  const [secondTextWords, setSecondTextWords] = useState<string[]>([])
  const [showSecondText, setShowSecondText] = useState(false)
  const [showDevice2, setShowDevice2] = useState(false)
  const [showImageGrid, setShowImageGrid] = useState(false)
  const [showFinalSection, setShowFinalSection] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [headlineAnimationComplete, setHeadlineAnimationComplete] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const heroRef = useRef<HTMLElement>(null)
  const firstTextRef = useRef<HTMLDivElement>(null)
  const secondTextRef = useRef<HTMLDivElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  const firstText = "Born in the operating room, built to defy industry greed—HeliosX makes surgical precision accessible to all."
  const secondText = "Introducing HeliosX- a new standard in surgical optics—engineered for performance, priced for reality."
  
  const firstWords = firstText.split(' ')
  const secondWords = secondText.split(' ')

  // Magic Bento cards for Dive Deeper section
  const diveDeeperCards: BentoCardProps[] = [
    {
      color: '#050816',
      title: 'Our Loupes',
      description: '',
      label: '',
      href: '/product',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Loupes/Glasses icon */}
          <ellipse cx="30" cy="50" rx="18" ry="12" />
          <ellipse cx="70" cy="50" rx="18" ry="12" />
          <line x1="48" y1="50" x2="52" y2="50" />
          <line x1="12" y1="50" x2="20" y2="50" strokeWidth="2" />
          <line x1="80" y1="50" x2="88" y2="50" strokeWidth="2" />
          {/* Loupe attachments */}
          <path d="M 30 38 Q 30 30 38 30 Q 42 28 45 32" />
          <path d="M 70 38 Q 70 30 62 30 Q 58 28 55 32" />
          {/* Small circles for lenses */}
          <circle cx="30" cy="50" r="8" fill="none" strokeWidth="1.5" />
          <circle cx="70" cy="50" r="8" fill="none" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      color: '#050816',
      title: 'Technical Specs',
      description: '',
      label: '',
      href: '/product',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Specs/Document with gear icon */}
          <path d="M 28 22 Q 25 20 25 25 L 25 75 Q 25 78 28 80 L 72 80 Q 75 78 75 75 L 75 25 Q 75 22 72 20 Z" />
          <line x1="35" y1="35" x2="62" y2="35" />
          <line x1="35" y1="45" x2="62" y2="45" />
          <line x1="35" y1="55" x2="55" y2="55" />
          {/* Gear/Specs icon on the side */}
          <circle cx="68" cy="32" r="7" fill="none" />
          <circle cx="68" cy="32" r="4" fill="none" strokeWidth="1.5" />
          <line x1="68" y1="25" x2="68" y2="27" strokeWidth="2" />
          <line x1="68" y1="37" x2="68" y2="39" strokeWidth="2" />
          <line x1="61" y1="32" x2="63" y2="32" strokeWidth="2" />
          <line x1="73" y1="32" x2="75" y2="32" strokeWidth="2" />
          <line x1="64" y1="26" x2="65" y2="28" strokeWidth="1.5" />
          <line x1="72" y1="38" x2="71" y2="36" strokeWidth="1.5" />
          <line x1="72" y1="26" x2="71" y2="28" strokeWidth="1.5" />
          <line x1="64" y1="38" x2="65" y2="36" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      color: '#050816',
      title: 'About',
      description: '',
      label: '',
      href: '/faq',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* FAQ/Speech bubbles icon */}
          <path d="M 30 28 Q 25 25 30 22 L 48 22 Q 58 22 58 32 L 58 48 Q 58 58 48 58 L 38 58 L 28 68 L 28 58 Q 25 58 25 55 L 25 48 Q 25 38 30 35 Z" />
          <circle cx="38" cy="38" r="2.5" fill="currentColor" />
          <circle cx="48" cy="38" r="2.5" fill="currentColor" />
          <circle cx="43" cy="48" r="2.5" fill="currentColor" />
          <path d="M 62 42 Q 60 38 65 38 L 78 38 Q 82 38 82 42 L 82 55 Q 82 59 78 59 L 72 59 L 68 66 L 68 59 Q 66 59 66 57 L 66 55 Q 66 51 62 48 Z" />
          <circle cx="70" cy="46" r="1.5" fill="currentColor" />
          <circle cx="74" cy="46" r="1.5" fill="currentColor" />
          <circle cx="72" cy="52" r="1.5" fill="currentColor" />
        </svg>
      )
    },
    {
      color: '#050816',
      title: 'Support',
      description: '',
      label: '',
      href: '/faq',
      icon: (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Support/Device with question mark icon */}
          <rect x="28" y="22" width="44" height="52" rx="3" />
          <rect x="32" y="26" width="36" height="44" rx="2" fill="rgba(255,255,255,0.1)" />
          {/* Question mark bubble */}
          <circle cx="50" cy="38" r="5" fill="none" />
          <path d="M 50 45 Q 50 48 47 48 Q 45 48 45 50" />
          <line x1="45" y1="55" x2="45" y2="58" strokeWidth="2" />
          {/* Support lines/interface elements */}
          <line x1="38" y1="60" x2="62" y2="60" strokeWidth="1.5" />
          <line x1="38" y1="65" x2="55" y2="65" strokeWidth="1.5" />
        </svg>
      )
    }
  ]

  useEffect(() => {
    let rafId: number | null = null
    
    const handleScroll = () => {
      if (rafId) return // Skip if already scheduled
      
      rafId = requestAnimationFrame(() => {
        if (!heroRef.current) {
          rafId = null
          return
        }

        const rect = heroRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const heroHeight = rect.height
        
        // Calculate scroll progress (0 to 1.6 - includes 5 circles + dive deeper section)
        // Progress increases as we scroll through the hero section
        const scrollPosition = window.scrollY
        const heroStart = heroRef.current.offsetTop
        const scrollableHeight = heroHeight - windowHeight
        
        // Normalize progress so that when we reach the end of scrollable area, progress = 1.6
        // Progress 1.0-1.5: circles panning, 1.5-1.6: dive deeper section slides in (fast transition)
        const progress = scrollableHeight > 0 
          ? Math.min(1.6, Math.max(0, ((scrollPosition - heroStart) / scrollableHeight) * 1.6))
          : 0
        setScrollProgress(progress)

        // First text: appears word by word from 0.4 to 0.6
        if (progress >= 0.4 && progress <= 0.6) {
          const wordProgress = (progress - 0.4) / 0.2 // 0 to 1
          const wordIndex = Math.floor(wordProgress * firstWords.length)
          const visibleWords = firstWords.slice(0, Math.min(wordIndex + 1, firstWords.length))
          setFirstTextWords(visibleWords)
          setShowSecondText(false)
        } else if (progress > 0.6 && progress <= 0.82) {
          // Extended transition period - keep first text visible
          // Allow "accessible to all" to fully transform red (0.6-0.69)
          // Then hold for additional scroll time (0.69-0.82) before transitioning
          setFirstTextWords(firstWords)
          setShowSecondText(false)
        } else if (progress > 0.82 && progress <= 0.95) {
          // Second text: appears word by word from 0.82 to 0.95 (slower animation, more delayed start)
          setFirstTextWords([])
          setShowSecondText(true)
          const wordProgress = (progress - 0.82) / 0.13 // 0 to 1 (slower animation over 0.13 scroll progress)
          const wordIndex = Math.floor(wordProgress * secondWords.length)
          const visibleWords = secondWords.slice(0, Math.min(wordIndex + 1, secondWords.length))
          setSecondTextWords(visibleWords)
        } else if (progress > 0.95 && progress <= 1.05) {
          // Show all second text, then transition to device2
          setSecondTextWords(secondWords)
          setShowDevice2(false)
        } else if (progress > 1.05 && progress <= 1.15) {
          // Device2 appears and moves in
          setSecondTextWords([])
          setShowSecondText(false)
          setShowDevice2(true)
        } else {
          // Before 40% or after 1.15
          if (progress < 0.4 || progress > 1.15) {
            setFirstTextWords([])
            setSecondTextWords([])
            setShowSecondText(false)
          }
          if (progress < 1.05) {
            setShowDevice2(false)
          }
        }
        
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  // Calculate device color: black (0) → gray (1)
  const getDeviceColor = () => {
    // Transition happens in first 50% of scroll
    const colorProgress = Math.min(1, scrollProgress * 2)
    const grayValue = Math.round(colorProgress * 200) // 0 (black) to 200 (light gray)
    return `rgb(${grayValue}, ${grayValue}, ${grayValue})`
  }

  // Calculate device position and opacity
  const getDeviceTransform = () => {
    // Device starts moving up after 30% scroll
    if (scrollProgress < 0.3) {
      return { transform: 'translate(-50%, -50%)', opacity: 1, translateY: 0 }
    }
    
    // Device moves up and fades out between 30% and 70%
    // This ensures device is fully gone before text finishes animating
    const moveProgress = Math.min(1, (scrollProgress - 0.3) / 0.4)
    const translateY = -moveProgress * 120 // Move up 120vh to ensure it's completely off screen
    const opacity = 1 - moveProgress
    
    return {
      transform: `translate(-50%, calc(-50% + ${translateY}vh))`,
      opacity: Math.max(0, opacity),
      translateY: translateY
    }
  }

  // Calculate video and order button transform (anchored to device 1)
  const getAnchoredElementsTransform = () => {
    const deviceTransform = getDeviceTransform()
    return {
      opacity: deviceTransform.opacity,
      translateY: deviceTransform.translateY || 0
    }
  }

  // Calculate device2 color: black (0) → gray (1) - same as device1
  const getDevice2Color = () => {
    if (!showDevice2 || scrollProgress < 1.05) {
      return `rgb(0, 0, 0)` // Start black
    }
    // Color transition happens during device2's visibility (1.05 to 1.15)
    const colorProgress = Math.min(1, (scrollProgress - 1.05) / 0.1) // Normalize to 0-1
    const grayValue = Math.round(colorProgress * 200) // 0 (black) to 200 (light gray)
    return `rgb(${grayValue}, ${grayValue}, ${grayValue})`
  }

  // Calculate device2 position (slides in from right, then continues left)
  const getDevice2Transform = () => {
    if (!showDevice2 || scrollProgress < 1.05) {
      return { transform: 'translate(50vw, -50%)', opacity: 0 }
    }
    // Device2 slides in from 1.05 to 1.1
    if (scrollProgress >= 1.05 && scrollProgress <= 1.1) {
      const slideProgress = (scrollProgress - 1.05) / 0.05
      const translateX = 50 - (slideProgress * 50) // Start at 50vw (right edge), end at 0 (center)
      return {
        transform: `translate(calc(-50% + ${translateX}vw), -50%)`,
        opacity: slideProgress
      }
    }
    // Device2 continues moving left from 1.1 to 1.15
    const moveProgress = (scrollProgress - 1.1) / 0.05
    const translateX = 0 - (moveProgress * 100) // Move from 0 to -100vw (off screen left)
    return {
      transform: `translate(calc(-50% + ${translateX}vw), -50%)`,
      opacity: 1 - (moveProgress * 0.5) // Fade out as it moves left
    }
  }

  // Calculate images container position - pans horizontally to reveal all 3 images
  const getCirclesContainerTransform = () => {
    // Image1 should start appearing as device2 moves left (1.1 to 1.15)
    if (scrollProgress < 1.1) {
      return { transform: 'translateX(0) translateY(-50%)', opacity: 0 }
    }
    // Image1 slides in from right (1.1 to 1.15)
    if (scrollProgress >= 1.1 && scrollProgress <= 1.15) {
      const slideProgress = (scrollProgress - 1.1) / 0.05
      const translateX = 50 - (slideProgress * 50) // Start at 50vw (right edge), end at 0 (center)
      return {
        transform: `translateX(${translateX}vw) translateY(-50%)`,
        opacity: slideProgress
      }
    }
    // After image1 is centered, pan left to reveal images 2 and 3 (1.15 to 1.5)
    if (scrollProgress >= 1.15 && scrollProgress <= 1.5) {
      const panProgress = Math.min(1, (scrollProgress - 1.15) / 0.35)
      // Reduced pan distance so image 1 and 2 fit on same page
      const translateX = 0 - (panProgress * 100) // Move from 0 to -100vw to reveal images 2 and 3
      return {
        transform: `translateX(${translateX}vw) translateY(-50%)`,
        opacity: 1
      }
    }
    // After image 3 is centered, fade out images as dive deeper section slides in (1.5 to 1.55)
    if (scrollProgress > 1.5 && scrollProgress <= 1.55) {
      const fadeProgress = (scrollProgress - 1.5) / 0.05 // Faster fade out
      return {
        transform: `translateX(-100vw) translateY(-50%)`,
        opacity: 1 - fadeProgress
      }
    }
    // After fade out, keep images hidden
    return {
      transform: `translateX(-100vw) translateY(-50%)`,
      opacity: 0
    }
  }

  // Calculate dive deeper section transform - slides in from bottom
  const getDiveDeeperTransform = () => {
    // Start sliding in after circle 5 is centered (1.5 to 1.6) - fast transition with minimal scrolling
    if (scrollProgress < 1.5) {
      return { transform: 'translateY(100%)', opacity: 0, isFullyVisible: false }
    }
    if (scrollProgress >= 1.5 && scrollProgress <= 1.6) {
      const slideProgress = (scrollProgress - 1.5) / 0.1 // Reduced from 0.3 to 0.1 for faster transition
      const translateY = 100 - (slideProgress * 100) // Start at 100% (below screen), end at 0% (on screen)
      const opacity = Math.min(1, slideProgress)
      return {
        transform: `translateY(${translateY}%)`,
        opacity: opacity,
        isFullyVisible: opacity >= 0.99
      }
    }
    // After fully visible, keep it on screen
    return {
      transform: 'translateY(0%)',
      opacity: 1,
      isFullyVisible: true
    }
  }


  const deviceColor = getDeviceColor()
  const deviceTransform = getDeviceTransform()
  const anchoredElements = getAnchoredElementsTransform()
  const device2Color = getDevice2Color()
  const circlesContainerTransform = getCirclesContainerTransform()
  const diveDeeperTransform = getDiveDeeperTransform()
  
  // Only show Galaxy when section is fully visible
  const isDiveDeeperFullyVisible = diveDeeperTransform.isFullyVisible || diveDeeperTransform.opacity >= 0.99

  // Auto-play modal video when it opens
  useEffect(() => {
    if (showVideoModal && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {})
    } else if (!showVideoModal && modalVideoRef.current) {
      modalVideoRef.current.pause()
      modalVideoRef.current.currentTime = 0
    }
  }, [showVideoModal])

  return (
    <section ref={heroRef} id="hero-section" className={styles.hero}>
      {/* Full-screen background */}
      <div className={styles.background} />
      
      {/* Rectangular Device/Screen */}
      <div 
        className={styles.device}
        style={{
          backgroundColor: 'transparent',
          transform: deviceTransform.transform,
          opacity: deviceTransform.opacity,
          transition: 'transform 0.4s ease-out, opacity 0.4s ease-out'
        }}
      >
        <div className={styles.deviceScreen}>
          <Image
            src="/Homepage1NEW.jpg"
            alt="Woman surgeon"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          {/* Logo - Top Left */}
          <div className={styles.homeLogoContainer}>
            <Image
              src="/logominimalnowriting.png"
              alt="HeliosX Logo"
              width={60}
              height={60}
              style={{ objectFit: 'contain' }}
            />
          </div>
          {/* Text Overlay - Top Left */}
          <div className={styles.imageTextOverlay}>
            <BlurText 
              text="Clarity without compromise."
              className={styles.imageHeadline}
              animateBy="words"
              direction="top"
              delay={100}
              onAnimationComplete={() => setHeadlineAnimationComplete(true)}
            />
            {headlineAnimationComplete && (
              <BlurText 
                key="subheadline"
                text="Premium surgical loupes—without the predatory price tag."
                className={styles.imageSubheadline}
                animateBy="words"
                direction="top"
                delay={100}
              />
            )}
          </div>
          {/* Scroll Indicator Arrow - Bottom Center */}
          <div className={styles.scrollIndicatorArrow}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF9B00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        {/* Noise overlay on device */}
        <div className={styles.deviceNoise}>
          <Noise 
            patternSize={250}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={2}
            patternAlpha={3}
          />
        </div>
      </div>

      {/* Video Thumbnail - Bottom Left (anchored to device 1) */}
      <div 
        className={styles.videoThumbnail}
        style={{
          opacity: anchoredElements.opacity,
          transform: `translateY(${anchoredElements.translateY}vh)`,
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
        }}
        onClick={() => setShowVideoModal(true)}
      >
        <div className={styles.videoThumbnailInner}>
          <video
            className={styles.videoPlayer}
            src="/mainpagevideo.mp4"
            loop
            muted
            playsInline
            onMouseEnter={(e) => {
              const video = e.currentTarget
              video.play().catch(() => {})
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget
              video.pause()
              video.currentTime = 0
            }}
          />
          {/* Play Button Overlay */}
          <div className={styles.playButtonOverlay}>
            <div className={styles.playButton}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div 
          className={styles.videoModal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVideoModal(false)
            }
          }}
        >
          <div className={styles.videoModalContent}>
            <button 
              className={styles.videoModalClose}
              onClick={() => setShowVideoModal(false)}
              aria-label="Close video"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <video
              ref={modalVideoRef}
              className={styles.videoModalPlayer}
              src="/mainpagevideo.mp4"
              loop
              muted
              playsInline
              autoPlay
              controls
            />
          </div>
        </div>
      )}


      {/* First Text - Word by word animation */}
      <div 
        ref={firstTextRef}
        className={styles.animatedText}
        style={{
          opacity: scrollProgress >= 0.4 && scrollProgress <= 0.82 ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease-in'
        }}
      >
        <div className={styles.textContainer}>
          {firstWords.map((word, index) => {
            const isVisible = firstTextWords.length > index
            // "accessible to all" are the last 3 words (indices: length-3, length-2, length-1)
            const isAccessibleToAll = index >= firstWords.length - 3
            // Calculate which word in the sequence (0 = "accessible", 1 = "to", 2 = "all")
            const wordPositionInSequence = isAccessibleToAll ? (index - (firstWords.length - 3)) : -1
            // Transform to red progressively from left to right when scroll reaches end of first text animation
            // Start at 0.6, each word transitions over 0.03 scroll progress (staggered)
            const redTransitionStart = 0.6
            const redTransitionDelay = 0.03 // Delay between each word turning red
            const wordRedStart = redTransitionStart + (wordPositionInSequence * redTransitionDelay)
            const shouldBeRed = isAccessibleToAll && scrollProgress >= wordRedStart
            return (
              <span
                key={`first-${index}`}
                className={styles.wordWrapper}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.4s ease-out ${index * 0.03}s, transform 0.4s ease-out ${index * 0.03}s, color 0.5s ease-in-out`
                }}
              >
                <span 
                  className={styles.textWord}
                  style={{
                    color: shouldBeRed ? '#dc2626' : undefined, // Red color when animation completes
                  }}
                >
                  {word}
                </span>
                {index < firstWords.length - 1 && '\u00A0'}
              </span>
            )
          })}
        </div>
      </div>

      {/* Second Text - Word by word animation */}
      <div 
        ref={secondTextRef}
        className={styles.animatedText}
        style={{
          opacity: showSecondText && scrollProgress >= 0.82 && scrollProgress <= 0.98 ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease-in'
        }}
      >
        <div className={styles.textContainer}>
          {secondWords.map((word, index) => {
            const isVisible = secondTextWords.length > index
            return (
              <span
                key={`second-${index}`}
                className={styles.wordWrapper}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.4s ease-out ${index * 0.03}s, transform 0.4s ease-out ${index * 0.03}s`
                }}
              >
                <span className={styles.textWord}>
                  {word}
                </span>
                {index < secondWords.length - 1 && '\u00A0'}
              </span>
            )
          })}
        </div>
      </div>

      {/* Device 2 - Slides in from right */}
      {showDevice2 && (
        <div 
          className={styles.device2}
          style={{
            backgroundColor: 'transparent',
            ...getDevice2Transform(),
            transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
          }}
        >
          <div className={styles.device2Screen}>
            <Image
              src="/TeamworkNew.png"
              alt="Teamwork"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Text overlay at bottom left */}
            <div className={styles.device2TextOverlay}>
              <p className={styles.device2Text}>
                Unmatched Quality, Finally Affordable.
              </p>
            </div>
            {/* Icons overlay at bottom right */}
            <div className={styles.device2IconsOverlay}>
              <div className={styles.device2IconItem}>
                <div className={styles.device2Icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                    <line x1="12" y1="2" x2="12" y2="4"/>
                    <line x1="12" y1="20" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
                    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="4" y2="12"/>
                    <line x1="20" y1="12" x2="22" y2="12"/>
                    <line x1="6.34" y1="17.66" x2="4.93" y2="19.07"/>
                    <line x1="19.07" y1="4.93" x2="17.66" y2="6.34"/>
                  </svg>
                </div>
                <div className={styles.device2IconTitle}>Premium Optical Performance</div>
                <div className={styles.device2IconText}>High-definition clarity engineered for surgical precision. No distortion, no compromises—just world-class optics built for professionals.</div>
              </div>
              <div className={styles.device2IconItem}>
                <div className={styles.device2Icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div className={styles.device2IconTitle}>Fair, Accessible Pricing</div>
                <div className={styles.device2IconText}>Luxury-grade loupes without the luxury price tag. Direct-to-factory model means top-tier quality at a cost you can actually afford.</div>
              </div>
              <div className={styles.device2IconItem}>
                <div className={styles.device2Icon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M12 11v6"/>
                    <path d="M9 14l3-3 3 3"/>
                  </svg>
                </div>
                <div className={styles.device2IconTitle}>Ergonomic, All-Day Comfort</div>
                <div className={styles.device2IconText}>Ultra-lightweight, posture-saving designs built to reduce neck strain and maximize comfort through the longest procedures.</div>
              </div>
            </div>
          </div>
          {/* Noise overlay on device 2 */}
          <div className={styles.device2Noise}>
            <Noise 
              patternSize={250}
              patternScaleX={1}
              patternScaleY={1}
              patternRefreshInterval={2}
              patternAlpha={8}
            />
          </div>
        </div>
      )}

      {/* Images Container - Slides in and pans horizontally */}
      <div 
        className={styles.imagesContainer}
        style={{
          ...circlesContainerTransform,
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
      >
        {/* Image 1 - Walking Hallway */}
        <div className={styles.imageCardWrapper}>
          <div className={styles.imageCard}>
            <div className={styles.imageCardInner}>
              <Image
                src="/Walkinghallway2.png"
                alt="Walking hallway"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.imageNoiseOverlay}>
                <Noise 
                  patternSize={250}
                  patternScaleX={1}
                  patternScaleY={1}
                  patternRefreshInterval={2}
                  patternAlpha={12}
                />
              </div>
            </div>
          </div>
          <p className={styles.imageText}>Engineered for Excellence</p>
        </div>
        
        {/* Image 2 - Girl in Mirror */}
        <div className={styles.imageCardWrapper}>
          <div className={styles.imageCard}>
            <div className={styles.imageCardInner}>
              <Image
                src="/girlinmirror.png"
                alt="Girl in mirror"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.imageNoiseOverlay}>
                <Noise 
                  patternSize={250}
                  patternScaleX={1}
                  patternScaleY={1}
                  patternRefreshInterval={2}
                  patternAlpha={12}
                />
              </div>
            </div>
          </div>
          <p className={styles.imageText}>Perfect Focus</p>
        </div>

        {/* Image 3 - Girl Direct Shot */}
        <div className={styles.imageCardWrapper}>
          <div className={styles.imageCard}>
            <div className={styles.imageCardInner}>
              <Image
                src="/girldirectshot.png"
                alt="Girl direct shot"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.imageNoiseOverlay}>
                <Noise 
                  patternSize={250}
                  patternScaleX={1}
                  patternScaleY={1}
                  patternRefreshInterval={2}
                  patternAlpha={12}
                />
              </div>
            </div>
          </div>
          <p className={styles.imageText}>Every Detail</p>
        </div>
      </div>

      {/* Large text at bottom aligned with first image */}
      <div 
        className={styles.bottomLargeText}
        style={{
          ...circlesContainerTransform,
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
      >
        <p className={styles.largeTextLine}>Designed for those who demand precision—</p>
        <p className={styles.largeTextLine}>Created for those who pursue mastery</p>
      </div>

      {/* Text to the right of image 3 */}
      <div 
        className={styles.image3RightText}
        style={{
          ...circlesContainerTransform,
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
      >
        <p className={styles.image3MainText}>No gate keeping—</p>
        <p className={styles.image3MainText}>Just fair pricing</p>
        <p className={styles.image3SubText}>Elite quality made truly affordable</p>
      </div>

      {/* Directblond image to the right of the text */}
      <div 
        className={styles.directblondImage}
        style={{
          opacity: circlesContainerTransform.opacity,
          transform: circlesContainerTransform.transform || 'translateY(-50%)',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
      >
        <div className={styles.directblondImageInner}>
          <Image
            src="/BlonddirectNew.png"
            alt="Blond direct"
            fill
            style={{ objectFit: 'contain', borderRadius: '16px' }}
          />
          {/* Text overlay at top left */}
          <div className={styles.directblondTextOverlay}>
            <div className={styles.directblondText}>
              <div>"Skill thrives where</div>
              <div style={{ paddingLeft: '2rem' }}>Access - Exists"</div>
            </div>
          </div>
          <div className={styles.directblondImageNoise}>
            <Noise 
              patternSize={250}
              patternScaleX={1}
              patternScaleY={1}
              patternRefreshInterval={2}
              patternAlpha={12}
            />
          </div>
        </div>
      </div>

      {/* Placeholder circle with 1 to the right of blonddirect */}
      <div 
        className={styles.placeholderCircle}
        style={{
          opacity: circlesContainerTransform.opacity,
          transform: circlesContainerTransform.transform || 'translateY(-50%)',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
      >
        <span className={styles.placeholderCircleLabel}>1</span>
      </div>

      {/* Newsletter in bottom right */}
      <div 
        className={styles.newsletterFixed}
        style={{
          opacity: circlesContainerTransform.opacity,
          transition: 'opacity 0.2s ease-out'
        }}
      >
        <div className={styles.bottomNewsletter}>
          <button className={styles.bottomNewsletterClose}>×</button>
          <h3 className={styles.bottomNewsletterTitle}>Newsletter</h3>
          <p className={styles.bottomNewsletterText}>GET UPDATES • NO SPAM</p>
          <div className={styles.bottomNewsletterEmailContainer}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.bottomNewsletterEmailInput}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button className={styles.bottomNewsletterSubmit}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Dive Deeper Section - Slides in from bottom after circle 5 */}
      <div 
        className={styles.diveDeeperSection}
        style={{
          transform: diveDeeperTransform.transform,
          opacity: diveDeeperTransform.opacity,
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* ColorBends Overlay - Only render when fully visible to prevent flickering */}
        {isDiveDeeperFullyVisible && (
          <div className={styles.colorBendsOverlay}>
            <ColorBends />
          </div>
        )}
        
        <div className={styles.diveDeeperContent}>
          {/* Left Side - Text */}
          <div className={styles.diveDeeperLeft}>
            <h2 className={styles.diveDeeperHeading}>
              Dive deeper into HeliosX
            </h2>
            <p className={styles.diveDeeperDescription}>
              Dive deeper into every section on the site and find what you are looking for.
            </p>
          </div>

          {/* Right Side - Magic Bento Cards */}
          <div className={styles.diveDeeperBento}>
            <MagicBento
              cards={diveDeeperCards}
              textAutoHide={false}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              disableAnimations={false}
              spotlightRadius={300}
              particleCount={12}
              enableTilt={false}
              glowColor="139, 105, 20"
              clickEffect={true}
              enableMagnetism={true}
            />
          </div>
        </div>
      </div>

      {/* Order Now Section - Anchored to device 1 */}
      <div 
        className={styles.orderNowFixedSection}
        style={{
          opacity: anchoredElements.opacity,
          transform: `translateY(${anchoredElements.translateY}vh)`,
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
        }}
      >
        <div className={styles.newsletterWrapper}>
          <div className={styles.bottomNewsletter}>
            <button className={styles.bottomNewsletterClose}>×</button>
            <h3 className={styles.bottomNewsletterTitle}>Newsletter</h3>
            <p className={styles.bottomNewsletterText}>GET UPDATES • NO SPAM</p>
            <div className={styles.bottomNewsletterEmailContainer}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.bottomNewsletterEmailInput}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button className={styles.bottomNewsletterSubmit}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <p className={styles.stockStatusFixed}>
          ✓ IN STOCK • SHIPS IN 3-5 BUSINESS DAYS
        </p>
        <Link href="/product" className={styles.orderNowButtonFixed}>
          ORDER NOW
        </Link>
      </div>

    </section>
  )
}
