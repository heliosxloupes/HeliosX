'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { getCart, type CartItem } from '@/lib/cart'
import styles from './Checkout.module.css'

declare global {
  interface Window {
    Stripe: any
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productSlug = searchParams.get('product') || 'galileo'
  const selectedImage = searchParams.get('image') || null
  const checkoutRef = useRef<HTMLDivElement>(null)
  const stripeRef = useRef<any>(null)
  const checkoutInstanceRef = useRef<any>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  
  // Product data
  const productData: Record<string, {
    name: string
    shortName: string
    price: number
    image: string
  }> = {
    'galileo': {
      name: 'Galileo Surgical Loupes',
      shortName: 'Galileo',
      price: 499,
      image: '/loupesondesk2.png',
    },
    'kepler': {
      name: 'Kepler Surgical Loupes',
      shortName: 'Kepler',
      price: 549,
      image: '/loupesondesk2.png',
    },
    'apollo': {
      name: 'Apollo Surgical Loupes',
      shortName: 'Apollo',
      price: 599,
      image: '/loupesondesk2.png',
    },
    'newton': {
      name: 'Newton Surgical Loupes',
      shortName: 'Newton',
      price: 449,
      image: '/loupesondesk2.png',
    },
  }

  // Get the correct main image for each product
  const getProductImage = () => {
    if (productSlug === 'galileo') {
      return '/GalileoMain2.png'
    } else if (productSlug === 'newton') {
      return '/NewtonMain.png'
    } else if (productSlug === 'apollo') {
      return '/Apollofinal.png'
    } else if (productSlug === 'kepler') {
      return '/Kfinal.jpg'
    }
    return selectedImage || productData[productSlug]?.image || '/loupesondesk2.png'
  }
  const productImage = getProductImage()
  const product = productData[productSlug] || productData['galileo']
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const subtotal = product.price * quantity

  // Get all cart items and reload when cart updates
  useEffect(() => {
    const loadCart = () => {
      const freshCart = getCart()
      setCartItems(freshCart)
      console.log('Cart updated on checkout page:', freshCart)
    }
    loadCart()
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', loadCart)
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart)
    }
  }, [])

  // Get the correct main image for each product
  const getProductImageForItem = (slug: string) => {
    const imageMap: Record<string, string> = {
      'galileo': '/Galileo/GalileoMain2.png',
      'newton': '/Newton/NewtonMain.png',
      'kepler': '/Keppler/Kfinal.jpg',
      'apollo': '/Apollo/Apollofinal.png',
    }
    return imageMap[slug] || '/loupesondesk2.png'
  }

  // Calculate total from all cart items
  const totalSubtotal = cartItems.length > 0 
    ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : subtotal

  useEffect(() => {
    const initialize = async () => {
      if (!window.Stripe || !checkoutRef.current) return
      
      // Destroy existing checkout instance if it exists
      if (checkoutInstanceRef.current) {
        checkoutInstanceRef.current.destroy()
        checkoutInstanceRef.current = null
      }
      
      try {
        const stripe = window.Stripe('pk_test_51SV0NsLQ1qA2EZ9RUpWkvsfIuAp1G87iVvdp41hAmMG8Arbu4gTEvW3A5Ophytue5qwxuEwfMYpx7iHb6XnS7UBk006u9dGB2G')
        stripeRef.current = stripe

        // Get fresh cart data right before creating session
        const freshCart = getCart()
        const itemsToSend = freshCart.length > 0 ? freshCart.map((item: any) => ({
          productSlug: item.productSlug,
          quantity: item.quantity,
          price: item.price,
          stripeProductId: item.stripeProductId || null,
          selectedMagnification: item.selectedMagnification || null,
          hasPrescriptionLenses: item.hasPrescriptionLenses || false,
          hasExtendedWarranty: item.hasExtendedWarranty || false,
        })) : [{
          productSlug: productSlug,
          quantity: quantity,
          price: product.price,
          stripeProductId: null,
          selectedMagnification: null,
          hasPrescriptionLenses: false,
          hasExtendedWarranty: false,
        }]
        
        console.log('Creating Stripe session with cart items:', itemsToSend)

        const fetchClientSecret = async () => {
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cartItems: itemsToSend,
            }),
          })
          const { clientSecret } = await response.json()
          return clientSecret
        }

        const checkout = await stripe.initEmbeddedCheckout({
          fetchClientSecret,
        })

        checkoutInstanceRef.current = checkout
        checkout.mount(checkoutRef.current)
      } catch (error) {
        console.error('Error initializing checkout:', error)
      }
    }

    if (window.Stripe && checkoutRef.current) {
      // Small delay to ensure cart is fully updated
      const timeoutId = setTimeout(() => {
        initialize()
      }, 100)
      
      return () => {
        clearTimeout(timeoutId)
        if (checkoutInstanceRef.current) {
          checkoutInstanceRef.current.destroy()
        }
      }
    } else {
      // Wait for Stripe to load
      const checkInterval = setInterval(() => {
        if (window.Stripe && checkoutRef.current) {
          clearInterval(checkInterval)
          // Small delay to ensure cart is fully updated
          setTimeout(() => {
            initialize()
          }, 100)
        }
      }, 100)
      
      return () => {
        clearInterval(checkInterval)
        if (checkoutInstanceRef.current) {
          checkoutInstanceRef.current.destroy()
        }
      }
    }
  }, [cartItems, productSlug, quantity])

  return (
    <>
      <Script
        src="https://js.stripe.com/clover/stripe.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Stripe script loaded
        }}
      />
      <Header />
      <main className={styles.checkoutPage}>
        {/* Logo in Top Margin */}
        <div className={styles.topMargin}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/LogoMinimal.png"
              alt="HeliosX"
              width={300}
              height={90}
              priority
            />
          </Link>
        </div>
        <div className={styles.checkoutLayout}>
          {/* Left Column - Stripe Embedded Checkout */}
          <div className={styles.checkoutForm}>
            <div className={styles.checkoutContent}>
              <div className={styles.stripeCheckoutWrapper}>
                <div id="checkout" ref={checkoutRef}></div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.orderSummaryContent}>
              {(cartItems.length > 0 ? cartItems : [{
                productSlug: productSlug,
                name: product.name,
                shortName: product.shortName,
                price: product.price,
                quantity: quantity,
                image: productImage,
                selectedFrameImage: null, // Will try to get from cart if available
              }]).map((item, index) => {
                const itemImage = cartItems.length > 0 
                  ? getProductImageForItem(item.productSlug)
                  : productImage
                const itemName = cartItems.length > 0 
                  ? (productData[item.productSlug]?.shortName || item.shortName)
                  : product.shortName
                const itemPrice = item.price
                const itemQuantity = item.quantity
                
                const frameImage = cartItems.length > 0 
                  ? (item.selectedFrameImage || null)
                  : null
                
                const selectedMagnification = cartItems.length > 0 
                  ? (item.selectedMagnification || null)
                  : null
                
                const hasPrescriptionLenses = cartItems.length > 0 
                  ? (item.hasPrescriptionLenses || false)
                  : false
                
                const hasExtendedWarranty = cartItems.length > 0 
                  ? (item.hasExtendedWarranty || false)
                  : false
                
                return (
                  <div key={`${item.productSlug}-${index}`} className={styles.orderItem}>
                    <div className={styles.orderItemImageContainer}>
                      <div className={styles.orderItemImage}>
                        <Image
                          src={itemImage}
                          alt={itemName}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                        <div className={styles.quantityBadge}>{itemQuantity}</div>
                      </div>
                      {frameImage && (
                        <div className={styles.frameImageContainer}>
                          <Image
                            src={frameImage}
                            alt="Selected Frame"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className={styles.selectionIconsContainer}>
                        {selectedMagnification && (
                          <div className={styles.magnificationImageContainer}>
                            <div className={styles.magnificationIconStatic}>
                              <span className={styles.magnificationValueStatic}>{selectedMagnification}</span>
                            </div>
                          </div>
                        )}
                        {hasPrescriptionLenses && (
                          <div className={styles.addOnIconContainer}>
                            <div className={styles.addOnIcon}>
                              <span className={styles.addOnIconText}>RX</span>
                            </div>
                          </div>
                        )}
                        {hasExtendedWarranty && (
                          <div className={styles.addOnIconContainer}>
                            <div className={styles.addOnIcon}>
                              <span className={styles.addOnIconText}>W</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.orderItemInfo}>
                      <h3 className={styles.orderItemName}>{itemName}</h3>
                      <p className={styles.orderItemPrice}>${itemPrice.toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}

              <div className={styles.discountSection}>
                <input
                  type="text"
                  placeholder="Discount code"
                  className={styles.discountInput}
                />
                <button type="button" className={styles.applyButton}>Apply</button>
              </div>

              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>${totalSubtotal.toFixed(2)}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Shipping</span>
                  <span className={styles.placeholderText}>Enter shipping address</span>
                </div>
                <div className={styles.priceRowTotal}>
                  <span>Total</span>
                  <span>USD ${totalSubtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.shippingRegions}>
                <h3 className={styles.shippingRegionsTitle}>Shipping Regions</h3>
                <div className={styles.shippingRegionsContent}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <p>HeliosX currently ships only to the USA, Canada, Europe, Australia, New Zealand, Malaysia, Singapore, and Japan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
