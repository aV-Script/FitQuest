import { useState, useCallback } from 'react'
import { Modal, Input, Button } from '../ui'
import { AVATAR_OPTIONS } from '../../constants'

export function AddClientModal({ onClose, onAdd }) {
  const [name,    setName]    = useState('')
  const [avatar,  setAvatar]  = useState('💪')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

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
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Nome e Cognome"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />

        <div>
          <div className="text-white/40 text-[12px] mb-2 font-body tracking-wider">AVATAR</div>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_OPTIONS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`
                  text-[24px] rounded-xl p-2 cursor-pointer transition-all duration-150 border-2
                  ${avatar === a
                    ? 'bg-blue-400/20 border-blue-400'
                    : 'bg-white/[.05] border-transparent hover:bg-white/10'}
                `}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="m-0 text-red-400 font-body text-[13px]">{error}</p>}

        <Button variant="primary" loading={loading} onClick={handleSubmit}>
          AGGIUNGI CLIENTE
        </Button>
      </div>
    </Modal>
  )
}
