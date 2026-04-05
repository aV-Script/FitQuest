import { forwardRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

/**
 * Button — componente base per tutte le azioni.
 *
 * Varianti:
 *   primary  → gradiente brand — azione principale
 *   ghost    → outline — azione secondaria
 *   danger   → rosso — azioni distruttive
 *   subtle   → sfondo sottile — azioni terziarie
 *
 * Sizes:
 *   sm → 32px  md → 40px  lg → 48px  xl → 56px
 */
export const Button = forwardRef(({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth,
  className = '',
  children,
  ...props
}, ref) => {

  const isDisabled = loading || disabled

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      {/* Shimmer effect al hover — solo primary */}
      {variant === 'primary' && (
        <span
          aria-hidden
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
            transform:  'translateX(-100%)',
            transition: 'transform 600ms var(--ease-standard)',
          }}
          className="shimmer"
        />
      )}

      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size={size === 'sm' ? 12 : 14} />
          <span>Attendere...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span className="shrink-0" style={{ fontSize: size === 'sm' ? 14 : 16 }}>{icon}</span>}
          {children}
          {iconRight && <span className="shrink-0" style={{ fontSize: size === 'sm' ? 14 : 16 }}>{iconRight}</span>}
        </span>
      )}
    </button>
  )
})

Button.displayName = 'Button'
