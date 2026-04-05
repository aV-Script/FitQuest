/**
 * Icona della sidebar desktop con tooltip al hover.
 * Stili attivi/hover via inline style con palette Rank EX ufficiale.
 */
export function SidebarIcon({ item, active, onClick }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        data-active={active}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        className="w-10 h-10 flex items-center justify-center cursor-pointer transition-all"
        style={active ? {
          background:   'rgba(14,196,82,0.1)',
          border:       '1px solid rgba(14,196,82,0.35)',
          borderRadius: 'var(--radius-sm)',
          color:        'var(--green-400)',
          boxShadow:    '0 0 12px rgba(14,196,82,0.15)',
        } : {
          background:   'transparent',
          border:       '1px solid transparent',
          borderRadius: 'var(--radius-sm)',
          color:        'var(--text-tertiary)',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.borderColor = 'rgba(14,196,82,0.2)'
            e.currentTarget.style.color       = 'var(--green-400)'
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.color       = 'var(--text-tertiary)'
          }
        }}
      >
        {item.icon}
      </button>

      {/* Tooltip */}
      <div className="
        absolute left-[52px] top-1/2 -translate-y-1/2
        pointer-events-none opacity-0 group-hover:opacity-100
        transition-opacity duration-150 z-50
        px-2.5 py-1.5 whitespace-nowrap
      "
        style={{
          background:   'var(--bg-overlay)',
          border:       '1px solid rgba(14,196,82,0.2)',
          borderRadius: 'var(--radius-sm)',
          boxShadow:    'var(--shadow-lg)',
        }}
      >
        <span className="font-display text-[10px] tracking-[2px]"
          style={{ color: 'var(--green-400)' }}>
          {item.label.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
