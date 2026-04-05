import { Field, Input } from '../../../ui'

export function StepAnagrafica({ anagrafica, setAnagrafica, errors }) {
  const update = (key) => (e) =>
    setAnagrafica(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="flex flex-col gap-4">
      <Field label="Nome e cognome" error={errors.name}>
        <Input
          value={anagrafica.name}
          onChange={update('name')}
          placeholder="Mario Rossi"
          autoFocus
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Età" error={errors.eta}>
          <Input
            type="number"
            value={anagrafica.eta}
            onChange={update('eta')}
            placeholder="30"
          />
        </Field>
        <Field label="Sesso">
          <div className="flex gap-2">
            {['M', 'F'].map(s => (
              <button
                key={s}
                onClick={() => setAnagrafica(p => ({ ...p, sesso: s }))}
                className="flex-1 py-2.5 font-display text-[12px] cursor-pointer transition-all"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  ...(anagrafica.sesso === s
                    ? { background: 'rgba(14,196,82,0.12)', borderColor: 'var(--green-400)', color: 'var(--text-primary)' }
                    : { background: 'transparent', borderColor: 'var(--border-default)', color: 'var(--text-tertiary)' }
                  ),
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Peso (kg)" error={errors.peso}>
          <Input type="number" value={anagrafica.peso} onChange={update('peso')} placeholder="70" />
        </Field>
        <Field label="Altezza (cm)" error={errors.altezza}>
          <Input type="number" value={anagrafica.altezza} onChange={update('altezza')} placeholder="175" />
        </Field>
      </div>

      <Field label="Sessioni a settimana" error={errors.sessionsPerWeek}>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setAnagrafica(p => ({ ...p, sessionsPerWeek: n }))}
              className="flex-1 py-2.5 font-display text-[13px] font-bold cursor-pointer transition-all"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                ...(anagrafica.sessionsPerWeek === n
                  ? { background: 'rgba(14,196,82,0.12)', borderColor: 'var(--green-400)', color: 'var(--green-400)' }
                  : { background: 'transparent', borderColor: 'var(--border-default)', color: 'var(--text-tertiary)' }
                ),
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </Field>
    </div>
  )
}
