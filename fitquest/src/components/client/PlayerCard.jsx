import { useState } from 'react'
import { Pentagon }    from '../ui/Pentagon'
import { RankRing }    from '../ui/RankRing'
import { STATS, SPECS, BASE_CLASSES } from '../../constants'
import { useClientRank } from '../../hooks/useClientRank'

export function PlayerCard({ client, onEnter }) {
  const { rankObj, color } = useClientRank(client)
  const xpPct = client.xpNext > 0 ? Math.round((client.xp / client.xpNext) * 100) : 0
  const [flipped, setFlipped] = useState(false)

  const hasSpecs = (client.specs ?? []).length > 0 || (client.classes ?? []).length > 0

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0f1f3d 0%, #070b14 60%)' }}
    >
      {/* Card con flip */}
      <div style={{ width: 340, height: 520, perspective: '1000px' }}>
        <div style={{
          width: '100%', height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* ── FRONTE ── */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: '#0a1628',
            border: `1px solid ${color}33`,
            borderRadius: 20,
            boxShadow: `0 0 60px ${color}22`,
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color, borderRadius: '20px 20px 0 0' }} />

            <div style={{ padding: '20px 20px 0' }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
                FITQUEST · PROFILO
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 900, fontSize: 26, color: '#fff', lineHeight: 1.1 }}>
                {client.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color, background: color + '22', border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 8px' }}>
                  LVL {client.level}
                </span>
                {client.categoria && (
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '2px 8px' }}>
                    {client.categoria}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 16px 8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                {STATS.map(({ key, label }) => {
                  const val = client.stats?.[key] ?? 0
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 60, flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${val}%`, background: color + 'cc', borderRadius: 99 }} />
                      </div>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color, width: 20, textAlign: 'right' }}>{val}</span>
                    </div>
                  )
                })}
              </div>
              <Pentagon stats={client.stats} color={color} size={110} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '4px 20px 12px' }}>
              <RankRing rankObj={rankObj} xp={client.xp} xpNext={client.xpNext} size={100} />
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>EXP</span>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color }}>
                    {client.xp?.toLocaleString()} / {client.xpNext?.toLocaleString()}
                  </span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${xpPct}%`, background: color, borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>

            {/* Indicatore flip se ci sono classi/SPEC */}
            {hasSpecs && (
              <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 8, color: color + '88', letterSpacing: '0.1em' }}>CLASSI</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color + '88'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontFamily: "'Rajdhani', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.3em' }}>
              FITQUEST
            </div>
          </div>

          {/* ── RETRO: Classi e SPEC ── */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#0a1628',
            border: `1px solid ${color}33`,
            borderRadius: 20,
            boxShadow: `0 0 60px ${color}22`,
            overflow: 'hidden',
            padding: '20px',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color, borderRadius: '20px 20px 0 0' }} />

            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4, marginTop: 8 }}>
              FITQUEST · CLASSI
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 900, fontSize: 22, color: '#fff', marginBottom: 16 }}>
              {client.name}
            </div>

            {/* Classi base */}
            {(client.classes ?? []).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 8 }}>CLASSI BASE</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(client.classes ?? []).map(({ id }) => {
                    const def = BASE_CLASSES.find(c => c.id === id)
                    if (!def) return null
                    return (
                      <span key={id} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700, color: def.color, background: def.color + '18', border: `1px solid ${def.color}44`, borderRadius: 6, padding: '3px 10px' }}>
                        {def.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SPEC */}
            {(client.specs ?? []).length > 0 && (
              <div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 8 }}>SPECIALIZZAZIONI</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(client.specs ?? []).map(({ id, unlockedAt }) => {
                    const def = SPECS.find(s => s.id === id)
                    if (!def) return null
                    return (
                      <div key={id} style={{ background: def.color + '10', border: `1px dashed ${def.color}44`, borderRadius: 10, padding: '8px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 900, color: def.color }}>
                            ★ {def.name}
                          </span>
                          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                            {unlockedAt}
                          </span>
                        </div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                          {def.archetype}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {!hasSpecs && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: "'Rajdhani', sans-serif", fontSize: 13, marginTop: 40 }}>
                Nessuna classe sbloccata ancora.
              </div>
            )}

            <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontFamily: "'Rajdhani', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.3em' }}>
              FITQUEST
            </div>
          </div>
        </div>
      </div>

      {/* Bottoni sotto la card */}
      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        {hasSpecs && (
          <button
            onClick={() => setFlipped(f => !f)}
            style={{
              background: 'transparent',
              border: `1px solid ${color}44`,
              borderRadius: 12, padding: '8px 20px',
              color: color + 'aa',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 11, letterSpacing: '0.2em',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color + '88'; e.currentTarget.style.color = color }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = color + '44'; e.currentTarget.style.color = color + 'aa' }}
          >
            {flipped ? '← PROFILO' : 'CLASSI →'}
          </button>
        )}
        <button
          onClick={onEnter}
          style={{
            background: 'transparent',
            border: `1px solid ${color}55`,
            borderRadius: 12, padding: '8px 28px',
            color, fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13, letterSpacing: '0.2em',
            cursor: 'pointer', transition: 'background 0.2s', textTransform: 'uppercase',
          }}
          onMouseEnter={e => e.currentTarget.style.background = color + '22'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ENTRA NELLA DASHBOARD
        </button>
      </div>
    </div>
  )
}
