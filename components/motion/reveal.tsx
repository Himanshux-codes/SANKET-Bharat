'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
}

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export function Reveal({
  children,
  delay = 0,
  direction = 'up',
  scale = 0.985,
  duration = 0.8,
  className,
  as = 'div',
  amount = 0.3,
}: {
  children: ReactNode
  delay?: number
  direction?: Direction
  scale?: number
  duration?: number
  className?: string
  as?: ElementType
  amount?: number
}) {
  const reduce = useReducedMotion()
  const { x, y } = OFFSET[direction]
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  if (reduce) {
    const Tag = as as ElementType<{ className?: string; children?: ReactNode }>
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, x, y, scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </MotionTag>
  )
}

/** Parent that staggers direct `RevealItem` children into view. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  amount?: number
  as?: ElementType
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className,
  direction = 'up',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  as?: ElementType
}) {
  const reduce = useReducedMotion()
  const { x, y } = OFFSET[direction]
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div

  const variants: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, x, y, scale: 0.97 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, ease: EASE_OUT_EXPO },
    },
  }

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  )
}
