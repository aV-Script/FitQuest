import { useState } from 'react'
import { getAuth, updatePassword } from 'firebase/auth'
import { updateUserProfile } from '../../firebase/services'

export default function ChangePasswordScreen({ userId, onDone }) {
  const [form,    setForm]    = useState({ password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (form.password.length < 6)          { setError('La password deve avere almeno 6 caratteri.'); return }
    if (form.password !== form.confirm)    { setError('Le password non coincidono.'); return }
    setLoading(true)
    setError('')
    try {
      const auth = getAuth()
      await updatePassword(auth.currentUser, form.password)
      await updateUserProfile(userId, { mustChangePassword: false })
      onDone()
    } catch (err) {
      setError(err.code === 'auth/requires-recent-login'
        ? 'Sessione scaduta. Rieffettua il login e riprova.'
        : err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0f1f3d 0%, #070b14 60%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display font-black text-[28px] bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            FIT<span className="font-normal">QUEST</span>
          </div>
        </div>

        <div className="bg-white/[.04] border border-white/[.08] rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="text-3xl mb-3">🔑</div>
            <h2 className="font-display text-white text-[18px] m-0 mb-2">Imposta la tua password</h2>
            <p className="font-body text-white/40 text-[13px] m-0">
              Scegli una password sicura per proteggere il tuo account FitQuest.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="text-white/40 text-[11px] font-display tracking-wider mb-1.5">NUOVA PASSWORD</div>
              <input
                type="password"
                placeholder="Minimo 6 caratteri"
                value={form.password}
                onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError('') }}
                className="w-full bg-white/[.06] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-[14px] outline-none focus:border-blue-400/50 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <div className="text-white/40 text-[11px] font-display tracking-wider mb-1.5">CONFERMA PASSWORD</div>
              <input
                type="password"
                placeholder="Ripeti la password"
                value={form.confirm}
                onChange={e => { setForm(p => ({ ...p, confirm: e.target.value })); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-white/[.06] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-[14px] outline-none focus:border-blue-400/50 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 font-body text-[13px]">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl font-display text-[13px] font-bold tracking-widest cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6cc, #8b5cf6cc)', border: '1px solid rgba(99,102,241,0.4)' }}>
              {loading ? 'SALVATAGGIO...' : 'SALVA PASSWORD'}
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 font-body text-[12px] mt-4">
          Questa schermata appare solo al primo accesso.
        </p>
      </div>
    </div>
  )
}
