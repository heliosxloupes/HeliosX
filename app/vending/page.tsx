'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import Header from '@/components/Header'
import Noise from '@/components/Noise'
import { addToCart } from '@/lib/cart'

/* --- motion variants --- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

export default function VendingPage() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  const productName = 'Vending Product'
  const shortName = 'Vending'
  const description =
    'Premium product available through our vending system. High quality and convenient access.'
  const highlights = [
    'Convenient vending access.',
    'Premium quality product.',
    'Quick and easy checkout.',
    'Same day availability.',
  ]
  const basePrice = 1500
  const subtotal = basePrice * quantity
  const productImage = '/vending.jpeg'

  const handleAddToCart = () => {
    addToCart({
      productSlug: 'vending',
      name: productName,
      shortName: shortName,
      price: basePrice,
      quantity,
      image: productImage,
      selectedMagnification: null,
      selectedFrameId: null,
      selectedFrameName: null,
      selectedFrameImage: null,
      stripeProductId: 'prod_TcVAhS4iGzKLpP',
    })
    router.push('/cart')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-16 text-neutral-100">
        {/* HERO + CONFIG */}
        <section className="w-full pt-4 pb-20 lg:pb-28">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 lg:flex-row lg:items-start lg:px-10 xl:px-16"
          >
            {/* LEFT: hero image */}
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="relative w-full max-w-[900px] overflow-hidden rounded-[32px] border border-white/10 bg-black/80 shadow-[0_30px_120px_rgba(0,0,0,0.85)]"
              >
                <div className="relative aspect-[4/5] w-full md:aspect-[3/4] lg:aspect-[16/9]">
                  <Image
                    src={productImage}
                    alt={`${shortName} product`}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* slight grain overlay */}
                  <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay">
                    <Noise
                      patternSize={250}
                      patternScaleX={1}
                      patternScaleY={1}
                      patternRefreshInterval={2}
                      patternAlpha={6}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: config column */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
              className="flex w-full max-w-md flex-col gap-6 lg:max-w-sm xl:max-w-md"
            >
              {/* Title + description */}
              <div>
                <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-neutral-500">
                  HeliosX · {shortName}
                </p>
                <h1 className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
                  {productName}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  {description}
                </p>
              </div>

              {/* Highlights */}
              <motion.div
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-neutral-900/70 p-4 text-xs text-neutral-200 shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Highlights
                </p>
                <div className="grid grid-cols-2 gap-3 text-[0.75rem]">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                        <span className="h-2 w-2 rounded-full bg-black" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quantity selector */}
              <motion.div
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-neutral-900/80 p-4 text-xs text-neutral-200 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-neutral-200 transition hover:border-emerald-400/50 hover:bg-emerald-950/30"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-neutral-200 transition hover:border-emerald-400/50 hover:bg-emerald-950/30"
                  >
                    +
                  </button>
                </div>
              </motion.div>

              {/* Subtotal + add to cart */}
              <motion.div
                variants={cardVariants}
                className="rounded-3xl border border-white/10 bg-neutral-900/95 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.8)]"
              >
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal}.00</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-4 w-full rounded-full bg-white py-2.5 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,0.6)] transition hover:bg-neutral-100"
                >
                  Add to cart
                </button>
                <p className="mt-2 text-[0.65rem] leading-relaxed text-neutral-500">
                  No hidden service contracts, mandatory bundles, or surprise
                  fees—just the product you need.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* FOOTER BANNER */}
        <section className="relative overflow-hidden border-t border-white/10">
          <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-4 py-16 lg:px-10 xl:px-16">
            <div className="relative z-10 max-w-xl space-y-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Built for real operators
              </p>
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Designed in the OR, priced for reality.
              </h3>
              <p className="text-sm text-neutral-300">
                HeliosX exists because surgeons shouldn&apos;t have to choose
                between compromised tools and two months of rent. The work is
                demanding enough—the access should be too.
              </p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="mt-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-neutral-100 backdrop-blur-md transition hover:border-white hover:bg-white hover:text-black"
              >
                Back to top
              </button>
            </div>

            <div className="pointer-events-none absolute inset-0">
              <Image
                src="/Walkinghallway2.png"
                alt="Surgeon hallway banner"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/90" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

