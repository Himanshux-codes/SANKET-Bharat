'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { translations, type Lang, type TranslationDict } from './translations'

const SESSION_KEY = 'sanket-lang'

export type I18nContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: TranslationDict
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => undefined,
  t: translations.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  // Hydrate from sessionStorage on mount (client only)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY) as Lang | null
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Read the external session preference after server-matching hydration.
      if (stored === 'en' || stored === 'hi') setLangState(stored)
    } catch {
      // sessionStorage not available (e.g. SSR guard)
    }
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      sessionStorage.setItem(SESSION_KEY, l)
    } catch {
      // ignore
    }
  }, [])

  const value: I18nContextType = {
    lang,
    setLang,
    t: translations[lang],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** Returns the current language, its setter, and the full translation object `t`. */
export function useLanguage() {
  return useContext(I18nContext)
}
