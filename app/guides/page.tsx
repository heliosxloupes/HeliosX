import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Guides - HeliosX',
  description: 'Helpful guides for choosing and using HeliosX surgical loupes.',
}

export default function GuidesPage() {
  return (
    <>
      <Header />
      <main className="pt-[var(--header-height)] min-h-screen">
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-semibold text-text-primary mb-8">
              Guides
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl">
              Helpful guides coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}











