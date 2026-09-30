'use client'

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react'
import type { CsvRow } from '@/lib/evaluation/types'

const REQUIRED_COLUMNS = ['id', 'keyword', 'location', 'text', 'target'] as const

interface CsvUploaderProps {
  onDataLoaded: (rows: CsvRow[]) => void
}

export function CsvUploader({ onDataLoaded }: CsvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<{
    total: number
    target1: number
    target0: number
    fileName: string
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
    if (lines.length === 0) return []

    // Parse header
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
    const rows: Record<string, string>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i])
      if (values.length === 0) continue
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => {
        row[h] = (values[idx] ?? '').trim()
      })
      rows.push(row)
    }
    return rows
  }

  /** Basic CSV line parser that respects quoted fields */
  function parseCsvLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = false
          }
        } else {
          current += ch
        }
      } else {
        if (ch === '"') {
          inQuotes = true
        } else if (ch === ',') {
          result.push(current)
          current = ''
        } else {
          current += ch
        }
      }
    }
    result.push(current)
    return result
  }

  function processFile(file: File) {
    setError(null)
    setSummary(null)

    if (!file.name.endsWith('.csv')) {
      setError('Only .csv files are accepted.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)

      if (parsed.length === 0) {
        setError('CSV file is empty or could not be parsed.')
        return
      }

      // Validate columns
      const headers = Object.keys(parsed[0])
      const missing = REQUIRED_COLUMNS.filter(
        (col) => !headers.map((h) => h.toLowerCase()).includes(col.toLowerCase()),
      )

      if (missing.length > 0) {
        setError(`Missing required columns: ${missing.join(', ')}`)
        return
      }

      // Map to CsvRow[]
      const rows: CsvRow[] = parsed
        .map((raw) => {
          const target = parseInt(raw['target'] ?? '', 10)
          if (target !== 0 && target !== 1) return null
          return {
            id: raw['id'] ?? '',
            keyword: raw['keyword'] ?? '',
            location: raw['location'] ?? '',
            text: raw['text'] ?? '',
            target: target as 0 | 1,
          }
        })
        .filter(Boolean) as CsvRow[]

      if (rows.length === 0) {
        setError('No valid rows found. Ensure "target" column contains 0 or 1.')
        return
      }

      const target1 = rows.filter((r) => r.target === 1).length
      const target0 = rows.filter((r) => r.target === 0).length

      setSummary({ total: rows.length, target1, target0, fileName: file.name })
      onDataLoaded(rows)
    }

    reader.onerror = () => setError('Failed to read file.')
    reader.readAsText(file)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase">
        <Upload className="size-4 text-accent" />
        Dataset Upload
      </h3>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors ${
          isDragging
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-accent/40 hover:bg-white/[0.02]'
        }`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <FileText className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-accent">Click to upload</span> or drag &
          drop a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.csv</code>{' '}
          file
        </p>
        <p className="text-xs text-muted-foreground/60">
          Required columns: id, keyword, location, text, target
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
      />

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-accent">
            <CheckCircle className="size-4" />
            {summary.fileName} loaded successfully
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-foreground">
                {summary.total.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-emerald-400">
                {summary.target1.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Disaster (target=1)</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-sky-400">
                {summary.target0.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Non-Disaster (target=0)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
