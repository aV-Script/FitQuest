import { useEffect, useRef } from 'react'

/**
 * RankRing — anello circolare con rank al centro.
 * Usato nel DashboardHeader e nella PlayerCard.
 *
 * Ispirazione: Fitbit rings, Apple Fitness.
 *
 * Accetta due API:
 *   Nuova: { rank, color, media, size }
 *   Legacy: { rankObj, xp, xpNext, size, animated }
 */
export function RankRing({
  // Nuova API
  rank,
  color,
  media,
  // Legacy API
  rankObj,
  xp = 0,
  xpNext = 700,
  // Comune
  size = 56,
  animated = true,
}) {
  const arcRef = useRef(null)

  // Risolvi i valori da entrambe le API
  const resolvedRank  = rank  ?? rankObj?.label ?? 'F'
  const resolvedColor = color ?? rankObj?.color  ?? '#6b7280'
  const resolvedPct   = media !== undefined
    ? Math.min(100, Math.max(0, media)) / 100
    : (xpNext > 0 ? Math.min(xp / xpNext, 1) : 0)

  const strokeWidth   = Math.max(5, size * 0.09)
  const radius        = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset  = circumference - resolvedPct * circumference

  const fontSize = size < 48
    ? size * 0.28
    : size < 64
    ? size * 0.25
    : size * 0.22

  useEffect(() => {
    const el = arcRef.current
    if (!el) return
    if (!animated) {
      el.style.strokeDashoffset = targetOffset
      return
    }
    el.style.transition        = 'none'
    el.style.strokeDashoffset  = circumference
    void el.getBoundingClientRect()
    el.style.transition        = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'
    el.style.strokeDashoffset  = targetOffset
  }, [resolvedRank, circumference, targetOffset, animated])

  const cx = size / 2
  const cy = size / 2

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <circle
          ref={arcRef}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ filter: `drop-shadow(0 0 4px ${resolvedColor}88)` }}
        />
      </svg>

      {/* Rank al centro */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            2,
        }}
      >
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      fontSize,
            fontWeight:    900,
            color:         resolvedColor,
            lineHeight:    1,
            letterSpacing: '-0.03em',
            textShadow:    `0 0 12px ${resolvedColor}66`,
          }}
        >
          {resolvedRank}
        </span>
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      size * 0.08,
            fontWeight:    600,
            color:         'rgba(255,255,255,0.3)',
            letterSpacing: '0.15em',
            lineHeight:    1,
          }}
        >
          RANK
        </span>
      </div>
    </div>
  )
}
