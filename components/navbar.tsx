'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, Radar, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { GlowLink } from '@/components/ui/glow-button'
import { LanguageSelector } from '@/components/language-selector'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

// Map site-data href to translation key
const NAV_KEY_MAP: Record<string, keyof typeof import('@/lib/i18n/translations').translations.en.nav> = {
  '/': 'home',
  '/live-map': 'liveMap',
  '/dashboard': 'dashboard',
  '/ai-analysis': 'aiAnalysis',
  '/admin': 'admin',
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const { t } = useLanguage()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)
  const isAdmin = pathname === '/admin'

  function navLabel(href: string, fallback: string): string {
    const key = NAV_KEY_MAP[href]
    return key ? (t.nav[key] as string) : fallback
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.9 }}
        className={cn(
          'inset-x-0 top-0 z-50 px-3.5 pt-3 sm:px-6 sm:pt-4',
          isAdmin ? 'relative' : 'fixed',
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-full px-3.5 py-2 transition-all duration-500 sm:gap-4 sm:px-5 sm:py-2.5',
            scrolled
              ? 'glass shadow-[0_20px_60px_-40px_#000]'
              : 'border border-transparent bg-transparent',
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 rounded-full pr-1 sm:gap-2.5 sm:pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(140deg,var(--primary),var(--accent))] shadow-[0_0_24px_-6px_var(--primary)] transition-transform duration-500 group-hover:scale-105 sm:h-9 sm:w-9">
              <Radar className="h-4 w-4 text-primary-foreground sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
            </span>
            <span className="text-[0.88rem] font-semibold tracking-[-0.02em] sm:text-[0.98rem]">
              SANKET <span className="text-accent">Bharat</span>
            </span>
          </Link>

          {/* Desktop links with sliding hover pill */}
          <ul
            className="hidden items-center gap-0.5 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, link.exact)

              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    className={cn(
                      'relative z-10 block rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                      active ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {navLabel(link.href, link.label)}
                  </Link>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-4 -bottom-0.5 h-px bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]"
                    />
                  )}
                  {hovered === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-accent/25 bg-white/[0.06]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            {/* Language selector — desktop */}
            <LanguageSelector className="hidden sm:flex" />

            <GlowLink href="/report" size="sm" variant="danger" className="hidden sm:inline-flex">
              {t.nav.reportEmergency}
            </GlowLink>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/[0.04] text-foreground transition-colors duration-300 hover:border-accent/45 sm:h-9 sm:w-9 lg:hidden"
            >
              <Menu className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="glass absolute inset-y-3 right-3 flex w-[min(20rem,86vw)] flex-col gap-6 rounded-3xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent uppercase">
                  {t.nav.navigate}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent/45"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index + 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href, link.exact) ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors duration-300 hover:bg-white/[0.05] hover:text-foreground',
                        isActive(link.href, link.exact)
                          ? 'bg-white/[0.05] text-foreground'
                          : 'text-foreground/90',
                      )}
                    >
                      {navLabel(link.href, link.label)}
                      <span
                        className={cn(
                          'h-1 w-1 rounded-full',
                          isActive(link.href, link.exact) ? 'bg-accent' : 'bg-accent/60',
                        )}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3">
                {/* Language selector — mobile drawer */}
                <div className="flex items-center justify-between rounded-2xl border border-border/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{t.langSelector.label}</span>
                  <LanguageSelector compact />
                </div>

                <GlowLink href="/report" variant="danger" onClick={() => setOpen(false)}>
                  {t.nav.reportEmergency}
                </GlowLink>
                <GlowLink href="/live-map" variant="ghost" onClick={() => setOpen(false)}>
                  {t.nav.openLiveMap}
                </GlowLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
