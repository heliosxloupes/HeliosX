'use client'

import { useState } from 'react'
import React from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Image from 'next/image'
import Noise from '@/components/Noise'
import styles from './page.module.css'
import productStyles from '@/app/product/Product.module.css'

// Helper function to extract text from React nodes
function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === 'string') {
    return node
  }
  if (typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join(' ')
  }
  if (React.isValidElement(node)) {
    if (node.props.children) {
      return extractTextFromNode(node.props.children)
    }
  }
  return ''
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const categories = [
    { id: 'prescription', name: 'How Prescription & Measurements work', icon: '👓' },
    { id: 'product', name: 'Product', icon: '🔬' },
    { id: 'order', name: 'Order & Shipping', icon: '📦' },
    { id: 'company', name: 'Company', icon: '🏥' },
    { id: 'support', name: 'Support', icon: '💬' },
  ]

  const faqs = {
    order: [
      {
        question: 'What is the warranty on HeliosX loupes?',
        answer: 'All HeliosX surgical loupes come with a comprehensive warranty covering manufacturing defects and optical performance. Please contact our support team for specific warranty details based on your product model.'
      },
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase, you can return your loupes within 30 days of delivery for a full refund. The product must be in original condition with all packaging and accessories.'
      },
      {
        question: 'Where do you ship?',
        answer: 'We currently ship to the United States and Canada. International shipping options may be available upon request. Please contact our support team for more information.'
      },
      {
        question: 'How much is shipping?',
        answer: 'Shipping costs vary based on your location and selected shipping method. Standard shipping within the US typically takes 3-5 business days. Express shipping options are available at checkout.'
      },
      {
        question: 'Can I pay in installments?',
        answer: 'We accept all major credit cards and offer flexible payment options. For medical professionals, we may offer payment plans - please contact us to discuss options.'
      },
      {
        question: 'How can I edit my billing or shipping address?',
        answer: 'You can update your shipping address before your order ships by contacting our support team. Once an order has shipped, address changes may not be possible.'
      }
    ],
    product: [
      {
        question: 'What magnification options are available?',
        answer: 'HeliosX offers various magnification levels across our product line: Galileo and Newton (2.5x, 3.0x, 3.5x), Apollo (3.0x, 4.0x, 5.0x, 6.0x), and Kepler (4.0x, 5.0x, 6.0x). Each model is designed for specific surgical and dental applications.'
      },
      {
        question: 'What frame options do you have?',
        answer: 'We offer multiple frame styles and colors to suit your preferences. Frame options vary by product model and include various colors and designs. You can view all available frames on each product page.'
      },
      {
        question: 'What are the weight specifications?',
        answer: 'HeliosX loupes are designed to be lightweight for extended use. Galileo weighs approximately 35-37g depending on magnification. Newton, Apollo, and Kepler have similar lightweight designs optimized for comfort during long procedures.'
      },
      {
        question: 'What is the working distance?',
        answer: 'Working distance varies by magnification and model. Our loupes are designed for optimal working distances typical in surgical and dental procedures. Specific measurements are available in each product\'s technical specifications.'
      },
      {
        question: 'Are the lenses multi-layer coated?',
        answer: 'Yes, all HeliosX loupes feature multi-layer coated premium lenses with high color fidelity and light transmittance greater than 98%. This ensures optimal clarity and color accuracy for precise work.'
      },
      {
        question: 'What is the field of view?',
        answer: 'HeliosX loupes feature an extra-wide field of view, providing excellent peripheral vision while maintaining optical clarity. The exact field of view varies by magnification level and model.'
      },
      {
        question: 'Are the loupes compatible with light sources?',
        answer: 'Yes, all HeliosX loupes are compatible with fixed light sources and power supplies. They can be used with various surgical headlights and light systems commonly used in operating rooms and dental clinics.'
      }
    ],
    prescription: [
      {
        question: 'How Does the Prescription & Measurement Process Work?',
        answer: (
          <p>
            After placing your order, you will see a confirmation page instructing you to wait for an email with the next steps. This email contains all instructions, links, and forms needed to complete your prescription or non-prescription setup.
          </p>
        )
      },
      {
        question: 'Prescription vs. Non-Prescription Lenses',
        answer: (
          <div>
            <p><strong>Prescription Lenses</strong></p>
            <p>If you require prescription lenses, simply reply to the confirmation email and attach your valid eyeglass prescription.</p>
            <p>Once received, we will verify the information and proceed with your custom lens production.</p>
            
            <p style={{ marginTop: '1.5rem' }}><strong>Non-Prescription Lenses</strong></p>
            <p>If you do not require a prescription, your confirmation email will guide you through two quick measurements:</p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>Pupillary Distance (PD)</li>
              <li>Working Distance</li>
            </ul>
            <p>The email also includes a QR code to download the PDCheck AR app, along with instructions for submitting your measurements.</p>
          </div>
        )
      },
      {
        question: 'How to Measure Your Pupillary Distance (PD)',
        answer: (
          <div>
            <p>Shortly after placing your order, look out for an email containing:</p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Step-by-step PD measurement instructions</li>
              <li>A QR code linking directly to the PDCheck AR app in the App Store</li>
              <li>A link to the customer measurement form where you will submit your results</li>
            </ul>
            <p><strong>PDCheck AR by EyeQue</strong> is a smartphone-based vision tool that provides quick, accurate PD measurements using augmented reality. We highly recommend using this app for the most precise results.</p>
            <p style={{ marginTop: '1rem' }}>If you prefer not to use the app, your email will also include simple instructions on how to measure your PD manually with a ruler.</p>
          </div>
        )
      },
      {
        question: 'How to Measure Your Working Distance',
        answer: (
          <div>
            <p>Your working distance is the space between your eyes and the area or patient you typically focus on during procedures or detailed tasks. Selecting the correct working distance is essential for posture, clarity, and comfort.</p>
            
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '1.5rem auto', borderRadius: '12px', overflow: 'hidden' }}>
              <Image
                src="/working distance.png"
                alt="Dental professional measuring working distance"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2, mixBlendMode: 'overlay' }}>
                <Noise 
                  patternSize={250}
                  patternScaleX={1}
                  patternScaleY={1}
                  patternRefreshInterval={2}
                  patternAlpha={8}
                />
              </div>
            </div>
            
            <p style={{ marginTop: '1.5rem' }}><strong>How to Determine Your Working Distance</strong></p>
            
            <p style={{ marginTop: '1rem' }}><strong>1. Use Your Natural Working Posture</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Sit or stand exactly as you normally would while working</li>
              <li>Keep your back and neck straight</li>
              <li>Look toward your usual focal point</li>
            </ul>
            
            <p><strong>2. Measure the Distance</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Place a measuring tape at the corner of your eye</li>
              <li>Extend it to the object or position where your hands normally work</li>
              <li>Record this distance — this is your working distance</li>
            </ul>
            
            <p><strong>3. Consider Your Professional Needs</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Some fields require closer focus or more mobility</li>
              <li>Choose a distance that remains clear without straining your posture</li>
            </ul>
            
            <p style={{ marginTop: '1.5rem' }}><strong>Tips for Best Results</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>If you're using Try Before You Buy, test different distances in your workspace to find the most comfortable setup</li>
              <li>Re-measure periodically as your habits or working style may evolve</li>
              <li>Ask colleagues for input if you're unsure</li>
            </ul>
          </div>
        )
      },
      {
        question: 'Submitting Your Measurements',
        answer: (
          <div>
            <p>Once you have:</p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>✔ Your prescription (if applicable)</li>
              <li>✔ Your pupillary distance</li>
              <li>✔ Your working distance</li>
            </ul>
            <p>Complete the customer measurement form included in your confirmation email.</p>
            <p>Submit it back to us, and we'll begin crafting your custom loupes.</p>
          </div>
        )
      },
      {
        question: 'Can I get prescription lenses?',
        answer: 'Yes, prescription lenses are available for all HeliosX models. During checkout, you\'ll receive an email with instructions on how to provide your prescription details. We work with licensed optometrists to ensure accurate prescription integration.'
      },
      {
        question: 'How do I provide my prescription information?',
        answer: 'After placing your order, you\'ll receive an email with a link to submit your prescription details. You can also contact our support team directly with your prescription information. We require your most recent eye exam results.'
      },
      {
        question: 'What if my prescription changes?',
        answer: 'If your prescription changes after receiving your loupes, we can help you update your lenses. Contact our support team to discuss options for prescription updates or lens replacement.'
      },
      {
        question: 'How long does it take to process prescription orders?',
        answer: 'Prescription orders typically take an additional 5-7 business days to process compared to standard orders, as we need to verify your prescription and integrate it into your loupes.'
      }
    ],
    company: [
      {
        question: 'Where is HeliosX based?',
        answer: 'HeliosX is based in the United States, founded by a plastic surgery resident who recognized the need for high-quality, affordable surgical loupes in the medical community.'
      },
      {
        question: 'Why did you start HeliosX?',
        answer: 'HeliosX was born in the operating room, built to defy industry greed. We saw that premium surgical loupes were priced out of reach for many medical professionals, and we set out to make surgical precision accessible to all without compromising on quality.'
      },
      {
        question: 'What are your vision, mission, and values?',
        answer: 'Our mission is to provide premium surgical optics at fair prices. We believe that high-quality medical equipment should be accessible to all healthcare professionals, regardless of their career stage. We\'re committed to transparency, quality, and supporting the medical community.'
      },
      {
        question: 'What other products do you offer?',
        answer: 'Currently, we offer four main product lines: Galileo, Newton, Apollo, and Kepler surgical loupes. Each is designed for specific applications and preferences. We\'re continuously working on expanding our product range based on community feedback.'
      }
    ],
    support: [
      {
        question: 'How can I contact support?',
        answer: 'You can reach our support team via email or through the contact form on our website. We typically respond within 24-48 hours. For urgent matters, please indicate this in your message.'
      },
      {
        question: 'Do you offer technical support?',
        answer: 'Yes, we provide comprehensive technical support for all our products. Our team can help with fitting adjustments, maintenance questions, and troubleshooting. We\'re committed to ensuring you get the most out of your HeliosX loupes.'
      },
      {
        question: 'Can I schedule a fitting consultation?',
        answer: 'We offer virtual fitting consultations to help you select the right magnification, frame, and configuration for your needs. Contact our support team to schedule a consultation.'
      },
      {
        question: 'What if I need repairs?',
        answer: 'If your loupes need repair, contact our support team. We\'ll assess the issue and provide repair options. Many repairs can be completed quickly, and we offer replacement options when necessary.'
      },
      {
        question: 'Do you have educational resources?',
        answer: 'We provide guides and resources to help you choose the right loupes and maintain them properly. Check our website for detailed product specifications, fitting guides, and care instructions.'
      }
    ]
  }

  // Helper to get searchable text from answer (handles both string and React nodes)
  const getSearchableText = (answer: string | React.ReactNode): string => {
    if (typeof answer === 'string') {
      return answer
    }
    return extractTextFromNode(answer)
  }

  const filteredFAQs = activeCategory 
    ? faqs[activeCategory as keyof typeof faqs].filter(faq => {
        const searchableAnswer = getSearchableText(faq.answer)
        return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
               searchableAnswer.toLowerCase().includes(searchQuery.toLowerCase())
      })
    : []

  const allFAQs = Object.values(faqs).flat()
  const searchResults = searchQuery 
    ? allFAQs.filter(faq => {
        const searchableAnswer = getSearchableText(faq.answer)
        return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
               searchableAnswer.toLowerCase().includes(searchQuery.toLowerCase())
      })
    : []

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/logominimalnowriting.png"
            alt="HeliosX Logo"
            width={60}
            height={60}
            style={{ objectFit: 'contain' }}
          />
        </Link>
        
        <section className={styles.hero}>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.welcomeText}>
            Welcome to HeliosX Support! We're happy to help. Please check the FAQs to see if your question is answered, and if not, feel free to contact our support team.
          </p>
          <div className={styles.contactInfo}>
            <p>Email: <a href="mailto:heliosxloupes@gmail.com">heliosxloupes@gmail.com</a></p>
          </div>
        </section>

        <section className={styles.categoriesSection}>
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryCard} ${activeCategory === category.id ? styles.categoryCardActive : ''}`}
                onClick={() => {
                  setActiveCategory(activeCategory === category.id ? null : category.id)
                  setSearchQuery('')
                }}
              >
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3 className={styles.categoryName}>{category.name}</h3>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for Answers"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <section className={styles.faqsSection}>
          {searchQuery && !activeCategory ? (
            <div className={styles.faqsList}>
              <h2 className={styles.faqsTitle}>Search Results</h2>
              {searchResults.length > 0 ? (
                searchResults.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))
              ) : (
                <p className={styles.noResults}>No results found for "{searchQuery}"</p>
              )}
            </div>
          ) : activeCategory ? (
            <div className={styles.faqsList}>
              <h2 className={styles.faqsTitle}>{categories.find(c => c.id === activeCategory)?.name}</h2>
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))
              ) : (
                <p className={styles.noResults}>No FAQs found in this category.</p>
              )}
            </div>
          ) : (
            <div className={styles.faqsList}>
              <h2 className={styles.faqsTitle}>All FAQs</h2>
              {allFAQs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          )}
        </section>

        {/* Bottom Section - Same as product pages */}
        <section className={productStyles.bottomSection}>
          <div className={productStyles.bottomImageWrapper}>
            <div className={productStyles.bottomImage}>
              <img 
                src="/Walkinghallway2.png" 
                alt="Walking hallway" 
                className={productStyles.bottomBackgroundImage}
              />
              <div className={productStyles.bottomImageNoise}>
                <Noise 
                  patternSize={250}
                  patternScaleX={1}
                  patternScaleY={1}
                  patternRefreshInterval={2}
                  patternAlpha={8}
                />
              </div>
            </div>
          </div>
          
          <div className={productStyles.bottomContent}>
            <div className={productStyles.bottomBrand}>
              <h2 className={productStyles.bottomBrandText}>HeliosX</h2>
            </div>

            <div className={productStyles.bottomFooter}>
              <div className={productStyles.bottomFooterGrid}>
                <div className={productStyles.bottomFooterColumn}>
                  <h3 className={productStyles.bottomFooterTitle}>NAVIGATION</h3>
                  <ul className={productStyles.bottomFooterList}>
                    <li><Link href="/" className={productStyles.bottomFooterLink}>Home</Link></li>
                    <li><Link href="/product" className={productStyles.bottomFooterLink}>Product</Link></li>
                    <li><Link href="/guides" className={productStyles.bottomFooterLink}>Guides</Link></li>
                    <li><Link href="/faq" className={productStyles.bottomFooterLink}>About</Link></li>
                  </ul>
                </div>

                <div className={productStyles.bottomFooterColumn}>
                  <h3 className={productStyles.bottomFooterTitle}>WHO WE ARE</h3>
                  <p className={productStyles.bottomFooterText}>A more caring medical equipment company</p>
                </div>

                <div className={productStyles.bottomFooterColumn}>
                  <h3 className={productStyles.bottomFooterTitle}>SOCIALS</h3>
                  <div className={productStyles.bottomSocialIcons}>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={productStyles.bottomSocialIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={productStyles.bottomSocialIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22.54 6.42 22.54 17.58 12 22.5 1.46 17.58 1.46 6.42 12 1.5 22.54 6.42"/>
                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                      </svg>
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={productStyles.bottomSocialIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={productStyles.bottomSocialIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <div className={productStyles.bottomFooterColumn}>
                  <div className={productStyles.bottomNewsletter}>
                    <button className={productStyles.bottomNewsletterClose}>×</button>
                    <h3 className={productStyles.bottomNewsletterTitle}>Newsletter</h3>
                    <p className={productStyles.bottomNewsletterText}>GET UPDATES • NO SPAM</p>
                    <div className={productStyles.bottomNewsletterEmailContainer}>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className={productStyles.bottomNewsletterEmailInput}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                      />
                      <button className={productStyles.bottomNewsletterSubmit}>
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={productStyles.bottomOrderButton}>
              <Link href="/product" className={productStyles.bottomOrderNow} style={{ textDecoration: 'none', display: 'inline-block' }}>ORDER NOW</Link>
              <p className={productStyles.shippingText}>Ships within 7-10 days</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string | React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.faqItem}>
      <button
        className={styles.faqQuestion}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className={styles.faqToggle}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className={styles.faqAnswer}>
          {typeof answer === 'string' ? <p>{answer}</p> : answer}
        </div>
      )}
    </div>
  )
}
