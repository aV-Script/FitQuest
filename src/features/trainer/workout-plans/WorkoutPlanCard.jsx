/**
 * Card scheda allenamento nella lista.
 */
export function WorkoutPlanCard({ plan, clientName, onClick, archived = false }) {
  const exerciseCount = plan.exercises?.length ?? 0

  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-[4px] p-4 cursor-pointer transition-all duration-200 flex items-center gap-4 group rx-card"
      style={archived ? { opacity: 0.5 } : {}}
      onMouseEnter={e => {
        e.currentTarget.style.background  = 'rgba(15,214,90,0.04)'
        e.currentTarget.style.borderColor = 'rgba(15,214,90,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = ''
        e.currentTarget.style.borderColor = ''
      }}
    >
      {/* Icona */}
      <div
        className="w-10 h-10 rounded-[3px] flex items-center justify-center shrink-0"
        style={{ background: 'rgba(15,214,90,0.08)', border: '1px solid rgba(15,214,90,0.2)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0fd65a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[15px] text-white truncate">{plan.title}</div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="font-body text-[12px] text-white/40">{clientName}</span>
          <span className="font-body text-[11px] text-white/25">
            {exerciseCount} {exerciseCount === 1 ? 'esercizio' : 'esercizi'}
          </span>
          {archived && (
            <span className="font-display text-[10px] tracking-[1px] text-white/30">ARCHIVIATO</span>
          )}
        </div>
      </div>

      <span className="text-white/20 text-[16px] group-hover:text-white/50 transition-colors shrink-0">›</span>
    </button>
  )
}
