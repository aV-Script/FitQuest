/**
 * Tab della barra di navigazione mobile.
 * Indicatore attivo: linea verde/ciano sotto la tab.
 */
export function TabItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
      className="flex-1 flex flex-col items-center gap-1 py-2.5 cursor-pointer transition-all relative border-none bg-transparent"
    >
      {active && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8"
          style={{
            background:   'var(--gradient-primary)',
            borderRadius: '1px',
            boxShadow:    '0 0 8px rgba(14,196,82,0.5)',
          }}
        />
      )}
      <span style={{ color: active ? 'var(--green-400)' : 'var(--text-tertiary)' }}>
        {item.icon}
      </span>
      <span
        className="font-display text-[9px] tracking-[0.5px]"
        style={{ color: active ? 'var(--green-400)' : 'var(--text-tertiary)' }}
      >
        {item.label.toUpperCase()}
      </span>
    </button>
  )
}
