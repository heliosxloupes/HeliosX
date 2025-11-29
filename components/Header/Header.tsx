'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { getCartItemCount } from '@/lib/cart'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const isProductPage = pathname === '/product'
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Get initial cart count
    setCartCount(getCartItemCount())

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartCount(getCartItemCount())
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  return (
    <header className={`${styles.header} ${isProductPage ? styles.headerProductPage : ''}`}>
      <div className={styles.wrapper}>
        <NavigationMenu.Root className={styles.nav}>
          <NavigationMenu.List className={styles.navList}>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/product" className={styles.navLink}>
                  Product
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link href="/faq" className={styles.navLink}>
                  About
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <Link href="/cart" className={styles.ctaButton}>
          Cart
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  )
}


