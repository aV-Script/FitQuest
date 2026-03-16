import { memo, useMemo } from 'react'
import { STATS } from '../../constants'

/**
 * Pentagon — visualizza le 5 statistiche del cliente.
 *
 * Props:
 *   stats       — oggetto { [key]: percentile 0-100 }
 *   statKeys    — array di 5 chiavi (default: STATS health)
 *   statLabels  — array di 5 label (default: STATS health labels)
 *   color       — colore principale
 *   size        — dimensione in px
 *   fluid       — se true, larghezza 100%
 */
export const Pentagon = memo(function Pentagon({
  stats      = {},
  statKeys   = null,
  statLabels = null,
  color      = '#60a5fa',
  size       = 180,
  fluid      = false,
}) {
  // Usa le chiavi/label passate come prop, altrimenti fallback ai test Health
  const keys   = statKeys   ?? STATS.map(s => s.key)
  const labels = statLabels ?? STATS.map(s => s.label)

  const cx = size / 2
  const cy = size / 2
  const R  = size * 0.42

  const angles = keys.map((_, i) => (Math.PI * 2 * i) / keys.length - Math.PI / 2)

  const outerPoints = useMemo(() =>
    angles.map(a => ({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }))
  , [cx, cy, R, angles.join()])

  const statPoints = useMemo(() =>
    keys.map((key, i) => {
      const val = Math.min(100, Math.max(0, stats[key] ?? 0))
      const r   = (val / 100) * R
      return { x: cx + r * Math.cos(angles[i]), y: cy + r * Math.sin(angles[i]) }
    })
  , [stats, keys, cx, cy, R])

  const toPath = pts =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  const vbPad  = 30
  const vbSize = size + vbPad * 2

  // Abbreviazioni: usa le prime 3 lettere della label, oppure abbreviazioni fisse
  const ABBR_MAP = {
    'Forza': 'FOR', 'Mobilità': 'MOB', 'Equilibrio': 'EQU',
    'Esplosività': 'ESP', 'Resistenza': 'RES',
    'Y Balance': 'YBL', 'Salto Lungo': 'SLJ', 'Sprint 10m': 'S10',
    'Reattività': 'RSI', 'Agilità': 'AGI', 'Yo-Yo': 'YYO',
    'Sprint 20m': 'S20', 'CMJ': 'CMJ',
  }

  return (
    <svg
      width={fluid ? '100%' : size}
      height={fluid ? '100%' : size}
      viewBox={`${-vbPad} ${-vbPad} ${vbSize} ${vbSize}`}
      style={fluid ? { display: 'block' } : undefined}
    >
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f}
          points={outerPoints.map(p =>
            `${(cx + (p.x - cx) * f).toFixed(1)},${(cy + (p.y - cy) * f).toFixed(1)}`
          ).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Spokes */}
      {outerPoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Stat area */}
      <path d={toPath(statPoints)}
        fill={color + '33'} stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* Dots */}
      {statPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} />
      ))}
      {/* Labels */}
      {labels.map((label, i) => {
        const offset = size < 140 ? 18 : 24
        const lx = cx + (R + offset) * Math.cos(angles[i])
        const ly = cy + (R + offset) * Math.sin(angles[i])
        const abbr = ABBR_MAP[label] ?? label.slice(0, 3).toUpperCase()
        return (
          <text key={i} x={lx} y={ly}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={size > 160 ? 10 : 9}
            fill="rgba(255,255,255,0.5)"
            fontFamily="Rajdhani" fontWeight="600" letterSpacing="1">
            {abbr}
          </text>
        )
      })}
    </svg>
  )
})
