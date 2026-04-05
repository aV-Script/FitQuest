import { useEffect, useRef, useCallback }        from 'react'
import { StatusBadge }                           from '../../../components/ui/Badge'
import { calcSessionXP, calcStreakPreview }      from '../../../utils/gamification'

/**
 * SlotPopup — popup dettaglio slot.
 *
 * Appare al click su un evento.
 * Si auto-posiziona per rimanere dentro il viewport.
 */
export function SlotPopup({
  slot,
  clients,
  position,
  onClose,
  onCloseSession,
  onSkip,
  onDelete,
  onViewRecurrence,
}) {
  const ref     = useRef(null)
  const isToday = slot.date === new Date().toISOString().slice(0, 10)
  const isPast  = slot.date <= new Date().toISOString().slice(0, 10)
  const status  = slot.status ?? 'planned'

  const slotClients = slot.clientIds
    .map(id => clients.find(c => c.id === id))
    .filter(Boolean)

  // Chiude al click fuori
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler)
    }, 100)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [onClose])

  // Keyboard: Escape chiude
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Auto-posizionamento dentro il viewport
  const adjustedPosition = useCallback(() => {
    const POPUP_W = 288
    const POPUP_H = 400
    const MARGIN  = 12

    let x = position.x
    let y = position.y

    if (x + POPUP_W + MARGIN > window.innerWidth) {
      x = window.innerWidth - POPUP_W - MARGIN
    }
    if (x < MARGIN) x = MARGIN

    if (y + POPUP_H + MARGIN > window.innerHeight) {
      y = position.y - POPUP_H - MARGIN
    }
    if (y < MARGIN) y = MARGIN

    return { x, y }
  }, [position])

  const { x, y } = adjustedPosition()

  const dateLabel = new Date(slot.date + 'T12:00').toLocaleDateString('it-IT', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
  })

  return (
    <div
      ref={ref}
      className="animate-scale-in"
      style={{
        position:     'fixed',
        top:          y,
        left:         x,
        width:        288,
        zIndex:       500,
        background:   'var(--bg-float)',
        border:       '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-xl)',
        boxShadow:    'var(--shadow-lg)',
        overflow:     'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div
        style={{
          padding:      '14px 16px 12px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Orario */}
            <div
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      16,
                fontWeight:    900,
                color:         'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight:    1,
                marginBottom:  4,
              }}
            >
              {slot.startTime}
              {slot.endTime && (
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  {' → '}{slot.endTime}
                </span>
              )}
            </div>

            {/* Data */}
            <div
              style={{
                fontSize:      12,
                color:         'var(--text-tertiary)',
                lineHeight:    1.3,
                textTransform: 'capitalize',
              }}
            >
              {dateLabel}
            </div>
          </div>

          {/* Status + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StatusBadge status={status} />
            <button
              onClick={onClose}
              style={{
                width:          24,
                height:         24,
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
                flexShrink:     0,
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
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* ── Clienti ────────────────────────────────────── */}
      <div style={{ padding: '10px 16px' }}>
        {slotClients.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
            Nessun cliente assegnato
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {slotClients.map(client => {
              const isPresent = slot.attendees?.includes(client.id)
              const isAbsent  = slot.absentees?.includes(client.id)
              const xp        = calcSessionXP(
                client.baseXP ?? 50,
                calcStreakPreview(client)
              )

              return (
                <div
                  key={client.id}
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          8,
                    padding:      '7px 10px',
                    background:   isPresent
                      ? 'rgba(14,196,82,0.06)'
                      : isAbsent
                      ? 'rgba(240,82,82,0.06)'
                      : 'var(--bg-raised)',
                    border:       `1px solid ${
                      isPresent ? 'rgba(14,196,82,0.15)' :
                      isAbsent  ? 'rgba(240,82,82,0.15)' :
                      'var(--border-subtle)'
                    }`,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {/* Indicatore */}
                  <span
                    style={{
                      fontSize:   12,
                      flexShrink: 0,
                      color:      isPresent ? '#0ec452' :
                                  isAbsent  ? '#f05252' :
                                  'var(--text-tertiary)',
                    }}
                  >
                    {isPresent ? '✓' : isAbsent ? '✗' : '·'}
                  </span>

                  {/* Nome */}
                  <span
                    style={{
                      fontFamily:   'Inter, sans-serif',
                      fontSize:     13,
                      fontWeight:   500,
                      color:        isAbsent
                        ? 'var(--text-tertiary)'
                        : 'var(--text-secondary)',
                      flex:         1,
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                    }}
                  >
                    {client.name}
                  </span>

                  {/* XP */}
                  {isPresent && (
                    <span
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize:   9,
                        fontWeight: 700,
                        color:      '#0ec452',
                        flexShrink: 0,
                      }}
                    >
                      +{xp} XP
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Badge ricorrente */}
      {slot.recurrenceId && (
        <div style={{ padding: '0 16px 8px' }}>
          <button
            onClick={() => onViewRecurrence?.(slot.recurrenceId)}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          6,
              padding:      '6px 10px',
              background:   'rgba(122,143,166,0.08)',
              border:       '1px solid rgba(122,143,166,0.15)',
              borderRadius: 'var(--radius-md)',
              cursor:       onViewRecurrence ? 'pointer' : 'default',
              width:        '100%',
              textAlign:    'left',
              transition:   'all var(--duration-fast)',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>↺</span>
            <span
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      9,
                fontWeight:    700,
                letterSpacing: '0.08em',
                color:         'var(--text-tertiary)',
                flex:          1,
              }}
            >
              SESSIONE RICORRENTE
            </span>
            {onViewRecurrence && (
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize:   9,
                  color:      'var(--text-tertiary)',
                  opacity:    0.5,
                }}
              >
                GESTISCI →
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── Azioni ─────────────────────────────────────── */}
      <div
        style={{
          padding:       '10px 16px 14px',
          borderTop:     '1px solid var(--border-subtle)',
          display:       'flex',
          flexDirection: 'column',
          gap:           6,
        }}
      >
        {/* Chiudi sessione */}
        {status === 'planned' && (
          <button
            onClick={onCloseSession}
            style={{
              width:          '100%',
              padding:        '10px 14px',
              background:     'var(--gradient-primary)',
              border:         'none',
              borderRadius:   'var(--radius-lg)',
              color:          'var(--text-inverse)',
              fontFamily:     'Montserrat, sans-serif',
              fontSize:       11,
              fontWeight:     700,
              letterSpacing:  '0.07em',
              cursor:         'pointer',
              transition:     'opacity var(--duration-fast)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            6,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span>✓</span>
            CHIUDI SESSIONE
          </button>
        )}

        {/* Salta */}
        {status === 'planned' && isPast && (
          <button
            onClick={onSkip}
            style={{
              width:         '100%',
              padding:       '8px 14px',
              background:    'transparent',
              border:        '1px solid var(--border-default)',
              borderRadius:  'var(--radius-lg)',
              color:         'var(--text-tertiary)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.07em',
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
            SEGNA COME SALTATA
          </button>
        )}

        {/* Elimina */}
        <button
          onClick={onDelete}
          style={{
            width:         '100%',
            padding:       '8px 14px',
            background:    'transparent',
            border:        '1px solid transparent',
            borderRadius:  'var(--radius-lg)',
            color:         'var(--text-tertiary)',
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.07em',
            cursor:        'pointer',
            transition:    'all var(--duration-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(240,82,82,0.3)'
            e.currentTarget.style.color       = '#f05252'
            e.currentTarget.style.background  = 'rgba(240,82,82,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.color       = 'var(--text-tertiary)'
            e.currentTarget.style.background  = 'transparent'
          }}
        >
          ELIMINA SESSIONE
        </button>
      </div>
    </div>
  )
}
