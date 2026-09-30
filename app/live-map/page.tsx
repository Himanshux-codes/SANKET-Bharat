import type { Metadata } from 'next'
import { LiveMap } from '@/components/sections/live-map'

export const metadata: Metadata = {
  title: 'Live Disaster Map',
  description:
    'National incident map for India on one canvas — citizen reports, satellite telemetry and field confirmations resolved to true coordinates, filterable by severity and hazard type.',
}

/**
 * Dedicated home for the full national incident map, moved off the landing
 * page. The section component is reused unchanged so the map, markers,
 * filters, legend, detail panel and AI advisory feed all behave identically.
 */
export default function LiveMapPage() {
  return (
    <div className="pt-20 sm:pt-24">
      <LiveMap />
    </div>
  )
}
