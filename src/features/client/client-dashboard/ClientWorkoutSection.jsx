import { useState, useEffect }        from 'react'
import { SectionLabel }              from '../../../components/ui'
import { getWorkoutPlanForClient }   from '../../../firebase/services/workoutPlans'

/**
 * Sezione scheda allenamento nella dashboard cliente.
 * Mostra solo la scheda attiva assegnata a questo cliente (read-only).
 */
export function ClientWorkoutSection({ orgId, clientId, color }) {
  const [plan,    setPlan]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId || !clientId) return
    getWorkoutPlanForClient(orgId, clientId).then(active => {
      setPlan(active)
      setLoading(false)
    })
  }, [orgId, clientId])

  if (loading) return null
  if (!plan)   return null

  const exercises = plan.exercises ?? []

  return (
    <section className="px-6 py-6">
      <div className="rounded-[4px] p-5 rx-card">
        <SectionLabel className="mb-4">◈ Scheda allenamento</SectionLabel>

        <h3 className="font-display font-bold text-[16px] text-white mb-1">{plan.title}</h3>
        {plan.description && (
          <p className="font-body text-[13px] text-white/40 mb-4 m-0 leading-relaxed">
            {plan.description}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {exercises.map((ex, index) => (
            <div
              key={index}
              className="rounded-[3px] p-3 flex items-start gap-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="font-display text-[12px] font-bold shrink-0 w-5 pt-0.5" style={{ color: color + '88' }}>
                {index + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-display font-bold text-[14px] text-white">{ex.name}</span>
                <div className="flex gap-4 mt-1.5 flex-wrap">
                  {ex.sets        && <Chip label="Serie"         value={ex.sets} />}
                  {ex.reps        && <Chip label="Rip. / Tempo"  value={ex.reps} />}
                  {ex.restSeconds && <Chip label="Recupero"      value={`${ex.restSeconds}s`} />}
                </div>
                {ex.notes && (
                  <p className="font-body text-[12px] text-white/35 mt-1.5 m-0">{ex.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Chip({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-[9px] tracking-[1px] text-white/25">{label}</span>
      <span className="font-body text-[12px] text-white/60 font-bold">{value}</span>
    </div>
  )
}
