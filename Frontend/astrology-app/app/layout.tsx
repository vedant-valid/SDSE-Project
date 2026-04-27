import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Deepa's Vision — Free Vedic Kundali & Astrology Online | ज्योतिष",
  description:
    'Generate your free Vedic birth chart (Kundali) online. Get Dosha reports, Vimshottari Dasha, and personalized remedies — rooted in authentic Indian astrology.',
  keywords: [
    'vedic astrology',
    'free kundali',
    'kundali online',
    'jyotish',
    'birth chart',
    'dosha report',
    'Indian astrology',
  ],
  openGraph: {
    title: "Deepa's Vision — Free Vedic Kundali & Astrology Online",
    description:
      'Generate your free Vedic birth chart (Kundali) online. Ancient wisdom, modern clarity.',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: "Deepa's Vision",
  description:
    'Vedic astrology consultations, Kundali generation, and personalized remedies.',
  provider: {
    '@type': 'Person',
    name: 'Deepa',
  },
  areaServed: 'Worldwide',
  availableLanguage: ['English', 'Hindi'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-void">{children}</body>
    </html>
  )
}
