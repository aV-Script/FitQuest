import { useMemo, useRef, useEffect, useState } from 'react'
import { EventBlock }                           from './EventBlock'

const HOURS    = Array.from({ length: 24 }, (_, i) => i)
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const HOUR_H   = 64

/**
 * WeekView — vista settimana stile Google Calendar.
 *
 * Features:
 * - 7 colonne, una per giorno
 * - Righe orarie ogni ora
 * - Linea ora corrente rossa
 * - Click su area vuota → crea sessione
 * - Scroll automatico all'ora corrente
 * - Oggi evidenziato in colonna
 */
export function WeekView({
  currentDate,
  slots,
  clients,
  today,
  onSlotClick,
  onEmptyClick,
}) {
  const scrollRef = useRef(null)
  const [nowTop, setNowTop] = useState(0)

  // Scroll all'ora corrente al mount
  useEffect(() => {
    const hour = new Date().getHours()
    if (scrollRef.current) {
      const target = Math.max(0, (hour - 2) * HOUR_H)
      scrollRef.current.scrollTop = target
    }
  }, [])

  // Aggiorna linea ora ogni minuto
  useEffect(() => {
    const update = () => {
      const now  = new Date()
      const mins = now.getHours() * 60 + now.getMinutes()
      setNowTop((mins / 60) * HOUR_H)
    }
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [])

  // Giorni della settimana
  const weekDays = useMemo(() => {
    const d      = new Date(currentDate + 'T12:00')
    const dow    = d.getDay()
    const diff   = (dow + 6) % 7
    const monday = new Date(d)
    monday.setDate(d.getDate() - diff)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      return date.toISOString().slice(0, 10)
    })
  }, [currentDate])

  // Slot per giorno
  const slotsByDate = useMemo(() => {
    const map = {}
    slots.forEach(s => {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    })
    return map
  }, [slots])

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        flex:          1,
        minHeight:     0,
        overflow:      'hidden',
      }}
    >
      {/* ── Header giorni ─────────────────────────────── */}
      <div
        style={{
          display:      'flex',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink:   0,
          background:   'var(--bg-surface)',
        }}
      >
        {/* Offset colonna ore */}
        <div style={{ width: 56, flexShrink: 0 }} />

        {weekDays.map((dateStr, i) => {
          const d        = new Date(dateStr + 'T12:00')
          const isToday  = dateStr === today
          const daySlots = slotsByDate[dateStr]?.length ?? 0

          return (
            <div
              key={dateStr}
              style={{
                flex:       1,
                textAlign:  'center',
                padding:    '10px 4px',
                borderLeft: '1px solid var(--border-subtle)',
                background: isToday
                  ? 'rgba(14,196,82,0.03)'
                  : 'transparent',
              }}
            >
              {/* Nome giorno */}
              <div
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      10,
                  fontWeight:    600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color:         isToday
                    ? 'var(--green-400)'
                    : 'var(--text-tertiary)',
                  marginBottom:  4,
                }}
              >
                {DAY_NAMES[i]}
              </div>

              {/* Numero giorno */}
              <div
                style={{
                  width:          32,
                  height:         32,
                  margin:         '0 auto',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  borderRadius:   'var(--radius-full)',
                  background:     isToday
                    ? 'var(--green-400)'
                    : 'transparent',
                  fontFamily:     'Montserrat, sans-serif',
                  fontSize:       16,
                  fontWeight:     900,
                  color:          isToday
                    ? 'var(--text-inverse)'
                    : 'var(--text-primary)',
                  letterSpacing:  '-0.02em',
                }}
              >
                {d.getDate()}
              </div>

              {/* Dot se ha eventi */}
              {daySlots > 0 && (
                <div
                  style={{
                    width:        4,
                    height:       4,
                    borderRadius: '50%',
                    background:   isToday
                      ? 'var(--green-400)'
                      : 'var(--text-tertiary)',
                    margin:       '4px auto 0',
                    opacity:      0.6,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Griglia oraria ────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{
          flex:               1,
          overflowY:          'auto',
          overscrollBehavior: 'contain',
        }}
      >
        <div
          style={{
            display:  'flex',
            height:   HOUR_H * 24,
            position: 'relative',
          }}
        >
          {/* Colonna ore */}
          <div
            style={{
              width:       56,
              flexShrink:  0,
              position:    'relative',
              borderRight: '1px solid var(--border-subtle)',
            }}
          >
            {HOURS.map(h => (
              <div
                key={h}
                style={{
                  position:   'absolute',
                  top:        h * HOUR_H - 8,
                  right:      8,
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize:   10,
                  fontWeight: 600,
                  color:      h === 0 ? 'transparent' : 'var(--text-tertiary)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Colonne giorni */}
          {weekDays.map((dateStr) => {
            const daySlots = slotsByDate[dateStr] ?? []
            const isToday  = dateStr === today
            const isPast   = dateStr < today

            return (
              <DayColumn
                key={dateStr}
                dateStr={dateStr}
                daySlots={daySlots}
                clients={clients}
                isToday={isToday}
                isPast={isPast}
                nowTop={nowTop}
                scrollRef={scrollRef}
                onSlotClick={onSlotClick}
                onEmptyClick={onEmptyClick}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * DayColumn — colonna singola nella WeekView.
 */
function DayColumn({
  dateStr,
  daySlots,
  clients,
  isToday,
  isPast,
  nowTop,
  scrollRef,
  onSlotClick,
  onEmptyClick,
}) {
  const positioned = useMemo(
    () => positionSlots(daySlots),
    [daySlots]
  )

  const handleColumnClick = (e) => {
    if (e.target !== e.currentTarget) return
    const rect    = e.currentTarget.getBoundingClientRect()
    const y       = e.clientY - rect.top + scrollRef.current.scrollTop
    const hour    = Math.floor(y / HOUR_H)
    const minutes = Math.round(((y % HOUR_H) / HOUR_H) * 60 / 15) * 15
    const time    = `${String(hour).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
    onEmptyClick(dateStr, time)
  }

  return (
    <div
      style={{
        flex:       1,
        position:   'relative',
        borderLeft: '1px solid var(--border-subtle)',
        background: isToday
          ? 'rgba(14,196,82,0.015)'
          : isPast
          ? 'rgba(0,0,0,0.02)'
          : 'transparent',
        cursor: 'pointer',
      }}
      onClick={handleColumnClick}
    >
      {/* Linee orarie */}
      {HOURS.map(h => (
        <div key={h}>
          {/* Linea ora piena */}
          <div
            style={{
              position:      'absolute',
              top:           h * HOUR_H,
              left:          0,
              right:         0,
              height:        1,
              background:    'var(--border-subtle)',
              pointerEvents: 'none',
            }}
          />
          {/* Linea mezzora */}
          <div
            style={{
              position:      'absolute',
              top:           h * HOUR_H + HOUR_H / 2,
              left:          0,
              right:         0,
              height:        1,
              background:    'var(--bg-raised)',
              pointerEvents: 'none',
            }}
          />
        </div>
      ))}

      {/* Linea ora corrente */}
      {isToday && (
        <div
          style={{
            position:      'absolute',
            top:           nowTop,
            left:          0,
            right:         0,
            zIndex:        10,
            pointerEvents: 'none',
            display:       'flex',
            alignItems:    'center',
          }}
        >
          <div
            style={{
              width:        8,
              height:       8,
              borderRadius: '50%',
              background:   '#ef4444',
              flexShrink:   0,
              marginLeft:   -4,
              boxShadow:    '0 0 6px rgba(239,68,68,0.6)',
            }}
          />
          <div
            style={{
              flex:       1,
              height:     1.5,
              background: '#ef4444',
              opacity:    0.8,
            }}
          />
        </div>
      )}

      {/* Slot */}
      {positioned.map(({ slot, top, height, left, width }) => (
        <EventBlock
          key={slot.id}
          slot={slot}
          clients={clients}
          onClick={(e) => { e.stopPropagation(); onSlotClick(slot, e) }}
          style={{ top, height, left: `${left}%`, width: `${width}%` }}
        />
      ))}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────

function timeToY(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h + m / 60) * HOUR_H
}

/**
 * Calcola posizione e larghezza degli slot
 * gestendo le sovrapposizioni.
 */
function positionSlots(slots) {
  if (!slots.length) return []

  const sorted = [...slots].sort((a, b) =>
    (a.startTime ?? '').localeCompare(b.startTime ?? '')
  )

  const positioned = sorted.map(slot => ({
    slot,
    top:    timeToY(slot.startTime),
    height: Math.max(28, timeToY(slot.endTime) - timeToY(slot.startTime)),
    left:   0,
    width:  100,
    col:    0,
    cols:   1,
  }))

  const groups = []
  let currentGroup = []

  positioned.forEach((item, i) => {
    if (i === 0) { currentGroup = [item]; return }
    const prev    = positioned[i - 1]
    const overlaps = item.top < prev.top + prev.height

    if (overlaps) {
      currentGroup.push(item)
    } else {
      groups.push([...currentGroup])
      currentGroup = [item]
    }
  })
  groups.push(currentGroup)

  groups.forEach(group => {
    if (group.length === 1) return
    const cols = group.length
    group.forEach((item, i) => {
      item.col   = i
      item.cols  = cols
      item.left  = (i / cols) * 100
      item.width = (1 / cols) * 100
    })
  })

  return positioned
}
