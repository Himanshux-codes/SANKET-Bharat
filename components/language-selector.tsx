'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/i18n-context'
import type { Lang } from '@/lib/i18n/translations'
import { cn } from '@/lib/utils'

const LANGS: { value: Lang; label: string; native: string }[] = [
  { value: 'en', label: 'English', native: 'EN' },
  { value: 'hi', label: 'हिन्दी', native: 'हि' },
]

interface LanguageSelectorProps {
  /** When true, renders a more compact inline pill (for mobile drawer). */
  compact?: boolean
  className?: string
}

export function LanguageSelector({ compact = false, className }: LanguageSelectorProps) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      className={cn('flex items-center', className)}
      role="group"
      aria-label={t.langSelector.label}
    >
      <div
        className={cn(
          'flex items-center gap-px rounded-full border border-border bg-white/[0.04]',
          compact ? 'px-1 py-1' : 'px-1 py-1',
        )}
      >
        {!compact && (
          <Languages
            className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
        )}
        {LANGS.map(({ value, native, label }) => (
          <button
            key={value}
            type="button"
            aria-label={`Switch to ${label}`}
            aria-pressed={lang === value}
            onClick={() => setLang(value)}
            className={cn(
              'min-w-[2rem] rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-[0.08em] transition-all duration-300',
              lang === value
                ? 'bg-accent text-accent-foreground shadow-[0_0_10px_-3px_var(--accent)]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {native}
          </button>
        ))}
      </div>
    </div>
  )
}
