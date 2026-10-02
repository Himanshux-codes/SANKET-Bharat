'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/section'
import { ICONS } from '@/lib/icons'
import { WORKFLOW } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

function Step({
  item,
  index,
}: {
  item: (typeof WORKFLOW)[number]
  index: number
}) {
  const Icon = ICONS[item.icon] ?? ICONS.Radar
  const isEven = index % 2 === 0
  const { t } = useLanguage()
  const stageLabel = t.pipeline.stageLabels[item.stageLabel as string] ?? item.stageLabel

  return (
    <div className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8">
      {/* Left column card (even steps on desktop) */}
      <div className={isEven ? 'md:col-start-1' : 'md:col-start-3 md:row-start-1'}>
        <Reveal direction={isEven ? 'left' : 'right'} amount={0.35}>
          <div
            className={[
              'glass glass-hover group relative overflow-hidden rounded-3xl p-6 sm:p-7',
              'ml-16 md:ml-0',
              isEven ? 'md:text-right' : '',
            ].join(' ')}
          >
            <div
              className={[
                'flex items-center gap-3',
                isEven ? 'md:flex-row-reverse' : '',
              ].join(' ')}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white/[0.05] text-accent transition-colors duration-500 group-hover:border-accent/45 group-hover:bg-accent/10">
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
              </span>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                {item.title}
              </h3>
            </div>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            <span
              aria-hidden
              className="absolute inset-x-6 bottom-0 h-px scale-x-0 bg-[linear-gradient(90deg,transparent,var(--accent),transparent)] transition-transform duration-700 ease-out group-hover:scale-x-100"
            />
          </div>
        </Reveal>
      </div>

      {/* Center node */}
      <div className="absolute top-6 left-0 md:relative md:top-auto md:left-auto md:col-start-2 md:row-start-1">
        <Reveal direction="none" amount={0.5}>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-accent/35 bg-background">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-accent/20 blur-md"
            />
            <span className="relative font-mono text-xs font-semibold tracking-[0.06em] text-accent">
              {item.step}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Opposite column: stage label */}
      <div
        className={[
          'mt-2 ml-16 md:mt-0 md:ml-0',
          isEven ? 'md:col-start-3' : 'md:col-start-1 md:row-start-1 md:text-right',
        ].join(' ')}
      >
        <Reveal direction="none" delay={0.12} amount={0.5}>
          <span className="font-mono text-[0.65rem] tracking-[0.18em] text-accent/80 uppercase">
            {stageLabel}
          </span>
        </Reveal>
      </div>
    </div>
  )
}

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { t } = useLanguage()

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 70%', 'end 60%'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28 })
  const lineScale = useTransform(progress, [0, 1], [0, 1])

  return (
    <Section id="how-it-works" label="How the platform works">
      <SectionHeader
        eyebrow={t.pipeline.eyebrow}
        title={
          <>
            {t.pipeline.titlePart1}{' '}
            <span className="text-gradient">{t.pipeline.titleGradient}</span>
            {' '}{t.pipeline.titlePart2}
          </>
        }
        description={t.pipeline.description}
      />

      <div ref={trackRef} className="relative mt-16 md:mt-24">
        {/* Rail */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-6 w-px -translate-x-1/2 bg-border md:left-1/2"
        >
          <motion.div
            className="h-full w-full origin-top bg-[linear-gradient(to_bottom,var(--accent),var(--primary))]"
            style={reduce ? { scaleY: 1 } : { scaleY: lineScale }}
          />
        </div>

        <div className="flex flex-col gap-14 md:gap-20">
          {WORKFLOW.map((item, index) => (
            <Step key={item.step} item={item} index={index} />
          ))}
        </div>
      </div>
    </Section>
  )
}
