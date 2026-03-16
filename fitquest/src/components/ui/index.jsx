import { useEffect, useState as _useState } from 'react'
import { getBadgeById } from '../../constants/badges'
import { Pentagon } from './Pentagon'
import { STATS }    from '../../constants/index.js'

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ className = '', children }) {
  return (
    <div className={`bg-white/[.03] border border-white/[.07] rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children, className = '' }) {
  return (
    <div className={`font-display text-[10px] text-white/30 tracking-[3px] uppercase mb-3.5 ${className}`}>
      {children}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
// size: 'default' (420px) | 'lg' (720px) | 'xl' (960px)
const MODAL_WIDTHS = {
  default: 'w-[420px]',
  lg:      'w-[420px] lg:w-[720px]',
  xl:      'w-[420px] lg:w-[960px]',
}

export function Modal({ title, onClose, size = 'default', children }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-start lg:items-center justify-center overflow-y-auto py-4 px-4"
      onClick={onClose}
    >
      <div
        className={`bg-gray-900 border border-white/10 rounded-2xl p-6 lg:p-8 ${MODAL_WIDTHS[size]} max-w-[96vw] my-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-white text-base m-0">{title}</h3>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-white/40 text-xl cursor-pointer leading-none hover:text-white/70 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ className = '', ...props }) {
  return <input className={`input-base ${className}`} {...props} />
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`input-base resize-y min-h-[60px] ${className}`}
      {...props}
    />
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
const VARIANT_CLASSES = {
  primary: 'bg-gradient-to-br from-blue-500 to-violet-500 border-0',
  danger:  'bg-gradient-to-br from-amber-500 to-red-500 border-0',
  ghost:   'bg-transparent border border-white/10',
}

export function Button({ variant = 'primary', loading, disabled, className = '', children, ...props }) {
  return (
    <button
      disabled={loading || disabled}
      className={`
        rounded-xl py-3.5 px-4 text-white font-display text-[13px] font-bold tracking-wider
        cursor-pointer transition-opacity duration-200
        ${loading || disabled ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
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
    <div className="mt-2">
      <div className="flex justify-between text-[11px] text-white/50 mb-1 font-body">
        <span>XP {xp?.toLocaleString('it-IT')}</span>
        <span>{xpNext?.toLocaleString('it-IT')}</span>
      </div>
      <div className="bg-white/[.08] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, #fff8)` }}
        />
      </div>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ color, children }) {
  return (
    <span
      className="rounded-full px-3 py-0.5 text-[11px] font-display"
      style={{ background: color + '22', color }}
    >
      {children}
    </span>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ color }) {
  return (
    <div className="px-6">
      <div
        className="w-full h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}33, transparent)` }}
      />
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────
// Wrapper label + input + messaggio di errore usato in tutti i form/modali
export function Field({ label, error, children }) {
  return (
    <div>
      <div className="text-white/40 text-[11px] font-display tracking-wider mb-1.5">
        {label.toUpperCase()}
      </div>
      {children}
      {error && <p className="m-0 mt-1 text-red-400 font-body text-[12px]">{error}</p>}
    </div>
  )
}

// ─── ActivityLog ──────────────────────────────────────────────────────────────
export function ActivityLog({ log = [], color }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <SectionLabel>◈ Attività recenti</SectionLabel>
      {log.length === 0 && (
        <p className="m-0 font-body text-[13px] text-white/20">Nessuna attività ancora.</p>
      )}
      {log.slice(0, 5).map((entry, i) => (
        <div key={i} className="flex gap-2.5 items-start mb-2.5">
          <div className="flex flex-col items-center pt-1.5 gap-1">
            <div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: color + '88' }} />
            {i < Math.min(log.length, 5) - 1 && (
              <div className="w-px flex-1 min-h-[12px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
          <div className="flex-1 pb-1">
            <div className="font-body text-[13px] text-white/70">{entry.action}</div>
            <div className="flex gap-2 mt-0.5">
              <span className="font-body text-[11px] text-white/20">{entry.date}</span>
              {entry.xp > 0 && (
                <span className="font-display text-[10px] text-emerald-400">+{entry.xp} XP</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── BadgeList ────────────────────────────────────────────────────────────────
export function BadgeList({ badges = [], color }) {
  const [detail, setDetail] = _useState(null)

  const normalized = badges.map(b =>
    typeof b === 'string' ? { id: b, name: b, type: 'cosmetic', unlockedAt: '—' } : b
  )

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <SectionLabel>◈ Badge conquistati</SectionLabel>
      {normalized.length === 0 && (
        <p className="m-0 font-body text-[13px] text-white/20">Nessun badge ancora.</p>
      )}
      <div className="flex flex-wrap gap-2">
        {normalized.map((b, i) => {
          const def   = getBadgeById(b.id)
          const isXP  = b.type === 'progression' || def?.type === 'progression'
          return (
            <button
              key={i}
              onClick={() => setDetail(b)}
              className="font-body text-[12px] rounded-lg px-3 py-1.5 cursor-pointer transition-all border-none"
              style={{
                background: isXP ? 'rgba(52,211,153,0.1)' : color + '11',
                border:     `1px solid ${isXP ? '#34d39933' : color + '33'}`,
                color:      isXP ? '#34d399' : 'rgba(255,255,255,0.7)',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {isXP && <span className="mr-1 text-[10px]">★</span>}
              {b.name}
            </button>
          )
        })}
      </div>

      {/* Modale dettaglio badge */}
      {detail && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4"
          onClick={() => setDetail(null)}>
          <div className="rounded-2xl p-6 max-w-xs w-full"
            style={{ background: '#0f1f3d', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-display font-black text-[18px] text-white m-0">{detail.name}</h3>
              <button onClick={() => setDetail(null)}
                className="bg-transparent border-none text-white/40 text-xl cursor-pointer hover:text-white/70">✕</button>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-[10px] text-white/30 tracking-[2px]">TIPO</span>
                <span className={`font-display text-[11px] px-2 py-0.5 rounded-md ${
                  detail.type === 'progression' ? 'text-emerald-400' : 'text-blue-400'
                }`}
                  style={{ background: detail.type === 'progression' ? '#34d39918' : '#60a5fa18' }}>
                  {detail.type === 'progression' ? 'Progressione' : 'Cosmetic'}
                </span>
              </div>
              {detail.unlockedAt && (
                <div className="flex items-center gap-2">
                  <span className="font-display text-[10px] text-white/30 tracking-[2px]">SBLOCCATO</span>
                  <span className="font-body text-[12px] text-white/60">{detail.unlockedAt}</span>
                </div>
              )}
              {detail.xpAwarded && (
                <div className="flex items-center gap-2">
                  <span className="font-display text-[10px] text-white/30 tracking-[2px]">XP BONUS</span>
                  <span className="font-display text-[12px] text-emerald-400">+{detail.xpAwarded} XP</span>
                </div>
              )}
              {detail.title && (
                <div className="flex items-center gap-2">
                  <span className="font-display text-[10px] text-white/30 tracking-[2px]">TITOLO</span>
                  <span className="font-body text-[12px] text-white/70 italic">"{detail.title}"</span>
                </div>
              )}
            </div>
            <p className="font-body text-[12px] text-white/30 m-0">
              {getBadgeById(detail.id)?.desc ?? 'Badge speciale'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── StatsSection ─────────────────────────────────────────────────────────────
// Sezione Status riusabile: barre statistiche + Pentagon affiancati
// Usato in ClientDashboard (trainer) e ClientView (cliente read-only)
export function StatsSection({ stats = {}, prevStats = null, color, pentagonSize = 130 }) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '3fr 2fr' }}>
      <div className="flex flex-col justify-center gap-3">
        {STATS.map(({ key, label }) => {
          const val   = stats[key] ?? 0
          const prev  = prevStats?.[key] ?? null
          const delta = prev !== null ? val - prev : null
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="font-body text-[12px] text-white/50 w-20 shrink-0">{label}</span>
              <div
                className="flex-1 h-[5px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${val}%`, background: color }}
                />
              </div>
              <span
                className="font-display text-[12px] w-7 text-right tabular-nums"
                style={{ color }}
              >
                {val}
              </span>
              {delta !== null && (
                <span
                  className="font-display text-[10px] w-8 text-right tabular-nums"
                  style={{ color: delta > 0 ? '#34d399' : delta < 0 ? '#f87171' : 'rgba(255,255,255,0.2)' }}
                >
                  {delta > 0 ? `+${delta}` : delta === 0 ? '—' : delta}
                </span>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-center">
        <Pentagon stats={stats} color={color} size={pentagonSize} />
      </div>
    </div>
  )
}
