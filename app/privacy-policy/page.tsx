'use client'

import Link from 'next/link'
import { ArrowLeft, Database, FileCheck2, FileText, HardDrive, Info, Layers, Lock, MapPin, Radio, Shield, ShieldAlert, ShieldCheck, UserCheck, Users } from 'lucide-react'
import { Reveal, RevealGroup } from '@/components/motion/reveal'
import { GlowLink } from '@/components/ui/glow-button'

interface PolicySectionProps {
  id: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  title: string
  badge?: string
  prototypeText: string
  productionText: string
  children?: React.ReactNode
}

function PolicySection({
  id,
  icon: Icon,
  title,
  badge,
  prototypeText,
  productionText,
  children,
}: PolicySectionProps) {
  return (
    <section id={id} className="glass rounded-2xl border border-border/80 p-6 sm:p-8 scroll-mt-28">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
            <Icon className="size-5" aria-hidden />
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        {badge && (
          <span className="rounded-full border border-border bg-white/[0.04] px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
            {badge}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-accent uppercase">
            <Info className="size-3.5" aria-hidden />
            Current Platform Status
          </div>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {prototypeText}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-white/[0.02] p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
            <Layers className="size-3.5 text-muted-foreground" aria-hidden />
            Future Production Requirement
          </div>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {productionText}
          </p>
        </div>
      </div>

      {children && <div className="mt-5 border-t border-border/60 pt-4">{children}</div>}
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <main className="relative z-10 mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 md:py-20">
      {/* Return navigation */}
      <Reveal>
        <div className="mb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-accent/40 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </Reveal>

      {/* Header */}
      <Reveal>
        <div className="mb-12 border-b border-border/60 pb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.18em] text-accent uppercase">
            <Shield className="size-3.5" aria-hidden /> Privacy & Data Notice
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Privacy Policy & <span className="text-gradient">Data Governance</span>
          </h1>
          <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            SANKET Bharat is a browser-only crisis review demo using synthetic examples and template suggestions.
            This notice describes current browser storage and the data-protection requirements
            that would need to be implemented for a future production system.
          </p>

          {/* Prototype disclaimer banner */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-warning">
            <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div className="text-xs leading-relaxed">
              <strong className="font-semibold uppercase tracking-wider">Platform Notice:</strong>{' '}
              SANKET Bharat currently operates on browser-local state for evaluation and research.
              It is <strong>not connected</strong> to official government emergency dispatch networks (112, 101, 108, NDRF).
              Do not use this platform to report actual life-threatening emergencies.
            </div>
          </div>
        </div>
      </Reveal>

      {/* Core Policy Sections */}
      <RevealGroup className="flex flex-col gap-6" stagger={0.06}>
        {/* 1. Overview */}
        <PolicySection
          id="overview"
          icon={FileText}
          title="1. Overview & Platform Architecture"
          badge="Scope"
          prototypeText="Demo only. Ten seeded scenarios, four initial review records, user-entered local examples and uploaded evaluation rows are sandbox data. No operational metrics or live telemetry are established."
          productionText="Future pilot requirements are design proposals only; deployment authority, scope and applicable obligations must be established independently."
        />

        {/* 2. Information Submitted by Citizens */}
        <PolicySection
          id="citizen-submissions"
          icon={Users}
          title="2. Information Submitted by Citizens"
          badge="Intake"
          prototypeText="Use synthetic details only. Local form records, optional name/contact and history persist in localStorage. Offline queued examples persist in IndexedDB. No emergency-backend submission or authority receipt exists."
          productionText="Before real intake: implement identity, access controls, authoritative persistence, minimization, protected transport/storage and truthful receipts. None is provided by this demo."
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Demonstrated Fields:</span>
            <span className="rounded-md border border-border px-2 py-0.5">Emergency Type</span>
            <span className="rounded-md border border-border px-2 py-0.5">Location Description</span>
            <span className="rounded-md border border-border px-2 py-0.5">Estimated Affected Count</span>
            <span className="rounded-md border border-border px-2 py-0.5">Reporter Name & Phone (Optional)</span>
          </div>
        </PolicySection>

        {/* 3. Location & Geospatial Data */}
        <PolicySection
          id="location-data"
          icon={MapPin}
          title="3. Location & Geospatial Data"
          badge="Geospatial"
          prototypeText="Location descriptions are manual demo text. Device location capture and geocoding are unavailable. Local form examples have unknown coordinates; map pins are illustrative seed coordinates only."
          productionText="Future location capture requires explicit permission, accuracy/source timestamps, validation and appropriate precision restrictions."
        />

        {/* 4. Images & Uploaded Media */}
        <PolicySection
          id="media-handling"
          icon={FileCheck2}
          title="4. Images & Uploaded Media"
          badge="Media"
          prototypeText="Online image selection retains the filename only. Offline image Blobs can persist in IndexedDB on this device. No image analysis, upload, cloud attachment or durable media service exists."
          productionText="Future media handling needs validated limits, permitted storage, restricted access, retention, and safe processing. No such pipeline is implemented."
        />

        {/* 5. Prototype / Simulated Data */}
        <PolicySection
          id="simulated-data"
          icon={Database}
          title="5. Synthetic Data &amp; Platform State"
          badge="Data Architecture"
          prototypeText="Seeds are demo records. CSV-derived records remain evaluation sandbox records. Every workflow record has mode and provenance; pilot inputs are refused. Fixed chart values are illustrative, not observations or model outputs."
          productionText="Future source access requires actual authorization, provenance and freshness checks. No named agency integration or partnership exists."
        />

        {/* 6. Third-Party & Social Data */}
        <PolicySection
          id="third-party-data"
          icon={Radio}
          title="6. Third-Party & Social Source Simulation"
          badge="Signal Ingestion"
          prototypeText="Social messages are generated fictional examples. Attaching one adds an unverified simulation note, never supporting corroboration. No social scraping or API access is implemented."
          productionText="Future social ingestion would need permitted provider access and appropriate consent/retention. No adapter is implemented."
        />

        {/* 7. Data Security & Storage */}
        <PolicySection
          id="data-security"
          icon={Lock}
          title="7. Data Security Architecture"
          badge="Security"
          prototypeText="localStorage holds demo state/history; IndexedDB holds the offline queue and image Blobs; sessionStorage holds language choice. No authentication, restricted PII view or application-level encryption is implemented. Production builds include Vercel Analytics; font resources may load externally. Use no sensitive details."
          productionText="Future security controls must be selected, implemented and tested before any encryption, security or compliance claim."
        />

        {/* 8. Data Retention & Ephemeral Storage */}
        <PolicySection
          id="data-retention"
          icon={HardDrive}
          title="8. Data Retention & Deletion"
          badge="Retention"
          prototypeText="localStorage and IndexedDB persist beyond a tab session until cleared or evicted by the browser. There is no automatic expiry or in-app deletion workflow. Clearing this site’s browser data removes local examples, history, queued records and Blobs."
          productionText="Future retention/deletion requirements need an explicit policy, implementation and verification; there is no automatic purge today."
        />

        {/* 9. Human Authority & Responsible AI */}
        <PolicySection
          id="human-in-the-loop"
          icon={UserCheck}
          title="9. Human-in-the-Loop AI Decision-Making"
          badge="Governance"
          prototypeText="Review buttons record simulated local decisions by an unauthenticated demo user. Templates are not model inference. No report decision dispatches teams, authorizes an assignment or sends messages."
          productionText="Future consequential decisions require authorized humans and attributable server events. AI identities must never approve, reject, assign or close cases."
        />

        {/* 10. Responsible Use & Contact */}
        <PolicySection
          id="contact"
          icon={ShieldCheck}
          title="10. Responsible Use & Project Inquiries"
          badge="Contact"
          prototypeText="This is an educational sandbox, not an emergency service. Actual emergency reporting must use established channels. No government relationship, operational result or model validation is asserted."
          productionText="Future operational contacts and rights workflows require actual responsible operators; no government escalation contact is provided."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              For evaluation queries, review the platform architecture or test the demonstration flows.
            </p>
            <div className="flex items-center gap-3">
              <GlowLink href="/#about" variant="ghost" size="sm">
                About Project
              </GlowLink>
              <GlowLink href="/report" variant="danger" size="sm">
                Test Report Flow
              </GlowLink>
            </div>
          </div>
        </PolicySection>
      </RevealGroup>

      {/* Footer Navigation */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" /> Return to SANKET Bharat Home
          </Link>
          <p className="font-mono text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
            Human-in-the-Loop · AI-Assisted · Non-Operational
          </p>
        </div>
      </Reveal>
    </main>
  )
}
