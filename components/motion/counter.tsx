'use client'

import {
  animate,
  useInView,
  useReducedMotion,
  type AnimationPlaybackControls,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function format(value: number, decimals: number) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 */
export function Counter({
  value,
  decimals = 0,
  duration = 2,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(() => format(0, decimals))

  useEffect(() => {
    if (!inView || reduce) return

    const controls: AnimationPlaybackControls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(format(latest, decimals)),
    })

    return () => controls.stop()
  }, [inView, value, decimals, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {reduce && inView ? format(value, decimals) : display}
      {suffix}
    </span>
  )
}
