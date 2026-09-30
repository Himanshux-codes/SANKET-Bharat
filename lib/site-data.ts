import type { GeoPoint } from '@/lib/geo'

/**
 * Primary routes. `exact` marks links that should only read as active on an
 * exact pathname match (otherwise `/` would stay active on every route).
 */
export const NAV_LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Live Map', href: '/live-map', exact: false },
  { label: 'Dashboard', href: '/dashboard', exact: false },
  { label: 'AI Analysis', href: '/ai-analysis', exact: false },
  { label: 'Admin', href: '/admin', exact: false },
] as const

/** Application routes reachable from the footer and CTAs. */
export const APP_ROUTES = [
  { label: 'Live Map', href: '/live-map' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Report Emergency', href: '/report' },
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

export type GlobeMarker = GeoPoint & {
  city: string
  kind: 'flood' | 'fire' | 'quake' | 'cyclone'
}

export const GLOBE_MARKERS: GlobeMarker[] = [
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
]

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
    icon: 'Radar',
    title: 'AI Disaster Detection',
    description:
      'Multimodal models watch satellite feeds, seismic sensors, weather APIs and social signals to surface an emerging event and prioritize it for human authority review.',
    metric: 'AI-ASSISTED TRIAGE',
  },
  {
    icon: 'Copy',
    title: 'Duplicate Report Detection',
    description:
      'Semantic embeddings cluster thousands of citizen submissions describing the same incident into one canonical case, so responders see events, not noise.',
    metric: 'Design target: 94% dedupe',
  },
  {
    icon: 'ShieldAlert',
    title: 'Fake Report Identification',
    description:
      'Image forensics, reverse geolocation and reporter-trust scoring quarantine misinformation before it can misdirect a rescue convoy.',
    metric: 'Design target: <1%',
  },
  {
    icon: 'TrendingUp',
    title: 'Severity Prediction',
    description:
      'Gradient-boosted models blend population density, terrain, rainfall and infrastructure fragility into a live 0â€“100 priority score per incident.',
    metric: 'AI score: 96.4%',
  },
  {
    icon: 'Boxes',
    title: 'Resource Allocation',
    description:
      'A constrained optimiser assigns boats, ambulances, drones and personnel across simultaneous incidents to minimise total time-to-reach.',
    metric: 'Design model target',
  },
  {
    icon: 'Home',
    title: 'Shelter Recommendation',
    description:
      'Routes each affected household to the nearest shelter with estimated capacity, accessibility and medical support along a flood-safe path.',
    metric: '2.4M capacity design target',
  },
  {
    icon: 'BellRing',
    title: 'Emergency Notifications',
    description:
      'Geo-fenced push, SMS and cell-broadcast alerts reach every device inside the hazard polygon with escalation tiers for authorities.',
    metric: 'Target: <3s alert fan-out',
  },
  {
    icon: 'Languages',
    title: 'Multilingual Support',
    description:
      'Reports arrive and alerts go out in 22 Indian languages plus English, with speech-to-text for callers who cannot type.',
    metric: 'Planned: 22 languages',
  },
] as const

/* ------------------------------- How it works ------------------------------ */

export const WORKFLOW = [
  {
    step: '01',
    title: 'Citizen Reports Incident',
    description:
      'A resident submits photos, voice notes and GPS through the app, web form or a WhatsApp message. Offline submissions queue and sync when signal returns.',
    icon: 'Smartphone',
    stageLabel: 'INTAKE',
  },
  {
    step: '02',
    title: 'AI Evaluates Report',
    description:
      'Vision and language models analyze imagery against satellite passes and nearby submissions, highlighting duplicate patterns and anomalies for authority review.',
    icon: 'ScanSearch',
    stageLabel: 'ANALYSIS',
  },
  {
    step: '03',
    title: 'Priority Score Generated',
    description:
      'The severity engine fuses hazard intensity with exposed population and infrastructure fragility to produce a single defensible priority score.',
    icon: 'Gauge',
    stageLabel: 'EVIDENCE',
  },
  {
    step: '04',
    title: 'Human Authority Review',
    description:
      'District control rooms review the ranked incident with an explainable AI recommendation before authorizing any dispatch.',
    icon: 'Siren',
    stageLabel: 'HUMAN REVIEW',
  },
  {
    step: '05',
    title: 'Rescue Teams Dispatched',
    description:
      'Optimised routes reach field units on mobile, with two-way status updates streaming back into the command center.',
    icon: 'Truck',
    stageLabel: 'COORDINATION',
  },
] as const

/* -------------------------------- Dashboard -------------------------------- */

export const DASHBOARD_WIDGETS = [
  {
    label: 'Active Emergencies',
    value: 47,
    delta: '+6 in last hour',
    trend: 'up' as const,
    icon: 'Siren',
    tone: 'danger' as const,
  },
  {
    label: 'Verified Reports',
    value: 12480,
    delta: '+312 today',
    trend: 'up' as const,
    icon: 'BadgeCheck',
    tone: 'primary' as const,
  },
  {
    label: 'Rescue Teams',
    value: 218,
    delta: '164 deployed',
    trend: 'up' as const,
    icon: 'Users',
    tone: 'accent' as const,
  },
  {
    label: 'Safe Shelters',
    value: 936,
    delta: '78% capacity free',
    trend: 'flat' as const,
    icon: 'Home',
    tone: 'success' as const,
  },
  {
    label: 'Medical Resources',
    value: 5412,
    delta: 'âˆ’94 units consumed',
    trend: 'down' as const,
    icon: 'HeartPulse',
    tone: 'warning' as const,
  },
  {
    label: 'AI Confidence',
    value: 96.4,
    suffix: '%',
    decimals: 1,
    delta: 'AI model output',
    trend: 'up' as const,
    icon: 'BrainCircuit',
    tone: 'primary' as const,
  },
] as const

export const INCIDENT_TIMESERIES = [
  { time: '00:00', reports: 210, verified: 168, alerts: 41 },
  { time: '03:00', reports: 168, verified: 132, alerts: 28 },
  { time: '06:00', reports: 342, verified: 288, alerts: 64 },
  { time: '09:00', reports: 618, verified: 540, alerts: 118 },
  { time: '12:00', reports: 794, verified: 702, alerts: 156 },
  { time: '15:00', reports: 1042, verified: 928, alerts: 204 },
  { time: '18:00', reports: 876, verified: 790, alerts: 172 },
  { time: '21:00', reports: 512, verified: 452, alerts: 96 },
]

export const RESPONSE_BY_REGION = [
  { region: 'Kerala', minutes: 7.2, incidents: 128 },
  { region: 'Assam', minutes: 9.8, incidents: 164 },
  { region: 'Odisha', minutes: 8.1, incidents: 142 },
  { region: 'Gujarat', minutes: 6.4, incidents: 96 },
  { region: 'Bihar', minutes: 11.3, incidents: 178 },
  { region: 'Uttarakhand', minutes: 12.6, incidents: 74 },
]

export const DISASTER_MIX = [
  { name: 'Flood', value: 42, color: 'var(--chart-1)' },
  { name: 'Cyclone', value: 23, color: 'var(--chart-2)' },
  { name: 'Wildfire', value: 18, color: 'var(--chart-5)' },
  { name: 'Earthquake', value: 11, color: 'var(--chart-3)' },
  { name: 'Landslide', value: 6, color: 'var(--chart-4)' },
]

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

export type IndiaIncident = {
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

export const INDIA_INCIDENTS: IndiaIncident[] = [
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
]

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
  dispatched: { label: 'Teams dispatched', color: 'var(--warning)' },
  monitoring: { label: 'Monitoring', color: 'var(--accent)' },
  contained: { label: 'Contained', color: 'var(--success)' },
}

/**
 * Response-time analytics summary shown beside the per-state breakdown.
 * Simulated prototype values â€” not measured operational results.
 */
export const RESPONSE_SLA = [
  { label: 'Median dispatch (sim.)', value: '8.4 min', delta: 'Target 15 min' },
  { label: 'Fastest region', value: '6.4 min', delta: 'Gujarat' },
  { label: 'Slowest region', value: '12.6 min', delta: 'Uttarakhand' },
  { label: 'Within SLA', value: '94.2%', delta: '+1.8 pts WoW' },
] as const

import type { AiAdvisory, Incident } from '@/lib/incident-types'

export type { AiAdvisory }

export const PROTOTYPE_ADVISORIES: AiAdvisory[] = [
  // INC-4821 â€” Guwahati, Assam (Flood, Critical)
  {
    incidentId: 'INC-4821',
    severity: 'critical',
    message: 'AI assessment indicates Brahmaputra water levels exceeding danger threshold (+1.4m); low-lying wards (4, 7, 11) flagged for human-directed evacuation.',
    time: '2 min ago',
  },
  {
    incidentId: 'INC-4821',
    severity: 'high',
    message: 'Signal pattern detects 14 corroborating citizen reports of transit underpass submergence and road accessibility constraints.',
    time: '6 min ago',
  },
  {
    incidentId: 'INC-4821',
    severity: 'moderate',
    message: 'AI advisory recommends staging 4 NDRF boat units and deploying mobile triage kits at Kanaklata High School shelter sector.',
    time: '14 min ago',
  },

  // INC-4816 â€” Puri, Odisha (Cyclone, Critical)
  {
    incidentId: 'INC-4816',
    severity: 'critical',
    message: 'AI assessment models Cyclone Aarav intensification to Category 3 with projected 2.8m storm surge along beach corridor within 6 hours.',
    time: '4 min ago',
  },
  {
    incidentId: 'INC-4816',
    severity: 'high',
    message: 'Signal pattern suggests evacuation readiness review for zero-elevation habitations along Puri-Konark coastal belt.',
    time: '11 min ago',
  },
  {
    incidentId: 'INC-4816',
    severity: 'moderate',
    message: 'AI advisory recommends verifying multi-purpose cyclone shelter capacities before authority operational escalation.',
    time: '19 min ago',
  },

  // INC-4809 â€” Kochi, Kerala (Flood, High)
  {
    incidentId: 'INC-4809',
    severity: 'high',
    message: 'AI assessment models downstream overflow from controlled Periyar dam discharge affecting Aluva riverbend residential zones.',
    time: '9 min ago',
  },
  {
    incidentId: 'INC-4809',
    severity: 'moderate',
    message: 'Signal pattern suggests localized water stagnation at Edappally; high-clearance pump deployment flagged for authority consideration.',
    time: '16 min ago',
  },
  {
    incidentId: 'INC-4809',
    severity: 'low',
    message: 'AI advisory recommends pre-positioning mobile medical units at Kakkanad Relief Camp for clean water and triage distribution.',
    time: '24 min ago',
  },

  // INC-4802 â€” Dehradun, Uttarakhand (Landslide, High)
  {
    incidentId: 'INC-4802',
    severity: 'high',
    message: 'AI slope stability telemetry detects continued soil creep and debris obstruction along Mussoorie Highway corridor.',
    time: '12 min ago',
  },
  {
    incidentId: 'INC-4802',
    severity: 'high',
    message: 'Signal pattern indicates total carriageway blockage near Kolhukhet km 14; traffic diversion via Hathipaon route flagged for human review.',
    time: '20 min ago',
  },
  {
    incidentId: 'INC-4802',
    severity: 'moderate',
    message: 'AI advisory recommends staging 2 heavy earthmovers for controlled scaling before corridor reopening.',
    time: '28 min ago',
  },

  // INC-4795 â€” Nagpur, Maharashtra (Chemical spill / Fire, Moderate)
  {
    incidentId: 'INC-4795',
    severity: 'moderate',
    message: 'AI air monitoring assessment indicates decreasing solvent vapor concentration following foam blanket deployment at MIDC.',
    time: '18 min ago',
  },
  {
    incidentId: 'INC-4795',
    severity: 'moderate',
    message: 'Signal pattern suggests maintaining a 300m safety cordon around industrial sector perimeter until sensor values normalize.',
    time: '29 min ago',
  },
  {
    incidentId: 'INC-4795',
    severity: 'low',
    message: 'AI advisory recommends continuous ambient VOC sensor patrol for secondary flare-up prevention.',
    time: '42 min ago',
  },

  // INC-4788 â€” Bhuj, Gujarat (Earthquake, Moderate)
  {
    incidentId: 'INC-4788',
    severity: 'moderate',
    message: 'AI seismic assessment classifies M4.6 tremor with low aftershock probability in Kutch fault zone.',
    time: '23 min ago',
  },
  {
    incidentId: 'INC-4788',
    severity: 'low',
    message: 'Signal telemetry indicates minor non-structural plaster damage; critical utility networks remain nominal.',
    time: '35 min ago',
  },
  {
    incidentId: 'INC-4788',
    severity: 'low',
    message: 'AI advisory recommends visual engineering inspection of older masonry bridges and school facilities.',
    time: '47 min ago',
  },

  // INC-4781 â€” Visakhapatnam, Andhra Pradesh (Cyclone, High)
  {
    incidentId: 'INC-4781',
    severity: 'high',
    message: 'AI storm telemetry detects 90 km/h squalls and 4.2m swell impacting outer harbor operations.',
    time: '27 min ago',
  },
  {
    incidentId: 'INC-4781',
    severity: 'high',
    message: 'Signal pattern suggests reinforcing temporary shoreline defenses along Ramakrishna Beach corridor.',
    time: '38 min ago',
  },
  {
    incidentId: 'INC-4781',
    severity: 'moderate',
    message: 'AI advisory recommends suspension of container berth crane operations pending authority review.',
    time: '51 min ago',
  },

  // INC-4774 â€” Patna, Bihar (Flood, Critical)
  {
    incidentId: 'INC-4774',
    severity: 'critical',
    message: 'AI hydrology telemetry records Ganga river 1.1m above danger mark with sluice gate backflow into southern colonies.',
    time: '31 min ago',
  },
  {
    incidentId: 'INC-4774',
    severity: 'high',
    message: 'Signal pattern indicates water accumulation in Rajendra Nagar and Kankarbagh; emergency dewatering pump deployment flagged.',
    time: '43 min ago',
  },
  {
    incidentId: 'INC-4774',
    severity: 'moderate',
    message: 'AI advisory suggests pre-positioning SDRF rescue boats near submerged residential and hospital corridors.',
    time: '56 min ago',
  },

  // INC-4767 â€” Shimla, Himachal Pradesh (Wildfire, Moderate)
  {
    incidentId: 'INC-4767',
    severity: 'moderate',
    message: 'AI satellite thermal feed confirms pine forest ground fire containment near Tara Devi hill.',
    time: '38 min ago',
  },
  {
    incidentId: 'INC-4767',
    severity: 'low',
    message: 'Signal pattern indicates low surface wind speed supporting fire line stability across forest perimeter.',
    time: '49 min ago',
  },
  {
    incidentId: 'INC-4767',
    severity: 'low',
    message: 'AI advisory recommends thermal drone patrol to monitor dry needle smolder points.',
    time: '1 hour ago',
  },

  // INC-4760 â€” Chennai, Tamil Nadu (Flood, High)
  {
    incidentId: 'INC-4760',
    severity: 'high',
    message: 'AI stormwater assessment models elevated Adyar river discharge coinciding with evening high tide window.',
    time: '44 min ago',
  },
  {
    incidentId: 'INC-4760',
    severity: 'moderate',
    message: 'Signal cluster identifies localized waterlogging along Velachery 100ft road pockets; suction units recommended for deployment.',
    time: '54 min ago',
  },
  {
    incidentId: 'INC-4760',
    severity: 'low',
    message: 'AI advisory recommends continuous monitoring of Chembarambakkam reservoir outflow gates.',
    time: '1.1 hours ago',
  },
]

/**
 * Filter advisories for a given incident ID.
 * Returns only the advisories belonging to the specified incident.
 */
export function getAdvisoriesForIncident(
  incidentId: string | null | undefined,
  incident?: Incident | null
): AiAdvisory[] {
  if (!incidentId) return []

  const directMatches = PROTOTYPE_ADVISORIES.filter((a) => a.incidentId === incidentId)
  if (directMatches.length > 0) return directMatches

  // If dynamic citizen intake incident has recommendation payload
  if (incident?.aiRecommendation) {
    const list: AiAdvisory[] = []
    if (incident.aiRecommendation.action) {
      list.push({
        incidentId,
        severity: incident.severity || 'high',
        message: `AI recommendation: ${incident.aiRecommendation.action}`,
        time: incident.updated || 'Just now',
      })
    }
    if (incident.aiRecommendation.reason) {
      list.push({
        incidentId,
        severity: incident.severity === 'critical' ? 'high' : 'moderate',
        message: `Signal pattern suggests: ${incident.aiRecommendation.reason}`,
        time: 'Just now',
      })
    }
    return list
  }

  return []
}

/** Legacy alias for backward compatibility */
export const AI_ALERTS = PROTOTYPE_ADVISORIES.slice(0, 5).map((a) => ({
  level: a.severity,
  text: a.message,
  time: a.time,
}))


/* -------------------------------- Statistics ------------------------------- */

export const STATS = [
  {
    label: 'Lives Assisted',
    value: 2400000,
    display: { suffix: 'M+', divisor: 1000000, decimals: 1 },
    description:
      'Estimated reach for people served with verified alerts, shelter routing or rescue support across coordinated response scenarios.',
    icon: 'HeartHandshake',
  },
  {
    label: 'Reports Processed',
    value: 18700000,
    display: { suffix: 'M', divisor: 1000000, decimals: 1 },
    description:
      'Citizen submissions triaged, deduplicated and scored by the AI pipeline.',
    icon: 'FileCheck2',
  },
  {
    label: 'AI Priority Score',
    value: 96.4,
    display: { suffix: '%', divisor: 1, decimals: 1 },
    description:
      'AI severity-classification confidence score. Not a validated real-world accuracy figure.',
    icon: 'Target',
  },
  {
    label: 'Response Target',
    value: 18,
    display: { suffix: 's', divisor: 1, decimals: 0 },
    description:
      'Target interval from citizen report to authority dispatch notification, based on the platformâ€™s architectural pipeline design.',
    icon: 'Timer',
  },
  {
    label: 'Rescue Missions',
    value: 41200,
    display: { suffix: 'K+', divisor: 1000, decimals: 1 },
    description:
      'Field operations coordinated end-to-end through the command center.',
    icon: 'LifeBuoy',
  },
] as const

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
  mission:
    'SANKET Bharat exists because the deadliest part of a disaster is usually the hour nobody could see clearly. Control rooms drown in duplicate calls while the one report that mattered sits unread in a queue.',
  body: [
    'We built the inbound half of disaster response: millions of citizen observations, satellite passes and sensor readings collapsed into a single verified, deduplicated and ranked incident list that a district officer can act on without translation.',
    'Every score explains itself. Every alert is auditable. The platform is designed to feed the warning systems a state already operates rather than replace them â€” which is the only reason infrastructure like this ever actually gets deployed.',
  ],
  pillars: [
    {
      title: 'Verification before amplification',
      description:
        'No report reaches a commander until image forensics, geospatial plausibility and reporter trust have all weighed in. Outliers go to human review, never silently to the bin.',
      icon: 'ScanSearch',
    },
    {
      title: 'Explainable severity',
      description:
        'Rainfall, population exposure, terrain and road access are surfaced as attributions beside every score, so field teams can argue with the model instead of obeying it.',
      icon: 'BrainCircuit',
    },
    {
      title: 'Built for the last village',
      description:
        '22 scheduled languages, speech intake, SMS fallback and offline map bundles â€” so a total tower outage downgrades the service instead of ending it.',
      icon: 'Languages',
    },
    {
      title: 'Interoperable by default',
      description:
        'A documented REST and WebSocket surface with connectors for state control rooms, cell broadcast and SMS gateways, deployable on-premise for data-residency rules.',
      icon: 'Boxes',
    },
  ],
} as const

/* ----------------------------------- FAQ ----------------------------------- */

export const FAQS = [
  {
    question: 'How does the AI distinguish a fake report from a genuine one?',
    answer:
      'Every submission runs through three independent checks. Image forensics looks for reused or edited media and compares EXIF metadata against the claimed location and time. A geospatial check tests whether the described hazard is physically plausible there â€” a flood report on high ground with no rainfall is downgraded. Finally a reporter-trust score weighs the account history. Reports failing multiple checks are quarantined for human review rather than deleted, so a genuine outlier is never silently dropped.',
  },
  {
    question: 'What data does the severity prediction model actually use?',
    answer:
      'The model combines hazard intensity signals (rainfall accumulation, river gauge levels, seismic magnitude, wind speed) with exposure data (census population density, building footprints, hospital and school locations) and vulnerability factors (terrain slope, drainage capacity, road accessibility, historical damage). Each score ships with a feature attribution breakdown so a commander can see exactly why one incident outranks another.',
  },
  {
    question: 'Can it work when the network is down in an affected area?',
    answer:
      'Yes. The citizen app stores reports locally with GPS and timestamps, then syncs the moment any connectivity returns â€” including via SMS fallback for text-only submissions. On the response side, field teams get a cached offline map bundle with their assigned routes and shelter list, so dispatch instructions survive a total tower outage.',
  },
  {
    question: 'How is this different from existing government alert systems?',
    answer:
      'Most existing systems are one-way broadcast pipes: an official decides, then a message goes out. SANKET Bharat adds the inbound half â€” millions of citizen observations turned into a verified, deduplicated, ranked incident list â€” and closes the loop with resource optimisation and two-way field status. It is designed to feed the alert systems a state already operates rather than replace them.',
  },
  {
    question: 'Which languages and accessibility modes are supported?',
    answer:
      'Reports and alerts work across 22 scheduled Indian languages plus English, with speech-to-text intake for users who cannot type and text-to-speech playback for low-literacy or low-vision users. The interface meets WCAG 2.2 AA contrast requirements, is fully keyboard navigable, and respects reduced-motion preferences throughout.',
  },
  {
    question: 'How do authorities integrate it with their current stack?',
    answer:
      'The concept architecture is designed to integrate via REST and WebSocket interfaces with common state control-room software, SMS gateways and cell broadcast providers in full deployments. All incident flows in this platform run on client-side state for evaluation purposes.',
  },
  {
    question: 'What happens to the personal data in a citizen report?',
    answer:
      'Location and media are retained only as long as the incident stays active, then aggregated and stripped of identifiers. Reporter identity is separated from the incident record and accessible only for follow-up contact with explicit consent. All transport is encrypted, access is role-scoped and audited, and the retention policy is configurable per jurisdiction.',
  },
] as const

/* --------------------------------- Footer ---------------------------------- */

export const FOOTER_SECTIONS = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Live Dashboard', href: '/dashboard' },
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
      { label: 'API Documentation', href: '/#faq' },
      { label: 'Model Cards', href: '/#faq' },
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


