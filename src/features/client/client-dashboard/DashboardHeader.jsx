import { memo }                    from 'react'
import { useClientRank }           from '../../../hooks/useClientRank'
import { RankRing }                from '../../../components/ui/RankRing'
import { Badge }                   from '../../../components/ui/Badge'
import { StatNumber }              from '../../../components/ui/StatNumber'
import { ReadonlyGuard }           from '../../../components/common/ReadonlyGuard'
import { getCategoriaById }        from '../../../constants'
import { getProfileCategory }      from '../../../constants/bia'
import { getPlayerRole }           from '../../../config/modules.config'

/**
 * DashboardHeader — hero del profilo cliente.
 *
 * Layout:
 * ┌──────────────────────────────────────────────────────┐
 * │ [←] [RankRing]  Nome Cognome              [+ TEST]   │
 * │                 LV24 · Active · Lun 15 Mar [+ BIA][✕]│
 * │────────────────────────────────────────────────────  │
 * │   87         24          3/sett       1.250 XP       │
 * │  MEDIA      LIVELLO     SESSIONI      ESPERIENZA      │
 * └──────────────────────────────────────────────────────┘
 */
export const DashboardHeader = memo(function DashboardHeader({
  client,
  onBack,
  onCampionamento,
  onBia,
  onDelete,
}) {
  const { rankObj, color, media } = useClientRank(client)
  const categoria  = getCategoriaById(client.categoria)
  const role       = getPlayerRole(client.ruolo)
  const profile    = getProfileCategory(client.profileType ?? 'tests_only')

  const lastCampDate = client.campionamenti?.[0]?.date ?? null

  const xpPct = client.xpNext > 0
    ? Math.min(100, Math.round((client.xp / client.xpNext) * 100))
    : 0

  const heroStats = [
    {
      label:    'Media',
      value:    media || '—',
      color:    media >= 75 ? '#0ec452' :
                media >= 50 ? '#2ecfff' :
                media >= 25 ? '#f5a623' : 'var(--text-tertiary)',
      sublabel: 'percentile',
    },
    {
      label:    'Livello',
      value:    client.level ?? 1,
      color,
      sublabel: `${xpPct}% → Lv${(client.level ?? 1) + 1}`,
    },
    {
      label:    'Sessioni',
      value:    client.sessionsPerWeek ?? 3,
      unit:     '/sett',
      color:    'var(--text-secondary)',
      sublabel: 'obiettivo',
    },
    {
      label:    'Esperienza',
      value:    client.xp?.toLocaleString('it') ?? '0',
      unit:     'XP',
      color:    color + 'cc',
      sublabel: `di ${client.xpNext?.toLocaleString('it')}`,
    },
  ]

  return (
    <div
      style={{
        background:   'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink:   0,
      }}
    >
      {/* ── Top row ─────────────────────────────────────── */}
      <div
        style={{
          display:     'flex',
          alignItems:  'flex-start',
          gap:         16,
          padding:     '20px 24px 16px',
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          aria-label="Torna alla lista"
          style={{
            width:          32,
            height:         32,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'transparent',
            border:         '1px solid var(--border-default)',
            borderRadius:   'var(--radius-md)',
            color:          'var(--text-tertiary)',
            cursor:         'pointer',
            fontSize:       16,
            flexShrink:     0,
            marginTop:      4,
            transition:     'all var(--duration-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-strong)'
            e.currentTarget.style.color       = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-default)'
            e.currentTarget.style.color       = 'var(--text-tertiary)'
          }}
        >
          ‹
        </button>

        {/* Rank Ring */}
        <div style={{ flexShrink: 0 }}>
          <RankRing
            rank={rankObj.label}
            color={color}
            media={media}
            size={64}
          />
        </div>

        {/* Info cliente */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontFamily:   'Montserrat, sans-serif',
              fontSize:     20,
              fontWeight:   900,
              color:        'var(--text-primary)',
              margin:       '0 0 6px',
              lineHeight:   1.2,
              letterSpacing: '-0.01em',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}
          >
            {client.name}
          </h2>

          {/* Badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Badge variant="green" size="xs">LV {client.level}</Badge>

            {role ? (
              <Badge variant="metal" size="xs">{role.icon} {role.label}</Badge>
            ) : categoria ? (
              <Badge variant="cyan" size="xs">{categoria.label}</Badge>
            ) : null}

            <Badge variant="metal" size="xs">{profile.label}</Badge>

            {lastCampDate && (
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'Inter, sans-serif' }}>
                · Ultimo: {lastCampDate}
              </span>
            )}
          </div>
        </div>

        {/* Azioni */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start' }}>
          <ReadonlyGuard>
            {profile.hasTests && (
              <button
                onClick={onCampionamento}
                style={{
                  padding:       '8px 14px',
                  background:    'var(--gradient-primary)',
                  border:        'none',
                  borderRadius:  'var(--radius-lg)',
                  color:         'var(--text-inverse)',
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      11,
                  fontWeight:    700,
                  letterSpacing: '0.07em',
                  cursor:        'pointer',
                  transition:    'opacity var(--duration-fast)',
                  whiteSpace:    'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                + TEST
              </button>
            )}

            {profile.hasBia && (
              <button
                onClick={onBia}
                style={{
                  padding:       '8px 14px',
                  background:    'transparent',
                  border:        '1px solid rgba(46,207,255,0.3)',
                  borderRadius:  'var(--radius-lg)',
                  color:         '#2ecfff',
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      11,
                  fontWeight:    700,
                  letterSpacing: '0.07em',
                  cursor:        'pointer',
                  transition:    'all var(--duration-fast)',
                  whiteSpace:    'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background  = 'rgba(46,207,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(46,207,255,0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background  = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(46,207,255,0.3)'
                }}
              >
                + BIA
              </button>
            )}
          </ReadonlyGuard>

          <ReadonlyGuard>
            <button
              onClick={onDelete}
              aria-label="Elimina cliente"
              style={{
                width:          32,
                height:         32,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     'transparent',
                border:         '1px solid var(--border-default)',
                borderRadius:   'var(--radius-md)',
                color:          'var(--text-tertiary)',
                cursor:         'pointer',
                fontSize:       12,
                transition:     'all var(--duration-fast)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(240,82,82,0.3)'
                e.currentTarget.style.color       = '#f05252'
                e.currentTarget.style.background  = 'rgba(240,82,82,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.color       = 'var(--text-tertiary)'
                e.currentTarget.style.background  = 'transparent'
              }}
            >
              ✕
            </button>
          </ReadonlyGuard>
        </div>
      </div>

      {/* ── Hero stats row ───────────────────────────────── */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: `repeat(${heroStats.length}, 1fr)`,
          borderTop:           '1px solid var(--border-subtle)',
        }}
      >
        {heroStats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding:     '16px 20px',
              borderRight: i < heroStats.length - 1
                ? '1px solid var(--border-subtle)'
                : 'none',
            }}
          >
            <StatNumber
              value={stat.value}
              unit={stat.unit}
              label={stat.label}
              sublabel={stat.sublabel}
              color={stat.color}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  )
})
