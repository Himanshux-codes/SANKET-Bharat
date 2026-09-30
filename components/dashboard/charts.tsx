'use client'

import { memo, useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  DISASTER_MIX,
  HEATMAP_DAYS,
  HEATMAP_SLOTS,
  HEATMAP_VALUES,
  INCIDENT_TIMESERIES,
  RESPONSE_BY_REGION,
} from '@/lib/site-data'

// Axis tick styles — high-contrast light colors for crisp SVG rendering against dark #050816
const AXIS_TICK_STYLE = {
  fill: '#c4cfe8',
  fontSize: 11,
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
}

const AXIS_BAR_TICK_STYLE = {
  fill: '#c4cfe8',
  fontSize: 11,
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
}

// Subtle, elegant horizontal reference gridlines (16% opacity)
const GRID_STROKE = 'rgba(160, 174, 207, 0.16)'

// Stable tooltip cursor objects — avoids re-creating on every render
const AREA_CURSOR = { stroke: 'rgba(160,174,207,0.35)', strokeWidth: 1, strokeDasharray: '3 3' }
const BAR_CURSOR = { fill: 'rgba(34,211,238,0.08)' }

// Stable active dot configs
const REPORTS_ACTIVE_DOT = { r: 5, strokeWidth: 2, stroke: '#050816', fill: '#4f80ff' }
const VERIFIED_ACTIVE_DOT = { r: 5, strokeWidth: 2, stroke: '#050816', fill: '#22d3ee' }

function ChartTooltip({
  active,
  payload,
  label,
  unit = '',
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string }>
  label?: string | number
  unit?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="glass rounded-xl border border-white/10 px-3.5 py-2.5 text-xs shadow-2xl backdrop-blur-xl">
      {label !== undefined && (
        <p className="mb-1.5 font-mono text-[0.68rem] font-semibold tracking-[0.12em] text-slate-300 uppercase">
          {label}
        </p>
      )}
      <ul className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: entry.color, boxShadow: `0 0 6px ${entry.color}88` }}
            />
            <span className="capitalize text-slate-300">{entry.name}</span>
            <span className="ml-auto font-mono font-semibold text-foreground">
              {entry.value}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Memoized tooltip elements — prevents re-creation on parent rerenders
const MemoTooltip = <ChartTooltip />
const MemoTooltipMin = <ChartTooltip unit=" min" />
const MemoTooltipPct = <ChartTooltip unit="%" />

/** Reports vs verified incidents across the day. */
export const IncidentAreaChart = memo(function IncidentAreaChart() {
  return (
    <div className="flex flex-col gap-2">
      {/* Inline Legend for clear identification of both curves */}
      <div className="flex items-center justify-end gap-4 px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-[#4f80ff] shadow-[0_0_8px_#4f80ff88]" />
          <span className="font-mono text-[0.7rem] text-slate-300">Reports</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-4 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee88]" />
          <span className="font-mono text-[0.7rem] text-slate-300">Verified</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={INCIDENT_TIMESERIES} margin={{ top: 8, right: 4, bottom: 0, left: -14 }}>
          <defs>
            {/* Reports — electric blue gradient */}
            <linearGradient id="fillReports" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f80ff" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#4f80ff" stopOpacity={0.02} />
            </linearGradient>
            {/* Verified — bright cyan gradient */}
            <linearGradient id="fillVerified" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Clean horizontal gridlines for clear numeric alignment */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID_STROKE}
            horizontal={true}
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK_STYLE}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK_STYLE}
            width={44}
          />
          <Tooltip
            content={MemoTooltip}
            cursor={AREA_CURSOR}
          />

          {/* Reports — distinguished bold electric blue (#4f80ff) */}
          <Area
            type="monotone"
            dataKey="reports"
            name="reports"
            stroke="#4f80ff"
            strokeWidth={2.5}
            fill="url(#fillReports)"
            dot={false}
            activeDot={REPORTS_ACTIVE_DOT}
            isAnimationActive={false}
          />
          {/* Verified — distinct brilliant cyan (#22d3ee) */}
          <Area
            type="monotone"
            dataKey="verified"
            name="verified"
            stroke="#22d3ee"
            strokeWidth={2.5}
            fill="url(#fillVerified)"
            dot={false}
            activeDot={VERIFIED_ACTIVE_DOT}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
})

/** Median response minutes per state. */
export const ResponseBarChart = memo(function ResponseBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={RESPONSE_BY_REGION} margin={{ top: 8, right: 4, bottom: 0, left: -14 }}>
        <defs>
          <linearGradient id="fillBar" x1="0" y1="0" x2="0" y2="1">
            {/* Vivid cyan top gradient transitioning to royal blue */}
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.65} />
          </linearGradient>
        </defs>

        {/* Clear reference lines */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={GRID_STROKE}
          horizontal={true}
          vertical={false}
        />

        <XAxis
          dataKey="region"
          tickLine={false}
          axisLine={false}
          tick={AXIS_BAR_TICK_STYLE}
          dy={8}
          interval={0}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK_STYLE}
          width={44}
        />
        <Tooltip
          content={MemoTooltipMin}
          cursor={BAR_CURSOR}
        />
        <Bar
          dataKey="minutes"
          name="Response Time"
          fill="url(#fillBar)"
          radius={[6, 6, 0, 0]}
          maxBarSize={38}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  )
})

/** Share of incidents by disaster type. */
export const DisasterPieChart = memo(function DisasterPieChart() {
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <ResponsiveContainer width="100%" height={190} className="max-w-[190px]">
        <PieChart>
          <Pie
            data={DISASTER_MIX}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={82}
            paddingAngle={4}
            stroke="#050816"
            strokeWidth={2}
            isAnimationActive={false}
          >
            {DISASTER_MIX.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip content={MemoTooltipPct} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend: clear text contrast and bright percentage figures */}
      <ul className="flex w-full flex-col gap-2.5">
        {DISASTER_MIX.map((slice) => (
          <li key={slice.name} className="flex items-center gap-2.5 text-xs">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{
                background: slice.color,
                boxShadow: `0 0 8px ${slice.color}88`,
              }}
            />
            <span className="font-medium text-slate-200">{slice.name}</span>
            <span className="ml-auto font-mono text-sm font-bold text-slate-100">
              {slice.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
})

/** Incident pressure by weekday and three-hour slot. */
export const PressureHeatMap = memo(function PressureHeatMap() {
  // Pre-compute all cell styles once, not on every render
  const cells = useMemo(
    () =>
      HEATMAP_VALUES.map((row, dayIndex) =>
        row.map((value, slotIndex) => ({
          key: `${HEATMAP_DAYS[dayIndex]}-${HEATMAP_SLOTS[slotIndex]}`,
          title: `${HEATMAP_DAYS[dayIndex]} ${HEATMAP_SLOTS[slotIndex]}:00 — pressure ${value}`,
          background: `color-mix(in oklab, var(--accent) ${Math.round(value * 0.85)}%, color-mix(in oklab, var(--primary) 22%, transparent))`,
          glow:
            value > 80
              ? '0 0 12px color-mix(in oklab, var(--accent) 45%, transparent)'
              : undefined,
        })),
      ),
    [],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">
        <div className="w-9 shrink-0" aria-hidden />
        <div className="grid flex-1 grid-cols-8 gap-1.5">
          {HEATMAP_SLOTS.map((slot) => (
            <span
              key={slot}
              className="text-center font-mono text-[0.62rem] font-medium text-slate-300"
            >
              {slot}
            </span>
          ))}
        </div>
      </div>

      {cells.map((row, dayIndex) => (
        <div key={HEATMAP_DAYS[dayIndex]} className="flex items-center gap-1.5">
          <span className="w-9 shrink-0 font-mono text-[0.62rem] font-medium tracking-[0.08em] text-slate-300 uppercase">
            {HEATMAP_DAYS[dayIndex]}
          </span>
          <div className="grid flex-1 grid-cols-8 gap-1.5">
            {row.map((cell) => (
              <div
                key={cell.key}
                title={cell.title}
                className="aspect-square rounded-[0.3rem] transition-transform duration-300 hover:scale-110"
                style={{
                  background: cell.background,
                  boxShadow: cell.glow,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-1 flex items-center gap-2.5">
        <span className="font-mono text-[0.62rem] font-medium tracking-[0.14em] text-slate-300 uppercase">
          Low
        </span>
        <div
          aria-hidden
          className="h-1.5 flex-1 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, color-mix(in oklab, var(--primary) 22%, transparent), var(--accent))',
          }}
        />
        <span className="font-mono text-[0.62rem] font-medium tracking-[0.14em] text-slate-300 uppercase">
          Critical
        </span>
      </div>
    </div>
  )
})
