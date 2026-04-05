import { useState } from 'react'

const ROLE_OPTIONS = [
  { value: 'trainer',        label: 'Trainer — lettura e scrittura' },
  { value: 'staff_readonly', label: 'Staff — solo lettura' },
  { value: 'org_admin',      label: 'Admin — gestione completa' },
]

export function CreateMemberForm({ onClose, onSave }) {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'trainer' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name     = 'Nome richiesto'
    if (!form.email.trim())       e.email    = 'Email richiesta'
    if (form.password.length < 6) e.password = 'Minimo 6 caratteri'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await onSave(form)
    } catch (err) {
      setErrors({ submit: err.message })
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-black text-[18px] text-white m-0">Nuovo membro del team</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 bg-transparent border-none cursor-pointer text-[20px] leading-none">×</button>
        </div>

        {/* Nome */}
        <div>
          <label className="font-display text-[10px] text-white/30 tracking-[2px] block mb-1.5">NOME COMPLETO</label>
          <input
            className="input-base"
            placeholder="Mario Rossi"
            value={form.name}
            onChange={update('name')}
          />
          {errors.name && <p className="font-body text-[11px] text-red-400 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="font-display text-[10px] text-white/30 tracking-[2px] block mb-1.5">EMAIL</label>
          <input
            type="email"
            className="input-base"
            placeholder="mario@example.com"
            value={form.email}
            onChange={update('email')}
          />
          {errors.email && <p className="font-body text-[11px] text-red-400 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="font-display text-[10px] text-white/30 tracking-[2px] block mb-1.5">PASSWORD TEMPORANEA</label>
          <input
            type="password"
            className="input-base"
            placeholder="Min. 6 caratteri"
            value={form.password}
            onChange={update('password')}
          />
          {errors.password && <p className="font-body text-[11px] text-red-400 mt-1">{errors.password}</p>}
        </div>

        {/* Ruolo */}
        <div>
          <label className="font-display text-[10px] text-white/30 tracking-[2px] block mb-1.5">RUOLO</label>
          <div className="flex flex-col gap-2">
            {ROLE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(p => ({ ...p, role: opt.value }))}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border text-left transition-all"
                style={form.role === opt.value
                  ? { background: 'rgba(96,165,250,0.1)', borderColor: 'rgba(96,165,250,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border-strong)' }
                }
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: form.role === opt.value ? '#60a5fa' : 'rgba(255,255,255,0.2)' }}
                />
                <span
                  className="font-body text-[13px]"
                  style={{ color: form.role === opt.value ? '#fff' : 'rgba(255,255,255,0.5)' }}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {errors.submit && <p className="font-body text-[12px] text-red-400 m-0">{errors.submit}</p>}

        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}
        >
          <p className="font-body text-[12px] text-blue-300/70 m-0">
            Il membro dovrà cambiare la password al primo accesso.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-xl py-3 font-display text-[12px] tracking-widest text-white cursor-pointer border-0 hover:opacity-85 disabled:opacity-50 transition-opacity"
          style={{ background: 'var(--gradient-primary)' }}
        >
          {loading ? 'CREAZIONE...' : 'CREA MEMBRO'}
        </button>
      </div>
    </div>
  )
}
