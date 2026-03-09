import { useState, useCallback } from 'react'
import { Modal, Input, Button } from '../ui'
import { AVATAR_OPTIONS } from '../../constants'

export function AddClientModal({ onClose, onAdd }) {
  const [name,   setName]   = useState('')
  const [avatar, setAvatar] = useState('💪')
  const [loading, setLoading] = useState(false)
  const [error,   setError]  = useState('')

  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed) { setError('Inserisci un nome'); return }

    setLoading(true)
    try {
      await onAdd({ name: trimmed, avatar })
      onClose()
    } catch {
      setError('Errore durante il salvataggio. Riprova.')
      setLoading(false)
    }
  }, [name, avatar, onAdd, onClose])

  return (
    <Modal title="➕ Nuovo Cliente" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          placeholder="Nome e Cognome"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />

        <div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8, fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1 }}>
            AVATAR
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {AVATAR_OPTIONS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                style={{
                  fontSize:   24,
                  background: avatar === a ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.05)',
                  border:     `2px solid ${avatar === a ? '#60a5fa' : 'transparent'}`,
                  borderRadius: 10,
                  padding:    8,
                  cursor:     'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ margin: 0, color: '#f87171', fontFamily: "'Rajdhani', sans-serif", fontSize: 13 }}>
            {error}
          </p>
        )}

        <Button variant="primary" loading={loading} onClick={handleSubmit}>
          AGGIUNGI CLIENTE
        </Button>
      </div>
    </Modal>
  )
}
