import { DemoNotice } from '@/components/demo-notice'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Footer } from '@/components/footer'
import { AmbientBackground } from '@/components/motion/ambient-background'
import { CursorGlow } from '@/components/motion/cursor-glow'
import { Preloader } from '@/components/motion/preloader'
import { Navbar } from '@/components/navbar'
import { IncidentProvider } from '@/lib/incident-context'
import { LanguageProvider } from '@/lib/i18n/i18n-context'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const SITE_NAME = 'SANKET Bharat'
const SITE_DESCRIPTION =
  'SANKET Bharat is a browser-only crisis review demo using synthetic scenarios, local input and template suggestions. No live feeds, authority receipt, AI model service, assignment or dispatch is implemented.'

export const metadata: Metadata = {
  title: {
    default: 'SANKET Bharat — AI-Assisted Crisis Intelligence & Response Platform',
    template: '%s | SANKET Bharat',
  },
  description: SITE_DESCRIPTION,
  generator: 'v0.app',
  applicationName: SITE_NAME,
  keywords: [
    'disaster response',
    'crisis management',
    'AI emergency detection',
    'flood alerts India',
    'earthquake early warning',
    'rescue coordination',
    'severity prediction',
    'shelter recommendation',
    'SANKET Bharat',
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'SANKET Bharat — AI-Assisted Crisis Intelligence & Response Platform',
    description: SITE_DESCRIPTION,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SANKET Bharat — AI-Assisted Crisis Intelligence & Response Platform',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050816',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <IncidentProvider>
          <LanguageProvider>
            {/* Persistent shell: chrome mounts once and survives route changes */}
            <Preloader />
            <AmbientBackground />
            <CursorGlow />
            <Navbar />
            <DemoNotice />
            <main className="relative z-10">{children}</main>
            <Footer />
          </LanguageProvider>
        </IncidentProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
