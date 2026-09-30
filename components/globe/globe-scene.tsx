'use client'

import { Line, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { buildArc, latLngToVector3, type GeoPoint } from '@/lib/geo'
import { GLOBE_ARCS, GLOBE_MARKERS, type GlobeMarker } from '@/lib/site-data'
import { type QualityConfig } from '@/lib/performance/quality'

const RADIUS = 2

const MARKER_COLOR: Record<GlobeMarker['kind'], string> = {
  flood: '#3b6cff',
  cyclone: '#22d3ee',
  fire: '#ffab40',
  quake: '#ff4d5e',
}

/* ------------------------------- Atmosphere -------------------------------- */

const ATMOSPHERE_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const ATMOSPHERE_FRAGMENT = /* glsl */ `
  uniform vec3 uInner;
  uniform vec3 uOuter;
  uniform float uIntensity;
  uniform float uPower;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Fresnel term: brightest where the surface grazes the viewer.
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), uPower);
    vec3 color = mix(uInner, uOuter, fresnel);
    gl_FragColor = vec4(color, fresnel * uIntensity);
  }
`

function Atmosphere({
  scale,
  intensity,
  power,
  side,
  segments,
}: {
  scale: number
  intensity: number
  power: number
  side: THREE.Side
  segments: number
}) {
  const uniforms = useMemo(
    () => ({
      uInner: { value: new THREE.Color('#3b6cff') },
      uOuter: { value: new THREE.Color('#22d3ee') },
      uIntensity: { value: intensity },
      uPower: { value: power },
    }),
    [intensity, power],
  )

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[RADIUS, segments, segments]} />
      <shaderMaterial
        vertexShader={ATMOSPHERE_VERTEX}
        fragmentShader={ATMOSPHERE_FRAGMENT}
        uniforms={uniforms}
        transparent
        side={side}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

/* --------------------------------- Markers --------------------------------- */

function Marker({ marker, index }: { marker: GlobeMarker; index: number }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const position = useMemo(
    () => latLngToVector3(marker.lat, marker.lng, RADIUS * 1.005),
    [marker.lat, marker.lng],
  )
  const color = MARKER_COLOR[marker.kind]

  // Orient the pulse ring flat against the sphere surface at this point.
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize())
    return q
  }, [position])

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const t = (clock.elapsedTime * 0.55 + index * 0.31) % 1
    const scale = 0.4 + t * 2.6
    ringRef.current.scale.setScalar(scale)
    const material = ringRef.current.material as THREE.MeshBasicMaterial
    material.opacity = (1 - t) * 0.75
  })

  return (
    <group position={position} quaternion={quaternion}>
      {/* Core dot */}
      <mesh>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Beam rising along the surface normal (local +Z), cylinder is Y-up */}
      <mesh position={[0, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, 0.15, 5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Expanding pulse ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.03, 0.042, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ---------------------------------- Arcs ----------------------------------- */

function Arc({
  from,
  to,
  index,
}: {
  from: GeoPoint
  to: GeoPoint
  index: number
}) {
  const pulseRef = useRef<THREE.Mesh>(null)

  const { curve, points } = useMemo(
    () => buildArc(from, to, RADIUS * 1.01, 48),
    [from, to],
  )

  useFrame(({ clock }) => {
    if (!pulseRef.current) return
    const t = (clock.elapsedTime * 0.22 + index * 0.17) % 1
    const point = curve.getPoint(t)
    pulseRef.current.position.copy(point)

    // Fade in and out at the endpoints so packets appear to depart and arrive.
    const fade = Math.sin(t * Math.PI)
    pulseRef.current.scale.setScalar(0.4 + fade * 0.9)
    const material = pulseRef.current.material as THREE.MeshBasicMaterial
    material.opacity = fade
  })

  return (
    <group>
      <Line
        points={points}
        color="#22d3ee"
        lineWidth={1}
        transparent
        opacity={0.28}
        toneMapped={false}
      />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshBasicMaterial
          color="#8fe8ff"
          transparent
          opacity={0.9}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* --------------------------------- Lat grid -------------------------------- */

function Wireframe({ segments }: { segments: number }) {
  return (
    <mesh scale={1.002}>
      <sphereGeometry args={[RADIUS, Math.min(segments, 36), Math.min(segments, 24)]} />
      <meshBasicMaterial
        color="#4f8dff"
        wireframe
        transparent
        opacity={0.07}
        toneMapped={false}
      />
    </mesh>
  )
}

/* ---------------------------------- Earth ---------------------------------- */

function Earth({ segments }: { segments: number }) {
  const texture = useTexture('/textures/earth-map.png')

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    texture.wrapS = THREE.RepeatWrapping
  }, [texture])

  return (
    <mesh>
      <sphereGeometry args={[RADIUS, segments, segments]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#1d4ed8"
        emissiveIntensity={0.35}
        roughness={0.82}
        metalness={0.16}
      />
    </mesh>
  )
}

/* --------------------------------- Starfield -------------------------------- */

function Starfield({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      // Uniform points on a large shell around the scene.
      const r = 16 + Math.random() * 26
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [count])

  const ref = useRef<THREE.Points>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.09}
        color="#cddcff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ------------------------------- Globe group -------------------------------- */

function GlobeGroup({
  interactive,
  quality,
}: {
  interactive: boolean
  quality: QualityConfig
}) {
  const groupRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  const segments = quality.globeSphereSegments

  // Slice markers/arcs according to quality tier
  const visibleMarkers = useMemo(
    () =>
      quality.maxMarkers === Infinity
        ? GLOBE_MARKERS
        : GLOBE_MARKERS.slice(0, quality.maxMarkers),
    [quality.maxMarkers],
  )

  const visibleArcs = useMemo(
    () =>
      quality.maxArcs === Infinity
        ? GLOBE_ARCS
        : GLOBE_ARCS.slice(0, quality.maxArcs),
    [quality.maxArcs],
  )

  // Single consolidated useFrame for the entire globe group
  useFrame((_, delta) => {
    // Continuous rotation of the planet itself.
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.055

    // Pointer parallax: eased tilt toward the cursor.
    if (groupRef.current && interactive) {
      const targetY = pointer.x * 0.42
      const targetX = -pointer.y * 0.26
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.045
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.045
    }
  })

  return (
    <group ref={groupRef}>
      {/* Axial tilt for a more natural planetary read */}
      <group rotation={[0.32, 0, 0.18]}>
        <group ref={spinRef}>
          <Earth segments={segments} />
          <Wireframe segments={segments} />
          {visibleMarkers.map((marker, index) => (
            <Marker key={marker.city} marker={marker} index={index} />
          ))}
          {visibleArcs.map(([from, to], index) => (
            <Arc key={index} from={from} to={to} index={index} />
          ))}
        </group>
      </group>

      {/* Inner rim light and outer halo */}
      {quality.atmosphereEnabled && (
        <>
          <Atmosphere scale={1.02} intensity={0.9} power={3.2} side={THREE.FrontSide} segments={segments} />
          <Atmosphere scale={1.22} intensity={0.55} power={2.4} side={THREE.BackSide} segments={segments} />
        </>
      )}
    </group>
  )
}

/* --------------------------------- Exported -------------------------------- */

export default function GlobeScene({
  interactive = true,
  quality,
}: {
  interactive?: boolean
  quality: QualityConfig
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6.2], fov: 42 }}
      dpr={quality.globeDpr}
      gl={{ antialias: quality.tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      frameloop="always"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 3, 5]} intensity={2.1} color="#dce8ff" />
      <pointLight position={[-6, -2, -4]} intensity={1.4} color="#22d3ee" />
      {quality.tier !== 'low' && (
        <pointLight position={[0, 4, -6]} intensity={0.9} color="#7c5cff" />
      )}

      <Starfield count={quality.starCount} />
      <GlobeGroup interactive={interactive} quality={quality} />
    </Canvas>
  )
}
