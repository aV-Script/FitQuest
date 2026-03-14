import { useState, useCallback } from 'react'
import { Modal, Textarea, Button } from '../ui'
import { STATS } from '../../constants'

const ZERO_DELTAS = Object.fromEntries(STATS.map(s => [s.key, 0]))

export function LevelUpModal({ client, onClose, onLevelUp }) {
  const [deltas,  setDeltas]  = useState(ZERO_DELTAS)
  const [note,    setNote]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const setDelta = useCallback((key, value) => {
    setDeltas(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleConfirm = useCallback(async () => {
    setLoading(true)
    try {
      await onLevelUp(deltas, note.trim())
      onClose()
    } catch {
      setError('Errore durante il salvataggio. Riprova.')
      setLoading(false)
    }
  }, [deltas, note, onLevelUp, onClose])

  return (
    <Modal title={`⬆️ Aggiorna — ${client.name}`} onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <p className="m-0 text-white/50 text-[13px] font-body">
          Modifica i parametri per aggiornare il progresso del cliente.
        </p>

        {STATS.map(({ key, icon, label }) => (
          <StatSlider
            key={key}
            icon={icon}
            label={label}
            currentValue={client.stats[key]}
            delta={deltas[key]}
            onChange={v => setDelta(key, v)}
          />
        ))}

        <Textarea
          placeholder="Note sessione (opzionale)..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        {error && <p className="m-0 text-red-400 font-body text-[13px]">{error}</p>}

        <Button variant="danger" loading={loading} onClick={handleConfirm}>
           CONFERMA AGGIORNAMENTO
        </Button>
      </div>
    </Modal>
  )
}

function StatSlider({ icon, label, currentValue, delta, onChange }) {
  const deltaColorClass =
    delta > 0 ? 'text-emerald-300' :
    delta < 0 ? 'text-red-400'     :
    'text-white/30'

  return (
    <div className="flex items-center gap-3">
      <span className="w-[110px] text-white/60 text-[13px] font-body">
        {label}
      </span>
      <span className="w-7 text-white text-[13px] font-display text-right">
        {currentValue}
      </span>
      <input
        type="range"
        min={-10}
        max={20}
        value={delta}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className={`w-10 text-right font-display text-[12px] ${deltaColorClass}`}>
        {delta > 0 ? `+${delta}` : delta}
      </span>
    </div>
  )
}
