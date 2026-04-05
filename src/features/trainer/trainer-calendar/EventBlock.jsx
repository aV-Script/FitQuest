import { memo } from 'react'

const STATUS_STYLES = {
  planned: {
    bg:     'rgba(46,207,255,0.1)',
    border: 'rgba(46,207,255,0.3)',
    text:   '#2ecfff',
    dot:    '#2ecfff',
    label:  'Pianificata',
  },
  completed: {
    bg:     'rgba(14,196,82,0.1)',
    border: 'rgba(14,196,82,0.3)',
    text:   '#0ec452',
    dot:    '#0ec452',
    label:  'Completata',
  },
  skipped: {
    bg:     'rgba(122,143,166,0.08)',
    border: 'rgba(122,143,166,0.2)',
    text:   '#7a8fa6',
    dot:    '#7a8fa6',
    label:  'Saltata',
  },
}

/**
 * EventBlock — blocco evento nelle viste settimana e giorno.
 *
 * Mostra:
 * - Orario
 * - Nome clienti (fino a 2)
 * - Status con colore
 * - Icona ricorrenza
 */
export const EventBlock = memo(function EventBlock({
  slot,
  clients,
  onClick,
  style,
}) {
  const status = STATUS_STYLES[slot.status ?? 'planned']

  const clientNames = slot.clientIds
    .map(id => clients.find(c => c.id === id)?.name)
    .filter(Boolean)

  const isShort  = (style?.height ?? 60) < 40
  const isMedium = (style?.height ?? 60) < 70
  const hasGroup = slot.groupIds?.length > 0

  const mainLabel = clientNames.length === 0
    ? hasGroup ? 'Gruppo' : 'Sessione'
    : clientNames.length === 1
    ? clientNames[0]
    : `${clientNames[0]} +${clientNames.length - 1}`

  return (
    <button
      onClick={onClick}
      style={{
        position:       'absolute',
        left:           2,
        right:          2,
        background:     status.bg,
        border:         `1px solid ${status.border}`,
        borderLeft:     `3px solid ${status.dot}`,
        borderRadius:   'var(--radius-md)',
        padding:        isShort ? '2px 6px' : '4px 8px',
        textAlign:      'left',
        cursor:         'pointer',
        overflow:       'hidden',
        transition:     'all var(--duration-fast)',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'flex-start',
        gap:            1,
        boxShadow:      'none',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 2px 12px ${status.dot}33`
        e.currentTarget.style.zIndex    = '10'
        e.currentTarget.style.transform = 'scaleX(1.01)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.zIndex    = '1'
        e.currentTarget.style.transform = 'scaleX(1)'
      }}
    >
      {/* Orario */}
      {!isShort && (
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      9,
            fontWeight:    700,
            letterSpacing: '0.05em',
            color:         status.text,
            lineHeight:    1,
            opacity:       0.8,
          }}
        >
          {slot.startTime}
          {slot.endTime && !isMedium && ` → ${slot.endTime}`}
        </span>
      )}

      {/* Nome clienti */}
      <span
        style={{
          fontFamily:   'Inter, sans-serif',
          fontSize:     isShort ? 9 : 11,
          fontWeight:   600,
          color:        status.text,
          lineHeight:   1.2,
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
        }}
      >
        {isShort && `${slot.startTime} · `}
        {mainLabel}
      </span>

      {/* Icone status */}
      {!isShort && !isMedium && (
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        4,
            marginTop:  'auto',
          }}
        >
          {slot.recurrenceId && (
            <span
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize:   8,
                color:      status.text,
                opacity:    0.6,
              }}
            >
              ↺
            </span>
          )}
          {slot.status === 'completed' && (
            <span style={{ fontSize: 8, color: '#0ec452' }}>✓</span>
          )}
          {slot.status === 'skipped' && (
            <span style={{ fontSize: 8, color: '#7a8fa6' }}>✕</span>
          )}
        </div>
      )}
    </button>
  )
})
