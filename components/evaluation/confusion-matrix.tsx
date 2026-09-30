'use client'

import type { ConfusionCounts } from '@/lib/evaluation/types'

interface ConfusionMatrixProps {
  counts: ConfusionCounts
}

export function ConfusionMatrix({ counts }: ConfusionMatrixProps) {
  const { tp, tn, fp, fn } = counts

  return (
    <div className="glass rounded-xl p-6">
      <h4 className="mb-5 text-sm font-semibold tracking-wide text-foreground uppercase">
        Confusion Matrix
      </h4>

      <div className="overflow-x-auto">
        <table className="mx-auto border-collapse text-center">
          <thead>
            <tr>
              <th className="p-2" />
              <th className="p-2" />
              <th
                colSpan={2}
                className="border-b border-accent/30 px-4 pb-2 text-xs font-semibold tracking-wider text-accent uppercase"
              >
                Predicted
              </th>
            </tr>
            <tr>
              <th className="p-2" />
              <th className="p-2" />
              <th className="px-4 py-2 text-xs font-medium text-emerald-400">
                Disaster
              </th>
              <th className="px-4 py-2 text-xs font-medium text-sky-400">
                Non-Disaster
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                rowSpan={2}
                className="border-r border-accent/30 px-3 text-xs font-semibold tracking-wider text-accent uppercase"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Actual
              </th>
              <th className="px-4 py-2 text-xs font-medium text-emerald-400">
                Disaster
              </th>
              <td className="px-4 py-3">
                <div className="mx-auto flex size-20 flex-col items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10">
                  <span className="font-mono text-2xl font-bold text-emerald-400">
                    {tp}
                  </span>
                  <span className="text-[0.6rem] font-medium text-emerald-400/70">
                    TP
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="mx-auto flex size-20 flex-col items-center justify-center rounded-lg border border-rose-400/30 bg-rose-400/10">
                  <span className="font-mono text-2xl font-bold text-rose-400">
                    {fn}
                  </span>
                  <span className="text-[0.6rem] font-medium text-rose-400/70">FN</span>
                </div>
              </td>
            </tr>
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-sky-400">
                Non-Disaster
              </th>
              <td className="px-4 py-3">
                <div className="mx-auto flex size-20 flex-col items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/10">
                  <span className="font-mono text-2xl font-bold text-amber-400">
                    {fp}
                  </span>
                  <span className="text-[0.6rem] font-medium text-amber-400/70">
                    FP
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="mx-auto flex size-20 flex-col items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10">
                  <span className="font-mono text-2xl font-bold text-sky-400">
                    {tn}
                  </span>
                  <span className="text-[0.6rem] font-medium text-sky-400/70">TN</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
