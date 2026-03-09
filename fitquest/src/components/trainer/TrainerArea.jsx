import { useState, useCallback } from 'react'
import { useClients } from '../../hooks/useClients'
import { useClientSearch } from '../../hooks/useClientSearch'
import { AddClientModal } from '../modals/AddClientModal'
import { Input, Button } from '../ui'
import { RANK_COLORS } from '../../constants'
import { logout } from '../../firebase/services'

export function TrainerArea({ trainerId }) {
  const { clients, loading, error, handleAddClient, selectClient } = useClients(trainerId)
  const { query, setQuery, filtered } = useClientSearch(clients)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAdd = useCallback(async (formData) => {
    await handleAddClient(formData)
    setShowAddModal(false)
  }, [handleAddClient])

  return (
    <div className="px-8 py-10 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="font-display text-[11px] text-blue-400 tracking-[3px] m-0 mb-2">
            PERSONAL TRAINER DASHBOARD
          </p>
          <h1 className="font-display text-[28px] text-white font-black m-0">
            I Tuoi Clienti
          </h1>
        </div>
        <button
          onClick={logout}
          className="bg-transparent border border-white/10 rounded-xl px-4 py-2 text-white/40 font-body text-[13px] cursor-pointer hover:text-white/60 hover:border-white/20 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Search + Add */}
      <div className="grid grid-cols-[1fr_auto] gap-3 mb-6">
        <Input
          placeholder="🔍 Cerca cliente..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Button
          variant="primary"
          className="px-5 whitespace-nowrap"
          onClick={() => setShowAddModal(true)}
        >
          + AGGIUNGI
        </Button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 font-body text-[13px] mb-4">⚠️ {error}</p>
      )}

      {/* List */}
      {loading ? (
        <EmptyState message="Caricamento..." />
      ) : filtered.length === 0 ? (
        <EmptyState message={clients.length === 0 ? 'Nessun cliente. Aggiungine uno! 👆' : 'Nessun risultato.'} />
      ) : (
        <div className="flex flex-col gap-3">
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

function ClientRow({ client, onClick }) {
  const color = RANK_COLORS[client.rank] ?? '#60a5fa'

  return (
    <button
      onClick={onClick}
      className="bg-white/[.03] border border-white/[.07] rounded-2xl px-5 py-4 cursor-pointer flex items-center gap-4 text-left w-full transition-all duration-200 hover:bg-white/[.07] group"
      style={{ '--hover-border': color + '66' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + '66'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <span className="text-[36px]">{client.avatar}</span>
      <div className="flex-1">
        <div className="font-body font-bold text-[18px] text-white">{client.name}</div>
        <div className="flex gap-2.5 mt-1">
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-display" style={{ background: color + '22', color }}>
            LVL {client.level}
          </span>
          <span className="text-white/40 text-[12px] font-body">{client.rank}</span>
        </div>
      </div>
      <span className="text-white/20 text-[20px]">›</span>
    </button>
  )
}

function EmptyState({ message }) {
  return (
    <div className="text-center text-white/30 font-body py-10">{message}</div>
  )
}
