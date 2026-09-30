'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EASE_OUT_EXPO } from '@/components/motion/reveal'

const STAGES = [
  'Establishing secure uplink',
  'Syncing satellite telemetry',
  'Loading AI severity models',
  'Command center ready',
]

/**
 * Brief cinematic boot sequence shown once on first paint.
 */
export function Preloader() {
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calm) {
      setDone(true)
      return
    }

    document.body.style.overflow = 'hidden'

    const tick = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 16 + 6
        return next >= 100 ? 100 : next
      })
    }, 130)

    const finish = window.setTimeout(() => setDone(true), 1900)

    return () => {
      window.clearInterval(tick)
      window.clearTimeout(finish)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (done) document.body.style.overflow = ''
  }, [done])

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length))]

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background"
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <div className="aurora pointer-events-none absolute inset-0 opacity-50" />

          {/* Pulsing radar core */}
          <div className="relative flex h-28 w-28 items-center justify-center">
            {[0, 0.6, 1.2].map((delay) => (
              <span
                key={delay}
                className="absolute h-16 w-16 rounded-full border border-accent/50"
                style={{
                  animation: `pulse-ring 2.2s cubic-bezier(0.16,1,0.3,1) ${delay}s infinite`,
                }}
              />
            ))}
            <motion.div
              className="relative h-14 w-14 rounded-2xl bg-[linear-gradient(140deg,var(--primary),var(--accent))] shadow-[0_0_50px_-6px_var(--primary)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="relative flex w-64 flex-col items-center gap-3">
            <div className="h-px w-full overflow-hidden bg-border">
              <motion.div
                className="h-full bg-[linear-gradient(90deg,var(--primary),var(--accent))]"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase"
            >
              {stage}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
