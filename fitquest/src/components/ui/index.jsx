import { useEffect } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────
export const tokens = {
  fontDisplay: "'Orbitron', monospace",
  fontBody:    "'Rajdhani', sans-serif",
  glass:       'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(255,255,255,0.07)',
  muted:       'rgba(255,255,255,0.4)',
  subtle:      'rgba(255,255,255,0.08)',
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ style, children }) {
  return (
    <div style={{
      background:   tokens.glass,
      border:       `1px solid ${tokens.glassBorder}`,
      borderRadius: 20,
      padding:      20,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily:    tokens.fontDisplay,
      fontSize:      10,
      color:         'rgba(255,255,255,0.3)',
      letterSpacing: 3,
      marginBottom:  14,
      textTransform: 'uppercase',
    }}>
      {children}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  // Chiudi con ESC
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: 420, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontFamily: tokens.fontDisplay, color: '#fff', fontSize: 16 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: tokens.muted, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ style, ...props }) {
  return (
    <input
      style={{
        width:       '100%',
        background:  'rgba(255,255,255,0.05)',
        border:      '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding:     '10px 14px',
        color:       '#fff',
        fontFamily:  tokens.fontBody,
        fontSize:    15,
        boxSizing:   'border-box',
        outline:     'none',
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ style, ...props }) {
  return (
    <textarea
      style={{
        width:       '100%',
        background:  'rgba(255,255,255,0.05)',
        border:      '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding:     '10px 14px',
        color:       '#fff',
        fontFamily:  tokens.fontBody,
        fontSize:    15,
        boxSizing:   'border-box',
        outline:     'none',
        resize:      'vertical',
        minHeight:   60,
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ variant = 'primary', loading, disabled, style, children, ...props }) {
  const variants = {
    primary:  { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
    danger:   { background: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
    ghost:    { background: 'none', border: '1px solid rgba(255,255,255,0.1)' },
  }

  return (
    <button
      disabled={loading || disabled}
      style={{
        border:        'none',
        borderRadius:  12,
        padding:       '14px',
        color:         '#fff',
        fontFamily:    tokens.fontDisplay,
        fontSize:      13,
        fontWeight:    700,
        letterSpacing: 1,
        cursor:        loading || disabled ? 'not-allowed' : 'pointer',
        opacity:       loading || disabled ? 0.6 : 1,
        width:         '100%',
        transition:    'opacity 0.2s',
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {loading ? 'ATTENDERE...' : children}
    </button>
  )
}

// ─── XPBar ────────────────────────────────────────────────────────────────────
export function XPBar({ xp, xpNext, color }) {
  const pct = Math.min(100, Math.round(((xp ?? 0) / (xpNext ?? 1)) * 100))

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: tokens.fontBody }}>
        <span>XP {xp?.toLocaleString('it-IT')}</span>
        <span>{xpNext?.toLocaleString('it-IT')}</span>
      </div>
      <div style={{ background: tokens.subtle, borderRadius: 99, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}, #fff8)`, borderRadius: 99, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ color, children }) {
  return (
    <span style={{
      background:   color + '22',
      color,
      borderRadius: 99,
      padding:      '2px 12px',
      fontSize:     11,
      fontFamily:   tokens.fontDisplay,
    }}>
      {children}
    </span>
  )
}
