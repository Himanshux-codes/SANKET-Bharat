'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  FileCheck2,
  FileText,
  Fingerprint,
  HardDrive,
  Info,
  Layers,
  Lock,
  MapPin,
  Radio,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
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
            SANKET Bharat is an AI-assisted crisis intelligence and response coordination platform.
            This policy outlines how data is handled within this platform and details
            the architectural data-protection standards required for any future production system.
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
          prototypeText="This application is a proof-of-concept frontend demonstration. All telemetry readings, incident maps, priority scores, and social signals are generated from pre-defined mock datasets and temporary browser state."
          productionText="A production deployment would operate under jurisdictional government oversight, adhering to national data localization guidelines, statutory crisis response protocols, and strict legal data-residency mandates."
        />

        {/* 2. Information Submitted by Citizens */}
        <PolicySection
          id="citizen-submissions"
          icon={Users}
          title="2. Information Submitted by Citizens"
          badge="Intake"
          prototypeText="When you submit a report through the Emergency Report flow (/report), inputs (name, contact, hazard type, description) are stored strictly within your browser's local memory and session context. No data is transmitted to external servers or stored in remote databases."
          productionText="In a production system, citizen submissions would be encrypted in transit using TLS 1.3, ingested via dedicated API gateways, and stored in secure government cloud environments with granular access logging."
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
          prototypeText="Location fields in the prototype use manual text entry or simulated sample coordinates (e.g., Sector 18, Noida). The 'Use current location' button provides sample simulated coordinates. No continuous background GPS tracking is performed."
          productionText="Production implementations require explicit, one-time device location permissions. Coordinates must be converted to low-resolution privacy-preserving geohash boundaries for public aggregate maps while retaining precision only for authorized field responders."
        />

        {/* 4. Images & Uploaded Media */}
        <PolicySection
          id="media-handling"
          icon={FileCheck2}
          title="4. Images & Uploaded Media"
          badge="Media"
          prototypeText="The file attachment input on the report page accepts image selections client-side for interface testing only. Files are neither processed by remote machine learning servers nor stored in cloud storage buckets."
          productionText="Production pipelines would strip EXIF and sensitive metadata automatically upon ingestion, apply automated blurring to faces and license plates, and run perceptual hashing to group duplicate signals without storing raw media longer than necessary."
        />

        {/* 5. Prototype / Simulated Data */}
        <PolicySection
          id="simulated-data"
          icon={Database}
          title="5. Synthetic Data &amp; Platform State"
          badge="Data Architecture"
          prototypeText="All 47 active incidents, timeline events, resource deployments, and response metrics displayed on the Dashboard, Live Map, and Admin panels are synthetically generated values. They demonstrate software capabilities and do not reflect real-time ground conditions."
          productionText="Live systems would ingest verified feeds from authorized agencies such as IMD, CWC, state disaster management authorities (SDMA), and ground field units through certified, authenticated REST/WebSocket adapters."
        />

        {/* 6. Third-Party & Social Data */}
        <PolicySection
          id="third-party-data"
          icon={Radio}
          title="6. Third-Party & Social Source Simulation"
          badge="Signal Ingestion"
          prototypeText="The 'Social Source Simulation' featured in the AI Analysis view is a scripted demonstration illustrating how crisis language models could categorize multi-channel noise. SANKET Bharat does NOT scrape or access live social media feeds (X, Meta, WhatsApp, Telegram)."
          productionText="Real-world social ingestion must comply with platform developer policies, user consent standards, and data protection legislation, focusing solely on publicly broadcast emergency crisis hashtags and verified official feeds."
        />

        {/* 7. Data Security & Storage */}
        <PolicySection
          id="data-security"
          icon={Lock}
          title="7. Data Security Architecture"
          badge="Security"
          prototypeText="The prototype uses standard browser localStorage and sessionStorage to enable interactive demonstrations (such as testing the report submission and viewing it in the Admin Verification Queue). State can be reset at any time by clearing browser data."
          productionText="Production infrastructure mandates AES-256 encryption at rest, hardware security modules (HSM) for key management, strict role-based access control (RBAC), and automated penetration testing."
        />

        {/* 8. Data Retention & Ephemeral Storage */}
        <PolicySection
          id="data-retention"
          icon={HardDrive}
          title="8. Data Retention & Deletion"
          badge="Retention"
          prototypeText="All prototype session data is ephemeral and tied to the active browser tab or local cache. No persistent historical logs are maintained on any remote server."
          productionText="Production data retention policies should enforce strict Time-To-Live (TTL) mechanisms: raw citizen personal identifiers are purged shortly after incident containment, retaining only anonymized geospatial telemetry for disaster mitigation planning."
        />

        {/* 9. Human Authority & Responsible AI */}
        <PolicySection
          id="human-in-the-loop"
          icon={UserCheck}
          title="9. Human-in-the-Loop AI Decision-Making"
          badge="Governance"
          prototypeText="The platform is strictly architected around Human-in-the-Loop principles. AI models provide explainable suggestions (severity triage, priority scoring, duplicate detection). No operational dispatch, resource assignment, or public evacuation is triggered autonomously by AI."
          productionText="Every AI-assisted recommendation in production requires cryptographic signing and explicit approval by designated district emergency officers, maintaining a tamper-evident audit trail for accountability."
        />

        {/* 10. Responsible Use & Contact */}
        <PolicySection
          id="contact"
          icon={ShieldCheck}
          title="10. Responsible Use & Project Inquiries"
          badge="Contact"
          prototypeText="SANKET Bharat is developed for educational, evaluation, and disaster resilience design demonstration purposes. Feedback on platform accessibility, ethical AI workflows, and data governance is welcomed."
          productionText="Production contact channels would provide dedicated Data Protection Officer (DPO) access points, citizen rights request workflows (access, correction, erasure), and formal government incident response escalations."
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
