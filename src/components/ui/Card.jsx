/**
 * Card — contenitore con elevation.
 *
 * Ispirazione: Linear card system.
 * Ogni card ha un livello di elevation che ne determina
 * sfondo, bordo e ombra.
 *
 * accent:
 *   'green'  → bordo/glow verde brand
 *   'cyan'   → bordo/glow ciano brand
 *   'amber'  → bordo/glow warning
 *   'red'    → bordo/glow error
 *
 * elevation:
 *   1 → surface (default)
 *   2 → raised (card su card)
 *   3 → floating (dropdown/overlay)
 */
export function Card({
  children,
  accent,
  elevation   = 1,
  interactive = false,
  padding     = 'md',
  className   = '',
  onClick,
  style,
}) {
  const backgrounds = {
    1: 'linear-gradient(135deg, #0c1219 0%, #0f1e2e 100%)',
    2: 'linear-gradient(135deg, #0f1820 0%, #132030 100%)',
    3: '#1a2638',
  }

  const borders = {
    green: 'rgba(14,196,82,0.18)',
    cyan:  'rgba(46,207,255,0.18)',
    amber: 'rgba(245,166,35,0.18)',
    red:   'rgba(240,82,82,0.18)',
  }

  const glows = {
    green: '0 0 20px rgba(14,196,82,0.08)',
    cyan:  '0 0 20px rgba(46,207,255,0.08)',
    amber: '0 0 20px rgba(245,166,35,0.08)',
    red:   '0 0 20px rgba(240,82,82,0.08)',
  }

  const paddings = {
    none: '0',
    xs:   '12px',
    sm:   '16px',
    md:   '20px',
    lg:   '24px',
    xl:   '28px',
  }

  const shadows = {
    1: 'var(--shadow-md)',
    2: 'var(--shadow-lg)',
    3: 'var(--shadow-xl)',
  }

  return (
    <div
      className={[
        interactive ? 'card-interactive' : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      style={{
        background:   backgrounds[elevation],
        border:       `1px solid ${accent ? borders[accent] : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-xl)',
        padding:      paddings[padding],
        boxShadow:    [
          shadows[elevation],
          'inset 0 1px 0 rgba(255,255,255,0.04)',
          accent ? glows[accent] : '',
        ].filter(Boolean).join(', '),
        transition:   'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * CardHeader — header standardizzato per le Card.
 * Contiene label + azione opzionale.
 */
export function CardHeader({ label, action, children }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ marginBottom: 16 }}
    >
      <div className="flex items-center gap-2">
        {label && (
          <span className="type-caption" style={{ color: 'var(--text-tertiary)' }}>
            {label}
          </span>
        )}
        {children}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="type-caption"
          style={{
            background:   'transparent',
            border:       'none',
            color:        'var(--text-tertiary)',
            cursor:       'pointer',
            padding:      '4px 8px',
            borderRadius: 'var(--radius-md)',
            transition:   'color var(--duration-fast), background var(--duration-fast)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color      = 'var(--text-primary)'
            e.currentTarget.style.background = 'var(--border-subtle)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color      = 'var(--text-tertiary)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

/**
 * CardDivider — separatore interno alle card.
 */
export function CardDivider({ accent }) {
  return (
    <div
      style={{
        height:     1,
        margin:     '16px -20px',
        background: accent
          ? `linear-gradient(90deg, transparent, ${accent}22, transparent)`
          : 'var(--border-subtle)',
      }}
    />
  )
}
