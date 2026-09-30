'use client'

import { Radar } from 'lucide-react'
import Link from 'next/link'
import { GlowLink } from '@/components/ui/glow-button'
import { FOOTER_SECTIONS, HOME_SECTIONS } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer
      aria-label="Site footer"
      className="relative z-10 mt-8 border-t border-border px-5 pt-16 pb-10 sm:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + emergency CTA */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Link
              href="/"
              className="group flex w-fit items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(140deg,var(--primary),var(--accent))] shadow-[0_0_24px_-6px_var(--primary)] transition-transform duration-500 group-hover:scale-105">
                <Radar className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2.2} />
              </span>
              <span className="text-[0.98rem] font-semibold tracking-[-0.02em]">
                SANKET <span className="text-accent">Bharat</span>
              </span>
            </Link>

            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>

            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="font-mono text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase">
                {t.footer.prototypeBadge}
              </span>
            </div>

            <GlowLink href="/report" variant="danger" size="sm" className="w-fit">
              {t.footer.reportEmergency}
            </GlowLink>

            {/* Multilingual note */}
            <p className="text-[0.68rem] leading-relaxed text-muted-foreground/70">
              {t.footer.langNote}
            </p>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer navigation"
            className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4"
          >
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col gap-3.5">
                <h2 className="font-mono text-[0.66rem] tracking-[0.18em] text-accent uppercase">
                  {section.title}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="group inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                      >
                        <span
                          aria-hidden
                          className="h-px w-0 bg-accent transition-all duration-500 group-hover:w-3"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Baseline */}
        <div className="flex flex-col gap-5 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {t.footer.copyright.replace('{year}', String(year))}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {HOME_SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="text-xs text-muted-foreground transition-colors duration-300 hover:text-accent"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
