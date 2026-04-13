'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import Header from '@/components/Header'
import Noise from '@/components/Noise'
import { addToCart } from '@/lib/cart'

export type FrameId =
  | 'JJ04B'
  | 'JJ20B'
  | 'JJ21G'
  | 'JJ22B'
  | 'JJ23Grey'
  | 'JJ24Grey'
  | 'H1Black'
  | 'H1Blue'
  | 'H1Red'
  | 'H1Silver'
  | 'H2'

export type FrameConfig = {
  id: FrameId
  label: string
  baseImage: string
  colors: {
    name: string
    value: string
    image: string
  }[]
}

export const defaultFrameConfigs: FrameConfig[] = [
  {
    id: 'JJ04B',
    label: 'JJ04',
    baseImage: '/Frames/JJ04B.png',
    colors: [
      { name: 'Black', value: 'black', image: '/Frames/JJ04B.png' },
      { name: 'Grey', value: 'grey', image: '/Frames/JJ04G.png' },
    ],
  },
  {
    id: 'JJ20B',
    label: 'JJ20',
    baseImage: '/Frames/JJ20B.png',
    colors: [{ name: 'Black', value: 'black', image: '/Frames/JJ20B.png' }],
  },
  {
    id: 'JJ21G',
    label: 'JJ21',
    baseImage: '/Frames/JJ21G.png',
    colors: [
      { name: 'Gold', value: 'gold', image: '/Frames/JJ21G.png' },
      { name: 'Steel', value: 'steel', image: '/Frames/JJ21S.png' },
    ],
  },
  {
    id: 'JJ22B',
    label: 'JJ22',
    baseImage: '/Frames/JJ22B.png',
    colors: [
      { name: 'Blue', value: 'blue', image: '/Frames/JJ22Blue.png' },
      { name: 'Gold', value: 'gold', image: '/Frames/JJ22Gold.png' },
      { name: 'Grey', value: 'grey', image: '/Frames/JJ22Grey.png' },
    ],
  },
  {
    id: 'JJ23Grey',
    label: 'JJ23',
    baseImage: '/Frames/JJ23Grey.png',
    colors: [
      { name: 'Grey', value: 'grey', image: '/Frames/JJ23Grey.png' },
      { name: 'Black', value: 'black', image: '/Frames/JJ23Black.png' },
      { name: 'Blue', value: 'blue', image: '/Frames/JJ23Blue.png' },
      { name: 'Red', value: 'red', image: '/Frames/JJ23Red.png' },
    ],
  },
  {
    id: 'JJ24Grey',
    label: 'JJ24',
    baseImage: '/Frames/JJ24Grey.png',
    colors: [
      { name: 'Grey', value: 'grey', image: '/Frames/JJ24Grey.png' },
      { name: 'Black', value: 'black', image: '/Frames/JJ24Black.png' },
      { name: 'Blue', value: 'blue', image: '/Frames/JJ24Blue.png' },
    ],
  },
]

export const newtonFrameConfigs: FrameConfig[] = [
  {
    id: 'H1Black',
    label: 'H1',
    baseImage: '/Frames/H1Black.png',
    colors: [{ name: 'Black', value: 'black', image: '/Frames/H1Black.png' }],
  },
  {
    id: 'H1Blue',
    label: 'H1',
    baseImage: '/Frames/H1Blue.png',
    colors: [{ name: 'Blue', value: 'blue', image: '/Frames/H1Blue.png' }],
  },
  {
    id: 'H1Red',
    label: 'H1',
    baseImage: '/Frames/H1Red.png',
    colors: [{ name: 'Red', value: 'red', image: '/Frames/H1Red.png' }],
  },
  {
    id: 'H1Silver',
    label: 'H1',
    baseImage: '/Frames/H1Silver.png',
    colors: [
      { name: 'Silver', value: 'silver', image: '/Frames/H1Silver.png' },
    ],
  },
  {
    id: 'H2',
    label: 'H2',
    baseImage: '/Frames/H2.png',
    colors: [
      { name: 'Default', value: 'default', image: '/Frames/H2.png' },
    ],
  },
]

export type ProductPageConfig = {
  slug: string
  name: string
  shortName: string
  description: string
  highlights: string[]
  heroImages: string[]
  magnifications: string[]
  basePrice: number
  specTitle: string
  specDescription: string
  specColumns: { title: string; items: string[] }[]
  specImages: { src: string; alt: string }[]
}

/* --- motion variants (same flavor as homepage) --- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

export default function ProductPageTemplate({ config }: { config: ProductPageConfig }) {
  const router = useRouter()
  const techRef = useRef<HTMLDivElement | null>(null)

  const [activeHeroIndex, setActiveHeroIndex] = useState(0)
  const [selectedMag, setSelectedMag] = useState<string>(config.magnifications[0] ?? '')

  // Use Newton-specific frames for Newton, default frames for others
  const frameConfigs =
    config.slug === 'newton' ? newtonFrameConfigs : defaultFrameConfigs
  const defaultFrameId = config.slug === 'newton' ? 'H1Black' : 'JJ23Grey'
  const defaultColor = config.slug === 'newton' ? 'black' : 'grey'

  const [selectedFrameId, setSelectedFrameId] = useState<FrameId>(
    defaultFrameId as FrameId
  )
  const [selectedFrameColor, setSelectedFrameColor] = useState<string>(
    defaultColor
  )
  const [quantity, setQuantity] = useState(1)

  const basePrice = config.basePrice
  const subtotal = basePrice * quantity

  const currentFrameConfig =
    frameConfigs.find((frame) => frame.id === selectedFrameId) ?? frameConfigs[0]
  const currentColorConfig =
    currentFrameConfig.colors.find(
      (color) => color.value === selectedFrameColor
    ) ?? currentFrameConfig.colors[0]

  const handleAddToCart = () => {
    addToCart({
      productSlug: config.slug,
      name: `${config.shortName} Surgical Loupes`,
      shortName: config.shortName,
      price: basePrice,
      quantity,
      image: config.heroImages[0],
      selectedMagnification: selectedMag,
      selectedFrameId,
      selectedFrameName: `${currentFrameConfig.label} ${currentColorConfig.name}`,
      selectedFrameImage: currentColorConfig.image,
    })
    router.push('/cart')
  }

  const scrollToTech = () => {
    if (!techRef.current) return
    techRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-16 text-neutral-100">
        {/* HERO + CONFIG */}
        <section className="w-full pt-4 pb-16 lg:pb-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 lg:flex-row lg:items-start lg:gap-10 lg:px-10 xl:px-16"
          >
            {/* LEFT: hero image + thumbs */}
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                className="relative w-full max-w-[900px] overflow-hidden rounded-[28px] border border-white/8 bg-black/80 shadow-[0_24px_100px_rgba(0,0,0,0.8)]"
              >
                <div className="relative aspect-[4/5] w-full md:aspect-[3/4] lg:aspect-[16/9]">
                  <Image
                    src={config.heroImages[activeHeroIndex]}
                    alt={`${config.shortName} surgical loupes`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                  />
                  {/* grain overlay */}
                  <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay">
                    <Noise
                      patternSize={250}
                      patternScaleX={1}
                      patternScaleY={1}
                      patternRefreshInterval={2}
                      patternAlpha={5}
                    />
                  </div>
                </div>

                <button
                  onClick={scrollToTech}
                  className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/55 px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:text-white"
                >
                  Specs ↓
                </button>

                <div className="pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2.5 rounded-full bg-black/50 px-3 py-2 backdrop-blur-md">
                  {config.heroImages.map((src, idx) => (
                    <button
                      key={src}
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                        activeHeroIndex === idx
                          ? 'scale-[1.1] border-[#F5B544] shadow-[0_0_16px_rgba(245,181,68,0.6)]'
                          : 'border-white/10 hover:border-white/35 hover:scale-[1.05]'
                      }`}
                    >
                      <div className="relative h-10 w-10 sm:h-11 sm:w-11">
                        <Image
                          src={src}
                          alt={`View ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT: config column */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex w-full flex-col gap-5 sm:max-w-md lg:max-w-sm xl:max-w-[420px]"
            >
              {/* Title + description */}
              <div>
                <p className="mb-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-neutral-500">
                  HeliosX · {config.shortName}
                </p>
                <h1 className="bg-gradient-to-r from-white via-slate-200 to-[#F5B544]/70 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
                  {config.name}
                </h1>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">
                  {config.description}
                </p>
              </div>

              {/* Highlights */}
              <motion.div
                variants={cardVariants}
                className="rounded-2xl border border-white/8 bg-neutral-900/60 p-4 text-xs text-neutral-200"
              >
                <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Highlights
                </p>
                <div className="grid grid-cols-2 gap-2.5 text-[0.75rem]">
                  {config.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#F5B544]">
                        <span className="h-1.5 w-1.5 rounded-full bg-black" />
                      </span>
                      <span className="text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Magnification chooser */}
              <motion.div
                variants={cardVariants}
                className="rounded-2xl border border-[#F5B544]/20 bg-gradient-to-br from-[#1a1200]/50 via-neutral-900/90 to-neutral-950/90 p-5 shadow-[0_0_32px_rgba(245,181,68,0.08)] backdrop-blur-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F5B544]">
                    Magnification
                  </p>
                  <span className="h-1 w-1 rounded-full bg-[#F5B544]/60" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {config.magnifications.map((mag) => (
                    <button
                      key={mag}
                      onClick={() => setSelectedMag(mag)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-250 ${
                        selectedMag === mag
                          ? 'bg-[#F5B544] text-black shadow-[0_0_24px_rgba(245,181,68,0.5)] scale-105'
                          : 'border border-white/15 bg-black/50 text-neutral-300 hover:border-[#F5B544]/40 hover:bg-[#1a1200]/40 hover:scale-[1.03]'
                      }`}
                    >
                      {mag}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Frame selector */}
              <motion.div
                variants={cardVariants}
                className="rounded-2xl border border-white/8 bg-neutral-900/75 p-4 text-xs text-neutral-200"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Frame style
                  </p>
                  <p className="text-[0.7rem] font-medium text-neutral-300">
                    {currentFrameConfig.label}
                    {currentColorConfig.name && ` · ${currentColorConfig.name}`}
                  </p>
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2">
                  {frameConfigs.map((frame) => {
                    const isActive = frame.id === selectedFrameId
                    return (
                      <button
                        key={frame.id}
                        onClick={() => {
                          setSelectedFrameId(frame.id)
                          setSelectedFrameColor(frame.colors[0].value)
                        }}
                        className={`relative overflow-hidden rounded-xl bg-black/40 transition-all duration-250 ${
                          isActive
                            ? 'border-2 border-[#F5B544] shadow-[0_0_20px_rgba(245,181,68,0.45)] ring-1 ring-[#F5B544]/20'
                            : 'border border-white/10 hover:border-white/35 hover:scale-[1.03]'
                        }`}
                      >
                        <div className="relative h-14 w-full">
                          <Image
                            src={frame.baseImage}
                            alt={frame.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute bottom-1 left-2 rounded-full bg-black/70 px-1.5 py-[2px] text-[0.58rem] font-medium text-neutral-200">
                          {frame.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {currentFrameConfig.colors.map((color) => {
                    const isActive = color.value === selectedFrameColor
                    return (
                      <button
                        key={color.value}
                        onClick={() => setSelectedFrameColor(color.value)}
                        className={`rounded-full px-3 py-1 text-[0.68rem] font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#F5B544] text-black shadow-[0_0_14px_rgba(245,181,68,0.5)]'
                            : 'border border-white/12 bg-black/40 text-neutral-300 hover:border-[#F5B544]/40 hover:text-white'
                        }`}
                      >
                        {color.name}
                      </button>
                    )
                  })}
                </div>

                {/* Frame preview */}
                <div className="mt-3 w-full">
                  <div className="relative h-[160px] w-full overflow-hidden rounded-xl border border-[#F5B544]/25 bg-neutral-800">
                    <Image
                      src={currentColorConfig.image}
                      alt={`${currentFrameConfig.label} ${currentColorConfig.name}`}
                      fill
                      className="object-cover transition-opacity duration-400"
                    />
                    <div className="pointer-events-none absolute inset-0 z-[2] mix-blend-overlay">
                      <Noise
                        patternSize={250}
                        patternScaleX={1}
                        patternScaleY={1}
                        patternRefreshInterval={2}
                        patternAlpha={6}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Subtotal + add to cart */}
              <motion.div
                variants={cardVariants}
                className="rounded-2xl border border-white/8 bg-neutral-900/95 p-4"
              >
                <div className="flex items-center justify-between text-sm text-neutral-200">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-base font-semibold text-white">${subtotal}.00</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-3 w-full rounded-full bg-[#F5B544] py-3 text-sm font-semibold text-black shadow-[0_0_28px_rgba(245,181,68,0.4)] transition-all duration-250 hover:bg-[#f7c360] hover:shadow-[0_0_36px_rgba(245,181,68,0.55)]"
                >
                  Add to cart
                </button>
                <p className="mt-2.5 text-center text-[0.62rem] text-neutral-600">
                  Free shipping · 30-day returns · No hidden fees
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* TECHNICAL DETAIL / SPECS */}
        <section
          ref={techRef}
          className="border-t border-white/10 bg-black pb-24 pt-16"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 lg:px-10 xl:px-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start"
            >
              <div className="max-w-lg">
                <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  Technical detail
                </p>
                <h2 className="bg-gradient-to-r from-white via-slate-200 to-[#F5B544]/60 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
                  {config.specTitle}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">
                  {config.specDescription}
                </p>
              </div>

              <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="grid flex-1 grid-cols-1 gap-5 text-xs text-neutral-200 sm:grid-cols-2 lg:grid-cols-3"
              >
                {config.specColumns.map((column) => (
                  <motion.div
                    key={column.title}
                    variants={cardVariants}
                    className="rounded-2xl border border-white/8 bg-neutral-900/60 p-4"
                  >
                    <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#F5B544]/80">
                      {column.title}
                    </h3>
                    <ul className="mt-3 space-y-2 text-[0.75rem] text-neutral-300">
                      {column.items.map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid gap-4 md:grid-cols-3"
            >
              {config.specImages.map((image) => (
                <motion.div
                  key={image.src}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="relative h-52 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FOOTER BANNER */}
        <section className="relative overflow-hidden border-t border-white/8">
          <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-4 py-14 lg:px-10 xl:px-16">
            <div className="relative z-10 max-w-lg space-y-3">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Built for real operators
              </p>
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Designed in the OR, priced for reality.
              </h3>
              <p className="text-sm text-neutral-400">
                Surgeons shouldn&apos;t choose between precision tools and two months of rent.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-block rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-medium text-neutral-300 backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                Back to top ↑
              </button>
            </div>

            <div className="pointer-events-none absolute inset-0">
              <Image
                src="/Walkinghallway2.png"
                alt="Surgeon hallway"
                fill
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/95" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
