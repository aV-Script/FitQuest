/**
 * Field — wrapper per input con label, hint ed errore.
 * Ispirazione: Linear form fields — clean, senza rumore.
 */
export function Field({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontFamily:    'Montserrat, sans-serif',
            fontSize:      10,
            fontWeight:    600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         error ? '#f05252' : 'var(--text-tertiary)',
            display:       'flex',
            gap:           4,
          }}
        >
          {label}
          {required && (
            <span style={{ color: '#f05252' }}>*</span>
          )}
        </label>
      )}

      <div
        style={{
          position: 'relative',
          ...(error ? {
            borderRadius: 'var(--radius-lg)',
            boxShadow:   '0 0 0 2px rgba(240,82,82,0.15)',
          } : {}),
        }}
      >
        {children}
      </div>

      {(hint || error) && (
        <span
          style={{
            fontSize:   11,
            color:      error ? '#f05252' : 'var(--text-tertiary)',
            lineHeight: 1.4,
          }}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  )
}

/**
 * InputGroup — input con icon prefix o suffix.
 */
export function InputGroup({ prefix, suffix, children }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {prefix && (
        <span
          style={{
            position:      'absolute',
            left:          12,
            color:         'var(--text-tertiary)',
            fontSize:      14,
            pointerEvents: 'none',
            zIndex:        1,
          }}
        >
          {prefix}
        </span>
      )}
      <div
        style={{
          flex:           1,
          ...(prefix ? { '--input-pl': '36px' } : {}),
          ...(suffix ? { '--input-pr': '36px' } : {}),
        }}
      >
        {children}
      </div>
      {suffix && (
        <span
          style={{
            position:      'absolute',
            right:         12,
            color:         'var(--text-tertiary)',
            fontSize:      14,
            pointerEvents: 'none',
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}
