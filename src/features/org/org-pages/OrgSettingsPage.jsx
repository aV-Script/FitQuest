import { useState, useCallback }  from 'react'
import { updateOrg }              from '../../../firebase/services/org'
import { MODULES, TERMINOLOGIES } from '../../../config/modules.config'

export function OrgSettingsPage({ org }) {
  const [name,   setName]   = useState(org.name ?? '')
  const [variant, setVariant] = useState(org.terminologyVariant ?? 'personal_training')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const mod      = MODULES[org.moduleType]
  const variants = mod?.terminologyVariants ?? ['personal_training']

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await updateOrg(org.id, { name, terminologyVariant: variant })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }, [org.id, name, variant])

  return (
    <div className="text-white">
      <div className="flex items-center px-6 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <h1 className="font-display font-black text-[20px] text-white m-0">Impostazioni</h1>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Nome organizzazione */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
        >
          <div className="font-display text-[10px] text-white/30 tracking-[2px] mb-4">ORGANIZZAZIONE</div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="font-display text-[10px] text-white/30 block mb-1.5">NOME</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-base"
              />
            </div>
            <div>
              <label className="font-display text-[10px] text-white/30 block mb-1.5">MODULO</label>
              <div
                className="px-4 py-3 rounded-xl font-display text-[13px]"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
              >
                {mod?.label ?? org.moduleType} — non modificabile
              </div>
            </div>
          </div>
        </section>

        {/* Variante terminologia */}
        {variants.length > 1 && (
          <section
            className="rounded-2xl p-5"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
          >
            <div className="font-display text-[10px] text-white/30 tracking-[2px] mb-4">TERMINOLOGIA</div>
            <div className="flex flex-col gap-2">
              {variants.map(v => {
                const term = TERMINOLOGIES[v]
                return (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer border text-left transition-all"
                    style={variant === v
                      ? { background: 'rgba(96,165,250,0.1)', borderColor: 'rgba(96,165,250,0.3)' }
                      : { background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }
                    }
                  >
                    <div>
                      <div
                        className="font-display text-[13px]"
                        style={{ color: variant === v ? '#fff' : 'rgba(255,255,255,0.6)' }}
                      >
                        {term.appName}
                      </div>
                      <div className="font-body text-[11px] text-white/30 mt-0.5">
                        {term.manager} / {term.member} / {term.group}
                      </div>
                    </div>
                    {variant === v && (
                      <span className="font-display text-[10px] text-blue-400">ATTIVA</span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl py-3 font-display text-[12px] tracking-widest text-white cursor-pointer border-0 hover:opacity-85 disabled:opacity-50 transition-opacity"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {saved ? '✓ SALVATO' : saving ? 'SALVATAGGIO...' : 'SALVA MODIFICHE'}
        </button>
      </div>
    </div>
  )
}
