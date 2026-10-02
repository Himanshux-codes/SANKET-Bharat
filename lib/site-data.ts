import { deriveMetadata, metadata, tagRecord, type WorkflowMetadata } from './data-mode'
import type { GeoPoint } from '@/lib/geo'

/**
 * Primary routes. `exact` marks links that should only read as active on an
 * exact pathname match (otherwise `/` would stay active on every route).
 */
export const NAV_LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Demo Map', href: '/live-map', exact: false },
  { label: 'Dashboard', href: '/dashboard', exact: false },
  { label: 'Demo Analysis', href: '/ai-analysis', exact: false },
  { label: 'Admin', href: '/admin', exact: false },
] as const

/** Application routes reachable from the footer and CTAs. */
export const APP_ROUTES = [
  { label: 'Live Map', href: '/live-map' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Try Demo Intake', href: '/report' },
  { label: 'AI Analysis', href: '/ai-analysis' },
  { label: 'Admin', href: '/admin' },
] as const

/** Homepage in-page sections, linked from the footer. */
export const HOME_SECTIONS = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Statistics', href: '/#statistics' },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
] as const

/* ---------------------------------- Globe --------------------------------- */

export type GlobeMarker = GeoPoint & WorkflowMetadata & {
  city: string
  kind: 'flood' | 'fire' | 'quake' | 'cyclone'
}

export const GLOBE_MARKERS: GlobeMarker[] = ([
  { city: 'Mumbai', lat: 19.076, lng: 72.877, kind: 'flood' },
  { city: 'Chennai', lat: 13.083, lng: 80.27, kind: 'cyclone' },
  { city: 'Kathmandu', lat: 27.717, lng: 85.324, kind: 'quake' },
  { city: 'Jakarta', lat: -6.208, lng: 106.846, kind: 'flood' },
  { city: 'Tokyo', lat: 35.676, lng: 139.65, kind: 'quake' },
  { city: 'Los Angeles', lat: 34.052, lng: -118.244, kind: 'fire' },
  { city: 'Lisbon', lat: 38.722, lng: -9.139, kind: 'fire' },
  { city: 'Nairobi', lat: -1.286, lng: 36.817, kind: 'flood' },
  { city: 'Sydney', lat: -33.868, lng: 151.209, kind: 'fire' },
  { city: 'SÃ£o Paulo', lat: -23.55, lng: -46.633, kind: 'flood' },
  { city: 'Istanbul', lat: 41.008, lng: 28.978, kind: 'quake' },
  { city: 'Manila', lat: 14.599, lng: 120.984, kind: 'cyclone' },
] as const).map((record, index) => tagRecord(record, metadata('demo', 'illustration', 'GLOBE_MARKERS:' + index)))

/** Coordination links drawn as glowing arcs between response hubs. */
export const GLOBE_ARCS: [GeoPoint, GeoPoint][] = [
  [{ lat: 19.076, lng: 72.877 }, { lat: 38.722, lng: -9.139 }],
  [{ lat: 13.083, lng: 80.27 }, { lat: 35.676, lng: 139.65 }],
  [{ lat: 28.614, lng: 77.209 }, { lat: -1.286, lng: 36.817 }],
  [{ lat: 34.052, lng: -118.244 }, { lat: 35.676, lng: 139.65 }],
  [{ lat: -23.55, lng: -46.633 }, { lat: 38.722, lng: -9.139 }],
  [{ lat: 28.614, lng: 77.209 }, { lat: -33.868, lng: 151.209 }],
  [{ lat: 14.599, lng: 120.984 }, { lat: 19.076, lng: 72.877 }],
]

/* --------------------------------- Features -------------------------------- */

export const FEATURES = [
  {
    "icon": "Radar",
    "title": "Local demo intake",
    "description": "A web form adds examples to this browser. No authority or server receives them.",
    "metric": "DEMO ONLY"
  },
  {
    "icon": "Copy",
    "title": "Manual duplicate review",
    "description": "Review labels are local examples. No automatic similarity or duplicate probability is computed.",
    "metric": "HUMAN REVIEW DEMO"
  },
  {
    "icon": "ShieldAlert",
    "title": "Evidence inspection",
    "description": "Inspect clearly labelled fictional sources. Authenticity is not determined.",
    "metric": "NOT VERIFIED"
  },
  {
    "icon": "TrendingUp",
    "title": "User-selected urgency",
    "description": "Urgency comes from user input or seed scenarios, not a severity prediction model.",
    "metric": "NOT MODEL INFERENCE"
  },
  {
    "icon": "Boxes",
    "title": "Recommendation review",
    "description": "Approve, edit or reject a template proposal locally. No assignment or inventory exists.",
    "metric": "NO DISPATCH"
  },
  {
    "icon": "Home",
    "title": "Map visualization",
    "description": "Static India boundaries and demo coordinates; no shelter directory or safe-route computation.",
    "metric": "ILLUSTRATIVE MAP"
  },
  {
    "icon": "BellRing",
    "title": "Local history",
    "description": "Local events appear in a browser history. No notification or emergency communication is sent.",
    "metric": "BROWSER ONLY"
  },
  {
    "icon": "Languages",
    "title": "Partial bilingual interface",
    "description": "Some navigation, forms and labels support English and Hindi. Speech and other languages are unavailable.",
    "metric": "ENGLISH / HINDI"
  }
] as const

/* ------------------------------- How it works ------------------------------ */

export const WORKFLOW = [
  {
    "step": "01",
    "title": "Enter a demo report",
    "description": "Use synthetic details only. Browser persistence is local.",
    "icon": "Smartphone",
    "stageLabel": "INTAKE"
  },
  {
    "step": "02",
    "title": "Inspect input",
    "description": "Hazard and urgency are user-selected; no AI verification occurs.",
    "icon": "ScanSearch",
    "stageLabel": "ANALYSIS"
  },
  {
    "step": "03",
    "title": "Review illustrative sources",
    "description": "Seed sources and social messages are fictional and cannot corroborate a real report.",
    "icon": "Gauge",
    "stageLabel": "EVIDENCE"
  },
  {
    "step": "04",
    "title": "Try simulated review",
    "description": "Local review buttons are not authenticated authority decisions.",
    "icon": "Siren",
    "stageLabel": "HUMAN REVIEW"
  },
  {
    "step": "05",
    "title": "Keep local history",
    "description": "Inspect the local demo history. No teams, alerts or messages are sent.",
    "icon": "Truck",
    "stageLabel": "COORDINATION"
  }
] as const

/* -------------------------------- Dashboard -------------------------------- */

export const DASHBOARD_WIDGETS = ([
  {
    "label": "Incident volume",
    "value": "Not available",
    "delta": "No operational measurement",
    "trend": "flat",
    "icon": "Siren",
    "tone": "danger"
  },
  {
    "label": "Verified reports",
    "value": "Not available",
    "delta": "No operational measurement",
    "trend": "flat",
    "icon": "BadgeCheck",
    "tone": "primary"
  },
  {
    "label": "Assigned teams",
    "value": "Not available",
    "delta": "No operational measurement",
    "trend": "flat",
    "icon": "Users",
    "tone": "accent"
  },
  {
    "label": "Shelter capacity",
    "value": "Not available",
    "delta": "No operational measurement",
    "trend": "flat",
    "icon": "Home",
    "tone": "success"
  },
  {
    "label": "Medical inventory",
    "value": "Not available",
    "delta": "No operational measurement",
    "trend": "flat",
    "icon": "HeartPulse",
    "tone": "warning"
  },
  {
    "label": "Model confidence",
    "value": "Not available",
    "delta": "No operational measurement",
    "trend": "flat",
    "icon": "BrainCircuit",
    "tone": "primary"
  }
] as const).map((row, index) => tagRecord(row, metadata('demo', 'illustration', 'DASHBOARD_WIDGETS:' + index)))

export const INCIDENT_TIMESERIES = ([
  { time: '00:00', reports: 210, verified: 168, alerts: 41 },
  { time: '03:00', reports: 168, verified: 132, alerts: 28 },
  { time: '06:00', reports: 342, verified: 288, alerts: 64 },
  { time: '09:00', reports: 618, verified: 540, alerts: 118 },
  { time: '12:00', reports: 794, verified: 702, alerts: 156 },
  { time: '15:00', reports: 1042, verified: 928, alerts: 204 },
  { time: '18:00', reports: 876, verified: 790, alerts: 172 },
  { time: '21:00', reports: 512, verified: 452, alerts: 96 },
] as const).map((row, index) => tagRecord(row, metadata('demo', 'illustration', 'INCIDENT_TIMESERIES:' + index)))

export const RESPONSE_BY_REGION = ([
  { region: 'Kerala', minutes: 7.2, incidents: 128 },
  { region: 'Assam', minutes: 9.8, incidents: 164 },
  { region: 'Odisha', minutes: 8.1, incidents: 142 },
  { region: 'Gujarat', minutes: 6.4, incidents: 96 },
  { region: 'Bihar', minutes: 11.3, incidents: 178 },
  { region: 'Uttarakhand', minutes: 12.6, incidents: 74 },
] as const).map((row, index) => tagRecord(row, metadata('demo', 'illustration', 'RESPONSE_BY_REGION:' + index)))

export const DISASTER_MIX = ([
  { name: 'Flood', value: 42, color: 'var(--chart-1)' },
  { name: 'Cyclone', value: 23, color: 'var(--chart-2)' },
  { name: 'Wildfire', value: 18, color: 'var(--chart-5)' },
  { name: 'Earthquake', value: 11, color: 'var(--chart-3)' },
  { name: 'Landslide', value: 6, color: 'var(--chart-4)' },
] as const).map((row, index) => tagRecord(row, metadata('demo', 'illustration', 'DISASTER_MIX:' + index)))

/** 7 days x 8 three-hour buckets of incident pressure, 0â€“100. */
export const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const HEATMAP_SLOTS = ['00', '03', '06', '09', '12', '15', '18', '21']
export const HEATMAP_VALUES: number[][] = [
  [12, 18, 34, 52, 61, 48, 30, 19],
  [16, 22, 41, 66, 78, 59, 38, 24],
  [21, 27, 48, 74, 88, 71, 45, 28],
  [18, 24, 44, 69, 82, 66, 41, 26],
  [26, 33, 57, 86, 96, 80, 53, 34],
  [31, 38, 62, 91, 99, 87, 61, 40],
  [19, 25, 43, 64, 76, 63, 42, 27],
]

/* -------------------------------- India map -------------------------------- */

export type IndiaIncident = WorkflowMetadata & {
  id: string
  city: string
  state: string
  kind: 'flood' | 'fire' | 'quake' | 'cyclone'
  severity: 'critical' | 'high' | 'moderate'
  /** True geographic coordinates, projected onto the map at render time. */
  lng: number
  lat: number
  affected: string
  teams: number
  confidence: number
  updated: string
}

export const INDIA_INCIDENTS: IndiaIncident[] = ([
  {
    id: 'INC-4821',
    city: 'Guwahati',
    state: 'Assam',
    kind: 'flood',
    severity: 'critical',
    lng: 91.7362,
    lat: 26.1445,
    affected: '184,000',
    teams: 24,
    confidence: 97,
    updated: '2 min ago',
  },
  {
    id: 'INC-4816',
    city: 'Puri',
    state: 'Odisha',
    kind: 'cyclone',
    severity: 'critical',
    lng: 85.8312,
    lat: 19.8135,
    affected: '211,500',
    teams: 31,
    confidence: 95,
    updated: '4 min ago',
  },
  {
    id: 'INC-4809',
    city: 'Kochi',
    state: 'Kerala',
    kind: 'flood',
    severity: 'high',
    lng: 76.2673,
    lat: 9.9312,
    affected: '62,300',
    teams: 14,
    confidence: 93,
    updated: '9 min ago',
  },
  {
    id: 'INC-4802',
    city: 'Dehradun',
    state: 'Uttarakhand',
    kind: 'quake',
    severity: 'high',
    lng: 78.0322,
    lat: 30.3165,
    affected: '38,900',
    teams: 11,
    confidence: 91,
    updated: '12 min ago',
  },
  {
    id: 'INC-4795',
    city: 'Nagpur',
    state: 'Maharashtra',
    kind: 'fire',
    severity: 'moderate',
    lng: 79.0882,
    lat: 21.1458,
    affected: '9,400',
    teams: 6,
    confidence: 88,
    updated: '18 min ago',
  },
  {
    id: 'INC-4788',
    city: 'Bhuj',
    state: 'Gujarat',
    kind: 'quake',
    severity: 'moderate',
    lng: 69.6669,
    lat: 23.242,
    affected: '14,200',
    teams: 8,
    confidence: 90,
    updated: '23 min ago',
  },
  {
    id: 'INC-4781',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    kind: 'cyclone',
    severity: 'high',
    lng: 83.2185,
    lat: 17.6868,
    affected: '97,800',
    teams: 19,
    confidence: 94,
    updated: '27 min ago',
  },
  {
    id: 'INC-4774',
    city: 'Patna',
    state: 'Bihar',
    kind: 'flood',
    severity: 'critical',
    lng: 85.1376,
    lat: 25.5941,
    affected: '156,700',
    teams: 22,
    confidence: 96,
    updated: '31 min ago',
  },
  {
    id: 'INC-4767',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    kind: 'fire',
    severity: 'moderate',
    lng: 77.1734,
    lat: 31.1048,
    affected: '4,100',
    teams: 5,
    confidence: 86,
    updated: '38 min ago',
  },
  {
    id: 'INC-4760',
    city: 'Chennai',
    state: 'Tamil Nadu',
    kind: 'flood',
    severity: 'high',
    lng: 80.2707,
    lat: 13.0827,
    affected: '74,600',
    teams: 17,
    confidence: 92,
    updated: '44 min ago',
  },
] as const).map((record, index) => tagRecord(record, metadata('demo', 'illustration', 'INDIA_INCIDENTS:' + index)))

/**
 * Operational response status per incident, keyed by incident id. Kept separate
 * from `INDIA_INCIDENTS` so the live map data stays untouched.
 */
export type IncidentStatus = 'escalating' | 'dispatched' | 'monitoring' | 'contained'

export const INCIDENT_STATUS: Record<string, IncidentStatus> = {
  'INC-4821': 'escalating',
  'INC-4816': 'escalating',
  'INC-4809': 'dispatched',
  'INC-4802': 'dispatched',
  'INC-4795': 'contained',
  'INC-4788': 'monitoring',
  'INC-4781': 'dispatched',
  'INC-4774': 'escalating',
  'INC-4767': 'contained',
  'INC-4760': 'monitoring',
}

export const STATUS_META: Record<
  IncidentStatus,
  { label: string; color: string }
> = {
  escalating: { label: 'Escalating', color: 'var(--destructive)' },
  dispatched: { label: 'Legacy scenario state', color: 'var(--warning)' },
  monitoring: { label: 'Monitoring', color: 'var(--accent)' },
  contained: { label: 'Contained', color: 'var(--success)' },
}

/**
 * Response-time analytics summary shown beside the per-state breakdown.
 * Simulated prototype values â€” not measured operational results.
 */
export const RESPONSE_SLA = ([
  {
    "label": "Measured response time",
    "value": "Not available",
    "delta": "No dispatch workflow"
  },
  {
    "label": "Delivery latency",
    "value": "Not available",
    "delta": "No communication service"
  }
] as const).map((row, index) => tagRecord(row, metadata('demo', 'illustration', 'RESPONSE_SLA:' + index)))

import type { AiAdvisory, Incident } from '@/lib/incident-types'

export type { AiAdvisory }

export const PROTOTYPE_ADVISORIES: AiAdvisory[] = []

/**
 * Filter advisories for a given incident ID.
 * Returns only the advisories belonging to the specified incident.
 */
export function getAdvisoriesForIncident(
  incidentId: string | null | undefined,
  incident?: Incident | null
): AiAdvisory[] {
  if (!incidentId || !incident || incident.dataMode === 'pilot') return []

  const directMatches = PROTOTYPE_ADVISORIES.filter((a) => a.incidentId === incidentId)
  if (directMatches.length > 0 && incident.dataMode === 'demo' && incident.provenance.origin === 'seed') return directMatches

  // If dynamic citizen intake incident has recommendation payload
  if (incident?.aiRecommendation) {
    const list: AiAdvisory[] = []
    if (incident.aiRecommendation.action) {
      list.push({
        ...deriveMetadata([incident], incident.id + '/advisory'),
        incidentId,
        severity: incident.severity || 'high',
        message: `Template suggestion: ${incident.aiRecommendation.action}`,
        time: incident.updated || 'Just now',
      })
    }
    if (incident.aiRecommendation.reason) {
      list.push({
        ...deriveMetadata([incident], incident.id + '/advisory-reason'),
        incidentId,
        severity: incident.severity === 'critical' ? 'high' : 'moderate',
        message: `Template explanation: ${incident.aiRecommendation.reason}`,
        time: 'Just now',
      })
    }
    return list
  }

  return []
}

/** Legacy alias for backward compatibility */
export const AI_ALERTS = PROTOTYPE_ADVISORIES.slice(0, 5).map((a) => ({
  ...deriveMetadata([a], a.provenance.sourceId + '/alert'),
  level: a.severity,
  text: a.message,
  time: a.time,
}))


/* -------------------------------- Statistics ------------------------------- */

export const STATS = ([
  {
    "label": "Emergency outcomes",
    "value": "Not measured",
    "description": "No rescue or lives-assisted results have been established.",
    "icon": "HeartHandshake"
  },
  {
    "label": "Reports processed",
    "value": "Not measured",
    "description": "Local examples do not establish operational throughput.",
    "icon": "FileCheck2"
  },
  {
    "label": "Model accuracy",
    "value": "Not available",
    "description": "The CSV lab measures a keyword baseline on uploaded labels only.",
    "icon": "Target"
  },
  {
    "label": "Response time",
    "value": "Not measured",
    "description": "No dispatch or authority notification pipeline exists.",
    "icon": "Timer"
  },
  {
    "label": "Resource inventory",
    "value": "Not available",
    "description": "No maintained resource or shelter inventory is connected.",
    "icon": "LifeBuoy"
  }
] as const).map((record, index) => tagRecord(record, metadata('demo', 'illustration', 'STATS:' + index)))

/* ------------------------------- Testimonials ------------------------------ */

export const TESTIMONIALS = [
  {
    quote:
      'During the Brahmaputra floods we were drowning in duplicate calls. SANKET Bharat collapsed 4,000 reports into 61 real incidents and told us which ones would get worse. That is the difference between guessing and deciding.',
    name: 'Ananya Deshmukh',
    role: 'District Collector, Kamrup',
    org: 'Assam State Disaster Management',
    initials: 'AD',
  },
  {
    quote:
      'The severity score is the first model output my field commanders actually trust. It explains itself â€” rainfall, population, road access â€” so nobody argues about the ranking at 3am.',
    name: 'Group Captain Rohit Menon',
    role: 'Operations Lead',
    org: 'National Disaster Response Force',
    initials: 'RM',
  },
  {
    quote:
      'We cut average dispatch time from 26 minutes to 8. The optimiser accounts for washed-out bridges that our own maps had not updated in two years.',
    name: 'Fatima Qureshi',
    role: 'Emergency Coordinator',
    org: 'Kerala State Control Room',
    initials: 'FQ',
  },
  {
    quote:
      'Fake rescue requests used to send boats to empty streets. The forensics layer quarantined 1,100 fabricated reports in one cyclone week without blocking a single genuine one.',
    name: 'Dr. Vikram Iyer',
    role: 'Head of Risk Analytics',
    org: 'Indian Institute of Disaster Studies',
    initials: 'VI',
  },
  {
    quote:
      'Alerts went out in Odia, Bengali and Hindi simultaneously. For the first time the last village on the list heard the warning at the same moment as the district capital.',
    name: 'Sunita Patra',
    role: 'Community Resilience Officer',
    org: 'Odisha Relief Commission',
    initials: 'SP',
  },
  {
    quote:
      'Integration took a weekend. It reads our existing sensor feeds and pushes into the systems the state already owns, which is why it actually got deployed.',
    name: 'Arjun Shetty',
    role: 'Chief Technology Officer',
    org: 'UrbanSafe Infrastructure',
    initials: 'AS',
  },
] as const

/* ----------------------------------- Team ---------------------------------- */

export const TEAM = [
  {
    name: 'Himanshu Raj',
    role: 'Team Lead & AI Architecture',
    focus: 'Severity prediction models, pipeline orchestration',
    initials: 'HR',
    accent: 'primary' as const,
  },
  {
    name: 'Priya Nandakumar',
    role: 'Machine Learning Engineer',
    focus: 'Duplicate clustering, multilingual NLP',
    initials: 'PN',
    accent: 'accent' as const,
  },
  {
    name: 'Kabir Malhotra',
    role: 'Frontend & Visualisation',
    focus: 'Command center UI, 3D geospatial rendering',
    initials: 'KM',
    accent: 'violet' as const,
  },
  {
    name: 'Sneha Iyer',
    role: 'Backend & Infrastructure',
    focus: 'FastAPI services, real-time event streaming',
    initials: 'SI',
    accent: 'success' as const,
  },
  {
    name: 'Aditya Verma',
    role: 'Geospatial Data Science',
    focus: 'Satellite ingestion, hazard polygon modelling',
    initials: 'AV',
    accent: 'accent' as const,
  },
  {
    name: 'Meera Krishnan',
    role: 'Product & Field Research',
    focus: 'Responder workflows, accessibility research',
    initials: 'MK',
    accent: 'primary' as const,
  },
] as const

/* ----------------------------------- About --------------------------------- */

export const ABOUT = {
  "mission": "SANKET Bharat explores how people could review fragmented crisis reports while retaining human responsibility.",
  "body": [
    "This repository is a browser-only demonstration with seeded scenarios, local input, maps, review controls and a CSV keyword evaluation lab.",
    "AI assists; authorized humans decide is the intended production principle. Authentication and operational decisions are not implemented here."
  ],
  "pillars": [
    {
      "title": "Evidence before conclusions",
      "description": "Illustrative source material is labelled. Authenticity and hazard risk remain unassessed.",
      "icon": "ScanSearch"
    },
    {
      "title": "Visible limitations",
      "description": "Templates and rule scores are distinguished from validated model inference.",
      "icon": "BrainCircuit"
    },
    {
      "title": "Honest local storage",
      "description": "localStorage and IndexedDB persist in this browser until cleared; offline transfer remains local.",
      "icon": "Languages"
    },
    {
      "title": "Human responsibility",
      "description": "No connected authority, dispatch gateway or communications service. Pilot mode is unavailable.",
      "icon": "Boxes"
    }
  ]
} as const

/* ----------------------------------- FAQ ----------------------------------- */

export const FAQS = [
  {
    "question": "Is this an emergency reporting service?",
    "answer": "No. This is a demo. Use synthetic data only. No authority receives a submission and no help is coordinated by this application. Use established emergency services for real emergencies."
  },
  {
    "question": "Does AI verify authenticity or severity?",
    "answer": "No. Intake urgency is selected by the user. Suggestions are templates. The separate CSV lab uses English keyword rules; it does not validate report truth, urgency or safe response."
  },
  {
    "question": "What happens offline?",
    "answer": "With the app already loaded, examples and optional image Blobs can be queued in IndexedDB. While the app is open, they can be copied into local demo state. Nothing is uploaded to a server. Cold-start offline loading and background delivery are not implemented."
  },
  {
    "question": "Are any agencies or social services connected?",
    "answer": "No government, sensor, social, messaging or emergency dispatch integration is implemented. Social messages and seed telemetry are fictional examples."
  },
  {
    "question": "What languages and accessibility are supported?",
    "answer": "Parts of the interface support English and Hindi. Speech input/output and 22-language support are unavailable. Accessibility and device behavior require further validation; no WCAG certification is claimed."
  },
  {
    "question": "Where are my details stored?",
    "answer": "Demo records and local history use localStorage. Queued examples and offline image Blobs use IndexedDB. Language uses sessionStorage. Persistent data remains until browser data is cleared; there is no automatic expiry, account access control or implemented application encryption."
  },
  {
    "question": "Can I use pilot mode?",
    "answer": "No. Types describe a future pilot boundary, but this app rejects pilot records. Real-data permissions, backend persistence and operational workflows are not implemented."
  }
] as const

/* --------------------------------- Footer ---------------------------------- */

export const FOOTER_SECTIONS = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Demo Dashboard', href: '/dashboard' },
      { label: 'Disaster Map', href: '/live-map' },
    ],
  },
  {
    title: 'Application',
    links: [
      { label: 'Report Emergency', href: '/report' },
      { label: 'AI Analysis', href: '/ai-analysis' },
      { label: 'Admin Console', href: '/admin' },
      { label: 'Statistics', href: '/#statistics' },
    ],
  },
  {
    title: 'Organisation',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Prototype limitations', href: '/#faq' },
      { label: 'Evaluation limitations', href: '/#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/privacy-policy#overview' },
      { label: 'Data Retention', href: '/privacy-policy#data-retention' },
      { label: 'Accessibility', href: '/privacy-policy#contact' },
    ],
  },
] as const



export const HEATMAP_METADATA = metadata('demo', 'illustration', 'fixed-heatmap')
