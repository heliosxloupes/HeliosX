'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ThreeImageSection.module.css'

export default function ThreeImageSection() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const windowHeight = window.innerHeight
      const scrollPosition = window.scrollY
      
      // Calculate progress - section should appear right as device2 is moving/scrolling past
      // Device2 slides in from 0.9 to 0.95, then moves left from 0.95 to 1.0
      // Hero section is 400vh tall
      const heroHeight = windowHeight * 4 // 400vh
      // Start appearing right when device2 starts appearing (0.9) to eliminate any gap
      const sectionStartScroll = heroHeight * 0.9 // Start exactly when device2 starts appearing
      const sectionEndScroll = heroHeight * 0.95 // Complete when device2 is centered - seamless transition
      
      // Calculate progress for slide-in animation (0 to 1)
      // Make it appear immediately with no gap, overlapping completely with device2
      const progress = Math.min(1, Math.max(0, (scrollPosition - sectionStartScroll) / (sectionEndScroll - sectionStartScroll)))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate transform for slide-in from right
  const getTransform = () => {
    // Start appearing immediately, slide in smoothly
    // Begin sliding in right when device2 appears, complete when device2 is centered
    const translateX = (1 - scrollProgress) * 100 // Start at 100vw (off-screen right), end at 0
    const opacity = scrollProgress // Fade in as it slides in
    return {
      transform: `translateX(${translateX}vw)`,
      opacity: Math.max(0, Math.min(1, opacity))
    }
  }

  const transform = getTransform()

  return (
    <section ref={sectionRef} className={styles.threeImageSection} style={transform}>
      <div className={styles.container}>
        {/* Three Image Panels */}
        <div className={styles.imagePanels}>
          {[
            {
              title: 'Reading',
              description: 'Your new favorite reading app for books and documents'
            },
            {
              title: 'Note-taking',
              description: 'Write, draw and annotate on a fast, paper-like surface'
            },
            {
              title: 'Writing',
              description: 'A sacred space for focused work without distraction'
            }
          ].map((item, index) => (
            <div key={index} className={styles.imagePanel}>
              <div className={styles.imagePlaceholder}>
                {/* Image placeholder */}
              </div>
              <h3 className={styles.panelTitle}>{item.title}</h3>
              <p className={styles.panelDescription}>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Section with Text */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomLeft}>
            <h2 className={styles.bottomTitle}>
              A distraction-free space for learning & creativity
            </h2>
          </div>
          <div className={styles.bottomRight}>
            <h3 className={styles.displayTitle}>Live Paper display</h3>
            <p className={styles.displayDescription}>
              We invented a new type of display that's like E Ink, but faster. It looks and feels like paper, but runs at 60fps, so you can work fluidly, and use all your apps without compromise.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

