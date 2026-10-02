'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, Check, CheckCircle2, Crosshair, Database, FileImage, Flame, HardDrive, LocateFixed, MapPin, Mountain, Navigation, Phone, Radio, RefreshCw, Send, ShieldCheck, Sparkles, UserRound, Waves, Wifi, WifiOff, Wind } from 'lucide-react'
import { useIncidents } from '@/lib/incident-context'
import { GlowLink } from '@/components/ui/glow-button'
import { Button } from '@/components/ui/button'
import { Reveal, RevealGroup } from '@/components/motion/reveal'
import { useLanguage } from '@/lib/i18n/i18n-context'

type EmergencyType = 'Flood' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Landslide' | 'Other'
type Severity = 'Moderate' | 'High' | 'Critical'

const EMERGENCY_TYPE_ICONS: Record<EmergencyType, typeof Waves> = {
  Flood: Waves,
  Fire: Flame,
  Earthquake: Mountain,
  Cyclone: Wind,
  Landslide: Mountain,
  Other: AlertTriangle,
}

const EMERGENCY_TYPE_KEYS: EmergencyType[] = ['Flood', 'Fire', 'Earthquake', 'Cyclone', 'Landslide', 'Other']
const SEVERITY_KEYS: Severity[] = ['Moderate', 'High', 'Critical']
const SEVERITY_COLORS: Record<Severity, string> = {
  Moderate: 'text-warning',
  High: 'text-orange-300',
  Critical: 'text-destructive',
}

export default function ReportPage() {
  const {
    addReport,
    isOnline,
    offlineQueue,
    isSyncing,
    syncFeedback,
    queueOfflineReport,
    syncPendingReports,
  } = useIncidents()
  const { t, lang } = useLanguage()

  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Flood')
  const [severity, setSeverity] = useState<Severity>('High')
  const [location, setLocation] = useState('')
  const coordinates = 'Unknown — location capture unavailable'
  const [description, setDescription] = useState('')
  const [affected, setAffected] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [fileName, setFileName] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [submitted, setSubmitted] = useState(false)
  const [isOfflineSubmission, setIsOfflineSubmission] = useState(false)
  const [createdIncidentId, setCreatedIncidentId] = useState('')
  const [localReportId, setLocalReportId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const queueCounts = useMemo(() => {
    return {
      queued: offlineQueue.filter((q) => q.status === 'queued').length,
      syncing: offlineQueue.filter((q) => q.status === 'syncing').length,
      synced: offlineQueue.filter((q) => q.status === 'synced').length,
      failed: offlineQueue.filter((q) => q.status === 'failed').length,
      total: offlineQueue.length,
    }
  }, [offlineQueue])

  const pendingCount = queueCounts.queued + queueCounts.failed

  const confidence = 'Not available'

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      if (!isOnline) {
        // Safe offline queue submission in IndexedDB
        const localId = await queueOfflineReport(
          {
            emergencyType,
            severity,
            location,
            coordinates,
            description,
            affected,
            name,
            contact,
            fileName: imageFile?.name || fileName || undefined,
          },
          imageFile
        )
        setLocalReportId(localId)
        setIsOfflineSubmission(true)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // Online intake submission
        const id = addReport({
          emergencyType,
          severity,
          location,
          coordinates,
          description,
          affected,
          name,
          contact,
          fileName: imageFile?.name || fileName || undefined,
        })
        setCreatedIncidentId(id)
        setIsOfflineSubmission(false)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setSubmissionError('Local demo input could not be added. No report has been sent to any authority.')
      console.error('Submission failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    if (isOfflineSubmission) {
      return (
        <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center px-5 py-16 sm:px-8">
          <Reveal className="w-full">
            <section className="glass relative overflow-hidden rounded-2xl border border-warning/30 p-7 text-center sm:p-12">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-warning to-transparent" />
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-warning/30 bg-warning/10 text-warning">
                <HardDrive className="size-8" aria-hidden="true" />
              </div>
              <p className="mt-6 font-mono text-[0.7rem] tracking-[0.18em] text-warning uppercase">
                {t.report.offlineFeedbackMode}
              </p>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {t.report.offlineSavedTitle}
              </h1>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">
                {t.report.offlineSavedBody}
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-background/50 px-5 py-4 text-left">
                <p className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
                  {t.report.localIdLabel}
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tracking-[0.06em] text-warning">
                  {localReportId}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="size-3.5 text-warning" aria-hidden="true" />
                  Stored in local IndexedDB · Copy while this app is open · No upload
                </div>
                {fileName && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <FileImage className="size-3.5 text-accent" aria-hidden="true" />
                    Image stored on this device: <span className="text-foreground">{fileName}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false)
                    setIsOfflineSubmission(false)
                  }}
                >
                  {t.report.submitAnother}
                </Button>
                <GlowLink href="/live-map" variant="primary">
                  {t.nav.liveMap}
                </GlowLink>
              </div>
            </section>
          </Reveal>
        </main>
      )
    }

    return (
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center px-5 py-16 sm:px-8">
        <Reveal className="w-full">
          <section className="glass relative overflow-hidden rounded-2xl border border-success/30 p-7 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-success to-transparent" />
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
              <Check className="size-8" aria-hidden="true" />
            </div>
            <p className="mt-6 font-mono text-[0.7rem] tracking-[0.18em] text-success uppercase">{t.report.successBadge}</p>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{t.report.successHeadline}</h1>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">
              {t.report.successBody}
            </p>
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-background/50 px-5 py-4 text-left">
              <p className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">{t.report.incidentIdLabel}</p>
              <p className="mt-1 font-mono text-xl font-semibold tracking-[0.08em] text-accent">{createdIncidentId || 'Not available'}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
                Model confidence: {confidence} · {t.report.awaitingVerification}
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
                {t.report.submitAnother}
              </Button>
              <GlowLink href="/admin" variant="primary">
                {t.report.viewInAdmin}
              </GlowLink>
            </div>
          </section>
        </Reveal>
      </main>
    )
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 md:py-20">
      <Reveal>
        <div className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.18em] text-destructive uppercase">
              <span className="size-1.5 rounded-full bg-destructive" /> {t.report.badge}
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl md:text-6xl">
              {t.report.title} <span className="text-gradient">{t.report.titleGradient}</span>
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {t.report.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Connectivity Indicator */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors ${
                isOnline
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-warning/35 bg-warning/10 text-warning animate-pulse'
              }`}
              role="status"
              aria-live="polite"
            >
              {isOnline ? (
                <>
                  <span className="size-2 rounded-full bg-success" />
                  <Wifi className="size-3.5" />
                  {t.report.onlineBadge}
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-warning" />
                  <WifiOff className="size-3.5" />
                  {t.report.offlineBadge}
                </>
              )}
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg border border-border bg-background/50 px-3 py-2 font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase md:self-auto">
              <ShieldCheck className="size-4 text-success" aria-hidden="true" /> {t.report.secureIntake}
            </div>
          </div>
        </div>
      </Reveal>

      {submissionError && <p role="alert" className="mb-6 rounded-xl border border-danger/30 p-4 text-sm text-danger">{submissionError}</p>}

      {/* Dynamic Feedback Banner for Connectivity & Sync Events */}
      {(!isOnline || isSyncing || syncFeedback) && (
        <Reveal>
          <div
            className={`mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-xs leading-relaxed transition-all ${
              !isOnline
                ? 'border-warning/40 bg-warning/10 text-foreground'
                : isSyncing
                ? 'border-accent/40 bg-accent/10 text-foreground'
                : 'border-success/40 bg-success/10 text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              {!isOnline ? (
                <HardDrive className="size-4.5 shrink-0 text-warning" />
              ) : isSyncing ? (
                <RefreshCw className="size-4.5 shrink-0 animate-spin text-accent" />
              ) : (
                <CheckCircle2 className="size-4.5 shrink-0 text-success" />
              )}
              <p>
                {!isOnline
                  ? t.report.offlineFeedbackMode
                  : syncFeedback ||
                    (isSyncing ? t.report.offlineFeedbackSyncing : t.report.offlineFeedbackSynced)}
              </p>
            </div>

            {isOnline && pendingCount > 0 && !isSyncing && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => syncPendingReports()}
                className="h-8 gap-1.5 border-accent/40 text-[0.7rem] uppercase tracking-wider"
              >
                <RefreshCw className="size-3" /> {t.report.syncNow}
              </Button>
            )}
          </div>
        </Reveal>
      )}

      <form onSubmit={submitReport} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <RevealGroup>
            <section className="glass rounded-2xl border border-border p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.18em] text-accent uppercase">{t.report.section1Eyebrow}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{t.report.section1Title}</h2>
                </div>
                <Sparkles className="size-5 text-accent" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {EMERGENCY_TYPE_KEYS.map((key) => {
                  const Icon = EMERGENCY_TYPE_ICONS[key]
                  const active = emergencyType === key
                  const label = t.report.types[key] ?? key
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setEmergencyType(key)}
                      className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${active ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-background/30 text-muted-foreground hover:border-accent/50 hover:text-foreground'}`}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      {label}
                    </button>
                  )
                })}
              </div>
            </section>
          </RevealGroup>

          <RevealGroup>
            <section className="glass rounded-2xl border border-border p-5 sm:p-7">
              <div className="mb-6">
                <p className="font-mono text-[0.65rem] tracking-[0.18em] text-accent uppercase">{t.report.section2Eyebrow}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{t.report.section2Title}</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block flex-1">
                  <MapPin className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">{t.report.locationSrLabel}</span>
                  <input value={location} onChange={(event) => setLocation(event.target.value)} className="h-11 w-full rounded-lg border border-border bg-background/50 pr-3 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder={t.report.locationPlaceholder} />
                </label>
                <Button type="button" variant="outline" disabled title="Location capture is not implemented" className="h-11">
                  <LocateFixed className="size-4" aria-hidden="true" /> {t.report.useCurrentLocation}
                </Button>
              </div>
              <div className="mt-3 flex items-center gap-2 font-mono text-[0.68rem] text-muted-foreground">
                <Crosshair className="size-3.5 text-accent" aria-hidden="true" /> {t.report.coordinatesLabel} <span className="text-foreground">{coordinates}</span>
              </div>
            </section>
          </RevealGroup>

          <RevealGroup>
            <section className="glass rounded-2xl border border-border p-5 sm:p-7">
              <div className="mb-6">
                <p className="font-mono text-[0.65rem] tracking-[0.18em] text-accent uppercase">{t.report.section3Eyebrow}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{t.report.section3Title}</h2>
              </div>
              <div className="flex flex-col gap-5">
                <label className="flex flex-col gap-2 text-sm font-medium">
                  {t.report.descriptionLabel} <span className="font-normal text-muted-foreground">{t.report.descriptionHint}</span>
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} required rows={5} className="resize-y rounded-lg border border-border bg-background/50 p-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder={t.report.descriptionPlaceholder} />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    {t.report.peopleAffectedLabel} <span className="font-normal text-muted-foreground">{t.report.peopleAffectedHint}</span>
                    <input value={affected} onChange={(event) => setAffected(event.target.value)} required type="number" min="0" className="h-11 rounded-lg border border-border bg-background/50 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="e.g. 25" />
                  </label>
                  <fieldset className="flex flex-col gap-2 text-sm font-medium">
                    <legend>{t.report.severityLabel}</legend>
                    <div className="grid grid-cols-3 gap-2">
                      {SEVERITY_KEYS.map((key) => {
                        const color = SEVERITY_COLORS[key]
                        const label = t.report.severity[key] ?? key
                        return (
                          <button key={key} type="button" aria-pressed={severity === key} onClick={() => setSeverity(key)} className={`rounded-lg border px-2 py-2.5 text-xs transition-colors ${severity === key ? `border-current bg-current/10 ${color}` : 'border-border bg-background/30 text-muted-foreground hover:border-accent/50'}`}>{label}</button>
                        )
                      })}
                    </div>
                  </fieldset>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-background/20 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground">
                  <FileImage className="size-5 text-accent" aria-hidden="true" />
                  <span className="flex-1">
                    <span className="font-medium text-foreground">{t.report.addImageLabel}</span>
                    <br />
                    <span className="text-xs">{t.report.addImageHint}</span>
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        setImageFile(file)
                        setFileName(file.name)
                      } else {
                        setImageFile(null)
                        setFileName('')
                      }
                    }}
                  />
                  {fileName ? (
                    <span className="max-w-32 truncate text-xs text-accent">{fileName}</span>
                  ) : (
                    <span className="rounded-md border border-border px-2.5 py-1.5 text-xs">
                      {t.report.browse}
                    </span>
                  )}
                </label>
              </div>
            </section>
          </RevealGroup>

          <RevealGroup>
            <section className="glass rounded-2xl border border-border p-5 sm:p-7">
              <div className="mb-6">
                <p className="font-mono text-[0.65rem] tracking-[0.18em] text-accent uppercase">{t.report.section4Eyebrow}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{t.report.section4Title}</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium">{t.report.nameLabel} <span className="relative"><UserRound className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" aria-hidden="true" /><input value={name} onChange={(event) => setName(event.target.value)} className="h-11 w-full rounded-lg border border-border bg-background/50 pr-3 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder={t.report.namePlaceholder} /></span></label>
                <label className="flex flex-col gap-2 text-sm font-medium">{t.report.contactLabel} <span className="relative"><Phone className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" aria-hidden="true" /><input value={contact} onChange={(event) => setContact(event.target.value)} type="tel" className="h-11 w-full rounded-lg border border-border bg-background/50 pr-3 pl-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="+91 98765 43210" /></span></label>
              </div>
            </section>
          </RevealGroup>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          {/* Offline Queue Status Card */}
          <Reveal>
            <section className="glass rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-accent" />
                  <h3 className="font-mono text-[0.68rem] tracking-[0.16em] text-accent uppercase">
                    {t.report.offlineQueueTitle}
                  </h3>
                </div>
                {isSyncing && (
                  <span className="inline-flex items-center gap-1 font-mono text-[0.62rem] text-accent">
                    <RefreshCw className="size-3 animate-spin" /> {t.report.offlineStatusSyncing}...
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {pendingCount > 0
                  ? t.report.offlineQueueWaiting.replace('{count}', String(pendingCount))
                  : t.report.offlineQueueSynced}
              </p>

              <div className="mt-3.5 grid grid-cols-4 gap-1.5 text-center font-mono">
                <div className="rounded-lg border border-border bg-background/40 p-2">
                  <span className="block text-[0.6rem] text-muted-foreground uppercase">{t.report.offlineStatusQueued}</span>
                  <span className="mt-0.5 text-sm font-semibold text-warning">{queueCounts.queued}</span>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-2">
                  <span className="block text-[0.6rem] text-muted-foreground uppercase">{t.report.offlineStatusSyncing}</span>
                  <span className="mt-0.5 text-sm font-semibold text-accent">{queueCounts.syncing}</span>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-2">
                  <span className="block text-[0.6rem] text-muted-foreground uppercase">{t.report.offlineStatusSynced}</span>
                  <span className="mt-0.5 text-sm font-semibold text-success">{queueCounts.synced}</span>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-2">
                  <span className="block text-[0.6rem] text-muted-foreground uppercase">{t.report.offlineStatusFailed.split('/')[0].trim()}</span>
                  <span className="mt-0.5 text-sm font-semibold text-destructive">{queueCounts.failed}</span>
                </div>
              </div>

              {isOnline && (queueCounts.queued > 0 || queueCounts.failed > 0) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => syncPendingReports()}
                  disabled={isSyncing}
                  className="mt-3.5 w-full h-8 gap-2 text-xs"
                >
                  <RefreshCw className={`size-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {queueCounts.failed > 0 ? t.report.retrySync : t.report.syncNow}
                </Button>
              )}
            </section>
          </Reveal>

          {/* AI Verification Preview Card */}
          <Reveal delay={0.04}>
            <section className="glass rounded-2xl border border-accent/30 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2"><Sparkles className="size-4 text-accent" aria-hidden="true" /><p className="font-mono text-[0.68rem] tracking-[0.16em] text-accent uppercase">{t.report.aiPreviewTitle}</p></div>
                <span className="size-2 animate-pulse rounded-full bg-accent" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.report.aiPreviewBody}</p>
              <div className="mt-5 divide-y divide-border/70 rounded-xl border border-border bg-background/30">
                <div className="flex items-center justify-between px-3.5 py-3"><span className="text-xs text-muted-foreground">{t.report.aiConfidenceLabel}</span><span className="font-mono text-sm font-semibold text-success">{confidence}</span></div>
                <div className="flex items-center justify-between px-3.5 py-3"><span className="text-xs text-muted-foreground">{t.report.detectedTypeLabel}</span><span className="text-sm font-medium text-foreground">{t.report.types[emergencyType] ?? emergencyType}</span></div>
                <div className="flex items-center justify-between px-3.5 py-3"><span className="text-xs text-muted-foreground">{t.report.severityDisplayLabel}</span><span className={`text-sm font-medium ${SEVERITY_COLORS[severity]}`}>{t.report.severity[severity] ?? severity}</span></div>
                <div className="flex items-start gap-2 px-3.5 py-3 text-xs leading-relaxed text-warning"><AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" /><span><strong className="font-medium">{lang === 'hi' ? 'संभावित डुप्लीकेट:' : 'Possible duplicate:'}</strong> {t.report.duplicateWarning}</span></div>
              </div>
            </section>
          </Reveal>

          {/* Offline Relay Network - Future Feature Card */}
          <Reveal delay={0.08}>
            <section className="glass relative overflow-hidden rounded-2xl border border-accent/20 bg-linear-to-b from-accent/5 via-background/40 to-background/60 p-5">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Radio className="size-4 text-accent" />
                  <h3 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                    {t.report.relayTitle}
                  </h3>
                </div>
                <span className="rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 font-mono text-[0.6rem] font-medium tracking-[0.14em] text-warning uppercase">
                  {t.report.relayBadge}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {t.report.relayText}
              </p>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-muted-foreground/80">
                {t.report.relaySecondaryText}
              </p>
            </section>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-xl border border-border bg-background/30 p-4 text-xs leading-relaxed text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                <Navigation className="size-3.5 text-accent" aria-hidden="true" /> {t.report.beforeSubmitTitle}
              </div>
              {t.report.beforeSubmitBody}
            </div>
          </Reveal>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSubmitting ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            {t.report.submitButton}
          </Button>

          <p className="text-center font-mono text-[0.62rem] tracking-[0.12em] text-muted-foreground uppercase">
            {t.report.encryptedLabel}
          </p>
        </aside>
      </form>
    </main>
  )
}
