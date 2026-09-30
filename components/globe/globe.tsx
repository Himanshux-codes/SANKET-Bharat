'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef, useState } from 'react'
import { usePerformanceTier } from '@/hooks/use-performance-tier'

const GlobeScene = dynamic(() => import('@/components/globe/globe-scene'), {
  ssr: false,
  loading: () => null,
})

/** Static stand-in shown before WebGL mounts and if WebGL is unavailable. */
function GlobeFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-square w-[68%] max-w-[34rem]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,#123a6b,#050c1e_68%)] shadow-[inset_0_0_80px_-20px_#22d3ee]" />
        <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,transparent_58%,color-mix(in_oklab,var(--accent)_18%,transparent)_72%,transparent_80%)] blur-xl" />
      </div>
    </div>
  )
}

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [supported, setSupported] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const quality = usePerformanceTier()

  useEffect(() => {
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
  }, [])

  // Only mount the WebGL scene while the hero is on screen.
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Pause rendering when page/tab is hidden (saves battery + CPU)
  useEffect(() => {
    const handleVisibility = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const shouldRender = supported && visible && pageVisible

  return (
    <div ref={containerRef} className="absolute inset-0">
      {shouldRender ? (
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
