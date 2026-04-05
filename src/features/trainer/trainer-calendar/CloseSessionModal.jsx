import { useState, useCallback, useEffect }  from 'react'
import { calcSessionXP, calcStreakPreview }  from '../../../utils/gamification'

/**
 * CloseSessionModal — chiusura sessione con selezione presenze.
 *
 * Design:
 * - Lista clienti con toggle presenza/assenza
 * - XP preview per ogni presente
 * - Riepilogo prima di confermare
 * - Default: tutti presenti
 */
export function CloseSessionModal({ slot, clients, onClose, onConfirm }) {
  const slotClients = slot.clientIds
    .map(id => clients.find(c => c.id === id))
    .filter(Boolean)

  const [attendees, setAttendees] = useState(new Set(slot.clientIds))
  const [loading,   setLoading]   = useState(false)

  // Keyboard: Escape chiude
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const toggle = useCallback((clientId) => {
    setAttendees(prev => {
      const next = new Set(prev)
      if (next.has(clientId)) next.delete(clientId)
      else next.add(clientId)
      return next
    })
  }, [])

  const handleConfirm = useCallback(async () => {
    setLoading(true)
    try {
      await onConfirm([...attendees])
    } finally {
      setLoading(false)
    }
  }, [attendees, onConfirm])

  const presentCount = attendees.size
  const absentCount  = slotClients.length - presentCount
  const totalXP      = [...attendees].reduce((sum, id) => {
    const client = clients.find(c => c.id === id)
    const xp     = client
      ? calcSessionXP(client.baseXP ?? 50, calcStreakPreview(client))
      : 0
    return sum + xp
  }, 0)

  return (
    <div
      style={{
        position:             'fixed',
        inset:                0,
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'center',
        padding:              16,
        background:           'rgba(7,9,14,0.85)',
        backdropFilter:       'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex:               400,
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in"
        style={{
          width:        '100%',
          maxWidth:     400,
          background:   'var(--bg-overlay)',
          border:       '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-2xl)',
          overflow:     'hidden',
          boxShadow:    'var(--shadow-lg)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding:      '20px 20px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      16,
              fontWeight:    900,
              color:         'var(--text-primary)',
              marginBottom:  4,
              letterSpacing: '-0.01em',
            }}
          >
            Chiudi sessione
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {slot.date} · {slot.startTime}
            {slot.endTime && ` → ${slot.endTime}`}
          </div>
        </div>

        {/* Istruzione */}
        <div style={{ padding: '14px 20px 10px' }}>
          <p
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      10,
              fontWeight:    600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color:         'var(--text-tertiary)',
              margin:        0,
            }}
          >
            Seleziona i presenti
          </p>
        </div>

        {/* Lista clienti */}
        <div
          style={{
            padding:       '0 20px',
            maxHeight:     280,
            overflowY:     'auto',
            display:       'flex',
            flexDirection: 'column',
            gap:           6,
          }}
        >
          {slotClients.map(client => {
            const isPresent = attendees.has(client.id)
            const xp        = calcSessionXP(
              client.baseXP ?? 50,
              calcStreakPreview(client)
            )

            return (
              <button
                key={client.id}
                onClick={() => toggle(client.id)}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          12,
                  padding:      '11px 14px',
                  background:   isPresent
                    ? 'rgba(14,196,82,0.08)'
                    : 'rgba(240,82,82,0.05)',
                  border:       `1px solid ${isPresent
                    ? 'rgba(14,196,82,0.2)'
                    : 'rgba(240,82,82,0.15)'}`,
                  borderRadius: 'var(--radius-lg)',
                  cursor:       'pointer',
                  textAlign:    'left',
                  transition:   'all var(--duration-fast)',
                  width:        '100%',
                }}
              >
                {/* Checkbox visuale */}
                <div
                  style={{
                    width:          20,
                    height:         20,
                    borderRadius:   'var(--radius-md)',
                    background:     isPresent ? 'var(--green-400)' : 'transparent',
                    border:         `1.5px solid ${isPresent
                      ? 'var(--green-400)'
                      : 'rgba(240,82,82,0.4)'}`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flexShrink:     0,
                    transition:     'all var(--duration-fast)',
                  }}
                >
                  {isPresent && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="var(--text-inverse)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Nome */}
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize:   13,
                    fontWeight: 500,
                    color:      isPresent
                      ? 'var(--text-primary)'
                      : 'var(--text-tertiary)',
                    flex:       1,
                    transition: 'color var(--duration-fast)',
                  }}
                >
                  {client.name}
                </span>

                {/* XP o Assente */}
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize:   10,
                    fontWeight: 700,
                    color:      isPresent ? '#0ec452' : '#f05252',
                    flexShrink: 0,
                    transition: 'color var(--duration-fast)',
                  }}
                >
                  {isPresent ? `+${xp} XP` : 'ASSENTE'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Riepilogo */}
        <div style={{ padding: '16px 20px 12px' }}>
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '12px 14px',
              background:     'var(--bg-raised)',
              border:         '1px solid var(--border-default)',
              borderRadius:   'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize:   12,
                  fontWeight: 700,
                  color:      '#0ec452',
                }}
              >
                {presentCount} presenti
              </span>
              {absentCount > 0 && (
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize:   12,
                    fontWeight: 700,
                    color:      '#f05252',
                  }}
                >
                  {absentCount} assenti
                </span>
              )}
            </div>

            {totalXP > 0 && (
              <span
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      12,
                  fontWeight:    900,
                  color:         'var(--green-400)',
                  letterSpacing: '-0.01em',
                }}
              >
                +{totalXP} XP totali
              </span>
            )}
          </div>
        </div>

        {/* Azioni */}
        <div
          style={{
            padding: '0 20px 20px',
            display: 'flex',
            gap:     10,
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex:          1,
              padding:       '11px',
              background:    'transparent',
              border:        '1px solid var(--border-default)',
              borderRadius:  'var(--radius-lg)',
              color:         'var(--text-secondary)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.06em',
              cursor:        'pointer',
              transition:    'all var(--duration-fast)',
            }}
          >
            ANNULLA
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading || presentCount === 0}
            style={{
              flex:          2,
              padding:       '11px',
              background:    presentCount > 0
                ? 'var(--gradient-primary)'
                : 'var(--bg-raised)',
              border:        'none',
              borderRadius:  'var(--radius-lg)',
              color:         presentCount > 0
                ? 'var(--text-inverse)'
                : 'var(--text-tertiary)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.06em',
              cursor:        loading || presentCount === 0
                ? 'not-allowed'
                : 'pointer',
              opacity:       loading ? 0.7 : 1,
              transition:    'all var(--duration-fast)',
            }}
          >
            {loading
              ? 'SALVATAGGIO...'
              : presentCount === 0
              ? 'SELEZIONA PRESENTI'
              : `CHIUDI · +${totalXP} XP`
            }
          </button>
        </div>
      </div>
    </div>
  )
}
