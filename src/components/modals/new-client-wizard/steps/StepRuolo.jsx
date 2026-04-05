import { PLAYER_ROLES } from '../../../../config/modules.config'

export function StepRuolo({ ruolo, setRuolo }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-[13px] text-white/40 m-0">
        Seleziona il ruolo del giocatore in campo.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {PLAYER_ROLES.map(r => (
          <button
            key={r.id}
            onClick={() => setRuolo(r.id)}
            className="flex items-center gap-3 p-4 rounded-[4px] cursor-pointer border transition-all text-left"
            style={ruolo === r.id
              ? { background: 'rgba(14,196,82,0.12)', borderColor: 'rgba(14,196,82,0.4)' }
              : { background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }
            }
          >
            <span className="text-[22px]">{r.icon}</span>
            <div>
              <div
                className="font-display font-black text-[13px]"
                style={{ color: ruolo === r.id ? '#0ec452' : 'rgba(255,255,255,0.7)' }}
              >
                {r.label}
              </div>
              <div className="font-display text-[10px] tracking-widest mt-0.5"
                style={{ color: ruolo === r.id ? 'rgba(14,196,82,0.6)' : 'rgba(255,255,255,0.2)' }}>
                {r.abbr}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
