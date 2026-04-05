import { useEffect } from 'react'

/**
 * Modal — dialog con backdrop blur, header, body scrollabile e footer.
 *
 * size: sm | default | lg | xl | full
 * subtitle: testo descrittivo sotto il titolo
 * footer: JSX renderizzato nel footer sticky
 * disableOverlayClose: impedisce chiusura cliccando il backdrop
 */
export function Modal({
  title,
  subtitle,
  onClose,
  disableOverlayClose = false,
  size     = 'default',
  children,
  footer,
}) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const widths = {
    sm:      '380px',
    default: '480px',
    lg:      '680px',
    xl:      '900px',
    full:    'calc(100vw - 48px)',
  }

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{
        background:           'rgba(7,9,14,0.8)',
        backdropFilter:       'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex:               'var(--z-modal, 400)',
      }}
      onClick={disableOverlayClose ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full animate-scale-in"
        style={{
          maxWidth:      widths[size],
          background:    'var(--bg-overlay)',
          border:        '1px solid var(--border-strong)',
          borderRadius:  'var(--radius-2xl)',
          boxShadow:     'var(--shadow-xl), inset 0 1px 0 rgba(255,255,255,0.04)',
          overflow:      'hidden',
          maxHeight:     'calc(100vh - 48px)',
          display:       'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display:        'flex',
            alignItems:     'flex-start',
            justifyContent: 'space-between',
            padding:        '24px 24px 0',
            gap:            16,
            flexShrink:     0,
          }}
        >
          <div>
            <h3
              id="modal-title"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize:   16,
                fontWeight: 700,
                color:      'var(--text-primary)',
                margin:     0,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  fontSize:   13,
                  color:      'var(--text-tertiary)',
                  margin:     '4px 0 0',
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Chiudi"
            style={{
              width:          32,
              height:         32,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              background:     'transparent',
              border:         '1px solid var(--border-default)',
              borderRadius:   'var(--radius-md)',
              color:          'var(--text-tertiary)',
              cursor:         'pointer',
              fontSize:       14,
              transition:     'all var(--duration-fast)',
              flexShrink:     0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.color       = 'var(--text-primary)'
              e.currentTarget.style.background  = 'var(--border-subtle)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color       = 'var(--text-tertiary)'
              e.currentTarget.style.background  = 'transparent'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding:   '24px',
            overflowY: 'auto',
            flex:      1,
          }}
        >
          {children}
        </div>

        {/* Footer opzionale */}
        {footer && (
          <div
            style={{
              padding:        '16px 24px',
              borderTop:      '1px solid var(--border-subtle)',
              display:        'flex',
              gap:            10,
              justifyContent: 'flex-end',
              flexShrink:     0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
