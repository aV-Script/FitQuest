import { memo, useCallback }    from 'react'
import { useClientRank }        from '../../../hooks/useClientRank'
import { getStatsConfig }       from '../../../constants'
import { getCategoriaById }     from '../../../constants'
import { getPlayerRole }        from '../../../config/modules.config'

/**
 * ClientCard — card cliente nella lista.
 *
 * Layout:
 * ┌─────────────────────────────────────┐
 * │ [Avatar+Rank] Nome        Categoria │
 * │              LV badge   Ruolo badge │
 * │─────────────────────────────────────│
 * │ XP ████████░░░░░░░░░░░░  42%  →LV  │
 * │─────────────────────────────────────│
 * │ Forza      ████████████  87        │
 * │ Velocità   ██████░░░░░░  62        │
 * │ Resistenza █████████░░░  74        │
 * │ ...                                 │
 * └─────────────────────────────────────┘
 *
 * Usa memo per evitare re-render su liste grandi.
 */
export const ClientCard = memo(function ClientCard({ client, onClick }) {
  const { rankObj, color } = useClientRank(client)
  const config    = getStatsConfig(client.categoria ?? 'health')
  const categoria = getCategoriaById(client.categoria)
  const role      = getPlayerRole(client.ruolo)

  const xpPct = client.xpNext > 0
    ? Math.min(100, Math.round((client.xp / client.xpNext) * 100))
    : 0

  const hasStats = client.stats &&
    Object.values(client.stats).some(v => typeof v === 'number' && v > 0)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }, [onClick])

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Apri profilo di ${client.name}`}
      className="w-full text-left group"
      style={{
        background:    'var(--bg-surface)',
        border:        '1px solid var(--border-default)',
        borderRadius:  'var(--radius-xl)',
        padding:       16,
        cursor:        'pointer',
        transition:    'all var(--duration-fast) var(--ease-standard)',
        display:       'flex',
        flexDirection: 'column',
        gap:           12,
        outline:       'none',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = color + '44'
        el.style.transform   = 'translateY(-2px)'
        el.style.boxShadow   = `var(--shadow-lg), 0 0 20px ${color}12`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border-default)'
        el.style.transform   = 'translateY(0)'
        el.style.boxShadow   = 'none'
      }}
      onFocus={e => {
        e.currentTarget.style.outline       = `2px solid ${color}66`
        e.currentTarget.style.outlineOffset = '2px'
      }}
      onBlur={e => {
        e.currentTarget.style.outline = 'none'
      }}
    >

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-start gap-3">

        {/* Avatar — cerchio con iniziale + accent color */}
        <div
          style={{
            width:          44,
            height:         44,
            borderRadius:   'var(--radius-lg)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     color + '15',
            border:         `1.5px solid ${color}33`,
            flexShrink:     0,
            position:       'relative',
            boxShadow:      `inset 0 1px 0 ${color}22`,
          }}
        >
          <span
            style={{
              fontFamily:  'Montserrat, sans-serif',
              fontSize:    18,
              fontWeight:  900,
              color,
              lineHeight:  1,
              textShadow:  `0 0 12px ${color}66`,
            }}
          >
            {client.name?.[0]?.toUpperCase() ?? '?'}
          </span>

          {/* Rank badge sovrapposto — angolo in basso a destra */}
          <div
            style={{
              position:       'absolute',
              bottom:         -6,
              right:          -6,
              background:     color + '18',
              border:         `1px solid ${color}44`,
              borderRadius:   'var(--radius-sm)',
              padding:        '1px 5px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      9,
                fontWeight:    900,
                color,
                lineHeight:    1,
                letterSpacing: '0.05em',
              }}
            >
              {rankObj.label}
            </span>
          </div>
        </div>

        {/* Nome + badge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Nome */}
          <div
            style={{
              fontFamily:   'Inter, sans-serif',
              fontSize:     14,
              fontWeight:   600,
              color:        'var(--text-primary)',
              lineHeight:   1.3,
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
              marginBottom: 5,
            }}
          >
            {client.name}
          </div>

          {/* Badge row */}
          <div className="flex items-center gap-1.5 flex-wrap">

            {/* Livello */}
            <span
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                padding:       '2px 7px',
                background:    color + '12',
                border:        `1px solid ${color}28`,
                borderRadius:  'var(--radius-sm)',
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      9,
                fontWeight:    700,
                color,
                letterSpacing: '0.08em',
                lineHeight:    1,
              }}
            >
              LV {client.level}
            </span>

            {/* Categoria (solo PT) */}
            {categoria && !role && (
              <span
                style={{
                  display:       'inline-flex',
                  padding:       '2px 7px',
                  background:    'var(--bg-raised)',
                  border:        '1px solid var(--border-default)',
                  borderRadius:  'var(--radius-sm)',
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      9,
                  fontWeight:    600,
                  color:         'var(--text-tertiary)',
                  letterSpacing: '0.08em',
                  lineHeight:    1,
                }}
              >
                {categoria.label}
              </span>
            )}

            {/* Ruolo (solo soccer) */}
            {role && (
              <span
                style={{
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           3,
                  padding:       '2px 7px',
                  background:    'var(--bg-raised)',
                  border:        '1px solid var(--border-subtle)',
                  borderRadius:  'var(--radius-sm)',
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      9,
                  fontWeight:    700,
                  color:         'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  lineHeight:    1,
                }}
              >
                {role.icon} {role.abbr}
              </span>
            )}
          </div>
        </div>

        {/* Chevron — indica cliccabilità */}
        <div
          style={{
            color:      'var(--text-tertiary)',
            fontSize:   16,
            lineHeight: 1,
            opacity:    0,
            transform:  'translateX(-4px)',
            transition: 'all var(--duration-fast)',
            flexShrink: 0,
            marginTop:  2,
          }}
          className="group-hover:opacity-100 group-hover:translate-x-0"
        >
          ›
        </div>
      </div>

      {/* ── XP Bar ──────────────────────────────────────────── */}
      <div>
        {/* Label row */}
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   5,
          }}
        >
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              letterSpacing: '0.1em',
              color:         'var(--text-tertiary)',
              textTransform: 'uppercase',
            }}
          >
            Esperienza
          </span>
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    700,
              color:         color + 'bb',
              letterSpacing: '0.05em',
            }}
          >
            {client.xp} / {client.xpNext} XP
          </span>
        </div>

        {/* Bar */}
        <div
          style={{
            height:       5,
            background:   'var(--bg-raised)',
            borderRadius: 99,
            overflow:     'hidden',
            position:     'relative',
          }}
        >
          <div
            style={{
              position:     'absolute',
              left:         0,
              top:          0,
              height:       '100%',
              width:        `${xpPct}%`,
              background:   `linear-gradient(90deg, ${color}bb, ${color})`,
              borderRadius: 99,
              boxShadow:    `0 0 8px ${color}66`,
              transition:   'width 700ms var(--ease-standard)',
            }}
          />
        </div>

        {/* Percentuale */}
        <div style={{ textAlign: 'right', marginTop: 3 }}>
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    700,
              color:         xpPct >= 80 ? color : 'var(--text-tertiary)',
              letterSpacing: '0.05em',
            }}
          >
            {xpPct}%
          </span>
        </div>
      </div>

      {/* ── Stat bars ───────────────────────────────────────── */}
      {hasStats && (
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           6,
            paddingTop:    8,
            borderTop:     '1px solid var(--border-subtle)',
          }}
        >
          {config.map(({ stat, label }) => {
            const val = client.stats?.[stat] ?? 0
            return (
              <StatBar
                key={stat}
                label={label}
                value={val}
                color={color}
              />
            )
          })}
        </div>
      )}

      {/* No stats state */}
      {!hasStats && (
        <div
          style={{
            paddingTop: 8,
            borderTop:  '1px solid var(--border-subtle)',
            textAlign:  'center',
          }}
        >
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              color:         'var(--text-tertiary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Nessun campionamento ancora
          </span>
        </div>
      )}
    </button>
  )
})

/**
 * StatBar — barra singola statistica.
 */
function StatBar({ label, value, color }) {
  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: '56px 1fr 22px',
        alignItems:          'center',
        gap:                 8,
      }}
    >
      {/* Label */}
      <span
        style={{
          fontFamily:   'Inter, sans-serif',
          fontSize:     11,
          color:        'var(--text-tertiary)',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          lineHeight:   1,
        }}
      >
        {label}
      </span>

      {/* Bar */}
      <div
        style={{
          height:       3,
          background:   'var(--bg-raised)',
          borderRadius: 99,
          overflow:     'hidden',
        }}
      >
        <div
          style={{
            height:       '100%',
            width:        `${Math.min(100, value)}%`,
            background:   value >= 80
              ? `linear-gradient(90deg, ${color}aa, ${color})`
              : value >= 50
              ? `${color}88`
              : `${color}55`,
            borderRadius: 99,
            transition:   'width 500ms var(--ease-standard)',
          }}
        />
      </div>

      {/* Value */}
      <span
        style={{
          fontFamily:         'Montserrat, sans-serif',
          fontSize:           11,
          fontWeight:         700,
          color:              value >= 80 ? color :
                              value >= 50 ? color + 'aa' :
                              'var(--text-tertiary)',
          textAlign:          'right',
          fontVariantNumeric: 'tabular-nums',
          lineHeight:         1,
        }}
      >
        {value}
      </span>
    </div>
  )
}
