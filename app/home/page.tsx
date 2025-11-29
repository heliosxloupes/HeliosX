'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import LightRays from '@/components/LightRays'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: 'Premium Optics',
      description: 'Crystal-clear magnification with precision engineering. See every detail with confidence.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fair Pricing',
      description: 'No predatory markups. Premium quality at prices that respect your training and dedication.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Built to Last',
      description: 'Reliable construction that withstands daily use. Quality you can trust, day after day.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Designed for You',
      description: 'Created by a resident who understands your needs. Every detail considered for comfort and performance.',
    },
  ]

  const useCases = [
    {
      title: 'Residents',
      description: 'Start your surgical journey with tools that won\'t break the bank. Invest in your skills, not overpriced equipment.',
    },
    {
      title: 'Attending Surgeons',
      description: 'Upgrade or replace your loupes with confidence. Premium quality without the premium markup.',
    },
    {
      title: 'Medical Students',
      description: 'Get ahead with professional-grade optics. Affordable entry into precision surgical visualization.',
    },
  ]

  const testimonials = [
    {
      quote: 'Finally, loupes that don\'t cost more than my monthly rent. The quality is exceptional, and the price is fair.',
      author: 'Dr. Sarah Chen',
      role: 'Plastic Surgery Resident, Year 3',
    },
    {
      quote: 'As someone who\'s been in practice for 15 years, I appreciate the no-nonsense approach. Great product, honest pricing.',
      author: 'Dr. Michael Rodriguez',
      role: 'Attending Surgeon',
    },
    {
      quote: 'These loupes have been a game-changer for my training. Clear, comfortable, and actually affordable.',
      author: 'Alex Kim',
      role: 'Medical Student',
    },
  ]

  const faqs = [
    {
      question: 'What magnification options are available?',
      answer: 'We offer 2.5x, 3.5x, and 4.5x magnification options. Each is carefully calibrated for optimal clarity and field of view.',
    },
    {
      question: 'How do I know which magnification is right for me?',
      answer: 'Most residents start with 2.5x or 3.5x. Higher magnification provides more detail but reduces field of view. We provide detailed guidance to help you choose.',
    },
    {
      question: 'What\'s included with my order?',
      answer: 'Each order includes the loupes, a protective case, cleaning supplies, and a comprehensive fitting guide. We also offer virtual fitting consultations.',
    },
    {
      question: 'Do you offer custom prescriptions?',
      answer: 'Yes, we offer custom prescriptions to match your exact vision needs. This ensures optimal comfort and clarity during long procedures.',
    },
    {
      question: 'What\'s your return policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely happy with your loupes, we\'ll work with you to make it right or provide a full refund.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard orders ship within 3-5 business days. Custom prescriptions may take 2-3 weeks. We\'ll keep you updated throughout the process.',
    },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden w-full max-w-full relative">
      {/* Light Rays Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <LightRays raysOrigin="right" />
      </div>
      
      <div className="relative z-10">
        <Header />
      
      {/* Full-Screen Hero Section with Scroll-Based Animations */}
      <Hero />

      {/* Mission Section */}
      <section id="mission" className="px-6 lg:px-8" style={{ background: 'transparent', paddingTop: '4.2rem', paddingBottom: '4.2rem' }}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl lg:text-5xl font-semibold text-text-primary">
            Why HeliosX Exists
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed">
            As a plastic surgery resident, I watched colleagues struggle with the cost of essential tools. The surgical loupe industry has long relied on predatory pricing, taking advantage of medical professionals who have no choice but to invest in quality optics.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed">
            HeliosX changes that. We bring affordability, reliability, and excellent design to surgical loupes—empowering residents, doctors, and medical students with premium optics at fair prices. No gimmicks, no markups, just honest quality.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="product" className="py-24 px-6 lg:px-8" style={{ background: 'transparent' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
              Built for Excellence
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Every detail designed with your needs in mind. Premium quality without the premium price tag.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
              >
                <div className="text-text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 lg:px-8" style={{ background: 'transparent' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
              Designed for Every Stage
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Whether you're just starting out or have years of experience, HeliosX supports your journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  {useCase.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
              Trusted by Medical Professionals
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Real feedback from residents, students, and surgeons who chose HeliosX.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <p className="text-text-secondary leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-text-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 lg:px-8" style={{ background: 'transparent' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-semibold text-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-text-secondary">
              Everything you need to know about HeliosX loupes.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-text-primary pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6 text-text-secondary leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-semibold text-text-primary">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Join the growing community of medical professionals who chose quality and fairness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-full bg-accent-primary text-accent-secondary font-semibold hover:bg-accent-primary/90 transition-all hover:shadow-lg hover:scale-[1.02]">
              Order Your Loupes
            </button>
            <button className="px-8 py-4 rounded-full border-2 border-text-primary text-text-primary font-semibold hover:bg-text-primary hover:text-white transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </section>

            <Footer />
      </div>
    </main>
  )
}


