'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Image from 'next/image'
import Noise from '@/components/Noise'
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal, getCartItemCount, type CartItem } from '@/lib/cart'
import styles from './Cart.module.css'

function CartContent() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addOns, setAddOns] = useState({
    case: 0,
    cleaningKit: 0,
    warranty: 0,
  })

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      setCartItems(getCart())
    }
    
    loadCart()
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', loadCart)
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart)
    }
  }, [])

  const addOnProducts = [
    {
      id: 'case',
      name: 'Protective Case',
      description: 'Durable case to protect your loupes and keep them safe during transport.',
      price: 59,
      quantity: addOns.case,
      setQuantity: (qty: number) => setAddOns({ ...addOns, case: qty }),
      image: '/loupesondesk2.png',
    },
    {
      id: 'cleaningKit',
      name: 'Cleaning Kit',
      description: 'Professional cleaning supplies to keep your loupes crystal clear.',
      price: 39,
      quantity: addOns.cleaningKit,
      setQuantity: (qty: number) => setAddOns({ ...addOns, cleaningKit: qty }),
      image: '/loupesondesk2.png',
    },
    {
      id: 'warranty',
      name: 'Extended Warranty',
      description: 'Extended 2-year warranty for added peace of mind.',
      price: 79,
      quantity: addOns.warranty,
      setQuantity: (qty: number) => setAddOns({ ...addOns, warranty: qty }),
      image: '/loupesondesk2.png',
    },
  ]

  const updateQuantity = (productSlug: string, newQuantity: number) => {
    updateCartItemQuantity(productSlug, newQuantity)
    setCartItems(getCart())
  }

  const removeItem = (productSlug: string) => {
    removeFromCart(productSlug)
    setCartItems(getCart())
  }

  const mainTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const addOnsTotal = addOnProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = mainTotal + addOnsTotal
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0) + Object.values(addOns).reduce((sum, qty) => sum + qty, 0)

  // Build query string for checkout
  const buildCheckoutQuery = () => {
    if (cartItems.length === 0) return '/checkout'
    
    // Use the first item for checkout (Stripe embedded checkout will handle multiple items)
    const firstItem = cartItems[0]
    const queryParams = new URLSearchParams({
      product: firstItem.productSlug,
      quantity: firstItem.quantity.toString(),
    })
    if (firstItem.image) {
      queryParams.append('image', firstItem.image)
    }
    return `/checkout?${queryParams.toString()}`
  }

  return (
    <>
      <Header />
      <main className={styles.cartPage}>
        <div className={styles.cartLayout}>
          {/* Left Side - Product Image */}
          <div className={styles.imageSection}>
            <div className={styles.productImageWrapper}>
              <Image
                src="/girlinmirror1.png"
                alt="Checkout"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              {/* Noise overlay */}
              <div className={styles.imageNoise}>
                <Noise 
                  patternSize={250}
                  patternScaleX={1}
                  patternScaleY={1}
                  patternRefreshInterval={2}
                  patternAlpha={8}
                />
              </div>
              {/* Logo in top left */}
              <Link href="/" className={styles.logoContainer}>
                <Image
                  src="/logominimalnowriting.png"
                  alt="HeliosX Logo"
                  width={60}
                  height={60}
                  style={{ objectFit: 'contain' }}
                />
              </Link>
              {/* Text overlay at bottom left */}
              <div className={styles.imageTextOverlay}>
                <div className={styles.imageText}>
                  <div className={`${styles.imageTextLine} ${styles.imageTextLineLarge}`}>You are one step closer</div>
                  <div className={styles.imageTextLine} style={{ paddingLeft: '2rem' }}>to making the right decision</div>
                  <div className={styles.imageTextLine} style={{ paddingLeft: '4rem' }}>for your EYES</div>
                </div>
              </div>
              {/* Steps overlay on right side */}
              <div className={styles.stepsOverlay}>
                <Link href={buildCheckoutQuery()} className={styles.stepItemClickable}>
                  <div className={styles.stepIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </div>
                  <div className={styles.stepText}>Check Out</div>
                </Link>
                <div className={styles.stepArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="19 12 12 19 5 12"/>
                  </svg>
                </div>
                <div className={styles.stepItem}>
                  <div className={styles.stepIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div className={styles.stepText}>Measurement Form</div>
                </div>
                <div className={styles.stepArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="19 12 12 19 5 12"/>
                  </svg>
                </div>
                <div className={styles.stepItem}>
                  <div className={styles.stepIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                      <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                  </div>
                  <div className={styles.stepText}>Receive Your Loupes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Cart Interface */}
          <div className={styles.cartInterface}>
            <div className={styles.cartContent}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                  <h2>Your cart is empty</h2>
                  <p>Add products from the product page to get started.</p>
                  <Link href="/product" className={styles.checkoutButton}>
                    Browse Products
                  </Link>
                </div>
              ) : (
                <>
                  {/* Scrollable Content Section */}
                  <div className={styles.scrollableContent}>
                    {/* Cart Items */}
                    <div className={styles.cartItemsList}>
                      {cartItems.map((item, index) => {
                      // Check if this is the first Apollo item
                      const isFirstApollo = item.productSlug === 'apollo' && 
                        !cartItems.slice(0, index).some(i => i.productSlug === 'apollo')
                      // Get the correct main image for each product
                      const getProductImage = (slug: string) => {
                        const imageMap: Record<string, string> = {
                          'galileo': '/GalileoMain2.png',
                          'newton': '/NewtonMain.png',
                          'kepler': '/Kfinal.jpg',
                          'apollo': '/Apollofinal.png',
                        }
                        return imageMap[slug] || (item.image || '/loupesondesk2.png')
                      }
                      const imageSrc = getProductImage(item.productSlug)

                      // Get frame labels for each product
                      const getFrameLabels = (slug: string): string[] => {
                        const frameMap: Record<string, string[]> = {
                          'galileo': ['JJ20', 'JJ21', 'JJ22', 'JJ23', 'JJ24'],
                          'kepler': ['JJ04', 'JJ21', 'JJ22', 'JJ23', 'JJ24'],
                          'newton': ['H1', 'H2'],
                          'apollo': ['JJ04', 'JJ20', 'JJ21', 'JJ22', 'JJ23', 'JJ24'],
                        }
                        return frameMap[slug] || []
                      }
                      // Get frame image for each product and frame label/name
                      const getFrameImage = (slug: string, frameLabel: string): string | null => {
                        const frameImageMap: Record<string, Record<string, string>> = {
                          'galileo': {
                            'Galileo1': '/Frames/JJ04B.png',
                            'Galileo2': '/Frames/JJ20B.png',
                            'Galileo3': '/Frames/JJ21G.png',
                            'Galileo4': '/Frames/JJ22B.png',
                            'Galileo5': '/Frames/JJ23Grey.png',
                            'Galileo6': '/Frames/JJ24Grey.png',
                            // Also support old label format for backwards compatibility
                            'JJ04': '/Frames/JJ04B.png',
                            'JJ20': '/Frames/JJ20B.png',
                            'JJ21': '/Frames/JJ21G.png',
                            'JJ22': '/Frames/JJ22B.png',
                            'JJ23': '/Frames/JJ23Grey.png',
                            'JJ24': '/Frames/JJ24Grey.png',
                          },
                          'newton': {
                            'H1': '/Frames/h1black2.png',
                            'H2': '/Frames/test2.png',
                          },
                          'apollo': {
                            'JJ04': '/Frames/apolloblack.png',
                            'JJ20': '/Frames/apollored.png',
                            'JJ21': '/Frames/apollosand.png',
                            'JJ22': '/Frames/apollogrey.png',
                            'JJ23': '/Frames/apollomauve.png',
                          },
                        }
                        return frameImageMap[slug]?.[frameLabel] || null
                      }
                      const frameLabels = getFrameLabels(item.productSlug)
                      const selectedFrame = item.selectedFrameName || frameLabels[0] || ''
                      const selectedFrameImage = item.selectedFrameImage || null

                      return (
                        <>
                          {isFirstApollo && (
                            <div className={styles.cartDivider}></div>
                          )}
                          <div key={item.productSlug} className={styles.mainProduct}>
                          <div className={styles.mainProductTopRow}>
                            <div className={styles.mainProductImage}>
                              <Image
                                src={imageSrc}
                                alt={item.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className={styles.mainProductInfo}>
                              <h1 className={styles.mainProductTitle}>{item.shortName}</h1>
                              <p className={styles.mainProductSubtitle}>Premium optics included</p>
                              {/* Frame Selection - For all products */}
                              {frameLabels.length > 0 && (
                                <div className={styles.frameSelection}>
                                  {selectedFrameImage && (
                                    <div className={styles.frameIcon}>
                                      <Image
                                        src={selectedFrameImage}
                                        alt={selectedFrame}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                      />
                                    </div>
                                  )}
                                  <span className={styles.frameLabel}>Frame:</span>
                                </div>
                              )}
                              {/* Magnification Selection - For Galileo, Newton, Apollo, Kepler */}
                              {item.selectedMagnification && (
                                <div className={styles.magnificationSelection}>
                                  <div className={styles.magnificationIconStatic}>
                                    <span className={styles.magnificationValueStatic}>{item.selectedMagnification}</span>
                                  </div>
                                  <span className={styles.magnificationLabel}>Magnification:</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={styles.mainProductPriceRow}>
                            <span className={styles.mainProductPrice}>${item.price}</span>
                            <div className={styles.quantitySelector}>
                              <button 
                                className={styles.quantityButton} 
                                onClick={() => updateQuantity(item.productSlug, Math.max(1, item.quantity - 1))}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className={styles.quantityValue}>{item.quantity}</span>
                              <button 
                                className={styles.quantityButton} 
                                onClick={() => updateQuantity(item.productSlug, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              className={styles.removeButton}
                              onClick={() => removeItem(item.productSlug)}
                              aria-label="Remove item"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        </>
                      )
                    })}
                    </div>

                    {/* Add-ons Section */}
                    <div className={styles.addOnsSection}>
                    <h2 className={styles.addOnsTitle}>Complete your HeliosX Setup</h2>
                    {addOnProducts.map((item) => (
                      <div 
                        key={item.id} 
                        className={`${styles.addOnItem} ${item.quantity > 0 ? styles.addOnItemSelected : ''}`}
                        onClick={() => {
                          item.setQuantity(item.quantity === 0 ? 1 : 0)
                        }}
                      >
                        <div className={styles.addOnImage}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {item.quantity > 0 && (
                            <div className={styles.checkmarkOverlay}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className={styles.addOnInfo}>
                          <h3 className={styles.addOnName}>{item.name}</h3>
                          <p className={styles.addOnDescription}>{item.description}</p>
                          <span className={styles.addOnPrice}>${item.price}</span>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className={styles.cartFooter}>
                    <div className={styles.guarantees}>
                      <span>Secure Payments</span>
                      <span>30-Day Guarantee</span>
                    </div>
                    <div className={styles.totalSection}>
                      <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Total · {totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                        <span className={styles.totalPrice}>${total}</span>
                      </div>
                      <p className={styles.shippingNote}>Ships within 3-5 business days</p>
                    </div>
                    <div className={styles.checkoutSection}>
                      <Link 
                        href={buildCheckoutQuery()}
                        className={styles.checkoutButton}
                      >
                        CHECKOUT
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    }>
      <CartContent />
    </Suspense>
  )
}
