/**
 * StatNumber — numero statistico come protagonista visivo.
 *
 * Ispirazione: Vercel dashboard, Stripe metrics.
 * Il numero è grande, respira, ha peso visivo.
 *
 * Usato per: media, rank score, livello, XP, presenze.
 */
export function StatNumber({
  value,
  unit,
  label,
  sublabel,
  color    = 'var(--green-400)',
  size     = 'md',
  trend,
  loading  = false,
}) {
  const sizes = {
    xs: { number: 24, unit: 13, label: 9  },
    sm: { number: 32, unit: 16, label: 10 },
    md: { number: 48, unit: 20, label: 11 },
    lg: { number: 64, unit: 24, label: 12 },
    xl: { number: 80, unit: 28, label: 13 },
  }
  const s = sizes[size] ?? sizes.md

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {label && <div className="skeleton" style={{ height: 10, width: 80 }} />}
        <div className="skeleton" style={{ height: s.number, width: 120 }} />
      </div>
    )
  }

  const trendColor = trend?.value > 0 ? '#0ec452' :
                     trend?.value < 0 ? '#f05252' :
                     'var(--text-tertiary)'

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      s.label,
            fontWeight:    600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         'var(--text-tertiary)',
          }}
        >
          {label}
        </span>
      )}

      <div className="flex items-end gap-1.5" style={{ lineHeight: 1 }}>
        <span
          style={{
            fontFamily:         'Montserrat, sans-serif',
            fontSize:           s.number,
            fontWeight:         900,
            letterSpacing:      '-0.03em',
            color,
            lineHeight:         1,
            textShadow:         `0 0 40px ${color}33`,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      s.unit,
              fontWeight:    600,
              color:         color + '77',
              paddingBottom: Math.round(s.number * 0.07),
              lineHeight:    1,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {sublabel && (
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:         'var(--text-tertiary)',
            }}
          >
            {sublabel}
          </span>
        )}
        {trend && (
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    700,
              color:         trendColor,
              letterSpacing: '0.05em',
            }}
          >
            {trend.value > 0 ? `▲ +${trend.value}` :
             trend.value < 0 ? `▼ ${trend.value}` : '— '}
            {trend.label ? ` ${trend.label}` : ''}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * StatGrid — griglia di StatNumber.
 * Layout responsive automatico.
 */
export function StatGrid({ stats, columns = 3 }) {
  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap:                 '1px',
        background:          'var(--border-subtle)',
        borderRadius:        'var(--radius-xl)',
        overflow:            'hidden',
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-surface)',
            padding:    '20px',
          }}
        >
          <StatNumber {...stat} />
        </div>
      ))}
    </div>
  )
}
