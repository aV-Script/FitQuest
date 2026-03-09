import { memo, useMemo } from 'react'
import { STATS } from '../../constants'

const SIZE = 130
const CX   = SIZE / 2
const CY   = SIZE / 2
const R    = 48
const N    = STATS.length

function angleFor(i) {
  return (Math.PI * 2 * i) / N - Math.PI / 2
}

function polarToCart(ratio, i) {
  const angle = angleFor(i)
  return {
    x: CX + R * ratio * Math.cos(angle),
    y: CY + R * ratio * Math.sin(angle),
  }
}

function gridPolygon(ratio) {
  return STATS.map((_, i) => {
    const { x, y } = polarToCart(ratio, i)
    return `${x},${y}`
  }).join(' ')
}

/**
 * Radar chart pentagonale.
 * Memoizzato: si re-renderizza solo se stats o color cambiano.
 */
export const Pentagon = memo(function Pentagon({ stats, color }) {
  const dataPoints = useMemo(
    () => STATS.map(({ key }, i) => polarToCart(stats[key] / 100, i)),
    [stats]
  )

  const dataPath = dataPoints
    .map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x},${y}`)
    .join(' ') + 'Z'

  return (
    <svg width={SIZE} height={SIZE} style={{ overflow: 'visible' }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map(ratio => (
        <polygon
          key={ratio}
          points={gridPolygon(ratio)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}

      {/* Grid spokes */}
      {STATS.map((_, i) => {
        const { x, y } = polarToCart(1, i)
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      })}

      {/* Data area */}
      <path d={dataPath} fill={color + '44'} stroke={color} strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} />
      ))}

      {/* Labels */}
      {STATS.map(({ icon }, i) => {
        const { x, y } = polarToCart(1 + 18 / R, i)
        return (
          <text
            key={i}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="rgba(255,255,255,0.6)"
            fontFamily="Rajdhani, sans-serif"
          >
            {icon}
          </text>
        )
      })}
    </svg>
  )
})
