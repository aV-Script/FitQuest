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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: "'Rajdhani', sans-serif" }}>
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

        {error && (
          <p style={{ margin: 0, color: '#f87171', fontFamily: "'Rajdhani', sans-serif", fontSize: 13 }}>
            {error}
          </p>
        )}

        <Button variant="danger" loading={loading} onClick={handleConfirm}>
          🚀 CONFERMA AGGIORNAMENTO
        </Button>
      </div>
    </Modal>
  )
}

// ─── StatSlider ───────────────────────────────────────────────────────────────
function StatSlider({ icon, label, currentValue, delta, onChange }) {
  const deltaColor =
    delta > 0  ? '#6ee7b7' :
    delta < 0  ? '#f87171' :
    'rgba(255,255,255,0.3)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 110, color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: "'Rajdhani', sans-serif" }}>
        {icon} {label}
      </span>
      <span style={{ width: 28, color: '#fff', fontSize: 13, fontFamily: "'Orbitron', monospace", textAlign: 'right' }}>
        {currentValue}
      </span>
      <input
        type="range"
        min={-10}
        max={20}
        value={delta}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: '#60a5fa' }}
      />
      <span style={{ width: 40, textAlign: 'right', color: deltaColor, fontFamily: "'Orbitron', monospace", fontSize: 12 }}>
        {delta > 0 ? `+${delta}` : delta}
      </span>
    </div>
  )
}
