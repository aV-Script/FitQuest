import { useRef, useEffect, useState, useMemo } from 'react'
import { EventBlock }                           from './EventBlock'

const HOURS  = Array.from({ length: 24 }, (_, i) => i)
const HOUR_H = 64

/**
 * DayView — vista giorno con colonna oraria singola.
 */
export function DayView({
  currentDate,
  slots,
  clients,
  today,
  onSlotClick,
  onEmptyClick,
}) {
  const scrollRef           = useRef(null)
  const [nowTop, setNowTop] = useState(0)
  const isToday             = currentDate === today

  // Scroll all'ora corrente al mount
  useEffect(() => {
    const hour = new Date().getHours()
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, (hour - 2) * HOUR_H)
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

  const daySlots = useMemo(() =>
    slots.filter(s => s.date === currentDate)
  , [slots, currentDate])

  const handleClick = (e) => {
    if (e.target !== e.currentTarget) return
    const rect    = e.currentTarget.getBoundingClientRect()
    const y       = e.clientY - rect.top + scrollRef.current.scrollTop
    const hour    = Math.floor(y / HOUR_H)
    const minutes = Math.round(((y % HOUR_H) / HOUR_H) * 60 / 15) * 15
    const time    = `${String(hour).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
    onEmptyClick(currentDate, time)
  }

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
      {/* Header giorno */}
      <div
        style={{
          textAlign:    'center',
          padding:      '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink:   0,
          background:   isToday
            ? 'rgba(14,196,82,0.03)'
            : 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      10,
            fontWeight:    600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         isToday
              ? 'var(--green-400)'
              : 'var(--text-tertiary)',
            marginBottom:  4,
          }}
        >
          {new Date(currentDate + 'T12:00')
            .toLocaleDateString('it-IT', { weekday: 'long' })
            .toUpperCase()}
        </div>
        <div
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          56,
            height:         56,
            borderRadius:   'var(--radius-full)',
            background:     isToday ? 'var(--green-400)' : 'transparent',
            fontFamily:     'Montserrat, sans-serif',
            fontSize:       32,
            fontWeight:     900,
            color:          isToday
              ? 'var(--text-inverse)'
              : 'var(--text-primary)',
            letterSpacing:  '-0.02em',
          }}
        >
          {new Date(currentDate + 'T12:00').getDate()}
        </div>

        {daySlots.length > 0 && (
          <div
            style={{
              marginTop:     6,
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      10,
              fontWeight:    600,
              color:         'var(--text-tertiary)',
              letterSpacing: '0.08em',
            }}
          >
            {daySlots.length} {daySlots.length === 1 ? 'sessione' : 'sessioni'}
          </div>
        )}
      </div>

      {/* Griglia oraria */}
      <div
        ref={scrollRef}
        style={{
          flex:      1,
          overflowY: 'auto',
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
              borderRight: '1px solid var(--border-subtle)',
              position:    'relative',
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
                }}
              >
                {String(h).padStart(2,'0')}:00
              </div>
            ))}
          </div>

          {/* Colonna eventi */}
          <div
            style={{
              flex:     1,
              position: 'relative',
              cursor:   'pointer',
            }}
            onClick={handleClick}
          >
            {HOURS.map(h => (
              <div key={h}>
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
            {daySlots.map(slot => {
              const top    = timeToY(slot.startTime)
              const height = Math.max(32, timeToY(slot.endTime) - top)
              return (
                <EventBlock
                  key={slot.id}
                  slot={slot}
                  clients={clients}
                  onClick={e => { e.stopPropagation(); onSlotClick(slot, e) }}
                  style={{ top, height, left: 4, right: 4, width: 'auto' }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function timeToY(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h + m / 60) * HOUR_H
}
