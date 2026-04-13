'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

import Header from '@/components/Header'
import { getCart } from '@/lib/cart'
import type { CartItem } from '@/lib/cart'
import Noise from '@/components/Noise'

const PRESCRIPTION_ESTIMATE = 200 // USD – for cart display
const WARRANTY_ESTIMATE = 99 // USD – for cart display

// If your cart library uses a different key, change this to match
const CART_STORAGE_KEY = 'heliosx_cart'

// Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [includePrescription, setIncludePrescription] = useState(false)
  const [includeWarranty, setIncludeWarranty] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const cart = getCart() as CartItem[] | undefined
      setItems(cart ?? [])
    } catch (err) {
      console.error('Error reading cart', err)
      setItems([])
    }
  }, [])

  const saveCart = (updated: CartItem[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated))
      // Dispatch event so other components (like CartButton) can update
      window.dispatchEvent(new CustomEvent('cartUpdated'))
    } catch (err) {
      console.error('Error saving cart', err)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index)
      saveCart(next)
      return next
    })
  }

  const baseSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const addOnTotal =
    (includePrescription ? PRESCRIPTION_ESTIMATE : 0) +
    (includeWarranty ? WARRANTY_ESTIMATE : 0)

  const subtotal = baseSubtotal + addOnTotal

  const handleCheckout = () => {
    if (!items.length) return

    // Persist add-on choices so /checkout can pick them up
    if (typeof window !== 'undefined') {
      const payload = {
        prescription: includePrescription,
        warranty: includeWarranty,
      }
      sessionStorage.setItem('heliosx_addons', JSON.stringify(payload))
    }

    router.push('/checkout')
  }

  const handleEditConfig = () => {
    router.push('/product/galileo')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-16 text-neutral-100">
        <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-8 pt-8 lg:grid-cols-[3fr,2.2fr] lg:items-stretch lg:gap-10 lg:px-8 lg:pb-8 lg:pt-6">
          {/* subtle background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
          </div>

          {/* LEFT – hero image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative h-[320px] overflow-hidden rounded-[32px] bg-neutral-900 shadow-[0_0_60px_rgba(0,0,0,0.75)] lg:h-auto lg:min-h-[500px]"
          >
            <Image
              src="/cartgirl.png"
              alt="Cart hero"
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
              style={{ mixBlendMode: 'overlay' }}
            >
              <Noise patternAlpha={4} />
            </div>
            <div className="absolute bottom-6 left-6 space-y-1 text-sm text-neutral-100">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-300/80">
                Cart
              </p>
              <h1 className="bg-gradient-to-r from-white via-sky-200 to-emerald-200 bg-clip-text text-2xl font-semibold text-transparent lg:text-3xl">
                Review your configuration
              </h1>
              <p className="max-w-md text-xs text-neutral-300/80 lg:text-sm">
                Confirm your loupe system and any add-ons before proceeding to
                secure Stripe checkout.
              </p>
            </div>
          </motion.div>

          {/* RIGHT – cart summary + add-ons */}
          <motion.aside
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
            className="flex flex-col gap-6"
          >
            {/* Main cart content */}
            <motion.div
              variants={cardVariants}
              className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Order summary
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={handleEditConfig}
                    className="text-[0.7rem] uppercase tracking-[0.18em] text-neutral-300 underline-offset-4 hover:underline"
                  >
                    Edit selection
                  </button>
                )}
              </div>

              {!items.length ? (
                <p className="text-sm text-neutral-400">
                  Your cart is empty. Select a system from the product page to
                  continue.
                </p>
              ) : (
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-2 space-y-5 overflow-y-auto pr-2 lg:max-h-[360px]"
                >
                  {items.map((item, idx) => (
                    <motion.li
                      key={`${item.productSlug}-${idx}`}
                      variants={cardVariants}
                      whileHover={{ y: -3 }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 20,
                      }}
                      className="flex gap-4 rounded-2xl bg-black/45 p-4 ring-1 ring-white/5"
                    >
                      <div className="relative h-20 w-28 overflow-hidden rounded-2xl bg-neutral-800">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between text-xs lg:text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-neutral-400">
                              {item.shortName ?? item.productSlug}
                            </p>
                            <p className="mt-1 text-sm font-medium text-neutral-50">
                              {item.name}
                            </p>
                            <div className="mt-2 space-y-1 text-[0.78rem] text-neutral-200">
                              <p className="flex gap-2">
                                <span className="text-neutral-400">
                                  Magnification:
                                </span>
                                <span>
                                  {item.selectedMagnification ?? 'Not selected'}
                                </span>
                              </p>
                              <p className="flex gap-2">
                                <span className="text-neutral-400">Frame:</span>
                                <span>
                                  {item.selectedFrameName ?? 'Not selected'}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-[0.65rem] text-neutral-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs text-neutral-300">
                          <span>Qty: {item.quantity}</span>
                          <span className="text-sm font-semibold text-neutral-50">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>

            {/* Add-ons */}
            <motion.div
              variants={cardVariants}
              className="rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Optional add-ons
              </h3>

              <div className="space-y-4 text-sm text-neutral-200">
                {/* Prescription lenses */}
                <motion.button
                  type="button"
                  onClick={() =>
                    setIncludePrescription((prev) => !prev)
                  }
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className={`flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition sm:items-center sm:gap-6 sm:px-5 sm:py-4 ${
                    includePrescription
                      ? 'border-white/70 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-3 text-white shadow-[0_0_16px_rgba(255,255,255,0.05)] sm:h-14 sm:w-14">
                      <Image
                        src="/prescription.png"
                        alt="Prescription icon"
                        width={32}
                        height={32}
                        className="h-6 w-6 object-contain brightness-0 invert drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] sm:h-7 sm:w-7"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        Prescription lenses
                      </p>
                      <p className="text-sm text-neutral-100">
                        Integrate your spectacle Rx directly into the system.
                      </p>
                      <p className="text-[0.7rem] text-neutral-400">
                        You&apos;ll upload your prescription and PD after
                        checkout.
                      </p>
                    </div>
                  </div>
                  <span className="ml-2 whitespace-nowrap text-sm font-semibold text-neutral-50 sm:ml-4">
                    +${PRESCRIPTION_ESTIMATE}
                  </span>
                </motion.button>

                {/* Extended warranty */}
                <motion.button
                  type="button"
                  onClick={() => setIncludeWarranty((prev) => !prev)}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className={`flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition sm:items-center sm:gap-6 sm:px-5 sm:py-4 ${
                    includeWarranty
                      ? 'border-white/70 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-3 text-white shadow-[0_0_16px_rgba(255,255,255,0.05)] sm:h-14 sm:w-14">
                      <Image
                        src="/warranty.png"
                        alt="Warranty icon"
                        width={32}
                        height={32}
                        className="h-6 w-6 object-contain brightness-0 invert drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] sm:h-7 sm:w-7"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        Extended warranty
                      </p>
                      <p className="text-sm text-neutral-100">
                        Extra coverage beyond the standard manufacturing
                        warranty.
                      </p>
                      <p className="text-[0.7rem] text-neutral-400">
                        Covers qualifying defects and select repairs within the
                        extended term.
                      </p>
                    </div>
                  </div>
                  <span className="ml-2 whitespace-nowrap text-sm font-semibold text-neutral-50 sm:ml-4">
                    +${WARRANTY_ESTIMATE}
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Totals + CTA */}
            <motion.div
              variants={cardVariants}
              className="rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-300">
                <span>Items subtotal</span>
                <span>${baseSubtotal.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm text-neutral-300">
                <span>Add-ons</span>
                <span>${addOnTotal.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-neutral-50">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button
                disabled={!items.length}
                onClick={handleCheckout}
                className="flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_40px_rgba(255,255,255,0.25)] transition hover:translate-y-[1px] hover:bg-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:text-neutral-200 disabled:shadow-none"
              >
                Proceed to payment
              </button>
              <p className="mt-3 text-[0.65rem] text-neutral-500">
                Test mode only – payments are processed in Stripe&apos;s sandbox
                environment.
              </p>
            </motion.div>
          </motion.aside>
        </section>
      </main>
    </>
  )
}
