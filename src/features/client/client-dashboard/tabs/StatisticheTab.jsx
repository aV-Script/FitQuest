import { useState }              from 'react'
import { Card, CardHeader }      from '../../../../components/ui/Card'
import { StatsSection }          from '../../../../components/ui'
import { EmptyState, EMPTY_STATES } from '../../../../components/ui/EmptyState'
import { StatsChart }            from '../../StatsChart'
import { useReadonly }           from '../../../../context/ReadonlyContext'

/**
 * StatisticheTab — statistiche atletiche e storico campionamenti.
 */
export function StatisticheTab({ client, color, onCampionamento }) {
  const [showAll, setShowAll] = useState(false)
  const readonly = useReadonly()

  const campionamenti = client.campionamenti ?? []
  const hasCamps      = campionamenti.length > 0
  const prevStats     = campionamenti[1]?.stats ?? null
  const displayed     = showAll ? campionamenti : campionamenti.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      {!hasCamps ? (
        <EmptyState
          {...EMPTY_STATES.campionamenti}
          action={!readonly ? { label: '+ NUOVO CAMPIONAMENTO', onClick: onCampionamento } : null}
        />
      ) : (
        <>
          {/* Statistiche attuali */}
          <Card padding="lg">
            <CardHeader
              label="Statistiche attuali"
              action={!readonly ? { label: '+ Campionamento', onClick: onCampionamento } : null}
            />
            <StatsSection
              stats={client.stats}
              prevStats={prevStats}
              categoria={client.categoria}
              color={color}
              pentagonSize={140}
            />
          </Card>

          {/* Grafico andamento */}
          {campionamenti.length >= 2 && (
            <Card padding="lg">
              <CardHeader label="Andamento nel tempo" />
              <StatsChart
                campionamenti={campionamenti}
                color={color}
                categoria={client.categoria}
              />
            </Card>
          )}

          {/* Storico campionamenti */}
          <Card padding="lg">
            <CardHeader label={`Storico campionamenti (${campionamenti.length})`} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {displayed.map((camp, i) => (
                <CampionamentoRow
                  key={i}
                  camp={camp}
                  prev={campionamenti[i + 1]}
                  color={color}
                  isLatest={i === 0}
                />
              ))}
            </div>

            {campionamenti.length > 5 && (
              <button
                onClick={() => setShowAll(p => !p)}
                style={{
                  width:         '100%',
                  marginTop:     12,
                  padding:       '8px',
                  background:    'transparent',
                  border:        '1px solid var(--border-default)',
                  borderRadius:  'var(--radius-lg)',
                  color:         'var(--text-tertiary)',
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      11,
                  fontWeight:    700,
                  letterSpacing: '0.06em',
                  cursor:        'pointer',
                  transition:    'all var(--duration-fast)',
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
                {showAll
                  ? 'MOSTRA MENO'
                  : `MOSTRA TUTTI (${campionamenti.length - 5} nascosti)`
                }
              </button>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

/**
 * CampionamentoRow — riga singolo campionamento nello storico.
 */
function CampionamentoRow({ camp, prev, color, isLatest }) {
  const mediaDelta = prev
    ? (camp.media ?? 0) - (prev.media ?? 0)
    : null

  return (
    <div
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          12,
        padding:      '12px 14px',
        background:   isLatest ? color + '08' : 'var(--bg-raised)',
        border:       `1px solid ${isLatest ? color + '22' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Data */}
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize:   12,
          fontWeight: 700,
          color:      isLatest ? color : 'var(--text-secondary)',
          width:      70,
          flexShrink: 0,
        }}
      >
        {camp.date}
      </div>

      {/* Media */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      18,
            fontWeight:    900,
            color:         isLatest ? color : 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight:    1,
          }}
        >
          {camp.media ?? '—'}
        </span>

        {mediaDelta !== null && (
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize:   10,
              fontWeight: 700,
              color:      mediaDelta > 0 ? '#0ec452' :
                          mediaDelta < 0 ? '#f05252' :
                          'var(--text-tertiary)',
            }}
          >
            {mediaDelta > 0 ? `▲ +${mediaDelta}` :
             mediaDelta < 0 ? `▼ ${mediaDelta}` : '—'}
          </span>
        )}
      </div>

      {/* Badge latest */}
      {isLatest && (
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      8,
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color,
            padding:       '2px 6px',
            background:    color + '12',
            border:        `1px solid ${color}22`,
            borderRadius:  'var(--radius-sm)',
          }}
        >
          Ultimo
        </span>
      )}
    </div>
  )
}
