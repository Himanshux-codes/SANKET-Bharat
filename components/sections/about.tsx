'use client'

import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Eyebrow, Section } from '@/components/section'
import { getIcon } from '@/lib/icons'
import { ABOUT } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

function Pillar({ pillar }: { pillar: (typeof ABOUT.pillars)[number] }) {
  const Icon = getIcon(pillar.icon)

  return (
    <div className="glass glass-hover group flex h-full flex-col gap-3.5 rounded-3xl p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white/[0.04] text-accent transition-colors duration-500 group-hover:border-accent/40">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <h3 className="text-base font-semibold tracking-[-0.015em] text-foreground">
        {pillar.title}
      </h3>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {pillar.description}
      </p>
    </div>
  )
}

export function About() {
  const { t } = useLanguage()
  return (
    <Section id="about" label="About SANKET Bharat">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Narrative */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Reveal direction="none">
            <Eyebrow>{t.about.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-[3rem] md:leading-[1.06]">
              {t.about.titlePart1}{' '}
              <span className="text-gradient">{t.about.titleGradient}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-pretty leading-relaxed text-foreground/85 md:text-lg">
              {ABOUT.mission}
            </p>
          </Reveal>

          <div className="flex flex-col gap-4">
            {ABOUT.body.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={0.18 + index * 0.06}>
                <p className="text-pretty leading-relaxed text-muted-foreground">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Operating principles */}
        <RevealGroup
          className="grid gap-4 sm:grid-cols-2 lg:col-span-7"
          stagger={0.07}
        >
          {ABOUT.pillars.map((pillar) => (
            <RevealItem key={pillar.title} className="h-full">
              <Pillar pillar={pillar} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  )
}
