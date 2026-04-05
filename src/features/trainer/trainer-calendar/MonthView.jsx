import { useMemo } from 'react'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

const STATUS_COLORS = {
  planned:   '#2ecfff',
  completed: '#0ec452',
  skipped:   '#7a8fa6',
}

/**
 * MonthView — griglia mese con eventi pill.
 */
export function MonthView({
  currentDate,
  slots,
  clients,
  today,
  onSlotClick,
  onEmptyClick,
}) {
  const d     = new Date(currentDate + 'T12:00')
  const year  = d.getFullYear()
  const month = d.getMonth()

  const slotsByDate = useMemo(() => {
    const map = {}
    slots.forEach(s => {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    })
    return map
  }, [slots])

  const calendarDays = useMemo(() => {
    const firstDay    = new Date(year, month, 1)
    const lastDay     = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7
    const days        = []

    for (let i = 0; i < startOffset; i++) days.push(null)

    for (let dd = 1; dd <= lastDay.getDate(); dd++) {
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(dd).padStart(2,'0')}`
      days.push({
        day:     dd,
        dateStr,
        slots:   slotsByDate[dateStr] ?? [],
        isToday: dateStr === today,
        isPast:  dateStr < today,
      })
    }

    return days
  }, [year, month, slotsByDate, today])

  return (
    <div
      style={{
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        overflow:      'hidden',
        padding:       '0 16px 16px',
      }}
    >
      {/* Header giorni settimana */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap:                 4,
          padding:             '8px 0',
          flexShrink:          0,
        }}
      >
        {DAY_NAMES.map(name => (
          <div
            key={name}
            style={{
              textAlign:     'center',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      10,
              fontWeight:    700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color:         'var(--text-tertiary)',
              padding:       '4px 0',
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Griglia giorni */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows:        '1fr',
          gap:                 4,
          flex:                1,
          overflowY:           'auto',
        }}
      >
        {calendarDays.map((cell, i) => {
          if (!cell) return (
            <div
              key={`empty-${i}`}
              style={{
                borderRadius: 'var(--radius-lg)',
                background:   'rgba(255,255,255,0.01)',
                border:       '1px solid transparent',
              }}
            />
          )

          return (
            <DayCell
              key={cell.dateStr}
              cell={cell}
              clients={clients}
              onSlotClick={onSlotClick}
              onEmptyClick={onEmptyClick}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * DayCell — cella singola nella MonthView.
 */
function DayCell({ cell, clients, onSlotClick, onEmptyClick }) {
  const { day, dateStr, slots, isToday, isPast } = cell
  const visibleSlots = slots.slice(0, 3)
  const hiddenCount  = slots.length - visibleSlots.length

  return (
    <div
      onClick={() => onEmptyClick(dateStr, '09:00')}
      style={{
        display:       'flex',
        flexDirection: 'column',
        padding:       '6px',
        background:    isToday
          ? 'rgba(14,196,82,0.04)'
          : isPast
          ? 'rgba(0,0,0,0.02)'
          : 'var(--bg-raised)',
        border:        `1px solid ${isToday
          ? 'rgba(14,196,82,0.2)'
          : 'var(--border-subtle)'}`,
        borderRadius:  'var(--radius-lg)',
        cursor:        'pointer',
        minHeight:     80,
        transition:    'border-color var(--duration-fast)',
        overflow:      'hidden',
      }}
      onMouseEnter={e => {
        if (!isToday)
          e.currentTarget.style.borderColor = 'var(--border-default)'
      }}
      onMouseLeave={e => {
        if (!isToday)
          e.currentTarget.style.borderColor = 'var(--border-subtle)'
      }}
    >
      {/* Numero giorno */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          26,
          height:         26,
          borderRadius:   'var(--radius-full)',
          background:     isToday ? 'var(--green-400)' : 'transparent',
          fontFamily:     'Montserrat, sans-serif',
          fontSize:       13,
          fontWeight:     isToday ? 900 : 600,
          color:          isToday
            ? 'var(--text-inverse)'
            : isPast
            ? 'var(--text-tertiary)'
            : 'var(--text-primary)',
          marginBottom:   4,
          flexShrink:     0,
        }}
      >
        {day}
      </div>

      {/* Pill eventi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {visibleSlots.map(slot => {
          const statusColor = STATUS_COLORS[slot.status ?? 'planned']
          const clientNames = slot.clientIds
            .map(id => clients.find(c => c.id === id)?.name)
            .filter(Boolean)
          const label = clientNames.length === 1
            ? clientNames[0].split(' ')[0]
            : clientNames.length > 1
            ? `${clientNames.length} pers.`
            : 'Sessione'

          return (
            <button
              key={slot.id}
              onClick={e => { e.stopPropagation(); onSlotClick(slot, e) }}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          4,
                padding:      '2px 6px',
                background:   statusColor + '18',
                border:       'none',
                borderRadius: 'var(--radius-sm)',
                cursor:       'pointer',
                textAlign:    'left',
                overflow:     'hidden',
                transition:   'background var(--duration-fast)',
              }}
              onMouseEnter={e =>
                e.currentTarget.style.background = statusColor + '28'
              }
              onMouseLeave={e =>
                e.currentTarget.style.background = statusColor + '18'
              }
            >
              <span
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      9,
                  fontWeight:    700,
                  color:         statusColor,
                  letterSpacing: '0.03em',
                  overflow:      'hidden',
                  textOverflow:  'ellipsis',
                  whiteSpace:    'nowrap',
                  lineHeight:    1.4,
                }}
              >
                {slot.startTime} {label}
              </span>
            </button>
          )
        })}

        {hiddenCount > 0 && (
          <span
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              color:         'var(--text-tertiary)',
              padding:       '0 4px',
              letterSpacing: '0.05em',
            }}
          >
            +{hiddenCount} altri
          </span>
        )}
      </div>
    </div>
  )
}
