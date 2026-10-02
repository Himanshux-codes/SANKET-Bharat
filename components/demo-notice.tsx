'use client'

import { useLanguage } from '@/lib/i18n/i18n-context'

export function DemoNotice() {
  const { lang } = useLanguage()
  return <aside aria-label="Demo limitations" className="relative z-20 mx-5 mt-24 rounded-xl border border-warning/30 bg-card/90 px-4 py-3 text-xs leading-5 text-foreground sm:mx-8">
    {lang === 'hi' ? <><strong>केवल डेमो — काल्पनिक जानकारी भरें।</strong> रिपोर्ट और समीक्षा इस ब्राउज़र के उदाहरण हैं। किसी प्राधिकरण को रिपोर्ट, संदेश या टीम का अनुरोध नहीं भेजा जाता। पायलट मोड उपलब्ध नहीं है। वास्तविक आपातकाल के लिए स्थापित सेवाओं का उपयोग करें।</> : <><strong>DEMO ONLY — use synthetic details.</strong> Reports and decisions are local browser examples. No authority receives a report, message or assignment. Pilot mode is unavailable. Use established services for real emergencies.</>}
  </aside>
}
