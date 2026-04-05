import { Card, CardHeader }          from '../../../../components/ui/Card'
import { EmptyState, EMPTY_STATES }  from '../../../../components/ui/EmptyState'
import { BiaSummary }                from '../../../bia/bia-view/BiaSummary'
import { BiaHistoryChart }           from '../../../bia/bia-view/BiaHistoryChart'
import { useReadonly }               from '../../../../context/ReadonlyContext'

/**
 * BiaTab — composizione corporea e storico BIA.
 */
export function BiaTab({ client, color, onBia }) {
  const hasBia   = (client.biaHistory?.length ?? 0) > 0
  const readonly = useReadonly()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      {!hasBia ? (
        <EmptyState
          {...EMPTY_STATES.bia}
          action={!readonly ? { label: '+ PRIMA MISURAZIONE BIA', onClick: onBia } : null}
        />
      ) : (
        <>
          {/* BIA attuale */}
          <Card padding="lg">
            <CardHeader
              label="Composizione corporea attuale"
              action={!readonly ? { label: '+ Nuova misurazione', onClick: onBia } : null}
            />
            <BiaSummary
              bia={client.lastBia}
              prevBia={client.biaHistory?.[1] ?? null}
              sex={client.sesso}
              age={client.eta}
              color={color}
            />
          </Card>

          {/* Storico BIA */}
          {(client.biaHistory?.length ?? 0) >= 2 && (
            <Card padding="lg">
              <CardHeader label="Andamento composizione corporea" />
              <BiaHistoryChart biaHistory={client.biaHistory} color={color} />
            </Card>
          )}

          {/* Info misurazioni */}
          <div
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              padding:      '10px 14px',
              background:   'var(--bg-raised)',
              border:       '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <span style={{ fontSize: 14 }}>📊</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {client.biaHistory?.length ?? 0} misurazioni totali ·{' '}
              Ultima: {client.lastBia?.date ?? '—'}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
