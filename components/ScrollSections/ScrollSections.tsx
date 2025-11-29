'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ScrollSections.module.css'

export default function ScrollSections() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionsRef.current) return

      const windowHeight = window.innerHeight
      const scrollPosition = window.scrollY
      
      // Calculate progress - image grid should start appearing when device2 is visible
      // Device2 appears around scroll progress 0.9-1.0 in Hero section
      // Hero section is 400vh tall, so we calculate based on that
      const heroHeight = windowHeight * 4 // 400vh
      const device2StartScroll = heroHeight * 0.9 // When device2 starts appearing
      const panStartScroll = device2StartScroll
      const panEndScroll = heroHeight * 1.2 // Continue panning after Hero section
      
      // Calculate progress for pan animation (0 to 1)
      const progress = Math.min(1, Math.max(0, (scrollPosition - panStartScroll) / (panEndScroll - panStartScroll)))
      setScrollProgress(progress)
      
      // Translate the container horizontally based on scroll
      // Container starts at translateX(0), image grid is at 50vw (closer to device2)
      // As we scroll, move container left to bring image grid into view
      // Move from 0 to -50vw to reveal image grid (pan right effect)
      const translateX = -progress * 50 // Start at 0vw, move to -50vw (pan right, less distance)
      sectionsRef.current.style.transform = `translateX(${translateX}vw)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sections are statically positioned - no transform needed
  // The parent container moves horizontally based on scroll

  return (
    <section ref={sectionsRef} className={styles.scrollSections}>
      {/* Empty spacer - smaller width to position image grid closer to device2 */}
      <div style={{ width: '50vw', flexShrink: 0, height: '100%' }} />
      
      {/* Image Grid Section - Positioned directly to the right of device2 */}
      <div className={styles.imageGridSection}>
        <div className={styles.imageGridContainer}>
          <h2 className={styles.sectionTitle}>
            A distraction-free space for learning & creativity
          </h2>
          <p className={styles.sectionDescription}>
            Live Paper display. We invented a new type of display that's like E Ink, but faster. It looks and feels like paper, but runs at 60fps, so you can work fluidly, and use all your apps without compromise.
          </p>
          
          <div className={styles.imageGrid}>
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className={styles.imageCard}>
                <div className={styles.imagePlaceholder}>
                  {/* Image placeholder */}
                </div>
                <h3 className={styles.cardTitle}>Feature {index}</h3>
                <p className={styles.cardDescription}>
                  Placeholder description for feature {index} related to surgical optics and precision.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

