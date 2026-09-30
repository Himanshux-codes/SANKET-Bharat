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
 *
 * Below-fold sections use content-visibility: auto to defer their paint
 * cost until they are near the viewport. contain-intrinsic-size prevents
 * layout shifts by reserving approximate placeholder height.
 */
export default function Page() {
  return (
    <>
      {/* Hero is above the fold — render immediately */}
      <Hero />

      {/* Below-fold: lazily rendered to reduce initial paint cost */}
      <div className="section-lazy">
        <Features />
      </div>
      <div className="section-lazy">
        <HowItWorks />
      </div>
      <div className="section-lazy-tall">
        <DashboardPreview />
      </div>
      <div className="section-lazy">
        <Statistics />
      </div>
      <div className="section-lazy">
        <About />
      </div>
      <div className="section-lazy">
        <Faq />
      </div>
    </>
  )
}
