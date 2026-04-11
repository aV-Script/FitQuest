import { useState, useCallback } from 'react'

const EMPTY_EXERCISE = { name: '', sets: '', reps: '', restSeconds: '', notes: '' }

/**
 * Form creazione nuova scheda allenamento.
 */
export function WorkoutPlanForm({ clients, onSubmit, onBack }) {
  const [title,      setTitle]      = useState('')
  const [description, setDescription] = useState('')
  const [clientId,   setClientId]   = useState('')
  const [exercises,  setExercises]  = useState([{ ...EMPTY_EXERCISE }])
  const [loading,    setLoading]    = useState(false)
  const [errors,     setErrors]     = useState({})

  const updateExercise = useCallback((index, field, value) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex))
  }, [])

  const addExercise = () => setExercises(prev => [...prev, { ...EMPTY_EXERCISE }])

  const removeExercise = (index) =>
    setExercises(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev)

  const validate = () => {
    const e = {}
    if (!title.trim())    e.title    = 'Il titolo è obbligatorio'
    if (!clientId)        e.clientId = 'Seleziona un cliente'
    if (exercises.every(ex => !ex.name.trim())) e.exercises = 'Aggiungi almeno un esercizio'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || loading) return
    setLoading(true)
    const cleanedExercises = exercises
      .filter(ex => ex.name.trim())
      .map(ex => ({
        name:        ex.name.trim(),
        sets:        ex.sets ? parseInt(ex.sets) : null,
        reps:        ex.reps ? ex.reps.trim() : null,
        restSeconds: ex.restSeconds ? parseInt(ex.restSeconds) : null,
        notes:       ex.notes.trim() || null,
      }))
    await onSubmit({ title: title.trim(), description: description.trim() || null, clientId, exercises: cleanedExercises })
    setLoading(false)
  }

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
        <span className="font-display font-black text-[16px] text-white">Nuova scheda</span>
        <div className="w-20" />
      </div>

      <div className="flex flex-col gap-5">

        {/* Dati principali */}
        <div className="rounded-[4px] p-5 rx-card flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-[11px] tracking-[2px] text-white/40">TITOLO *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Es. Forza + Ipertrofia — Blocco A"
              className="input-base"
            />
            {errors.title && <span className="text-red-400 text-[11px]">{errors.title}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-[11px] tracking-[2px] text-white/40">CLIENTE *</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="input-base"
            >
              <option value="">Seleziona cliente…</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.clientId && <span className="text-red-400 text-[11px]">{errors.clientId}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-display text-[11px] tracking-[2px] text-white/40">DESCRIZIONE</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Note generali sulla scheda…"
              rows={2}
              className="input-base resize-none"
            />
          </div>
        </div>

        {/* Esercizi */}
        <div className="rounded-[4px] p-5 rx-card flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-display text-[11px] tracking-[2px] text-white/40">ESERCIZI</span>
            <button
              onClick={addExercise}
              className="font-display text-[11px] text-green-400 hover:text-green-300 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              + aggiungi
            </button>
          </div>

          {errors.exercises && <span className="text-red-400 text-[11px]">{errors.exercises}</span>}

          {exercises.map((ex, index) => (
            <ExerciseRow
              key={index}
              index={index}
              exercise={ex}
              total={exercises.length}
              onChange={(field, value) => updateExercise(index, field, value)}
              onRemove={() => removeExercise(index)}
            />
          ))}
        </div>

        {/* Azioni */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onBack}
            className="btn btn-ghost text-[12px] px-4 py-2"
          >
            ANNULLA
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary text-[12px] px-6 py-2 disabled:opacity-40"
          >
            {loading ? '…' : 'CREA SCHEDA'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ExerciseRow({ index, exercise, total, onChange, onRemove }) {
  return (
    <div
      className="rounded-[3px] p-3 flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-2">
        <span className="font-display text-[10px] text-white/25 shrink-0 w-5">{index + 1}.</span>
        <input
          type="text"
          value={exercise.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="Nome esercizio"
          className="input-base flex-1 py-1.5 text-[13px]"
        />
        {total > 1 && (
          <button
            onClick={onRemove}
            className="text-white/20 hover:text-red-400 transition-colors text-[12px] bg-transparent border-none cursor-pointer shrink-0"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 pl-7">
        <LabeledInput label="Serie" value={exercise.sets} type="number" placeholder="3" onChange={v => onChange('sets', v)} />
        <LabeledInput label="Rip. / Tempo" value={exercise.reps} placeholder="10 / 30s" onChange={v => onChange('reps', v)} />
        <LabeledInput label="Recupero (s)" value={exercise.restSeconds} type="number" placeholder="90" onChange={v => onChange('restSeconds', v)} />
      </div>

      <div className="pl-7">
        <input
          type="text"
          value={exercise.notes}
          onChange={e => onChange('notes', e.target.value)}
          placeholder="Note (opzionale)"
          className="input-base w-full text-[12px] py-1 text-white/50"
        />
      </div>
    </div>
  )
}

function LabeledInput({ label, value, type = 'text', placeholder, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-[9px] tracking-[1px] text-white/25">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base text-[12px] py-1.5"
      />
    </div>
  )
}
