import * as THREE from 'three'

export type GeoPoint = { lat: number; lng: number }

/**
 * Converts geographic coordinates to a point on a sphere, matching the UV
 * layout of THREE.SphereGeometry so markers land on the right landmass.
 */
export function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

/**
 * Builds a smooth arc that lifts off the sphere between two coordinates,
 * used for the network / data-transfer lines around the globe.
 */
export function buildArc(
  from: GeoPoint,
  to: GeoPoint,
  radius: number,
  segments = 64,
) {
  const start = latLngToVector3(from.lat, from.lng, radius)
  const end = latLngToVector3(to.lat, to.lng, radius)

  // Arc height scales with the angular distance between the endpoints.
  const angle = start.angleTo(end)
  const lift = 1 + angle * 0.38

  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * lift)

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
  return { curve, points: curve.getPoints(segments) }
}
