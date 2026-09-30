'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { usePerformanceTier } from '@/hooks/use-performance-tier'

// Only imported when we actually need it — never loaded on mobile
const GlobeScene = dynamic(() => import('@/components/globe/globe-scene'), {
  ssr: false,
  loading: () => <GlobeFallback />,
})

/**
 * Static visual stand-in used on:
 * - Mobile (no WebGL loop needed)
 * - Before WebGL mounts on desktop
 * - Devices without WebGL support
 *
 * Visually matches the real globe: deep-space gradient sphere with
 * a blue-cyan rim atmosphere and a subtle starfield haze.
 */
function GlobeFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-square w-[75%] max-w-[38rem]">
        {/* Outer starfield haze */}
        <div className="absolute -inset-16 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, color-mix(in oklab, #3b6cff 8%, transparent) 0%, transparent 70%)',
          }}
        />
        {/* Main globe body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 32% 28%, #1a4a8a 0%, #0d2654 38%, #060f28 65%, #030810 100%)',
            boxShadow: 'inset -18px -12px 60px -10px rgba(0,0,0,0.7), inset 8px 6px 40px -10px rgba(59,108,255,0.35)',
          }}
        />
        {/* Wireframe latitude lines overlay */}
        <div
          className="absolute inset-0 rounded-full opacity-[0.06]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 17px, rgba(143,176,255,1) 17px, rgba(143,176,255,1) 18px),
              repeating-linear-gradient(90deg, transparent, transparent 17px, rgba(143,176,255,1) 17px, rgba(143,176,255,1) 18px)
            `,
          }}
        />
        {/* Cyan atmosphere rim — front face */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 42%, color-mix(in oklab, #22d3ee 14%, transparent) 65%, color-mix(in oklab, #3b6cff 22%, transparent) 80%, transparent 92%)',
          }}
        />
        {/* Highlight specular on upper-left */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 28% 22%, color-mix(in oklab, #ffffff 8%, transparent) 0%, transparent 42%)',
          }}
        />
        {/* Outer atmosphere halo */}
        <div
          className="absolute -inset-5 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, transparent 56%, color-mix(in oklab, #22d3ee 22%, transparent) 72%, transparent 84%)',
            filter: 'blur(8px)',
          }}
        />
        {/* Incident dots — static marker hints */}
        {[
          { top: '38%', left: '52%', color: '#ff4d5e' },  // quake
          { top: '28%', left: '46%', color: '#22d3ee' },  // cyclone
          { top: '55%', left: '44%', color: '#3b6cff' },  // flood
          { top: '44%', left: '60%', color: '#ffab40' },  // fire
        ].map((dot, i) => (
          <span
            key={i}
            className="absolute h-[5px] w-[5px] rounded-full"
            style={{
              top: dot.top,
              left: dot.left,
              background: dot.color,
              boxShadow: `0 0 6px 2px ${dot.color}99`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [supported, setSupported] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)

  const isMobile = useIsMobile()
  const quality = usePerformanceTier()

  // WebGL support check — only run on desktop
  useEffect(() => {
    if (isMobile) return
    try {
      const canvas = document.createElement('canvas')
      const ok =
        !!canvas.getContext('webgl2') ||
        !!canvas.getContext('webgl') ||
        !!canvas.getContext('experimental-webgl')
      setSupported(ok)
    } catch {
      setSupported(false)
    }
  }, [isMobile])

  // IntersectionObserver — mount/unmount WebGL based on hero visibility
  useEffect(() => {
    if (isMobile) return // static fallback on mobile; no observer needed
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [isMobile])

  // Pause WebGL render loop when tab is hidden — battery / CPU saving
  useEffect(() => {
    if (isMobile) return
    const handle = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [isMobile])

  // On mobile: always show the static fallback — no WebGL loop whatsoever
  if (isMobile) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <GlobeFallback />
      </div>
    )
  }

  // Desktop: render WebGL when visible and supported
  const shouldRenderWebGL = supported && heroVisible && pageVisible

  return (
    <div ref={containerRef} className="absolute inset-0">
      {shouldRenderWebGL ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <Suspense fallback={<GlobeFallback />}>
            <GlobeScene quality={quality} />
          </Suspense>
        </motion.div>
      ) : (
        <GlobeFallback />
      )}
    </div>
  )
}
