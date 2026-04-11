import { useState } from 'react'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog'

/**
 * Vista dettaglio scheda allenamento (lato trainer).
 * Mostra gli esercizi — in futuro editabile inline.
 */
export function WorkoutPlanDetail({ plan, client, readonly, onUpdate, onArchive, onDelete, onBack }) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const [showDeleteConfirm,  setShowDeleteConfirm]  = useState(false)
  const [archiving,          setArchiving]          = useState(false)
  const [deleting,           setDeleting]           = useState(false)

  const handleArchive = async () => {
    setArchiving(true)
    await onArchive()
    setArchiving(false)
    setShowArchiveConfirm(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete()
    setDeleting(false)
  }

  const exercises = plan.exercises ?? []
  const isArchived = plan.status === 'archived'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/30 font-body text-[13px] hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          ‹ Schede
        </button>
        {!readonly && (
          <div className="flex gap-2">
            {!isArchived && (
              <button
                onClick={() => setShowArchiveConfirm(true)}
                className="font-display text-[11px] px-3 py-1.5 rounded-[3px] cursor-pointer border transition-all"
                style={{ color: '#f59e0b', borderColor: '#f59e0b44', background: '#f59e0b11' }}
              >
                ARCHIVIA
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="font-display text-[11px] px-3 py-1.5 rounded-[3px] cursor-pointer border transition-all"
              style={{ color: '#f87171', borderColor: '#f8717144', background: '#f8717111' }}
            >
              ELIMINA
            </button>
          </div>
        )}
      </div>

      {/* Info scheda */}
      <div className="rounded-[4px] p-5 rx-card mb-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="font-display font-black text-[20px] text-white m-0">{plan.title}</h2>
            {client && (
              <p className="font-body text-[13px] text-white/40 mt-1 m-0">
                Assegnata a <span className="text-white/60">{client.name}</span>
              </p>
            )}
          </div>
          {isArchived && (
            <span
              className="font-display text-[10px] tracking-[2px] px-2.5 py-1 rounded-[3px] shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ARCHIVIATA
            </span>
          )}
        </div>
        {plan.description && (
          <p className="font-body text-[13px] text-white/50 m-0 leading-relaxed whitespace-pre-wrap">
            {plan.description}
          </p>
        )}
        <p className="font-body text-[11px] text-white/20 mt-3 m-0">
          {exercises.length} {exercises.length === 1 ? 'esercizio' : 'esercizi'} ·
          Creata il {formatDate(plan.createdAt)}
        </p>
      </div>

      {/* Lista esercizi */}
      <div className="flex flex-col gap-3">
        {exercises.map((ex, index) => (
          <ExerciseBlock key={index} index={index} exercise={ex} />
        ))}
      </div>

      {/* Confirm archivio */}
      {showArchiveConfirm && (
        <ConfirmDialog
          title="Archiviare la scheda?"
          description="La scheda verrà spostata nell'archivio. Il cliente non la vedrà più nella propria dashboard."
          confirmLabel="ARCHIVIA"
          loading={archiving}
          onConfirm={handleArchive}
          onCancel={() => setShowArchiveConfirm(false)}
        />
      )}

      {/* Confirm elimina */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Eliminare la scheda?"
          description={`Stai per eliminare "${plan.title}". Questa operazione non è reversibile.`}
          confirmLabel="ELIMINA"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
}

function ExerciseBlock({ index, exercise }) {
  const hasMeta = exercise.sets || exercise.reps || exercise.restSeconds

  return (
    <div
      className="rounded-[4px] p-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start gap-3">
        <span className="font-display text-[13px] font-bold text-white/20 shrink-0 w-6 pt-0.5">
          {index + 1}.
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-display font-bold text-[14px] text-white">{exercise.name}</span>

          {hasMeta && (
            <div className="flex gap-4 mt-2 flex-wrap">
              {exercise.sets && (
                <MetaChip label="Serie" value={exercise.sets} />
              )}
              {exercise.reps && (
                <MetaChip label="Rip. / Tempo" value={exercise.reps} />
              )}
              {exercise.restSeconds && (
                <MetaChip label="Recupero" value={`${exercise.restSeconds}s`} />
              )}
            </div>
          )}

          {exercise.notes && (
            <p className="font-body text-[12px] text-white/40 mt-2 m-0 leading-relaxed">
              {exercise.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function MetaChip({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-[9px] tracking-[1px] text-white/25">{label}</span>
      <span className="font-display font-bold text-[13px] text-white/70">{value}</span>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
}
