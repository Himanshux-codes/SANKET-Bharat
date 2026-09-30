'use client'

import { Reveal } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FAQS } from '@/lib/site-data'
import { useLanguage } from '@/lib/i18n/i18n-context'

export function Faq() {
  const { t } = useLanguage()
  return (
    <Section id="faq" label="Frequently asked questions">
      <SectionHeader
        eyebrow={t.faq.eyebrow}
        title={
          <>
            {t.faq.titlePart1}{' '}
            <span className="text-gradient">{t.faq.titleGradient}</span>
          </>
        }
        description={t.faq.description}
      />

      <Reveal className="mt-14" delay={0.06}>
        <div className="glass mx-auto max-w-3xl rounded-3xl px-5 py-2 sm:px-8 sm:py-4">
          <Accordion multiple={false} defaultValue={[FAQS[0].question]}>
            {FAQS.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-border not-last:border-b"
              >
                <AccordionTrigger className="gap-6 py-5 text-[0.95rem] font-medium tracking-[-0.01em] text-foreground no-underline hover:no-underline hover:text-accent **:data-[slot=accordion-trigger-icon]:mt-0.5 **:data-[slot=accordion-trigger-icon]:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pr-8 pb-6 text-pretty leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </Section>
  )
}
