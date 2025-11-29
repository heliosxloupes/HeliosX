'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Noise from '@/components/Noise'
import Masonry from '@/components/Masonry'
import ProductCard from '@/components/ProductCard/ProductCard'
import Link from 'next/link'
import { addToCart, clearCart, getCartItemCount, getCart, updateCartItemQuantity, removeFromCart, getStripeProductId } from '@/lib/cart'
import PixelCard from '@/components/PixelCard'
import styles from '../Product.module.css'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  
  // Get default magnification for product (used in multiple places)
  const getDefaultMagnification = (slug: string): string | null => {
    if (slug === 'galileo' || slug === 'newton') {
      return '2.5x'
    } else if (slug === 'apollo') {
      return '3.0x'
    } else if (slug === 'kepler') {
      return '4.0x'
    }
    return null
  }
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedMasonryImage, setSelectedMasonryImage] = useState<string | null>(null)
  const [selectedMasonryItemId, setSelectedMasonryItemId] = useState<string | null>(null)
  const [hoveredMasonryImage, setHoveredMasonryImage] = useState<string | null>(null)
  const [isFirstIconExpanded, setIsFirstIconExpanded] = useState(false)
  const [isCollapsing, setIsCollapsing] = useState(false)
  const [isJJ04GSelected, setIsJJ04GSelected] = useState(false)
  const [isThirdIconExpanded, setIsThirdIconExpanded] = useState(false)
  const [isThirdIconCollapsing, setIsThirdIconCollapsing] = useState(false)
  const [isJJ21SSelected, setIsJJ21SSelected] = useState(false)
  const [isFourthIconExpanded, setIsFourthIconExpanded] = useState(false)
  const [isFourthIconCollapsing, setIsFourthIconCollapsing] = useState(false)
  const [selectedJJ22Variant, setSelectedJJ22Variant] = useState<string | null>(null) // 'blue', 'gold', 'grey', or null
  const [isFifthIconExpanded, setIsFifthIconExpanded] = useState(false)
  const [isFifthIconCollapsing, setIsFifthIconCollapsing] = useState(false)
  const [selectedJJ23Variant, setSelectedJJ23Variant] = useState<string | null>(null) // 'black', 'blue', 'red', or null
  const [isSixthIconExpanded, setIsSixthIconExpanded] = useState(false)
  const [isSixthIconCollapsing, setIsSixthIconCollapsing] = useState(false)
  const [selectedJJ24Variant, setSelectedJJ24Variant] = useState<string | null>(null) // 'black', 'blue', or null
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0)
  // Initialize with default magnification - always has a value for products that support it
  const [selectedMagnification, setSelectedMagnification] = useState<string | null>(getDefaultMagnification(params.slug))
  const [quantity, setQuantity] = useState(1)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const textOverlayRef = useRef<HTMLDivElement>(null)
  
  const galileoTextLines = [
    'Lightweight',
    'Modern design',
    'Variable magnification: 2.5x • 3.0x • 3.5x'
  ]

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0)
      }
    }
    
    scrollToTop()
    setTimeout(scrollToTop, 0)
    setTimeout(scrollToTop, 100)
    
    const cart = getCart()
    const existingItem = cart.find(item => item.productSlug === params.slug)
    if (existingItem) {
      setQuantity(existingItem.quantity)
    }

    setCartCount(getCartItemCount())

    const handleCartUpdate = () => {
      setCartCount(getCartItemCount())
      const updatedCart = getCart()
      const updatedItem = updatedCart.find(item => item.productSlug === params.slug)
      if (updatedItem) {
        setQuantity(updatedItem.quantity)
      } else {
        setQuantity(1)
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [params.slug])

  useEffect(() => {
    if (params.slug !== 'galileo') return

    let timeoutId: NodeJS.Timeout
    let currentCharIndex = 0
    let lineIndex = 0
    let displayedLines: string[] = []

    const typeNextChar = () => {
      if (lineIndex >= galileoTextLines.length) return

      const currentLine = galileoTextLines[lineIndex]
      
      if (currentCharIndex < currentLine.length) {
        displayedLines[lineIndex] = currentLine.substring(0, currentCharIndex + 1)
        setTypedText(displayedLines.join('\n'))
        setCurrentLineIndex(lineIndex)
        currentCharIndex++
        timeoutId = setTimeout(typeNextChar, 50)
      } else {
        lineIndex++
        setCurrentLineIndex(lineIndex)
        currentCharIndex = 0
        if (lineIndex < galileoTextLines.length) {
          displayedLines[lineIndex] = ''
          timeoutId = setTimeout(typeNextChar, 500)
        }
      }
    }

    timeoutId = setTimeout(typeNextChar, 500)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [params.slug])

  useEffect(() => {
    if (params.slug !== 'galileo' || !textOverlayRef.current) return

    const handleScroll = () => {
      if (!textOverlayRef.current) return
      
      const scrollPosition = window.scrollY || window.pageYOffset
      setScrollY(scrollPosition)
      
      const heroSection = textOverlayRef.current.closest(`.${styles.hero}`)
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect()
        const heroTop = rect.top
        const heroHeight = rect.height
        const viewportHeight = window.innerHeight
        
        const scrollProgress = Math.max(0, Math.min(1, -heroTop / (heroHeight - viewportHeight)))
        const parallaxOffset = scrollProgress * 30
        const opacity = Math.max(0.3, 1 - scrollProgress * 0.7)
        
        textOverlayRef.current.style.transform = `translateY(calc(-50% + ${parallaxOffset}px))`
        textOverlayRef.current.style.opacity = String(opacity)
      }
    }

    let rafId: number
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [params.slug])

  const scrollToSpecs = () => {
    const specsSection = document.getElementById('product-specs')
    if (specsSection) {
      specsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  
  const masonryItems = useMemo(() => {
    const baseItems: Record<string, Array<{ id: string; img: string; height: number; url: string; label: string; name?: string }>> = {
      'galileo': [
        { id: '1', img: '/Frames/JJ04B.png', height: 200, url: '#', label: 'JJ04', name: 'Galileo1' },
        { id: '2', img: '/Frames/JJ20B.png', height: 200, url: '#', label: 'JJ20', name: 'Galileo2' },
        { id: '3', img: '/Frames/JJ21G.png', height: 200, url: '#', label: 'JJ21', name: 'Galileo3' },
        { id: '4', img: '/Frames/JJ22B.png', height: 200, url: '#', label: 'JJ22', name: 'Galileo4' },
        { id: '5', img: '/Frames/JJ23Grey.png', height: 200, url: '#', label: 'JJ23', name: 'Galileo5' },
        { id: '6', img: '/Frames/JJ24Grey.png', height: 200, url: '#', label: 'JJ24', name: 'Galileo6' },
      ],
      'kepler': [
        { id: '1', img: '/Frames/JJ04B.png', height: 200, url: '#', label: 'JJ04', name: 'Kepler1' },
        { id: '3', img: '/Frames/JJ21G.png', height: 200, url: '#', label: 'JJ21', name: 'Kepler3' },
        { id: '4', img: '/Frames/JJ22B.png', height: 200, url: '#', label: 'JJ22', name: 'Kepler4' },
        { id: '5', img: '/Frames/JJ23Grey.png', height: 200, url: '#', label: 'JJ23', name: 'Kepler5' },
        { id: '6', img: '/Frames/JJ24Grey.png', height: 200, url: '#', label: 'JJ24', name: 'Kepler6' },
      ],
      'newton': [
        { id: '1', img: '/Frames/h1black2.png', height: 200, url: '#', label: 'H1' },
        { id: '2', img: '/Frames/h1red2.png', height: 200, url: '#', label: 'H1' },
        { id: '3', img: '/Frames/h1blue2.png', height: 200, url: '#', label: 'H1' },
        { id: '4', img: '/Frames/h1silver2.png', height: 200, url: '#', label: 'H1' },
      ],
      'apollo': [
        { id: '1', img: '/Frames/apolloblack.png', height: 200, url: '#', label: 'JJ04' },
        { id: '2', img: '/Frames/apollored.png', height: 200, url: '#', label: 'JJ20' },
        { id: '3', img: '/Frames/apollosand.png', height: 200, url: '#', label: 'JJ21' },
        { id: '4', img: '/Frames/apollogrey.png', height: 200, url: '#', label: 'JJ22' },
        { id: '5', img: '/Frames/apollomauve.png', height: 200, url: '#', label: 'JJ23' },
      ],
    }
    return baseItems[params.slug] || baseItems['galileo']
  }, [params.slug])

  useEffect(() => {
    const cart = getCart()
    const existingItem = cart.find(item => item.productSlug === params.slug)
    if (existingItem) {
      if (existingItem.selectedFrameId) {
        const frameItem = masonryItems.find(item => item.id === existingItem.selectedFrameId)
        if (frameItem) {
          setSelectedMasonryItemId(frameItem.id)
          setSelectedMasonryImage(frameItem.img)
        }
      } else if (masonryItems.length > 0) {
        const firstItem = masonryItems[0]
        setSelectedMasonryItemId(firstItem.id)
        setSelectedMasonryImage(firstItem.img)
      }
    } else if (masonryItems.length > 0) {
      const firstItem = masonryItems[0]
      setSelectedMasonryItemId(firstItem.id)
      setSelectedMasonryImage(firstItem.img)
    }
  }, [params.slug, masonryItems])

  // Auto-select first magnification option (also ensures it's set if not already)
  useEffect(() => {
    const cart = getCart()
    const existingItem = cart.find(item => item.productSlug === params.slug)
    const defaultMag = getDefaultMagnification(params.slug)
    
    if (existingItem) {
      if (existingItem.selectedMagnification) {
        setSelectedMagnification(existingItem.selectedMagnification)
      } else if (defaultMag) {
        // Auto-select first magnification option based on product
        setSelectedMagnification(defaultMag)
        // Also update the cart item to ensure it's stored
        const itemIndex = cart.findIndex(i => i.productSlug === params.slug)
        if (itemIndex >= 0) {
          cart[itemIndex].selectedMagnification = defaultMag
          cart[itemIndex].stripeProductId = getStripeProductId(params.slug, defaultMag)
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('heliosx_cart', JSON.stringify(cart))
              window.dispatchEvent(new CustomEvent('cartUpdated'))
            } catch (error) {
              console.error('Error saving cart:', error)
            }
          }
        }
      }
    } else if (defaultMag) {
      // Auto-select first magnification option based on product
      setSelectedMagnification(defaultMag)
    }
  }, [params.slug])

  // Update cart when magnification changes (for all products with magnification)
  useEffect(() => {
    if (params.slug !== 'galileo' && params.slug !== 'newton' && params.slug !== 'apollo' && params.slug !== 'kepler') {
      return // Only update for products with magnification
    }
    
    if (!selectedMagnification) {
      return // Don't update if no magnification selected
    }

    const cart = getCart()
    const existingItem = cart.find(item => item.productSlug === params.slug)
    
    if (existingItem) {
      const itemIndex = cart.findIndex(i => i.productSlug === params.slug)
      if (itemIndex >= 0) {
        const magToUse = selectedMagnification || getDefaultMagnification(params.slug)
        cart[itemIndex].selectedMagnification = magToUse
        cart[itemIndex].stripeProductId = getStripeProductId(params.slug, magToUse)
        
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('heliosx_cart', JSON.stringify(cart))
            window.dispatchEvent(new CustomEvent('cartUpdated'))
          } catch (error) {
            console.error('Error saving cart:', error)
          }
        }
      }
    }
  }, [selectedMagnification, params.slug])

  const productData: Record<string, {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    price: string;
    magnification: string;
    images: string[];
  }> = {
    'galileo': {
      name: 'Galileo Surgical Loupes',
      shortName: 'Galileo',
      tagline: 'The world\'s first surgical loupes that your eyes and neck will actually love.',
      description: 'Premium surgical loupes designed for precision and comfort. Built for medical professionals who demand excellence.',
      price: '$499',
      magnification: '3.5X',
      images: ['/product-loupes-main.jpg', '/product-loupes-side.jpg', '/product-loupes-detail.jpg'],
    },
    'kepler': {
      name: 'Kepler Surgical Loupes',
      shortName: 'Kepler',
      tagline: 'Advanced optics engineered for extended procedures and optimal comfort.',
      description: 'Advanced optics with ergonomic design. Engineered for extended procedures and optimal comfort.',
      price: '$549',
      magnification: '4.0X',
      images: ['/product-loupes-main.jpg', '/product-loupes-side.jpg', '/product-loupes-detail.jpg'],
    },
    'apollo': {
      name: 'Apollo Surgical Loupes',
      shortName: 'Apollo',
      tagline: 'Professional-grade surgical loupes with superior clarity and lightweight construction.',
      description: 'Professional-grade surgical loupes with superior clarity and lightweight construction.',
      price: '$599',
      magnification: '4.5X',
      images: ['/product-loupes-main.jpg', '/product-loupes-side.jpg', '/product-loupes-detail.jpg'],
    },
    'newton': {
      name: 'Newton Surgical Loupes',
      shortName: 'Newton',
      tagline: 'Classic design meets modern technology. Reliable performance for everyday surgical procedures.',
      description: 'Classic design meets modern technology. Reliable performance for everyday surgical procedures.',
      price: '$449',
      magnification: '3.0X',
      images: ['/product-loupes-main.jpg', '/product-loupes-side.jpg', '/product-loupes-detail.jpg'],
    },
  }

  const product = useMemo(() => productData[params.slug] || productData['galileo'], [params.slug])
  const images = useMemo(() => product.images, [product.images])

  const thumbnailImages = useMemo(() => {
    const config: Record<string, string[]> = {
      'galileo': ['/Galileo/GalileoMain2.png', '/Galileo/BlackguyGalileo.png', '/Galileo/BlonddirectNew.png', '/Oldguy4Galileo.png'],
      'kepler': ['/Keppler/KepplerNewmain.png', '/Keppler/KepplerMain.png', '/Keppler/Keppler4.png', '/Keppler/Keppler2.png'],
      'apollo': ['/Apollo/Apollofinal.png', '/Apollo/Apollo3xFemale2.png', '/Apollo/Blondcloseup.png', '/Apollo/Apollo3xAsian.png'],
      'newton': ['/Newton/NewtonMain.png', '/Newton/NewtonAsian2.png', '/whiteasianNewton.png', '/old guy.png'],
    }
    return config[params.slug] || config['galileo']
  }, [params.slug])

  const mainImage = useMemo(() => {
    if (params.slug === 'galileo') return '/Galileo/GalileoMain2.png'
    if (params.slug === 'newton') return '/Newton/NewtonMain.png'
    if (params.slug === 'kepler') return '/Keppler/KepplerNewmain.png'
    if (params.slug === 'apollo') return '/Apollo/Apollofinal.png'
    return '/loupesondesk2.png'
  }, [params.slug])

  const keyFeatures = params.slug === 'galileo' ? [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12h18M12 3v18" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      ),
      title: 'Light Weight',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      title: 'Compatible with light source',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
        </svg>
      ),
      title: 'Extra Wide Field of View',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      ),
      title: 'Multi Layer coated lenses',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h5" />
        </svg>
      ),
      title: 'Prescription Available',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" />
        </svg>
      ),
      title: 'High Color Accuracy',
    },
  ] : params.slug === 'newton' ? [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12h18M12 3v18" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 6l12 12M18 6L6 18" />
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
      ),
      title: 'Ultra Light Weight',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      title: 'Compatible with light source',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
        </svg>
      ),
      title: 'Extra Wide Field of View',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      ),
      title: 'Multi Layer coated lenses',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h5" />
        </svg>
      ),
      title: 'Prescription Available',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" />
        </svg>
      ),
      title: 'High Color Accuracy',
    },
  ] : params.slug === 'apollo' ? [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Spinal vertebrae - M/W shape with rounded horizontal protrusions, 6 stacked */}
          {/* Top vertebra */}
          <path d="M6.5 3.5c0-0.3 1-0.5 2.5-0.5s2.5 0.2 2.5 0.5v1c0 0.3-1 0.5-2.5 0.5s-2.5-0.2-2.5-0.5V3.5z" />
          <path d="M5.5 4.5h3c0.3 0 0.5 0.2 0.5 0.5M15.5 4.5h3c0.3 0 0.5 0.2 0.5 0.5" />
          <path d="M5.5 4.5c0 0.3 0.2 0.5 0.5 0.5h12c0.3 0 0.5-0.2 0.5-0.5" />
          {/* Second vertebra */}
          <path d="M6.5 6.2c0-0.3 1-0.5 2.5-0.5s2.5 0.2 2.5 0.5v1c0 0.3-1 0.5-2.5 0.5s-2.5-0.2-2.5-0.5V6.2z" />
          <path d="M5.5 7.2h3c0.3 0 0.5 0.2 0.5 0.5M15.5 7.2h3c0.3 0 0.5 0.2 0.5 0.5" />
          <path d="M5.5 7.2c0 0.3 0.2 0.5 0.5 0.5h12c0.3 0 0.5-0.2 0.5-0.5" />
          {/* Third vertebra */}
          <path d="M6.5 8.9c0-0.3 1-0.5 2.5-0.5s2.5 0.2 2.5 0.5v1c0 0.3-1 0.5-2.5 0.5s-2.5-0.2-2.5-0.5V8.9z" />
          <path d="M5.5 9.9h3c0.3 0 0.5 0.2 0.5 0.5M15.5 9.9h3c0.3 0 0.5 0.2 0.5 0.5" />
          <path d="M5.5 9.9c0 0.3 0.2 0.5 0.5 0.5h12c0.3 0 0.5-0.2 0.5-0.5" />
          {/* Fourth vertebra */}
          <path d="M6.5 11.6c0-0.3 1-0.5 2.5-0.5s2.5 0.2 2.5 0.5v1c0 0.3-1 0.5-2.5 0.5s-2.5-0.2-2.5-0.5v-1z" />
          <path d="M5.5 12.6h3c0.3 0 0.5 0.2 0.5 0.5M15.5 12.6h3c0.3 0 0.5 0.2 0.5 0.5" />
          <path d="M5.5 12.6c0 0.3 0.2 0.5 0.5 0.5h12c0.3 0 0.5-0.2 0.5-0.5" />
          {/* Fifth vertebra */}
          <path d="M6.5 14.3c0-0.3 1-0.5 2.5-0.5s2.5 0.2 2.5 0.5v1c0 0.3-1 0.5-2.5 0.5s-2.5-0.2-2.5-0.5v-1z" />
          <path d="M5.5 15.3h3c0.3 0 0.5 0.2 0.5 0.5M15.5 15.3h3c0.3 0 0.5 0.2 0.5 0.5" />
          <path d="M5.5 15.3c0 0.3 0.2 0.5 0.5 0.5h12c0.3 0 0.5-0.2 0.5-0.5" />
          {/* Bottom vertebra */}
          <path d="M6.5 17c0-0.3 1-0.5 2.5-0.5s2.5 0.2 2.5 0.5v1c0 0.3-1 0.5-2.5 0.5s-2.5-0.2-2.5-0.5V17z" />
          <path d="M5.5 18h3c0.3 0 0.5 0.2 0.5 0.5M15.5 18h3c0.3 0 0.5 0.2 0.5 0.5" />
          <path d="M5.5 18c0 0.3 0.2 0.5 0.5 0.5h12c0.3 0 0.5-0.2 0.5-0.5" />
        </svg>
      ),
      title: 'Ergonomic Design',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      title: 'Compatible with light source',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
        </svg>
      ),
      title: 'Extra Wide Field of View',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      ),
      title: 'Multi Layer coated lenses',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h5" />
        </svg>
      ),
      title: 'Prescription Available',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" />
        </svg>
      ),
      title: 'High Color Accuracy',
    },
  ] : params.slug === 'kepler' ? [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12h18M12 3v18" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      ),
      title: 'Light Weight',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      title: 'Compatible with light source',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
        </svg>
      ),
      title: 'Extra Wide Field of View',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      ),
      title: 'Multi Layer coated lenses',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h5" />
        </svg>
      ),
      title: 'Prescription Available',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" />
        </svg>
      ),
      title: 'High Color Accuracy',
    },
  ] : [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <text x="12" y="14" fontSize="8" textAnchor="middle" fill="currentColor" fontWeight="600">60 FPS</text>
        </svg>
      ),
      title: 'Fast, paper-like display',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 13l2 2 4-4" />
        </svg>
      ),
      title: 'Read, write, take notes',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: 'Use your favorite apps',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      title: 'Sunlight readable',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
        </svg>
      ),
      title: 'Blue-light free backlight',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      title: 'Soft on the eyes',
    },
  ]

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    const cart = getCart()
    const existingItem = cart.find(item => item.productSlug === params.slug)
    
    if (existingItem) {
      const selectedItem = selectedMasonryItemId ? masonryItems.find((item: { id: string }) => item.id === selectedMasonryItemId) : null
      const cart = getCart()
      const itemIndex = cart.findIndex(i => i.productSlug === params.slug)
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = newQuantity
        if (selectedMasonryItemId && selectedItem) {
          cart[itemIndex].selectedFrameId = selectedMasonryItemId
          cart[itemIndex].selectedFrameName = selectedItem.name || selectedItem.label
          cart[itemIndex].selectedFrameImage = selectedMasonryImage || selectedItem.img
        }
        if (params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') {
          const magToUse = selectedMagnification || getDefaultMagnification(params.slug)
          cart[itemIndex].selectedMagnification = magToUse
          cart[itemIndex].stripeProductId = getStripeProductId(params.slug, magToUse)
        }
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('heliosx_cart', JSON.stringify(cart))
            window.dispatchEvent(new CustomEvent('cartUpdated'))
          } catch (error) {
            console.error('Error saving cart:', error)
          }
        }
      }
    } else {
      const product = productData[params.slug]
      if (product) {
        const imageToUse = selectedMasonryImage || mainImage
        const selectedItem = selectedMasonryItemId ? masonryItems.find((item: { id: string }) => item.id === selectedMasonryItemId) : null
        const frameImageToSave = selectedMasonryImage || selectedItem?.img || null
        addToCart({
          productSlug: params.slug,
          name: product.name,
          shortName: product.shortName,
          price: parseInt(product.price.replace('$', '')),
          quantity: newQuantity,
          image: imageToUse,
          selectedFrameId: selectedMasonryItemId || null,
          selectedFrameName: selectedItem?.name || selectedItem?.label || null,
          selectedFrameImage: frameImageToSave,
          selectedMagnification: (params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') ? (selectedMagnification || getDefaultMagnification(params.slug)) : null,
          stripeProductId: (params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') ? getStripeProductId(params.slug, selectedMagnification || getDefaultMagnification(params.slug)) : null,
        })
      }
    }
  }

  const handleClose = () => {
    clearCart()
    router.push('/')
  }

  const productSpecs = params.slug === 'galileo' ? {
    lightWeight: {
      title: 'Light Weight',
      specs: [
        'Volume reduced by 30% while maintaining excellent performance.',
      ],
    },
    excellentOptics: {
      title: 'Excellent Optics',
      specs: [
        'A+ grade imported optical glass',
        'Multi-layer coated premium lenses',
        'High color fidelity',
        'Light transmittance: >98%',
      ],
    },
    opticalLens: {
      title: 'Optical Lens',
      specs: [
        'Extra-wide field of view',
        'High color accuracy',
        'Designed for precise surgical and dental work',
      ],
    },
    lightSource: {
      title: 'Light Source',
      specs: [
        'Compatible with fixed light source and power supply',
        'Produces a bright, uniform spot',
        'Long-lasting illumination',
      ],
    },
    generalSpecs: {
      title: 'General Specifications',
      specs: [
        'Product Model: TTL-Galileo',
        'Magnification Options: 2.5x / 3.0x / 3.5x',
        'Weight: 35g / 36g / 37g',
        'Frames: Optional',
        'Prescription Available: Yes',
      ],
    },
    opticsBuild: {
      title: 'Optics & Build',
      specs: [
        'IPD Range: 54–72 mm',
        'Barrels Material: Metal',
        'Lens Material: A+ grade optical glass',
        'Transmittance: 98%',
        'Fixed Lights: Yes',
      ],
    },
    magnification25: {
      title: '2.5x Magnification',
      specs: [
        'Working Distance: 300–580 mm',
        'Field of View: 150–170 mm',
        'Depth of Field: 200 mm',
      ],
    },
    magnification30: {
      title: '3.0x Magnification',
      specs: [
        'Working Distance: 300–580 mm',
        'Field of View: 130–150 mm',
        'Depth of Field: 200 mm',
      ],
    },
    magnification35: {
      title: '3.5x Magnification',
      specs: [
        'Working Distance: 300–580 mm',
        'Field of View: 110–130 mm',
        'Depth of Field: 200 mm',
      ],
    },
  } : params.slug === 'newton' ? {
    lightWeight: {
      title: 'First Choice',
      specs: [
        'Provides a wide field of view and depth of field at an economical price.',
      ],
    },
    excellentOptics: {
      title: 'Excellent Optics',
      specs: [
        'Excellent optical design using A-grade imported optical glass.',
        'High color fidelity with multi-layer coated premium lenses.',
        'Light transmittance is over 90%.',
      ],
    },
    opticalLens: {
      title: 'Optical Lens',
      specs: [
        'Super wide field of view.',
        'High color fidelity, allowing precise and comfortable visualization.',
      ],
    },
    lightSource: {
      title: 'Light Source',
      specs: [
        'Compatible with fixed light sources and power supply.',
        'Produces a bright, uniform, long-lasting illumination spot.',
      ],
    },
    generalSpecs: {
      title: 'General Specifications',
      specs: [
        'Product Model: TTL-22',
        'Magnification Options: 2.5x / 3.0x / 3.5x',
        'Weight: 40g / 45g / 50g',
        'Frames: Optional',
        'Prescription Available: No',
      ],
    },
    opticsBuild: {
      title: 'Optics & Build',
      specs: [
        'IPD Range: 54–72 mm',
        'Barrels Material: PC',
        'Lens Material: A-grade optical glass',
        'Transmittance: 90%',
        'Fixed Lights: Yes',
      ],
    },
    magnification25: {
      title: '2.5x Magnification',
      specs: [
        'Working Distance: 300–550 mm',
        'Field of View: 80–120 mm',
        'Depth of Field: 200 mm',
      ],
    },
    magnification30: {
      title: '3.0x Magnification',
      specs: [
        'Working Distance: 300–550 mm',
        'Field of View: 70–110 mm',
        'Depth of Field: 200 mm',
      ],
    },
    magnification35: {
      title: '3.5x Magnification',
      specs: [
        'Working Distance: 300–550 mm',
        'Field of View: 60–100 mm',
        'Depth of Field: 200 mm',
      ],
    },
  } : params.slug === 'apollo' ? {
    ergonomicDesign: {
      title: 'Ergonomic Design',
      specs: [
        'Engineered to dramatically reduce cervical strain and transform the way clinicians work.',
        'Advanced ergonomic architecture eliminates the traditional posture of bending and forward neck flexion.',
        'Allows for a neutral spine, improved comfort, and extended procedural endurance.',
        'Designed for professionals who demand precision and long-term physical well-being.',
      ],
    },
    excellentOptics: {
      title: 'Excellent Optics',
      specs: [
        'Superior working experience without compromising optical clarity.',
        'High color fidelity',
        'Multi-layer coated premium lenses',
        'Light transmittance: >98%',
      ],
    },
    opticalLens: {
      title: 'Optical Lens',
      specs: [
        'Extra-wide field of view',
        'High color accuracy',
        'Designed for precise surgical and dental work',
      ],
    },
    lightSource: {
      title: 'Light Source',
      specs: [
        'Compatible with fixed light source and power supply',
        'Produces a bright, uniform spot',
        'Long-lasting illumination',
      ],
    },
    generalSpecs: {
      title: 'General Specifications',
      specs: [
        'Product Model: Apollo Ergo Loupes',
        'Magnification Options: 3.0× / 4.0× / 5.0× / 6.0×',
        'Frames: Optional',
        'Prescription Available: Yes',
      ],
    },
    opticsBuild: {
      title: 'Optics & Build',
      specs: [
        'IPD Range: 54–72 mm',
        'Barrels Material: Metal',
        'Lens Material: A+ grade optical glass',
        'Transmittance: 98%',
        'Fixed Lights: Yes',
      ],
    },
    magnification30: {
      title: '3.0× Magnification',
      specs: [
        'Working Distance: 450–550 mm',
        'Field of View: 85–105 mm',
        'Depth of Field: 95–135 mm',
        'Net Weight: 55 g',
      ],
    },
    magnification40: {
      title: '4.0× Magnification',
      specs: [
        'Working Distance: 450–550 mm',
        'Field of View: 70–95 mm',
        'Depth of Field: 80–110 mm',
        'Net Weight: 56 g',
      ],
    },
    magnification50: {
      title: '5.0× Magnification',
      specs: [
        'Working Distance: 450–550 mm',
        'Field of View: 60–75 mm',
        'Depth of Field: 70–115 mm',
        'Net Weight: 57.6 g',
      ],
    },
    magnification60: {
      title: '6.0× Magnification',
      specs: [
        'Working Distance: 450–550 mm',
        'Field of View: 50–70 mm',
        'Depth of Field: 55–75 mm',
        'Net Weight: 58.2 g',
      ],
    },
  } : params.slug === 'kepler' ? {
    precisionDesign: {
      title: 'Precision Design',
      specs: [
        'A+ grade optical lenses deliver exceptional image clarity and sharpness.',
        'Ideal for high-precision surgical and dental work.',
        'High-durability metal tube barrel provides reliable structural strength.',
        'Balanced combination of clarity, durability, and precision.',
      ],
    },
    excellentOptics: {
      title: 'Excellent Optics',
      specs: [
        'A+ grade optical lenses',
        'Multi-layer coated premium lenses',
        'High color fidelity',
        'Light transmittance: >98%',
      ],
    },
    opticalLens: {
      title: 'Optical Lens',
      specs: [
        'Extra-wide field of view',
        'High color accuracy',
        'Designed for precise surgical and dental work',
        'Stable visualization even at higher magnifications',
      ],
    },
    lightSource: {
      title: 'Light Source',
      specs: [
        'Compatible with fixed light source and power supply',
        'Produces a bright, uniform spot',
        'Long-lasting illumination',
      ],
    },
    generalSpecs: {
      title: 'General Specifications',
      specs: [
        'Product Model: TTL-21',
        'Magnification Options: 4.0× / 5.0× / 6.0×',
        'Frames: Optional',
        'Prescription Available: Yes',
      ],
    },
    opticsBuild: {
      title: 'Optics & Build',
      specs: [
        'IPD Range: 54–72 mm',
        'Barrels Material: Metal',
        'Lens Material: A+ grade optical glass',
        'Transmittance: 98%',
        'Fixed Lights: Yes',
      ],
    },
    magnification40: {
      title: '4.0× Magnification',
      specs: [
        'Working Distance: 280–380mm or 360–460mm',
        'Field of View: 60–75 mm',
        'Depth of Field: 80 mm',
      ],
    },
    magnification50: {
      title: '5.0× Magnification',
      specs: [
        'Working Distance: 360–460mm or 440–540mm',
        'Field of View: 55–70 mm',
        'Depth of Field: 80 mm',
      ],
    },
    magnification60: {
      title: '6.0× Magnification',
      specs: [
        'Working Distance: 500–600 mm',
        'Field of View: 50–65 mm',
        'Depth of Field: 80 mm',
      ],
    },
  } : {
    display: {
      title: 'Display',
      specs: [
        `${product.magnification} Magnification`,
        '14-18 inches • 8.5 inches field of view',
        'Crystal-clear optics',
        'Optimal depth of field',
      ],
    },
    performance: {
      title: 'Performance',
      specs: [
        'Frame: Lightweight polymer',
        'Weight: 2.8 oz',
        'Ergonomic design',
        'All-day comfort',
      ],
    },
    connectivity: {
      title: 'Connectivity',
      specs: [
        'Adjustable fit',
        'Customizable temple arms',
        'Comfortable head strap',
        'Professional-grade materials',
      ],
    },
  }

  return (
    <>
      <button 
        onClick={handleClose}
        className={styles.closeButton}
        aria-label="Close and return to home"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <main className={styles.productPage}>
        <div className={styles.productPageContainer}>
          <section className={styles.hero}>
            <div className={styles.heroGrid}>
                <div className={styles.heroImage}>
                  <div className={styles.mainImage}>
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.carouselContainer}>
                        {thumbnailImages.map((imageSrc, index) => (
                          <div
                            key={index}
                            className={`${styles.carouselSlide} ${
                              selectedThumbnailIndex === index
                                ? styles.carouselSlideActive
                                : selectedThumbnailIndex < index
                                ? styles.carouselSlideRight
                                : styles.carouselSlideLeft
                            }`}
                          >
                            <Image
                              src={imageSrc}
                              alt={`${product.name} - Image ${index + 1}`}
                              fill
                              style={{ objectFit: 'cover' }}
                              priority={index === 0}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.imageNoise}>
                      <Noise 
                        patternSize={250}
                        patternScaleX={1}
                        patternScaleY={1}
                        patternRefreshInterval={2}
                        patternAlpha={8}
                      />
                    </div>
                    {(params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') && (
                      <div className={styles.productNameOverlay}>
                        <h1 className={styles.productNameText}>
                          {params.slug === 'galileo' ? 'Galileo' : 
                           params.slug === 'newton' ? 'Newton' : 
                           params.slug === 'apollo' ? 'Apollo' : 
                           'Kepler'}
                        </h1>
                        <div className={styles.productNameUnderline}></div>
                        <p className={styles.productNameSubheading}>
                          {params.slug === 'apollo' ? '3.0x • 4.0x • 5.0x • 6.0x' : 
                           params.slug === 'kepler' ? '4.0x • 5.0x • 6.0x' : 
                           '2.5x • 3.0x • 3.5x'}
                        </p>
                      </div>
                    )}
                    <div className={styles.thumbnailContainer}>
                      {thumbnailImages.map((imageSrc, index) => (
                        <div
                          key={index}
                          className={`${styles.mainImageThumbnail} ${
                            selectedThumbnailIndex === index ? styles.mainImageThumbnailActive : ''
                          }`}
                          onClick={() => setSelectedThumbnailIndex(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Image
                            src={imageSrc}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                    {/* View Product Specs Button - Bottom Right - For Galileo, Newton, Apollo, and Kepler */}
                    {(params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') && (
                      <button
                        onClick={scrollToSpecs}
                        className={styles.viewSpecsButtonOverlay}
                        aria-label="View Product Specs"
                      >
                        View Product Specs
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.heroContent}>
                  {/* Logo above the expanded product card - Fixed above scrollable area */}
                  {(params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') && (
                    <div className={styles.expandedProductLogo}>
                      <Image
                        src="/LogoMinimal.png"
                        alt="HeliosX Logo"
                        width={120}
                        height={40}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  )}
                  <div className={styles.heroContentScrollable}>
                  {params.slug === 'galileo' ? (
                    <>
                      {/* Expanded ProductCard for Galileo with integrated key features */}
                      <div className={styles.expandedProductCard}>
                      <h2 className={styles.expandedProductTitle}>{product.shortName}</h2>
                      <div className={styles.expandedProductImages}>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src={mainImage}
                            alt={product.shortName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className={styles.imageNoise}>
                            <Noise 
                              patternSize={250}
                              patternScaleX={1}
                              patternScaleY={1}
                              patternRefreshInterval={2}
                              patternAlpha={8}
                            />
                          </div>
                        </div>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src="/Galileo/Galileomanequin.png"
                            alt="Galileo Mannequin"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className={styles.imageNoise}>
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
                      <div className={styles.expandedProductFeatures}>
                        {keyFeatures.map((feature, index) => (
                          <div key={index} className={styles.expandedFeatureItem}>
                            <span className={styles.expandedFeatureCheckmark}>✓</span>
                            <span className={styles.expandedFeatureText}>{feature.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.expandedProductFooter}>
                        <div className={styles.expandedProductPrice}>
                          <span className={styles.expandedProductPriceCurrent}>{product.price}</span>
                        </div>
                        <div className={styles.expandedQuantitySelector}>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={styles.expandedQuantityValue}>{quantity}</span>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    </>
                  ) : params.slug === 'newton' ? (
                    <>
                      {/* Expanded ProductCard for Newton with integrated key features */}
                      <div className={styles.expandedProductCard}>
                      <h2 className={styles.expandedProductTitle}>{product.shortName}</h2>
                      <div className={styles.expandedProductImages}>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src={mainImage}
                            alt={product.shortName}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'right center' }}
                          />
                          <div className={styles.imageNoise}>
                            <Noise 
                              patternSize={250}
                              patternScaleX={1}
                              patternScaleY={1}
                              patternRefreshInterval={2}
                              patternAlpha={8}
                            />
                          </div>
                        </div>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src="/Newton/Newtonmanequin.png"
                            alt="Newton Mannequin"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className={styles.imageNoise}>
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
                      <div className={styles.expandedProductFeatures}>
                        {keyFeatures.map((feature, index) => (
                          <div key={index} className={styles.expandedFeatureItem}>
                            <span className={styles.expandedFeatureCheckmark}>✓</span>
                            <span className={styles.expandedFeatureText}>{feature.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.expandedProductFooter}>
                        <div className={styles.expandedProductPrice}>
                          <span className={styles.expandedProductPriceCurrent}>{product.price}</span>
                        </div>
                        <div className={styles.expandedQuantitySelector}>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={styles.expandedQuantityValue}>{quantity}</span>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    </>
                  ) : params.slug === 'apollo' ? (
                    <>
                      {/* Expanded ProductCard for Apollo with integrated key features */}
                      <div className={styles.expandedProductCard}>
                      <h2 className={styles.expandedProductTitle}>{product.shortName}</h2>
                      <div className={styles.expandedProductImages}>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src={mainImage}
                            alt={product.shortName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className={styles.imageNoise}>
                            <Noise 
                              patternSize={250}
                              patternScaleX={1}
                              patternScaleY={1}
                              patternRefreshInterval={2}
                              patternAlpha={8}
                            />
                          </div>
                        </div>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src="/Apollo/Apollomanequin.png"
                            alt="Apollo Mannequin"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className={styles.imageNoise}>
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
                      <div className={styles.expandedProductFeatures}>
                        {keyFeatures.map((feature, index) => (
                          <div key={index} className={styles.expandedFeatureItem}>
                            <span className={styles.expandedFeatureCheckmark}>✓</span>
                            <span className={styles.expandedFeatureText}>{feature.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.expandedProductFooter}>
                        <div className={styles.expandedProductPrice}>
                          <span className={styles.expandedProductPriceCurrent}>{product.price}</span>
                        </div>
                        <div className={styles.expandedQuantitySelector}>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={styles.expandedQuantityValue}>{quantity}</span>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    </>
                  ) : params.slug === 'kepler' ? (
                    <>
                      {/* Expanded ProductCard for Kepler with integrated key features */}
                      <div className={styles.expandedProductCard}>
                      <h2 className={styles.expandedProductTitle}>{product.shortName}</h2>
                      <div className={styles.expandedProductImages}>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src={mainImage}
                            alt={product.shortName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className={styles.imageNoise}>
                            <Noise 
                              patternSize={250}
                              patternScaleX={1}
                              patternScaleY={1}
                              patternRefreshInterval={2}
                              patternAlpha={8}
                            />
                          </div>
                        </div>
                        <div className={styles.expandedProductImageWrapper}>
                          <Image
                            src="/Keppler/Keplermanequin.png"
                            alt="Kepler Mannequin"
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          <div className={styles.imageNoise}>
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
                      <div className={styles.expandedProductFeatures}>
                        {keyFeatures.map((feature, index) => (
                          <div key={index} className={styles.expandedFeatureItem}>
                            <span className={styles.expandedFeatureCheckmark}>✓</span>
                            <span className={styles.expandedFeatureText}>{feature.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.expandedProductFooter}>
                        <div className={styles.expandedProductPrice}>
                          <span className={styles.expandedProductPriceCurrent}>{product.price}</span>
                        </div>
                        <div className={styles.expandedQuantitySelector}>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={styles.expandedQuantityValue}>{quantity}</span>
                          <button 
                            className={styles.expandedQuantityButton} 
                            onClick={() => handleQuantityChange(quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    </>
                  ) : (
                    <>
                  <div className={styles.productCardContainer}>
                    <ProductCard
                      name={product.shortName}
                      price={product.price}
                      image={mainImage}
                      quantity={quantity}
                      onQuantityChange={handleQuantityChange}
                    />
                  </div>
                  
                  <div className={styles.keyFeaturesInline}>
                    <div className={styles.framesDivider}></div>
                    <div className={styles.keyFeaturesHeader}>
                      <h2 className={styles.keyFeaturesTitle}>Key Features</h2>
                      <button className={styles.viewSpecsButton} onClick={scrollToSpecs}>
                        View full specs
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                    <div className={styles.featuresGrid}>
                      {keyFeatures.map((feature, index) => (
                        <div key={index} className={styles.featureItem}>
                          <div className={styles.featureIconSmall}>{feature.icon}</div>
                          <span className={styles.featureText}>{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                    </>
                  )}

                  <div className={styles.framesSection}>
                    <div className={styles.framesDivider}></div>
                    <h2 className={styles.framesHeading}>Frames</h2>
                    <div className={styles.folderSection}>
                      <div className={styles.frameThumbnailsContainer}>
                        {masonryItems.map((item: { id: string; img: string; label: string }, index: number) => {
                          const isFirstIcon = item.id === '1' && (params.slug === 'galileo' || params.slug === 'kepler')
                          const isThirdIcon = item.id === '3' && (params.slug === 'galileo' || params.slug === 'kepler')
                          const isFourthIcon = item.id === '4' && (params.slug === 'galileo' || params.slug === 'kepler')
                          const isFifthIcon = item.id === '5' && (params.slug === 'galileo' || params.slug === 'kepler')
                          const isSixthIcon = item.id === '6' && (params.slug === 'galileo' || params.slug === 'kepler')
                          
                          return (
                            <div key={item.id} style={{ position: 'relative' }}>
                              <div
                            className={`${styles.frameThumbnail} ${
                                  selectedMasonryItemId === item.id && !isJJ04GSelected && !isJJ21SSelected && !selectedJJ22Variant && !selectedJJ23Variant && !selectedJJ24Variant ? styles.frameThumbnailActive : ''
                            }`}
                            onClick={() => {
                                  if (isFirstIcon) {
                                    const newExpandedState = !isFirstIconExpanded
                                    setIsFirstIconExpanded(newExpandedState)
                                    setIsCollapsing(false)
                                    // Collapse 3rd and 4th icons if they're expanded
                                    if (isThirdIconExpanded) {
                                      setIsThirdIconCollapsing(true)
                                      setIsJJ21SSelected(false)
                                      setTimeout(() => {
                                        setIsThirdIconExpanded(false)
                                        setIsThirdIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFourthIconExpanded) {
                                      setIsFourthIconCollapsing(true)
                                      setSelectedJJ22Variant(null)
                                      setTimeout(() => {
                                        setIsFourthIconExpanded(false)
                                        setIsFourthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFifthIconExpanded) {
                                      setIsFifthIconCollapsing(true)
                                      setSelectedJJ23Variant(null)
                                      setTimeout(() => {
                                        setIsFifthIconExpanded(false)
                                        setIsFifthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isSixthIconExpanded) {
                                      setIsSixthIconCollapsing(true)
                                      setSelectedJJ24Variant(null)
                                      setTimeout(() => {
                                        setIsSixthIconExpanded(false)
                                        setIsSixthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (!newExpandedState) {
                                      // Collapsing - deselect JJ04G and select JJ04B
                                      setIsJJ04GSelected(false)
                              setSelectedMasonryItemId(item.id)
                              setSelectedMasonryImage(item.img)
                                    } else {
                                      // Expanding - if JJ04G was selected, keep it; otherwise select JJ04B
                                      if (isJJ04GSelected) {
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ04G.png')
                                      } else {
                                        // Clicking JJ04B while expanded - select JJ04B and deselect JJ04G
                                        setIsJJ04GSelected(false)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(item.img)
                                      }
                                    }
                                  } else if (isThirdIcon) {
                                    const newExpandedState = !isThirdIconExpanded
                                    setIsThirdIconExpanded(newExpandedState)
                                    setIsThirdIconCollapsing(false)
                                    // Collapse other icons if they're expanded
                                    if (isFirstIconExpanded) {
                                      setIsCollapsing(true)
                                      setIsJJ04GSelected(false)
                                      setTimeout(() => {
                                        setIsFirstIconExpanded(false)
                                        setIsCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFourthIconExpanded) {
                                      setIsFourthIconCollapsing(true)
                                      setSelectedJJ22Variant(null)
                                      setTimeout(() => {
                                        setIsFourthIconExpanded(false)
                                        setIsFourthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFifthIconExpanded) {
                                      setIsFifthIconCollapsing(true)
                                      setSelectedJJ23Variant(null)
                                      setTimeout(() => {
                                        setIsFifthIconExpanded(false)
                                        setIsFifthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isSixthIconExpanded) {
                                      setIsSixthIconCollapsing(true)
                                      setSelectedJJ24Variant(null)
                                      setTimeout(() => {
                                        setIsSixthIconExpanded(false)
                                        setIsSixthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (!newExpandedState) {
                                      // Collapsing - deselect JJ21S and select JJ21G
                                      setIsJJ21SSelected(false)
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage(item.img)
                                    } else {
                                      // Expanding - if JJ21S was selected, keep it; otherwise select JJ21G
                                      if (isJJ21SSelected) {
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ21S.png')
                                      } else {
                                        // Clicking JJ21G while expanded - select JJ21G and deselect JJ21S
                                        setIsJJ21SSelected(false)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(item.img)
                                      }
                                    }
                                  } else if (isFourthIcon) {
                                    const newExpandedState = !isFourthIconExpanded
                                    setIsFourthIconExpanded(newExpandedState)
                                    setIsFourthIconCollapsing(false)
                                    // Collapse other icons if they're expanded
                                    if (isFirstIconExpanded) {
                                      setIsCollapsing(true)
                                      setIsJJ04GSelected(false)
                                      setTimeout(() => {
                                        setIsFirstIconExpanded(false)
                                        setIsCollapsing(false)
                                      }, 400)
                                    }
                                    if (isThirdIconExpanded) {
                                      setIsThirdIconCollapsing(true)
                                      setIsJJ21SSelected(false)
                                      setTimeout(() => {
                                        setIsThirdIconExpanded(false)
                                        setIsThirdIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFifthIconExpanded) {
                                      setIsFifthIconCollapsing(true)
                                      setSelectedJJ23Variant(null)
                                      setTimeout(() => {
                                        setIsFifthIconExpanded(false)
                                        setIsFifthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isSixthIconExpanded) {
                                      setIsSixthIconCollapsing(true)
                                      setSelectedJJ24Variant(null)
                                      setTimeout(() => {
                                        setIsSixthIconExpanded(false)
                                        setIsSixthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (!newExpandedState) {
                                      // Collapsing - deselect variant and select JJ22B
                                      setSelectedJJ22Variant(null)
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage(item.img)
                                    } else {
                                      // Expanding - show all variants again (reset selection to show all)
                                      // Keep the selected variant if one was selected, but show all icons
                                      if (selectedJJ22Variant) {
                                        const variantImage = `/Frames/JJ22${selectedJJ22Variant.charAt(0).toUpperCase() + selectedJJ22Variant.slice(1)}.png`
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(variantImage)
                                      } else {
                                        // Clicking JJ22B while expanded - select JJ22B and deselect variant
                                        setSelectedJJ22Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(item.img)
                                      }
                                    }
                                  } else if (isFifthIcon) {
                                    const newExpandedState = !isFifthIconExpanded
                                    setIsFifthIconExpanded(newExpandedState)
                                    setIsFifthIconCollapsing(false)
                                    // Collapse other icons if they're expanded
                                    if (isFirstIconExpanded) {
                                      setIsCollapsing(true)
                                      setIsJJ04GSelected(false)
                                      setTimeout(() => {
                                        setIsFirstIconExpanded(false)
                                        setIsCollapsing(false)
                                      }, 400)
                                    }
                                    if (isThirdIconExpanded) {
                                      setIsThirdIconCollapsing(true)
                                      setIsJJ21SSelected(false)
                                      setTimeout(() => {
                                        setIsThirdIconExpanded(false)
                                        setIsThirdIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFourthIconExpanded) {
                                      setIsFourthIconCollapsing(true)
                                      setSelectedJJ22Variant(null)
                                      setTimeout(() => {
                                        setIsFourthIconExpanded(false)
                                        setIsFourthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isSixthIconExpanded) {
                                      setIsSixthIconCollapsing(true)
                                      setSelectedJJ24Variant(null)
                                      setTimeout(() => {
                                        setIsSixthIconExpanded(false)
                                        setIsSixthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (!newExpandedState) {
                                      // Collapsing - deselect variant and select JJ23Grey
                                      setSelectedJJ23Variant(null)
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage(item.img)
                                    } else {
                                      // Expanding - show all variants again (reset selection to show all)
                                      // Keep the selected variant if one was selected, but show all icons
                                      if (selectedJJ23Variant) {
                                        const variantImage = `/Frames/JJ23${selectedJJ23Variant.charAt(0).toUpperCase() + selectedJJ23Variant.slice(1)}.png`
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(variantImage)
                                      } else {
                                        // Clicking JJ23Grey while expanded - select JJ23Grey and deselect variant
                                        setSelectedJJ23Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(item.img)
                                      }
                                    }
                                  } else if (isSixthIcon) {
                                    const newExpandedState = !isSixthIconExpanded
                                    setIsSixthIconExpanded(newExpandedState)
                                    setIsSixthIconCollapsing(false)
                                    // Collapse other icons if they're expanded
                                    if (isFirstIconExpanded) {
                                      setIsCollapsing(true)
                                      setIsJJ04GSelected(false)
                                      setTimeout(() => {
                                        setIsFirstIconExpanded(false)
                                        setIsCollapsing(false)
                                      }, 400)
                                    }
                                    if (isThirdIconExpanded) {
                                      setIsThirdIconCollapsing(true)
                                      setIsJJ21SSelected(false)
                                      setTimeout(() => {
                                        setIsThirdIconExpanded(false)
                                        setIsThirdIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFourthIconExpanded) {
                                      setIsFourthIconCollapsing(true)
                                      setSelectedJJ22Variant(null)
                                      setTimeout(() => {
                                        setIsFourthIconExpanded(false)
                                        setIsFourthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (isFifthIconExpanded) {
                                      setIsFifthIconCollapsing(true)
                                      setSelectedJJ23Variant(null)
                                      setTimeout(() => {
                                        setIsFifthIconExpanded(false)
                                        setIsFifthIconCollapsing(false)
                                      }, 400)
                                    }
                                    if (!newExpandedState) {
                                      // Collapsing - deselect variant and select JJ24Grey
                                      setSelectedJJ24Variant(null)
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage(item.img)
                                    } else {
                                      // Expanding - show all variants again (reset selection to show all)
                                      // Keep the selected variant if one was selected, but show all icons
                                      if (selectedJJ24Variant) {
                                        const variantImage = `/Frames/JJ24${selectedJJ24Variant.charAt(0).toUpperCase() + selectedJJ24Variant.slice(1)}.png`
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(variantImage)
                                      } else {
                                        // Clicking JJ24Grey while expanded - select JJ24Grey and deselect variant
                                        setSelectedJJ24Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage(item.img)
                                      }
                                    }
                                  } else {
                                    // Animate collapse when clicking other icons
                                    if (isFirstIconExpanded) {
                                      setIsCollapsing(true)
                                      setIsJJ04GSelected(false)
                                      setTimeout(() => {
                                        setIsFirstIconExpanded(false)
                                        setIsCollapsing(false)
                                      }, 400) // Match animation duration
                                    } else {
                                      setIsFirstIconExpanded(false)
                                      setIsJJ04GSelected(false)
                                    }
                                    if (isThirdIconExpanded) {
                                      setIsThirdIconCollapsing(true)
                                      setIsJJ21SSelected(false)
                                      setTimeout(() => {
                                        setIsThirdIconExpanded(false)
                                        setIsThirdIconCollapsing(false)
                                      }, 400)
                                    } else {
                                      setIsThirdIconExpanded(false)
                                      setIsJJ21SSelected(false)
                                    }
                                    if (isFourthIconExpanded) {
                                      setIsFourthIconCollapsing(true)
                                      setSelectedJJ22Variant(null)
                                      setTimeout(() => {
                                        setIsFourthIconExpanded(false)
                                        setIsFourthIconCollapsing(false)
                                      }, 400)
                                    } else {
                                      setIsFourthIconExpanded(false)
                                      setSelectedJJ22Variant(null)
                                    }
                                    if (isFifthIconExpanded) {
                                      setIsFifthIconCollapsing(true)
                                      setSelectedJJ23Variant(null)
                                      setTimeout(() => {
                                        setIsFifthIconExpanded(false)
                                        setIsFifthIconCollapsing(false)
                                      }, 400)
                                    } else {
                                      setIsFifthIconExpanded(false)
                                      setSelectedJJ23Variant(null)
                                    }
                                    if (isSixthIconExpanded) {
                                      setIsSixthIconCollapsing(true)
                                      setSelectedJJ24Variant(null)
                                      setTimeout(() => {
                                        setIsSixthIconExpanded(false)
                                        setIsSixthIconCollapsing(false)
                                      }, 400)
                                    } else {
                                      setIsSixthIconExpanded(false)
                                      setSelectedJJ24Variant(null)
                                    }
                                    setSelectedMasonryItemId(item.id)
                                    setSelectedMasonryImage(item.img)
                                  }
                                }}
                                style={{ cursor: 'pointer', position: 'relative' }}
                          >
                            {(params.slug === 'newton' && (item.label === 'H1' || item.label === 'H2')) || 
                             ((params.slug === 'galileo' || params.slug === 'kepler') && (item.label === 'JJ04' || item.label === 'JJ20' || item.label === 'JJ21' || item.label === 'JJ22' || item.label === 'JJ23' || item.label === 'JJ24')) ||
                             (params.slug === 'apollo' && (item.label === 'JJ04' || item.label === 'JJ20' || item.label === 'JJ21' || item.label === 'JJ22' || item.label === 'JJ23')) ? (
                              <Image
                                src={item.img}
                                alt={item.label}
                                style={{ objectFit: (params.slug === 'apollo' || params.slug === 'galileo' || params.slug === 'kepler') ? 'cover' : 'contain' }}
                                fill
                              />
                            ) : (
                              <div className={styles.frameThumbnailLabel}>{item.label}</div>
                            )}
                          </div>
                              {isFirstIcon && isFirstIconExpanded && !isCollapsing && (
                                <div
                                  className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                    isJJ04GSelected ? styles.frameThumbnailActive : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Select JJ04G and update preview
                                    setIsJJ04GSelected(true)
                                    setIsJJ21SSelected(false)
                                    setSelectedJJ22Variant(null)
                                    setSelectedJJ23Variant(null)
                                    setSelectedJJ24Variant(null)
                                    setSelectedMasonryItemId(item.id)
                                    setSelectedMasonryImage('/Frames/JJ04G.png')
                                  }}
                                  onMouseEnter={(e) => {
                                    e.stopPropagation()
                                    // Update preview on hover
                                    setSelectedMasonryItemId(item.id)
                                    setSelectedMasonryImage('/Frames/JJ04G.png')
                                  }}
                                  onMouseLeave={(e) => {
                                    e.stopPropagation()
                                    // Revert to selected state or original image
                                    if (isJJ04GSelected) {
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage('/Frames/JJ04G.png')
                                    } else {
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage(item.img)
                                    }
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Image
                                    src="/Frames/JJ04G.png"
                                    alt="JJ04G"
                                    style={{ objectFit: 'cover' }}
                                    fill
                                  />
                      </div>
                              )}
                              {isFirstIcon && isCollapsing && (
                                <div
                                  className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                  style={{ pointerEvents: 'none' }}
                                >
                                  <Image
                                    src="/Frames/JJ04G.png"
                                    alt="JJ04G"
                                    style={{ objectFit: 'cover' }}
                                    fill
                                  />
                                </div>
                              )}
                              {isThirdIcon && isThirdIconExpanded && !isThirdIconCollapsing && (
                                <div
                                  className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                    isJJ21SSelected ? styles.frameThumbnailActive : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Select JJ21S and update preview
                                    setIsJJ21SSelected(true)
                                    setIsJJ04GSelected(false)
                                    setSelectedJJ22Variant(null)
                                    setSelectedJJ23Variant(null)
                                    setSelectedJJ24Variant(null)
                                    setSelectedMasonryItemId(item.id)
                                    setSelectedMasonryImage('/Frames/JJ21S.png')
                                  }}
                                  onMouseEnter={(e) => {
                                    e.stopPropagation()
                                    // Update preview on hover
                                    setSelectedMasonryItemId(item.id)
                                    setSelectedMasonryImage('/Frames/JJ21S.png')
                                  }}
                                  onMouseLeave={(e) => {
                                    e.stopPropagation()
                                    // Revert to selected state or original image
                                    if (isJJ21SSelected) {
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage('/Frames/JJ21S.png')
                                    } else {
                                      setSelectedMasonryItemId(item.id)
                                      setSelectedMasonryImage(item.img)
                                    }
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Image
                                    src="/Frames/JJ21S.png"
                                    alt="JJ21S"
                                    style={{ objectFit: 'cover' }}
                                    fill
                                  />
                                </div>
                              )}
                              {isThirdIcon && isThirdIconCollapsing && (
                                <div
                                  className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                  style={{ pointerEvents: 'none' }}
                                >
                                  <Image
                                    src="/Frames/JJ21S.png"
                                    alt="JJ21S"
                                    style={{ objectFit: 'cover' }}
                                    fill
                                  />
                                </div>
                              )}
                              {isFourthIcon && isFourthIconExpanded && !isFourthIconCollapsing && (
                                <>
                                  {(!selectedJJ22Variant || selectedJJ22Variant === 'blue') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ22Variant === 'blue' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-80px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ22Variant('blue')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ23Variant(null)
                                        setSelectedJJ24Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ22Blue.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ22Blue.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ22Variant === 'blue') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ22Blue.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ22Blue.png"
                                        alt="JJ22Blue"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                  {(!selectedJJ22Variant || selectedJJ22Variant === 'gold') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ22Variant === 'gold' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '0px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ22Variant('gold')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ23Variant(null)
                                        setSelectedJJ24Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ22Gold.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ22Gold.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ22Variant === 'gold') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ22Gold.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ22Gold.png"
                                        alt="JJ22Gold"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                  {(!selectedJJ22Variant || selectedJJ22Variant === 'grey') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ22Variant === 'grey' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '80px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ22Variant('grey')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ23Variant(null)
                                        setSelectedJJ24Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ22Grey.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ22Grey.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ22Variant === 'grey') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ22Grey.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ22Grey.png"
                                        alt="JJ22Grey"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              {isFourthIcon && isFourthIconCollapsing && (
                                <>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '-80px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ22Blue.png"
                                      alt="JJ22Blue"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '0px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ22Gold.png"
                                      alt="JJ22Gold"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '80px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ22Grey.png"
                                      alt="JJ22Grey"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                </>
                              )}
                              {isFifthIcon && isFifthIconExpanded && !isFifthIconCollapsing && (
                                <>
                                  {(!selectedJJ23Variant || selectedJJ23Variant === 'black') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ23Variant === 'black' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-80px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ23Variant('black')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ22Variant(null)
                                        setSelectedJJ24Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ23Black.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ23Black.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ23Variant === 'black') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ23Black.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ23Black.png"
                                        alt="JJ23Black"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                  {(!selectedJJ23Variant || selectedJJ23Variant === 'blue') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ23Variant === 'blue' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '0px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ23Variant('blue')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ22Variant(null)
                                        setSelectedJJ24Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ23Blue.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ23Blue.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ23Variant === 'blue') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ23Blue.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ23Blue.png"
                                        alt="JJ23Blue"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                  {(!selectedJJ23Variant || selectedJJ23Variant === 'red') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ23Variant === 'red' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '80px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ23Variant('red')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ22Variant(null)
                                        setSelectedJJ24Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ23Red.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ23Red.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ23Variant === 'red') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ23Red.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ23Red.png"
                                        alt="JJ23Red"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              {isFifthIcon && isFifthIconCollapsing && (
                                <>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '-80px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ23Black.png"
                                      alt="JJ23Black"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '0px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ23Blue.png"
                                      alt="JJ23Blue"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '80px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ23Red.png"
                                      alt="JJ23Red"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                </>
                              )}
                              {isSixthIcon && isSixthIconExpanded && !isSixthIconCollapsing && (
                                <>
                                  {(!selectedJJ24Variant || selectedJJ24Variant === 'black') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ24Variant === 'black' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-40px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ24Variant('black')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ22Variant(null)
                                        setSelectedJJ23Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ24Black.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ24Black.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ24Variant === 'black') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ24Black.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ24Black.png"
                                        alt="JJ24Black"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                  {(!selectedJJ24Variant || selectedJJ24Variant === 'blue') && (
                                    <div
                                      className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${
                                        selectedJJ24Variant === 'blue' ? styles.frameThumbnailActive : ''
                                      }`}
                                      style={{ 
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        left: '40px',
                                        zIndex: 10
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedJJ24Variant('blue')
                                        setIsJJ04GSelected(false)
                                        setIsJJ21SSelected(false)
                                        setSelectedJJ22Variant(null)
                                        setSelectedJJ23Variant(null)
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ24Blue.png')
                                      }}
                                      onMouseEnter={(e) => {
                                        e.stopPropagation()
                                        setSelectedMasonryItemId(item.id)
                                        setSelectedMasonryImage('/Frames/JJ24Blue.png')
                                      }}
                                      onMouseLeave={(e) => {
                                        e.stopPropagation()
                                        if (selectedJJ24Variant === 'blue') {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage('/Frames/JJ24Blue.png')
                                        } else {
                                          setSelectedMasonryItemId(item.id)
                                          setSelectedMasonryImage(item.img)
                                        }
                                      }}
                                    >
                                      <Image
                                        src="/Frames/JJ24Blue.png"
                                        alt="JJ24Blue"
                                        style={{ objectFit: 'cover' }}
                                        fill
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              {isSixthIcon && isSixthIconCollapsing && (
                                <>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '-40px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ24Black.png"
                                      alt="JJ24Black"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                  <div
                                    className={`${styles.frameThumbnail} ${styles.frameThumbnailExpanded} ${styles.frameThumbnailCollapsing}`}
                                    style={{ 
                                      position: 'absolute',
                                      top: 0,
                                      left: '40px',
                                      pointerEvents: 'none'
                                    }}
                                  >
                                    <Image
                                      src="/Frames/JJ24Blue.png"
                                      alt="JJ24Blue"
                                      style={{ objectFit: 'cover' }}
                                      fill
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {selectedMasonryItemId && (() => {
                        const selectedItem = masonryItems.find((item: { id: string }) => item.id === selectedMasonryItemId)
                        const isFirstIconSelected = selectedMasonryItemId === '1' && (params.slug === 'galileo' || params.slug === 'kepler')
                        const isThirdIconSelected = selectedMasonryItemId === '3' && (params.slug === 'galileo' || params.slug === 'kepler')
                        const isFourthIconSelected = selectedMasonryItemId === '4' && (params.slug === 'galileo' || params.slug === 'kepler')
                        const isFifthIconSelected = selectedMasonryItemId === '5' && (params.slug === 'galileo' || params.slug === 'kepler')
                        const isSixthIconSelected = selectedMasonryItemId === '6' && (params.slug === 'galileo' || params.slug === 'kepler')
                        let previewImage = selectedMasonryImage || selectedItem?.img || ''
                        let previewLabel = selectedItem?.label || ''
                        
                        if (isFirstIconSelected && isJJ04GSelected) {
                          previewImage = '/Frames/JJ04G.png'
                          previewLabel = 'JJ04G'
                        } else if (isThirdIconSelected && isJJ21SSelected) {
                          previewImage = '/Frames/JJ21S.png'
                          previewLabel = 'JJ21S'
                        } else if (isFourthIconSelected && selectedJJ22Variant) {
                          const variantCapitalized = selectedJJ22Variant.charAt(0).toUpperCase() + selectedJJ22Variant.slice(1)
                          previewImage = `/Frames/JJ22${variantCapitalized}.png`
                          previewLabel = `JJ22${variantCapitalized}`
                        } else if (isFifthIconSelected && selectedJJ23Variant) {
                          const variantCapitalized = selectedJJ23Variant.charAt(0).toUpperCase() + selectedJJ23Variant.slice(1)
                          previewImage = `/Frames/JJ23${variantCapitalized}.png`
                          previewLabel = `JJ23${variantCapitalized}`
                        } else if (isSixthIconSelected && selectedJJ24Variant) {
                          const variantCapitalized = selectedJJ24Variant.charAt(0).toUpperCase() + selectedJJ24Variant.slice(1)
                          previewImage = `/Frames/JJ24${variantCapitalized}.png`
                          previewLabel = `JJ24${variantCapitalized}`
                        }
                        
                        return selectedItem ? (
                          <div key={selectedMasonryItemId} className={styles.framePreview}>
                            <div className={styles.framePreviewImage}>
                              <Image
                                src={previewImage}
                                alt={previewLabel}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                              <div className={styles.framePreviewNoise}>
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
                        ) : null
                      })()}
                    </div>
                  </div>

                  {(params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') && (
                    <div className={styles.magnificationSection}>
                      <div className={styles.magnificationHeader}>
                        <h2 className={styles.magnificationTitle}>Magnification</h2>
                      </div>
                      <div className={`${styles.magnificationIcons} ${params.slug === 'apollo' ? styles.magnificationIconsApollo : ''}`}>
                        {/* Galileo and Newton: 2.5x, 3.0x, 3.5x */}
                        {(params.slug === 'galileo' || params.slug === 'newton') && (
                          <>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>2.5x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('2.5x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '2.5x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                            <div className={styles.magnificationDivider}></div>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>3.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('3.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '3.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                            <div className={styles.magnificationDivider}></div>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>3.5x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('3.5x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '3.5x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                          </>
                        )}
                        {/* Apollo: 3.0x, 4.0x, 5.0x, 6.0x */}
                        {params.slug === 'apollo' && (
                          <>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>3.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('3.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '3.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                            <div className={styles.magnificationDivider}></div>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>4.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('4.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '4.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                            <div className={styles.magnificationDivider}></div>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>5.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('5.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '5.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                            <div className={styles.magnificationDivider}></div>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>6.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('6.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '6.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                          </>
                        )}
                        {/* Kepler: 4.0x, 5.0x, 6.0x */}
                        {params.slug === 'kepler' && (
                          <>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>4.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('4.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '4.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                            <div className={styles.magnificationDivider}></div>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>5.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('5.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '5.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                            <div className={styles.magnificationDivider}></div>
                            <div className={styles.magnificationItem}>
                              <span className={styles.magnificationLabel}>6.0x</span>
                              <div 
                                className={styles.magnificationIconWrapper}
                                onClick={() => setSelectedMagnification('6.0x')}
                              >
                                <PixelCard 
                                  variant="default" 
                                  className={`${styles.magnificationIconCard} ${selectedMagnification === '6.0x' ? styles.magnificationIconCardActive : ''}`}
                                  gap={undefined} 
                                  speed={undefined} 
                                  colors={undefined} 
                                  noFocus={undefined}
                                >
                                  <div className={styles.magnificationIcon}></div>
                                </PixelCard>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {params.slug !== 'galileo' && params.slug !== 'newton' && params.slug !== 'apollo' && params.slug !== 'kepler' && (
                  <div className={styles.orderDetailsInline}>
                    <div className={styles.orderDetailsHeader}>
                      <h2 className={styles.orderDetailsTitle}>Order Details</h2>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <div className={styles.orderDetailsGridInline}>
                      <div className={styles.orderDetailItem}>
                        <div className={styles.orderDetailIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M1 4v6h6M23 20v-6h-6M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" />
                          </svg>
                        </div>
                        <div className={styles.orderDetailContent}>
                          <h3 className={styles.orderDetailItemTitle}>30-Day Guarantee</h3>
                          <p className={styles.orderDetailItemText}>Return your {product.shortName} within 30 days for a full refund.</p>
                        </div>
                      </div>
                      <div className={styles.orderDetailItem}>
                        <div className={styles.orderDetailIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <div className={styles.orderDetailContent}>
                          <h3 className={styles.orderDetailItemTitle}>Shipping Timelines</h3>
                          <p className={styles.orderDetailItemText}>New orders ship within 3-5 business days.</p>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
                  </div>

                  <div className={styles.purchaseSection}>
                    <div className={styles.priceRow}>
                      <div className={styles.priceLabelContainer}>
                        <span className={styles.priceLabel}>Total</span>
                        {cartCount > 0 && (
                          <span className={styles.cartCount}>({cartCount})</span>
                        )}
                      </div>
                      <span className={styles.price}>
                        ${(parseInt(product.price.replace('$', '')) * quantity).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const cart = getCart()
                        const existingItem = cart.find(item => item.productSlug === params.slug)
                        const product = productData[params.slug]
                        
                        if (product) {
                          const imageToUse = selectedMasonryImage || mainImage
                          const selectedItem = selectedMasonryItemId ? masonryItems.find((item: { id: string }) => item.id === selectedMasonryItemId) : null
                          const frameImageToSave = selectedMasonryImage || selectedItem?.img || null
                          
                          if (existingItem) {
                            const itemIndex = cart.findIndex(i => i.productSlug === params.slug)
                            if (itemIndex >= 0) {
                              cart[itemIndex].selectedFrameId = selectedMasonryItemId || null
                              cart[itemIndex].selectedFrameName = selectedItem?.name || selectedItem?.label || null
                              cart[itemIndex].selectedFrameImage = frameImageToSave
                              if (params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') {
                                const magToUse = selectedMagnification || getDefaultMagnification(params.slug)
                                cart[itemIndex].selectedMagnification = magToUse
                                cart[itemIndex].stripeProductId = getStripeProductId(params.slug, magToUse)
                              }
                              if (typeof window !== 'undefined') {
                                try {
                                  localStorage.setItem('heliosx_cart', JSON.stringify(cart))
                                  window.dispatchEvent(new CustomEvent('cartUpdated'))
                                } catch (error) {
                                  console.error('Error saving cart:', error)
                                }
                              }
                            }
                          } else {
                            addToCart({
                              productSlug: params.slug,
                              name: product.name,
                              shortName: product.shortName,
                              price: parseInt(product.price.replace('$', '')),
                              quantity: quantity,
                              image: imageToUse,
                              selectedFrameId: selectedMasonryItemId || null,
                              selectedFrameName: selectedItem?.name || selectedItem?.label || null,
                              selectedFrameImage: frameImageToSave,
                              selectedMagnification: (params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') ? selectedMagnification || null : null,
                              stripeProductId: (params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') ? getStripeProductId(params.slug, selectedMagnification) : null,
                            })
                          }
                        }
                        router.push('/cart')
                      }}
                      className={styles.buyButton}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
          </section>

          <section id="product-specs" className={styles.productSpecs}>
            <div className={styles.container}>
              <div className={styles.specsHeader}>
                <div className={styles.specsHeaderTitle}>
                  Product Specs
                </div>
              </div>
            </div>

            <div className={styles.specsDetailSection}>
              <div className={styles.container}>
                {(params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') && (
                  <div className={styles.specsImageRow}>
                    <div className={styles.specsImagePlaceholder}>
                      <Image
                        src={params.slug === 'apollo' ? "/Apollo/Apollofinal.png" : params.slug === 'newton' ? "/Newton/H2.3.png" : params.slug === 'kepler' ? "/Keppler/Kfinal.jpg" : "/Galileo/Locker room.png"}
                        alt={params.slug === 'apollo' ? "Apollo" : params.slug === 'newton' ? "H2.3" : params.slug === 'kepler' ? "Kfinal" : "Locker room"}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.specsImageNoise}>
                        <Noise 
                          patternSize={250}
                          patternScaleX={1}
                          patternScaleY={1}
                          patternRefreshInterval={2}
                          patternAlpha={8}
                        />
                      </div>
                    </div>
                    <div className={styles.specsImagePlaceholder}>
                      <Image
                        src={params.slug === 'apollo' ? "/Apollo/Blondcloseup.png" : params.slug === 'newton' ? "/Newton/NewtonAsian3.png" : params.slug === 'kepler' ? "/Keppler/Keplerextra.png" : "/Galileo/Homepage1.png"}
                        alt={params.slug === 'apollo' ? "Blond closeup" : params.slug === 'newton' ? "Newton Asian 3" : params.slug === 'kepler' ? "Kepler extra" : "Homepage"}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.specsImageNoise}>
                        <Noise 
                          patternSize={250}
                          patternScaleX={1}
                          patternScaleY={1}
                          patternRefreshInterval={2}
                          patternAlpha={8}
                        />
                      </div>
                    </div>
                    <div className={styles.specsImagePlaceholder}>
                      <Image
                        src={params.slug === 'apollo' ? "/Apollo/Apollowomanscrubbing.png" : params.slug === 'newton' ? "/Newton/H2Product.png" : params.slug === 'kepler' ? "/Keppler/KepplerMain2.png" : "/Galileo/girlinmirror1.png"}
                        alt={params.slug === 'apollo' ? "Apollo woman scrubbing" : params.slug === 'newton' ? "H2 Product" : params.slug === 'kepler' ? "Keppler Main 2" : "Girl in mirror"}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.specsImageNoise}>
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
                )}
                <div className={styles.specsDetailGrid}>
                  {(params.slug === 'galileo' || params.slug === 'newton' || params.slug === 'apollo' || params.slug === 'kepler') ? (
                    <>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>
                          {params.slug === 'apollo' ? productSpecs.ergonomicDesign?.title : 
                           params.slug === 'kepler' ? productSpecs.precisionDesign?.title : 
                           productSpecs.lightWeight?.title}
                        </h3>
                        <ul className={styles.specsDetailList}>
                          {(params.slug === 'apollo' ? productSpecs.ergonomicDesign?.specs : 
                            params.slug === 'kepler' ? productSpecs.precisionDesign?.specs :
                            productSpecs.lightWeight?.specs)?.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.excellentOptics?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.excellentOptics?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.opticalLens?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.opticalLens?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.lightSource?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.lightSource?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.generalSpecs?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.generalSpecs?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.opticsBuild?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.opticsBuild?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      {(params.slug === 'galileo' || params.slug === 'newton') && (
                        <>
                      <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification25?.title}</h3>
                        <ul className={styles.specsDetailList}>
                              {productSpecs.magnification25?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification30?.title}</h3>
                        <ul className={styles.specsDetailList}>
                              {productSpecs.magnification30?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification35?.title}</h3>
                        <ul className={styles.specsDetailList}>
                              {productSpecs.magnification35?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                        </>
                      )}
                      {params.slug === 'apollo' && (
                        <>
                          <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification30?.title}</h3>
                            <ul className={styles.specsDetailList}>
                              {productSpecs.magnification30?.specs.map((spec, index) => (
                                <li key={index} className={styles.specsDetailItem}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification40?.title}</h3>
                            <ul className={styles.specsDetailList}>
                              {productSpecs.magnification40?.specs.map((spec, index) => (
                                <li key={index} className={styles.specsDetailItem}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification50?.title}</h3>
                            <ul className={styles.specsDetailList}>
                              {productSpecs.magnification50?.specs.map((spec, index) => (
                                <li key={index} className={styles.specsDetailItem}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification60?.title}</h3>
                            <ul className={styles.specsDetailList}>
                              {productSpecs.magnification60?.specs.map((spec, index) => (
                                <li key={index} className={styles.specsDetailItem}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                      {params.slug === 'kepler' && (
                        <>
                          <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification40?.title}</h3>
                            <ul className={styles.specsDetailList}>
                              {productSpecs.magnification40?.specs.map((spec, index) => (
                                <li key={index} className={styles.specsDetailItem}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification50?.title}</h3>
                            <ul className={styles.specsDetailList}>
                              {productSpecs.magnification50?.specs.map((spec, index) => (
                                <li key={index} className={styles.specsDetailItem}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                          <div className={styles.specsDetailColumn}>
                            <h3 className={styles.specsDetailTitle}>{productSpecs.magnification60?.title}</h3>
                            <ul className={styles.specsDetailList}>
                              {productSpecs.magnification60?.specs.map((spec, index) => (
                                <li key={index} className={styles.specsDetailItem}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.display?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.display?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.performance?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.performance?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.specsDetailColumn}>
                        <h3 className={styles.specsDetailTitle}>{productSpecs.connectivity?.title}</h3>
                        <ul className={styles.specsDetailList}>
                          {productSpecs.connectivity?.specs.map((spec, index) => (
                            <li key={index} className={styles.specsDetailItem}>{spec}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.bottomSection}>
            <div className={styles.bottomImageWrapper}>
              <div className={styles.bottomImage}>
                <img 
                  src="/Walkinghallway2.png" 
                  alt="Walking hallway" 
                  className={styles.bottomBackgroundImage}
                />
                <div className={styles.bottomImageNoise}>
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
            
            <div className={styles.bottomContent}>
              <div className={styles.bottomBrand}>
                <div className={styles.bottomBrandLogo}>
                  <Image
                    src="/LogoMinimal.png"
                    alt="HeliosX"
                    width={480}
                    height={480}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div className={styles.bottomFooter}>
                <div className={styles.bottomFooterGrid}>
                  <div className={styles.bottomFooterColumn}>
                    <h3 className={styles.bottomFooterTitle}>NAVIGATION</h3>
                    <ul className={styles.bottomFooterList}>
                      <li><Link href="/" className={styles.bottomFooterLink}>Home</Link></li>
                      <li><Link href="/product" className={styles.bottomFooterLink}>Product</Link></li>
                      <li><Link href="/guides" className={styles.bottomFooterLink}>Guides</Link></li>
                      <li><Link href="/faq" className={styles.bottomFooterLink}>FAQ</Link></li>
                    </ul>
                  </div>

                  <div className={styles.bottomFooterColumn}>
                    <h3 className={styles.bottomFooterTitle}>WHO WE ARE</h3>
                    <p className={styles.bottomFooterText}>A more caring medical equipment company</p>
                  </div>

                  <div className={styles.bottomFooterColumn}>
                    <h3 className={styles.bottomFooterTitle}>SOCIALS</h3>
                    <div className={styles.bottomSocialIcons}>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.bottomSocialIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                        </svg>
                      </a>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.bottomSocialIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="22.54 6.42 22.54 17.58 12 22.5 1.46 17.58 1.46 6.42 12 1.5 22.54 6.42"/>
                          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                        </svg>
                      </a>
                      <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.bottomSocialIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.bottomSocialIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className={styles.bottomFooterColumn}>
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
                </div>
              </div>

              <div className={styles.bottomOrderButton}>
                <button className={styles.bottomOrderNow}>ORDER NOW</button>
                <p className={styles.shippingText}>Ships within 7-10 days</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
