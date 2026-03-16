import { useMemo } from 'react'
import { getSuggestedSpecs, SPECS } from '../../constants'

/**
 * Mostra le SPEC vicine allo sblocco (max gap 20 punti per requisito).
 * Non appare se tutte le SPEC sono già sbloccate o se nessuna è raggiungibile.
 */
export function SpecSuggestions({ stats = {}, unlockedSpecs = [] }) {
  const unlockedIds  = unlockedSpecs.map(s => s.id)
  const suggestions  = useMemo(() =>
    getSuggestedSpecs(stats, 20).filter(s => !unlockedIds.includes(s.id)),
    [stats, unlockedIds]
  )

  if (suggestions.length === 0) return null

  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="font-display text-[10px] text-white/30 tracking-[3px] uppercase mb-4">
        ◈ SPEC vicine allo sblocco
      </div>

      <div className="flex flex-col gap-3">
        {suggestions.map(spec => {
          const def = SPECS.find(s => s.id === spec.id)
          if (!def) return null
          return (
            <div key={spec.id}
              className="rounded-xl p-4"
              style={{ background: def.color + '0a', border: `1px solid ${def.color}22` }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="font-display font-black text-[13px]" style={{ color: def.color }}>
                    {def.name}
                  </span>
                  <span className="font-body text-[11px] text-white/30 ml-2">{def.archetype}</span>
                </div>
                <span className="font-display text-[10px] text-white/25 shrink-0">
                  {spec.gaps.length} requisit{spec.gaps.length === 1 ? 'o' : 'i'} mancant{spec.gaps.length === 1 ? 'e' : 'i'}
                </span>
              </div>

              {/* Gap per ogni requisito non soddisfatto */}
              <div className="flex flex-col gap-1.5">
                {spec.gaps.map(({ stat, missing }) => {
                  const current  = stats[stat] ?? 0
                  const required = current + missing
                  const pct      = Math.round((current / required) * 100)
                  const LABELS   = { forza: 'Forza', mobilita: 'Mobilità', equilibrio: 'Equilibrio',
                                     esplosivita: 'Esplosività', resistenza: 'Resistenza' }
                  return (
                    <div key={stat}>
                      <div className="flex justify-between mb-1">
                        <span className="font-body text-[11px] text-white/50">{LABELS[stat] ?? stat}</span>
                        <span className="font-display text-[10px]" style={{ color: def.color }}>
                          {current} / {required} <span className="text-white/30">(mancano {missing})</span>
                        </span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${pct}%`, background: def.color + 'aa' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
