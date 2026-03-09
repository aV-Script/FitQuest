import { useState, useCallback } from 'react'
import { useClients } from '../../hooks/useClients'
import { useClientSearch } from '../../hooks/useClientSearch'
import { AddClientModal } from '../modals/AddClientModal'
import { Input, Button } from '../ui'
import { RANK_COLORS } from '../../constants'
import { logout } from '../../firebase/services'
import { tokens } from '../ui'

export function TrainerArea({ trainerId }) {
  const { clients, loading, error, handleAddClient, selectClient } = useClients(trainerId)
  const { query, setQuery, filtered } = useClientSearch(clients)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAdd = useCallback(async (formData) => {
    await handleAddClient(formData)
    setShowAddModal(false)
  }, [handleAddClient])

  return (
    <div style={{ padding: '40px 32px', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ margin: '0 0 8px', fontFamily: tokens.fontDisplay, fontSize: 11, color: '#60a5fa', letterSpacing: 3 }}>
            PERSONAL TRAINER DASHBOARD
          </p>
          <h1 style={{ margin: 0, fontFamily: tokens.fontDisplay, fontSize: 28, color: '#fff', fontWeight: 900 }}>
            I Tuoi Clienti
          </h1>
        </div>
        <button
          onClick={logout}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: tokens.muted, fontFamily: tokens.fontBody, fontSize: 13, cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* Search + Add */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Input
          style={{ flex: 1 }}
          placeholder="🔍 Cerca cliente..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Button
          variant="primary"
          style={{ width: 'auto', padding: '10px 20px', whiteSpace: 'nowrap' }}
          onClick={() => setShowAddModal(true)}
        >
          + AGGIUNGI
        </Button>
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: '#f87171', fontFamily: tokens.fontBody, fontSize: 13, marginBottom: 16 }}>
          ⚠️ {error}
        </p>
      )}

      {/* Client list */}
      {loading ? (
        <EmptyState message="Caricamento..." />
      ) : filtered.length === 0 ? (
        <EmptyState message={clients.length === 0 ? 'Nessun cliente. Aggiungine uno! 👆' : 'Nessun risultato.'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(client => (
            <ClientRow key={client.id} client={client} onClick={() => selectClient(client)} />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddClientModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}
    </div>
  )
}

// ─── ClientRow ────────────────────────────────────────────────────────────────
function ClientRow({ client, onClick }) {
  const color = RANK_COLORS[client.rank] ?? '#60a5fa'

  return (
    <button
      onClick={onClick}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = color + '66' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
    >
      <span style={{ fontSize: 36 }}>{client.avatar}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: tokens.fontBody, fontWeight: 700, fontSize: 18, color: '#fff' }}>
          {client.name}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <span style={{ background: color + '22', color, borderRadius: 99, padding: '2px 10px', fontSize: 11, fontFamily: tokens.fontDisplay }}>
            LVL {client.level}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: tokens.fontBody }}>
            {client.rank}
          </span>
        </div>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20 }}>›</span>
    </button>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: tokens.fontBody, padding: 40 }}>
      {message}
    </div>
  )
}
