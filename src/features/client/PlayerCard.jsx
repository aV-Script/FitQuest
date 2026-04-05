import { useState, useRef, useCallback, useEffect } from 'react'
import { useClientRank }    from '../../hooks/useClientRank'
import { getStatsConfig }   from '../../constants'
import { Pentagon }         from '../../components/ui/Pentagon'
import { getPlayerRole }    from '../../config/modules.config'
import { getCategoriaById } from '../../constants'
/**
 * PlayerCard — carta atletica del cliente.
 *
 * Effetto olografico: la carta reagisce al movimento
 * del mouse con un gradiente shine che si sposta.
 *
 * Layout (ispirazione FIFA Ultimate Team):
 * ┌──────────────────────┐
 * │  [RANK]    [RUOLO]   │
 * │                      │
 * │   [NOME GRANDE]      │
 * │                      │
 * │  [STATS GRID 3x2]    │
 * │                      │
 * │  [PENTAGON]  [XP]    │
 * │                      │
 * │  [FOOTER BAR]        │
 * └──────────────────────┘
 */
export function PlayerCard({ client, onEnter }) {
  const { rankObj, color, media } = useClientRank(client)
  const config     = getStatsConfig(client.categoria ?? 'active')
  const statKeys   = config.map(s => s.stat)
  const statLabels = config.map(s => s.label)
  const role       = getPlayerRole(client.ruolo)
  const categoria  = getCategoriaById(client.categoria)

  const xpPct = client.xpNext > 0
    ? Math.min(100, Math.round((client.xp / client.xpNext) * 100))
    : 0

  // ── Effetto olografico ────────────────────────────────────
  const cardRef  = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = (e.clientX - cx) / (rect.width  / 2)
    const dy   = (e.clientY - cy) / (rect.height / 2)

    setTilt({ x: dy * -8, y: dx * 8 })
    setShinePos({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    })
  }, [])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setShinePos({ x: 50, y: 50 })
  }, [])

  // Animazione entrata
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Colori stats — 6 max, griglia 3x2
  const displayStats = statKeys.slice(0, 6)

  return (
    <div
      style={{
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            32,
        background:     'var(--bg-base)',
        padding:        24,
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      {/* Sfondo con glow e pattern */}
      <div className="absolute inset-0 bg-hex opacity-20 pointer-events-none" />
      <div
        className="absolute pointer-events-none"
        style={{
          inset:      0,
          background: `radial-gradient(ellipse 60% 50% at 50% 50%,
            ${color}18 0%, transparent 70%)`,
        }}
      />

      {/* ── Carta ─────────────────────────────────────────── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width:        340,
          maxWidth:     '100%',
          aspectRatio:  '2/3',
          position:     'relative',
          borderRadius: 16,
          cursor:       'default',
          userSelect:   'none',
          transform:    isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : entered
            ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.85)',
          opacity:      entered ? 1 : 0,
          transition:   isHovered
            ? 'transform 80ms ease-out'
            : 'transform 500ms cubic-bezier(0.34,1.56,0.64,1), opacity 400ms ease',
          boxShadow:    isHovered
            ? `0 30px 80px rgba(0,0,0,0.8),
               0 0 40px ${color}33,
               0 0 80px ${color}18`
            : `0 20px 60px rgba(0,0,0,0.7),
               0 0 20px ${color}18`,
        }}
      >
        {/* ── Background carta ──────────────────────────── */}
        <div
          style={{
            position:     'absolute',
            inset:        0,
            borderRadius: 16,
            background:   `linear-gradient(160deg, #0d1a2a 0%, #07111e 40%, #04090f 100%)`,
            overflow:     'hidden',
          }}
        >
          {/* Pattern hex interno */}
          <div
            className="bg-hex"
            style={{ position: 'absolute', inset: 0, opacity: 0.3 }}
          />

          {/* Gradiente colore rank — angolo in alto a destra */}
          <div
            style={{
              position:      'absolute',
              top:           -60,
              right:         -60,
              width:         240,
              height:        240,
              borderRadius:  '50%',
              background:    `radial-gradient(circle, ${color}30 0%, ${color}10 40%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Gradiente in basso a sinistra */}
          <div
            style={{
              position:      'absolute',
              bottom:        -40,
              left:          -40,
              width:         180,
              height:        180,
              borderRadius:  '50%',
              background:    `radial-gradient(circle, rgba(46,207,255,0.12) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Linee decorative angolari */}
          <svg
            style={{
              position:      'absolute',
              inset:         0,
              width:         '100%',
              height:        '100%',
              pointerEvents: 'none',
              opacity:       0.08,
            }}
            viewBox="0 0 340 510"
          >
            <line x1="340" y1="0"   x2="0"   y2="200" stroke={color} strokeWidth="0.5"/>
            <line x1="340" y1="0"   x2="80"  y2="300" stroke={color} strokeWidth="0.5"/>
            <line x1="340" y1="0"   x2="160" y2="400" stroke={color} strokeWidth="0.5"/>
            <line x1="0"   y1="300" x2="340" y2="300" stroke="#2ecfff" strokeWidth="0.3"/>
            <line x1="0"   y1="380" x2="340" y2="380" stroke="#2ecfff" strokeWidth="0.2"/>
          </svg>
        </div>

        {/* ── Effetto shine olografico ───────────────────── */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            borderRadius:  16,
            background:    isHovered
              ? `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%,
                  rgba(255,255,255,0.12) 0%,
                  rgba(255,255,255,0.04) 30%,
                  transparent 60%)`
              : 'transparent',
            pointerEvents: 'none',
            zIndex:        10,
            transition:    'background 80ms ease',
            mixBlendMode:  'screen',
          }}
        />

        {/* Shine arcobaleno olografico */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            borderRadius:  16,
            background:    isHovered
              ? `linear-gradient(
                  ${105 + tilt.y * 3}deg,
                  transparent 0%,
                  rgba(255,0,128,0.04)  20%,
                  rgba(255,165,0,0.04)  30%,
                  rgba(0,255,0,0.04)    40%,
                  rgba(0,128,255,0.04)  50%,
                  rgba(128,0,255,0.04)  60%,
                  transparent 80%)`
              : 'transparent',
            pointerEvents: 'none',
            zIndex:        11,
            transition:    'background 100ms ease',
          }}
        />

        {/* ── Bordo carta ───────────────────────────────── */}
        <div
          style={{
            position:      'absolute',
            inset:         0,
            borderRadius:  16,
            border:        `1.5px solid ${color}44`,
            boxShadow:     `inset 0 1px 0 ${color}22, inset 0 0 0 1px rgba(255,255,255,0.04)`,
            pointerEvents: 'none',
            zIndex:        12,
          }}
        />

        {/* ── Barra accent top ──────────────────────────── */}
        <div
          style={{
            position:     'absolute',
            top:          0,
            left:         0,
            right:        0,
            height:       3,
            background:   `linear-gradient(90deg, transparent 0%, ${color} 30%, #2ecfff 70%, transparent 100%)`,
            borderRadius: '16px 16px 0 0',
            zIndex:       13,
          }}
        />

        {/* ── Contenuto ─────────────────────────────────── */}
        <div
          style={{
            position:      'relative',
            zIndex:        5,
            height:        '100%',
            display:       'flex',
            flexDirection: 'column',
            padding:       20,
          }}
        >
          {/* ── Sezione top: Rank + Ruolo ────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

            {/* Rank — protagonista assoluto */}
            <div>
              <div
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      72,
                  fontWeight:    900,
                  lineHeight:    1,
                  color,
                  letterSpacing: '-0.04em',
                  textShadow:    `0 0 30px ${color}88, 0 0 60px ${color}44`,
                }}
              >
                {rankObj.label}
              </div>
              <div
                style={{
                  fontFamily:    'Montserrat, sans-serif',
                  fontSize:      10,
                  fontWeight:    600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color:         color + '88',
                  marginTop:     2,
                }}
              >
                {media > 0 ? `${media} / 100` : 'NESSUN DATO'}
              </div>
            </div>

            {/* Ruolo + categoria */}
            <div style={{ textAlign: 'right' }}>
              {role ? (
                <>
                  <div style={{ fontSize: 32, lineHeight: 1 }}>{role.icon}</div>
                  <div
                    style={{
                      fontFamily:    'Montserrat, sans-serif',
                      fontSize:      11,
                      fontWeight:    900,
                      color:         role.color ?? color,
                      letterSpacing: '0.05em',
                      marginTop:     4,
                    }}
                  >
                    {role.abbr}
                  </div>
                  <div
                    style={{
                      fontFamily:    'Montserrat, sans-serif',
                      fontSize:      8,
                      fontWeight:    600,
                      color:         'var(--text-tertiary)',
                      letterSpacing: '0.1em',
                      marginTop:     2,
                    }}
                  >
                    {role.label.toUpperCase()}
                  </div>
                </>
              ) : categoria ? (
                <>
                  <div
                    style={{
                      fontFamily:    'Montserrat, sans-serif',
                      fontSize:      11,
                      fontWeight:    900,
                      color,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {categoria.label.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontFamily:    'Montserrat, sans-serif',
                      fontSize:      8,
                      fontWeight:    600,
                      color:         'var(--text-tertiary)',
                      letterSpacing: '0.1em',
                      marginTop:     2,
                    }}
                  >
                    CATEGORIA
                  </div>
                </>
              ) : null}

              {/* Livello */}
              <div
                style={{
                  marginTop:    8,
                  padding:      '3px 8px',
                  background:   color + '15',
                  border:       `1px solid ${color}33`,
                  borderRadius: 'var(--radius-sm)',
                  fontFamily:   'Montserrat, sans-serif',
                  fontSize:     10,
                  fontWeight:   900,
                  color,
                  letterSpacing: '0.08em',
                  display:      'inline-block',
                }}
              >
                LV {client.level}
              </div>
            </div>
          </div>

          {/* ── Nome ─────────────────────────────────────── */}
          <div style={{ marginTop: 'auto', marginBottom: 16 }}>
            <div
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      client.name?.length > 12 ? 22 : 28,
                fontWeight:    900,
                color:         'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight:    1.1,
                textTransform: 'uppercase',
                textShadow:    '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              {client.name}
            </div>
            <div
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      9,
                fontWeight:    600,
                letterSpacing: '0.2em',
                color:         color + '88',
                marginTop:     4,
                textTransform: 'uppercase',
              }}
            >
              {client.eta ? `${client.eta} anni · ` : ''}
              {client.sesso === 'M' ? 'Maschile' : client.sesso === 'F' ? 'Femminile' : ''}
            </div>
          </div>

          {/* ── Stats grid 3x2 stile FIFA ─────────────────── */}
          {displayStats.length > 0 && (
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap:                 '1px',
                background:          'rgba(255,255,255,0.04)',
                border:              `1px solid ${color}22`,
                borderRadius:        'var(--radius-lg)',
                overflow:            'hidden',
                marginBottom:        16,
              }}
            >
              {displayStats.map((stat, i) => {
                const label = statLabels[i]
                const val   = client.stats?.[stat] ?? 0
                const isTop = val >= 80

                return (
                  <div
                    key={stat}
                    style={{
                      background:    'rgba(0,0,0,0.3)',
                      padding:       '8px 10px',
                      display:       'flex',
                      flexDirection: 'column',
                      alignItems:    'center',
                      gap:           2,
                      position:      'relative',
                      overflow:      'hidden',
                    }}
                  >
                    {isTop && (
                      <div
                        style={{
                          position:      'absolute',
                          inset:         0,
                          background:    `${color}10`,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily:         'Montserrat, sans-serif',
                        fontSize:           22,
                        fontWeight:         900,
                        color:              isTop ? color : 'var(--text-primary)',
                        lineHeight:         1,
                        letterSpacing:      '-0.02em',
                        textShadow:         isTop ? `0 0 12px ${color}66` : 'none',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {val}
                    </span>
                    <span
                      style={{
                        fontFamily:    'Montserrat, sans-serif',
                        fontSize:      7,
                        fontWeight:    700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color:         isTop ? color + 'aa' : 'var(--text-tertiary)',
                        lineHeight:    1,
                      }}
                    >
                      {label.slice(0, 7)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Pentagon + XP ────────────────────────────── */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

            {/* Pentagon compatto */}
            <div style={{ flexShrink: 0 }}>
              <Pentagon
                stats={client.stats ?? {}}
                statKeys={statKeys}
                statLabels={statLabels}
                color={color}
                size={80}
              />
            </div>

            {/* XP info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height:       4,
                  background:   'rgba(255,255,255,0.08)',
                  borderRadius: 99,
                  overflow:     'hidden',
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    height:       '100%',
                    width:        `${xpPct}%`,
                    background:   `linear-gradient(90deg, ${color}88, ${color})`,
                    borderRadius: 99,
                    boxShadow:    `0 0 8px ${color}66`,
                    transition:   'width 1s var(--ease-standard)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily:    'Montserrat, sans-serif',
                    fontSize:      9,
                    fontWeight:    700,
                    color,
                    letterSpacing: '0.05em',
                  }}
                >
                  {client.xp?.toLocaleString('it')} XP
                </span>
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize:   8,
                    fontWeight: 600,
                    color:      'var(--text-tertiary)',
                  }}
                >
                  {xpPct}%
                </span>
              </div>
              <div
                style={{
                  marginTop:  4,
                  fontFamily: 'Inter, sans-serif',
                  fontSize:   10,
                  color:      'var(--text-tertiary)',
                  lineHeight: 1.3,
                }}
              >
                {client.sessionsPerWeek ?? 3} sessioni
                <span style={{ opacity: 0.6 }}> a settimana</span>
              </div>
            </div>
          </div>

          {/* ── Footer bar ───────────────────────────────── */}
          <div
            style={{
              marginTop:      12,
              paddingTop:     10,
              borderTop:      `1px solid ${color}18`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              className="text-gradient"
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      12,
                fontWeight:    900,
                letterSpacing: '0.05em',
              }}
            >
              RANKEX
            </div>
            <div
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      7,
                fontWeight:    600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'var(--text-tertiary)',
                opacity:       0.5,
              }}
            >
              Athletic Performance
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottone entra ─────────────────────────────────── */}
      <button
        onClick={onEnter}
        className="animate-fade-up"
        style={{
          animationDelay: '400ms',
          padding:        '14px 40px',
          background:     'var(--gradient-primary)',
          border:         'none',
          borderRadius:   'var(--radius-xl)',
          color:          'var(--text-inverse)',
          fontFamily:     'Montserrat, sans-serif',
          fontSize:       12,
          fontWeight:     700,
          letterSpacing:  '0.12em',
          textTransform:  'uppercase',
          cursor:         'pointer',
          transition:     'all var(--duration-fast)',
          boxShadow:      '0 4px 20px rgba(14,196,82,0.25)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,196,82,0.4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,196,82,0.25)'
        }}
      >
        ENTRA NELLA DASHBOARD
      </button>

      {/* Info sotto il bottone */}
      <p
        className="animate-fade-up"
        style={{
          animationDelay: '500ms',
          fontFamily:     'Inter, sans-serif',
          fontSize:       12,
          color:          'var(--text-tertiary)',
          margin:         0,
          textAlign:      'center',
          opacity:        0.6,
        }}
      >
        {client.sessionsPerWeek ?? 3} sessioni/settimana ·{' '}
        {client.campionamenti?.length ?? 0} valutazioni
      </p>
    </div>
  )
}
