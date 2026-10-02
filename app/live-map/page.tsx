import type { Metadata } from 'next'
import { LiveMap } from '@/components/sections/live-map'

export const metadata: Metadata = {
  title: 'Demo Incident Map',
  description:
    'Static India map with demo seed coordinates. No live telemetry, geolocation or authority integration.',
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
