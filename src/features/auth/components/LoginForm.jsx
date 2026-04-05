import { useState }  from 'react'
import { Field }    from '../../../components/ui/Field'
import { Button }   from '../../../components/ui/Button'

/**
 * LoginForm — form di accesso.
 *
 * Design:
 * - Label uppercase compatti stile Linear
 * - Input con focus ring verde
 * - Errore inline sotto il campo
 * - Password toggle
 * - Link reset password sottile
 */
export function LoginForm({ onSubmit, onForgot, loading, error }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [touched,  setTouched]  = useState({})

  const emailError    = touched.email    && !email    ? 'Email richiesta' : ''
  const passwordError = touched.password && !password ? 'Password richiesta' : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!email || !password) return
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Email */}
        <Field label="Email" error={emailError}>
          <input
            type="email"
            className="input-base"
            placeholder="nome@esempio.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(p => ({ ...p, email: true }))}
            autoComplete="email"
            autoFocus
            style={emailError ? { borderColor: 'rgba(240,82,82,0.5)' } : {}}
          />
        </Field>

        {/* Password */}
        <Field label="Password" error={passwordError}>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              className="input-base"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => setTouched(p => ({ ...p, password: true }))}
              autoComplete="current-password"
              style={{
                paddingRight: 44,
                ...(passwordError ? { borderColor: 'rgba(240,82,82,0.5)' } : {}),
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              aria-label={showPass ? 'Nascondi password' : 'Mostra password'}
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
                lineHeight: 1,
                transition: 'color var(--duration-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              {showPass ? '👁' : '👁‍🗨'}
            </button>
          </div>
        </Field>

        {/* Link reset password */}
        <div style={{ marginTop: -8, textAlign: 'right' }}>
          <button
            type="button"
            onClick={onForgot}
            style={{
              background: 'transparent',
              border:     'none',
              color:      'var(--text-tertiary)',
              fontSize:   12,
              cursor:     'pointer',
              fontFamily: 'Inter, sans-serif',
              padding:    0,
              transition: 'color var(--duration-fast)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--green-400)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            Password dimenticata?
          </button>
        </div>

        {/* Errore globale */}
        {error && (
          <div
            className="animate-fade-down"
            style={{
              padding:      '12px 16px',
              background:   'rgba(240,82,82,0.08)',
              border:       '1px solid rgba(240,82,82,0.2)',
              borderRadius: 'var(--radius-lg)',
              display:      'flex',
              alignItems:   'center',
              gap:          10,
            }}
          >
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span style={{ fontSize: 13, color: '#f87171', lineHeight: 1.4 }}>
              {error}
            </span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          fullWidth
          style={{ marginTop: 4 }}
        >
          ACCEDI
        </Button>
      </div>
    </form>
  )
}
