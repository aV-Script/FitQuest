import { useMemo }           from 'react'
import { Card }              from '../../../components/ui/Card'
import { StatNumber }        from '../../../components/ui/StatNumber'
import { calcSessionConfig,
         calcMonthlyCompletion } from '../../../utils/gamification'

/**
 * ClientSessionsSummary — riepilogo sessioni mensili del cliente.
 * Richiede gli slots già filtrati per il periodo.
 */
export function ClientSessionsSummary({ client, slots = [], color }) {
  const { monthlySessions } = calcSessionConfig(client.sessionsPerWeek ?? 3)

  const now  = new Date()
  const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  const clientSlots = useMemo(() =>
    slots.filter(s => s.clientIds?.includes(client.id) && s.date >= from)
  , [slots, client.id, from])

  const { completed, pct } = calcMonthlyCompletion(clientSlots, client.id)
  const planned            = clientSlots.length

  return (
    <Card padding="lg">
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 '1px',
          background:          'var(--border-subtle)',
          borderRadius:        'var(--radius-lg)',
          overflow:            'hidden',
          marginBottom:        16,
        }}
      >
        {[
          { label: 'Completate',  value: completed, color: '#0ec452' },
          { label: 'Pianificate', value: planned,   color: 'var(--text-secondary)' },
          { label: 'XP mese',     value: '—',       color },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-surface)', padding: '14px 16px' }}>
            <StatNumber value={s.value} label={s.label} color={s.color} size="sm" />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            height:       5,
            background:   'var(--bg-raised)',
            borderRadius: 99,
            overflow:     'hidden',
            marginBottom: 6,
          }}
        >
          <div
            style={{
              height:       '100%',
              width:        `${Math.min(100, pct)}%`,
              background:   pct >= 100 ? '#0ec452' : pct >= 50 ? '#f5a623' : '#f05252',
              borderRadius: 99,
              transition:   'width 700ms var(--ease-standard)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              color:         'var(--text-tertiary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {pct}% completato
          </span>
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              color:         'var(--text-tertiary)',
              letterSpacing: '0.08em',
            }}
          >
            Obiettivo: {monthlySessions} sessioni/mese
          </span>
        </div>
      </div>
    </Card>
  )
}
