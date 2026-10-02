import { geoMercator, geoPath } from 'd3-geo'
import statesGeo from '@/public/geo/india-states.json'
import type { Incident, IncidentSeverity, IncidentKind } from '@/lib/incident-types'
import type { FeatureCollection, Geometry } from 'geojson'

/* --------------------------- Projection geometry --------------------------- */

/** SVG user-space dimensions. The map scales responsively via `viewBox`. */
export const MAP_WIDTH = 760
export const MAP_HEIGHT = 840

// Bundled GeoJSON is static source data, not unvalidated user input.
const collection = statesGeo as FeatureCollection<Geometry, { name: string }>

/**
 * A Mercator projection fitted to the India state outlines so the same
 * transform drives both the landmass paths and the incident markers —
 * markers therefore land on true geographic positions, never hardcoded pixels.
 */
const projection = geoMercator().fitExtent(
  [
    [28, 28],
    [MAP_WIDTH - 28, MAP_HEIGHT - 28],
  ],
  collection,
)

const toPath = geoPath(projection)

export type StatePath = { name: string; d: string }

/** Precomputed state outlines — built once at module load, never per render. */
export const STATE_PATHS: StatePath[] = collection.features
  .map((feature) => ({ name: feature.properties.name, d: toPath(feature) ?? '' }))
  .filter((state) => state.d.length > 0)

/** Projects true lng/lat onto SVG user space. */
export function projectPoint(lng: number | null, lat: number | null) {
  if (typeof lng !== 'number' || typeof lat !== 'number' || !Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    return null
  }
  const point = projection([lng, lat])
  if (!point) return null
  // Round to 2 decimal places to guarantee deterministic float rendering across SSR and client
  const x = Math.round(point[0] * 100) / 100
  const y = Math.round(point[1] * 100) / 100
  return { x, y }
}

export type PlottedIncident = Incident & { x: number; y: number }

/** Projects an incident's geo coordinates onto map canvas coordinates. */
export function plotIncident(incident: Incident): PlottedIncident | null {
  const point = projectPoint(incident.lng, incident.lat)
  return point ? { ...incident, x: point.x, y: point.y } : null
}

/** Projects all provided incidents onto map canvas coordinates. */
export function plotIncidents(incidents: Incident[]): PlottedIncident[] {
  return incidents.flatMap((incident) => {
    const plotted = plotIncident(incident)
    return plotted ? [plotted] : []
  })
}

/* ------------------------------- Filter meta ------------------------------- */

export type Severity = IncidentSeverity
export type Kind = IncidentKind

export const SEVERITY_META: Record<
  Severity,
  { label: string; color: string; radius: number }
> = {
  critical: { label: 'Critical', color: '#ff4d5e', radius: 7 },
  high: { label: 'High', color: '#ff9800', radius: 5.5 },
  moderate: { label: 'Moderate', color: '#eab308', radius: 4.5 },
  low: { label: 'Low', color: '#06b6d4', radius: 3.5 },
}

export const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'moderate', 'low']

/** Icon names resolved against a lucide map inside client components. */
export const KIND_META: Record<Kind, { label: string; icon: string }> = {
  flood: { label: 'Flood', icon: 'Waves' },
  cyclone: { label: 'Cyclone', icon: 'Tornado' },
  quake: { label: 'Earthquake', icon: 'Activity' },
  fire: { label: 'Wildfire', icon: 'Flame' },
  landslide: { label: 'Landslide', icon: 'Mountain' },
  other: { label: 'Incident', icon: 'AlertTriangle' },
}

export const KIND_ORDER: Kind[] = ['flood', 'cyclone', 'quake', 'fire', 'landslide', 'other']

export type SeverityFilter = Severity | 'all'
export type KindFilter = Kind | 'all'

export function filterIncidents(
  incidents: PlottedIncident[],
  severity: SeverityFilter,
  kind: KindFilter,
) {
  return incidents.filter(
    (incident) =>
      (severity === 'all' || incident.severity === severity) &&
      (kind === 'all' || incident.kind === kind),
  )
}

/** Parses the `affected` display string ("184,000") back into a number. */
export function parseAffected(value: string | number) {
  if (typeof value === 'number') return value
  if (!value) return 0
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ''))
  return isNaN(parsed) ? 0 : parsed
}
