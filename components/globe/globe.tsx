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
 * Desktop Suspense / pre-mount visual placeholder.
 * Visually matches the 3D globe: deep-space sphere with cyan-blue rim atmosphere.
 */
function GlobeFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-square w-[75%] max-w-[38rem]">
        {/* Outer starfield haze */}
        <div
          className="absolute -inset-16 rounded-full opacity-40"
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

/**
 * Redesigned lightweight mobile hero visual:
 * - Sits in the lower viewport to support hero text rather than competing with it
 * - Subtle planetary horizon curve with atmospheric glow and cyber coordinate arcs
 * - Zero WebGL, zero canvas, zero continuous animation loop
 */
function MobileHeroVisual() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft atmospheric gradient centered in lower half */}
      <div
        className="absolute inset-x-0 bottom-[-15%] h-[75%] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 90%, color-mix(in oklab, var(--primary) 20%, transparent) 0%, color-mix(in oklab, #071333 25%, transparent) 45%, transparent 75%)',
        }}
      />

      {/* Cyber radar / planetary horizon arc graphic anchored at bottom */}
      <div className="absolute inset-x-0 bottom-[-4%] flex justify-center opacity-65">
        <svg
          viewBox="0 0 600 340"
          className="h-auto w-[145%] max-w-[36rem] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="mobile-horizon-glow" cx="50%" cy="100%" r="70%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
              <stop offset="45%" stopColor="#3b6cff" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#3b6cff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="arc-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b6cff" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b6cff" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="arc-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8fb0ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#8fb0ff" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#8fb0ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Planetary horizon fill */}
          <ellipse cx="300" cy="380" rx="270" ry="220" fill="url(#mobile-horizon-glow)" />

          {/* Concentric planetary latitude rings */}
          <ellipse cx="300" cy="380" rx="280" ry="230" stroke="url(#arc-gradient-1)" strokeWidth="1.2" />
          <ellipse cx="300" cy="380" rx="235" ry="190" stroke="url(#arc-gradient-2)" strokeWidth="0.8" strokeDasharray="4 6" />
          <ellipse cx="300" cy="380" rx="190" ry="150" stroke="url(#arc-gradient-2)" strokeWidth="0.7" />
          <ellipse cx="300" cy="380" rx="145" ry="110" stroke="url(#arc-gradient-2)" strokeWidth="0.6" strokeDasharray="2 5" />

          {/* Latitude cross radial rays */}
          <line x1="300" y1="150" x2="300" y2="380" stroke="url(#arc-gradient-2)" strokeWidth="0.7" strokeDasharray="3 4" />
          <line x1="160" y1="200" x2="440" y2="200" stroke="url(#arc-gradient-2)" strokeWidth="0.6" strokeDasharray="2 4" />
          <line x1="190" y1="230" x2="410" y2="230" stroke="url(#arc-gradient-2)" strokeWidth="0.6" />

          {/* Static glowing incident coordinate dots */}
          <circle cx="270" cy="180" r="3" fill="#ff4d5e" />
          <circle cx="270" cy="180" r="8" fill="#ff4d5e" fillOpacity="0.2" />

          <circle cx="345" cy="205" r="3" fill="#22d3ee" />
          <circle cx="345" cy="205" r="7" fill="#22d3ee" fillOpacity="0.25" />

          <circle cx="230" cy="245" r="2.5" fill="#3b6cff" />
          <circle cx="230" cy="245" r="6" fill="#3b6cff" fillOpacity="0.2" />

          <circle cx="380" cy="235" r="2.5" fill="#ffab40" />
          <circle cx="380" cy="235" r="6" fill="#ffab40" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Subtle horizon baseline glow */}
      <div
        className="absolute inset-x-6 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, color-mix(in oklab, #22d3ee 30%, transparent) 50%, transparent 95%)',
        }}
      />
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Browser-only WebGL capability determines the existing static fallback.
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

  // On mobile: always show the tailored lightweight mobile hero visual
  if (isMobile) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <MobileHeroVisual />
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
