import { CATEGORIE, getTestsForCategoria } from '../../../../constants'

const VISIBLE = CATEGORIE.filter(c => !c.hidden)

export function StepCategoria({ categoria, setCategoria }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-[13px] text-white/40 m-0">
        La categoria determina i 5 test somministrati al cliente.
      </p>

      {VISIBLE.map(cat => (
        <button
          key={cat.id}
          onClick={() => setCategoria(cat.id)}
          className="flex items-start gap-4 p-4 cursor-pointer border transition-all text-left"
          style={{ borderRadius: 'var(--radius-lg)', ...(categoria === cat.id
            ? { background: cat.color + '15', borderColor: cat.color + '55' }
            : { background: 'var(--bg-raised)', borderColor: 'var(--border-default)' }
          ) }}
        >
          <div
            className="w-3 h-3 rounded-full mt-1 shrink-0"
            style={{ background: categoria === cat.id ? cat.color : 'var(--border-strong)' }}
          />
          <div>
            <div
              className="font-display font-black text-[14px]"
              style={{ color: categoria === cat.id ? cat.color : 'var(--text-secondary)' }}
            >
              {cat.label}
            </div>
            <div className="font-body text-[12px] text-white/40 mt-0.5">{cat.desc}</div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {getTestsForCategoria(cat.id).map(t => (
                <span
                  key={t.key}
                  className="font-display text-[9px] px-2 py-0.5 rounded-md"
                  style={{ background: cat.color + '18', color: cat.color + 'cc' }}
                >
                  {t.test}
                </span>
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}