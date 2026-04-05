import { useMemo }              from 'react'
import { Card, CardHeader }    from '../../../../components/ui/Card'
import { StatNumber }          from '../../../../components/ui/StatNumber'
import { ActivityLog }         from '../../../../components/ui'
import { calcSessionConfig,
         calcMonthlyCompletion } from '../../../../utils/gamification'

/**
 * PanoramicaTab — vista riassuntiva del cliente.
 * Mostra XP progress, sessioni del mese e attività recente.
 */
export function PanoramicaTab({ client, color, slots = [] }) {
  const { monthlySessions, xpPerSession } =
    calcSessionConfig(client.sessionsPerWeek ?? 3)

  const xpPct = client.xpNext > 0
    ? Math.min(100, Math.round((client.xp / client.xpNext) * 100))
    : 0

  // Sessioni questo mese
  const now  = new Date()
  const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  const monthSlots = useMemo(() =>
    slots.filter(s => s.date >= from && s.clientIds?.includes(client.id))
  , [slots, client.id, from])

  const { completed: completedThisMonth, pct: monthPct } =
    calcMonthlyCompletion(monthSlots, client.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>

      {/* ── XP Card ─────────────────────────────────────── */}
      <Card accent="green" padding="lg">
        <CardHeader label="Esperienza" />

        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 24,
            marginBottom:        20,
          }}
        >
          <StatNumber
            value={client.xp?.toLocaleString('it') ?? '0'}
            label="XP totale"
            sublabel={`di ${client.xpNext?.toLocaleString('it')}`}
            color={color}
            size="md"
          />
          <StatNumber
            value={xpPct}
            unit="%"
            label="Progressione"
            sublabel={`verso Lv ${(client.level ?? 1) + 1}`}
            color={xpPct >= 75 ? '#0ec452' : xpPct >= 40 ? '#f5a623' : 'var(--text-secondary)'}
            size="md"
          />
        </div>

        {/* XP Bar */}
        <div>
          <div
            style={{
              height:       8,
              background:   'var(--bg-raised)',
              borderRadius: 99,
              overflow:     'hidden',
              marginBottom: 6,
            }}
          >
            <div
              style={{
                height:       '100%',
                width:        `${xpPct}%`,
                background:   `linear-gradient(90deg, ${color}88, ${color})`,
                borderRadius: 99,
                boxShadow:    `0 0 12px ${color}55`,
                transition:   'width 800ms var(--ease-standard)',
              }}
            />
          </div>

          {/* Milestone markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[25, 50, 75, 100].map(milestone => (
              <span
                key={milestone}
                style={{
                  fontFamily:  'Montserrat, sans-serif',
                  fontSize:    9,
                  fontWeight:  600,
                  color:       xpPct >= milestone ? color + 'aa' : 'var(--text-tertiary)',
                  transition:  'color var(--duration-normal)',
                }}
              >
                {milestone}%
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Sessioni mese ───────────────────────────────── */}
      <Card padding="lg">
        <CardHeader label="Allenamenti questo mese" />

        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap:                 16,
            marginBottom:        20,
          }}
        >
          <StatNumber value={completedThisMonth} label="Completate" color="#0ec452" size="sm" />
          <StatNumber value={monthlySessions}    label="Obiettivo"  color="var(--text-secondary)" size="sm" />
          <StatNumber
            value={`${monthPct}%`}
            label="Completamento"
            color={monthPct >= 75 ? '#0ec452' : monthPct >= 40 ? '#f5a623' : '#f05252'}
            size="sm"
          />
        </div>

        {/* Progress bar mensile */}
        <div
          style={{
            height:       6,
            background:   'var(--bg-raised)',
            borderRadius: 99,
            overflow:     'hidden',
          }}
        >
          <div
            style={{
              height:       '100%',
              width:        `${Math.min(100, monthPct)}%`,
              background:   monthPct >= 100 ? '#0ec452' : monthPct >= 50 ? '#f5a623' : '#f05252',
              borderRadius: 99,
              transition:   'width 700ms var(--ease-standard)',
            }}
          />
        </div>

        {/* XP per sessione */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color:         'var(--text-tertiary)',
            }}
          >
            Guadagni
          </span>
          <span
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, color }}
          >
            +{xpPerSession} XP
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            per sessione completata
          </span>
        </div>
      </Card>

      {/* ── Activity Log ────────────────────────────────── */}
      <ActivityLog log={client.log} color={color} />
    </div>
  )
}
