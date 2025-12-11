'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'

type Article = {
  id: string
  title: string
  journal: string
  year: string
  topic: string
  level: 'Resident' | 'Microsurgery' | 'Reconstructive' | 'Oculoplastic' | 'Diagnostics'
  summary: string
  bullets: string[]
  pubmedUrl: string
}

const articles: Article[] = [
  {
    id: '17060732',
    title: 'High magnification assessment improves complete resection of facial tumors',
    journal: 'Ann Plast Surg',
    year: '2006',
    topic: 'Oncologic facial surgery',
    level: 'Reconstructive',
    summary:
      'Randomized trial showing that using 7x high-magnification loupes for pre-op tumor mapping improves first-pass margin clearance in facial BCC.',
    bullets: [
      'Compared high-magnification loupe mapping vs standard assessment for facial basal cell carcinoma.',
      'High magnification group achieved a significantly lower rate of positive margins on initial resection.',
      'Supports using loupe-level visualization as a low-tech way to upgrade oncologic accuracy without larger resections.',
    ],
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/17060732/',
  },
  {
    id: '35093292',
    title:
      'Appropriate loupe magnification for lymphatic vessel dissection during a line production system for multiple lymphaticovenular anastomoses',
    journal: 'J Plast Reconstr Aesthet Surg',
    year: '2022',
    topic: 'Supermicrosurgery / lymphedema',
    level: 'Microsurgery',
    summary:
      'Letter from a high-volume lymphedema center discussing optimal loupe magnification choices for lymphaticovenular anastomosis in a "line-production" workflow.',
    bullets: [
      'Focuses on choosing magnification for lymphatic vessel dissection in high-throughput LVAs.',
      'Highlights how magnification impacts efficiency and ergonomics in supermicrosurgical workflows.',
      'Reinforces that "right" magnification is case- and team-dependent, not one-size-fits-all.',
    ],
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/35093292/',
  },
  {
    id: '34137223',
    title: 'Application of medical magnifying loupes in diagnosis of oral mucosal diseases',
    journal: 'Zhejiang Da Xue Xue Bao Yi Xue Ban',
    year: '2021',
    topic: 'Oral medicine / diagnostics',
    level: 'Diagnostics',
    summary:
      'Prospective study showing that magnifying loupes improve sensitivity, specificity, and diagnostic accuracy for oral lichen planus and leukoplakia compared with naked-eye inspection.',
    bullets: [
      'Loupe-assisted inspection outperformed naked eye for identifying plaque-type oral lichen planus and homogeneous leukoplakia.',
      'Physicians rated loupe use as improving efficiency and lesion boundary visualization.',
      'Recommended clinical setup was ~3.5x magnification at an appropriate working distance.',
    ],
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/34137223/',
  },
  {
    id: '23722578',
    title: 'The dorsal metatarsal artery perforator flap',
    journal: 'Ann Plast Surg',
    year: '2013',
    topic: 'Lower extremity reconstruction',
    level: 'Reconstructive',
    summary:
      'Cadaveric and clinical work describing second- to fourth-dorsal metatarsal artery perforators for distal foot and web-space reconstruction under loupe magnification.',
    bullets: [
      'Dissected 16 cadaveric feet under loupe magnification to map dorsal metatarsal artery perforators.',
      'Found 2–5 cutaneous perforators per artery with a reliable distal perforator between metatarsal heads.',
      'Presented a clinical perforator-based flap for distal foot resurfacing mirroring hand flap concepts.',
    ],
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/23722578/',
  },
  {
    id: '11743419',
    title:
      'Upper blepharoplasty with bony anatomical landmarks to avoid injury to trochlea and superior oblique muscle tendon with fat resection',
    journal: 'Plast Reconstr Surg',
    year: '2001',
    topic: 'Oculoplastic / anatomy',
    level: 'Oculoplastic',
    summary:
      'Cadaveric study defining bony landmarks and vectors for the trochlea and superior oblique tendon to make upper blepharoplasty safer during medial/central fat resection.',
    bullets: [
      'Used 4x loupe magnification to map the relationship between trochlea, superior oblique tendon, and stable bony landmarks.',
      'Provides reproducible distances from the superior orbital foramen and frontozygomatic suture to avoid injuring key structures.',
      'Translates directly into safer upper lid fat handling in everyday blepharoplasty.',
    ],
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/11743419/',
  },
  {
    id: '17396708',
    title: 'A clinician\'s guide to purchasing surgical loupes',
    journal: 'Tex Dent J',
    year: '2007',
    topic: 'Ergonomics / Equipment selection',
    level: 'Resident',
    summary:
      'Comprehensive guide discussing key features to consider when purchasing surgical loupes, emphasizing proper fitting, adjustment, and the advantages of compound and prism telescopic loupes over simple diopter lenses.',
    bullets: [
      'Discusses enhanced vision of fine detail and critical ergonomic advantages of loupes.',
      'Emphasizes proper fitting and adjustment as essential elements for successful loupe use.',
      'Compares compound and prism telescopic loupes to simple diopter lenses, highlighting superior benefits despite higher cost.',
      'Covers key features including magnification, working distance, field of view, and lighting considerations.',
    ],
    pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/17396708/',
  },
]

export default function EducationPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-black text-neutral-100">
        {/* HERO / INTRO */}
        <section className="relative overflow-hidden border-b border-neutral-800">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_60%)] opacity-60" />

          <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-20">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-300/80">
                Education
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Evidence for better vision in the OR.
              </h1>
              <p className="text-sm text-neutral-300 sm:text-base">
                HeliosX isn&apos;t just hardware. It&apos;s part of a long story of surgeons using
                magnification to cut cleaner, see earlier, and operate safer. This page collects
                peer-reviewed work that shaped how we think about loupes and surgical vision.
              </p>
            </div>

            <div className="mt-4 flex flex-col items-start gap-3 text-xs text-neutral-300 sm:flex-row sm:text-sm">
              <div className="rounded-full border border-neutral-700/80 bg-neutral-900/60 px-4 py-2 backdrop-blur">
                Curated for{' '}
                <span className="font-medium text-sky-300">
                  students, residents, and practicing surgeons
                </span>
                .
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED ARTICLE */}
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-18">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-orange-400/80">
                Featured Research
              </p>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Latest Evidence on Prismatic Loupes
              </h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-12"
          >
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/40 via-neutral-900/90 to-neutral-950/90 p-6 shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(255,157,0,0.3)] sm:p-8 lg:p-10">
              {/* Enhanced glow effect on hover */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,157,0,0.15),_transparent_60%)] transition-opacity duration-300 group-hover:bg-[radial-gradient(circle_at_top_right,_rgba(255,157,0,0.35),_transparent_50%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,157,0,0),_rgba(255,157,0,0.1))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Featured badge */}
              <div className="relative mb-4 flex items-center gap-3">
                <span className="rounded-full border border-orange-400/50 bg-orange-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                  Featured Study
                </span>
                <span className="text-sm text-neutral-400">2024</span>
              </div>

              {/* Title */}
              <h3 className="relative mb-3 text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                Ergonomics and performance of using prismatic loupes in simulated surgical tasks among surgeons
              </h3>

              {/* Journal / Authors */}
              <p className="relative mb-4 text-sm uppercase tracking-[0.15em] text-orange-300/80 sm:text-base">
                Frontiers in Public Health • Randomized Controlled Trial
              </p>

              {/* Summary */}
              <p className="relative mb-5 text-base leading-relaxed text-neutral-200 sm:text-lg">
                A randomized controlled, cross-over trial examining the impact of prismatic loupes on surgeons&apos; physical workload, musculoskeletal discomfort, and performance during simulated surgical tasks. This study provides critical evidence for ergonomic benefits of prismatic loupe technology.
              </p>

              {/* Key Findings */}
              <div className="relative mb-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-orange-300/90">
                  Key Findings
                </h4>
                <ul className="space-y-2.5 text-sm leading-relaxed text-neutral-200 sm:text-base">
                  <li className="flex gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 flex-none rounded-full bg-orange-400" />
                    <span><strong className="text-orange-300">Reduced head inclinations:</strong> Prismatic loupes (both low-tilt and high-tilt) significantly reduced head inclinations compared to traditional loupes (p &lt; 0.001)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 flex-none rounded-full bg-orange-400" />
                    <span><strong className="text-orange-300">Lower neck muscle activity:</strong> Significant reduction in cervical erector spinae and upper trapezius muscle activity (p &lt; 0.05)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 flex-none rounded-full bg-orange-400" />
                    <span><strong className="text-orange-300">Reduced neck discomfort:</strong> Lower reported neck discomfort with no significant difference in surgical errors (p = 0.628)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 inline-block h-2 w-2 flex-none rounded-full bg-orange-400" />
                    <span><strong className="text-orange-300">Surgeon preference:</strong> Most surgeons (N = 12) preferred low-tilt prismatic loupes for comfort and visual functions</span>
                  </li>
                </ul>
              </div>

              {/* Authors */}
              <div className="relative mb-6 text-xs text-neutral-400 sm:text-sm">
                <p className="font-medium text-neutral-300">Authors:</p>
                <p className="mt-1">Xuelong Fan, Liyun Yang, Nathalie Young, Ilayda Kaner, Magnus Kjellman, Mikael Forsman</p>
              </div>

              {/* Footer */}
              <div className="relative mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2 text-sm text-neutral-400">
                  <span className="rounded-full border border-neutral-700/70 bg-neutral-900/50 px-3 py-1.5">
                    PMC: PMC10803506
                  </span>
                  <span className="rounded-full border border-neutral-700/70 bg-neutral-900/50 px-3 py-1.5">
                    PMID: 38264242
                  </span>
                </div>

                <Link
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10803506/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-400/60 bg-orange-500/20 px-5 py-2.5 text-sm font-semibold text-orange-200 transition-all hover:border-orange-300 hover:bg-orange-500/30 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  Read Full Article
                  <span aria-hidden className="translate-y-[0.5px] text-base">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ARTICLE GRID */}
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Loupe-driven papers to start with
              </h2>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <CardContainer className="inter-var h-full">
                  <CardBody className="bg-gray-50/5 relative group/card flex h-full flex-col rounded-2xl border border-neutral-800/80 p-5 shadow-lg backdrop-blur-sm dark:bg-black">
                    {/* Level + year row */}
                    <div className="mb-3 flex items-center justify-between gap-2 text-[0.65rem] sm:text-[0.7rem]">
                      <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 font-medium uppercase tracking-[0.18em] text-sky-300">
                        {article.level}
                      </span>
                      <span className="text-neutral-500">{article.year}</span>
                    </div>

                    {/* Title */}
                    <CardItem
                      translateZ="50"
                      className="text-sm font-semibold text-white sm:text-[0.95rem]"
                    >
                      {article.title}
                    </CardItem>

                    {/* Journal / topic */}
                    <CardItem
                      as="p"
                      translateZ="55"
                      className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-neutral-500"
                    >
                      {article.journal} • {article.topic}
                    </CardItem>

                    {/* Summary */}
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="mt-3 text-xs leading-relaxed text-neutral-300"
                    >
                      {article.summary}
                    </CardItem>

                    {/* Bullets */}
                    <CardItem translateZ="80" className="mt-3">
                      <ul className="space-y-1.5 text-xs text-neutral-300/90">
                        {article.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-0.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-sky-400/80" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </CardItem>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <CardItem
                        translateZ={20}
                        as="div"
                        className="flex flex-wrap gap-2 text-[0.7rem] text-neutral-400"
                      >
                        <span className="rounded-full border border-neutral-700/70 px-2.5 py-1">
                          PMID: {article.id}
                        </span>
                      </CardItem>

                      <CardItem
                        translateZ={20}
                        as={Link}
                        href={article.pubmedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-sky-400/60 bg-sky-500/10 px-3 py-1.5 text-[0.7rem] font-medium text-sky-200 transition group-hover/card:border-sky-300 group-hover/card:bg-sky-500/15"
                      >
                        View on PubMed
                        <span aria-hidden className="translate-y-[0.5px] text-[0.9em]">
                          ↗
                        </span>
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA / FOOTER STRIP */}
        <section className="border-t border-neutral-800 bg-neutral-950/70">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="max-w-xl space-y-1.5">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                For trainees & lifelong learners
              </p>
              <h3 className="text-sm font-semibold text-white sm:text-base">
                Building a small library of loupe-driven surgery.
              </h3>
              <p className="text-xs text-neutral-400 sm:text-[0.8rem]">
                As we grow HeliosX, we&apos;ll keep expanding this section with technique papers,
                ergonomics data, and practical anatomy - so optics and access evolve together.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-full border border-neutral-700/80 bg-black px-3 py-1.5 text-neutral-300">
                Want us to feature your paper?
              </span>
              <span className="text-neutral-500">Drop us a line from the contact page.</span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

