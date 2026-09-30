import { About } from '@/components/sections/about'
import { DashboardPreview } from '@/components/sections/dashboard-preview'
import { Faq } from '@/components/sections/faq'
import { Features } from '@/components/sections/features'
import { Hero } from '@/components/sections/hero'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Statistics } from '@/components/sections/statistics'

/**
 * Public landing page. The full command center and national incident map are
 * separate application routes so this stays short and scannable.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Statistics />
      <About />
      <Faq />
    </>
  )
}
