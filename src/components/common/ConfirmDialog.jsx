import { useEffect }       from 'react'
import { LoadingSpinner }  from '../ui/LoadingSpinner'

/**
 * ConfirmDialog — dialog di conferma standardizzato.
 *
 * Ispirazione: Linear confirm dialogs — compact, chiari,
 * con focus sul rischio dell'azione.
 *
 * destructive: true → bottone rosso (per eliminazioni)
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel  = 'CONFERMA',
  cancelLabel   = 'ANNULLA',
  destructive   = false,
  loading       = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        background:           'rgba(7,9,14,0.85)',
        backdropFilter:       'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex:               450,
      }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="animate-scale-in w-full"
        style={{
          maxWidth:     360,
          background:   'var(--bg-overlay)',
          border:       '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-2xl)',
          padding:      24,
          boxShadow:    'var(--shadow-xl)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <div
            style={{
              width:          36,
              height:         36,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              background:     destructive ? 'rgba(240,82,82,0.1)' : 'rgba(14,196,82,0.1)',
              border:         `1px solid ${destructive ? 'rgba(240,82,82,0.2)' : 'rgba(14,196,82,0.2)'}`,
              borderRadius:   'var(--radius-lg)',
              flexShrink:     0,
              fontSize:       16,
            }}
          >
            {destructive ? '⚠️' : '✓'}
          </div>
          <div>
            <h3
              id="confirm-dialog-title"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize:   15,
                fontWeight: 700,
                color:      'var(--text-primary)',
                margin:     0,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
            {description && (
              <p
                style={{
                  fontSize:   13,
                  color:      'var(--text-tertiary)',
                  margin:     '6px 0 0',
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding:       '8px 16px',
              background:    'transparent',
              border:        '1px solid var(--border-default)',
              borderRadius:  'var(--radius-lg)',
              color:         'var(--text-secondary)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor:        'pointer',
              transition:    'all var(--duration-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.color       = 'var(--text-primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color       = 'var(--text-secondary)'
            }}
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding:       '8px 16px',
              background:    destructive
                ? 'linear-gradient(135deg, #f5a623, #f05252)'
                : 'var(--gradient-primary)',
              border:        'none',
              borderRadius:  'var(--radius-lg)',
              color:         destructive ? '#fff' : 'var(--text-inverse)',
              fontFamily:    'Montserrat, sans-serif',
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor:        loading ? 'not-allowed' : 'pointer',
              opacity:       loading ? 0.6 : 1,
              display:       'flex',
              alignItems:    'center',
              gap:           8,
              transition:    'opacity var(--duration-fast)',
            }}
          >
            {loading && <LoadingSpinner size={12} />}
            {loading ? 'Attendere...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
