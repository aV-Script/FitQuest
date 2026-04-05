import { memo }   from 'react'
import { Button } from '../../../components/ui/Button'

const MONTH_NAMES = [
  'Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre',
]

const VIEW_CONFIG = [
  { id: 'month', label: 'Mese' },
  { id: 'week',  label: 'Sett.' },
  { id: 'day',   label: 'Giorno' },
]

/**
 * CalendarHeader — navigazione e controlli del calendario.
 *
 * Layout:
 * [← Oggi →]  Marzo 2026     [Mese|Sett.|Giorno]  [+ Sessione] [↺]
 */
export const CalendarHeader = memo(function CalendarHeader({
  currentDate,
  view,
  onNavigate,
  onToday,
  onSetView,
  onNewSlot,
  onNewRecurrence,
}) {
  const d     = new Date(currentDate + 'T12:00')
  const year  = d.getFullYear()
  const month = d.getMonth()

  const title = view === 'month'
    ? `${MONTH_NAMES[month]} ${year}`
    : view === 'week'
    ? getWeekTitle(currentDate)
    : d.toLocaleDateString('it-IT', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
      })

  const isToday = currentDate === new Date().toISOString().slice(0, 10)

  return (
    <div
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          12,
        padding:      '14px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink:   0,
        flexWrap:     'wrap',
      }}
    >
      {/* Navigazione */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavButton onClick={() => onNavigate(-1)} aria-label="Precedente">
          ‹
        </NavButton>

        <button
          onClick={onToday}
          style={{
            padding:       '6px 12px',
            background:    isToday
              ? 'rgba(14,196,82,0.1)'
              : 'transparent',
            border:        `1px solid ${isToday
              ? 'rgba(14,196,82,0.3)'
              : 'var(--border-default)'}`,
            borderRadius:  'var(--radius-lg)',
            color:         isToday
              ? 'var(--green-400)'
              : 'var(--text-secondary)',
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.06em',
            cursor:        'pointer',
            transition:    'all var(--duration-fast)',
            whiteSpace:    'nowrap',
          }}
          onMouseEnter={e => {
            if (!isToday) {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.color       = 'var(--text-primary)'
            }
          }}
          onMouseLeave={e => {
            if (!isToday) {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color       = 'var(--text-secondary)'
            }
          }}
        >
          OGGI
        </button>

        <NavButton onClick={() => onNavigate(1)} aria-label="Successivo">
          ›
        </NavButton>
      </div>

      {/* Titolo */}
      <h2
        style={{
          fontFamily:    'Montserrat, sans-serif',
          fontSize:      18,
          fontWeight:    900,
          color:         'var(--text-primary)',
          margin:        0,
          letterSpacing: '-0.01em',
          flex:          1,
          minWidth:      0,
          overflow:      'hidden',
          textOverflow:  'ellipsis',
          whiteSpace:    'nowrap',
        }}
      >
        {title}
      </h2>

      {/* Switcher vista */}
      <div
        style={{
          display:      'flex',
          background:   'var(--bg-raised)',
          border:       '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow:     'hidden',
          flexShrink:   0,
        }}
      >
        {VIEW_CONFIG.map((v, i) => {
          const isActive = view === v.id
          return (
            <button
              key={v.id}
              onClick={() => onSetView(v.id)}
              style={{
                padding:       '7px 14px',
                background:    isActive
                  ? 'rgba(14,196,82,0.12)'
                  : 'transparent',
                border:        'none',
                borderLeft:    i > 0
                  ? '1px solid var(--border-default)'
                  : 'none',
                color:         isActive
                  ? 'var(--green-400)'
                  : 'var(--text-tertiary)',
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      11,
                fontWeight:    700,
                letterSpacing: '0.05em',
                cursor:        'pointer',
                transition:    'all var(--duration-fast)',
                whiteSpace:    'nowrap',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-tertiary)'
              }}
            >
              {v.label}
            </button>
          )
        })}
      </div>

      {/* Azioni */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={onNewRecurrence}
          style={{
            padding:       '7px 12px',
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
            display:       'flex',
            alignItems:    'center',
            gap:           5,
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
          <span>↺</span>
          <span>RICORRENZA</span>
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewSlot}
          icon="+"
        >
          SESSIONE
        </Button>
      </div>
    </div>
  )
})

// ── Helpers ───────────────────────────────────────────────────

function NavButton({ children, onClick, 'aria-label': ariaLabel }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width:          32,
        height:         32,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'transparent',
        border:         '1px solid var(--border-default)',
        borderRadius:   'var(--radius-lg)',
        color:          'var(--text-tertiary)',
        cursor:         'pointer',
        fontSize:       18,
        lineHeight:     1,
        transition:     'all var(--duration-fast)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-strong)'
        e.currentTarget.style.color       = 'var(--text-primary)'
        e.currentTarget.style.background  = 'var(--bg-raised)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-default)'
        e.currentTarget.style.color       = 'var(--text-tertiary)'
        e.currentTarget.style.background  = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

function getWeekTitle(dateStr) {
  const d      = new Date(dateStr + 'T12:00')
  const day    = d.getDay()
  const diff   = (day + 6) % 7
  const monday = new Date(d)
  monday.setDate(d.getDate() - diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (date) => date.toLocaleDateString('it-IT', {
    day: 'numeric', month: 'short',
  })

  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()}–${sunday.getDate()} ${
      sunday.toLocaleDateString('it-IT', { month: 'long' })
    } ${sunday.getFullYear()}`
  }

  return `${fmt(monday)} – ${fmt(sunday)} ${sunday.getFullYear()}`
}
