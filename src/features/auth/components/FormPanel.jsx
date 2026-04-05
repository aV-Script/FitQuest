import { useState }        from 'react'
import { LoginForm }       from './LoginForm'
import { ResetForm }       from './ResetForm'
import { resetPassword }   from '../../../firebase/services/auth'

/**
 * FormPanel — lato destro della login page.
 * Gestisce il toggle tra login e reset password.
 */
export function FormPanel({ onLogin, loading, error }) {
  const [mode,         setMode]         = useState('login')
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetError,   setResetError]   = useState(null)
  const [resetLoading, setResetLoading] = useState(false)

  const handleReset = async ({ email }) => {
    setResetLoading(true)
    setResetError(null)
    try {
      await resetPassword(email)
      setResetSuccess(true)
    } catch {
      setResetError('Email non trovata. Verifica e riprova.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div
      className="flex flex-col justify-center"
      style={{
        background: 'var(--bg-subtle)',
        padding:    '48px 40px',
        minHeight:  '100%',
      }}
    >
      <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>

        {/* Logo mobile */}
        <div className="lg:hidden animate-fade-down" style={{ marginBottom: 40 }}>
          <div
            className="text-gradient"
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      32,
              fontWeight:    900,
              letterSpacing: '-0.03em',
              lineHeight:    1,
            }}
          >
            RankEX
          </div>
          <div
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      9,
              fontWeight:    600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color:         'var(--text-tertiary)',
              marginTop:     6,
            }}
          >
            Youth Soccer Project
          </div>
        </div>

        {/* Titolo form */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      22,
              fontWeight:    800,
              color:         'var(--text-primary)',
              margin:        '0 0 6px',
              letterSpacing: '-0.01em',
            }}
          >
            {mode === 'login' ? 'Bentornato' : 'Reset password'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.5 }}>
            {mode === 'login'
              ? 'Accedi al tuo account per continuare'
              : 'Ti invieremo le istruzioni via email'
            }
          </p>
        </div>

        {/* Form */}
        <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
          {mode === 'login' ? (
            <LoginForm
              onSubmit={onLogin}
              onForgot={() => setMode('reset')}
              loading={loading}
              error={error}
            />
          ) : (
            <ResetForm
              onSubmit={handleReset}
              onBack={() => { setMode('login'); setResetSuccess(false); setResetError(null) }}
              loading={resetLoading}
              error={resetError}
              success={resetSuccess}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="animate-fade-up"
          style={{
            marginTop:      40,
            animationDelay: '160ms',
            paddingTop:     24,
            borderTop:      '1px solid var(--border-subtle)',
          }}
        >
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', opacity: 0.6 }}>
            Problemi di accesso? Contatta il tuo amministratore.
          </p>
        </div>
      </div>
    </div>
  )
}
