import { useState, useCallback }        from 'react'
import { useAuth }                       from '../auth/useAuth'
import { logout, changeTrainerPassword } from '../../firebase/services/auth'
import { Field }                         from '../../components/ui'
import { getFirebaseErrorMessage }       from '../../utils/firebaseErrors'
import { validatePassword }              from '../../utils/validation'

export function ProfilePage() {
  const { user } = useAuth()
  const [open,    setOpen]    = useState(false)
  const [form,    setForm]    = useState({ current: '', password: '', confirm: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    setErrors(p => ({ ...p, [key]: undefined, general: undefined }))
    setSuccess(false)
  }

  const validate = useCallback(() => {
    const e = {}
    if (!form.current)                       e.current  = 'Password attuale obbligatoria'
    const pwCheck = validatePassword(form.password)
    if (!pwCheck.valid)                      e.password = pwCheck.error
    if (form.password !== form.confirm)      e.confirm  = 'Le password non coincidono'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const handleSubmit = useCallback(async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await changeTrainerPassword(form.current, form.password)
      setSuccess(true)
      setForm({ current: '', password: '', confirm: '' })
      setOpen(false)
    } catch (err) {
      const msg = getFirebaseErrorMessage(err, 'Impossibile aggiornare la password')
      // wrong-password → errore sul campo password attuale
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }, [form, validate])

  return (
    <div className="px-6 py-8 max-w-lg">
      <p className="hidden lg:block font-display text-[10px] text-white/30 tracking-[3px] mb-6">
        PROFILO TRAINER
      </p>

      {/* Card account */}
      <div className="rounded-[4px] p-5 mb-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[4px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(15,214,90,0.06)', border: '1px solid rgba(15,214,90,0.15)' }}>
            <span className="rx-glow-text font-display font-black text-[22px]">
              {user?.email?.[0]?.toUpperCase() ?? 'T'}
            </span>
          </div>
          <div>
            <div className="font-display font-black text-[16px] text-white">Trainer</div>
            <div className="font-body text-[13px] text-white/40 mt-0.5">{user?.email ?? '—'}</div>
          </div>
        </div>
      </div>

      {/* Lista azioni */}
      <div className="rounded-[4px] overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Email */}
        <div className="px-5 py-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="font-display text-[10px] text-white/30 tracking-[2px] mb-1">ACCOUNT</div>
          <div className="font-body text-[13px] text-white/60">{user?.email}</div>
        </div>

        <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Cambio password — toggle */}
        <button
          onClick={() => { setOpen(o => !o); setErrors({}); setSuccess(false) }}
          className="w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-all text-left border-none bg-transparent"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(200,212,224,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span className="font-body text-[13px] text-white/60">Cambia password</span>
          </div>
          {success
            ? <span className="font-display text-[10px] tracking-wider" style={{ color: '#0fd65a' }}>AGGIORNATA</span>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
          }
        </button>

        {/* Form inline */}
        {open && (
          <div className="px-5 pb-5 flex flex-col gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

            <div className="pt-4 flex flex-col gap-3">
              <Field label="Password attuale" error={errors.current} htmlFor="pw-current">
                <input
                  id="pw-current"
                  type="password"
                  placeholder="••••••••"
                  value={form.current}
                  onChange={set('current')}
                  className="input-base"
                  autoComplete="current-password"
                />
              </Field>

              <Field label="Nuova password" error={errors.password} htmlFor="pw-new">
                <input
                  id="pw-new"
                  type="password"
                  placeholder="Minimo 8 caratteri e un numero"
                  value={form.password}
                  onChange={set('password')}
                  className="input-base"
                  autoComplete="new-password"
                />
              </Field>

              <Field label="Conferma nuova password" error={errors.confirm} htmlFor="pw-confirm">
                <input
                  id="pw-confirm"
                  type="password"
                  placeholder="Ripeti la nuova password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  className="input-base"
                  autoComplete="new-password"
                />
              </Field>

              {errors.general && (
                <p className="font-body text-[12px] text-red-400 m-0">{errors.general}</p>
              )}

              {/* Requisiti */}
              <div className="flex flex-col gap-1">
                {[
                  ['Almeno 8 caratteri e un numero', form.password.length >= 8 && /[0-9]/.test(form.password)],
                  ['Le password coincidono',         form.password.length > 0  && form.password === form.confirm],
                ].map(([label, ok]) => (
                  <div key={label}
                    className="flex items-center gap-2 font-body text-[12px]"
                    style={{ color: ok ? '#0fd65a' : 'rgba(255,255,255,0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      {ok
                        ? <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        : <circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
                      }
                    </svg>
                    {label}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => { setOpen(false); setErrors({}) }}
                  className="flex-1 py-2.5 font-display text-[12px] cursor-pointer bg-transparent text-white/40 hover:text-white/60 transition-colors border-none"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}
                >
                  ANNULLA
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2.5 font-display text-[12px] font-bold cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-50 border-none"
                  style={{ background: 'linear-gradient(135deg, #1aff6e, #0fd65a, #00c8ff)', borderRadius: '3px', color: '#080c12' }}
                >
                  {loading ? 'SALVATAGGIO...' : 'AGGIORNA'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer transition-all text-left border-none bg-transparent"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="font-body text-[13px] text-red-400">Logout</span>
        </button>
      </div>
    </div>
  )
}
