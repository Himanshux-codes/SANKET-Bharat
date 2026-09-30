'use client'

import { Target, Crosshair, Eye, BarChart3 } from 'lucide-react'
import type { EvaluationMetrics } from '@/lib/evaluation/types'

interface MetricsCardsProps {
  metrics: EvaluationMetrics
}

const METRIC_CARDS = [
  {
    key: 'accuracy' as const,
    label: 'Accuracy',
    icon: Target,
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    desc: '(TP + TN) / Total',
  },
  {
    key: 'precision' as const,
    label: 'Precision',
    icon: Crosshair,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    desc: 'TP / (TP + FP)',
  },
  {
    key: 'recall' as const,
    label: 'Recall',
    icon: Eye,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    desc: 'TP / (TP + FN)',
  },
  {
    key: 'f1' as const,
    label: 'F1 Score',
    icon: BarChart3,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    desc: '2 · P · R / (P + R)',
  },
] as const

export function EvaluationMetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="space-y-6">
      {/* Main metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRIC_CARDS.map(({ key, label, icon: Icon, color, bg, border, desc }) => (
          <div
            key={key}
            className={`glass rounded-xl border ${border} p-5 transition-transform hover:-translate-y-0.5`}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className={`rounded-lg ${bg} p-2`}>
                <Icon className={`size-4 ${color}`} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
            <div className={`font-mono text-3xl font-bold ${color}`}>
              {(metrics[key] * 100).toFixed(2)}%
            </div>
            <div className="mt-1 text-xs text-muted-foreground/60">{desc}</div>
          </div>
        ))}
      </div>

      {/* Summary counts */}
      <div className="glass rounded-xl p-5">
        <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground uppercase">
          Summary
        </h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {([
            ['Total', metrics.total, 'text-foreground'],
            ['Correct', metrics.correct, 'text-emerald-400'],
            ['Incorrect', metrics.incorrect, 'text-destructive'],
            ['TP', metrics.tp, 'text-emerald-400'],
            ['TN', metrics.tn, 'text-sky-400'],
            ['FP', metrics.fp, 'text-amber-400'],
            ['FN', metrics.fn, 'text-rose-400'],
          ] as [string, number, string][]).map(([label, value, color]) => (
            <div key={label} className="text-center">
              <div className={`font-mono text-xl font-bold ${color}`}>
                {value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        These metrics evaluate only this baseline classifier on the uploaded labelled
        dataset. They do not represent validated real-world SANKET Bharat performance.
      </div>
    </div>
  )
}
