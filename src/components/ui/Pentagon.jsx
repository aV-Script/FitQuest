// Pentagon.jsx
import { memo, useMemo } from 'react'

/**
 * Pentagon — grafico radar a 5-6 assi.
 * Aggiornato con glow e area fill migliorata.
 */
export const Pentagon = memo(function Pentagon({
  stats = {},
  statKeys = [],
  statLabels = [],
  color = '#0ec452',
  size = 180,
  fluid = false,
}) {
  if (statKeys.length === 0) return null

  const center = size / 2
  const radius = size * 0.38
  const n      = Math.min(statKeys.length, 6)
  const gradId = `pentagon-fill-${color.replace('#', '')}-${size}`

  const angles = useMemo(
    () => Array.from({ length: n }, (_, i) => (i * 2 * Math.PI / n) - Math.PI / 2),
    [n]
  )

  const outerPoints = useMemo(
    () => angles.map(a => ({ x: center + radius * Math.cos(a), y: center + radius * Math.sin(a) })),
    [angles, center, radius]
  )

  const dataPoints = useMemo(
    () => Array.from({ length: n }, (_, i) => {
      const val   = Math.min(100, Math.max(0, stats[statKeys[i]] ?? 0))
      const scale = val / 100
      return {
        x: center + radius * scale * Math.cos(angles[i]),
        y: center + radius * scale * Math.sin(angles[i]),
      }
    }),
    [stats, statKeys, center, radius, angles, n]
  )

  const toPolyline = (pts) =>
    pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

  const fontSize = Math.max(7, size * 0.07)

  const vbPad  = 30
  const vbSize = size + vbPad * 2

  return (
    <svg
      width={fluid ? '100%' : size}
      height={fluid ? '100%' : size}
      viewBox={`${-vbPad} ${-vbPad} ${vbSize} ${vbSize}`}
      style={fluid ? { display: 'block', overflow: 'visible' } : { overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {/* Griglie concentriche */}
      {[0.25, 0.5, 0.75, 1].map(scale => (
        <polygon
          key={scale}
          points={toPolyline(
            outerPoints.map(p => ({
              x: center + (p.x - center) * scale,
              y: center + (p.y - center) * scale,
            }))
          )}
          fill="none"
          stroke={scale === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}
          strokeWidth={scale === 1 ? 1 : 0.5}
        />
      ))}

      {/* Assi */}
      {outerPoints.map((pt, i) => (
        <line
          key={i}
          x1={center} y1={center}
          x2={pt.x}   y2={pt.y}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={0.5}
        />
      ))}

      {/* Area dati — fill con gradiente radiale */}
      <polygon
        points={toPolyline(dataPoints)}
        fill={`url(#${gradId})`}
        stroke="none"
      />

      {/* Area dati — bordo con glow */}
      <polygon
        points={toPolyline(dataPoints)}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
      />

      {/* Punti sui vertici dati */}
      {dataPoints.map((pt, i) => {
        const val = stats[statKeys[i]] ?? 0
        if (val === 0) return null
        return (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={2.5}
            fill={color}
            style={{ filter: `drop-shadow(0 0 3px ${color})` }}
          />
        )
      })}

      {/* Labels */}
      {outerPoints.map((pt, i) => {
        const angle  = angles[i]
        const labelR = radius + fontSize * 1.4
        const lx     = center + labelR * Math.cos(angle)
        const ly     = center + labelR * Math.sin(angle)
        const anchor = Math.abs(Math.cos(angle)) < 0.1
          ? 'middle'
          : Math.cos(angle) > 0
          ? 'start'
          : 'end'

        return (
          <text
            key={i}
            x={lx}
            y={ly + fontSize * 0.35}
            textAnchor={anchor}
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      fontSize,
              fontWeight:    600,
              fill:          'rgba(255,255,255,0.5)',
              letterSpacing: '0.05em',
            }}
          >
            {(statLabels[i] ?? '').slice(0, 5).toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
})
