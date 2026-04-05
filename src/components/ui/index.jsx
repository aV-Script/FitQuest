import { forwardRef }     from 'react'
import { Pentagon }       from './Pentagon'
import { getStatsConfig } from '../../constants'

// ── Re-exports dai file separati ─────────────────────────────
export { Button }                                                      from './Button'
export { LoadingSpinner }                                              from './LoadingSpinner'
export { Card, CardHeader, CardDivider }                               from './Card'
export { Badge, RankBadge, StatusBadge }                               from './Badge'
export { StatNumber, StatGrid }                                        from './StatNumber'
export { EmptyState, EMPTY_STATES }                                    from './EmptyState'
export { Skeleton, SkeletonText, SkeletonCard,
         SkeletonClientCard, SkeletonList }                             from './Skeleton'
export { Field, InputGroup }                                           from './Field'
export { Modal }                                                       from './Modal'
export { XPBar }                                                       from './XPBar'
export { Pentagon }                                                    from './Pentagon'
export { RankRing }                                                    from './RankRing'

// ── Input ─────────────────────────────────────────────────────
export const Input = forwardRef(({ className = '', ...props }, ref) => (
  <input ref={ref} className={`input-base ${className}`} {...props} />
))
Input.displayName = 'Input'

// ── Textarea ──────────────────────────────────────────────────
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`input-base resize-y ${className}`}
      style={{ minHeight: 80 }}
      {...props}
    />
  )
}

// ── SectionLabel ──────────────────────────────────────────────
export function SectionLabel({ children, className = '', color, action }) {
  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={{ marginBottom: 14 }}
    >
      <span
        style={{
          fontFamily:    'Montserrat, sans-serif',
          fontSize:      10,
          fontWeight:    600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         color ?? 'var(--text-tertiary)',
        }}
      >
        {children}
      </span>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background:    'transparent',
            border:        'none',
            color:         'var(--text-tertiary)',
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      9,
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor:        'pointer',
            padding:       '3px 8px',
            borderRadius:  'var(--radius-sm)',
            transition:    'all var(--duration-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color      = 'var(--text-primary)'
            e.currentTarget.style.background = 'var(--border-subtle)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color      = 'var(--text-tertiary)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────
export function Divider({ color, vertical = false, className = '' }) {
  if (vertical) {
    return (
      <div
        className={className}
        style={{
          width:      1,
          alignSelf:  'stretch',
          background: color ?? 'var(--border-subtle)',
        }}
      />
    )
  }

  return (
    <div
      className={`divider ${className}`}
      style={color ? {
        background: `linear-gradient(90deg, transparent, ${color}33, transparent)`,
      } : undefined}
    />
  )
}

// ── ActivityLog ───────────────────────────────────────────────
export function ActivityLog({ log = [], color }) {
  return (
    <div className="card p-5">
      <SectionLabel>◈ Attività recenti</SectionLabel>
      {log.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          Nessuna attività ancora.
        </p>
      ) : (
        <div className="flex flex-col">
          {log.slice(0, 6).map((entry, i) => (
            <div
              key={i}
              className="flex gap-3 items-start py-2.5"
              style={{
                borderBottom: i < Math.min(log.length, 6) - 1
                  ? '1px solid var(--border-subtle)'
                  : 'none',
              }}
            >
              <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: color + '88' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {entry.action}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {entry.date}
                  </span>
                  {entry.xp > 0 && (
                    <span className="badge badge-green" style={{ fontSize: 9, padding: '2px 6px' }}>
                      +{entry.xp} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── StatsSection ──────────────────────────────────────────────
export function StatsSection({
  stats       = {},
  prevStats   = null,
  categoria   = 'health',
  color,
  pentagonSize = 130,
}) {
  const config     = getStatsConfig(categoria)
  const statKeys   = config.map(t => t.stat)
  const statLabels = config.map(t => t.label)

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '1fr auto' }}>
      {/* Barre */}
      <div className="flex flex-col justify-center gap-3">
        {statKeys.map((key, i) => {
          const val   = stats[key] ?? 0
          const prev  = prevStats?.[key] ?? null
          const delta = prev !== null ? val - prev : null

          return (
            <div key={key} className="flex items-center gap-3">
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', width: 80, flexShrink: 0 }}>
                {statLabels[i]}
              </span>
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 5, background: 'var(--border-subtle)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width:      `${val}%`,
                    background: color,
                    boxShadow:  `0 0 8px ${color}66`,
                    transition: 'width 700ms var(--ease-standard)',
                  }}
                />
              </div>
              <span
                style={{ fontSize: 12, fontWeight: 700, color, width: 24, textAlign: 'right', flexShrink: 0 }}
              >
                {val}
              </span>
              {delta !== null && (
                <span
                  style={{
                    fontSize:   10,
                    width:      28,
                    textAlign:  'right',
                    flexShrink: 0,
                    color: delta > 0 ? '#0ec452' : delta < 0 ? '#f05252' : 'var(--text-tertiary)',
                  }}
                >
                  {delta > 0 ? `+${delta}` : delta === 0 ? '—' : delta}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Pentagon */}
      <div className="flex items-center justify-center">
        <Pentagon
          stats={stats}
          statKeys={statKeys}
          statLabels={statLabels}
          color={color}
          size={pentagonSize}
        />
      </div>
    </div>
  )
}
