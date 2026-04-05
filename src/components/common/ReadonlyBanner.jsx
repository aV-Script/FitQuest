import { useReadonly } from '../../context/ReadonlyContext'

export function ReadonlyBanner() {
  const readonly = useReadonly()
  if (!readonly) return null

  return (
    <div
      className="flex items-center gap-3 px-6 py-2.5 shrink-0"
      style={{
        background:   'rgba(245,158,11,0.08)',
        borderBottom: '1px solid rgba(245,158,11,0.2)',
      }}
    >
      <span className="text-[14px]">👁️</span>
      <span
        className="font-display text-[11px] tracking-[1px]"
        style={{ color: '#f5a623' }}
      >
        MODALITÀ SOLA LETTURA — puoi visualizzare ma non modificare i dati
      </span>
    </div>
  )
}
