'use client'

import { useState, useCallback } from 'react'
import { FlaskConical, Play, RotateCcw, ShieldAlert, Check } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { CsvUploader } from '@/components/evaluation/csv-uploader'
import { EvaluationMetricsCards } from '@/components/evaluation/evaluation-metrics'
import { ConfusionMatrix } from '@/components/evaluation/confusion-matrix'
import { EvaluationResultsTable } from '@/components/evaluation/evaluation-results-table'
import { Reveal } from '@/components/motion/reveal'
import type { CsvRow, EvaluatedRow, EvaluationMetrics } from '@/lib/evaluation/types'
import { classifyDisasterText } from '@/lib/evaluation/disaster-classifier'
import { evaluateClassifier } from '@/lib/evaluation/evaluate-classifier'
import { useIncidents } from '@/lib/incident-context'

export default function EvaluationPage() {
  const [rows, setRows] = useState<CsvRow[] | null>(null)
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null)
  const [results, setResults] = useState<EvaluatedRow[] | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [promotionNotice, setPromotionNotice] = useState<string | null>(null)

  const { addDemoIncidents, promotedDatasetIds } = useIncidents()

  const handleDataLoaded = useCallback((data: CsvRow[]) => {
    setRows(data)
    // Clear previous results when new data is loaded
    setMetrics(null)
    setResults(null)
    setSelectedIds(new Set())
  }, [])

  function runEvaluation() {
    if (!rows || rows.length === 0) return
    setIsRunning(true)
    setSelectedIds(new Set())

    // Run asynchronously to allow UI to update
    requestAnimationFrame(() => {
      const { metrics: m, results: r } = evaluateClassifier(rows, classifyDisasterText)
      setMetrics(m)
      setResults(r)
      setIsRunning(false)
    })
  }

  function resetEvaluation() {
    setRows(null)
    setMetrics(null)
    setResults(null)
    setSelectedIds(new Set())
    // Note: Reset does NOT delete already-promoted Demo Sandbox incidents
  }

  function handlePromote() {
    if (!results || selectedIds.size === 0) return

    const selectedRows = results.filter((r) => selectedIds.has(r.id))
    const promotedIds = addDemoIncidents(selectedRows)

    if (promotedIds.length > 0) {
      setPromotionNotice(
        `${promotedIds.length} signal${promotedIds.length > 1 ? 's' : ''} promoted to Demo Sandbox (${promotedIds.join(', ')})`
      )
      setSelectedIds(new Set())
      setTimeout(() => setPromotionNotice(null), 4000)
    } else {
      setPromotionNotice('All selected signals have already been promoted.')
      setTimeout(() => setPromotionNotice(null), 3000)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Classification Evaluation Lab"
        title={
          <>
            <span className="text-gradient">SANKET Bharat</span>
            <br />
            Classification Evaluation Lab
          </>
        }
        description="Prototype Testing Environment — Evaluate disaster-text classification using a labelled CSV dataset."
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 pb-24 sm:px-8 md:pb-32">
        {/* Classifier badge */}
        <Reveal direction="none">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1.5 text-xs font-medium text-accent">
              <FlaskConical className="size-3.5" />
              Baseline Rule-Based Classifier — Prototype Evaluation Only
            </div>
            <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-3.5 py-1.5 text-xs font-medium text-amber-400">
              <ShieldAlert className="size-3.5" />
              Isolated — Not connected to operational systems
            </div>
          </div>
        </Reveal>

        {/* CSV Upload */}
        <Reveal delay={0.06}>
          <CsvUploader onDataLoaded={handleDataLoaded} />
        </Reveal>

        {/* Run / Reset controls */}
        {rows && rows.length > 0 && (
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={runEvaluation}
                disabled={isRunning}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/80 active:translate-y-px disabled:opacity-50"
              >
                <Play className="size-4" />
                {isRunning ? 'Running…' : 'Run Evaluation'}
              </button>
              <button
                type="button"
                onClick={resetEvaluation}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-destructive/40 hover:text-destructive"
              >
                <RotateCcw className="size-4" />
                Reset Evaluation
              </button>
            </div>
          </Reveal>
        )}

        {/* Results section */}
        {metrics && results && (
          <>
            {/* Metric cards */}
            <Reveal delay={0.04}>
              <EvaluationMetricsCards metrics={metrics} />
            </Reveal>

            {/* Confusion Matrix */}
            <Reveal delay={0.08}>
              <ConfusionMatrix counts={metrics} />
            </Reveal>

            {/* Results Table */}
            <Reveal delay={0.12} amount={0.05}>
              <EvaluationResultsTable
                results={results}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                promotedDatasetIds={promotedDatasetIds}
                onPromote={handlePromote}
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Promotion toast */}
      {promotionNotice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-success/30 bg-card px-4 py-3 text-sm text-foreground shadow-2xl"
        >
          <Check className="size-4 text-success" />
          {promotionNotice}
        </div>
      )}
    </>
  )
}
