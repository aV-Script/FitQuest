import { useState, useCallback } from 'react'
import { Modal, Input, Button } from '../ui'

export function AddClientModal({ onClose, onAdd }) {
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed) { setError('Inserisci un nome'); return }
    setLoading(true)
    try {
      await onAdd({ name: trimmed })
      onClose()
    } catch {
      setError('Errore durante il salvataggio. Riprova.')
      setLoading(false)
    }
  }, [name, avatar, onAdd, onClose])

  return (
    <Modal title="Nuovo Cliente" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Nome e Cognome"
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />

        {error && <p className="m-0 text-red-400 font-body text-[13px]">{error}</p>}

        <Button variant="primary" loading={loading} onClick={handleSubmit}>
          AGGIUNGI CLIENTE
        </Button>
      </div>
    </Modal>
  )
}
