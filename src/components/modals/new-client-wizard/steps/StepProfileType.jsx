import { PROFILE_CATEGORIES } from '../../../../constants/bia'

export function StepProfileType({ profileType, setProfileType }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-[13px] text-white/40 m-0">
        Scegli il tipo di valutazione per questo cliente.
        Potrai sempre aggiornarlo in seguito.
      </p>

      {PROFILE_CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => setProfileType(cat.id)}
          className="flex items-start gap-4 p-4 cursor-pointer border transition-all text-left"
          style={{ borderRadius: 'var(--radius-lg)', ...(profileType === cat.id
            ? { background: cat.color + '12', borderColor: cat.color + '44' }
            : { background: 'var(--bg-raised)', borderColor: 'var(--border-default)' }
          ) }}
        >
          {/* Indicatore selezione */}
          <div
            className="w-3 h-3 rounded-full mt-1.5 shrink-0"
            style={{ background: profileType === cat.id ? cat.color : 'var(--border-strong)' }}
          />
          <div className="flex-1">
            <div
              className="font-display font-black text-[14px] mb-1"
              style={{ color: profileType === cat.id ? cat.color : 'var(--text-secondary)' }}
            >
              {cat.label}
            </div>
            <div className="font-body text-[12px] text-white/40">
              {cat.desc}
            </div>
            <div className="flex gap-2 mt-2">
              {cat.hasTests && (
                <span
                  className="font-display text-[9px] px-2 py-0.5 rounded-[2px]"
                  style={{ background: cat.color + '18', color: cat.color + 'cc' }}
                >
                  TEST ATLETICI
                </span>
              )}
              {cat.hasBia && (
                <span
                  className="font-display text-[9px] px-2 py-0.5 rounded-[2px]"
                  style={{ background: cat.color + '18', color: cat.color + 'cc' }}
                >
                  BIOIMPEDENZIOMETRIA
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
