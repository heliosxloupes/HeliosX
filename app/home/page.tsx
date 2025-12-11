"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LenisProvider } from "@/components/lenis-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="pt-16 space-y-24 md:space-y-32">
          <HeroSection />
          <ManifestoSection />
          <HorizontalScrollSection />

          {/* Global flowing background for mid sections */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#050814] to-black">
              {/* top glow */}
              <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/18 blur-3xl" />
              {/* mid-right glow */}
              <div className="absolute top-1/3 right-0 h-80 w-80 translate-x-1/4 rounded-full bg-sky-500/16 blur-3xl" />
              {/* bottom-left glow */}
              <div className="absolute bottom-[-140px] left-0 h-80 w-80 -translate-x-1/3 rounded-full bg-orange-400/14 blur-3xl" />
            </div>

            <WhyHeliosXSection />
            <InUseSection />
            <OpticalClaritySection />
            <UseCasesSection />
            <CustomizationSection />
            <ErgonomicsHealthSection />
            <DiveDeeperSection />
            <PublicBenefitSection />
            <ProductAtGlanceSection />
          </section>
        </main>

        <HeliosXFooter />
      </div>
    </LenisProvider>
  );
}

/* -------------------- Hero -------------------- */

function HeroSection() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const heroWrapperRef = useRef<HTMLDivElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section id="top" className="relative bg-black">
      {/* Full viewport and flush under header */}
      <div
        ref={heroWrapperRef}
        className="flex min-h-screen items-start justify-center px-4 pt-0 md:px-[50px] md:pt-0"
      >
        {/* Fullscreen hero card with ~50px margin */}
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative h-[calc(100vh-80px)] w-full overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900/70"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setCursorPos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }}
        >
          {/* Subtle spotlight following cursor */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(280px at ${cursorPos.x}px ${cursorPos.y}px, rgba(255,255,255,0.18), transparent 70%)`,
              mixBlendMode: "screen",
            }}
          />

          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0">
            <Image
              src="/Apollo/Apollo3xFemale2.png"
              alt="Surgeon wearing HeliosX loupes in the OR"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* GRADIENT OVERLAY */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/85 via-black/55 to-transparent" />

          {/* CONTENT OVERLAY */}
          <motion.div
            className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-xl space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-gradient-to-r from-emerald-500/20 via-emerald-400/15 to-emerald-300/10 px-3 py-1 text-xs font-medium text-green-200 backdrop-blur"
                variants={fadeIn}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                In stock · Ships in 3–5 business days
              </motion.div>

              <motion.h1
                className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                Surgical precision,{" "}
                <span className="bg-gradient-to-r from-white via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                  finally accessible.
                </span>
              </motion.h1>

              <motion.p
                className="text-base text-neutral-200 md:text-lg"
                variants={fadeUp}
                transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
              >
                Created for those who pursue mastery. Engineered for excellence,
                with perfect focus in every detail.
              </motion.p>

              <motion.p
                className="text-sm text-neutral-300"
                variants={fadeUp}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                No gate keeping. Just fair pricing. Elite quality made truly
                affordable.
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-4 pt-2"
                variants={fadeUp}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              >
                <Link
                  href="/product"
                  className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black shadow-lg shadow-white/15 transition-colors hover:bg-neutral-200"
                >
                  Shop HeliosX Loupes
                </Link>
              </motion.div>
            </div>

            {/* Bottom right: Newsletter + Order Now */}
            <div className="flex flex-col items-end gap-10">
              {/* Newsletter */}
              <div className="group relative hidden md:block">
                <div className="max-w-[320px] cursor-pointer rounded-[8px] border border-black/20 bg-gradient-to-r from-white/95 to-[#f5f0e8]/90 px-6 py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <button className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center text-2xl leading-none text-black/60 hover:text-black">
                    ×
                  </button>
                  <h3 className="mb-2 pr-8 text-xl font-semibold text-black md:text-2xl">
                    Newsletter
                  </h3>
                  <p className="text-sm font-semibold text-gray-600 md:text-base">
                    GET UPDATES • NO SPAM
                  </p>
                </div>
                {/* Email input container - appears on hover */}
                <div className="pointer-events-none absolute right-full top-0 mr-2 w-80 scale-x-90 translate-x-4 rounded-lg border border-orange-300 bg-white/98 p-6 opacity-0 shadow-xl transition-all duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="mb-3 w-full rounded-md border border-white/30 bg-black/60 px-4 py-3 text-sm text-white placeholder-white/70 focus:border-orange-400 focus:outline-none"
                  />
                  <button className="w-full rounded-md bg-[#FF9B00] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#FFB033]">
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Order Now Button */}
              <Link
                href="/product"
                className="inline-flex min-w-[280px] items-center justify-center rounded-[8px] bg-[#FF9B00] px-10 py-5 text-base font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#FFB033] md:text-lg"
              >
                Order now
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Manifesto -------------------- */

function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="relative bg-black px-4 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[3fr,2fr] md:items-center">
        {/* TEXT SIDE */}
        <motion.div
          className="space-y-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold tracking-[0.35em] text-neutral-500">
            MANIFESTO
          </p>
          <h2 className="text-2xl font-semibold leading-snug md:text-3xl">
            WE REFUSE to accept that surgical optics must be overpriced,
            gatekept, or reserved for a select few.
          </h2>
          <p className="text-sm text-neutral-300 md:text-base">
            We reject the idea that clarity is a luxury. That precision belongs
            only to those who can absorb a five-figure price tag. That the tools
            we rely on for patient care should be engineered for margin first
            and mastery second.
          </p>
          <p className="text-sm text-neutral-300 md:text-base">
            HeliosX is built around a simple belief:{" "}
            <span className="font-medium">skill thrives where access exists.</span>{" "}
            Elite optical quality, honest pricing, and designs shaped by real
            surgeons—not by corporate spreadsheets.
          </p>
          <p className="text-sm text-neutral-300 md:text-base">
            No gate keeping. Just fair pricing. Elite quality made truly
            affordable.
          </p>
        </motion.div>
        {/* IMAGE SIDE */}
        <motion.div
          className="space-y-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
            <Image
              src="/hardcase1.png"
              alt="HeliosX loupes in protective hard case"
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60">
              <Image
                src="/Galileo/girlinmirror.png"
                alt="Surgeon adjusting HeliosX loupes in mirror"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60">
              <Image
                src="/Keppler/KeplerMain.jpg"
                alt="Surgeon working with HeliosX loupes"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Horizontal Scroll Section -------------------- */

function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Parallax motion values for Panel 1 video
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getMaxX = () => track.scrollWidth - window.innerWidth;

      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -getMaxX(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getMaxX()}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        }
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getMaxX()}`,
        onUpdate: (self) => setProgress(self.progress),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      aria-label="Horizontal features with 3D"
    >
      {/* This wrapper gives ScrollTrigger vertical space */}
      <div className="h-[180vh]">
        {/* Sticky viewport */}
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden relative">
          {/* Progress bar */}
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Horizontal track */}
          <div
            ref={trackRef}
            className="flex h-full w-[400vw] will-change-transform"
          >
            {/* Panel 1 – Parallax Cinematic Video */}
            <div className="flex w-screen shrink-0 items-center justify-center px-0">
              <div className="flex w-full items-center justify-center">
                <motion.div
                  style={{ y }}
                  className="relative h-[75vh] w-[85%] rounded-[36px] overflow-hidden border border-white/10 bg-neutral-900/70 shadow-[0_30px_90px_rgba(0,0,0,0.75)]"
                >
                  <video
                    src="/mainpagevideo2.mp4"
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />

                  {/* Text overlay at bottom left */}
                  <div className="pointer-events-none absolute bottom-8 left-6 md:left-16 z-10 max-w-[600px]">
                    <p className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl md:text-5xl">
                      Unmatched Quality, Finally Affordable.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* --------------------------------------------------- */}
            {/* Panel 2 – ENGINEERED FOR EXCELLENCE                 */}
            {/* (fixed mobile cropping)                             */}
            {/* --------------------------------------------------- */}
            <div className="flex w-screen shrink-0 items-center px-6">
              <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-center">
                {/* Text */}
                <div className="flex-1 space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                    ENGINEERED FOR EXCELLENCE
                  </p>
                  <h3 className="text-xl md:text-2xl font-semibold">
                    Perfect focus, every detail.
                  </h3>
                  <p className="text-sm md:text-base text-neutral-300">
                    Designed for those who demand precision. Created for those
                    who pursue mastery. HeliosX pairs optical clarity with
                    ergonomic comfort, so you can stay locked in on the field
                    that matters most: the operative field.
                  </p>
                  <p className="text-sm md:text-base text-neutral-300">
                    Engineered for excellence, without the industry markup. No
                    gate keeping—just fair pricing and elite quality made truly
                    affordable.
                  </p>
                </div>

                {/* 3D Canvas – MOBILE SAFE HEIGHT */}
                <div className="flex-1">
                  <Link href="/product" className="block h-full w-full">
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                      className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900/70 shadow-[0_30px_90px_rgba(0,0,0,0.75)] md:h-[80vh] md:max-w-none md:aspect-auto"
                    >
                      <Image
                        src="/Newton/NewtonAsian2.png"
                        alt="HeliosX loupes"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </Link>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------- */}
            {/* Panel 3 – BUILT AROUND YOU                          */}
            {/* --------------------------------------------------- */}
            <div className="flex w-screen shrink-0 items-center px-6">
              <div className="mx-auto flex max-w-[1600px] flex-col-reverse gap-8 md:flex-row md:items-center">
                {/* Image */}
                <div className="h-[65vh] flex-1 md:h-[75vh]">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 20,
                    }}
                    className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900/70"
                  >
                    <Image
                      src="/Apollo/Apollo3xFemale.png"
                      alt="Red-frame HeliosX loupes on a mannequin head"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                {/* Text */}
                <div className="flex-1 space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                    BUILT AROUND YOU
                  </p>
                  <h3 className="text-xl md:text-2xl font-semibold">
                    Form that follows function.
                  </h3>
                  <p className="text-sm md:text-base text-neutral-300">
                    Frames that actually fit your face. Working distances
                    tailored to the way you operate. Optics tuned so your
                    posture, not just your vision, feels better by the end of
                    the case.
                  </p>
                  <p className="text-sm md:text-base text-neutral-300">
                    HeliosX is designed to disappear on your nose so you can
                    stay immersed in your work—not fighting your gear.
                  </p>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------- */}
            {/* Panel 4 – DESIGNED FOR REAL PRACTICE               */}
            {/* Mobile: scrollable card gallery,                */}
            {/* Desktop: 3-column grid as before                  */}
            {/* --------------------------------------------------- */}
            <div className="flex w-screen shrink-0 items-center px-6">
              <div className="mx-auto w-full max-w-[1600px] space-y-6">
                <p className="text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
                  DESIGNED FOR REAL PRACTICE
                </p>
                <h3 className="text-center text-xl font-semibold md:text-2xl">
                  Built for precision-driven moments.
                </h3>
                <p className="mx-auto max-w-2xl text-center text-sm text-neutral-300 md:text-base">
                  HeliosX is engineered for the demanding parts of surgery — the
                  phases where magnification elevates technique, supports
                  accuracy, and sharpens every millimeter of detail.
                </p>
                <p className="mx-auto max-w-2xl text-center text-sm text-neutral-300 md:text-base">
                  From delicate dissection to fine suturing, cartilage
                  contouring, tendon repair, perforator identification, and
                  microsurgical work, HeliosX delivers clarity when precision
                  matters most.
                </p>

                {/* DESKTOP: 3-column grid (same content) */}
                <div className="mt-6 hidden gap-4 md:grid md:grid-cols-3">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                      className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60"
                    >
                      <Image
                        src="/Galileo/blackgirlinmirror.png"
                        alt="Surgeon adjusting loupes in the locker room mirror"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <p className="text-xs text-neutral-400">
                      Designed with surgeon-informed ergonomics—stable geometry,
                      balanced weight, and optical alignment that stays
                      consistent case after case.
                    </p>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                      className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60"
                    >
                      <Image
                        src="/Walkinghallway2.png"
                        alt="Surgeon walking down hospital hallway wearing HeliosX loupes"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <p className="text-xs text-neutral-400">
                      Built to handle daily use: locker rooms, long hallways,
                      call nights, and repeated OR turnover without babying the
                      gear.
                    </p>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                      className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60"
                    >
                      <Image
                        src="/Keppler/Keppler4.png"
                        alt="Close-up of surgeon wearing HeliosX loupes in the OR"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <p className="text-xs text-neutral-400">
                      Optimized optics for critical steps—dissection planes,
                      vessel handling, cartilage shaping, and precise closure
                      stay sharply defined.
                    </p>
                  </div>
                </div>

                {/* MOBILE: horizontal scroll cards */}
                <div className="mt-6 flex gap-4 overflow-x-auto pb-4 md:hidden -mx-4 px-4 snap-x snap-mandatory">
                  {/* Card 1 */}
                  <div className="snap-center min-w-[80%] space-y-4 rounded-3xl border border-white/10 bg-neutral-900/80 p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src="/Galileo/blackgirlinmirror.png"
                        alt="Surgeon adjusting loupes in the locker room mirror"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-neutral-300">
                      Designed with surgeon-informed ergonomics—stable geometry,
                      balanced weight, and optical alignment that stays
                      consistent case after case.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="snap-center min-w-[80%] space-y-4 rounded-3xl border border-white/10 bg-neutral-900/80 p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src="/Walkinghallway2.png"
                        alt="Surgeon walking down hospital hallway wearing HeliosX loupes"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-neutral-300">
                      Built to handle daily use: locker rooms, long hallways,
                      call nights, and repeated OR turnover without babying the
                      gear.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="snap-center min-w-[80%] space-y-4 rounded-3xl border border-white/10 bg-neutral-900/80 p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src="/Keppler/Keppler4.png"
                        alt="Close-up of surgeon wearing HeliosX loupes in the OR"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-neutral-300">
                      Optimized optics for critical steps—dissection planes,
                      vessel handling, cartilage shaping, and precise closure
                      stay sharply defined.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end Panel 4 */}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Why HeliosX Section -------------------- */

function WhyHeliosXSection() {
  return (
    <section className="px-4 py-16 md:px-8">
      <motion.div
        className="mx-auto max-w-4xl space-y-4 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
          WHY HELIOSX
        </p>
        <h3 className="bg-gradient-to-r from-white via-sky-200 to-emerald-200 bg-clip-text text-xl font-semibold text-transparent md:text-2xl">
          Designed for those who demand precision. Created for those who pursue
          mastery.
        </h3>
        <p className="text-sm text-neutral-300 md:text-base">
          Engineered for excellence. Perfect focus, every detail.
          No inflated pricing. Just fair access to elite optics so your skill,
          not your budget, defines your ceiling.
        </p>
      </motion.div>
    </section>
  );
}

/* -------------------- In Use Section -------------------- */

function InUseSection() {
  return (
    <section className="px-4 pb-20 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[3fr,2fr] md:items-center">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900/70"
        >
          <Image
            src="/Keppler/KeplerMain.jpg"
            alt="Senior surgeon working with HeliosX loupes"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          className="space-y-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            BUILT FOR REAL OPERATORS
          </p>
          <h3 className="text-xl font-semibold md:text-2xl">
            Skill thrives where access exists.
          </h3>
          <p className="text-sm text-neutral-300 md:text-base">
            HeliosX was created by surgeons who recognized a simple truth: the
            industry has been charging unjustifiable prices for essential
            surgical tools — not because the technology demands it, but because
            the market tolerates it.
          </p>
          <p className="text-sm text-neutral-300 md:text-base">
            We refuse to accept that magnification, something fundamental to
            precision, should come with a barrier-to-entry price tag. Surgeons
            deserve better — tools built for their craft, not for inflated
            margins.
          </p>
          <p className="text-sm text-neutral-300 md:text-base">
            HeliosX delivers elite optics without exploitation. No gate keeping.
            Just fair pricing, high-grade components, and equipment designed to
            disappear so your technique can take center stage.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------- */
/*  OPTICAL CLARITY SECTION (replaces "Display") */
/* --------------------------------------------- */

function OpticalClaritySection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28 overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[3fr,2fr] md:items-center">
        {/* Text side */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
            OPTICAL CLARITY
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-transparent">
              Engineered for sharp, confident visualization.
            </span>
          </h2>
          <p className="text-sm text-neutral-300 md:text-base">
            HeliosX optics are designed to give you a clear, stable view of the
            field—so you can trust what you&apos;re seeing when details are
            measured in millimeters.
          </p>
          <p className="text-sm text-neutral-300 md:text-base">
            From skin closure to microsurgical work, our lenses balance
            magnification, depth of field, and working distance for real
            surgical workflows—not bench demos.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300 md:text-base">
            <li>• Crisp image quality with consistent edge-to-edge clarity.</li>
            <li>
              • Optimized depth of field to keep both instrument and target in
              focus.
            </li>
            <li>
              • Stable magnification across common working distances.
            </li>
          </ul>
        </motion.div>

        {/* Right side – glassy cards over faint image */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative space-y-4"
        >
          {/* faint image in the back */}
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-25">
            <Image
              src="/Apollo/Apollo3xFemale2.png"
              alt="HeliosX optics background"
              fill
              className="object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black" />
          </div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-black/60 p-4 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
              MAGNIFICATION
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Configurable magnification ranges tuned for plastics, hand,
              microsurgery, and general precision work.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-black/60 p-4 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
              DEPTH & FIELD
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Balanced depth of field that supports steady visualization without
              constant micro-adjustments.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-black/60 p-4 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
              COATINGS & CONTRAST
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Anti-reflective coatings and high-quality glass help maintain
              contrast in bright OR lighting and under headlights—so tissue
              planes, vessels, and suture bites stay easy to track.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------- */
/*  USE CASES SECTION                            */
/* --------------------------------------------- */

function UseCasesSection() {
  const cards = [
    {
      label: "PLASTIC & RECONSTRUCTIVE",
      title: "Fine closure, contour, and detail work.",
      body: "From facial aesthetic cases to complex reconstruction, HeliosX supports precise skin closure, contour refinement, cartilage shaping, and flap inset where small decisions impact long-term results.",
    },
    {
      label: "HAND & NERVE",
      title: "Seeing structures you can't afford to miss.",
      body: "Ideal for tendon repairs, nerve exploration, digital reconstruction, and intricate dissections where millimeters separate success from compromise.",
    },
    {
      label: "MICRO / SUPER-MICRO",
      title: "When vessels are measured in fractions of a millimeter.",
      body: "Built to support microsurgical work where depth, stability, and clarity help you track sutures, vessel walls, and tiny anastomoses with confidence.",
    },
    {
      label: "HEAD & NECK / ENT",
      title: "Tight spaces, complex anatomy, demanding angles.",
      body: "For cases where access is limited and visualization is everything—oral, perioral, and head and neck work that benefits from focused, stable magnification.",
    },
  ];

  return (
    <section className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-3"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
            USE CASES
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Built for the specialties where precision is non-negotiable.
          </h2>
          <p className="max-w-2xl text-sm text-neutral-300 md:text-base">
            HeliosX is designed for surgeons who rely on magnification as an
            extension of their technique—not an occasional accessory.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {cards.map((card) => (
            <motion.div
              key={card.label}
              variants={cardVariants}
              className="space-y-2 rounded-2xl border border-white/10 bg-neutral-900/70 p-5"
            >
              <p className="text-xs font-semibold tracking-[0.25em] text-neutral-500">
                {card.label}
              </p>
              <h3 className="text-sm font-semibold text-neutral-100 md:text-base">
                {card.title}
              </h3>
              <p className="text-sm text-neutral-300">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------- */
/*  CUSTOMIZATION SECTION (replaces OR section)  */
/* --------------------------------------------- */

function CustomizationSection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28 overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[3fr,2fr] md:items-center">
        {/* Text side */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
            CUSTOMIZATION
          </p>

          <h2 className="bg-gradient-to-r from-white via-sky-200 to-emerald-200 bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
            Built for every specialty. Tailored to every surgeon.
          </h2>

          <p className="text-sm text-neutral-300 md:text-base">
            No two surgeons operate the same way — and your loupes shouldn&apos;t
            force you into a template. HeliosX offers multiple frame styles,
            magnifications, and material options designed to fit your workflow,
            your anatomy, and your aesthetic.
          </p>

          <p className="text-sm text-neutral-300 md:text-base">
            Choose from 2.5× to 6.0× magnification, lightweight plastic or
            premium metal frames, and designs ranging from modern minimalist to
            vintage-inspired. We tailor the system to you — without charging you
            two months of rent for it.
          </p>

          <ul className="mt-3 space-y-2 text-sm text-neutral-300 md:text-base">
            <li>• Multiple frame styles: modern, hipster, vintage, classic.</li>
            <li>• Material choices: ultra-light polymer or premium alloy metal.</li>
            <li>
              • Magnification options from 2.5× to 6.0× for any procedure type.
            </li>
            <li>
              • Configurations tuned for plastics, hand, ENT, ortho, micro, and
              more.
            </li>
          </ul>
        </motion.div>

        {/* Right side: animated feature tiles */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="space-y-4"
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-neutral-950/80 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400">
              MAGNIFICATION RANGE
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Configure anything from 2.5× wide-field setups to 6.0×
              high-precision micro systems.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-neutral-950/80 p-4"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400">
              FRAME OPTIONS
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Modern, vintage, minimalist, or bold — choose the look that feels
              like you.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-neutral-950/80 p-4"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400">
              MATERIAL CHOICES
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Lightweight polymer for all-day comfort, or premium metal for
              structure and durability.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------- */
/*  ERGONOMICS & HEALTH SECTION (Health remake)  */
/* --------------------------------------------- */

function ErgonomicsHealthSection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28 overflow-hidden">
      <div className="relative mx-auto max-w-6xl space-y-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl space-y-3"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
            ERGONOMICS & HEALTH
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-transparent">
              Loupes that respect your neck, posture, and spine.
            </span>
          </h2>
          <p className="text-sm text-neutral-300 md:text-base">
            HeliosX is designed with ergonomics in mind—from weight and balance
            to working distance and frame geometry. Because protecting your
            career means protecting your body.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-neutral-950/80 p-5 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400">
              NECK & CERVICAL SPINE
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Thoughtful working distances and viewing angles help you maintain
              a more neutral neck position, reducing strain over years of
              practice.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-neutral-950/80 p-5 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400">
              WEIGHT & BALANCE
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Lightweight designs and balanced frame architecture help minimize
              pressure points and muscle fatigue during longer cases.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="space-y-2 rounded-2xl border border-white/15 bg-neutral-950/80 p-5 backdrop-blur-xl"
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-neutral-400">
              LONG-TERM PRACTICE
            </p>
            <p className="text-sm text-neutral-100 md:text-base">
              Tools that support healthier posture and load distribution aren&apos;t
              just more comfortable—they help sustain your body across a
              lifetime of operating.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Dive Deeper -------------------- */

function DiveDeeperSection() {
  return (
    <section
      id="faq"
      className="border-y border-white/10"
    >
      <motion.div
        className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-12 md:flex-row md:px-6 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center md:text-left">
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-emerald-200 bg-clip-text text-xl font-semibold text-transparent md:text-2xl">
            Dive deeper into the product.
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-400">
            Link to dedicated pages: specs, story, blog posts, setup guides,
            etc.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <OutlinePill href="#product">Product details</OutlinePill>
          <OutlinePill href="#story">Story</OutlinePill>
          <OutlinePill href="#faq">FAQ</OutlinePill>
          <OutlinePill href="#support">Support</OutlinePill>
        </div>
      </motion.div>
    </section>
  );
}

interface OutlinePillProps {
  href: string;
  children: React.ReactNode;
}

function OutlinePill({ href, children }: OutlinePillProps) {
  return (
    <a
      href={href}
      className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-medium text-neutral-100 transition-colors hover:bg-white/10"
    >
      {children}
    </a>
  );
}

/* -------------------- Story / Company -------------------- */

function PublicBenefitSection() {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-gradient-to-b from-black via-[#050814] to-black"
    >
      {/* faint overlay noise / glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <motion.div
        className="relative mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Company
        </p>
        <h2 className="bg-gradient-to-r from-white via-slate-200 to-emerald-200 bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
          How HeliosX began.
        </h2>
        <p className="mt-4 text-sm text-neutral-400 md:text-base">
          HeliosX began with a simple realization shared by surgeons at every
          stage of training: the tools we rely on daily are treated like luxury
          goods instead of necessities.
        </p>
        <p className="mt-4 text-sm text-neutral-400 md:text-base">
          For decades, surgical optics have been locked behind inflated prices,
          outdated designs, and a business model that assumes surgeons will
          simply "accept it." But we didn't.
        </p>
        <p className="mt-4 text-sm text-neutral-400 md:text-base">
          We watched residents delay buying loupes because rent mattered more.
          We saw medical students borrow gear because their budget had limits.
          We listened to attendings who had used the same outdated optics for
          years because upgrading felt irrational.
        </p>
        <p className="mt-4 text-sm text-neutral-400 md:text-base">
          The problem was never the craftsmanship — it was the gatekeeping.
        </p>
        <p className="mt-4 text-sm text-neutral-400 md:text-base">
          So we built an alternative.
        </p>
        <p className="mt-8 text-sm text-neutral-300">— Founder</p>
      </motion.div>
    </section>
  );
}

/* -------------------- Product at a Glance / CTA -------------------- */

function ProductAtGlanceSection() {
  return (
    <section id="cta" className="border-y border-white/10">
      <motion.div
        className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              At a glance
            </p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              HeliosX loupes, at a glance.
            </h2>
            <p className="mt-4 text-sm text-neutral-400 md:text-base">
              Everything you need to know in one place: world-class optics,
              honest pricing, and a fitting process designed around real OR
              life.
            </p>

            <div className="mt-6 grid gap-4 text-sm text-neutral-200 md:grid-cols-2">
              <BulletItem>
                Galilean optics with generous depth of field.
              </BulletItem>
              <BulletItem>Magnification options from 2.5× to 6.0×.</BulletItem>
              <BulletItem>Custom frame styles fitted to your anatomy.</BulletItem>
              <BulletItem>
                Lightweight builds that respect your posture.
              </BulletItem>
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="space-y-4 rounded-2xl border border-white/10 bg-neutral-950/80 p-5"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  Starting at
                </p>
                <p className="mt-1 text-2xl font-semibold">$499</p>
              </div>
              <div className="text-right text-xs text-neutral-500">
                <p>Transparent pricing.</p>
                <p>No upsell games.</p>
              </div>
            </div>

            <Link
              href="/product"
              className="flex w-full items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-white/15 transition-colors hover:bg-neutral-200"
            >
              Shop HeliosX
            </Link>

            <p className="text-xs text-neutral-500">
              In stock · Ships in 3–5 business days with white-glove fitting
              support.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

interface BulletItemProps {
  children: React.ReactNode;
}

function BulletItem({ children }: BulletItemProps) {
  return (
    <div className="flex items-start gap-2 text-xs text-neutral-300">
      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
      <span>{children}</span>
    </div>
  );
}

/* -------------------- Footer -------------------- */

/* --------------------------------------------- */
/*  FOOTER (HeliosX)                             */
/* --------------------------------------------- */

function HeliosXFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black px-4 py-12 md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/Walkinghallway2.png"
          alt="Surgeon walking through hallway"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/90" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Brand / mission */}
          <div className="max-w-md space-y-3">
            <p className="text-sm font-semibold text-neutral-100">HeliosX</p>
            <p className="text-sm text-neutral-300">
              Surgical loupes designed by surgeons, for surgeons—bringing elite
              optical performance to more operators through honest, transparent
              pricing.
            </p>
            <p className="text-xs text-neutral-400">
              Need guidance on frames, magnification, or fitting? Our team
              answers within one business day.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-sm text-neutral-200">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
                PRODUCT
              </p>
              <Link
                href="/product/galileo"
                className="block text-left hover:text-white"
              >
                Loupes
              </Link>
              <button className="block text-left text-neutral-300 hover:text-white">
                Light systems
              </button>
              <button className="block text-left text-neutral-300 hover:text-white">
                Ordering & fittings
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400">
                COMPANY
              </p>
              <button className="block text-left text-neutral-300 hover:text-white">
                About
              </button>
              <button className="block text-left text-neutral-300 hover:text-white">
                Contact
              </button>
              <button className="block text-left text-neutral-300 hover:text-white">
                Support
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/50 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Bring HeliosX to your OR
            </p>
            <p className="text-xs text-neutral-400">
              Fit consultations, lead times, and ordering support—no pressure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/product"
              className="rounded-full bg-white px-4 py-2 font-semibold text-black shadow-lg shadow-white/10 transition hover:bg-neutral-200"
            >
              Shop HeliosX
            </Link>
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium text-white backdrop-blur hover:bg-white/20">
              Talk to us
            </button>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} HeliosX. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="hover:text-neutral-200">Privacy</button>
            <button className="hover:text-neutral-200">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
