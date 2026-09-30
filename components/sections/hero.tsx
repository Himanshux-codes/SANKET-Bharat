'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ActivitySquare, ArrowRight, ChevronDown, Siren } from 'lucide-react'
import { useRef } from 'react'
import { Globe } from '@/components/globe/globe'
import { EASE_OUT_EXPO } from '@/components/motion/reveal'
import { GlowLink } from '@/components/ui/glow-button'
import { useLanguage } from '@/lib/i18n/i18n-context'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { t } = useLanguage()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Cinematic depth: content lifts and fades while the globe sinks slower.
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.16])

  // Headline lines are translated per-language
  const HEADLINE = [t.hero.headline1, t.hero.headline2, t.hero.headline3]

  const TRUST_SIGNALS = [
    { label: t.hero.stat_triage_label, value: t.hero.stat_triage_value },
    { label: t.hero.stat_score_label, value: '96.4%' },
    { label: t.hero.stat_langs_label, value: '22' },
    { label: t.hero.stat_lives_label, value: '2.4M+' },
  ]

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-16 sm:px-8"
    >
      {/* 3D Earth */}
      <motion.div
        className="absolute inset-0 z-0"
        style={reduce ? undefined : { scale: globeScale }}
      >
        <Globe />
      </motion.div>

      {/* Legibility scrim over the globe: tight core keeps type crisp,
          while the rim of the planet stays visible for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(58%_48%_at_50%_46%,color-mix(in_oklab,var(--background)_92%,transparent)_0%,color-mix(in_oklab,var(--background)_78%,transparent)_45%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-52 bg-[linear-gradient(to_top,var(--background),transparent)]"
      />

      <motion.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 text-center"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Live status chip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2, ease: EASE_OUT_EXPO }}
          className="glass flex items-center gap-2.5 rounded-full px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[0.7rem] tracking-[0.16em] text-foreground/80 uppercase">
            {t.hero.demoChip}
          </span>
        </motion.div>

        {/* Headline — animates in line by line */}
        <h1 className="text-balance text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {HEADLINE.map((line, index) => (
            <span key={index} className="block overflow-hidden py-[0.06em]">
              <motion.span
                className={index === 1 ? 'text-gradient block' : 'block'}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 1.1,
                  delay: 2.05 + index * 0.11,
                  ease: EASE_OUT_EXPO,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.42, ease: EASE_OUT_EXPO }}
          className="max-w-2xl text-pretty leading-relaxed text-muted-foreground sm:text-lg"
        >
          {t.hero.body}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.54, ease: EASE_OUT_EXPO }}
          className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <GlowLink href="/report" variant="danger" size="lg">
            <Siren className="h-4 w-4" />
            {t.hero.cta_report}
          </GlowLink>
          <GlowLink href="/live-map" variant="ghost" size="lg">
            <ActivitySquare className="h-4 w-4" />
            {t.hero.cta_map}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </GlowLink>
        </motion.div>

        {/* Trust signals */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.7, ease: EASE_OUT_EXPO }}
          className="mt-4 grid w-full grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-7 sm:grid-cols-4"
        >
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.label} className="flex flex-col gap-1">
              <dd className="font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {signal.value}
              </dd>
              <dt className="text-[0.72rem] tracking-[0.1em] text-muted-foreground uppercase">
                {signal.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#features"
        aria-label="Scroll to features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.24em] uppercase">{t.hero.scroll}</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  )
}
