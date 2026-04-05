const VARIANT = {
  success: { color: 'var(--green-400)', icon: '✓' },
  error:   { color: '#f05252',          icon: '✕' },
  warning: { color: '#f59e0b',          icon: '!' },
  info:    { color: 'var(--cyan-400)',  icon: 'i' },
}

export function Toast({ toasts, onRemove }) {
  if (toasts.length === 0) return null
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="fixed z-[200] flex flex-col gap-2 pointer-events-none"
      style={{ bottom: '1rem', right: '1rem', left: '1rem', maxWidth: '20rem', marginLeft: 'auto' }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  const v = VARIANT[toast.variant] ?? VARIANT.info
  return (
    <div
      className="toast-in flex items-center gap-3 px-4 py-3 pointer-events-auto"
      style={{
        background:   'var(--bg-overlay)',
        border:       `1px solid ${v.color}22`,
        borderLeft:   `3px solid ${v.color}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow:    'var(--shadow-lg)',
      }}
    >
      <span
        className="shrink-0 font-display font-bold text-[12px]"
        style={{ color: v.color }}
      >
        {v.icon}
      </span>
      <p className="flex-1 font-body text-[13px] m-0 leading-tight" style={{ color: 'var(--text-primary)' }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Chiudi notifica"
        className="bg-transparent border-none cursor-pointer p-0 text-sm leading-none shrink-0"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
      >
        ✕
      </button>
    </div>
  )
}
