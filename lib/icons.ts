import {
  ActivitySquare,
  BadgeCheck,
  BellRing,
  Boxes,
  BrainCircuit,
  CloudLightning,
  Copy,
  FileCheck2,
  Flame,
  Gauge,
  HeartHandshake,
  HeartPulse,
  Home,
  Languages,
  LifeBuoy,
  Radar,
  ScanSearch,
  ShieldAlert,
  Siren,
  Smartphone,
  Target,
  Timer,
  TrendingUp,
  Truck,
  Users,
  Waves,
  type LucideIcon,
} from 'lucide-react'

/**
 * Icon registry so content data can stay serialisable strings while
 * components resolve to real components at render time.
 */
export const ICONS: Record<string, LucideIcon> = {
  ActivitySquare,
  BadgeCheck,
  BellRing,
  Boxes,
  BrainCircuit,
  CloudLightning,
  Copy,
  FileCheck2,
  Flame,
  Gauge,
  HeartHandshake,
  HeartPulse,
  Home,
  Languages,
  LifeBuoy,
  Radar,
  ScanSearch,
  ShieldAlert,
  Siren,
  Smartphone,
  Target,
  Timer,
  TrendingUp,
  Truck,
  Users,
  Waves,
}

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Radar
}
