/**
 * XPBar — barra XP con animazione e milestone markers.
 * Usato nel dashboard cliente e nella PlayerCard.
 *
 * Props:
 *   xp          — XP corrente
 *   xpNext      — XP per il prossimo livello
 *   level       — livello corrente (opzionale)
 *   color       — colore del rank
 *   showNumbers — mostra labels (default true)
 *   showLevel   — mostra il livello (default true)
 *   size        — 'sm' (h-1.5) | 'md' | 'lg' (default)
 */
export function XPBar({
  xp,
  xpNext,
  color,
  level,
  showNumbers = true,
  showLevel   = true,
  size        = 'lg',
}) {
  const pct = xpNext > 0 ? Math.min(100, Math.round((xp / xpNext) * 100)) : 0

  const heights = { sm: 4, md: 6, lg: 8 }
  const h       = heights[size] ?? 8

  return (
    <div className="w-full max-w-sm" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Labels top */}
      {showNumbers && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {showLevel && level !== undefined && (
            <span
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      9,
                fontWeight:    700,
                color,
                letterSpacing: '0.08em',
              }}
            >
              LV {level}
            </span>
          )}
          {!showLevel && (
            <span
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      10,
                fontWeight:    600,
                color:         'rgba(255,255,255,0.3)',
                letterSpacing: '0.2em',
              }}
            >
              EXP
            </span>
          )}
          <span
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize:   9,
              fontWeight: 600,
              color:      'rgba(255,255,255,0.3)',
              marginLeft: 'auto',
            }}
          >
            {xp?.toLocaleString('it')} / {xpNext?.toLocaleString('it')} XP
          </span>
        </div>
      )}

      {/* Bar */}
      <div
        style={{
          height:       h,
          background:   'var(--bg-raised)',
          borderRadius: 99,
          overflow:     'hidden',
          position:     'relative',
        }}
      >
        <div
          style={{
            position:     'absolute',
            left:         0,
            top:          0,
            height:       '100%',
            width:        `${pct}%`,
            background:   `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 99,
            boxShadow:    `0 0 ${h * 2}px ${color}66`,
            transition:   'width 800ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      {/* Percentuale */}
      <div style={{ textAlign: 'right' }}>
        <span
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      8,
            fontWeight:    700,
            color:         pct >= 80 ? color : 'rgba(255,255,255,0.3)',
            letterSpacing: '0.08em',
            transition:    'color var(--duration-normal)',
          }}
        >
          {pct}%{level !== undefined ? ` → LV ${(level ?? 1) + 1}` : ''}
        </span>
      </div>
    </div>
  )
}
