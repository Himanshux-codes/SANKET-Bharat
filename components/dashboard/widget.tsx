'use client'

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Counter } from '@/components/motion/counter'
import { getIcon } from '@/lib/icons'
import type { DASHBOARD_WIDGETS } from '@/lib/site-data'

const TONE: Record<string, string> = {
  danger: 'text-danger',
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
}

const TREND_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
}

/** KPI tile shared by the homepage preview and the command center dashboard. */
export function Widget({ widget }: { widget: (typeof DASHBOARD_WIDGETS)[number] }) {
  const Icon = getIcon(widget.icon)
  const Trend = TREND_ICON[widget.trend]
  const suffix = 'suffix' in widget ? widget.suffix : ''
  const decimals = 'decimals' in widget ? widget.decimals : 0

  return (
    <div className="glass glass-hover group flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.7rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {widget.label}
        </span>
        <Icon
          className={`h-4 w-4 shrink-0 ${TONE[widget.tone]} transition-transform duration-500 group-hover:scale-110`}
          strokeWidth={1.9}
        />
      </div>

      <Counter
        value={widget.value}
        decimals={decimals}
        suffix={suffix}
        className="font-mono text-3xl font-semibold tracking-tight text-foreground"
      />

      <div className="flex items-center gap-1.5">
        <Trend
          className={`h-3.5 w-3.5 ${widget.trend === 'down' ? 'text-warning' : widget.trend === 'flat' ? 'text-muted-foreground' : 'text-success'}`}
        />
        <span className="text-xs text-muted-foreground">{widget.delta}</span>
      </div>
    </div>
  )
}

/** Glass chart container with a title and a monospaced context hint. */
export function Panel({
  title,
  hint,
  children,
  className,
}: {
  title: string
  hint: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`glass flex flex-col gap-5 rounded-3xl p-5 sm:p-6 ${className ?? ''}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold tracking-[-0.015em] text-foreground">{title}</h3>
        <span className="font-mono text-[0.65rem] font-medium tracking-[0.14em] text-slate-300 uppercase">
          {hint}
        </span>
      </div>
      {children}
    </div>
  )
}
