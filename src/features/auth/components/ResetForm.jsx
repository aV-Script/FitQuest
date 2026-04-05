import { useState }  from 'react'
import { Field }    from '../../../components/ui/Field'
import { Button }   from '../../../components/ui/Button'

export function ResetForm({ onSubmit, onBack, loading, error, success }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    onSubmit({ email })
  }

  if (success) {
    return (
      <div
        className="animate-scale-in flex flex-col items-center text-center gap-4"
        style={{ padding: '8px 0' }}
      >
        <div
          style={{
            width:          56,
            height:         56,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'rgba(14,196,82,0.1)',
            border:         '1px solid rgba(14,196,82,0.2)',
            borderRadius:   'var(--radius-xl)',
            fontSize:       24,
          }}
        >
          ✓
        </div>
        <div>
          <h3
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize:   16,
              fontWeight: 700,
              color:      'var(--text-primary)',
              margin:     '0 0 8px',
            }}
          >
            Email inviata
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0 }}>
            Controlla la tua casella email per il link di reset.
            Potrebbe finire nello spam.
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border:     'none',
            color:      'var(--green-400)',
            fontSize:   13,
            cursor:     'pointer',
            fontFamily: 'Inter, sans-serif',
            marginTop:  8,
          }}
        >
          ← Torna al login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0 }}>
          Inserisci l'email del tuo account. Ti invieremo un link
          per reimpostare la password.
        </p>

        <Field label="Email">
          <input
            type="email"
            className="input-base"
            placeholder="nome@esempio.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
          />
        </Field>

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
          loading={loading}
          fullWidth
        >
          INVIA LINK DI RESET
        </Button>

        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            border:     'none',
            color:      'var(--text-tertiary)',
            fontSize:   13,
            cursor:     'pointer',
            fontFamily: 'Inter, sans-serif',
            textAlign:  'center',
            transition: 'color var(--duration-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          ← Torna al login
        </button>
      </div>
    </form>
  )
}
