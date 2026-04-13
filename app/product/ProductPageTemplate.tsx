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
        <section className="w-full pt-4 pb-20 lg:pb-28">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 lg:flex-row lg:items-start lg:px-10 xl:px-16"
          >
            {/* LEFT: hero image + thumbs */}
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="relative w-full max-w-[900px] overflow-hidden rounded-[32px] border border-white/10 bg-black/80 shadow-[0_30px_120px_rgba(0,0,0,0.85)]"
              >
                <div className="relative aspect-[4/5] w-full md:aspect-[3/4] lg:aspect-[16/9]">
                  <Image
                    src={config.heroImages[activeHeroIndex]}
                    alt={`${config.shortName} surgical loupes hero`}
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

                <button
                  onClick={scrollToTech}
                  className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-neutral-100 backdrop-blur-md transition hover:bg-white/10"
                >
                  View product specs
                </button>

                <div className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3 rounded-full bg-black/55 px-3 py-2 backdrop-blur-md">
                  {config.heroImages.map((src, idx) => (
                    <button
                      key={src}
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`relative overflow-hidden rounded-[18px] border transition-all duration-200 ${
                        activeHeroIndex === idx
                          ? 'scale-[1.08] border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.7)]'
                          : 'border-white/10 hover:border-white/40 hover:scale-[1.05]'
                      }`}
                    >
                      <div className="relative h-10 w-10 xs:h-11 xs:w-11 sm:h-12 sm:w-12 lg:h-11 lg:w-11">
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
              transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
              className="flex w-full max-w-md flex-col gap-6 lg:max-w-sm xl:max-w-md"
            >
              {/* Title + description */}
              <div>
                <p className="mb-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-neutral-500">
                  HeliosX · {config.shortName}
                </p>
                <h1 className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
                  {config.name}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  {config.description}
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
                  {config.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-[3px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                        <span className="h-2 w-2 rounded-full bg-black" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Magnification chooser - Prominent */}
              <motion.div
                variants={cardVariants}
                className="rounded-3xl border-2 border-emerald-400/30 bg-gradient-to-br from-emerald-950/40 via-neutral-900/90 to-neutral-950/90 p-5 shadow-[0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                    Magnification
                  </p>
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                </div>
                <p className="mb-4 text-xs leading-relaxed text-neutral-300">
                  Select your preferred magnification level for optimal precision.
                </p>
                <div className="flex flex-wrap gap-3">
                  {config.magnifications.map((mag) => (
                    <button
                      key={mag}
                      onClick={() => setSelectedMag(mag)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        selectedMag === mag
                          ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.6)] scale-105'
                          : 'border-2 border-white/20 bg-black/50 text-neutral-200 hover:border-emerald-400/50 hover:bg-emerald-950/30 hover:scale-105'
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
                className="rounded-3xl border border-white/10 bg-neutral-900/80 p-4 text-xs text-neutral-200 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
              >
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Frame style
                </p>

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
                        className={`relative overflow-hidden rounded-2xl bg-black/40 transition-all duration-300 ${
                          isActive
                            ? 'border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400/30'
                            : 'border border-white/10 hover:border-white/40 hover:scale-105'
                        }`}
                      >
                        <div className="relative h-16 w-full">
                          <Image
                            src={frame.baseImage}
                            alt={frame.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute bottom-1 left-2 rounded-full bg-black/75 px-2 py-[2px] text-[0.6rem] font-medium text-neutral-100">
                          {frame.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mb-2 text-[0.7rem] text-neutral-300">
                  <p className="font-semibold text-neutral-100">
                    {currentFrameConfig.label}{' '}
                    {currentColorConfig.name && `· ${currentColorConfig.name}`}
                  </p>
                  <p className="mt-1">
                    Choose a base frame, then fine-tune the finish. All frames
                    support light mounts and prescription builds.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentFrameConfig.colors.map((color) => {
                    const isActive = color.value === selectedFrameColor
                    return (
                      <button
                        key={color.value}
                        onClick={() => setSelectedFrameColor(color.value)}
                        className={`rounded-full px-3 py-1 text-[0.7rem] font-medium transition ${
                          isActive
                            ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.6)]'
                            : 'border border-white/15 bg-black/40 text-neutral-200 hover:border-white/40'
                        }`}
                      >
                        {color.name}
                      </button>
                    )
                  })}
                </div>

                {/* Frame preview */}
                <div className="mt-4 mx-auto w-full max-w-[400px]">
                  <div className="relative mx-auto h-[180px] min-w-[200px] max-w-[400px] overflow-hidden rounded-xl border-2 border-emerald-400/35 bg-neutral-800 shadow-[0_4px_18px_rgba(0,0,0,0.45)]">
                    <Image
                      src={currentColorConfig.image}
                      alt={`${currentFrameConfig.label} ${currentColorConfig.name}`}
                      fill
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 z-[2] mix-blend-overlay">
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
                  fees—just the loupes you actually need.
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
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                  Technical detail
                </p>
                <h2 className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
                  {config.specTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
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
                    className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4"
                  >
                    <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      {column.title}
                    </h3>
                    <ul className="mt-3 space-y-2 text-[0.75rem]">
                      {column.items.map((item) => (
                        <li key={item}>{item}</li>
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
