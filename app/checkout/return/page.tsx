'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import BlurText from '@/components/BlurText'
import { clearCart } from '@/lib/cart'
import styles from './Return.module.css'

function ReturnContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<string>('')
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [headlineAnimationComplete, setHeadlineAnimationComplete] = useState(false)
  const [subheadlineAnimationComplete, setSubheadlineAnimationComplete] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')

  // Prevent scrolling on this page
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    if (!sessionId) return

    const initialize = async () => {
      try {
        const response = await fetch(`/api/session-status?session_id=${sessionId}`)
        const session = await response.json()

        if (session.status === 'open') {
          router.replace('/checkout')
        } else if (session.status === 'complete') {
          // Clear the cart after successful checkout
          clearCart()
          setStatus('complete')
          setCustomerEmail(session.customer_email || '')
        } else {
          setStatus(session.status || '')
        }
      } catch (error) {
        console.error('Error fetching session status:', error)
      }
    }

    initialize()
  }, [sessionId, router])

  if (status === 'complete') {
    return (
      <>
        <Header />
        <main className={styles.successPage}>
          <div className={styles.imageContainer}>
            <Image
              src="/Apollo3xAsian.png"
              alt="Success"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Text Overlay - Top Left */}
            <div className={styles.imageTextOverlay}>
              <BlurText 
                text="You are all set!"
                className={styles.imageHeadline}
                animateBy="words"
                direction="top"
                delay={100}
                onAnimationComplete={() => setHeadlineAnimationComplete(true)}
              />
              {headlineAnimationComplete && (
                <BlurText 
                  key="subheadline"
                  text="Just one last step regarding your specific vision details,"
                  className={styles.imageSubheadline}
                  animateBy="words"
                  direction="top"
                  delay={100}
                  onAnimationComplete={() => setSubheadlineAnimationComplete(true)}
                />
              )}
              {subheadlineAnimationComplete && (
                <BlurText 
                  key="thirdline"
                  text="Look out for an email from us"
                  className={styles.imageThirdLine}
                  animateBy="words"
                  direction="top"
                  delay={100}
                />
              )}
            </div>
            {/* Social Media - Mid Left */}
            <div className={styles.socialMediaContainer}>
              <p className={styles.socialMediaText}>Follow us on Social Media</p>
              <div className={styles.socialMediaIcons}>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.socialIcon}
                  aria-label="Instagram"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Newsletter - Exact same as home page */}
          <div className={styles.newsletterContainer}>
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
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className={styles.successPage}>
        <div className={styles.loadingContainer}>
          <h1>Loading...</h1>
        </div>
      </main>
    </>
  )
}

export default function ReturnPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    }>
      <ReturnContent />
    </Suspense>
  )
}
