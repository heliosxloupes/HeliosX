"use client";

import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Noise from "@/components/Noise";
import Header from "@/components/Header";
import OrderingInfoSection from "@/components/OrderingInfoSection";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductPage() {
  return (
    <>
      <Header />
      <main className="pt-24 bg-black text-white min-h-screen">
        <ParallaxProductHero />
        <OurLoupesGrid />
        <OrderingInfoSection />
      </main>
    </>
  );
}

/* --------------------------------------------- */
/*  PARALLAX HERO – GSAP SCROLLTRIGGER LAYERS    */
/* --------------------------------------------- */

function ParallaxProductHero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const layeredImageSectionRef = useRef<HTMLDivElement | null>(null);
  const basexImageRef = useRef<HTMLDivElement | null>(null);
  const basex1ImageRef = useRef<HTMLDivElement | null>(null);
  const basex2ImageRef = useRef<HTMLDivElement | null>(null);
  const basex3ImageRef = useRef<HTMLDivElement | null>(null);
  const basex4ImageRef = useRef<HTMLDivElement | null>(null);
  const logoContainerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update(); // Update ScrollTrigger on Lenis scroll
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update); // Link Lenis to ScrollTrigger

    if (
      layeredImageSectionRef.current &&
      basexImageRef.current &&
      basex1ImageRef.current &&
      basex2ImageRef.current &&
      basex3ImageRef.current &&
      basex4ImageRef.current
    ) {
      // basex (background) - static or very slow movement
      gsap.to(basexImageRef.current, {
        y: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2.0,
        },
      });

      // basex4 (bottom layer) - slowest parallax movement
      gsap.to(basex4ImageRef.current, {
        y: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8,
        },
      });

      // base3.5x (middle-bottom layer) - moderate movement
      gsap.to(basex3ImageRef.current, {
        y: -59,
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // basex2 (middle-top layer) - faster movement
      gsap.to(basex2ImageRef.current, {
        y: -83,
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // basex1 (top layer) - fastest movement
      gsap.to(basex1ImageRef.current, {
        y: -106,
        ease: 'none',
        scrollTrigger: {
          trigger: layeredImageSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0,
        },
      });

      // Logo animation - translates up when scrolling
      if (logoContainerRef.current) {
        gsap.to(logoContainerRef.current, {
          y: -200,
          ease: 'none',
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Text parallax animation - translates up when scrolling
      if (textContainerRef.current) {
        gsap.to(textContainerRef.current, {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: layeredImageSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.0,
          },
        });
      }
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-black pt-28 pb-24 md:pb-32 w-full"
    >
      {/* Parallax layers spanning full viewport width */}
      <div ref={layeredImageSectionRef} className="pointer-events-none absolute inset-0 w-full">
        <div className="relative h-[360px] md:h-[460px] lg:h-[520px] w-full">
          {/* Tronaeast-style fade overlay - blends into background */}
          <div className="absolute inset-0 z-[11] pointer-events-none bg-gradient-to-b from-transparent via-transparent via-60% via-[rgba(0,0,0,0.2)] via-75% via-[rgba(0,0,0,0.5)] via-85% via-[rgba(0,0,0,0.8)] via-92% to-black" />

          {/* Base background layer – basex */}
          <div
            ref={basexImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 0 }}
          >
            <Image
              src="/basex.png"
              alt="HeliosX base optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* Layer 4 – basex4.5 */}
          <div
            ref={basex4ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 1 }}
          >
            <Image
              src="/basex4.5.png"
              alt="HeliosX 4.5x optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* Layer 3 – basex3.5 */}
          <div
            ref={basex3ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 2 }}
          >
            <Image
              src="/base3.5x.png"
              alt="HeliosX 3.5x optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* HeliosX Logo Container - positioned at the very top layer (above all overlays) */}
          <div
            ref={logoContainerRef}
            className="absolute top-[15%] left-[2rem] pointer-events-none will-change-transform"
            style={{ zIndex: 12 }}
          >
            <div className="flex flex-col items-start gap-0">
              <Image
                src="/upscaledlogo.png"
                alt="HeliosX Logo"
                width={300}
                height={300}
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                quality={100}
                style={{
                  width: "auto",
                  height: "200px",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </div>

          {/* basex2 - Middle-top parallax layer */}
          <div
            ref={basex2ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 3 }}
          >
            <Image
              src="/basex2.png"
              alt="HeliosX 2x optical layout"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
          </div>

          {/* basex1 - Top parallax layer (highest, most bottom of image visually) */}
          <div
            ref={basex1ImageRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ zIndex: 4 }}
          >
            <Image
              src="/basex1.png"
              alt="HeliosX primary optical configuration"
              fill
              className="object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, black 60%, rgba(0, 0, 0, 0.95) 75%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.6) 92%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)",
              }}
              priority
            />
            <div className="absolute inset-0 pointer-events-none z-10 mix-blend-mode-overlay opacity-100">
              <Noise
                patternSize={250}
                patternScaleX={1}
                patternScaleY={1}
                patternRefreshInterval={2}
                patternAlpha={5}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text content over the parallax layers */}
      <div className="relative z-10 px-4 md:px-8">
        <div className="mx-auto max-w-6xl h-[360px] md:h-[460px] lg:h-[520px] flex items-center">
          <div
            ref={textContainerRef}
            className="will-change-transform ml-4 md:-ml-12 lg:-ml-20"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white">
              Choose the HeliosX system
              <br />
              that matches your craft.
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- */
/*  OUR LOUPES GRID – 4 CARDS HORIZONTAL         */
/* --------------------------------------------- */

function OurLoupesGrid() {
  // Helper function to get glow color for each product
  const getGlowColor = (slug: string) => {
    switch (slug) {
      case 'galileo':
        return '56,189,248'; // Sky blue
      case 'newton':
        return '16,185,129'; // Emerald
      case 'apollo':
        return '255,157,0'; // Orange
      case 'kepler':
        return '139,92,246'; // Purple
      default:
        return '56,189,248';
    }
  };

  const products = [
    {
      slug: "galileo",
      name: "Galileo",
      magnification: "2.5x • 3.0x • 3.5x",
      tagline: "Versatile field of view for general and reconstructive work.",
      bullets: ["Lightweight", "Modern frame geometry", "Everyday precision"],
      highlight: "Best for broad use and training.",
      imageSrc: "/Galileo/GalileoMainProduct(notext).png",
      imageAlt: "HeliosX Galileo loupes product image",
    },
    {
      slug: "newton",
      name: "Newton",
      magnification: "2.5x • 3.0x • 3.5x",
      tagline: "Ultra-light performance for long cases and full OR days.",
      bullets: ["Ultra-light chassis", "Comfort-driven design", "Low fatigue"],
      highlight: "Best when comfort is critical.",
      imageSrc: "/Newton/NewtonMainProduct(notext).png",
      imageAlt: "HeliosX Newton loupes product image",
    },
    {
      slug: "apollo",
      name: "Apollo",
      magnification: "3.0x • 4.0x • 5.0x • 6.0x",
      tagline: "High-magnification clarity for detail-obsessed operators.",
      bullets: [
        "Next-generation optics",
        "Increased working precision",
        "Ergonomic frame options",
      ],
      highlight: "Best for fine aesthetic & micro-oriented work.",
      imageSrc: "/Apollo/ApollomainProduct(Notext).png",
      imageAlt: "HeliosX Apollo loupes product image",
    },
    {
      slug: "kepler",
      name: "Kepler",
      magnification: "4.0x • 5.0x • 6.0x",
      tagline: "Maximal magnification for demanding micro and super-micro.",
      bullets: [
        "Signature optical stack",
        "Upgraded contrast & resolution",
        "Designed for advanced users",
      ],
      highlight: "Best for high-level microsurgery.",
      imageSrc: "/Keppler/KepplerMainProduct(Notext).png",
      imageAlt: "HeliosX Kepler loupes product image",
    },
  ];

  return (
    <section className="bg-black px-4 md:px-8 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-3"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
            OUR LOUPES
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Four systems. One standard of excellence.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group relative"
            >
              <Link
                href={`/product/${product.slug}`}
                className="group/card block relative rounded-2xl border border-white/10 bg-neutral-900/70 overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/30"
                style={{
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                  transition: 'all 0.3s ease-out'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  const glowColor = getGlowColor(product.slug);
                  e.currentTarget.style.boxShadow = `0 0 50px rgba(${glowColor}, 0.25)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                }}
              >
                {/* Enhanced glow effect on hover - variant colors per product */}
                <div 
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{
                    background: `radial-gradient(circle at top right, rgba(${getGlowColor(product.slug)}, 0.12), transparent 60%)`,
                    opacity: 0.5
                  }}
                />
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{
                    background: `radial-gradient(circle at top right, rgba(${getGlowColor(product.slug)}, 0.3), transparent 50%)`
                  }}
                />
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                  style={{
                    background: `radial-gradient(circle at center, transparent, rgba(${getGlowColor(product.slug)}, 0.1))`
                  }}
                />
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none z-10 mix-blend-mode-overlay opacity-100">
                    <Noise
                      patternSize={250}
                      patternScaleX={1}
                      patternScaleY={1}
                      patternRefreshInterval={2}
                      patternAlpha={5}
                    />
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-400 font-medium">
                      {product.magnification}
                    </p>
                  </div>

                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                    {product.tagline}
                  </p>

                  <ul className="space-y-1.5 pt-2">
                    {product.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-xs md:text-sm text-neutral-400 flex items-start"
                      >
                        <span className="mr-2 text-neutral-500">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs md:text-sm text-neutral-500 italic pt-2 border-t border-white/5">
                    {product.highlight}
                  </p>
                  
                  {/* Select Button */}
                  <div className="pt-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/product/${product.slug}`;
                      }}
                      className="w-full rounded-full border border-white/35 px-3 py-1.5 text-[0.7rem] font-semibold text-neutral-50 transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                    >
                      Select {product.name}
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

