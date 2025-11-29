import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HeliosX - Premium Surgical Loupes at Fair Prices',
  description: 'Empowering residents, doctors, and medical students with premium optics at fair prices. Built by a plastic surgery resident tired of predatory pricing.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`lenis lenis-smooth ${playfairDisplay.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}

