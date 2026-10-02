'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Send, CheckSquare } from 'lucide-react'
import type { EvaluatedRow } from '@/lib/evaluation/types'

type FilterKey =
  | 'all'
  | 'correct'
  | 'FP'
  | 'FN'
  | 'actual-disaster'
  | 'actual-non-disaster'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'correct', label: 'Correct' },
  { key: 'FP', label: 'False Positive' },
  { key: 'FN', label: 'False Negative' },
  { key: 'actual-disaster', label: 'Actual Disaster' },
  { key: 'actual-non-disaster', label: 'Actual Non-Disaster' },
]

interface EvaluationResultsTableProps {
  results: EvaluatedRow[]
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  promotedDatasetIds: Set<string>
  onPromote: () => void
}

export function EvaluationResultsTable({
  results,
  selectedIds,
  onSelectionChange,
  promotedDatasetIds,
  onPromote,
}: EvaluationResultsTableProps) {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 25

  const filtered = useMemo(() => {
    let rows = results

    // Apply filter
    switch (filter) {
      case 'correct':
        rows = rows.filter((r) => r.result === 'TP' || r.result === 'TN')
        break
      case 'FP':
        rows = rows.filter((r) => r.result === 'FP')
        break
      case 'FN':
        rows = rows.filter((r) => r.result === 'FN')
        break
      case 'actual-disaster':
        rows = rows.filter((r) => r.actual === 1)
        break
      case 'actual-non-disaster':
        rows = rows.filter((r) => r.actual === 0)
        break
    }

    // Apply text search
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.text.toLowerCase().includes(q) ||
          r.keyword.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      )
    }

    return rows
  }, [results, filter, search])

  // All predicted-disaster rows that can be selected (prediction === 1 AND not yet promoted)
  const selectableInFiltered = useMemo(
    () => filtered.filter((r) => r.predicted === 1 && !promotedDatasetIds.has(r.id)),
    [filtered, promotedDatasetIds],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages - 1)
  const paged = filtered.slice(clampedPage * PAGE_SIZE, (clampedPage + 1) * PAGE_SIZE)

  function resultLabel(r: EvaluatedRow['result']): string {
    switch (r) {
      case 'TP':
        return 'True Positive'
      case 'TN':
        return 'True Negative'
      case 'FP':
        return 'False Positive'
      case 'FN':
        return 'False Negative'
    }
  }

  function resultColor(r: EvaluatedRow['result']): string {
    switch (r) {
      case 'TP':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
      case 'TN':
        return 'text-sky-400 bg-sky-400/10 border-sky-400/30'
      case 'FP':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
      case 'FN':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/30'
    }
  }

  function toggleRow(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectionChange(next)
  }

  function selectAllPredictedDisaster() {
    const next = new Set(selectedIds)
    for (const row of selectableInFiltered) {
      next.add(row.id)
    }
    onSelectionChange(next)
  }

  function deselectAll() {
    onSelectionChange(new Set<string>())
  }

  const allSelectableSelected =
    selectableInFiltered.length > 0 &&
    selectableInFiltered.every((r) => selectedIds.has(r.id))

  return (
    <div className="glass rounded-xl p-6">
      <h4 className="mb-5 text-sm font-semibold tracking-wide text-foreground uppercase">
        Detailed Results
      </h4>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setFilter(f.key)
                setPage(0)
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-accent/30 hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative lg:ml-auto lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search text, keyword, location…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Selection toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="text-xs text-muted-foreground">
          Showing {paged.length} of {filtered.length} results
          {filter !== 'all' && ` (filtered from ${results.length} total)`}
        </div>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={allSelectableSelected ? deselectAll : selectAllPredictedDisaster}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
          >
            <CheckSquare className="size-3.5" />
            {allSelectableSelected ? 'Deselect All' : 'Select All Predicted Disaster Signals'}
          </button>
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={onPromote}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/80 active:translate-y-px"
            >
              <Send className="size-3.5" />
              Send {selectedIds.size} Selected to Demo Sandbox
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="w-10 px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                {/* checkbox column */}
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                ID
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                Keyword
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                Location
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground max-w-xs">
                Text
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                Actual
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                Predicted
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                Rule score (not probability)
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                Result
              </th>
              <th className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                Reasoning
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  No results match the current filter.
                </td>
              </tr>
            ) : (
              paged.map((row) => {
                const isSelectable = row.predicted === 1 && !promotedDatasetIds.has(row.id)
                const isPromoted = promotedDatasetIds.has(row.id)
                const isSelected = selectedIds.has(row.id)

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-border/50 transition-colors hover:bg-white/[0.02] ${isSelected ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-3 py-2 text-center">
                      {isPromoted ? (
                        <span className="inline-block rounded border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[0.55rem] font-medium text-emerald-400">
                          Added
                        </span>
                      ) : isSelectable ? (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(row.id)}
                          className="size-3.5 cursor-pointer rounded border-border accent-primary"
                        />
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground">
                      {row.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs">
                      {row.keyword || '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs">
                      {row.location || '—'}
                    </td>
                    <td className="max-w-xs truncate px-3 py-2 text-xs" title={row.text}>
                      {row.text}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-center">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${
                          row.actual === 1
                            ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
                            : 'border-sky-400/30 bg-sky-400/10 text-sky-400'
                        }`}
                      >
                        {row.actual}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-center">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${
                          row.predicted === 1
                            ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
                            : 'border-sky-400/30 bg-sky-400/10 text-sky-400'
                        }`}
                      >
                        {row.predicted}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-center font-mono text-xs">
                      {(row.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-center">
                      <span
                        className={`inline-block rounded border px-2 py-0.5 text-[0.65rem] font-medium ${resultColor(row.result)}`}
                      >
                        {resultLabel(row.result)}
                      </span>
                    </td>
                    <td className="max-w-[14rem] truncate px-3 py-2 text-xs text-muted-foreground" title={row.reasoning}>
                      {row.reasoning}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={clampedPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-muted-foreground">
            Page {clampedPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={clampedPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
