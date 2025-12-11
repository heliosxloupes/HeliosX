'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { getCart } from '@/lib/cart'

export default function CartButton() {
  const [count, setCount] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = getCart()
        const total = cart.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0
        )
        setCount(total)
      } catch (err) {
        console.error('Failed to read cart', err)
        setCount(0)
      }
    }

    // initial read
    updateCount()

    // re-run when localStorage changes (if your cart uses it)
    const storageHandler = () => updateCount()

    // Listen for cart updates from cart lib
    const customHandler = () => updateCount()

    window.addEventListener('storage', storageHandler)
    window.addEventListener('cartUpdated', customHandler as EventListener)

    return () => {
      window.removeEventListener('storage', storageHandler)
      window.removeEventListener('cartUpdated', customHandler as EventListener)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => router.push('/cart')}
      className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.7rem] font-medium text-neutral-100 backdrop-blur-md transition hover:bg-white/15"
    >
      {/* Shopping bag icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-200"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span>Cart</span>
      {/* Cart count badge - top right corner */}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FF9D00] text-[0.65rem] font-bold text-black shadow-[0_0_8px_rgba(255,157,0,0.5)]">
          {count}
        </span>
      )}
    </button>
  )
}

