import { useState } from 'react'
import { login, register } from '../firebase/services'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      isRegister ? await register(email, password) : await login(email, password)
    } catch (err) {
      const messages = {
        'auth/user-not-found':       'Utente non trovato',
        'auth/wrong-password':       'Password errata',
        'auth/email-already-in-use': 'Email già registrata',
        'auth/weak-password':        'Password troppo corta (min. 6 caratteri)',
        'auth/invalid-email':        'Email non valida',
        'auth/invalid-credential':   'Credenziali non valide',
      }
      setError(messages[err.code] || 'Errore: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0f1f3d 0%, #070b14 60%)' }}>

      <div className="w-[360px] p-10 bg-white/[.03] border border-white/[.08] rounded-3xl">

        {/* Logo */}
        <div className="text-center mb-9">
          <div className="font-display font-black text-[28px] bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            FIT<span className="font-normal">QUEST</span>
          </div>
          <div className="text-white/30 font-body text-[13px] mt-1.5 tracking-[2px]">
            PERSONAL TRAINER PORTAL
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3.5">
          <input
            className="input-base"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <input
            className="input-base"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          {error && (
            <p className="text-red-400 font-body text-[13px] text-center m-0">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
              bg-gradient-to-br from-blue-500 to-violet-500 border-0 rounded-xl
              py-3.5 text-white font-display text-[13px] font-bold tracking-wider
              transition-opacity duration-200
              ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
            `}
          >
            {loading ? '...' : isRegister ? 'REGISTRATI' : 'ACCEDI'}
          </button>

          <button
            onClick={() => { setIsRegister(!isRegister); setError('') }}
            className="bg-transparent border-none text-white/40 font-body text-[13px] cursor-pointer underline hover:text-white/60 transition-colors"
          >
            {isRegister ? 'Hai già un account? Accedi' : 'Nuovo trainer? Registrati'}
          </button>
        </div>
      </div>
    </div>
  )
}
