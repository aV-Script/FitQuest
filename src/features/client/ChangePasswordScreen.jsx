import { useState }              from 'react'
import { Field }                 from '../../components/ui/Field'
import { Button }                from '../../components/ui/Button'
import { updatePassword }        from 'firebase/auth'
import { auth }                  from '../../firebase/services/auth'
import { updateDoc, doc }        from 'firebase/firestore'
import { db }                    from '../../firebase/services/db'

/**
 * ChangePasswordScreen — cambio password obbligatorio al primo accesso.
 */
export function ChangePasswordScreen({ uid }) {
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [done,     setDone]     = useState(false)

  const passwordError = password && password.length < 6 ? 'Minimo 6 caratteri' : ''
  const confirmError  = confirm  && confirm !== password ? 'Le password non coincidono' : ''
  const canSubmit     = password.length >= 6 && password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      await updatePassword(auth.currentUser, password)
      await updateDoc(doc(db, 'users', uid), { mustChangePassword: false })
      setDone(true)
    } catch {
      setError('Errore durante il cambio password. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--bg-base)',
        padding:        24,
      }}
    >
      {/* Pattern sfondo */}
      <div className="fixed inset-0 bg-hex opacity-30 pointer-events-none" />

      <div className="animate-scale-in relative" style={{ width: '100%', maxWidth: 400 }}>
        <div
          style={{
            background:   'var(--bg-overlay)',
            border:       '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-2xl)',
            padding:      36,
            boxShadow:    'var(--shadow-xl), var(--shadow-green)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div
              style={{
                width:          52,
                height:         52,
                margin:         '0 auto 16px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     'rgba(14,196,82,0.1)',
                border:         '1px solid rgba(14,196,82,0.2)',
                borderRadius:   'var(--radius-xl)',
                fontSize:       22,
              }}
            >
              🔐
            </div>
            <h2
              style={{
                fontFamily:    'Montserrat, sans-serif',
                fontSize:      20,
                fontWeight:    800,
                color:         'var(--text-primary)',
                margin:        '0 0 8px',
                letterSpacing: '-0.01em',
              }}
            >
              Imposta la tua password
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.5 }}>
              È il tuo primo accesso. Scegli una password sicura per proteggere il tuo account.
            </p>
          </div>

          {done ? (
            <div className="animate-scale-in text-center">
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Password aggiornata. Stai per essere reindirizzato...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                <Field label="Nuova password" error={passwordError}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input-base"
                      placeholder="Minimo 6 caratteri"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoFocus
                      style={passwordError ? { borderColor: 'rgba(240,82,82,0.5)' } : {}}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      style={{
                        position:   'absolute',
                        right:      12,
                        top:        '50%',
                        transform:  'translateY(-50%)',
                        background: 'transparent',
                        border:     'none',
                        cursor:     'pointer',
                        color:      'var(--text-tertiary)',
                        fontSize:   14,
                        padding:    4,
                      }}
                    >
                      {showPass ? '👁' : '👁‍🗨'}
                    </button>
                  </div>
                </Field>

                <Field label="Conferma password" error={confirmError}>
                  <input
                    type="password"
                    className="input-base"
                    placeholder="Ripeti la password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    style={confirmError ? { borderColor: 'rgba(240,82,82,0.5)' } : {}}
                  />
                </Field>

                {/* Strength indicator */}
                {password.length > 0 && (
                  <PasswordStrength password={password} />
                )}

                {error && (
                  <div
                    style={{
                      padding:      '10px 14px',
                      background:   'rgba(240,82,82,0.08)',
                      border:       '1px solid rgba(240,82,82,0.2)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize:     13,
                      color:        '#f87171',
                    }}
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={!canSubmit}
                  fullWidth
                >
                  SALVA PASSWORD
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Branding sottile */}
        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize:  11,
            color:     'var(--text-tertiary)',
            opacity:   0.5,
          }}
        >
          RankEX — Connessione sicura
        </p>
      </div>
    </div>
  )
}

export default ChangePasswordScreen

function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ caratteri',      pass: password.length >= 6 },
    { label: 'Numero',            pass: /\d/.test(password) },
    { label: 'Lettera maiuscola', pass: /[A-Z]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length

  const colors = ['#f05252', '#f5a623', '#0ec452']
  const labels = ['Debole', 'Media', 'Forte']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Barre */}
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              flex:         1,
              height:       3,
              borderRadius: 99,
              background:   i < score ? colors[score - 1] : 'var(--border-default)',
              transition:   'background var(--duration-normal)',
            }}
          />
        ))}
      </div>
      {/* Label + checks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize:   11,
            color:      score > 0 ? colors[score - 1] : 'var(--text-tertiary)',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
          }}
        >
          {score > 0 ? labels[score - 1] : 'Inserisci la password'}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {checks.map((c, i) => (
            <span
              key={i}
              style={{
                fontSize:   10,
                color:      c.pass ? '#0ec452' : 'var(--text-tertiary)',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'color var(--duration-fast)',
              }}
            >
              {c.pass ? '✓ ' : '· '}{c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
