/**
 * Badge — etichetta compatta per stato, categoria, ruolo.
 *
 * Ispirazione: Linear — badge monocromatici ad alta leggibilità.
 *
 * variant:
 *   green | cyan | amber | red | metal | purple | blue
 *
 * size:
 *   xs | sm | md
 */
export function Badge({
  children,
  variant = 'green',
  size    = 'sm',
  dot     = false,
  icon,
}) {
  const colors = {
    green:  { bg: 'rgba(14,196,82,0.1)',    text: '#0ec452',  border: 'rgba(14,196,82,0.2)'    },
    cyan:   { bg: 'rgba(46,207,255,0.1)',   text: '#2ecfff',  border: 'rgba(46,207,255,0.2)'   },
    amber:  { bg: 'rgba(245,166,35,0.1)',   text: '#f5a623',  border: 'rgba(245,166,35,0.2)'   },
    red:    { bg: 'rgba(240,82,82,0.1)',    text: '#f05252',  border: 'rgba(240,82,82,0.2)'    },
    metal:  { bg: 'rgba(122,143,166,0.1)',  text: '#7a8fa6',  border: 'rgba(122,143,166,0.15)' },
    purple: { bg: 'rgba(167,139,250,0.1)',  text: '#a78bfa',  border: 'rgba(167,139,250,0.2)'  },
    blue:   { bg: 'rgba(96,165,250,0.1)',   text: '#60a5fa',  border: 'rgba(96,165,250,0.2)'   },
  }

  const sizes = {
    xs: { fontSize: 8,  padding: '2px 5px',  gap: 3 },
    sm: { fontSize: 9,  padding: '3px 7px',  gap: 4 },
    md: { fontSize: 10, padding: '4px 10px', gap: 5 },
  }

  const c = colors[variant] ?? colors.metal
  const s = sizes[size]     ?? sizes.sm

  return (
    <span
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           s.gap,
        padding:       s.padding,
        background:    c.bg,
        border:        `1px solid ${c.border}`,
        borderRadius:  'var(--radius-sm)',
        color:         c.text,
        fontFamily:    'Montserrat, sans-serif',
        fontSize:      s.fontSize,
        fontWeight:    700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
        lineHeight:    1,
      }}
    >
      {dot && (
        <span
          style={{
            width:        5,
            height:       5,
            borderRadius: '50%',
            background:   'currentColor',
            flexShrink:   0,
          }}
        />
      )}
      {icon && <span style={{ fontSize: s.fontSize + 2 }}>{icon}</span>}
      {children}
    </span>
  )
}

/**
 * RankBadge — badge specializzato per il rank.
 * Usa il colore del rank per border e testo.
 */
export function RankBadge({ rank, color, size = 'sm' }) {
  const sizes = {
    sm: { fontSize: 10, padding: '3px 8px',  minWidth: 32 },
    md: { fontSize: 12, padding: '4px 10px', minWidth: 40 },
    lg: { fontSize: 14, padding: '6px 14px', minWidth: 52 },
  }
  const s = sizes[size] ?? sizes.sm

  return (
    <span
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        minWidth:       s.minWidth,
        padding:        s.padding,
        background:     color + '18',
        border:         `1px solid ${color}44`,
        borderRadius:   'var(--radius-sm)',
        color,
        fontFamily:     'Montserrat, sans-serif',
        fontSize:       s.fontSize,
        fontWeight:     900,
        letterSpacing:  '0.05em',
        lineHeight:     1,
        textShadow:     `0 0 12px ${color}66`,
      }}
    >
      {rank}
    </span>
  )
}

/**
 * StatusBadge — badge per stato slot/sessione.
 */
export function StatusBadge({ status }) {
  const config = {
    planned:   { label: 'Pianificata', variant: 'blue',  dot: true },
    completed: { label: 'Completata',  variant: 'green', dot: true },
    skipped:   { label: 'Saltata',     variant: 'metal', dot: true },
  }
  const cfg = config[status] ?? config.planned

  return <Badge variant={cfg.variant} dot={cfg.dot}>{cfg.label}</Badge>
}
