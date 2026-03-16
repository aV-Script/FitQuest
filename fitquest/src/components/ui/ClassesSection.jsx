import { BASE_CLASSES, SPECS } from '../../constants'

/**
 * Mostra classi base e SPEC sbloccate dal cliente.
 * Usato in ClientDashboard (trainer) e ClientView (cliente).
 *
 * Props:
 *   classes  — array { id, unlockedAt }
 *   specs    — array { id, unlockedAt }
 */
export function ClassesSection({ classes = [], specs = [] }) {
  if (classes.length === 0 && specs.length === 0) {
    return (
      <p className="font-body text-[13px] text-white/20">
        Nessuna classe sbloccata ancora. Migliora le statistiche per sbloccare le classi base.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {classes.length > 0 && (
        <div>
          <p className="font-display text-[10px] text-white/30 tracking-[3px] mb-2">CLASSI BASE</p>
          <div className="flex flex-wrap gap-2">
            {classes.map(({ id }) => {
              const def = BASE_CLASSES.find(c => c.id === id)
              if (!def) return null
              return <ClassPill key={id} name={def.name} color={def.color} type="class" />
            })}
          </div>
        </div>
      )}

      {specs.length > 0 && (
        <div>
          <p className="font-display text-[10px] text-white/30 tracking-[3px] mb-2">SPECIALIZZAZIONI</p>
          <div className="flex flex-wrap gap-2">
            {specs.map(({ id }) => {
              const def = SPECS.find(s => s.id === id)
              if (!def) return null
              return <ClassPill key={id} name={def.name} color={def.color} type="spec" />
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Pillola singola per classe o SPEC.
 * type="class" → bordo normale
 * type="spec"  → bordo tratteggiato + indicatore SPEC
 */
function ClassPill({ name, color, type }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
      style={{
        background:   color + '15',
        border:       `1px ${type === 'spec' ? 'dashed' : 'solid'} ${color}55`,
        color,
      }}
    >
      {type === 'spec' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )}
      <span className="font-display text-[11px] tracking-[0.5px]">{name}</span>
    </div>
  )
}

/**
 * Versione compatta per le ClientCard nella lista trainer.
 * Mostra max 3 pillole + indicatore overflow.
 */
export function ClassesPillsCompact({ classes = [], specs = [] }) {
  const all = [
    ...classes.map(({ id }) => {
      const def = BASE_CLASSES.find(c => c.id === id)
      return def ? { name: def.name, color: def.color, type: 'class' } : null
    }),
    ...specs.map(({ id }) => {
      const def = SPECS.find(s => s.id === id)
      return def ? { name: def.name, color: def.color, type: 'spec' } : null
    }),
  ].filter(Boolean)

  if (all.length === 0) return null

  const visible  = all.slice(0, 3)
  const overflow = all.length - visible.length

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {visible.map((item, i) => (
        <span
          key={i}
          className="font-display text-[10px] rounded-md px-2 py-0.5"
          style={{
            background:   item.color + '18',
            border:       `1px ${item.type === 'spec' ? 'dashed' : 'solid'} ${item.color}44`,
            color:        item.color,
          }}
        >
          {item.type === 'spec' ? '★ ' : ''}{item.name}
        </span>
      ))}
      {overflow > 0 && (
        <span className="font-display text-[10px] text-white/25">+{overflow}</span>
      )}
    </div>
  )
}
