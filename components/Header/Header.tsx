'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CartButton from '../CartButton'

function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggle = () => setOpen((prev) => !prev)

  // Scroll lock when menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;

    const body = document.body;
    const html = document.documentElement;

    const prevBodyOverflow = body.style.overflow;
    const prevBodyTouchAction = body.style.touchAction;
    const prevHtmlOverflow = html.style.overflow;

    if (open) {
      // lock scrolling on iOS + general
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
      html.style.overflow = "hidden";
    } else {
      body.style.overflow = prevBodyOverflow;
      body.style.touchAction = prevBodyTouchAction;
      html.style.overflow = prevHtmlOverflow;
    }

    // cleanup on unmount
    return () => {
      body.style.overflow = prevBodyOverflow;
      body.style.touchAction = prevBodyTouchAction;
      html.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/product", label: "Products" },
    { href: "/education", label: "Education" },
    { href: "/home#story", label: "Story" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          {/* Logo / brand */}
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="flex items-center gap-2"
          >
            <Image
              src="/logominimalnowriting.png"
              alt="HeliosX"
              width={26}
              height={26}
              className="h-7 w-7 object-contain brightness-0 invert"
            />
            <span className="text-sm font-semibold tracking-[0.18em] uppercase text-neutral-200">
              HELIOSX
            </span>
          </button>

          <div className="flex items-center gap-3">
            {/* Cart button */}
            <CartButton />

            {/* Hamburger */}
            <button
              type="button"
              onClick={toggle}
              className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-neutral-100"
              aria-label="Toggle navigation"
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <span className={`block h-[1.5px] w-4 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <span className={`block h-[1.5px] w-4 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`block h-[1.5px] w-4 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-[5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-lg overscroll-none"
            onClick={toggle}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          >
            {/* gradient background (static, not animated) */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F5B544]/10 blur-3xl" />
              <div className="absolute top-1/3 right-0 h-80 w-80 translate-x-1/4 rounded-full bg-neutral-700/20 blur-3xl" />
              <div className="absolute bottom-[-120px] left-0 h-72 w-72 -translate-x-1/3 rounded-full bg-[#F5B544]/7 blur-3xl" />
            </div>

            {/* sliding inner content panel */}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{
                duration: 0.26,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="relative mx-auto flex h-full max-w-6xl flex-col px-4 pt-4 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top row inside menu */}
              <div className="mb-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/home");
                  }}
                  className="flex items-center gap-2"
                >
                  <Image
                    src="/logominimalnowriting.png"
                    alt="HeliosX"
                    width={26}
                    height={26}
                    className="h-7 w-7 object-contain brightness-0 invert"
                  />
                  <span className="text-sm font-semibold tracking-[0.18em] uppercase text-neutral-50">
                    HELIOSX
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggle}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/70 text-neutral-100 text-xl"
                  aria-label="Close navigation"
                >
                  ×
                </button>
              </div>

              {/* Nav links */}
              <nav className="mt-2 flex-1 space-y-8 text-neutral-100">
                <div>
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                    Primary
                  </p>
                  <ul className="space-y-3">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            if (item.href.includes('#')) {
                              const [path, hash] = item.href.split('#');
                              router.push(path);
                              setTimeout(() => {
                                const element = document.getElementById(hash);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            } else {
                              router.push(item.href);
                            }
                          }}
                          className="w-full text-left"
                        >
                          <span
                            className={`text-[1.46rem] transition-all duration-200 ${
                              pathname === item.href || (item.href.includes('#') && pathname === item.href.split('#')[0])
                                ? "bg-gradient-to-r from-white via-neutral-200 to-[#F5B544] bg-clip-text font-semibold text-transparent"
                                : "font-medium text-neutral-200 hover:text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                    Quick links
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-300">
                    <li>
                      <Link
                        href="/education"
                        onClick={() => setOpen(false)}
                        className="hover:text-white transition"
                      >
                        Optical evidence
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq"
                        onClick={() => setOpen(false)}
                        className="hover:text-white transition"
                      >
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/home#story"
                        onClick={() => setOpen(false)}
                        className="hover:text-white transition"
                      >
                        How HeliosX began
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>

              {/* Bottom CTA line */}
              <div className="mt-8 flex items-center justify-between text-xs text-neutral-400">
                <span>Born in the OR. Built for surgeons.</span>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/product");
                  }}
                  className="rounded-full bg-[#F5B544] px-4 py-1.5 text-[0.7rem] font-semibold text-black transition-all duration-200 hover:bg-[#f7c360]"
                >
                  View loupes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Header() {
  const headerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // make sure header starts visible
    gsap.set(header, { yPercent: 0 })

    let lastScrollY = window.scrollY
    let isHidden = false
    const threshold = 12 // px of movement before we react

    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY

      // scrolling down
      if (delta > threshold && currentY > 80 && !isHidden) {
        isHidden = true
        gsap.to(header, {
          yPercent: -100,
          duration: 0.35,
          ease: 'power2.out',
        })
      }

      // scrolling up
      if (delta < -threshold && isHidden) {
        isHidden = false
        gsap.to(header, {
          yPercent: 0,
          duration: 0.35,
          ease: 'power2.out',
        })
      }

      lastScrollY = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      {/* Mobile nav */}
      <div className="block md:hidden">
        <MobileNav />
      </div>

      {/* Desktop nav */}
      <header
        ref={headerRef}
        className="hidden md:block fixed top-0 left-0 z-50 w-full bg-black/75 backdrop-blur-md border-b border-white/10"
      >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-10 xl:px-16">
        {/* Left: logo + wordmark */}
        <Link href="/home" className="flex items-center gap-2">
          <Image
            src="/logominimalnowriting.png"
            alt="HeliosX logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain brightness-0 invert"
            priority
          />
          <span className="hidden text-sm font-semibold uppercase tracking-[0.35em] text-neutral-200 sm:inline">
            HELIOSX
          </span>
        </Link>

        {/* Center: nav (Product / Education / Story / FAQ) */}
        <nav className="hidden items-center gap-6 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-neutral-300 md:flex">
          <Link href="/home" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/product" className="transition hover:text-white">
            Product
          </Link>
          <Link href="/education" className="transition hover:text-white">
            Education
          </Link>
          <Link href="/home#story" className="transition hover:text-white">
            Story
          </Link>
          <Link href="/faq" className="transition hover:text-white">
            FAQ
          </Link>
        </nav>

        {/* Right: Cart + Order CTA */}
        <div className="flex items-center gap-3">
          <CartButton />

          <Link
            href="/product"
            className="hidden rounded-full bg-[#F5B544] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_24px_rgba(245,181,68,0.45)] transition-all duration-200 hover:bg-[#f7c360] hover:shadow-[0_0_32px_rgba(245,181,68,0.6)] md:inline-flex"
          >
            Order now
          </Link>
        </div>
      </div>
    </header>
    </>
  )
}
