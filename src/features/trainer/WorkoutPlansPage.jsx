import { useState, useCallback }  from 'react'
import { useReadonly }             from '../../context/ReadonlyContext'
import { useWorkoutPlans }         from '../../hooks/useWorkoutPlans'
import { WorkoutPlanCard }         from './workout-plans/WorkoutPlanCard'
import { WorkoutPlanDetail }       from './workout-plans/WorkoutPlanDetail'
import { WorkoutPlanForm }         from './workout-plans/WorkoutPlanForm'

export function WorkoutPlansPage({ orgId, clients = [] }) {
  const readonly = useReadonly()
  const { handleAdd, handleUpdate, handleDelete, handleArchive, plans, loading } =
    useWorkoutPlans(orgId)

  const [view,        setView]        = useState('list')  // 'list' | 'detail' | 'new'
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [filterClient, setFilterClient] = useState('tutti')

  const active   = plans.filter(p => p.status === 'active')
  const archived = plans.filter(p => p.status === 'archived')

  const visibleActive = filterClient === 'tutti'
    ? active
    : active.filter(p => p.clientId === filterClient)

  const clientsWithPlans = clients.filter(c => active.some(p => p.clientId === c.id))

  const handleSelect = useCallback((plan) => {
    setSelectedPlan(plan)
    setView('detail')
  }, [])

  const handleCreateSubmit = useCallback(async (data) => {
    const plan = await handleAdd(data)
    setSelectedPlan(plan)
    setView('detail')
  }, [handleAdd])

  const handleUpdateAndSync = useCallback(async (planId, data) => {
    await handleUpdate(planId, data)
    setSelectedPlan(prev => ({ ...prev, ...data }))
  }, [handleUpdate])

  const handleDeleteAndBack = useCallback(async (planId) => {
    await handleDelete(planId)
    setView('list')
    setSelectedPlan(null)
  }, [handleDelete])

  if (view === 'new') {
    return (
      <WorkoutPlanForm
        clients={clients}
        onSubmit={handleCreateSubmit}
        onBack={() => setView('list')}
      />
    )
  }

  if (view === 'detail' && selectedPlan) {
    const client = clients.find(c => c.id === selectedPlan.clientId)
    return (
      <WorkoutPlanDetail
        plan={selectedPlan}
        client={client}
        readonly={readonly}
        onUpdate={(data) => handleUpdateAndSync(selectedPlan.id, data)}
        onArchive={() => handleArchive(selectedPlan.id).then(() => setView('list'))}
        onDelete={() => handleDeleteAndBack(selectedPlan.id)}
        onBack={() => setView('list')}
      />
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[24px] text-white m-0">Schede</h1>
          <p className="font-body text-white/30 text-[13px] m-0 mt-0.5">
            {loading ? '\u00a0' : `${active.length} schede attive`}
          </p>
        </div>
        {!readonly && (
          <button
            onClick={() => setView('new')}
            className="btn btn-primary text-[12px] px-4 py-2"
          >
            + NUOVA SCHEDA
          </button>
        )}
      </div>

      {/* Filtro cliente */}
      {clientsWithPlans.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <FilterPill active={filterClient === 'tutti'} onClick={() => setFilterClient('tutti')}>
            Tutti
          </FilterPill>
          {clientsWithPlans.map(c => (
            <FilterPill
              key={c.id}
              active={filterClient === c.id}
              onClick={() => setFilterClient(c.id)}
            >
              {c.name}
            </FilterPill>
          ))}
        </div>
      )}

      {/* Lista schede attive */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-[4px] skeleton" />
          ))}
        </div>
      ) : visibleActive.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-body text-white/20 text-[15px]">
            {active.length === 0
              ? 'Nessuna scheda. Creane una per i tuoi clienti.'
              : 'Nessuna scheda per questo cliente.'}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleActive.map(plan => {
            const client = clients.find(c => c.id === plan.clientId)
            return (
              <WorkoutPlanCard
                key={plan.id}
                plan={plan}
                clientName={client?.name ?? '—'}
                onClick={() => handleSelect(plan)}
              />
            )
          })}
        </div>
      )}

      {/* Archivio collassabile */}
      {archived.length > 0 && <ArchivedSection archived={archived} clients={clients} onSelect={handleSelect} />}
    </div>
  )
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full font-body text-[12px] cursor-pointer border transition-all"
      style={active
        ? { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }
        : { background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }
      }
    >
      {children}
    </button>
  )
}

function ArchivedSection({ archived, clients, onSelect }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 font-display text-[11px] tracking-[2px] text-white/30 hover:text-white/50 transition-colors cursor-pointer bg-transparent border-none p-0 mb-3"
      >
        <span>{open ? '▾' : '▸'}</span>
        ARCHIVIO ({archived.length})
      </button>
      {open && (
        <div className="flex flex-col gap-3">
          {archived.map(plan => {
            const client = clients.find(c => c.id === plan.clientId)
            return (
              <WorkoutPlanCard
                key={plan.id}
                plan={plan}
                clientName={client?.name ?? '—'}
                onClick={() => onSelect(plan)}
                archived
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
